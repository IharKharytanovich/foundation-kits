import { mkdirSync, copyFileSync, writeFileSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { sha256File } from './lib/sha256.mjs'
import { artifactUrl } from './lib/release-url.mjs'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from './lib/schema.mjs'

/**
 * Vendor a prebuilt JS-WASM kit from a descriptor.
 *
 * Copies artifacts from `vendorRoot/jswasm/<id>/<vendor>` into
 * `root/<id>/artifacts/<vendor>`, computes sha256 of every copy, and writes
 * schema-valid kit.json + recipe.json. Reads the existing manifest.json and
 * validates all three against schemas before writing. Does NOT write
 * manifest.json — that is hand-authored per kit.
 *
 * Does NOT perform network I/O.
 *
 * @param {object} descriptor - Kit descriptor from jswasm-vendor-data.mjs
 * @param {object} [opts]
 * @param {string} [opts.vendorRoot='temp/vendor'] - Root of vendored bytes
 * @param {string} [opts.root='kit'] - Root of kit output directories
 * @returns {Promise<string>} The kit directory path
 */
export async function vendorJsWasm(descriptor, { vendorRoot = 'temp/vendor', root = 'kit' } = {}) {
	const { id, version, family, tags, tier, provenance, loader, artifacts, source, vendored, dependencies = [] } = descriptor
	const dir = join(root, id)
	mkdirSync(join(dir, 'artifacts'), { recursive: true })

	// ── 1. Copy artifacts and compute sha256 ────────────────────────────────
	const artifactRecords = []

	for (const art of artifacts) {
		const src = join(vendorRoot, 'jswasm', id, art.vendor)
		const dest = join(dir, 'artifacts', art.vendor)
		copyFileSync(src, dest)
		const sha256 = await sha256File(dest)
		artifactRecords.push({ vendor: art.vendor, role: art.role, sha256 })
	}

	// ── 2. Build kit.json ───────────────────────────────────────────────────
	const kitArtifacts = artifactRecords.map((a) => {
		const file = `artifacts/${a.vendor}`
		return { file, sha256: a.sha256, url: artifactUrl(id, version, file), role: a.role }
	})

	const kitJson = {
		id,
		version,
		runtime: 'jswasm',
		tags,
		tier,
		verified: true,
		provenance,
		artifacts: kitArtifacts,
		loader,
		dependencies,
	}

	// ── 3. Build recipe.json ────────────────────────────────────────────────
	const vendoredMap = new Map(vendored.map((v) => [v.vendor, v]))

	const recipeJson = {
		kit: id,
		track: 'jswasm-vendor',
		family,
		source,
		vendored: artifactRecords.map((a) => {
			const entry = vendoredMap.get(a.vendor)
			return {
				file: `artifacts/${a.vendor}`,
				url: entry.url,
				sha256: a.sha256,
			}
		}),
	}

	// ── 4. Read existing manifest.json ──────────────────────────────────────
	const manifestJson = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))

	// ── 5. Validate all three against schemas (BEFORE writing) ──────────────
	validate('kit.json', KitJsonSchema, kitJson)
	validate('manifest.json', ManifestSchema, manifestJson)
	validate('recipe.json', RecipeSchema, recipeJson)

	// ── 6. Write files ──────────────────────────────────────────────────────
	const fmt = (obj) => JSON.stringify(obj, null, '\t') + '\n'
	writeFileSync(join(dir, 'kit.json'), fmt(kitJson))
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
		console.error('usage: node tooling/vendor-jswasm.mjs <id> | --all [--root <dir>] [--vendor-root <dir>]')
		process.exit(1)
	}

	const { JSWASM_KITS } = await import('./jswasm-vendor-data.mjs')
	const descriptors = all ? JSWASM_KITS : JSWASM_KITS.filter((k) => k.id === id)

	if (descriptors.length === 0) {
		console.error(`unknown jswasm kit id: ${id}`)
		process.exit(1)
	}

	for (const desc of descriptors) {
		const dir = await vendorJsWasm(desc, { vendorRoot, root })
		console.log(`vendored ${desc.id} → ${dir}`)
	}
}
