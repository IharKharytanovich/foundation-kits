import { describe, it, expect } from 'vitest'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'

describe('KitJsonSchema', () => {
  const valid = {
    id: 'numpy', version: '2.2.5', runtime: 'pyodide',
    tags: ['math', 'core'], tier: 'default', verified: true,
    provenance: { source: 'pypi', repo: 'https://github.com/numpy/numpy', ref: 'v2.2.5', license: 'BSD-3-Clause' },
    artifacts: [{ file: 'artifacts/numpy.whl', sha256: 'a'.repeat(64) }],
    dependencies: [],
  }
  it('accepts a valid kit.json', () => {
    expect(KitJsonSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects unknown runtime', () => {
    expect(KitJsonSchema.safeParse({ ...valid, runtime: 'docker' }).success).toBe(false)
  })
  it('rejects unknown tag', () => {
    expect(KitJsonSchema.safeParse({ ...valid, tags: ['bogus'] }).success).toBe(false)
  })
  it('rejects a malformed sha256 (not 64 hex)', () => {
    expect(KitJsonSchema.safeParse({ ...valid, artifacts: [{ file: 'a', sha256: 'xyz' }] }).success).toBe(false)
  })
})

describe('ManifestSchema', () => {
  it('accepts a loose manifest', () => {
    const m = { kit: 'numpy', mode: 'loose', imports: ['numpy'], golden: { code: 'x', expect: 'y' } }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('accepts a strict manifest', () => {
    const m = { kit: 'seqtk', mode: 'strict', operations: [
      { id: 'size', summary: 's', tool: 'size', params: { sequence: { type: 'string' } },
        output: { format: 'tsv' }, golden: { input: { sequence: '>s\nACGT' }, expect: '1\t4\n' } },
    ] }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('rejects a loose manifest carrying strict-only operations', () => {
    const m = { kit: 'numpy', mode: 'loose', imports: ['numpy'], operations: [], golden: { code: 'x', expect: 'y' } }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })
  it('rejects a strict manifest carrying loose-only imports', () => {
    const m = { kit: 'seqtk', mode: 'strict', imports: ['x'], operations: [] }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })
})

describe('RecipeSchema', () => {
  it('accepts a pypi-vendor recipe', () => {
    const r = { kit: 'numpy', track: 'pypi-vendor',
      source: { url: 'https://files.pythonhosted.org/x.whl', sha256: 'a'.repeat(64) } }
    expect(RecipeSchema.safeParse(r).success).toBe(true)
  })
  it('accepts a wasi recipe with build fields', () => {
    const r = { kit: 'seqtk', track: 'wasi',
      source: { repo: 'https://github.com/lh3/seqtk', ref: 'v1.5-r133' },
      build: { dockerfile: 'build/wasi/Dockerfile', args: [], exclude: [] } }
    expect(RecipeSchema.safeParse(r).success).toBe(true)
  })
  it('rejects unknown track', () => {
    expect(RecipeSchema.safeParse({ kit: 'x', track: 'magic', source: {} }).success).toBe(false)
  })
})
