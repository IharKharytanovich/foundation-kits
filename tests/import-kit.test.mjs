import { describe, it, expect, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { importKit } from '../tooling/import-kit.mjs'
import { KitJsonSchema, ManifestSchema, RecipeSchema } from '../tooling/lib/schema.mjs'
import { sha256File } from '../tooling/lib/sha256.mjs'

const TMP_ROOT = 'temp/_test_import_root'
const TMP_VENDOR = 'temp/_test_import_vendor'

afterEach(() => {
	rmSync(TMP_ROOT, { recursive: true, force: true })
	rmSync(TMP_VENDOR, { recursive: true, force: true })
})

function writeFakeVendor(subdir, filename, content = 'test-content-' + filename) {
	const dir = join(TMP_VENDOR, subdir)
	mkdirSync(dir, { recursive: true })
	writeFileSync(join(dir, filename), content)
}

describe('importKit', () => {
	it('imports a pyodide single-artifact kit with valid schemas and sha256', async () => {
		const vendorFile = 'fakelib-1.0.0-py3-none-any.whl'
		writeFakeVendor('pyodide', vendorFile)

		const descriptor = {
			id: 'fakelib',
			runtime: 'pyodide',
			version: '1.0.0',
			tags: ['util'],
			tier: 'library',
			provenance: { source: 'pypi', repo: 'https://github.com/fake/fakelib', ref: 'v1.0.0', license: 'MIT' },
			importName: 'fakelib',
			artifacts: [{ vendor: vendorFile }],
			recipeBase: 'https://cdn.example.com/',
			dependencies: [],
			golden: { code: "import fakelib; fakelib.hello()", expect: 'world' },
		}

		const dir = await importKit(descriptor, { vendorRoot: TMP_VENDOR, root: TMP_ROOT })

		// Verify files exist
		expect(existsSync(join(dir, 'kit.json'))).toBe(true)
		expect(existsSync(join(dir, 'recipe.json'))).toBe(true)
		expect(existsSync(join(dir, 'manifest.json'))).toBe(true)

		// Verify copied artifact exists
		const copiedPath = join(dir, 'artifacts', vendorFile)
		expect(existsSync(copiedPath)).toBe(true)

		// Parse and validate schemas
		const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
		const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
		const recipe = JSON.parse(readFileSync(join(dir, 'recipe.json'), 'utf8'))

		expect(KitJsonSchema.safeParse(kit).success).toBe(true)
		expect(ManifestSchema.safeParse(manifest).success).toBe(true)
		expect(RecipeSchema.safeParse(recipe).success).toBe(true)

		// Verify sha256 integrity
		const realSha = await sha256File(copiedPath)
		expect(kit.artifacts[0].sha256).toBe(realSha)

		// Verify distribution url is stamped
		expect(kit.artifacts[0].url).toBe(
			`https://github.com/IharKharytanovich/foundation-kids/releases/download/fakelib@1.0.0/${vendorFile}`,
		)

		// Verify kit.json fields
		expect(kit.id).toBe('fakelib')
		expect(kit.verified).toBe(true)
		expect(kit.tier).toBe('library')
		expect(kit.runtime).toBe('pyodide')

		// Verify manifest is loose with golden
		expect(manifest.mode).toBe('loose')
		expect(manifest.imports).toEqual(['fakelib'])
		expect(manifest.golden.code).toBe("import fakelib; fakelib.hello()")
		expect(manifest.golden.expect).toBe('world')

		// Verify recipe is pypi-vendor
		expect(recipe.track).toBe('pypi-vendor')
		expect(recipe.source.sha256).toBe(realSha)
	})

	it('imports a multi-artifact (bundled) pyodide kit', async () => {
		const mainFile = 'mainpkg-2.0.0-py3-none-any.whl'
		const bundledFile = 'helper-1.0.0-py3-none-any.whl'
		writeFakeVendor('pyodide', mainFile, 'main-content')
		writeFakeVendor('pyodide', bundledFile, 'bundled-content')

		const descriptor = {
			id: 'mainpkg',
			runtime: 'pyodide',
			version: '2.0.0',
			tags: ['math'],
			tier: 'library',
			provenance: { source: 'pypi', repo: 'https://github.com/fake/mainpkg', ref: 'v2.0.0', license: 'MIT' },
			importName: 'mainpkg',
			artifacts: [
				{ vendor: mainFile },
				{ vendor: bundledFile, bundled: true },
			],
			recipeBase: 'https://cdn.example.com/',
			dependencies: [],
			golden: { code: "import mainpkg", expect: 'ok' },
		}

		const dir = await importKit(descriptor, { vendorRoot: TMP_VENDOR, root: TMP_ROOT })

		const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
		const recipe = JSON.parse(readFileSync(join(dir, 'recipe.json'), 'utf8'))

		// Two artifacts in kit.json
		expect(kit.artifacts.length).toBe(2)
		expect(kit.artifacts[0].file).toBe(`artifacts/${mainFile}`)
		expect(kit.artifacts[1].file).toBe(`artifacts/${bundledFile}`)

		// Both artifacts have correct sha256
		for (const art of kit.artifacts) {
			const realSha = await sha256File(join(dir, art.file))
			expect(art.sha256).toBe(realSha)
		}

		// Recipe has bundled array
		expect(recipe.bundled).toBeDefined()
		expect(recipe.bundled.length).toBe(1)
		expect(recipe.bundled[0].file).toBe(`artifacts/${bundledFile}`)

		// Schemas still valid
		expect(KitJsonSchema.safeParse(kit).success).toBe(true)
		expect(RecipeSchema.safeParse(recipe).success).toBe(true)
	})

	it('imports a wasi kit with strict manifest skeleton', async () => {
		const wasmFile = 'FakeTool.wasm'
		writeFakeVendor('wasm', wasmFile, 'wasm-binary-content')

		const descriptor = {
			id: 'faketool',
			runtime: 'wasi',
			version: '1.0.0',
			tags: ['biology'],
			tier: 'library',
			provenance: { source: 'wasm', repo: 'https://github.com/fake/faketool', ref: 'v1.0.0', license: 'MIT' },
			artifacts: [{ vendor: wasmFile }],
			dependencies: [],
			wasiTools: ['FakeTool'],
			multiplexed: false,
			stdinAsFile: false,
			build: { dockerfile: 'build/wasi/Dockerfile', args: [], exclude: ['secret.c'] },
		}

		const dir = await importKit(descriptor, { vendorRoot: TMP_VENDOR, root: TMP_ROOT })

		const kit = JSON.parse(readFileSync(join(dir, 'kit.json'), 'utf8'))
		const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
		const recipe = JSON.parse(readFileSync(join(dir, 'recipe.json'), 'utf8'))

		// kit.json: wasi fields on main artifact
		expect(kit.artifacts[0].wasiTools).toEqual(['FakeTool'])
		expect(kit.artifacts[0].multiplexed).toBe(false)
		expect(kit.artifacts[0].stdinAsFile).toBe(false)
		expect(kit.runtime).toBe('wasi')

		// manifest: strict skeleton
		expect(manifest.mode).toBe('strict')
		expect(manifest.operations.length).toBe(1)
		expect(manifest.operations[0].tool).toBe('FakeTool')

		// recipe: wasi track
		expect(recipe.track).toBe('wasi')
		expect(recipe.build.exclude).toEqual(['secret.c'])

		// Schema validation
		expect(KitJsonSchema.safeParse(kit).success).toBe(true)
		expect(ManifestSchema.safeParse(manifest).success).toBe(true)
		expect(RecipeSchema.safeParse(recipe).success).toBe(true)
	})
})
