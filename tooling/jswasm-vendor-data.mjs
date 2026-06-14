/**
 * JSWASM kit descriptors for the vendor helper.
 *
 * Each descriptor carries the data needed by vendorJsWasm() to produce
 * schema-valid kit.json + recipe.json from prebuilt bytes downloaded into the
 * vendor staging directory.
 *
 * Field notes:
 *  - `artifacts[].vendor`  exact filename in temp/vendor/jswasm/<id>/
 *  - `artifacts[].role`    artifact role (loader | binary)
 *  - `loader`              copied verbatim into kit.json.loader
 *  - `loader.entry`        uses the `artifacts/` prefix (matches kit.json convention)
 *  - `source`              npm package provenance (package name + version)
 *  - `vendored[].vendor`   filename matching artifacts[].vendor
 *  - `vendored[].url`      public CDN URL used by the download step (phase 03)
 *  - The helper computes each artifact's sha256 from the copied bytes —
 *    sha256 is never hand-entered for own artifacts
 *
 * Licenses verified against each package's shipped LICENSE (2026-06-08).
 * All tokens are in REDISTRIBUTABLE (tooling/lib/license-policy.mjs).
 */

export const JSWASM_KITS = [
	// ── Emscripten kits ─────────────────────────────────────────────────────

	{
		id: 'gmp',
		version: '1.3.2-1.0.0',
		family: 'emscripten',
		tags: ['math'],
		tier: 'library',
		provenance: {
			source: 'gmp-wasm',
			repo: 'https://github.com/Daninet/gmp-wasm',
			ref: 'v1.3.2',
			license: 'LGPL-3.0-only',
			buildNote: 'Single-threaded Emscripten build; wasm base64-inlined in loader',
		},
		loader: {
			entry: 'artifacts/gmp.cjs',
			moduleSystem: 'cjs',
			initStyle: 'factory',
			wasmSupply: 'auto',
			initExport: 'init',
		},
		artifacts: [
			{ vendor: 'gmp.cjs', role: 'loader' },
		],
		source: { package: 'gmp-wasm', version: '1.3.2' },
		vendored: [
			{ vendor: 'gmp.cjs', url: 'https://cdn.jsdelivr.net/npm/gmp-wasm@1.3.2/dist/index.umd.min.js' },
		],
		dependencies: [],
	},

	{
		id: 'eigen',
		version: '0.2.2-1.0.0',
		family: 'emscripten',
		tags: ['math'],
		tier: 'library',
		provenance: {
			source: 'eigen',
			repo: 'https://github.com/BertrandBev/eigen-js',
			ref: 'v0.2.2',
			license: 'MIT',
			buildNote: 'Single-threaded Emscripten build; wasm base64-inlined in loader; embeds Eigen-C++ MPL-2.0 (see LICENSE)',
		},
		loader: {
			entry: 'artifacts/eigen.cjs',
			moduleSystem: 'cjs',
			initStyle: 'default-init',
			wasmSupply: 'auto',
		},
		artifacts: [
			{ vendor: 'eigen.cjs', role: 'loader' },
		],
		source: { package: 'eigen', version: '0.2.2' },
		vendored: [
			{ vendor: 'eigen.cjs', url: 'https://cdn.jsdelivr.net/npm/eigen@0.2.2/dist/index.js' },
		],
		dependencies: [],
	},

	{
		id: 'geos',
		version: '3.1.1-1.0.0',
		family: 'emscripten',
		tags: ['graphs'],
		tier: 'library',
		provenance: {
			source: 'geos-wasm',
			repo: 'https://github.com/chrispahm/geos-wasm',
			ref: 'v3.1.1',
			license: 'LGPL-3.0-or-later',
			buildNote: 'Single-threaded Emscripten build; wasm base64-inlined in loader',
		},
		loader: {
			entry: 'artifacts/geos.mjs',
			moduleSystem: 'esm',
			initStyle: 'factory',
			wasmSupply: 'auto',
		},
		artifacts: [
			{ vendor: 'geos.mjs', role: 'loader' },
		],
		source: { package: 'geos-wasm', version: '3.1.1' },
		vendored: [
			{ vendor: 'geos.mjs', url: 'https://cdn.jsdelivr.net/npm/geos-wasm@3.1.1/build/package/geos.esm.js' },
		],
		dependencies: [],
	},

	// ── wasm-bindgen kits ───────────────────────────────────────────────────

	{
		id: 'geodesy',
		version: '0.7.0-1.0.0',
		family: 'wasm-bindgen',
		tags: ['units'],
		tier: 'library',
		provenance: {
			source: 'geodesy-wasm',
			repo: 'https://github.com/Rennzie/geodesy-wasm',
			ref: 'v0.7.0',
			license: 'Apache-2.0',
			buildNote: 'Single-threaded wasm-bindgen build; separate .wasm binary; dual Apache-2.0 OR MIT (recorded Apache-2.0)',
		},
		loader: {
			entry: 'artifacts/index.js',
			moduleSystem: 'cjs',
			initStyle: 'none',
			wasmSupply: 'auto',
		},
		artifacts: [
			{ vendor: 'index.js', role: 'loader' },
			{ vendor: 'geodesy-wasm.js', role: 'loader' },
			{ vendor: 'geodesy-wasm_bg.wasm', role: 'binary' },
		],
		source: { package: 'geodesy-wasm', version: '0.7.0' },
		vendored: [
			{ vendor: 'index.js', url: 'https://cdn.jsdelivr.net/npm/geodesy-wasm@0.7.0/node/index.js' },
			{ vendor: 'geodesy-wasm.js', url: 'https://cdn.jsdelivr.net/npm/geodesy-wasm@0.7.0/node/geodesy-wasm.js' },
			{ vendor: 'geodesy-wasm_bg.wasm', url: 'https://cdn.jsdelivr.net/npm/geodesy-wasm@0.7.0/node/geodesy-wasm_bg.wasm' },
		],
		dependencies: [],
	},

	{
		id: 'rapier2d',
		version: '0.19.3-1.0.0',
		family: 'wasm-bindgen',
		tags: ['physics'],
		tier: 'library',
		provenance: {
			source: '@dimforge/rapier2d-compat',
			repo: 'https://github.com/dimforge/rapier.js',
			ref: 'v0.19.3',
			license: 'Apache-2.0',
			buildNote: 'Single-threaded wasm-bindgen build; wasm base64-inlined in loader',
		},
		loader: {
			entry: 'artifacts/rapier2d.cjs',
			moduleSystem: 'cjs',
			initStyle: 'default-init',
			wasmSupply: 'auto',
			initExport: 'init',
		},
		artifacts: [
			{ vendor: 'rapier2d.cjs', role: 'loader' },
		],
		source: { package: '@dimforge/rapier2d-compat', version: '0.19.3' },
		vendored: [
			{ vendor: 'rapier2d.cjs', url: 'https://cdn.jsdelivr.net/npm/@dimforge/rapier2d-compat@0.19.3/rapier.cjs' },
		],
		dependencies: [],
	},

	{
		id: 'rapier3d',
		version: '0.19.3-1.0.0',
		family: 'wasm-bindgen',
		tags: ['physics'],
		tier: 'library',
		provenance: {
			source: '@dimforge/rapier3d-compat',
			repo: 'https://github.com/dimforge/rapier.js',
			ref: 'v0.19.3',
			license: 'Apache-2.0',
			buildNote: 'Single-threaded wasm-bindgen build; wasm base64-inlined in loader',
		},
		loader: {
			entry: 'artifacts/rapier3d.cjs',
			moduleSystem: 'cjs',
			initStyle: 'default-init',
			wasmSupply: 'auto',
			initExport: 'init',
		},
		artifacts: [
			{ vendor: 'rapier3d.cjs', role: 'loader' },
		],
		source: { package: '@dimforge/rapier3d-compat', version: '0.19.3' },
		vendored: [
			{ vendor: 'rapier3d.cjs', url: 'https://cdn.jsdelivr.net/npm/@dimforge/rapier3d-compat@0.19.3/rapier.cjs' },
		],
		dependencies: [],
	},

	// ── Emscripten kits (batch-3) ──────────────────────────────────────────

	{
		id: 'highs-js',
		version: '1.14.2-1.0.0',
		family: 'emscripten',
		tags: ['optimization', 'math'],
		tier: 'library',
		provenance: {
			source: 'highs',
			repo: 'https://github.com/lovasoa/highs-js',
			ref: 'v1.14.2',
			license: 'MIT',
			buildNote: 'Single-threaded Emscripten build (no pthreads/SAB/Worker)',
		},
		loader: {
			entry: 'artifacts/highs.js',
			moduleSystem: 'cjs',
			initStyle: 'factory',
			wasmSupply: 'locateFile',
		},
		artifacts: [
			{ vendor: 'highs.js', role: 'loader' },
			{ vendor: 'highs.wasm', role: 'binary' },
		],
		source: { package: 'highs', version: '1.14.2' },
		vendored: [
			{ vendor: 'highs.js', url: 'https://cdn.jsdelivr.net/npm/highs@1.14.2/build/highs.js' },
			{ vendor: 'highs.wasm', url: 'https://cdn.jsdelivr.net/npm/highs@1.14.2/build/highs.wasm' },
		],
		dependencies: [],
	},

	// ── batch-4 Emscripten kits ────────────────────────────────────────────

	{
		id: 'manifold',
		version: '3.5.1-1.0.0',
		family: 'emscripten',
		tags: ['math', 'structure'],
		tier: 'library',
		provenance: {
			source: 'manifold-3d',
			repo: 'https://github.com/elalish/manifold',
			ref: 'v3.5.1',
			license: 'Apache-2.0',
			buildNote: 'Single-threaded Emscripten build; separate .wasm binary; manifold.js is ESM (type:module)',
		},
		loader: {
			entry: 'artifacts/manifold.js',
			moduleSystem: 'esm',
			initStyle: 'factory',
			wasmSupply: 'locateFile',
		},
		artifacts: [
			{ vendor: 'manifold.js', role: 'loader' },
			{ vendor: 'manifold.wasm', role: 'binary' },
		],
		source: { package: 'manifold-3d', version: '3.5.1' },
		vendored: [
			{ vendor: 'manifold.js', url: 'https://cdn.jsdelivr.net/npm/manifold-3d@3.5.1/manifold.js' },
			{ vendor: 'manifold.wasm', url: 'https://cdn.jsdelivr.net/npm/manifold-3d@3.5.1/manifold.wasm' },
		],
		dependencies: [],
	},

	{
		id: 'meshoptimizer',
		version: '1.1.1-1.0.0',
		family: 'emscripten',
		tags: ['math', 'structure'],
		tier: 'library',
		provenance: {
			source: 'meshoptimizer',
			repo: 'https://github.com/zeux/meshoptimizer',
			ref: 'v1.1.1',
			license: 'MIT',
			buildNote: 'Single-threaded WASM build (wasi-sdk); base64-inlined wasm in each JS module; five ESM files with inter-module re-exports',
		},
		loader: {
			entry: 'artifacts/index.js',
			moduleSystem: 'esm',
			initStyle: 'none',
			wasmSupply: 'auto',
		},
		artifacts: [
			{ vendor: 'index.js', role: 'loader' },
			{ vendor: 'meshopt_simplifier.js', role: 'loader' },
			{ vendor: 'meshopt_encoder.js', role: 'loader' },
			{ vendor: 'meshopt_decoder.mjs', role: 'loader' },
			{ vendor: 'meshopt_clusterizer.js', role: 'loader' },
		],
		source: { package: 'meshoptimizer', version: '1.1.1' },
		vendored: [
			{ vendor: 'index.js', url: 'https://cdn.jsdelivr.net/npm/meshoptimizer@1.1.1/index.js' },
			{ vendor: 'meshopt_simplifier.js', url: 'https://cdn.jsdelivr.net/npm/meshoptimizer@1.1.1/meshopt_simplifier.js' },
			{ vendor: 'meshopt_encoder.js', url: 'https://cdn.jsdelivr.net/npm/meshoptimizer@1.1.1/meshopt_encoder.js' },
			{ vendor: 'meshopt_decoder.mjs', url: 'https://cdn.jsdelivr.net/npm/meshoptimizer@1.1.1/meshopt_decoder.mjs' },
			{ vendor: 'meshopt_clusterizer.js', url: 'https://cdn.jsdelivr.net/npm/meshoptimizer@1.1.1/meshopt_clusterizer.js' },
		],
		dependencies: [],
	},

	// ── batch-6 Emscripten kits ────────────────────────────────────────────

	{
		id: 'coolprop',
		version: '7.2.0-1.0.0',
		family: 'emscripten',
		tags: ['chemistry', 'physics'],
		tier: 'library',
		provenance: {
			source: 'CoolProp',
			repo: 'https://github.com/CoolProp/CoolProp',
			ref: 'v7.2.0',
			license: 'MIT',
			buildNote: 'Official single-threaded Emscripten build; vendored from SourceForge',
		},
		loader: {
			entry: 'artifacts/coolprop.js',
			moduleSystem: 'esm',
			initStyle: 'factory',
			wasmSupply: 'locateFile',
		},
		artifacts: [
			{ vendor: 'coolprop.js', role: 'loader' },
			{ vendor: 'coolprop.wasm', role: 'binary' },
		],
		source: { package: 'CoolProp', version: '7.2.0' },
		vendored: [
			{ vendor: 'coolprop.js', url: 'https://sourceforge.net/projects/coolprop/files/CoolProp/7.2.0/Javascript/coolprop.js/download' },
			{ vendor: 'coolprop.wasm', url: 'https://sourceforge.net/projects/coolprop/files/CoolProp/7.2.0/Javascript/coolprop.wasm/download' },
		],
		dependencies: [],
	},
]
