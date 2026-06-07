import { mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ZERO_SHA = '0'.repeat(64) // placeholder; real sha written at build time

export function scaffoldKit({ id, runtime, root = 'kit' }) {
  const dir = join(root, id)
  if (existsSync(dir)) throw new Error(`kit already exists: ${dir}`)
  mkdirSync(join(dir, 'artifacts'), { recursive: true })

  const ext = runtime === 'wasi' ? 'wasm' : 'whl'
  const kit = {
    id, version: '0.0.0', runtime,
    tags: ['util'], tier: 'library', verified: false,
    provenance: { source: 'TODO', repo: 'TODO', ref: 'TODO', license: 'TODO' },
    artifacts: [{ file: `artifacts/${id}.${ext}`, sha256: ZERO_SHA }],
    dependencies: [],
  }

  const manifest = runtime === 'wasi'
    ? { kit: id, mode: 'strict', operations: [
        { id: 'TODO', summary: 'TODO', tool: 'TODO', params: { input: { type: 'string' } },
          output: { format: 'TODO' }, golden: { input: { input: 'TODO' }, expect: 'TODO' } },
      ] }
    : { kit: id, mode: 'loose', imports: [id], golden: { code: `import ${id}`, expect: 'TODO' } }

  const recipe = runtime === 'wasi'
    ? { kit: id, track: 'wasi', source: { repo: 'TODO', ref: 'TODO' },
        build: { dockerfile: 'build/wasi/Dockerfile', args: [], exclude: [] } }
    : { kit: id, track: 'pypi-vendor', source: { url: 'TODO', sha256: ZERO_SHA } }

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
    console.error('usage: node tooling/new-kit.mjs <id> [--runtime wasi|pyodide] [--root <dir>]')
    process.exit(1)
  }
  const ri = rest.indexOf('--runtime')
  const runtime = ri >= 0 ? rest[ri + 1] : 'pyodide'
  const rooti = rest.indexOf('--root')
  const root = rooti >= 0 ? rest[rooti + 1] : 'kit'
  const dir = scaffoldKit({ id, runtime, root })
  console.log(`scaffolded ${dir}`)
}
