/**
 * Kit descriptors for batch-1 import (18 kits).
 *
 * Each descriptor carries the data needed by importKit() to produce
 * schema-valid kit.json + recipe.json + manifest.json from vendored bytes.
 *
 * Field notes:
 *  - `artifacts[].vendor`  exact filename in temp/vendor/{pyodide,wasm}/
 *  - `dependencies[].sha256` are constants (seed-kit or batch-internal shas)
 *  - `golden` is present on pyodide (loose) kits only; viennarna (wasi/strict)
 *    omits it and carries wasiTools/build instead
 *  - The importer computes each artifact's sha256 from the copied bytes —
 *    sha256 is never hand-entered for own artifacts
 *
 * Licenses were verified against each wheel's METADATA (2026-06-07).
 */

// ── shared sha256 constants (seed kits + batch-internal shared kits) ────────
const SHA_NUMPY    = '800c98edc0c864dfa49f07005680c699b4b42b84eae1f8cb19d35b3634e7f05c'
const SHA_SCIPY    = '7a60ad5e52acd8d8059f4acc0932d701c3e07723d82e567523dd1a6e0e85ec3e'
const SHA_PYTZ     = 'd7fb2f11cf7f8dd17e652d5494189f520ee086e9fc71aef4cbb978f5dcfc2878'
const SHA_PACKAGING = '7a0e80a4de677fefa2782ea4d34063708a3ac3d54469298f22cedcc4c7bebb4b'
const SHA_PYYAML   = '20b40e900704ae4e204a9978d9806f148205df4cbdf44b5eb73a189254a72757'
const SHA_DECORATOR = '81065b3b127c99fac4de153a1ed398203e3ae35bd5d0e9e9556fbc3fdc266aaf'
const SHA_SETUPTOOLS = 'dd243683e935cb91182252a618555082644e5f58b2274f394ddf8eeb237262ad'
const SHA_JOBLIB   = 'f07902625672ca0d92e979870ff501e4138589ff3b2b734680d07863676f9996'

const CDN = 'https://cdn.jsdelivr.net/pyodide/v0.28.0/full/'

