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

  it('creates a schema-valid jswasm emscripten skeleton', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    const kitDir = scaffoldKit({ id: 'demo-em', runtime: 'jswasm', family: 'emscripten', root: dir })

    expect(existsSync(join(kitDir, 'artifacts'))).toBe(true)
    expect(existsSync(join(kitDir, 'LICENSE'))).toBe(true)
    expect(existsSync(join(kitDir, 'instruction.md'))).toBe(true)

    // kit.json
    const kit = JSON.parse(readFileSync(join(kitDir, 'kit.json'), 'utf8'))
    const kitResult = KitJsonSchema.safeParse(kit)
    expect(kitResult.success).toBe(true)
    expect(kit.runtime).toBe('jswasm')
    expect(kit.verified).toBe(false)
    expect(kit.loader).toBeDefined()
    expect(kit.loader.initStyle).toBe('factory')
    expect(kit.loader.wasmSupply).toBe('locateFile')
    expect(kit.loader.moduleSystem).toBe('cjs')
    expect(kit.loader.entry).toBe('artifacts/demo-em.cjs')
    // 2 artifacts: loader + binary
    expect(kit.artifacts).toHaveLength(2)
    const roles = kit.artifacts.map(a => a.role).sort()
    expect(roles).toEqual(['binary', 'loader'])

    // manifest.json
    const manifest = JSON.parse(readFileSync(join(kitDir, 'manifest.json'), 'utf8'))
    const manifestResult = ManifestSchema.safeParse(manifest)
    expect(manifestResult.success).toBe(true)
    expect(manifest.mode).toBe('callable')
    expect(manifest.scriptable).toBe(true)
    expect(manifest.scriptGolden).toBeDefined()

    // recipe.json
    const recipe = JSON.parse(readFileSync(join(kitDir, 'recipe.json'), 'utf8'))
    const recipeResult = RecipeSchema.safeParse(recipe)
    expect(recipeResult.success).toBe(true)
    expect(recipe.track).toBe('jswasm-vendor')
    expect(recipe.family).toBe('emscripten')
  })

  it('creates a schema-valid jswasm wasm-bindgen skeleton', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    const kitDir = scaffoldKit({ id: 'demo-wb', runtime: 'jswasm', family: 'wasm-bindgen', root: dir })

    // kit.json
    const kit = JSON.parse(readFileSync(join(kitDir, 'kit.json'), 'utf8'))
    const kitResult = KitJsonSchema.safeParse(kit)
    expect(kitResult.success).toBe(true)
    expect(kit.runtime).toBe('jswasm')
    expect(kit.verified).toBe(false)
    expect(kit.loader).toBeDefined()
    expect(kit.loader.initStyle).toBe('none')
    expect(kit.loader.wasmSupply).toBe('auto')
    expect(kit.loader.moduleSystem).toBe('cjs')
    expect(kit.loader.entry).toBe('artifacts/demo-wb.cjs')
    // 1 artifact: loader only
    expect(kit.artifacts).toHaveLength(1)
    expect(kit.artifacts[0].role).toBe('loader')

    // manifest.json
    const manifest = JSON.parse(readFileSync(join(kitDir, 'manifest.json'), 'utf8'))
    const manifestResult = ManifestSchema.safeParse(manifest)
    expect(manifestResult.success).toBe(true)
    expect(manifest.mode).toBe('callable')
    expect(manifest.scriptable).toBe(true)

    // recipe.json
    const recipe = JSON.parse(readFileSync(join(kitDir, 'recipe.json'), 'utf8'))
    const recipeResult = RecipeSchema.safeParse(recipe)
    expect(recipeResult.success).toBe(true)
    expect(recipe.track).toBe('jswasm-vendor')
    expect(recipe.family).toBe('wasm-bindgen')
  })

  it('throws when jswasm is used without a family', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    expect(() => scaffoldKit({ id: 'demo-nf', runtime: 'jswasm', root: dir })).toThrow()
  })

  it('throws when jswasm is used with an invalid family', () => {
    dir = mkdtempSync(join(tmpdir(), 'kit-'))
    expect(() => scaffoldKit({ id: 'demo-bad', runtime: 'jswasm', family: 'invalid', root: dir })).toThrow()
  })
})
