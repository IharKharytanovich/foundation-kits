# Kit registry

A flat index of every kit in this repo — name, version, runtime, a one-line
description, and publish status. Source of truth for kit *definitions* is each
`kit/<id>/`; this file is a human-readable roll-up.

- **Published** = the `<id>@<ver>` tag has been pushed and a GitHub Release exists
  (see [.claude/rules/publish.md](../.claude/rules/publish.md)).
- Regenerate descriptions from each kit's `instruction.md` first paragraph.

**104 kits** — 80 pyodide · 10 wasi · 14 jswasm. 90 published; 14 pending first publish.

| Kit | Version | Runtime | Description | Published |
|---|---|---|---|---|
| arviz | 1.2.0 | pyodide | Bayesian inference diagnostics: InferenceData, R-hat, ESS, HDI, posterior summaries. | ✅ |
| ase | 3.28.0 | pyodide | Atomic structures: molecules, crystals, CIF/XYZ/POSCAR I/O, bulk builders. | ✅ |
| astropy | 7.0.1 | pyodide | Astronomy & astrophysics: units, celestial coordinates, time systems, cosmology, FITS I/O. | ✅ |
| autograd | 1.8.0 | pyodide | Automatic differentiation of native Python/NumPy code (reverse- & forward-mode). | ✅ |
| basis-set-exchange | 0.12 | pyodide | Quantum-chemistry Gaussian basis sets: fetch/convert across program formats. | ✅ |
| bedtools | 2.31.1 | wasi | Genome interval set-algebra on BED/GFF/VCF; built .wasm exposes single-input merge/sort (two-input intersect/subtract/closest need a multi-file runtime contract). | ❌ |
| biopython | 1.85 | pyodide | Computational molecular biology: sequences, file formats, alignments, structures (import `Bio`). | ✅ |
| casadi | 3.7.0 | pyodide | Nonlinear optimization with sparse symbolic & algorithmic differentiation, NLP modeling, ODE/DAE integrators. | ✅ |
| chaospy | 4.3.21 | pyodide | Uncertainty quantification via polynomial chaos expansions. | ✅ |
| cclib | 1.8.1 | pyodide | Parse computational-chemistry program output (Gaussian/ORCA/Q-Chem/NWChem/GAMESS) into typed arrays. | ❌ |
| chempy | 0.10.1 | pyodide | Chemistry: stoichiometry, reaction balancing, kinetics, equilibrium. | ✅ |
| cirq | 1.6.1 | pyodide | Gate-level quantum circuit construction and state-vector / density-matrix simulation (Cirq core). | ✅ |
| control | 0.10.2 | pyodide | Feedback control systems: transfer functions, state-space, Bode/Nyquist, LQR. | ✅ |
| coolprop | 7.2.0-1.0.0 | jswasm | Reference thermophysical fluid properties via multiparameter EOS (PropsSI). | ✅ |
| cvxpy | 1.6.3 | pyodide | Disciplined convex optimization modelling, solved in-sandbox with CLARABEL. | ✅ |
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
| fasttree | 2.2.0 | wasi | De-novo approximately-ML phylogenetic tree inference from MSA → Newick. | ❌ |
| fdtd | 0.3.5 | pyodide | FDTD electromagnetic wave simulation on 1-D/2-D/3-D grids (Yee algorithm, PML boundaries). | ❌ |
| flint | 0.8.0 | pyodide | Exact polynomial, number-theory, and matrix arithmetic with certified ball arithmetic (FLINT/Arb). | ✅ |
| fluids | 1.3.0 | pyodide | Fluid dynamics & hydraulics: friction factors, Reynolds number, pipe flow, pumps, drag, two-phase flow. | ✅ |
| freesasa | 2.2.1 | pyodide | Solvent-accessible surface area (SASA) of protein structures. | ✅ |
| galpy | 1.10.2 | pyodide | Galactic dynamics: orbit integration, gravitational potentials, action-angle, circular velocity. | ✅ |
| gemmi | 0.6.7-1.0.0 | jswasm | Macromolecular crystallography: convert structure/reflection files between mmCIF/PDB/MTZ. | ✅ |
| geodesy | 0.7.0-1.0.0 | jswasm | Geodetic coordinate transformations (Rust `geodesy` crate, WASM). | ✅ |
| geos | 3.1.1-1.0.0 | jswasm | Computational geometry: area, buffer, union, intersection, spatial predicates. | ✅ |
| gmp | 1.3.2-1.0.0 | jswasm | Arbitrary-precision integer, rational, and float arithmetic (GMP + MPFR). | ✅ |
| highs-js | 1.14.2-1.0.0 | jswasm | High-performance LP / MIP / QP solver (HiGHS). | ✅ |
| igraph | 0.11.8 | pyodide | Fast C-core graph analytics: community detection, centralities, motifs, max-flow, VF2 isomorphism. | ✅ |
| ikpy | 3.4.2 | pyodide | Robot kinematics: forward/inverse kinematics and Jacobians over URDF/programmatic chains. | ❌ |
| impedance | 1.7.1 | pyodide | Electrochemical impedance spectroscopy: equivalent-circuit fitting (Randles/CPE/Warburg) and Kramers-Kronig validation. | ❌ |
| iminuit | 2.30.1 | pyodide | Function minimisation & error analysis (CERN Minuit2 frontend). | ✅ |
| intervaltree | 3.2.1 | pyodide | Self-balancing interval tree for efficient overlap queries. | ✅ |
| joblib | 1.4.2 | pyodide | Object hashing, disk-caching (`Memory`), and parallel-loop helpers. | ✅ |
| kalign | 3.3.1-1.0.0 | jswasm | Fast multiple sequence alignment (MSA) of DNA/RNA/protein (kalign, WASM). | ✅ |
| lifelines | 0.30.3 | pyodide | Survival analysis: Kaplan-Meier, Cox proportional-hazards, parametric fitters, log-rank test. | ✅ |
| lmfit | 1.3.4 | pyodide | Non-linear least-squares fitting with bounded/constrained Parameters. | ✅ |
| manifold | 3.5.1-1.0.0 | jswasm | Robust 3D triangle-mesh booleans (union/difference/intersection). | ✅ |
| mendeleev | 1.1.0 | pyodide | Element, ion, and isotope property database (SQLite-backed). | ✅ |
| meshoptimizer | 1.1.1-1.0.0 | jswasm | Mesh simplification, optimization & compression. | ✅ |
| minimap2 | 2.31 | wasi | Long-read / spliced / genome aligner (seed-chain-align → PAF/SAM). | ❌ |
| molmass | 2026.1.8 | pyodide | Molecular mass, isotopic composition, and mass distributions from formulas. | ✅ |
| networkx | 3.4.2 | pyodide | Create, manipulate, and analyse graphs and complex networks. | ✅ |
| nmrglue | 0.11 | pyodide | NMR spectroscopy data processing: read Bruker/Varian/NMRPipe, apodization, FT, phase correction, peak picking. | ✅ |
| numpy | 2.2.5 | pyodide | N-dimensional arrays, linear algebra, FFT, random numbers. | ✅ |
| olll | 1.0.2 | pyodide | LLL lattice basis reduction in exact rational arithmetic (Lenstra-Lenstra-Lovász). | ❌ |
| packaging | 26.2 | pyodide | PEP 440/508/425 version, requirement, and wheel-tag parsing. | ✅ |
| pandas | 2.3.3 | pyodide | Tabular data: DataFrame/Series load, clean, transform, analyse. | ✅ |
| pari | 2.13.2-1.0.0 | jswasm | Number-theory CAS (PARI/GP): factorization, elliptic curves, modular forms, class groups, arbitrary precision. | ❌ |
| particle | 0.26.2 | pyodide | PDG particle database: mass, width, charge, spin, PDGID, MC codes. | ✅ |
| periodictable | 2.1.0 | pyodide | Element & isotope properties incl. neutron/X-ray scattering; formula parser. | ✅ |
| pint | 0.25.3 | pyodide | Physical quantities with units and dimension-checked conversions. | ✅ |
| pot | 0.9.6.post1 | pyodide | Optimal transport: Wasserstein/EMD, Sinkhorn, Gromov-Wasserstein, barycenters (built-from-source pyodide wheel). | ✅ |
| prysm | 0.21.1 | pyodide | Physical/Fourier optics: PSF, MTF, Zernike wavefronts, interferometry, optical propagation. | ❌ |
| pybaselines | 1.2.1 | pyodide | Baseline fitting for spectral/chromatographic data: 50+ algorithms (Whittaker, polynomial, morphological, spline). | ✅ |
| pyfaidx | 0.9.0.4 | pyodide | Indexed FASTA random access: region extraction, reverse complement, sequence length. | ✅ |
| pygsp | 0.6.1 | pyodide | Graph signal processing: graph Fourier transform, spectral filter banks, graph wavelets. | ❌ |
| pyhf | 0.7.6 | pyodide | Binned HistFactory profile-likelihood fits and CLs limit-setting (numpy backend). | ✅ |
| pymap3d | 3.2.0 | pyodide | Geodetic look-angle geometry: ECEF↔geodetic↔ENU/NED↔AER local-tangent-plane transforms. | ❌ |
| pyproj | 3.7.2 | pyodide | Cartographic CRS transforms (PROJ/EPSG): reproject, project, geodesic distance. | ✅ |
| pyrodigal | 3.7.0 | pyodide | Prokaryotic gene prediction (Prodigal binding): ORFs, start codons, RBS. | ✅ |
| pyteomics | 5.0 | pyodide | Mass spectrometry & proteomics: peptide mass, m/z, mzML/MGF/FASTA parsing. | ✅ |
| pythtb | 2.0.2 | pyodide | Tight-binding electronic structure: TB Hamiltonians, band structures, Berry phase, topological invariants. | ❌ |
| pytz | 2025.2 | pyodide | IANA (Olson) timezone database for `datetime` objects. | ✅ |
| pywavelets | 1.8.0 | pyodide | Discrete & continuous wavelet transforms (import `pywt`). | ✅ |
| pyyaml | 6.0.2 | pyodide | YAML 1.1 parser and emitter (import `yaml`). | ✅ |
| rapier2d | 0.19.3-1.0.0 | jswasm | 2D physics engine (Rapier, Rust→WASM). | ✅ |
| rapier3d | 0.19.3-1.0.0 | jswasm | 3D physics engine (Rapier, Rust→WASM). | ✅ |
| raytracing | 1.4.7 | pyodide | Paraxial ABCD ray-transfer matrix optics (lenses, mirrors, spaces). | ✅ |
| rdkit | 2025.3.4-1.0.0 | jswasm | Cheminformatics toolkit over SMILES (RDKit, WASM). | ✅ |
| ripser | 1.2.1 | wasi | Vietoris–Rips persistent homology / TDA barcodes. | ✅ |
| salib | 1.5.2 | pyodide | Global sensitivity analysis: Sobol', Morris, FAST, DGSM, PAWN, HDMR. | ✅ |
| samtools | 1.21 | wasi | SAM/BAM/CRAM/VCF read/write + tabix indexing + bgzip (multiplexed WASI). | ✅ |
| scikit-fem | 12.0.1 | pyodide | Finite element assembly for PDEs (import `skfem`). | ✅ |
| scikit-image | 0.25.2 | pyodide | Image processing on NumPy arrays: filtering, morphology, segmentation, features (import `skimage`). | ✅ |
| scikit-learn | 1.7.0 | pyodide | Machine learning: classification, regression, clustering (import `sklearn`). | ✅ |
| scikit-optimize | 0.10.2 | pyodide | Bayesian optimization of expensive black-box functions (import `skopt`). | ✅ |
| scikit-rf | 2.0.0 | pyodide | RF/microwave network analysis: S-parameters, Touchstone I/O, multi-port cascading, S↔Z↔Y↔ABCD conversions. | ❌ |
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
| vector | 1.8.1 | pyodide | Lorentz four-vector / special-relativity algebra (boosts, invariant mass, rapidity). | ✅ |
| viennarna | 2.7.2 | wasi | RNA secondary-structure prediction (MFE folding, Turner 2004 model). | ✅ |
| z3 | 4.16.0 | wasi | SMT solver: satisfiability of formulas over integers, reals, bit-vectors, arrays, quantifiers. | ✅ |
