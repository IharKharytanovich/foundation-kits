import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ZERO_SHA = '0'.repeat(64) // placeholder; real sha written at build time

const VALID_FAMILIES = ['emscripten', 'wasm-bindgen']

export function scaffoldKit({ id, runtime, root = 'kit', family }) {
  // jswasm requires a valid family
  if (runtime === 'jswasm') {
    if (!family || !VALID_FAMILIES.includes(family)) {
      throw new Error(
        `--runtime jswasm requires --family <${VALID_FAMILIES.join('|')}>` +
        (family ? ` (got '${family}')` : ''),
      )
    }
  }

  const dir = join(root, id)
  if (existsSync(dir)) throw new Error(`kit already exists: ${dir}`)
  mkdirSync(join(dir, 'artifacts'), { recursive: true })

  let kit, manifest, recipe

  if (runtime === 'jswasm') {
    // --- jswasm branch: family-specific presets ---
    const loaderFile = `artifacts/${id}.cjs`
    const binaryFile = `artifacts/${id}.wasm`

    const artifacts = family === 'emscripten'
      ? [
          { file: loaderFile, sha256: ZERO_SHA, role: 'loader' },
          { file: binaryFile, sha256: ZERO_SHA, role: 'binary' },
        ]
      : [
          { file: loaderFile, sha256: ZERO_SHA, role: 'loader' },
        ]

    const loader = family === 'emscripten'
      ? { entry: loaderFile, moduleSystem: 'cjs', initStyle: 'factory', wasmSupply: 'locateFile' }
      : { entry: loaderFile, moduleSystem: 'cjs', initStyle: 'none', wasmSupply: 'auto' }

    kit = {
      id, version: '0.0.0', runtime: 'jswasm',
      tags: ['util'], tier: 'library', verified: false,
      provenance: { source: 'TODO', repo: 'TODO', ref: 'TODO', license: 'TODO' },
      artifacts,
      dependencies: [],
      loader,
    }

    manifest = {
      kit: id, mode: 'callable',
      operations: [],
      scriptable: true,
      scriptGolden: { script: 'return null;', expect: 'TODO' },
    }

    const vendored = family === 'emscripten'
      ? [
          { file: loaderFile, url: 'TODO', sha256: ZERO_SHA },
          { file: binaryFile, url: 'TODO', sha256: ZERO_SHA },
        ]
      : [
          { file: loaderFile, url: 'TODO', sha256: ZERO_SHA },
        ]

    recipe = {
      kit: id, track: 'jswasm-vendor', family,
      source: { package: 'TODO', version: 'TODO' },
      vendored,
    }
  } else {
    // --- wasi / pyodide branch (unchanged) ---
    const ext = runtime === 'wasi' ? 'wasm' : 'whl'
    kit = {
      id, version: '0.0.0', runtime,
      tags: ['util'], tier: 'library', verified: false,
      provenance: { source: 'TODO', repo: 'TODO', ref: 'TODO', license: 'TODO' },
      artifacts: [{ file: `artifacts/${id}.${ext}`, sha256: ZERO_SHA }],
      dependencies: [],
    }

    manifest = runtime === 'wasi'
      ? { kit: id, mode: 'strict', operations: [
          { id: 'TODO', summary: 'TODO', tool: 'TODO', params: { input: { type: 'string' } },
            output: { format: 'TODO' }, golden: { input: { input: 'TODO' }, expect: 'TODO' } },
        ] }
      : { kit: id, mode: 'loose', imports: [id], golden: { code: `import ${id}`, expect: 'TODO' } }

    recipe = runtime === 'wasi'
      ? { kit: id, track: 'wasi', source: { repo: 'TODO', ref: 'TODO' },
          build: { dockerfile: 'build/wasi/Dockerfile', args: [], exclude: [] } }
      : { kit: id, track: 'pypi-vendor', source: { url: 'TODO', sha256: ZERO_SHA } }
  }

  const instruction = `# ${id}\n\nTODO: agent-facing prose — what it does, when to use, when NOT to.\n`

  writeFileSync(join(dir, 'kit.json'), JSON.stringify(kit, null, '\t') + '\n')
  writeFileSync(join(dir, 'manifest.json'), JSON.stringify(manifest, null, '\t') + '\n')
  writeFileSync(join(dir, 'recipe.json'), JSON.stringify(recipe, null, '\t') + '\n')
  writeFileSync(join(dir, 'instruction.md'), instruction)
  writeFileSync(join(dir, 'LICENSE'), 'TODO: upstream license text\n')
  return dir
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const [id, ...rest] = process.argv.slice(2)
  if (!id) {
    console.error('usage: node tooling/new-kit.mjs <id> [--runtime wasi|pyodide|jswasm] [--family emscripten|wasm-bindgen] [--root <dir>]')
    process.exit(1)
  }
  const ri = rest.indexOf('--runtime')
  const runtime = ri >= 0 ? rest[ri + 1] : 'pyodide'
  const rooti = rest.indexOf('--root')
  const root = rooti >= 0 ? rest[rooti + 1] : 'kit'
  const fi = rest.indexOf('--family')
  const family = fi >= 0 ? rest[fi + 1] : undefined
  try {
    const dir = scaffoldKit({ id, runtime, root, family })
    console.log(`scaffolded ${dir}`)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
}
