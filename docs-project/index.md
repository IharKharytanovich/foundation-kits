# docs-project — feature catalog

An index of documented features, kit batches, and pipeline additions in
foundation-kits.

## Features

| Feature | Path | Description |
|---|---|---|
| Z3 WASI build pipeline + 5-kit batch | [z3-wasi-build-pipeline/](z3-wasi-build-pipeline/) | Z3 SMT solver WASI build pipeline (`build/z3/`) and a 5-kit batch: z3 (wasi), pyteomics & tifffile (pyodide), manifold & meshoptimizer (jswasm). |
| Batch-4 scientific kits | [batch-4-scientific-kits/](batch-4-scientific-kits/) | 5 pyodide kits: trimesh (mesh I/O), particle (PDG database), ase (atomistic structures), pyfaidx (indexed FASTA), intervaltree (interval queries). |
| Batch-5 scientific kits | [batch-5-scientific-kits/](batch-5-scientific-kits/) | 3 pyodide + 1 wasi kit: statsmodels (statistics/econometrics), scikit-image (image processing), control (control systems), spglib (crystal symmetry, wasi build). |
| Batch-6 scientific kits | [batch-6-scientific-kits/](batch-6-scientific-kits/) | 3 pyodide + 1 jswasm + 1 wasi kit: skyfield (positional astronomy), diffraction (X-ray/neutron), raytracing (paraxial optics), coolprop (fluid properties, jswasm), edlib (edit-distance, wasi build). |
