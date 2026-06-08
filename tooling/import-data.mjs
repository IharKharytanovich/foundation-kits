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
const SHA_SYMPY    = '87a5b10d3ce6001fe5db3634e73ecfdf1475478bc0dbc114ce5b8c6e7959485f'
const SHA_DILL     = '1e1ce33e978ae97fcfcff5638477032b801c46c7c65cf717f95fbc2248f79a9d'
const SHA_PANDAS   = '2579a3d8e9f040421836365ccf7886fc4054c87381d4d481840a97785cd78923'
const SHA_SCIKIT_LEARN = '5dd1611a1ee57147a4387e56499bb1def407919ef452efb50beb5229dbe4a3db'
const SHA_UNCERTAINTIES = '1f8f8c004a5c27e3baf88c84eb67b77a29e70cbd0bef1e5084fceb2ed7bcaf4d'

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
			buildNote: 'naview.c excluded from the build — it is non-redistributable under the ViennaRNA license. See recipe.build.exclude (architecture §11).',
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

	// ── batch-2 wave A kits ────────────────────────────────────────────────

	{
		id: 'uncertainties',
		runtime: 'pyodide',
		version: '3.2.2',
		tags: ['physics', 'statistics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/lmfit/uncertainties',
			ref: 'v3.2.2',
			license: 'BSD-3-Clause',
		},
		importName: 'uncertainties',
		artifacts: [
			{ vendor: 'uncertainties-3.2.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "from uncertainties import ufloat; str((ufloat(2.0, 0.1) + ufloat(3.0, 0.2)).nominal_value)",
			expect: '5.0',
		},
	},

	{
		id: 'six',
		runtime: 'pyodide',
		version: '1.17.0',
		tags: ['compat'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/benjaminp/six',
			ref: 'v1.17.0',
			license: 'MIT',
		},
		importName: 'six',
		artifacts: [
			{ vendor: 'six-1.17.0-py2.py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import six; str(six.PY3)",
			expect: 'True',
		},
	},

	{
		id: 'pint',
		runtime: 'pyodide',
		version: '0.25.3',
		tags: ['physics', 'units'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/hgrecco/pint',
			ref: 'v0.25.3',
			license: 'BSD-3-Clause',
		},
		importName: 'pint',
		artifacts: [
			{ vendor: 'pint-0.25.3-py3-none-any.whl' },
			{ vendor: 'flexcache-0.3-py3-none-any.whl', bundled: true },
			{ vendor: 'flexparser-0.4-py3-none-any.whl', bundled: true },
			{ vendor: 'platformdirs-4.3.6-py3-none-any.whl', bundled: true },
			{ vendor: 'typing_extensions-4.15.0-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import pint; str(pint.UnitRegistry()('1 km').to('m').magnitude)",
			expect: '1000.0',
		},
	},

	{
		id: 'findiff',
		runtime: 'pyodide',
		version: '0.13.1',
		tags: ['physics', 'math'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/maroba/findiff',
			ref: 'v0.13.1',
			license: 'MIT',
		},
		importName: 'findiff',
		artifacts: [
			{ vendor: 'findiff-0.13.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'sympy', version: '1.13.3', sha256: SHA_SYMPY },
		],
		golden: {
			code: "import numpy as np; from findiff import Diff; str(Diff(0, 1.0)(np.array([0.0, 1.0, 4.0, 9.0, 16.0]))[2])",
			expect: '4.0',
		},
	},

	{
		id: 'pywavelets',
		runtime: 'pyodide',
		version: '1.8.0',
		tags: ['physics', 'signal'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/PyWavelets/pywt',
			ref: 'v1.8.0',
			license: 'MIT',
		},
		importName: 'pywt',
		artifacts: [
			{ vendor: 'pywavelets-1.8.0-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		golden: {
			code: "import pywt; str(pywt.dwt_max_level(256, 'haar'))",
			expect: '8',
		},
	},

	// ── batch-2 wave B kits ────────────────────────────────────────────────

	{
		id: 'iminuit',
		runtime: 'pyodide',
		version: '2.30.1',
		tags: ['physics', 'fitting'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/scikit-hep/iminuit',
			ref: 'v2.30.1',
			license: 'MIT',
		},
		importName: 'iminuit',
		artifacts: [
			{ vendor: 'iminuit-2.30.1-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		golden: {
			code: "from iminuit import Minuit; str(round(Minuit(lambda x: (x-2)**2, x=0).migrad().values[0], 1))",
			expect: '2.0',
		},
	},

	{
		id: 'freesasa',
		runtime: 'pyodide',
		version: '2.2.1',
		tags: ['biology', 'structure'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/freesasa/freesasa',
			ref: 'v2.2.1',
			license: 'MIT',
		},
		importName: 'freesasa',
		artifacts: [
			{ vendor: 'freesasa-2.2.1-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// SASA computation requires protein structure input — golden uses
		// version-smoke because no deterministic no-input API can be verified
		// without runtime (compiled C extension, no Python source to inspect).
		golden: {
			code: "import freesasa; freesasa.__version__",
			expect: '2.2.1',
		},
	},

	{
		id: 'scikit-fem',
		runtime: 'pyodide',
		version: '12.0.1',
		tags: ['physics', 'pde'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/kinnala/scikit-fem',
			ref: 'v12.0.1',
			license: 'BSD-3-Clause',
		},
		importName: 'skfem',
		artifacts: [
			{ vendor: 'scikit_fem-12.0.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
		],
		golden: {
			code: "import skfem; str(skfem.MeshTri().p.shape[1])",
			expect: '4',
		},
	},

	{
		id: 'chaospy',
		runtime: 'pyodide',
		version: '4.3.21',
		tags: ['physics', 'uncertainty'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/jonathf/chaospy',
			ref: 'v4.3.21',
			license: 'MIT',
		},
		importName: 'chaospy',
		artifacts: [
			{ vendor: 'chaospy-4.3.21-py3-none-any.whl' },
			{ vendor: 'numpoly-1.2.14-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'setuptools', version: '76.0.0', sha256: SHA_SETUPTOOLS },
		],
		golden: {
			code: "import chaospy; str(float(chaospy.E(chaospy.Normal(0, 1))))",
			expect: '0.0',
		},
	},

	{
		id: 'dynesty',
		runtime: 'pyodide',
		version: '3.0.0',
		tags: ['statistics', 'sampling'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/joshspeagle/dynesty',
			ref: 'v3.0.0',
			license: 'MIT',
		},
		importName: 'dynesty',
		artifacts: [
			{ vendor: 'dynesty-3.0.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
		],
		// Stochastic nested sampling — golden is a version-string smoke test (golden.md).
		// matplotlib is an unconditional METADATA dep but cannot be provided in Pyodide
		// (native/heavy); plotting functions are unavailable — documented in instruction.md.
		golden: {
			code: "import dynesty; dynesty.__version__",
			expect: '3.0.0',
		},
	},

	// ── batch-2 wave C kits (special handling) ─────────────────────────────

	{
		id: 'lmfit',
		runtime: 'pyodide',
		version: '1.3.4',
		tags: ['physics', 'fitting'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/lmfit/lmfit-py',
			ref: 'v1.3.4',
			license: 'BSD-3-Clause',
		},
		importName: 'lmfit',
		artifacts: [
			{ vendor: 'lmfit-1.3.4-py3-none-any.whl' },
			{ vendor: 'asteval-1.0.8-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'uncertainties', version: '3.2.2', sha256: SHA_UNCERTAINTIES },
			{ id: 'dill', version: '0.4.1', sha256: SHA_DILL },
		],
		// Deterministic optimisation — golden exercises a simple linear fit (golden.md).
		golden: {
			code: "from lmfit.models import LinearModel; import numpy as np; str(round(LinearModel().fit(np.array([0.,2.,4.]), x=np.array([0.,1.,2.])).params['slope'].value, 1))",
			expect: '2.0',
		},
	},

	{
		id: 'salib',
		runtime: 'pyodide',
		version: '1.5.2',
		tags: ['statistics', 'uncertainty'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/SALib/SALib',
			ref: 'v1.5.2',
			license: 'MIT',
		},
		importName: 'SALib',
		artifacts: [
			{ vendor: 'salib-1.5.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
		],
		// Stochastic sensitivity analysis — golden is a version-string smoke test (golden.md).
		// matplotlib and multiprocess are unconditional METADATA deps but cannot be provided
		// in Pyodide (native/heavy, no real multiprocessing); documented in instruction.md.
		golden: {
			code: "import SALib; from importlib.metadata import version; version('SALib')",
			expect: '1.5.2',
		},
	},

	{
		id: 'deap',
		runtime: 'pyodide',
		version: '1.4.4',
		tags: ['statistics', 'optimization'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/DEAP/deap',
			ref: 'v1.4.4',
			license: 'LGPL-3.0-or-later',
		},
		importName: 'deap',
		artifacts: [
			{ vendor: 'deap-1.4.4-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Stochastic evolutionary algorithms — golden is a version-string smoke test (golden.md).
		// moocore is an unconditional METADATA dep but is a native C ext not available in Pyodide;
		// hypervolume indicator functions are unavailable — documented in instruction.md.
		golden: {
			code: "import deap; deap.__revision__",
			expect: '1.4.4',
		},
	},

	{
		id: 'scikit-optimize',
		runtime: 'pyodide',
		version: '0.10.2',
		tags: ['statistics', 'optimization'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/holgern/scikit-optimize',
			ref: 'v0.10.2',
			license: 'BSD-3-Clause',
		},
		importName: 'skopt',
		artifacts: [
			{ vendor: 'scikit_optimize-0.10.2-py2.py3-none-any.whl' },
			{ vendor: 'pyaml-26.2.1-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'scikit-learn', version: '1.7.0', sha256: SHA_SCIKIT_LEARN },
			{ id: 'joblib', version: '1.4.2', sha256: SHA_JOBLIB },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
			{ id: 'pyyaml', version: '6.0.2', sha256: SHA_PYYAML },
		],
		// Stochastic Bayesian optimization — golden is a version-string smoke test (golden.md).
		golden: {
			code: "import skopt; skopt.__version__",
			expect: '0.10.2',
		},
	},
]
