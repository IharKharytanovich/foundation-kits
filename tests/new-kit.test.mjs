import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { scaffoldKit } from '../tooling/new-kit.mjs'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'

let dir
afterEach(() => { if (dir) rmSync(dir, { recursive: true, force: true }) })

describe('scaffoldKit', () => {
  it('creates a schema-valid pyodide kit skeleton', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    const kitDir = scaffoldKit({ id: 'demo', runtime: 'pyodide', root: dir })

    expect(existsSync(join(kitDir, 'artifacts'))).toBe(true)
    expect(existsSync(join(kitDir, 'LICENSE'))).toBe(true)

    const kit = JSON.parse(readFileSync(join(kitDir, 'kit.json'), 'utf8'))
    expect(KitJsonSchema.safeParse(kit).success).toBe(true)
    expect(kit.id).toBe('demo')
    expect(kit.verified).toBe(false)

    const manifest = JSON.parse(readFileSync(join(kitDir, 'manifest.json'), 'utf8'))
    expect(ManifestSchema.safeParse(manifest).success).toBe(true)
    expect(manifest.mode).toBe('loose') // pyodide default

    const recipe = JSON.parse(readFileSync(join(kitDir, 'recipe.json'), 'utf8'))
    expect(RecipeSchema.safeParse(recipe).success).toBe(true)
  })

  it('creates a strict manifest for a wasi kit', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    const kitDir = scaffoldKit({ id: 'tool', runtime: 'wasi', root: dir })
    const manifest = JSON.parse(readFileSync(join(kitDir, 'manifest.json'), 'utf8'))
    expect(manifest.mode).toBe('strict')
  })

  it('refuses to overwrite an existing kit', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    scaffoldKit({ id: 'demo', runtime: 'pyodide', root: dir })
    expect(() => scaffoldKit({ id: 'demo', runtime: 'pyodide', root: dir })).toThrow()
  })
})