export const KITS = [
	// ── capability kits ─────────────────────────────────────────────────────

	{
		id: 'pandas',
		runtime: 'pyodide',
		version: '2.3.3',
		tags: ['data-science', 'core'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/pandas-dev/pandas',
			ref: 'v2.3.3',
			license: 'BSD-3-Clause',
		},
		importName: 'pandas',
		artifacts: [
			{ vendor: 'pandas-2.3.3-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
			{ vendor: 'python_dateutil-2.9.0.post0-py2.py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'pytz', version: '2025.2', sha256: SHA_PYTZ },
		],
		golden: {
			code: "import pandas as pd; str(pd.Series([1,2,3]).sum())",
			expect: '6',
		},
	},

	{
		id: 'astropy',
		runtime: 'pyodide',
		version: '7.0.1',
		tags: ['physics', 'astronomy'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/astropy/astropy',
			ref: 'v7.0.1',
			license: 'BSD-3-Clause',
		},
		importName: 'astropy',
		artifacts: [
			{ vendor: 'astropy-7.0.1-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
			{ vendor: 'pyerfa-2.0.1.5-cp39-abi3-pyemscripten_2025_0_wasm32.whl', bundled: true },
			{ vendor: 'astropy_iers_data-0.2025.3.10.0.29.26-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
			{ id: 'pyyaml', version: '6.0.2', sha256: SHA_PYYAML },
		],
		golden: {
			code: "from astropy import units as u; str((1*u.km).to(u.m).value)",
			expect: '1000.0',
		},
	},

	{
		id: 'scikit-learn',
		runtime: 'pyodide',
		version: '1.7.0',
		tags: ['data-science', 'ml'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/scikit-learn/scikit-learn',
			ref: 'v1.7.0',
			license: 'BSD-3-Clause',
		},
		importName: 'sklearn',
		artifacts: [
			{ vendor: 'scikit_learn-1.7.0-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
			{ vendor: 'threadpoolctl-3.5.0-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'joblib', version: '1.4.2', sha256: SHA_JOBLIB },
		],
		golden: {
			code: "from sklearn.linear_model import LinearRegression as L; str(round(float(L().fit([[0],[1],[2]],[0,1,2]).coef_[0]),1))",
			expect: '1.0',
		},
	},

	{
		id: 'networkx',
		runtime: 'pyodide',
		version: '3.4.2',
		tags: ['graphs', 'biology'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/networkx/networkx',
			ref: 'v3.4.2',
			license: 'BSD-3-Clause',
		},
		importName: 'networkx',
		artifacts: [
			{ vendor: 'networkx-3.4.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'decorator', version: '5.2.1', sha256: SHA_DECORATOR },
			{ id: 'setuptools', version: '76.0.0', sha256: SHA_SETUPTOOLS },
		],
		golden: {
			code: "import networkx as nx; str(nx.shortest_path_length(nx.path_graph(3),0,2))",
			expect: '2',
		},
	},

	{
		id: 'biopython',
		runtime: 'pyodide',
		version: '1.85',
		tags: ['biology', 'sequences'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/biopython/biopython',
			ref: 'v1.85',
			license: 'Biopython',
		},
		importName: 'Bio',
		artifacts: [
			{ vendor: 'biopython-1.85-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		golden: {
			code: "from Bio.Seq import Seq; str(Seq('ATGC').reverse_complement())",
			expect: 'GCAT',
		},
	},

	{
		id: 'molmass',
		runtime: 'pyodide',
		version: '2026.1.8',
		tags: ['chemistry', 'biology'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/cgohlke/molmass',
			ref: 'v2026.1.8',
			license: 'BSD-3-Clause',
		},
		importName: 'molmass',
		artifacts: [
			{ vendor: 'molmass-2026.1.8-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "from molmass import Formula; str(round(Formula('H2O').mass,3))",
			expect: '18.015',
		},
	},

	{
		id: 'selfies',
		runtime: 'pyodide',
		version: '2.2.0',
		tags: ['chemistry', 'biology'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/aspuru-guzik-group/selfies',
			ref: 'v2.2.0',
			license: 'Apache-2.0',
		},
		importName: 'selfies',
		artifacts: [
			{ vendor: 'selfies-2.2.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import selfies; selfies.encoder('CCO')",
			expect: '[C][C][O]',
		},
	},

	{
		id: 'emcee',
		runtime: 'pyodide',
		version: '3.1.6',
		tags: ['statistics', 'sampling'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/dfm/emcee',
			ref: 'v3.1.6',
			license: 'MIT',
		},
		importName: 'emcee',
		artifacts: [
			{ vendor: 'emcee-3.1.6-py2.py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Stochastic library — golden is a version-string smoke test (golden.md)
		golden: {
			code: "import emcee; emcee.__version__",
			expect: '3.1.6',
		},
	},

	{
		id: 'pyrodigal',
		runtime: 'pyodide',
		version: '3.7.0',
		tags: ['biology', 'genomics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/althonos/pyrodigal',
			ref: 'v3.7.0',
			license: 'GPL-3.0-or-later',
		},
		importName: 'pyrodigal',
		artifacts: [
			{ vendor: 'pyrodigal-3.7.0-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// Training-dependent — golden is a version-string smoke test (golden.md)
		golden: {
			code: "import pyrodigal; pyrodigal.__version__",
			expect: '3.7.0',
		},
	},

	{
		id: 'dendropy',
		runtime: 'pyodide',
		version: '5.0.8',
		tags: ['biology', 'phylogenetics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/jeetsukumaran/DendroPy',
			ref: 'v5.0.8',
			license: 'BSD-3-Clause',
		},
		importName: 'dendropy',
		artifacts: [
			// Note: vendor filename has capital D (upstream casing); id is lowercase
			{ vendor: 'DendroPy-5.0.8-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import dendropy; str(len(dendropy.Tree.get(data='(A,(B,C));',schema='newick').leaf_nodes()))",
			expect: '3',
		},
	},

	// ── wasi kit ────────────────────────────────────────────────────────────

	{
		id: 'viennarna',
		runtime: 'wasi',
		version: '2.7.2',
		tags: ['biology', 'rna'],
		tier: 'library',
		provenance: {
			source: 'wasm',
			repo: 'https://github.com/ViennaRNA/ViennaRNA',
			ref: 'v2.7.2',
			license: 'ViennaRNA',
		},
		artifacts: [
			{ vendor: 'RNAfold.wasm' },
		],
		dependencies: [],
		// wasi-specific fields (no golden, no importName, no recipeBase)
		wasiTools: ['RNAfold'],
		multiplexed: false,
		stdinAsFile: false,
		build: {
			dockerfile: 'build/wasi/Dockerfile',
			args: [],
			exclude: ['naview.c'],
		},
	},

	// ── shared / utility kits ───────────────────────────────────────────────

	{
		id: 'pytz',
		runtime: 'pyodide',
		version: '2025.2',
		tags: ['time'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/stub42/pytz',
			ref: 'release_2025.2',
			license: 'MIT',
		},
		importName: 'pytz',
		artifacts: [
			{ vendor: 'pytz-2025.2-py2.py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import pytz; pytz.timezone('UTC').zone",
			expect: 'UTC',
		},
	},

	{
		id: 'packaging',
		runtime: 'pyodide',
		version: '26.2',
		tags: ['util'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/pypa/packaging',
			ref: 'v26.2',
			license: 'Apache-2.0',
		},
		importName: 'packaging',
		artifacts: [
			{ vendor: 'packaging-26.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "from packaging.version import Version as V; str(V('2.0')>V('1.0'))",
			expect: 'True',
		},
	},

	{
		id: 'joblib',
		runtime: 'pyodide',
		version: '1.4.2',
		tags: ['parallel', 'caching'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/joblib/joblib',
			ref: 'v1.4.2',
			license: 'BSD-3-Clause',
		},
		importName: 'joblib',
		artifacts: [
			{ vendor: 'joblib-1.4.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// joblib.hash uses pickle protocol 2 + md5. Deterministic for simple types.
		// Verified: python3 -c "import pickle,hashlib; print(hashlib.md5(pickle.dumps([1,2,3],protocol=2)).hexdigest())"
		// → ac03ee32f9d9f64d2504cbd93e913739  (Python 3.14, protocol 2)
		golden: {
			code: "import joblib; joblib.hash([1,2,3])",
			expect: 'ac03ee32f9d9f64d2504cbd93e913739',
		},
	},

	{
		id: 'dill',
		runtime: 'pyodide',
		version: '0.4.1',
		tags: ['serialization'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/uqfoundation/dill',
			ref: 'v0.4.1',
			license: 'BSD-3-Clause',
		},
		importName: 'dill',
		artifacts: [
			{ vendor: 'dill-0.4.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import dill; str(dill.loads(dill.dumps([1,2,3])))",
			expect: '[1, 2, 3]',
		},
	},

	{
		id: 'pyyaml',
		runtime: 'pyodide',
		version: '6.0.2',
		tags: ['serialization', 'util'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/yaml/pyyaml',
			ref: 'v6.0.2',
			license: 'MIT',
		},
		importName: 'yaml',
		artifacts: [
			{ vendor: 'pyyaml-6.0.2-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import yaml; str(yaml.safe_load('a: 1')['a'])",
			expect: '1',
		},
	},

	{
		id: 'decorator',
		runtime: 'pyodide',
		version: '5.2.1',
		tags: ['util'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/micheles/decorator',
			ref: 'v5.2.1',
			license: 'BSD-2-Clause',
		},
		importName: 'decorator',
		artifacts: [
			{ vendor: 'decorator-5.2.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "from decorator import decorator; str(callable(decorator))",
			expect: 'True',
		},
	},

	{
		id: 'setuptools',
		runtime: 'pyodide',
		version: '76.0.0',
		tags: ['util'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/pypa/setuptools',
			ref: 'v76.0.0',
			license: 'MIT',
		},
		importName: 'setuptools',
		artifacts: [
			{ vendor: 'setuptools-76.0.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import setuptools; setuptools.__version__",
			expect: '76.0.0',
		},
	},
]
