import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'

/**
 * Fetch vendor bytes into a staging directory.
 *
 * Each spec is { url, dest } where `dest` is relative to `vendorRoot`
 * (e.g. 'pyodide/fake.whl' or 'jswasm/highs-js/highs.wasm').
 *
 * Idempotent: skips files already present. Throws on non-200 responses.
 *
 * @param {Array<{url: string, dest: string}>} specs
 * @param {object} [opts]
 * @param {string} [opts.vendorRoot='temp/vendor']
 * @param {function} [opts.fetchImpl=globalThis.fetch]
 * @returns {Promise<string[]>} List of written file paths
 */
export async function fetchVendor(specs, { vendorRoot = 'temp/vendor', fetchImpl = globalThis.fetch } = {}) {
	const written = []

	for (const { url, dest } of specs) {
		const filePath = join(vendorRoot, dest)

		if (existsSync(filePath)) {
			continue // idempotent skip
		}

		mkdirSync(dirname(filePath), { recursive: true })

		const res = await fetchImpl(url)
		if (!res.ok) {
			throw new Error(`fetch ${url} → ${res.status}`)
		}

		const buf = Buffer.from(await res.arrayBuffer())
		writeFileSync(filePath, buf)
		written.push(filePath)
	}

	return written
}

/**
 * Build download specs from the KITS and JSWASM_KITS descriptor arrays.
 *
 * - Pyodide descriptors: each artifact → { url: sourceUrl ?? recipeBase+vendor, dest: 'pyodide/<vendor>' }
 * - JSWASM descriptors: each vendored[] → { url: v.url, dest: 'jswasm/<id>/<vendor>' }
 * - Wasi descriptors (no recipeBase, no sourceUrl) are skipped.
 *
 * @param {Array} kits - KITS descriptors (pyodide + wasi)
 * @param {Array} jswasmKits - JSWASM_KITS descriptors
 * @returns {Array<{url: string, dest: string}>}
 */
export function buildSpecs(kits, jswasmKits) {
	const specs = []

	for (const kit of kits) {
		// Skip wasi kits — they have no recipeBase and no download URLs
		if (kit.runtime === 'wasi') continue

		for (const art of kit.artifacts) {
			const url = art.sourceUrl ?? (kit.recipeBase ? kit.recipeBase + art.vendor : undefined)
			if (!url) continue // no downloadable source
			specs.push({ url, dest: 'pyodide/' + art.vendor })
		}
	}

	for (const kit of jswasmKits) {
		for (const v of kit.vendored) {
			specs.push({ url: v.url, dest: 'jswasm/' + kit.id + '/' + v.vendor })
		}
	}

	return specs
}

// ── CLI entry ───────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
	const { KITS } = await import('./import-data.mjs')
	const { JSWASM_KITS } = await import('./jswasm-vendor-data.mjs')

	const id = process.argv[2]

	let allSpecs = buildSpecs(KITS, JSWASM_KITS)

	if (id) {
		// Filter to a single kit's specs
		const pyodideKit = KITS.find((k) => k.id === id)
		const jswasmKit = JSWASM_KITS.find((k) => k.id === id)

		if (!pyodideKit && !jswasmKit) {
			console.error(`unknown kit id: ${id}`)
			process.exit(1)
		}

		const kitSpecs = []
		if (pyodideKit && pyodideKit.runtime !== 'wasi') {
			for (const art of pyodideKit.artifacts) {
				const url = art.sourceUrl ?? (pyodideKit.recipeBase ? pyodideKit.recipeBase + art.vendor : undefined)
				if (url) kitSpecs.push({ url, dest: 'pyodide/' + art.vendor })
			}
		}
		if (jswasmKit) {
			for (const v of jswasmKit.vendored) {
				kitSpecs.push({ url: v.url, dest: 'jswasm/' + jswasmKit.id + '/' + v.vendor })
			}
		}
		allSpecs = kitSpecs
	}

	const written = await fetchVendor(allSpecs)

	if (written.length === 0) {
		console.log(`all ${allSpecs.length} files already staged — nothing to download`)
	} else {
		console.log(`fetched ${written.length} file(s):`)
		for (const p of written) console.log(`  ${p}`)
	}
}
