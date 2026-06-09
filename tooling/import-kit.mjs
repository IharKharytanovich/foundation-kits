import { mkdirSync, copyFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sha256File } from './lib/sha256.mjs'
import { artifactUrl } from './lib/release-url.mjs'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from './lib/schema.mjs'

/**
 * Import a single kit from vendored bytes.
 *
 * Copies artifacts from `vendorRoot` into `root/<id>/artifacts/`, computes
 * sha256 of every copy, and writes schema-valid kit.json + recipe.json +
 * manifest.json. Throws if any output fails schema validation.
 *
 * Does NOT write instruction.md or LICENSE — those are human-judgment files.
 *
 * @param {object} descriptor - Kit descriptor from import-data.mjs
 * @param {object} [opts]
 * @param {string} [opts.vendorRoot='temp/vendor'] - Root of vendored bytes
 * @param {string} [opts.root='kit'] - Root of kit output directories
 * @returns {Promise<string>} The kit directory path
 */
export async function importKit(descriptor, { vendorRoot = 'temp/vendor', root = 'kit' } = {}) {
	const { id, runtime, version, tags, tier, provenance, dependencies = [] } = descriptor
	const dir = join(root, id)
	mkdirSync(join(dir, 'artifacts'), { recursive: true })

	// ── 1. Copy artifacts and compute sha256 ────────────────────────────────
	const vendorSubdir = runtime === 'wasi' ? 'wasm' : 'pyodide'
	const artifactRecords = []

	for (const art of descriptor.artifacts) {
		const src = join(vendorRoot, vendorSubdir, art.vendor)
		const dest = join(dir, 'artifacts', art.vendor)
		copyFileSync(src, dest)
		const sha256 = await sha256File(dest)
		artifactRecords.push({ vendor: art.vendor, sha256, bundled: !!art.bundled, sourceUrl: art.sourceUrl })
	}

	const mainArt = artifactRecords[0]
	const bundledArts = artifactRecords.filter((a) => a.bundled)

	// ── 2. Build kit.json ───────────────────────────────────────────────────
	const kitArtifacts = artifactRecords.map((a) => {
		const file = `artifacts/${a.vendor}`
		const rec = { file, sha256: a.sha256, url: artifactUrl(id, version, file) }
		// wasi-only fields go on the main (first, non-bundled) artifact only
		if (runtime === 'wasi' && !a.bundled && descriptor.wasiTools) {
			rec.wasiTools = descriptor.wasiTools
			if (descriptor.multiplexed !== undefined) rec.multiplexed = descriptor.multiplexed
			if (descriptor.stdinAsFile !== undefined) rec.stdinAsFile = descriptor.stdinAsFile
		}
		return rec
	})

	const kitJson = {
		id,
		version,
		runtime,
		tags,
		tier,
		verified: true,
		provenance,
		artifacts: kitArtifacts,
		dependencies,
	}

	// ── 3. Build recipe.json ────────────────────────────────────────────────
	let recipeJson
	if (runtime === 'wasi') {
		recipeJson = {
			kit: id,
			track: 'wasi',
			source: { repo: provenance.repo, ref: provenance.ref },
			build: descriptor.build || { dockerfile: 'build/wasi/Dockerfile', args: [], exclude: [] },
		}
	} else {
		recipeJson = {
			kit: id,
			track: 'pypi-vendor',
			source: { url: mainArt.sourceUrl ?? (descriptor.recipeBase + mainArt.vendor), sha256: mainArt.sha256 },
		}
		if (bundledArts.length > 0) {
			recipeJson.bundled = bundledArts.map((a) => ({
				file: `artifacts/${a.vendor}`,
				url: a.sourceUrl ?? (descriptor.recipeBase + a.vendor),
				sha256: a.sha256,
			}))
		}
	}

	// ── 4. Build manifest.json ──────────────────────────────────────────────
	let manifestJson
	if (runtime === 'wasi') {
		// Strict skeleton — operations + golden hand-authored in Phase 02
		const tool = descriptor.wasiTools?.[0] || 'TODO'
		manifestJson = {
			kit: id,
			mode: 'strict',
			operations: [
				{
					id: 'TODO',
					summary: 'TODO',
					tool,
					params: { sequence: { type: 'string' } },
					stdinParam: 'sequence',
					argsTemplate: [],
					output: { format: 'TODO' },
					golden: { input: { sequence: 'TODO' }, expect: 'TODO' },
				},
			],
		}
	} else {
		manifestJson = {
			kit: id,
			mode: 'loose',
			imports: [descriptor.importName],
			golden: descriptor.golden,
		}
	}

	// ── 5. Validate against schemas ─────────────────────────────────────────
	validate('kit.json', KitJsonSchema, kitJson)
	validate('manifest.json', ManifestSchema, manifestJson)
	validate('recipe.json', RecipeSchema, recipeJson)

	// ── 6. Write files ──────────────────────────────────────────────────────
	const fmt = (obj) => JSON.stringify(obj, null, '\t') + '\n'
	writeFileSync(join(dir, 'kit.json'), fmt(kitJson))
	writeFileSync(join(dir, 'manifest.json'), fmt(manifestJson))
	writeFileSync(join(dir, 'recipe.json'), fmt(recipeJson))

	return dir
}

function validate(name, schema, data) {
	const result = schema.safeParse(data)
	if (!result.success) {
		throw new Error(`${name} failed schema validation: ${JSON.stringify(result.error.issues)}`)
	}
}

// ── CLI entry ───────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
	const args = process.argv.slice(2)

	const ri = args.indexOf('--root')
	const root = ri >= 0 ? args[ri + 1] : 'kit'
	const vi = args.indexOf('--vendor-root')
	const vendorRoot = vi >= 0 ? args[vi + 1] : 'temp/vendor'
	const all = args.includes('--all')
	const id = args.find((a) => !a.startsWith('--') && a !== root && a !== vendorRoot)

	if (!all && !id) {
		console.error('usage: node tooling/import-kit.mjs <id> | --all [--root <dir>] [--vendor-root <dir>]')
		process.exit(1)
	}

	const { KITS } = await import('./import-data.mjs')
	const descriptors = all ? KITS : KITS.filter((k) => k.id === id)

	if (descriptors.length === 0) {
		console.error(`unknown kit id: ${id}`)
		process.exit(1)
	}

	for (const desc of descriptors) {
		const dir = await importKit(desc, { vendorRoot, root })
		console.log(`imported ${desc.id} → ${dir}`)
	}
}
