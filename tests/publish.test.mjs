import { describe, it, expect, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import {
  parseRef,
  preflight,
  collectPayload,
  releaseNotes,
  buildRelease,
  CONSUMER_FILES,
  EXCLUDED_FROM_PAYLOAD,
} from '../tooling/publish.mjs'
import { artifactUrl } from '../tooling/lib/release-url.mjs'

const TMP_ROOT = 'temp/_test_publish_root'

afterEach(() => {
  rmSync(TMP_ROOT, { recursive: true, force: true })
})

const sha = (s) => createHash('sha256').update(s).digest('hex')

// Write a complete, publishable kit folder with real (tiny) artifact bytes.
function writeKit(id, {
  version = '1.0.0',
  license = 'MIT',
  verified = true,
  artifactBytes = `bytes-of-${id}`,
  artifactSha, // override to force a mismatch
  withLicense = true,
  withInstruction = true,
  url, // override to force a mismatch
  omitUrl = false,
} = {}) {
  const dir = join(TMP_ROOT, id)
  mkdirSync(join(dir, 'artifacts'), { recursive: true })
  writeFileSync(join(dir, 'artifacts', `${id}.whl`), artifactBytes)

  const file = `artifacts/${id}.whl`
  const artifact = { file, sha256: artifactSha ?? sha(artifactBytes) }
  if (!omitUrl) artifact.url = url ?? artifactUrl(id, version, file)
  const kit = {
    id, version, runtime: 'pyodide',
    tags: ['util'], tier: 'library', verified,
    provenance: { source: 'pypi', repo: 'https://example.com', ref: `v${version}`, license },
    artifacts: [artifact],
    dependencies: [],
  }
  writeFileSync(join(dir, 'kit.json'), JSON.stringify(kit, null, '\t') + '\n')
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(
    { kit: id, mode: 'loose', imports: [id], golden: { code: `import ${id}`, expect: 'ok' } }, null, '\t') + '\n')
  // recipe.json is factory-only — present in the folder, must NOT ship.
  writeFileSync(join(dir, 'recipe.json'), JSON.stringify(
    { kit: id, track: 'pypi-vendor', source: { url: 'u', sha256: sha(artifactBytes) } }, null, '\t') + '\n')
  if (withInstruction) writeFileSync(join(dir, 'instruction.md'), `# ${id}\n`)
  if (withLicense) writeFileSync(join(dir, 'LICENSE'), 'MIT License\n')
  return dir
}

describe('parseRef', () => {
  it('splits <id>@<version>', () => {
    expect(parseRef('numpy@2.2.5')).toEqual({ id: 'numpy', version: '2.2.5' })
  })
  it('handles hyphenated ids', () => {
    expect(parseRef('scikit-learn@1.5.0')).toEqual({ id: 'scikit-learn', version: '1.5.0' })
  })
  it('throws on a malformed ref', () => {
    expect(() => parseRef('numpy')).toThrow()
    expect(() => parseRef('')).toThrow()
  })
})

describe('collectPayload', () => {
  it('includes the 4 consumer files plus artifacts, and excludes recipe.json', async () => {
    writeKit('mylib')
    const { assets } = await collectPayload('mylib', { root: TMP_ROOT })
    const names = assets.map((a) => a.name)

    for (const f of CONSUMER_FILES) expect(names).toContain(f)
    expect(names).toContain('mylib.whl') // artifact basename
    expect(EXCLUDED_FROM_PAYLOAD).toContain('recipe.json')
    expect(names).not.toContain('recipe.json')
    // No asset path points at recipe.json
    expect(assets.every((a) => !a.path.endsWith('recipe.json'))).toBe(true)
  })

  it('computes the sha256 of every asset', async () => {
    writeKit('mylib', { artifactBytes: 'hello-bytes' })
    const { assets } = await collectPayload('mylib', { root: TMP_ROOT })
    const art = assets.find((a) => a.name === 'mylib.whl')
    expect(art.sha256).toBe(sha('hello-bytes'))
    // every asset carries a 64-hex sha
    expect(assets.every((a) => /^[0-9a-f]{64}$/.test(a.sha256))).toBe(true)
  })

  it('verifies artifact integrity against kit.json (trust the hash, not the tag)', async () => {
    writeKit('drift', { artifactBytes: 'real', artifactSha: '0'.repeat(64) })
    await expect(collectPayload('drift', { root: TMP_ROOT })).rejects.toThrow(/sha256 mismatch/i)
  })

  it('throws when artifact bytes are missing', async () => {
    const dir = writeKit('nobytes')
    rmSync(join(dir, 'artifacts'), { recursive: true, force: true })
    await expect(collectPayload('nobytes', { root: TMP_ROOT })).rejects.toThrow(/artifact/i)
  })
})

describe('preflight', () => {
  it('passes a verified, gated, complete kit', async () => {
    writeKit('good', { version: '2.0.0' })
    const r = await preflight('good', '2.0.0', { root: TMP_ROOT })
    expect(r.ok, JSON.stringify(r.errors)).toBe(true)
  })

  it('fails when verified is false', async () => {
    writeKit('unver', { verified: false })
    const r = await preflight('unver', '1.0.0', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/verif/i)
  })

  it('fails when the tag version does not match kit.json', async () => {
    writeKit('mismatch', { version: '1.0.0' })
    const r = await preflight('mismatch', '9.9.9', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/version/i)
  })

  it('fails when LICENSE is missing', async () => {
    writeKit('nolicense', { withLicense: false })
    const r = await preflight('nolicense', '1.0.0', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/LICENSE/)
  })

  it('fails when the license gate rejects the kit', async () => {
    writeKit('forbidden', { license: 'Proprietary' })
    const r = await preflight('forbidden', '1.0.0', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/license-gate/i)
  })

  it('fails when an artifact has no distribution url', async () => {
    writeKit('nourl', { omitUrl: true })
    const r = await preflight('nourl', '1.0.0', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/url/i)
  })

  it('fails when the stored url does not match the id@version/file it resolves to', async () => {
    writeKit('wrongurl', {
      version: '1.0.0',
      url: 'https://github.com/IharKharytanovich/foundation-kids/releases/download/wrongurl@9.9.9/wrongurl.whl',
    })
    const r = await preflight('wrongurl', '1.0.0', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/url/i)
  })
})

describe('releaseNotes', () => {
  it('records the sha256 of each asset', async () => {
    writeKit('notekit', { artifactBytes: 'abc' })
    const { kit, assets } = await collectPayload('notekit', { root: TMP_ROOT })
    const notes = releaseNotes('notekit', '1.0.0', kit, assets)
    expect(notes).toContain(sha('abc'))
    expect(notes).toContain('notekit@1.0.0')
  })
})

describe('buildRelease', () => {
  it('produces a release named <id>@<ver> with the expected assets', async () => {
    writeKit('rel', { version: '3.1.4' })
    const r = await buildRelease('rel@3.1.4', { root: TMP_ROOT })
    expect(r.tag).toBe('rel@3.1.4')
    expect(r.name).toBe('rel@3.1.4')
    expect(r.assets.map((a) => a.name)).not.toContain('recipe.json')
    expect(r.notes).toContain('rel@3.1.4')
  })

  it('throws when pre-flight fails', async () => {
    writeKit('bad', { version: '1.0.0', verified: false })
    await expect(buildRelease('bad@1.0.0', { root: TMP_ROOT })).rejects.toThrow(/pre-flight/i)
  })
})
