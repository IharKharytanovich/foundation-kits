import { describe, it, expect, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { classifyLicense } from '../tooling/lib/license-policy.mjs'
import { gateKit, gateAll } from '../tooling/license-gate.mjs'

const TMP_ROOT = 'temp/_test_gate_root'

afterEach(() => {
  rmSync(TMP_ROOT, { recursive: true, force: true })
})

// Write a minimal kit folder (kit.json [+ recipe.json]) under TMP_ROOT.
function writeKit(id, { license, buildNote, exclude, track = 'pypi-vendor', noRecipe = false } = {}) {
  const dir = join(TMP_ROOT, id)
  mkdirSync(dir, { recursive: true })
  const provenance = { source: 'pypi', repo: 'https://example.com', ref: 'v1', license }
  if (buildNote) provenance.buildNote = buildNote
  const kit = {
    id, version: '1.0.0', runtime: track === 'wasi' ? 'wasi' : 'pyodide',
    tags: ['util'], tier: 'library', verified: true, provenance,
    artifacts: [{ file: `artifacts/${id}.bin`, sha256: '0'.repeat(64) }],
    dependencies: [],
  }
  writeFileSync(join(dir, 'kit.json'), JSON.stringify(kit, null, '\t') + '\n')
  if (!noRecipe) {
    const recipe = track === 'wasi'
      ? { kit: id, track: 'wasi', source: { repo: 'r', ref: 'v1' }, build: { dockerfile: 'd', args: [], exclude: exclude ?? [] } }
      : { kit: id, track: 'pypi-vendor', source: { url: 'u', sha256: '0'.repeat(64) } }
    writeFileSync(join(dir, 'recipe.json'), JSON.stringify(recipe, null, '\t') + '\n')
  }
  return dir
}

describe('classifyLicense', () => {
  it('classifies permissive licenses as allow', () => {
    for (const l of ['MIT', 'BSD-3-Clause', 'BSD-2-Clause', 'Apache-2.0']) {
      expect(classifyLicense(l)).toBe('allow')
    }
  })

  it('classifies copyleft (redistribution still permitted) as allow', () => {
    expect(classifyLicense('GPL-3.0-or-later')).toBe('allow')
  })

  it('classifies known non-redistributable licenses as deny', () => {
    expect(classifyLicense('Proprietary')).toBe('deny')
    expect(classifyLicense('CC-BY-NC-4.0')).toBe('deny')
  })

  it('classifies ViennaRNA-style custom licenses as conditional', () => {
    expect(classifyLicense('ViennaRNA')).toBe('conditional')
  })

  it('classifies unrecognized licenses as unknown (fail-closed)', () => {
    expect(classifyLicense('TotallyMadeUpLicense')).toBe('unknown')
    expect(classifyLicense('')).toBe('unknown')
    expect(classifyLicense(undefined)).toBe('unknown')
  })
})

describe('gateKit', () => {
  it('passes a clean permissive kit with no exclusions', () => {
    writeKit('clean', { license: 'MIT' })
    const r = gateKit('clean', { root: TMP_ROOT })
    expect(r.ok).toBe(true)
    expect(r.issues).toEqual([])
  })

  it('fails a forbidden-license kit', () => {
    writeKit('badlic', { license: 'Proprietary' })
    const r = gateKit('badlic', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.issues.join(' ')).toMatch(/forbid|redistribut/i)
  })

  it('fails an unknown-license kit and points at the policy file', () => {
    writeKit('mystery', { license: 'WeirdLicense-9' })
    const r = gateKit('mystery', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.issues.join(' ')).toMatch(/license-policy\.mjs/)
  })

  it('passes a conditional-license kit when the exclusion is documented in buildNote', () => {
    writeKit('vienna', {
      license: 'ViennaRNA', track: 'wasi', exclude: ['naview.c'],
      buildNote: 'naview.c excluded — non-redistributable under the ViennaRNA license',
    })
    const r = gateKit('vienna', { root: TMP_ROOT })
    expect(r.ok).toBe(true)
  })

  it('fails a conditional-license kit when no exclusion is declared', () => {
    writeKit('vienna2', { license: 'ViennaRNA', track: 'wasi', exclude: [] })
    const r = gateKit('vienna2', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
  })

  it('fails when an excluded file is not documented in buildNote', () => {
    writeKit('undoc', {
      license: 'ViennaRNA', track: 'wasi', exclude: ['naview.c'],
      buildNote: 'some unrelated note',
    })
    const r = gateKit('undoc', { root: TMP_ROOT })
    expect(r.ok).toBe(false)
    expect(r.issues.join(' ')).toMatch(/naview\.c/)
  })
})

describe('gateAll', () => {
  it('returns a result per kit directory', () => {
    writeKit('a', { license: 'MIT' })
    writeKit('b', { license: 'Proprietary' })
    const results = gateAll({ root: TMP_ROOT })
    expect(results.map((r) => r.id).sort()).toEqual(['a', 'b'])
    expect(results.find((r) => r.id === 'a').ok).toBe(true)
    expect(results.find((r) => r.id === 'b').ok).toBe(false)
  })
})
