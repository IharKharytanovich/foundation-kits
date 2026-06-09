import { describe, it, expect, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'
import { sha256File } from '../tooling/lib/sha256.mjs'
import { artifactUrl } from '../tooling/lib/release-url.mjs'
import { vendorJsWasm } from '../tooling/vendor-jswasm.mjs'

const fmt = (obj) => JSON.stringify(obj, null, '\t') + '\n'

/** Write a minimal valid callable manifest into a kit dir. */
function writeTestManifest(kitDir, id) {
	mkdirSync(kitDir, { recursive: true })
	writeFileSync(join(kitDir, 'manifest.json'), fmt({
		kit: id,
		mode: 'callable',
		operations: [],
		scriptable: true,
		scriptGolden: { script: 'return "x";', expect: 'x' },
	}))
}

describe('vendorJsWasm', () => {
	let tempRoot
	afterEach(() => { if (tempRoot) rmSync(tempRoot, { recursive: true, force: true }) })

	it('vendors a single-artifact emscripten kit', async () => {
		tempRoot = mkdtempSync(join(tmpdir(), 'vendor-test-'))
		const root = join(tempRoot, 'kit')
		const vendorRoot = join(tempRoot, 'vendor')
		const id = 'test-em'
		const version = '1.0.0-1.0.0'

		// Place fixture bytes in the vendor staging dir
		const vendorDir = join(vendorRoot, 'jswasm', id)
		mkdirSync(vendorDir, { recursive: true })
		writeFileSync(join(vendorDir, 'test-em.cjs'), 'module.exports = function() {}')

		// Write hand-authored manifest
		writeTestManifest(join(root, id), id)

		const descriptor = {
			id,
			version,
			family: 'emscripten',
			tags: ['math'],
			tier: 'library',
			provenance: {
				source: 'test-pkg',
				repo: 'https://github.com/test/test',
				ref: 'v1.0.0',
				license: 'MIT',
			},
			loader: {
				entry: 'artifacts/test-em.cjs',
				moduleSystem: 'cjs',
				initStyle: 'factory',
				wasmSupply: 'auto',
			},
			artifacts: [
				{ vendor: 'test-em.cjs', role: 'loader' },
			],
			source: { package: 'test-pkg', version: '1.0.0' },
			vendored: [
				{ vendor: 'test-em.cjs', url: 'https://cdn.example.com/test-em.cjs' },
			],
			dependencies: [],
		}

		const dir = await vendorJsWasm(descriptor, { vendorRoot, root })

		// ── kit.json ────────────────────────────────────────────────────────
		const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
		const kitResult = KitJsonSchema.safeParse(kit)
		expect(kitResult.success, JSON.stringify(kitResult.error?.issues)).toBe(true)

		expect(kit.id).toBe(id)
		expect(kit.version).toBe(version)
		expect(kit.runtime).toBe('jswasm')
		expect(kit.verified).toBe(true)
		expect(kit.loader).toEqual(descriptor.loader)

		// Artifact sha256 matches the copied file
		expect(kit.artifacts).toHaveLength(1)
		const art = kit.artifacts[0]
		expect(art.file).toBe('artifacts/test-em.cjs')
		expect(art.sha256).toBe(await sha256File(join(dir, 'artifacts', 'test-em.cjs')))
		expect(art.url).toBe(artifactUrl(id, version, 'artifacts/test-em.cjs'))
		expect(art.role).toBe('loader')

		// ── recipe.json ─────────────────────────────────────────────────────
		const recipe = JSON.parse(readFileSync(join(dir, 'recipe.json'), 'utf8'))
		const recipeResult = RecipeSchema.safeParse(recipe)
		expect(recipeResult.success, JSON.stringify(recipeResult.error?.issues)).toBe(true)

		expect(recipe.kit).toBe(id)
		expect(recipe.track).toBe('jswasm-vendor')
		expect(recipe.family).toBe('emscripten')
		expect(recipe.source).toEqual({ package: 'test-pkg', version: '1.0.0' })
		expect(recipe.vendored).toHaveLength(1)
		expect(recipe.vendored[0].file).toBe('artifacts/test-em.cjs')
		expect(recipe.vendored[0].url).toBe('https://cdn.example.com/test-em.cjs')
		expect(recipe.vendored[0].sha256).toBe(art.sha256)

		// ── manifest.json was not overwritten ───────────────────────────────
		const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
		const manifestResult = ManifestSchema.safeParse(manifest)
		expect(manifestResult.success, JSON.stringify(manifestResult.error?.issues)).toBe(true)
		expect(manifest.kit).toBe(id)
		expect(manifest.mode).toBe('callable')
	})

	it('vendors a multi-artifact wasm-bindgen kit', async () => {
		tempRoot = mkdtempSync(join(tmpdir(), 'vendor-test-'))
		const root = join(tempRoot, 'kit')
		const vendorRoot = join(tempRoot, 'vendor')
		const id = 'test-wb'
		const version = '1.0.0-1.0.0'

		// Place fixture bytes
		const vendorDir = join(vendorRoot, 'jswasm', id)
		mkdirSync(vendorDir, { recursive: true })
		writeFileSync(join(vendorDir, 'index.js'), 'exports.greet = function() {}')
		writeFileSync(join(vendorDir, 'helper.js'), 'exports.init = function() {}')
		writeFileSync(join(vendorDir, 'test_bg.wasm'), Buffer.from([0, 97, 115, 109]))

		// Write hand-authored manifest
		writeTestManifest(join(root, id), id)

		const descriptor = {
			id,
			version,
			family: 'wasm-bindgen',
			tags: ['math'],
			tier: 'library',
			provenance: {
				source: 'test-wb-pkg',
				repo: 'https://github.com/test/test-wb',
				ref: 'v1.0.0',
				license: 'MIT',
			},
			loader: {
				entry: 'artifacts/index.js',
				moduleSystem: 'cjs',
				initStyle: 'none',
				wasmSupply: 'auto',
			},
			artifacts: [
				{ vendor: 'index.js', role: 'loader' },
				{ vendor: 'helper.js', role: 'loader' },
				{ vendor: 'test_bg.wasm', role: 'binary' },
			],
			source: { package: 'test-wb-pkg', version: '1.0.0' },
			vendored: [
				{ vendor: 'index.js', url: 'https://cdn.example.com/node/index.js' },
				{ vendor: 'helper.js', url: 'https://cdn.example.com/node/helper.js' },
				{ vendor: 'test_bg.wasm', url: 'https://cdn.example.com/node/test_bg.wasm' },
			],
			dependencies: [],
		}

		const dir = await vendorJsWasm(descriptor, { vendorRoot, root })

		// ── kit.json ────────────────────────────────────────────────────────
		const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
		const kitResult = KitJsonSchema.safeParse(kit)
		expect(kitResult.success, JSON.stringify(kitResult.error?.issues)).toBe(true)

		expect(kit.artifacts).toHaveLength(3)
		for (const art of kit.artifacts) {
			const copiedPath = join(dir, art.file)
			expect(art.sha256).toBe(await sha256File(copiedPath))
			expect(art.url).toBe(artifactUrl(id, version, art.file))
			expect(art.role).toBeDefined()
		}

		// Check roles: 2 loaders + 1 binary
		const roles = kit.artifacts.map((a) => a.role).sort()
		expect(roles).toEqual(['binary', 'loader', 'loader'])

		// ── recipe.json ─────────────────────────────────────────────────────
		const recipe = JSON.parse(readFileSync(join(dir, 'recipe.json'), 'utf8'))
		const recipeResult = RecipeSchema.safeParse(recipe)
		expect(recipeResult.success, JSON.stringify(recipeResult.error?.issues)).toBe(true)

		expect(recipe.vendored).toHaveLength(3)
		const recipeFiles = recipe.vendored.map((v) => v.file).sort()
		expect(recipeFiles).toEqual(['artifacts/helper.js', 'artifacts/index.js', 'artifacts/test_bg.wasm'])

		// Vendored urls match the descriptor
		for (const v of recipe.vendored) {
			const descEntry = descriptor.vendored.find((d) => `artifacts/${d.vendor}` === v.file)
			expect(descEntry, `vendored entry for ${v.file}`).toBeDefined()
			expect(v.url).toBe(descEntry.url)
		}
	})

	it('throws on malformed descriptor (missing loader) — fail-closed', async () => {
		tempRoot = mkdtempSync(join(tmpdir(), 'vendor-test-'))
		const root = join(tempRoot, 'kit')
		const vendorRoot = join(tempRoot, 'vendor')
		const id = 'test-bad'
		const version = '1.0.0-1.0.0'

		// Place fixture bytes
		const vendorDir = join(vendorRoot, 'jswasm', id)
		mkdirSync(vendorDir, { recursive: true })
		writeFileSync(join(vendorDir, 'test-bad.cjs'), 'broken')

		// Write hand-authored manifest
		writeTestManifest(join(root, id), id)

		const descriptor = {
			id,
			version,
			family: 'emscripten',
			tags: ['math'],
			tier: 'library',
			provenance: {
				source: 'test-pkg',
				repo: 'https://github.com/test/test',
				ref: 'v1.0.0',
				license: 'MIT',
			},
			// NO loader — jswasm runtime requires loader, so kit.json validation will fail
			artifacts: [
				{ vendor: 'test-bad.cjs', role: 'loader' },
			],
			source: { package: 'test-pkg', version: '1.0.0' },
			vendored: [
				{ vendor: 'test-bad.cjs', url: 'https://cdn.example.com/test-bad.cjs' },
			],
			dependencies: [],
		}

		await expect(vendorJsWasm(descriptor, { vendorRoot, root })).rejects.toThrow()

		// kit.json must NOT have been written (fail-closed)
		expect(existsSync(join(root, id, 'kit.json'))).toBe(false)
	})

	it('produces deterministic output (identical JSON across runs)', async () => {
		tempRoot = mkdtempSync(join(tmpdir(), 'vendor-test-'))
		const root1 = join(tempRoot, 'kit1')
		const root2 = join(tempRoot, 'kit2')
		const vendorRoot = join(tempRoot, 'vendor')
		const id = 'test-det'
		const version = '1.0.0-1.0.0'

		const vendorDir = join(vendorRoot, 'jswasm', id)
		mkdirSync(vendorDir, { recursive: true })
		writeFileSync(join(vendorDir, 'test-det.cjs'), 'deterministic content')

		const descriptor = {
			id,
			version,
			family: 'emscripten',
			tags: ['math'],
			tier: 'library',
			provenance: {
				source: 'test-pkg',
				repo: 'https://github.com/test/test',
				ref: 'v1.0.0',
				license: 'MIT',
			},
			loader: {
				entry: 'artifacts/test-det.cjs',
				moduleSystem: 'cjs',
				initStyle: 'factory',
				wasmSupply: 'auto',
			},
			artifacts: [
				{ vendor: 'test-det.cjs', role: 'loader' },
			],
			source: { package: 'test-pkg', version: '1.0.0' },
			vendored: [
				{ vendor: 'test-det.cjs', url: 'https://cdn.example.com/test-det.cjs' },
			],
			dependencies: [],
		}

		writeTestManifest(join(root1, id), id)
		writeTestManifest(join(root2, id), id)

		await vendorJsWasm(descriptor, { vendorRoot, root: root1 })
		await vendorJsWasm(descriptor, { vendorRoot, root: root2 })

		const kit1 = readFileSync(join(root1, id, 'kit.json'), 'utf8')
		const kit2 = readFileSync(join(root2, id, 'kit.json'), 'utf8')
		expect(kit1).toBe(kit2)

		const recipe1 = readFileSync(join(root1, id, 'recipe.json'), 'utf8')
		const recipe2 = readFileSync(join(root2, id, 'recipe.json'), 'utf8')
		expect(recipe1).toBe(recipe2)
	})
})

describe('JSWASM_KITS descriptors', () => {
	it('has 7 descriptors with valid fields and loader enums', async () => {
		const { JSWASM_KITS } = await import('../tooling/jswasm-vendor-data.mjs')
		expect(JSWASM_KITS).toHaveLength(7)

		const expectedIds = ['gmp', 'eigen', 'geos', 'geodesy', 'rapier2d', 'rapier3d', 'highs-js']
		expect(JSWASM_KITS.map((d) => d.id).sort()).toEqual(expectedIds.sort())

		for (const desc of JSWASM_KITS) {
			// ── Required descriptor fields ───────────────────────────────────
			expect(desc.id, `${desc.id} id`).toBeTypeOf('string')
			expect(desc.version, `${desc.id} version`).toBeTypeOf('string')
			expect(desc.family, `${desc.id} family`).toBeTypeOf('string')
			expect(['emscripten', 'wasm-bindgen']).toContain(desc.family)
			expect(desc.tags, `${desc.id} tags`).toBeInstanceOf(Array)
			expect(desc.tags.length, `${desc.id} tags count`).toBeGreaterThanOrEqual(1)
			expect(desc.tags.length, `${desc.id} tags count`).toBeLessThanOrEqual(3)
			expect(desc.tier, `${desc.id} tier`).toBe('library')
			expect(desc.provenance, `${desc.id} provenance`).toBeDefined()
			expect(desc.provenance.source, `${desc.id} provenance.source`).toBeTypeOf('string')
			expect(desc.provenance.repo, `${desc.id} provenance.repo`).toBeTypeOf('string')
			expect(desc.provenance.ref, `${desc.id} provenance.ref`).toBeTypeOf('string')
			expect(desc.provenance.license, `${desc.id} provenance.license`).toBeTypeOf('string')
			expect(desc.loader, `${desc.id} loader`).toBeDefined()
			expect(desc.artifacts, `${desc.id} artifacts`).toBeInstanceOf(Array)
			expect(desc.artifacts.length, `${desc.id} artifacts.length`).toBeGreaterThanOrEqual(1)
			expect(desc.source, `${desc.id} source`).toBeDefined()
			expect(desc.source.package, `${desc.id} source.package`).toBeTypeOf('string')
			expect(desc.source.version, `${desc.id} source.version`).toBeTypeOf('string')
			expect(desc.vendored, `${desc.id} vendored`).toBeInstanceOf(Array)
			expect(desc.vendored.length, `${desc.id} vendored.length`).toBeGreaterThanOrEqual(1)
			expect(desc.dependencies, `${desc.id} dependencies`).toEqual([])

			// Each artifact has a matching vendored entry
			for (const art of desc.artifacts) {
				expect(art.vendor, `${desc.id} art.vendor`).toBeTypeOf('string')
				expect(art.role, `${desc.id} art.role`).toBeTypeOf('string')
				const vendoredEntry = desc.vendored.find((v) => v.vendor === art.vendor)
				expect(vendoredEntry, `${desc.id} vendored entry for ${art.vendor}`).toBeDefined()
				expect(vendoredEntry.url, `${desc.id} vendored.url for ${art.vendor}`).toBeTypeOf('string')
			}

			// ── Validate loader enums via KitJsonSchema ─────────────────────
			// Build a mock kit.json from descriptor and validate through the
			// full schema — catches any typo in loader enum values offline.
			const ZERO_SHA = '0'.repeat(64)
			const mockKit = {
				id: desc.id,
				version: desc.version,
				runtime: 'jswasm',
				tags: desc.tags,
				tier: desc.tier,
				verified: true,
				provenance: desc.provenance,
				artifacts: desc.artifacts.map((a) => ({
					file: `artifacts/${a.vendor}`,
					sha256: ZERO_SHA,
					url: artifactUrl(desc.id, desc.version, `artifacts/${a.vendor}`),
					role: a.role,
				})),
				loader: desc.loader,
				dependencies: desc.dependencies,
			}
			const result = KitJsonSchema.safeParse(mockKit)
			expect(result.success, `${desc.id} kit.json schema: ${JSON.stringify(result.error?.issues)}`).toBe(true)
		}
	})
})
