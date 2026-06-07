import { readFileSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { execFileSync } from 'node:child_process'
import { sha256File } from './lib/sha256.mjs'
import { artifactUrl } from './lib/release-url.mjs'
import { gateKit } from './license-gate.mjs'

// The four consumer files that ship to Foundation, alongside the artifacts.
export const CONSUMER_FILES = ['kit.json', 'manifest.json', 'instruction.md', 'LICENSE']

// recipe.json is factory-only — it encodes build provenance / redistribution
// exclusions and MUST NOT appear in a release payload. Cite: CLAUDE.md, §11.
export const EXCLUDED_FROM_PAYLOAD = ['recipe.json']

/**
 * Parse a `<id>@<version>` release ref.
 * @param {string} ref
 * @returns {{id:string, version:string}}
 */
export function parseRef(ref) {
  const m = /^([a-z0-9][a-z0-9-]*)@(.+)$/.exec(ref ?? '')
  if (!m) throw new Error(`invalid release ref "${ref}" — expected <id>@<version> (e.g. numpy@2.2.5)`)
  return { id: m[1], version: m[2] }
}

/**
 * Collect the release payload for a kit: the four consumer files + every
 * artifact, each with its on-disk sha256. recipe.json is never included.
 *
 * Artifact integrity is verified against `kit.json` — we trust the hash, not
 * the tag (architecture §9). A mismatch or missing byte aborts.
 *
 * @param {string} id
 * @param {object} [opts]
 * @param {string} [opts.root='kit']
 * @param {boolean} [opts.verifyIntegrity=true]
 * @returns {Promise<{kit:object, assets:Array<{name:string,path:string,ships:boolean,sha256:string,declared?:string}>}>}
 */
export async function collectPayload(id, { root = 'kit', verifyIntegrity = true } = {}) {
  const dir = join(root, id)
  const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
  const assets = []

  for (const file of CONSUMER_FILES) {
    const path = join(dir, file)
    if (!existsSync(path)) throw new Error(`missing consumer file: ${file}`)
    assets.push({ name: file, path, ships: true, sha256: await sha256File(path) })
  }

  for (const art of kit.artifacts) {
    const path = join(dir, art.file)
    if (!existsSync(path)) {
      throw new Error(
        `missing artifact bytes: ${art.file} — artifacts are gitignored; build/fetch them before publishing`,
      )
    }
    const sha = await sha256File(path)
    if (verifyIntegrity && sha !== art.sha256) {
      throw new Error(
        `sha256 mismatch for ${art.file}: kit.json declares ${art.sha256}, bytes hash to ${sha} — trust the hash, not the tag`,
      )
    }
    assets.push({ name: basename(art.file), path, ships: true, sha256: sha, declared: art.sha256, url: art.url })
  }

  return { kit, assets }
}

/**
 * Pre-flight gate for `<id>@<version>`: verified flag, version match, required
 * files present, and the redistribution (license) gate. Returns all failures
 * at once rather than stopping at the first.
 *
 * @returns {Promise<{ok:boolean, errors:string[], kit?:object}>}
 */
export async function preflight(id, version, { root = 'kit' } = {}) {
  const dir = join(root, id)
  const kitPath = join(dir, 'kit.json')
  if (!existsSync(kitPath)) return { ok: false, errors: [`kit not found: ${dir}`] }

  const kit = JSON.parse(readFileSync(kitPath, 'utf8'))
  const errors = []

  if (kit.id !== id) errors.push(`kit.json id "${kit.id}" does not match folder "${id}"`)
  if (kit.version !== version) {
    errors.push(`tag version "${version}" does not match kit.json version "${kit.version}"`)
  }
  if (kit.verified !== true) {
    errors.push(`kit is not verified (verified=${JSON.stringify(kit.verified)}) — only verified kits publish`)
  }
  if (!existsSync(join(dir, 'LICENSE'))) errors.push('LICENSE is missing')
  if (!existsSync(join(dir, 'manifest.json'))) errors.push('manifest.json is missing')
  if (!existsSync(join(dir, 'instruction.md'))) errors.push('instruction.md is missing')

  // Each artifact must carry the distribution url Foundation downloads from, and
  // it must resolve to *this* release (id@version/<file>) — catches drift.
  for (const art of kit.artifacts ?? []) {
    const expected = artifactUrl(kit.id, kit.version, art.file)
    if (!art.url) {
      errors.push(`artifact ${art.file} has no distribution url (expected ${expected})`)
    } else if (art.url !== expected) {
      errors.push(`artifact ${art.file} url "${art.url}" does not match expected "${expected}"`)
    }
  }

  const gate = gateKit(id, { root })
  if (!gate.ok) for (const issue of gate.issues) errors.push(`license-gate: ${issue}`)

  return { ok: errors.length === 0, errors, kit }
}

/**
 * Render GitHub Release notes. `sha256` of every asset goes here so
 * Foundation's Library can resolve `id@version+sha256` and verify on download.
 */
export function releaseNotes(id, version, kit, assets) {
  const lines = []
  lines.push(`# ${id}@${version}`, '')
  lines.push(`Runtime: \`${kit.runtime}\` · tier: \`${kit.tier}\` · license: ${kit.provenance?.license}`, '')
  lines.push('Resolve as `id@version+sha256`; the Library verifies each asset on download.', '')
  lines.push('| asset | sha256 |', '| --- | --- |')
  for (const a of assets) lines.push(`| \`${a.name}\` | \`${a.sha256}\` |`)

  const downloads = assets.filter((a) => a.url)
  if (downloads.length) {
    lines.push('', '## Artifact downloads', '')
    for (const a of downloads) lines.push(`- \`${a.name}\` — ${a.url}`)
  }

  lines.push('', '_recipe.json is factory-only and intentionally excluded from this release._')
  return lines.join('\n')
}

/**
 * Build the complete release object for a `<id>@<version>` ref. Runs pre-flight;
 * throws (with `.errors`) if it fails.
 *
 * @returns {Promise<{tag:string, name:string, notes:string, assets:object[]}>}
 */
export async function buildRelease(ref, { root = 'kit' } = {}) {
  const { id, version } = parseRef(ref)
  const pre = await preflight(id, version, { root })
  if (!pre.ok) {
    const err = new Error(`pre-flight failed for ${ref}:\n  - ${pre.errors.join('\n  - ')}`)
    err.errors = pre.errors
    throw err
  }
  const { kit, assets } = await collectPayload(id, { root })
  const tag = `${id}@${version}`
  return { tag, name: tag, notes: releaseNotes(id, version, kit, assets), assets }
}

/**
 * Create or update the GitHub Release via the `gh` CLI. Side-effecting; only
 * invoked by the CLI (not in tests). Requires `gh` authenticated (GH_TOKEN in CI).
 */
function ghRelease({ tag, name, notes, assets }) {
  const paths = assets.map((a) => a.path)
  const exists = (() => {
    try {
      execFileSync('gh', ['release', 'view', tag], { stdio: 'ignore' })
      return true
    } catch {
      return false
    }
  })()

  if (exists) {
    execFileSync('gh', ['release', 'edit', tag, '--title', name, '--notes', notes], { stdio: 'inherit' })
    execFileSync('gh', ['release', 'upload', tag, ...paths, '--clobber'], { stdio: 'inherit' })
  } else {
    execFileSync('gh', ['release', 'create', tag, '--title', name, '--notes', notes, ...paths], { stdio: 'inherit' })
  }
}

// ── CLI entry ─────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const ri = args.indexOf('--root')
  const root = ri >= 0 ? args[ri + 1] : 'kit'
  const ref = args.find((a) => !a.startsWith('--') && a !== root)

  if (!ref) {
    console.error('usage: node tooling/publish.mjs <id>@<version> [--dry-run] [--root <dir>]')
    process.exit(1)
  }

  let release
  try {
    release = await buildRelease(ref, { root })
  } catch (err) {
    console.error(`✗ ${err.message}`)
    process.exit(1)
  }

  console.log(`release: ${release.name}`)
  console.log('payload (ships to Foundation):')
  for (const a of release.assets) console.log(`  ${a.sha256}  ${a.name}`)
  console.log(`excluded (factory-only): ${EXCLUDED_FROM_PAYLOAD.join(', ')}`)

  if (dryRun) {
    console.log('\n--- release notes ---')
    console.log(release.notes)
    console.log('\n[dry-run] no GitHub Release created')
    process.exit(0)
  }

  ghRelease(release)
  console.log(`\n✓ published ${release.tag}`)
}
