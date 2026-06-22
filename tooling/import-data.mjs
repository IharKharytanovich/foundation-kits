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
const SHA_NETWORKX = '27b25a9226b329f00711026e8af0f865c4f193e32fe6c38c38f76542da317d76'
const SHA_TIFFFILE  = '0d7382d2769b855b81ce358528e2b40c16d48aa39031746efa81215205332a8d'
const SHA_PYWAVELETS = 'e8b11d6ad77ce1a53875b46a2315415b20863da5830e81833739920d12b75237'
const SHA_AUTOGRAD  = '4ab9084294f814cf56c280adbe19612546a35574d67c574b04933c7d2ecb7d78'

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
			{ vendor: 'viennarna.wasm' },
		],
		dependencies: [],
		// wasi-specific fields (no golden, no importName, no recipeBase)
		// One multiplexed binary dispatches all 25 ViennaRNA CLI on argv[1]
		// (build/wasi/tools.json is the source of truth for the tool list).
		wasiTools: [
			'RNA2Dfold', 'RNALalifold', 'RNALfold', 'RNAPKplex', 'RNAaliduplex',
			'RNAalifold', 'RNAcofold', 'RNAdistance', 'RNAdos', 'RNAduplex',
			'RNAeval', 'RNAfold', 'RNAheat', 'RNAinverse', 'RNAmultifold',
			'RNApaln', 'RNAparconv', 'RNApdist', 'RNAplex', 'RNAplfold',
			'RNAplot', 'RNApvmin', 'RNAsnoop', 'RNAsubopt', 'RNAup',
		],
		multiplexed: true,
		stdinAsFile: false,
		build: {
			dockerfile: 'build/wasi/Dockerfile',
			args: [
				'--host=wasm32-wasi',
				'--disable-openmp',
				'--disable-pthreads',
				'--without-perl',
				'--without-python',
				'--without-swig',
				'--without-gsl',
				'--disable-mpfr',
				'--without-svm',
				'--without-rnaxplorer',
				'--without-forester',
				'--without-kinfold',
				'--disable-naview',
			],
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

	// ── batch-3 capability kits ────────────────────────────────────────────

	{
		id: 'periodictable',
		runtime: 'pyodide',
		version: '2.1.0',
		tags: ['chemistry', 'physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/python-periodictable/periodictable',
			ref: 'v2.1.0',
			license: 'PublicDomain',
			buildNote: 'Public domain except cromerman.py which is BSD-3-Clause',
		},
		importName: 'periodictable',
		artifacts: [
			{ vendor: 'periodictable-2.1.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/44/0d/f494a2ec62ab56ffd44da4f236db374421fe0cd1e39d9ebc9785751eb432/periodictable-2.1.0-py3-none-any.whl' },
			{ vendor: 'pyparsing-3.2.3-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/05/e7/df2285f3d08fee213f2d041540fa4fc9ca6c2d44cf36d3a035bf2a8d2bcc/pyparsing-3.2.3-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Element lookup — deterministic physical constant (golden.md).
		golden: {
			code: "import periodictable; '%.4f'%periodictable.Fe.mass",
			expect: '55.8450',
		},
	},

	{
		id: 'sgp4',
		runtime: 'pyodide',
		version: '2.25',
		tags: ['astronomy', 'physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/brandon-rhodes/python-sgp4',
			ref: 'v2.25',
			license: 'MIT',
		},
		importName: 'sgp4',
		artifacts: [
			{ vendor: 'sgp4-2.25-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/3a/47/8231e3d4a88341316ec8d0eb98d3a8a972477d8b038555259522735a8371/sgp4-2.25-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// ISS TLE propagation — pure deterministic orbital mechanics (golden.md).
		golden: {
			code: "from sgp4.api import Satrec,WGS72,jday; s='1 25544U 98067A   19356.27756250  .00001029  00000-0  27858-4 0  9992'; t='2 25544  51.6430 178.1191 0007597  68.3804  18.1540 15.44074047202482'; sat=Satrec.twoline2rv(s,t,WGS72); e,r,v=sat.sgp4(*jday(2019,12,20,12,0,0)); '%.4f, %.4f, %.4f'%(r[0],r[1],r[2])",
			expect: '-1570.5335, 4022.6890, -5279.8660',
		},
	},

	{
		id: 'earcut',
		runtime: 'pyodide',
		version: '1.1.5',
		tags: ['math', 'structure'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/vojtatom/earcut-python',
			ref: 'v1.1.5',
			license: 'ISC',
		},
		importName: 'earcut',
		artifacts: [
			// Built from sdist (no published wheel); sourceUrl points at the sdist for provenance.
			{ vendor: 'earcut-1.1.5-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/d8/cd/47b84c0381bb13c3d76f68a49d5c16c7aecda29adebb34fa38730315abd7/earcut-1.1.5.tar.gz' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Polygon triangulation — verified deterministic output (golden.md).
		golden: {
			code: "from earcut.earcut import earcut; str(earcut([0,0,1,0,1,1,0,1]))",
			expect: '[2, 3, 0, 0, 1, 2]',
		},
	},

	{
		id: 'autograd',
		runtime: 'pyodide',
		version: '1.8.0',
		tags: ['math', 'optimization'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/HIPS/autograd',
			ref: 'v1.8.0',
			license: 'MIT',
		},
		importName: 'autograd',
		artifacts: [
			{ vendor: 'autograd-1.8.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/84/ea/e16f0c423f7d83cf8b79cae9452040fb7b2e020c7439a167ee7c317de448/autograd-1.8.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Reverse-mode AD — grad of x³ at x=2 is 3·4=12 (golden.md).
		golden: {
			code: "from autograd import grad; str(grad(lambda x: x**3)(2.0))",
			expect: '12.0',
		},
	},

	{
		id: 'thermo',
		runtime: 'pyodide',
		version: '0.6.0',
		tags: ['chemistry', 'physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/CalebBell/thermo',
			ref: 'v0.6.0',
			license: 'MIT',
		},
		importName: 'thermo',
		artifacts: [
			{ vendor: 'thermo-0.6.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/8e/bb/37c92edbeb224c54572c7bb486acd7cb0970303e02bf03dacca4a0d74be1/thermo-0.6.0-py3-none-any.whl' },
			{ vendor: 'fluids-1.3.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/a4/54/b1a42925983c900e436a5b646f301d5e3e7ffb47a2db240d9dbbe0cd7c21/fluids-1.3.0-py3-none-any.whl' },
			{ vendor: 'chemicals-1.5.2-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/22/f5/59eea489c5faf02e651744057bb93d89aacf6c3c3f404abbc4217b7ceae1/chemicals-1.5.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
		],
		// Water heat capacity at 300 K — deterministic thermodynamic property (golden.md).
		golden: {
			code: "from thermo import Chemical; c = Chemical('water', T=300, P=101325); '%.6f' % c.Cp",
			expect: '4180.633831',
		},
	},

	{
		id: 'chempy',
		runtime: 'pyodide',
		version: '0.10.1',
		tags: ['chemistry'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/bjodah/chempy',
			ref: 'v0.10.1',
			license: 'BSD-2-Clause',
		},
		importName: 'chempy',
		artifacts: [
			{ vendor: 'chempy-0.10.1-py2.py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/2e/2f/150990a9106175457f5cefe43bedc7f73c0a535bc783e8043252e941ceee/chempy-0.10.1-py2.py3-none-any.whl' },
			{ vendor: 'pyparsing-3.2.3-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/05/e7/df2285f3d08fee213f2d041540fa4fc9ca6c2d44cf36d3a035bf2a8d2bcc/pyparsing-3.2.3-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'sympy', version: '1.13.3', sha256: SHA_SYMPY },
		],
		// Ethane combustion balance — deterministic stoichiometry (golden.md).
		golden: {
			code: "from chempy import balance_stoichiometry; r,p=balance_stoichiometry({'C2H6','O2'},{'CO2','H2O'}); str(dict(sorted(r.items())))+' -> '+str(dict(sorted(p.items())))",
			expect: "{'C2H6': 2, 'O2': 7} -> {'CO2': 4, 'H2O': 6}",
		},
	},

	{
		id: 'mendeleev',
		runtime: 'pyodide',
		version: '1.1.0',
		tags: ['chemistry'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/lmmentel/mendeleev',
			ref: 'v1.1.0',
			license: 'MIT',
		},
		importName: 'mendeleev',
		artifacts: [
			{ vendor: 'mendeleev-1.1.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/a9/d3/c94840c7e282c18979513ac257d5099efb0a4149df933d132d75d9229158/mendeleev-1.1.0-py3-none-any.whl' },
			{ vendor: 'sqlalchemy-2.0.39-cp313-cp313-pyemscripten_2025_0_wasm32.whl', bundled: true,
			  sourceUrl: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/sqlalchemy-2.0.39-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
			{ vendor: 'typing_extensions-4.15.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/typing_extensions-4.15.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
		],
		// Iron atomic weight from bundled SQLite DB — deterministic lookup (golden.md).
		golden: {
			code: "from mendeleev import element; str(element('Fe').atomic_weight)",
			expect: '55.845',
		},
	},

	// ── batch-4 capability kits ────────────────────────────────────────────

	{
		id: 'pyteomics',
		runtime: 'pyodide',
		version: '5.0',
		tags: ['chemistry', 'biology'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/levitsky/pyteomics',
			ref: 'v5.0',
			license: 'Apache-2.0',
		},
		importName: 'pyteomics',
		artifacts: [
			{ vendor: 'pyteomics-5.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/0f/87/8914db559e9c5378a509c99631f87ce5612517182b3f0b426f2996522e8b/pyteomics-5.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// Monoisotopic mass of the hexapeptide PEPTIDE — deterministic lookup (golden.md).
		golden: {
			code: "from pyteomics import mass; str(round(mass.calculate_mass(sequence='PEPTIDE'),4))",
			expect: '799.36',
		},
	},

	{
		id: 'tifffile',
		runtime: 'pyodide',
		version: '2026.6.1',
		tags: ['serialization', 'data-science'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/cgohlke/tifffile',
			ref: 'v2026.6.1',
			license: 'BSD-3-Clause',
		},
		importName: 'tifffile',
		artifacts: [
			{ vendor: 'tifffile-2026.6.1-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/81/59/208f71d70ddc6184f79b8c6d87d46eb7d7b12c19186a817dec9c9c3f3693/tifffile-2026.6.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Round-trip a small numpy array through a TIFF in memory — deterministic shape (golden.md).
		golden: {
			code: "import numpy as np, tifffile, io; a=np.arange(6,dtype=np.uint8).reshape(2,3); b=io.BytesIO(); tifffile.imwrite(b,a); b.seek(0); str(tifffile.imread(b).shape)",
			expect: '(2, 3)',
		},
	},

	{
		id: 'trimesh',
		runtime: 'pyodide',
		version: '4.12.2',
		tags: ['math', 'structure'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/mikedh/trimesh',
			ref: '4.12.2',
			license: 'MIT',
		},
		importName: 'trimesh',
		artifacts: [
			{ vendor: 'trimesh-4.12.2-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/05/98/716a473cfb24750858ddd5d14e6527539dd206583a46408d08eeb2844a75/trimesh-4.12.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		// Box mesh: volume, watertight, face count — deterministic creation primitive (golden.md).
		golden: {
			code: "import trimesh; m=trimesh.creation.box(extents=[2,2,2]); str((float(round(m.volume,6)), m.is_watertight, len(m.faces)))",
			expect: '(8.0, True, 12)',
		},
	},

	{
		id: 'intervaltree',
		runtime: 'pyodide',
		version: '3.2.1',
		tags: ['genomics', 'util'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/chaimleib/intervaltree',
			ref: '3.2.1',
			license: 'Apache-2.0',
		},
		importName: 'intervaltree',
		artifacts: [
			{ vendor: 'intervaltree-3.2.1-py2.py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/83/7f/8a80a1c7c2ed05822b5a2b312d2995f30c533641f8198366ba2e26a7bb03/intervaltree-3.2.1-py2.py3-none-any.whl' },
			{ vendor: 'sortedcontainers-2.4.0-py2.py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/32/46/9cb0e58b2deb7f82b84065f37f3bffeb12413f947f9388e4cac22c4621ce/sortedcontainers-2.4.0-py2.py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// Overlap query on two intervals — deterministic sorted data list (golden.md).
		golden: {
			code: "from intervaltree import IntervalTree; t=IntervalTree(); t[100:200]='A'; t[150:250]='B'; str(sorted(iv.data for iv in t[160:170]))",
			expect: "['A', 'B']",
		},
	},

	// ── batch-4 wave B — particle + ase ────────────────────────────────────

	{
		id: 'particle',
		runtime: 'pyodide',
		version: '0.26.2',
		tags: ['physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/scikit-hep/particle',
			ref: 'v0.26.2',
			license: 'BSD-3-Clause',
		},
		importName: 'particle',
		artifacts: [
			{ vendor: 'particle-0.26.2-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/b3/91/7e3a06fac8ad91252c316442d8f40c69c8825a9c8726d54d8aca04037580/particle-0.26.2-py3-none-any.whl' },
			{ vendor: 'hepunits-2.4.5-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/44/9b/5fc3458204ecbd9094ce6b3b7850515f7a2f44926093cdfaa6395f88ba10/hepunits-2.4.5-py3-none-any.whl' },
			{ vendor: 'attrs-26.1.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/64/b4/17d4b0b2a2dc85a6df63d1157e028ed19f90d4cd97c36717afef2bc2f395/attrs-26.1.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		// PDG pion+ lookup — deterministic name, mass, charge triple (golden.md).
		golden: {
			code: "from particle import Particle; p=Particle.from_pdgid(211); str((p.name, round(p.mass,5), p.charge))",
			expect: "('pi+', 139.57039, 1.0)",
		},
	},

	{
		id: 'ase',
		runtime: 'pyodide',
		version: '3.28.0',
		tags: ['chemistry', 'structure'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://gitlab.com/ase/ase',
			ref: 'v3.28.0',
			license: 'LGPL-2.1-or-later',
		},
		importName: 'ase',
		artifacts: [
			{ vendor: 'ase-3.28.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/6c/25/4f103d1bedb3593718713b3f743df7b3ff3fc68d36d6666c30265ef59c8a/ase-3.28.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
		],
		// FCC Cu unit cell volume — deterministic geometry (golden.md).
		golden: {
			code: "from ase.build import bulk; str(round(bulk('Cu','fcc',a=3.6).get_volume(),6))",
			expect: '11.664',
		},
	},

	{
		id: 'pyfaidx',
		runtime: 'pyodide',
		version: '0.9.0.4',
		tags: ['biology', 'sequences'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/mdshw5/pyfaidx',
			ref: 'v0.9.0.4',
			license: 'BSD-3-Clause',
		},
		artifacts: [
			{ vendor: 'pyfaidx-0.9.0.4-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/b5/2c/44d47df76193b31fa4a7c662531076e6ec9a0f2f3017171f47c466211537/pyfaidx-0.9.0.4-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		mode: 'strict',
		operations: [
			{
				id: 'subsequence',
				summary: 'Extract a subsequence by region chr:start-end (1-based inclusive)',
				params: { fasta: { type: 'string' }, region: { type: 'string' } },
				output: { format: 'text' },
				golden: { input: { fasta: '>chr1\nACGTACGTACGT', region: 'chr1:3-6' }, expect: 'GTAC' },
			},
			{
				id: 'reverse_complement',
				summary: 'Extract a subsequence and return its reverse complement',
				params: { fasta: { type: 'string' }, region: { type: 'string' } },
				output: { format: 'text' },
				golden: { input: { fasta: '>chr1\nACGTACGTACGT', region: 'chr1:1-3' }, expect: 'CGT' },
			},
			{
				id: 'length',
				summary: 'Return the length of a named sequence',
				params: { fasta: { type: 'string' }, name: { type: 'string' } },
				output: { format: 'text' },
				golden: { input: { fasta: '>chr1\nACGTACGTACGT', name: 'chr1' }, expect: '12' },
			},
		],
	},

	// ── batch-5 capability kits ────────────────────────────────────────────

	{
		id: 'statsmodels',
		runtime: 'pyodide',
		version: '0.14.4',
		tags: ['statistics', 'data-science'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/statsmodels/statsmodels',
			ref: 'v0.14.4',
			license: 'BSD-3-Clause',
		},
		importName: 'statsmodels',
		artifacts: [
			{ vendor: 'statsmodels-0.14.4-cp313-cp313-pyodide_2025_0_wasm32.whl' },
			{ vendor: 'patsy-1.0.1-py2.py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		golden: {
			code: "import numpy as np, statsmodels.api as sm; x=np.array([1.,2.,3.,4.,5.]); y=np.array([2.,4.,6.,8.,10.]); m=sm.OLS(y,sm.add_constant(x)).fit(); str((round(float(m.params[1]),4), round(float(m.rsquared),4)))",
			expect: '(2.0, 1.0)',
		},
	},

	{
		id: 'scikit-image',
		runtime: 'pyodide',
		version: '0.25.2',
		tags: ['data-science', 'signal'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/scikit-image/scikit-image',
			ref: 'v0.25.2',
			license: 'BSD-3-Clause',
			buildNote: 'LICENSE.txt bundles a few BSD-2-Clause sub-files for bundled third-party code.',
		},
		importName: 'skimage',
		artifacts: [
			{ vendor: 'scikit_image-0.25.2-cp313-cp313-pyodide_2025_0_wasm32.whl' },
			{ vendor: 'pillow-11.2.1-cp313-cp313-pyodide_2025_0_wasm32.whl', bundled: true },
			{ vendor: 'imageio-2.37.0-py3-none-any.whl', bundled: true },
			{ vendor: 'lazy_loader-0.4-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'networkx', version: '3.4.2', sha256: SHA_NETWORKX },
			{ id: 'pywavelets', version: '1.8.0', sha256: SHA_PYWAVELETS },
			{ id: 'tifffile', version: '2026.6.1', sha256: SHA_TIFFFILE },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		golden: {
			code: "from skimage.data import camera; from skimage.filters import threshold_otsu; str(int(threshold_otsu(camera())))",
			expect: '102',
		},
	},

	{
		id: 'control',
		runtime: 'pyodide',
		version: '0.10.2',
		tags: ['signal', 'math'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/python-control/python-control',
			ref: '0.10.2',
			license: 'BSD-3-Clause',
		},
		importName: 'control',
		artifacts: [
			{ vendor: 'control-0.10.2-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/f2/0a/9f4c2a811b065c92f2483f26657dca373699388c959193ef27a644af1805/control-0.10.2-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
		],
		// matplotlib is an unconditional METADATA dep but cannot be provided in Pyodide
		// (native/heavy); plotting functions are unavailable — documented in instruction.md.
		golden: {
			code: "import control; g=control.TransferFunction([1],[1,2,1]); str(round(float(control.dcgain(g)),4))",
			expect: '1.0',
		},
	},

	// ── batch-6 scientific kits ────────────────────────────────────────────

	{
		id: 'skyfield',
		runtime: 'pyodide',
		version: '1.54',
		tags: ['astronomy', 'time'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/brandon-rhodes/python-skyfield',
			ref: 'v1.54',
			license: 'MIT',
			buildNote: 'Bundles jplephem 2.24 (MIT), de421.bsp (US-gov public domain), certifi 2026.5.20 (MPL-2.0)',
		},
		importName: 'skyfield',
		artifacts: [
			{ vendor: 'skyfield-1.54-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/e7/8a/f196038b2bea40c372d900803dac0d5e4eab578cb05b92ff7172ced4c1cf/skyfield-1.54-py3-none-any.whl' },
			{ vendor: 'jplephem-2.24-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/9d/3f/b9d5739352badc11ca637c8f72525d519458622936bc3313ddefdc7dee96/jplephem-2.24-py3-none-any.whl' },
			{ vendor: 'de421.bsp', bundled: true,
			  sourceUrl: 'https://ssd.jpl.nasa.gov/ftp/eph/planets/bsp/de421.bsp' },
			{ vendor: 'certifi-2026.5.20-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/59/8c/57e832b7af6d7c5abe66eb3fbe3a3a32f4d11ea23a1aa7131371035be991/certifi-2026.5.20-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'sgp4', version: '2.25', sha256: '4f39ecf6c2663109fed04adfe9982815ac83893271b521d92d5b186820f8c78e' },
		],
		golden: {
			code: "from skyfield.api import load_file; from skyfield import api; ts=api.load.timescale(builtin=True); eph=load_file('artifacts/de421.bsp'); t=ts.tt_jd(2451545.0); ra,dec,dist=eph['earth'].at(t).observe(eph['mars']).radec(); f'{round(ra._degrees,4)} {round(dec.degrees,4)} {round(dist.au,6)}'",
			expect: '330.524 -13.1807 1.849684',
		},
	},

	{
		id: 'diffraction',
		runtime: 'pyodide',
		version: '3.4.0',
		tags: ['structure', 'physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/DanPorter/Dans_Diffraction',
			ref: 'v3.4.0',
			license: 'Apache-2.0',
		},
		importName: 'Dans_Diffraction',
		artifacts: [
			{ vendor: 'dans_diffraction-3.4.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/bb/92/b7bbffc01432c63ea79295686b42a4959dacb298e6f39a95029600acb73b/dans_diffraction-3.4.0-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		golden: {
			code: "import Dans_Diffraction as dd; xtl=dd.Crystal(); xtl.Cell.a=4.0; xtl.Cell.b=4.0; xtl.Cell.c=4.0; str(round(float(xtl.Cell.dspace([1,1,0])[0]),4))",
			expect: '2.8284',
		},
	},

	{
		id: 'raytracing',
		runtime: 'pyodide',
		version: '1.4.7',
		tags: ['physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/DCC-Lab/RayTracing',
			ref: 'v1.4.7',
			license: 'MIT',
		},
		importName: 'raytracing',
		artifacts: [
			{ vendor: 'raytracing-1.4.7-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/b6/59/e7f760e6fa31075cf1067ad5359bb7a6b24e201bd7c5550162292f0b9eb8/raytracing-1.4.7-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
		],
		golden: {
			code: "from raytracing import Space, Lens; m=Space(d=10)*Lens(f=5); f'A={round(m.A,1)} B={round(m.B,1)} C={round(m.C,1)} D={round(m.D,1)}'",
			expect: 'A=-1.0 B=10.0 C=-0.2 D=1.0',
		},
	},

	// ── batch-7 vendor kits ───────────────────────────────────────────────

	{
		id: 'pyproj',
		runtime: 'pyodide',
		version: '3.7.2',
		tags: ['units', 'math'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/pyproj4/pyproj',
			ref: '3.7.2',
			license: 'MIT',
			buildNote: 'Pyodide wheel bundles libproj.so + proj.db (PROJ MIT); runs offline.',
		},
		importName: 'pyproj',
		artifacts: [
			{ vendor: 'pyproj-3.7.2-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/',
		dependencies: [],
		golden: {
			code: "from pyproj import Transformer; t=Transformer.from_crs(4326,3857,always_xy=True); x,y=t.transform(2.2945,48.8584); f'{round(x,2)},{round(y,2)}'",
			expect: '255534.78,6250916.49',
		},
	},

	{
		id: 'vector',
		runtime: 'pyodide',
		version: '1.8.1',
		tags: ['physics', 'math'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/scikit-hep/vector',
			ref: 'v1.8.1',
			license: 'BSD-3-Clause',
		},
		importName: 'vector',
		artifacts: [
			{ vendor: 'vector-1.8.1-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/c6/73/582abcd8d4439f4898969cac8aae998c74b28e79e6bd2cfc7d1516bc4518/vector-1.8.1-py3-none-any.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		golden: {
			code: "import vector; str(vector.obj(px=1,py=2,pz=3,E=4).mass)",
			expect: '1.4142135623730951',
		},
	},

	{
		id: 'basis-set-exchange',
		runtime: 'pyodide',
		version: '0.12',
		tags: ['chemistry', 'data-science'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/MolSSI-BSE/basis_set_exchange',
			ref: 'v0.12',
			license: 'BSD-3-Clause',
			buildNote: 'Bundles jsonschema(MIT)+argcomplete(Apache-2.0)+Unidecode(GPL-2.0+)+regex(Apache-2.0) — pure-Python/Pyodide exclusive deps. jsonschema transitive deps (attrs, rpds-py, referencing, jsonschema-specifications) resolved by the Pyodide runtime from CDN.',
		},
		importName: 'basis_set_exchange',
		artifacts: [
			{ vendor: 'basis_set_exchange-0.12-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/9a/64/6e8f5d1bd239ea91c0e8658b77183249cfe5106c97142711d168dbd04376/basis_set_exchange-0.12-py3-none-any.whl' },
			{ vendor: 'jsonschema-4.23.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/jsonschema-4.23.0-py3-none-any.whl' },
			{ vendor: 'argcomplete-3.6.3-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/74/f5/9373290775639cb67a2fce7f629a1c240dce9f12fe927bc32b2736e16dfc/argcomplete-3.6.3-py3-none-any.whl' },
			{ vendor: 'Unidecode-1.4.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/8f/b7/559f59d57d18b44c6d1250d2eeaa676e028b9c527431f5d0736478a73ba1/Unidecode-1.4.0-py3-none-any.whl' },
			{ vendor: 'regex-2024.11.6-cp313-cp313-pyemscripten_2025_0_wasm32.whl', bundled: true,
			  sourceUrl: 'https://cdn.jsdelivr.net/pyodide/v0.29.4/full/regex-2024.11.6-cp313-cp313-pyemscripten_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [],
		golden: {
			code: "import basis_set_exchange as bse; str('3.42525091' in bse.get_basis('sto-3g',elements=[1],fmt='nwchem'))",
			expect: 'True',
		},
	},

	// ── batch-8 vendor kits ───────────────────────────────────────────────

	{
		id: 'galpy',
		runtime: 'pyodide',
		version: '1.10.2',
		tags: ['astronomy', 'physics'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/jobovy/galpy',
			ref: 'v1.10.2',
			license: 'BSD-3-Clause',
			buildNote: 'Pyodide-built compiled wheel (GSL-backed) from the v0.28.0 CDN; pin 1.10.2 (NOT PyPI HEAD 1.11.2). matplotlib plotting unavailable in Pyodide.',
		},
		importName: 'galpy',
		artifacts: [
			{ vendor: 'galpy-1.10.2-cp313-cp313-pyodide_2025_0_wasm32.whl' },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		golden: {
			code: "from galpy.potential import MiyamotoNagaiPotential, vcirc; p=MiyamotoNagaiPotential(a=0.5,b=0.0375,normalize=1.); '%.1f'%float(vcirc(p,1.))",
			expect: '1.0',
		},
	},

	{
		id: 'cvxpy',
		runtime: 'pyodide',
		version: '1.6.3',
		tags: ['optimization', 'math'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/cvxpy/cvxpy',
			ref: 'v1.6.3',
			license: 'Apache-2.0',
			buildNote: 'cvxpy-base build (no optional solver extras) from the v0.28.0 CDN; bundles clarabel 0.11.0 (Apache-2.0) — the only in-sandbox solver (no osqp/ecos/scs).',
		},
		importName: 'cvxpy',
		artifacts: [
			{ vendor: 'cvxpy_base-1.6.3-py3-none-any.whl' },
			{ vendor: 'clarabel-0.11.0-cp39-abi3-pyodide_2025_0_wasm32.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
		],
		golden: {
			code: "import cvxpy as cp, numpy as np; x=cp.Variable(2); A=np.array([[1.,0.],[0.,1.]]); b=np.array([1.,2.]); cp.Problem(cp.Minimize(cp.sum_squares(A@x-b))).solve(solver='CLARABEL'); '%.2f,%.2f'%(x.value[0],x.value[1])",
			expect: '1.00,2.00',
		},
	},

	{
		id: 'arviz',
		runtime: 'pyodide',
		version: '1.2.0',
		tags: ['statistics', 'sampling', 'uncertainty'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/arviz-devs/arviz',
			ref: 'v1.2.0',
			license: 'Apache-2.0',
			buildNote: 'Bundles arviz-base 1.2.0 (Apache-2.0), arviz-stats 1.2.0 (Apache-2.0), arviz-plots 1.2.0 (Apache-2.0), xarray 2025.1.2 (Apache-2.0), lazy_loader 0.4 (BSD-3-Clause), typing_extensions 4.14.0 (PSF-2.0) — exclusive deps. matplotlib/bokeh/plotly plotting backends unavailable in Pyodide.',
		},
		importName: 'arviz',
		artifacts: [
			{ vendor: 'arviz-1.2.0-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/d2/37/e66d037fd935f40606fc5dc1c610d78653037dd62d656a25cead401d81dc/arviz-1.2.0-py3-none-any.whl' },
			{ vendor: 'arviz_base-1.2.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/37/d7/82e5f456d50b6accf06d137594282bf6984526fa1b329a061f7b91b123aa/arviz_base-1.2.0-py3-none-any.whl' },
			{ vendor: 'arviz_stats-1.2.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/96/8f/73f43d90534d49a4af4c8e35d5b60e2838435b0318f44262dc6fe2dd39d8/arviz_stats-1.2.0-py3-none-any.whl' },
			{ vendor: 'arviz_plots-1.2.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/1a/06/85b6f3d07c8b0bd232c05c236188575074fcb9006174e5a5ca5b6dd12a9f/arviz_plots-1.2.0-py3-none-any.whl' },
			{ vendor: 'xarray-2025.1.2-py3-none-any.whl', bundled: true },
			{ vendor: 'lazy_loader-0.4-py3-none-any.whl', bundled: true },
			{ vendor: 'typing_extensions-4.14.0-py3-none-any.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
			{ id: 'packaging', version: '26.2', sha256: SHA_PACKAGING },
		],
		golden: {
			code: "import numpy as np, arviz as az; d=az.from_dict(posterior={'x': np.array([[1.,2.,3.,4.,5.]])}); str(float(d.posterior['x'].mean()))",
			expect: '3.0',
		},
	},

	{
		id: 'lifelines',
		runtime: 'pyodide',
		version: '0.30.3',
		tags: ['statistics', 'fitting'],
		tier: 'library',
		provenance: {
			source: 'pypi',
			repo: 'https://github.com/CamDavidsonPilon/lifelines',
			ref: 'v0.30.3',
			license: 'MIT',
			buildNote: 'Bundles autograd-gamma 0.4.2 (MIT), formulaic 1.1.1 (MIT), interface-meta 1.3.0 (MIT), typing_extensions 4.14.0 (PSF-2.0), wrapt 1.17.2 (BSD-2-Clause) — exclusive deps. matplotlib plotting unavailable in Pyodide.',
		},
		importName: 'lifelines',
		artifacts: [
			{ vendor: 'lifelines-0.30.3-py3-none-any.whl',
			  sourceUrl: 'https://files.pythonhosted.org/packages/8a/fb/5ed80a8932630d4ae33af186a87008c9b48f02bc515380acc1a4b1fec162/lifelines-0.30.3-py3-none-any.whl' },
			{ vendor: 'autograd_gamma-0.4.2-py2.py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/0a/07/d99339c9420b58b723a9189d1373e5c3889758b2202a1a7fe4a3b7a10c5a/autograd_gamma-0.4.2-py2.py3-none-any.whl' },
			{ vendor: 'formulaic-1.1.1-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/d2/c2/a34097e53efe70a538ae97574ff9e9866e60fc1c792c19da5fd6b56ce7b5/formulaic-1.1.1-py3-none-any.whl' },
			{ vendor: 'interface_meta-1.3.0-py3-none-any.whl', bundled: true,
			  sourceUrl: 'https://files.pythonhosted.org/packages/02/3f/a6ec28c88e2d8e54d32598a1e0b5208a4baa72a8e7f6e241beab5731eb9d/interface_meta-1.3.0-py3-none-any.whl' },
			{ vendor: 'typing_extensions-4.14.0-py3-none-any.whl', bundled: true },
			{ vendor: 'wrapt-1.17.2-cp313-cp313-pyodide_2025_0_wasm32.whl', bundled: true },
		],
		recipeBase: CDN,
		dependencies: [
			{ id: 'numpy', version: '2.2.5', sha256: SHA_NUMPY },
			{ id: 'scipy', version: '1.14.1', sha256: SHA_SCIPY },
			{ id: 'pandas', version: '2.3.3', sha256: SHA_PANDAS },
			{ id: 'autograd', version: '1.8.0', sha256: SHA_AUTOGRAD },
		],
		golden: {
			code: "from lifelines import KaplanMeierFitter; import numpy as np; k=KaplanMeierFitter(); k.fit(np.array([1.,2.,3.,4.,5.]), np.array([1,1,1,1,1])); str(float(k.median_survival_time_))",
			expect: '3.0',
		},
	},
]
