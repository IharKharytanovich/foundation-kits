# Kit registry

A flat index of every kit in this repo — name, version, runtime, a one-line
description, and publish status. Source of truth for kit *definitions* is each
`kit/<id>/`; this file is a human-readable roll-up.

- **Published** = the `<id>@<ver>` tag has been pushed and a GitHub Release exists
  (see [.claude/rules/publish.md](../.claude/rules/publish.md)).
- Regenerate descriptions from each kit's `instruction.md` first paragraph.

**70 kits** — 54 pyodide · 5 wasi · 11 jswasm. 70 published; 0 pending first publish.

| Kit | Version | Runtime | Description | Published |
|---|---|---|---|---|
| ase | 3.28.0 | pyodide | Atomic structures: molecules, crystals, CIF/XYZ/POSCAR I/O, bulk builders. | ✅ |
| astropy | 7.0.1 | pyodide | Astronomy & astrophysics: units, celestial coordinates, time systems, cosmology, FITS I/O. | ✅ |
| autograd | 1.8.0 | pyodide | Automatic differentiation of native Python/NumPy code (reverse- & forward-mode). | ✅ |
| biopython | 1.85 | pyodide | Computational molecular biology: sequences, file formats, alignments, structures (import `Bio`). | ✅ |
| chaospy | 4.3.21 | pyodide | Uncertainty quantification via polynomial chaos expansions. | ✅ |
| chempy | 0.10.1 | pyodide | Chemistry: stoichiometry, reaction balancing, kinetics, equilibrium. | ✅ |
| control | 0.10.2 | pyodide | Feedback control systems: transfer functions, state-space, Bode/Nyquist, LQR. | ✅ |
| coolprop | 7.2.0-1.0.0 | jswasm | Reference thermophysical fluid properties via multiparameter EOS (PropsSI). | ✅ |
| deap | 1.4.4 | pyodide | Evolutionary computation: genetic algorithms, GP, evolution strategies, NSGA-II. | ✅ |
| decorator | 5.2.1 | pyodide | Write signature-preserving Python decorators. | ✅ |
| dendropy | 5.0.8 | pyodide | Phylogenetic computing: trees, character matrices, Newick/Nexus/NeXML I/O. | ✅ |
| diffraction | 3.4.0 | pyodide | X-ray and neutron diffraction simulation (d-spacings, powder patterns). | ✅ |
| dill | 0.4.1 | pyodide | Extends `pickle` to serialize lambdas, closures, generators, and more. | ✅ |
| dynesty | 3.0.0 | pyodide | Dynamic nested sampling for Bayesian posteriors and evidences. | ✅ |
| earcut | 1.1.5 | pyodide | Fast, robust polygon triangulation (ear-clipping, holes supported). | ✅ |
| edlib | 1.2.7 | wasi | Fast edit-distance and alignment (Levenshtein, CIGAR) between sequences. | ✅ |
| eigen | 0.2.2-1.0.0 | jswasm | Eigen C++ linear algebra (decomposition, solving, eigenvalues) in WASM. | ✅ |
| emcee | 3.1.6 | pyodide | Affine-invariant ensemble MCMC sampler for Bayesian parameter estimation. | ✅ |
| findiff | 0.13.1 | pyodide | Finite-difference numerical derivatives on arbitrary-dimensional grids. | ✅ |
| freesasa | 2.2.1 | pyodide | Solvent-accessible surface area (SASA) of protein structures. | ✅ |
| geodesy | 0.7.0-1.0.0 | jswasm | Geodetic coordinate transformations (Rust `geodesy` crate, WASM). | ✅ |
| geos | 3.1.1-1.0.0 | jswasm | Computational geometry: area, buffer, union, intersection, spatial predicates. | ✅ |
| gmp | 1.3.2-1.0.0 | jswasm | Arbitrary-precision integer, rational, and float arithmetic (GMP + MPFR). | ✅ |
| highs-js | 1.14.2-1.0.0 | jswasm | High-performance LP / MIP / QP solver (HiGHS). | ✅ |
| iminuit | 2.30.1 | pyodide | Function minimisation & error analysis (CERN Minuit2 frontend). | ✅ |
| intervaltree | 3.2.1 | pyodide | Self-balancing interval tree for efficient overlap queries. | ✅ |
| joblib | 1.4.2 | pyodide | Object hashing, disk-caching (`Memory`), and parallel-loop helpers. | ✅ |
| lmfit | 1.3.4 | pyodide | Non-linear least-squares fitting with bounded/constrained Parameters. | ✅ |
| manifold | 3.5.1-1.0.0 | jswasm | Robust 3D triangle-mesh booleans (union/difference/intersection). | ✅ |
| mendeleev | 1.1.0 | pyodide | Element, ion, and isotope property database (SQLite-backed). | ✅ |
| meshoptimizer | 1.1.1-1.0.0 | jswasm | Mesh simplification, optimization & compression. | ✅ |
| molmass | 2026.1.8 | pyodide | Molecular mass, isotopic composition, and mass distributions from formulas. | ✅ |
| networkx | 3.4.2 | pyodide | Create, manipulate, and analyse graphs and complex networks. | ✅ |
| numpy | 2.2.5 | pyodide | N-dimensional arrays, linear algebra, FFT, random numbers. | ✅ |
| packaging | 26.2 | pyodide | PEP 440/508/425 version, requirement, and wheel-tag parsing. | ✅ |
| pandas | 2.3.3 | pyodide | Tabular data: DataFrame/Series load, clean, transform, analyse. | ✅ |
| particle | 0.26.2 | pyodide | PDG particle database: mass, width, charge, spin, PDGID, MC codes. | ✅ |
| periodictable | 2.1.0 | pyodide | Element & isotope properties incl. neutron/X-ray scattering; formula parser. | ✅ |
| pint | 0.25.3 | pyodide | Physical quantities with units and dimension-checked conversions. | ✅ |
| pyfaidx | 0.9.0.4 | pyodide | Indexed FASTA random access: region extraction, reverse complement, sequence length. | ✅ |
| pyrodigal | 3.7.0 | pyodide | Prokaryotic gene prediction (Prodigal binding): ORFs, start codons, RBS. | ✅ |
| pyteomics | 5.0 | pyodide | Mass spectrometry & proteomics: peptide mass, m/z, mzML/MGF/FASTA parsing. | ✅ |
| pytz | 2025.2 | pyodide | IANA (Olson) timezone database for `datetime` objects. | ✅ |
| pywavelets | 1.8.0 | pyodide | Discrete & continuous wavelet transforms (import `pywt`). | ✅ |
| pyyaml | 6.0.2 | pyodide | YAML 1.1 parser and emitter (import `yaml`). | ✅ |
| rapier2d | 0.19.3-1.0.0 | jswasm | 2D physics engine (Rapier, Rust→WASM). | ✅ |
| rapier3d | 0.19.3-1.0.0 | jswasm | 3D physics engine (Rapier, Rust→WASM). | ✅ |
| raytracing | 1.4.7 | pyodide | Paraxial ABCD ray-transfer matrix optics (lenses, mirrors, spaces). | ✅ |
| rdkit | 2025.3.4-1.0.0 | jswasm | Cheminformatics toolkit over SMILES (RDKit, WASM). | ✅ |
| salib | 1.5.2 | pyodide | Global sensitivity analysis: Sobol', Morris, FAST, DGSM, PAWN, HDMR. | ✅ |
| scikit-fem | 12.0.1 | pyodide | Finite element assembly for PDEs (import `skfem`). | ✅ |
| scikit-image | 0.25.2 | pyodide | Image processing on NumPy arrays: filtering, morphology, segmentation, features (import `skimage`). | ✅ |
| scikit-learn | 1.7.0 | pyodide | Machine learning: classification, regression, clustering (import `sklearn`). | ✅ |
| scikit-optimize | 0.10.2 | pyodide | Bayesian optimization of expensive black-box functions (import `skopt`). | ✅ |
| scipy | 1.14.1 | pyodide | Scientific computing: optimization, integration, interpolation, signal, sparse. | ✅ |
| selfies | 2.2.0 | pyodide | 100%-robust molecular string representation (SELFIES). | ✅ |
| seqtk | 1.5-r133 | wasi | Fast FASTA/FASTQ sequence processing toolkit. | ✅ |
| setuptools | 76.0.0 | pyodide | Packaging toolkit; ships `pkg_resources` for distribution discovery. | ✅ |
| sgp4 | 2.25 | pyodide | SGP4 satellite orbit propagation from TLE sets. | ✅ |
| skyfield | 1.54 | pyodide | High-precision positional astronomy with bundled JPL DE421 ephemeris. | ✅ |
| six | 1.17.0 | pyodide | Python 2/3 compatibility helpers. | ✅ |
| spglib | 2.7.0 | wasi | Crystal symmetry: space-group determination, primitive cells, symmetry operations. | ✅ |
| statsmodels | 0.14.4 | pyodide | Statistical modelling, hypothesis testing, and econometrics (OLS, GLM, ARIMA). | ✅ |
| sympy | 1.13.3 | pyodide | Symbolic mathematics: algebra, calculus, equation solving — exact results. | ✅ |
| thermo | 0.6.0 | pyodide | Chemical-engineering thermodynamics: thermophysical property estimation. | ✅ |
| tifffile | 2026.6.1 | pyodide | Scientific TIFF/OME-TIFF/BigTIFF read/write over numpy arrays. | ✅ |
| trimesh | 4.12.2 | pyodide | Mesh I/O + mass properties: load STL/PLY/OBJ/GLTF, volume, inertia, watertightness. | ✅ |
| uncertainties | 3.2.2 | pyodide | Error propagation through calculations (linear error theory). | ✅ |
| viennarna | 2.7.2 | wasi | RNA secondary-structure prediction (MFE folding, Turner 2004 model). | ✅ |
| z3 | 4.16.0 | wasi | SMT solver: satisfiability of formulas over integers, reals, bit-vectors, arrays, quantifiers. | ✅ |
