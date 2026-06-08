import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
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
  it('accepts an artifact carrying a distribution url', () => {
    const withUrl = { ...valid, artifacts: [{
      file: 'artifacts/numpy.whl', sha256: 'a'.repeat(64),
      url: 'https://github.com/org/foundation-kits/releases/download/numpy@2.2.5/numpy.whl',
    }] }
    expect(KitJsonSchema.safeParse(withUrl).success).toBe(true)
  })
  it('rejects a malformed distribution url', () => {
    const badUrl = { ...valid, artifacts: [{ file: 'a', sha256: 'a'.repeat(64), url: 'not-a-url' }] }
    expect(KitJsonSchema.safeParse(badUrl).success).toBe(false)
  })

  // --- jswasm runtime + loader + artifact role ---
  const jswasmValid = {
    id: 'rdkit', version: '2025.3.4-1.0.0', runtime: 'jswasm',
    tags: ['chemistry'], tier: 'library', verified: true,
    provenance: { source: '@rdkit/rdkit', repo: 'https://github.com/rdkit/rdkit', ref: '2025.3.4-1.0.0', license: 'BSD-3-Clause', buildNote: 'Single-threaded Emscripten-MODULARIZE build' },
    artifacts: [
      { file: 'artifacts/RDKit_minimal.cjs', sha256: 'a'.repeat(64), role: 'loader' },
      { file: 'artifacts/RDKit_minimal.wasm', sha256: 'b'.repeat(64), role: 'binary' },
    ],
    loader: { entry: 'artifacts/RDKit_minimal.cjs', moduleSystem: 'cjs', initStyle: 'factory', wasmSupply: 'locateFile' },
    dependencies: [],
  }
  it('accepts a jswasm kit.json with loader + artifact role', () => {
    expect(KitJsonSchema.safeParse(jswasmValid).success).toBe(true)
  })
  it('accepts a jswasm kit with optional loader fields (initExport, handleAccessor)', () => {
    const withOptional = {
      ...jswasmValid,
      loader: { ...jswasmValid.loader, initExport: 'default', handleAccessor: 'RDKit' },
    }
    expect(KitJsonSchema.safeParse(withOptional).success).toBe(true)
  })
  it('rejects jswasm kit.json with NO loader (loader required iff jswasm)', () => {
    const { loader: _, ...noLoader } = jswasmValid
    expect(KitJsonSchema.safeParse(noLoader).success).toBe(false)
  })
  it('rejects non-jswasm (wasi) kit.json WITH a loader', () => {
    const wasiWithLoader = {
      ...valid, runtime: 'wasi',
      artifacts: [{ file: 'artifacts/seqtk.wasm', sha256: 'a'.repeat(64), wasiTools: ['seqtk'] }],
      loader: jswasmValid.loader,
    }
    expect(KitJsonSchema.safeParse(wasiWithLoader).success).toBe(false)
  })
  it('rejects non-jswasm (pyodide) kit.json WITH a loader', () => {
    const pyodideWithLoader = { ...valid, loader: jswasmValid.loader }
    expect(KitJsonSchema.safeParse(pyodideWithLoader).success).toBe(false)
  })
  it('accepts pyodide/wasi artifacts without role (role is optional)', () => {
    // existing pyodide/wasi kits don't have role — must still parse
    expect(KitJsonSchema.safeParse(valid).success).toBe(true)
  })

  // --- parity: real rdkit kit.json from disk ---
  it('parses the real kit/rdkit/kit.json from disk', () => {
    const rdkitKit = JSON.parse(readFileSync('kit/rdkit/kit.json', 'utf8'))
    const result = KitJsonSchema.safeParse(rdkitKit)
    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true)
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

  // --- callable manifest ---
  const callableOpWithConstruct = {
    id: 'validate_smiles', summary: 'Check SMILES validity',
    construct: { factory: 'get_mol', from: 'smiles' },
    method: 'is_valid', args: [],
    params: { smiles: { type: 'string' } },
    result: { kind: 'boolean', deterministic: true },
    golden: { input: { smiles: 'CCO' }, expect: 'true' },
  }
  const callableOpNoConstruct = {
    id: 'add', summary: 'Add two numbers',
    method: 'add',
    args: [{ kind: 'scalar', from: 'a' }, { kind: 'scalar', from: 'b' }],
    params: { a: { type: 'number' }, b: { type: 'number' } },
    result: { kind: 'number', deterministic: true },
    golden: { input: { a: 2, b: 3 }, expect: '5' },
  }
  const callableOpWithHandleArg = {
    id: 'measure', summary: 'Measure with handle arg',
    method: 'measure',
    args: [
      { kind: 'handle', factory: 'create_obj', from: 'data' },
      { kind: 'scalar', from: 'unit' },
    ],
    params: { data: { type: 'string' }, unit: { type: 'string' } },
    result: { kind: 'json', deterministic: true },
    golden: { input: { data: 'x', unit: 'm' }, expect: '{}' },
  }
  it('accepts a callable manifest with operations (construct/method/args/result/golden)', () => {
    const m = {
      kit: 'rdkit', mode: 'callable',
      operations: [callableOpWithConstruct, callableOpNoConstruct],
    }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('accepts a callable manifest with handle-kind args', () => {
    const m = {
      kit: 'test', mode: 'callable',
      operations: [callableOpWithHandleArg],
    }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('accepts a callable manifest with scriptable:true + scriptGolden, empty operations', () => {
    const m = {
      kit: 'gmp', mode: 'callable',
      operations: [],
      scriptable: true,
      scriptGolden: { script: 'return handle.pi(10);', expect: '3.1428571429' },
    }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('accepts a callable manifest with both operations and scriptable', () => {
    const m = {
      kit: 'rdkit', mode: 'callable',
      operations: [callableOpWithConstruct],
      scriptable: true,
      scriptGolden: { script: 'return handle.get_mol("CCO").is_valid();', expect: 'true' },
    }
    expect(ManifestSchema.safeParse(m).success).toBe(true)
  })
  it('rejects callable manifest with scriptable:true but NO scriptGolden', () => {
    const m = {
      kit: 'broken', mode: 'callable',
      operations: [callableOpNoConstruct],
      scriptable: true,
    }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })
  it('rejects callable manifest with empty operations AND scriptable:false', () => {
    const m = {
      kit: 'broken', mode: 'callable',
      operations: [],
      scriptable: false,
    }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })
  it('rejects callable manifest with empty operations AND scriptable defaulting to false', () => {
    const m = {
      kit: 'broken', mode: 'callable',
      operations: [],
    }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })
  it('rejects a callable manifest carrying loose-only imports', () => {
    const m = {
      kit: 'broken', mode: 'callable', imports: ['x'],
      operations: [callableOpNoConstruct],
    }
    expect(ManifestSchema.safeParse(m).success).toBe(false)
  })

  // --- parity: real rdkit manifest.json from disk ---
  it('parses the real kit/rdkit/manifest.json from disk', () => {
    const rdkitMan = JSON.parse(readFileSync('kit/rdkit/manifest.json', 'utf8'))
    const result = ManifestSchema.safeParse(rdkitMan)
    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true)
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

  // --- jswasm-vendor recipe ---
  const jswasmRecipe = {
    kit: 'rdkit', track: 'jswasm-vendor',
    family: 'emscripten',
    source: { package: '@rdkit/rdkit', version: '2025.3.4-1.0.0' },
    vendored: [
      { file: 'RDKit_minimal.cjs', url: 'https://unpkg.com/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.cjs', sha256: 'a'.repeat(64) },
      { file: 'RDKit_minimal.wasm', url: 'https://unpkg.com/@rdkit/rdkit@2025.3.4-1.0.0/dist/RDKit_minimal.wasm', sha256: 'b'.repeat(64) },
    ],
  }
  it('accepts a jswasm-vendor recipe (emscripten)', () => {
    expect(RecipeSchema.safeParse(jswasmRecipe).success).toBe(true)
  })
  it('accepts a jswasm-vendor recipe (wasm-bindgen)', () => {
    const wbRecipe = {
      ...jswasmRecipe, kit: 'geodesy', family: 'wasm-bindgen',
      source: { package: 'geodesy-wasm', version: '1.0.0' },
      vendored: [{ file: 'geodesy_wasm.js', url: 'https://unpkg.com/geodesy-wasm@1.0.0/geodesy_wasm.js', sha256: 'c'.repeat(64) }],
    }
    expect(RecipeSchema.safeParse(wbRecipe).success).toBe(true)
  })
  it('rejects jswasm-vendor recipe with empty vendored array', () => {
    const bad = { ...jswasmRecipe, vendored: [] }
    expect(RecipeSchema.safeParse(bad).success).toBe(false)
  })
  it('rejects jswasm-vendor recipe with unknown family', () => {
    const bad = { ...jswasmRecipe, family: 'cargo' }
    expect(RecipeSchema.safeParse(bad).success).toBe(false)
  })
})
