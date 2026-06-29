# cclib

cclib parses output files from computational-chemistry programs — Gaussian,
ORCA, Q-Chem, NWChem, GAMESS, Molpro, Turbomole, Psi4, MOPAC, and others —
into typed numeric arrays. It extracts geometries (atomic coordinates), molecular
orbital energies, vibrational frequencies and modes, atomic charges (Mulliken,
NPA, etc.), SCF energies, basis set metadata, and other standard quantities from
heterogeneous log formats into a single uniform `ccData` object.

## When to Use

- Parsing Gaussian/ORCA/Q-Chem/NWChem/GAMESS/Psi4 output logs to extract
  computed properties (energies, geometries, orbital energies, frequencies)
- Comparing results across different quantum-chemistry codes (same `ccData`
  schema regardless of program)
- Extracting SCF convergence data, optimization trajectories, or vibrational
  modes from a calculation log
- Reading atomic charges (Mulliken, Lowdin, NPA) from post-HF or DFT output
- Batch-processing multiple log files to tabulate computed properties

## When NOT to Use

- Parsing crystallographic structure files (mmCIF, PDB, CIF) — use **gemmi**
- Parsing mass-spectrometry data formats (mzML, MGF) — use **pyteomics**
- Parsing biological sequence files (FASTA, GenBank) — use **biopython**
- Running quantum-chemistry calculations (cclib is a parser, not a calculator)
- Parsing molecular-dynamics trajectories (GROMACS .xtc/.trr, AMBER .nc) — those
  formats are not quantum-chemistry program output

## Capabilities

| Area | Key API |
|---|---|
| Parse a log file | `cclib.io.ccread('output.log')` — returns a `ccData` object |
| Parse from string/stream | `cclib.io.ccread(io.StringIO(text))` — parse in-memory text |
| Open + iterate | `cclib.io.ccopen(source)` — returns a parser; call `.parse()` for `ccData` |
| Atom count | `data.natom` — number of atoms |
| Atomic coordinates | `data.atomcoords` — array of geometries (Angstroms) |
| SCF energies | `data.scfenergies` — array of SCF energies (eV) |
| MO energies | `data.moenergies` — molecular orbital energies (eV) |
| Vibrational frequencies | `data.vibfreqs` — harmonic frequencies (cm⁻¹) |
| Atomic charges | `data.atomcharges` — dict of charge types → arrays |
| Charge + multiplicity | `data.charge`, `data.mult` |

## Worked Example

Parse a minimal Gaussian log fragment and extract the atom count and charge:

```python
import io
from cclib.io import ccread

frag = (
    " Entering Gaussian System, Link 0=g16\n"
    " Gaussian, Inc.  All Rights Reserved.\n"
    " #p hf/sto-3g\n\n"
    " water single point\n\n"
    " 0 1\n O\n H 1 0.96\n H 1 0.96 2 104.5\n\n"
    "                          Input orientation:\n"
    " ---------------------------------------------------------------------\n"
    " Center     Atomic      Atomic             Coordinates (Angstroms)\n"
    " Number     Number       Type             X           Y           Z\n"
    " ---------------------------------------------------------------------\n"
    "      1          8           0        0.000000    0.000000    0.117176\n"
    "      2          1           0        0.000000    0.757160   -0.468706\n"
    "      3          1           0        0.000000   -0.757160   -0.468706\n"
    " ---------------------------------------------------------------------\n"
    " Charge =  0 Multiplicity = 1\n"
    " SCF Done:  E(RHF) = -75.5859030882 A.U.\n"
    " Normal termination of Gaussian 16\n"
)

data = ccread(io.StringIO(frag))
str([int(data.natom), int(data.charge)])
# -> "[3, 0]"
```

The `ccData` object provides uniform access to parsed quantities regardless of
which program produced the log. Use `data.atomcoords[-1]` for the final geometry,
`data.scfenergies` for the SCF energy progression, and `data.moenergies` for
orbital energies.
