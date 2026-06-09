# ViennaRNA

ViennaRNA (version 2.7.2) predicts and analyzes RNA secondary structure by
minimum free energy (MFE) thermodynamic folding and related algorithms. It runs
as a single multiplexed WASI binary — you select an operation and fill in its
parameters; the runtime handles invocation. The underlying algorithms use the
Turner 2004 nearest-neighbor energy model.

This kit exposes 19 operations from the ViennaRNA Package covering MFE folding,
suboptimal enumeration, co-folding, hybridization, accessibility, thermodynamics,
structural comparison, local folding, pseudoknot prediction, and more.

## When to Use

- Predicting the minimum free energy (MFE) secondary structure of an RNA sequence
- Enumerating suboptimal RNA structures within an energy range
- Predicting RNA-RNA hybridization or co-folding of two strands
- Computing thermodynamic properties (specific heat, partition function distances)
- Comparing RNA secondary structures (distance, alignment)
- Scanning long RNAs for locally stable structures (sliding window)
- Predicting pseudoknots in RNA secondary structure
- Evaluating the free energy of a given RNA structure
- Analyzing RNA accessibility (unpaired region probabilities)
- 2D folding landscape projections and density of states

## When NOT to Use

- General DNA/RNA/protein sequence manipulation, format conversion, or translation
  (use **biopython** — it handles FASTA I/O, reverse complement, and sequence
  objects)
- Predicting protein-coding genes in prokaryotic genomes (use **pyrodigal**)
- Phylogenetic tree construction or comparison (use **dendropy**)
- Molecular mass or chemical formula calculations (use **molmass**)
- Protein structure prediction or analysis (outside this kit set)
- Sequence alignment or homology search (use **biopython** or external tools)

## Operations

| Operation | Summary |
|---|---|
| `fold` | MFE secondary structure (dot-bracket + energy) |
| `subopt` | Enumerate suboptimal structures within an energy range |
| `cofold` | MFE structure of two hybridizing RNA strands |
| `eval` | Evaluate free energy of a given RNA secondary structure |
| `duplex` | Predict hybridization structure between two RNA sequences |
| `alifold` | Consensus MFE structure from a sequence alignment |
| `up` | RNA accessibility — probability of unpaired regions |
| `heat` | Specific heat of an RNA as a function of temperature |
| `distance` | Distance between two RNA secondary structures |
| `pdist` | Ensemble base-pair probability distance between two RNA sequences |
| `paln` | Pairwise structural alignment of two RNA sequences |
| `plex` | Fast RNA-RNA interaction prediction |
| `lfold` | Locally stable structures in a long RNA (sliding window) |
| `lalifold` | Locally stable consensus structures from an RNA alignment |
| `pkplex` | Pseudoknot prediction in RNA secondary structure |
| `td2fold` | 2D projection of RNA folding landscape relative to reference structures |
| `dos` | Density of states — count RNA structures per energy band |
| `multifold` | MFE structure of multiple interacting RNA strands |
| `parconv` | Convert energy parameter file from ViennaRNA 1.8.4 to 2.0 format |

Pick an operation and supply its parameters. Do not pass raw command-line flags;
the runtime maps parameters to the correct invocation.

### Dot-Bracket Notation

In the output, each character represents one nucleotide position:
- `(` — base is paired (opening / 5' side)
- `)` — base is paired (closing / 3' side)
- `.` — base is unpaired

The energy value in parentheses is the minimum free energy in kcal/mol (more
negative = more stable). Pseudoknots use `[` / `]` brackets for the crossing
pairs.

## Worked Examples

### `fold`

Predict the MFE structure of a short hairpin:

**Operation**: `fold`
**Parameters**: `{ "sequence": "GGGAAACCC" }`
**Output**:
```
GGGAAACCC
(((...)))  ( -1.20)
```

The three G's pair with the three C's to form a stem, and the three A's form
the loop — a classic hairpin. The MFE is -1.20 kcal/mol.

### `subopt`

Enumerate suboptimal structures within 1 kcal/mol of the MFE:

**Operation**: `subopt`
**Parameters**: `{ "sequence": "GGGAAACCC", "energy_range": "1" }`
**Output**:
```
GGGAAACCC  -1.20   1.00
(((...)))  -1.20
((....)).  -1.00
```

### `cofold`

MFE structure of two hybridizing RNA strands (joined by `&`):

**Operation**: `cofold`
**Parameters**: `{ "sequences": "GGGAAACCC&CCCAAAGGG" }`
**Output**:
```
GGGAAACCC&CCCAAAGGG
(((......&)))...... ( -5.30)
```

### `eval`

Evaluate the free energy of a given sequence + structure:

**Operation**: `eval`
**Parameters**: `{ "structure": "GGGAAACCC\n(((...)))" }`
**Output**:
```
GGGAAACCC
(((...))) ( -1.20)
```

### `duplex`

Predict hybridization between two separate RNA sequences:

**Operation**: `duplex`
**Parameters**: `{ "sequences": "GGGAAACCC\nCCCUUUGGG" }`
**Output**:
```
(((.&))).   1,4   :   1,4   (-4.80)
```

### `alifold`

Consensus MFE structure from a CLUSTAL alignment:

**Operation**: `alifold`
**Parameters**: `{ "alignment": "CLUSTAL W\n\ns1    GGGAAACCC\ns2    GGGAAACCC" }`
**Output**:
```
GGGAAACCC
(((...))) ( -1.20 =  -1.20 +   0.00)
```

### `up`

RNA accessibility — probability of the most accessible unpaired region:

**Operation**: `up`
**Parameters**: `{ "sequence": "GGGAAACCC" }`
**Output**:
```
   3,   6 	 (0.478) 	 for u=  4
```

### `heat`

Specific heat as a function of temperature:

**Operation**: `heat`
**Parameters**: `{ "sequence": "GGGAAACCC", "tmin": "0", "tmax": "5" }`
**Output**:
```
0	0.00571603
1	0.0062748
2	0.0068075
3	0.0074041
4	0.00803505
5	0.00882194
```

### `distance`

Distance between two RNA secondary structures:

**Operation**: `distance`
**Parameters**: `{ "structures": ".((..))..\n((...)).." }`
**Output**:
```
f: 2
```

### `pdist`

Ensemble base-pair probability distance between two RNA sequences:

**Operation**: `pdist`
**Parameters**: `{ "sequences": "GGGAAACCC\nGGGAAAUCC" }`
**Output**:
```
2.0018
```

### `paln`

Pairwise structural alignment of two RNA sequences:

**Operation**: `paln`
**Parameters**: `{ "sequences": "GGGGAAAACCCC\nGGGGAAAUCCCC" }`
**Output**:
```
11.0271
GGGGAAAACCCC
((((....))))
GGGGAAAUCCCC
((((....))))
```

### `plex`

Fast RNA-RNA interaction prediction:

**Operation**: `plex`
**Parameters**: `{ "sequences": "GGGAAACCC\nCCCUUUGGG" }`
**Output**:
```
(((.&))).   1,4   :   1,4   (-4.80) i:3,j:1 <-4.60>
```

### `lfold`

Locally stable secondary structures in a long RNA (sliding window):

**Operation**: `lfold`
**Parameters**: `{ "sequence": "GGGAAACCCGGGAAACCC", "window_size": "15" }`
**Output**:
```
.(((...))) ( -1.50)    9
.((....)). ( -0.80)    1
(((...))). ( -2.90)    1
GGGAAACCCGGGAAACCC
 ( -4.40)
```

### `lalifold`

Locally stable consensus structures from an alignment (sliding window):

**Operation**: `lalifold`
**Parameters**: `{ "alignment": "CLUSTAL W\n\ns1    GGGAAACCCGGGAAACCC\ns2    GGGAAACCCGGGAAACCC", "window_size": "15" }`
**Output**:
```
.(((...))) ( -1.50)    9 -   18
(((...))). ( -2.90)    1 -   10
GGGAAACCCGGGAAACCC
```

### `pkplex`

Pseudoknot prediction in RNA secondary structure:

**Operation**: `pkplex`
**Parameters**: `{ "sequence": "GGGGAAAACCCCUUUUGGGGAAAACCCC", "energyCutoff": "0" }`
**Output**:
```
GGGGAAAACCCCUUUUGGGGAAAACCCC
((((....(((([[[[))))]]]])))) (-17.60)
(((([[[[((((]]]]))))....)))) (-17.60)
```

### `td2fold`

2D projection of the RNA folding landscape relative to two reference structures:

**Operation**: `td2fold`
**Parameters**: `{ "input": "GGGAAACCC\n(((...)))\n(((...)))" }`
**Output**:
```
GGGAAACCC
(((...))) ( -1.20)
(((...))) ( -1.20) <ref 1>
(((...))) ( -1.20) <ref 2>
k	l	MFE	MFE-structure
0	0	 -1.20	(((...)))
1	1	  0.90	((.....))
2	2	  3.20	.(.....).
3	3	  0.00	.........
4	4	  2.10	.(....)..

5	5	 -1.00	((....)).
```

### `dos`

Density of states — count RNA structures per energy band:

**Operation**: `dos`
**Parameters**: `{ "sequence": "GGGAAACCC" }`
**Output**:
```
Energy bands with counted structures:
 -1.20	         1
 -1.00	         1
  0.00	         1
```

### `multifold`

MFE structure of multiple interacting RNA strands:

**Operation**: `multifold`
**Parameters**: `{ "sequences": "GGGAAACCC&CCCAAAGGG" }`
**Output**:
```
GGGAAACCC&CCCAAAGGG
(((......&)))...... ( -5.30)
```

### `parconv`

Convert energy parameters from ViennaRNA 1.8.4 to 2.0 format:

**Operation**: `parconv`
**Parameters**: `{ "parameters": "# stack_energies\n  -240  -330  -210  -140  -210  -210\n  -330  -340  -250  -150  -220  -240" }`
**Output**:
```
## RNAfold parameter file v2.0

# stack
/*  CG    GC    GU    UG    AU    UA    @  */
  -240  -330  -210  -140  -210  -210  -330
  -330  -340  -250  -150  -220  -240     0
  -210  -250   130   DEF  -140  -130     0
  -140  -150   DEF    30   -60  -100     0
  -210  -220  -140   -60  -110   -90     0
  -210  -240  -130  -100   -90  -130     0
     0     0     0     0     0     0     0

# stack_enthalpies
/*  CG    GC    GU    UG    AU    UA    @  */
 -1060 -1340 -1210  -560 -1050 -1040     0
 -1340 -1490 -1260  -830 -1140 -1240     0
 -1210 -1260 -1460 -1350  -880 -1280     0
  -560  -830 -1350  -930  -320  -700     0
 -1050 -1140  -880  -320  -940  -680     0
 -1040 -1240 -1280  -700  -680  -770     0
     0     0     0     0     0     0     0

# END
```

## Tools Present but Not Exposed

The multiplexed binary contains all 25 ViennaRNA programs, but six are not
exposed as operations:

| Tool | Reason |
|---|---|
| RNAplot | File-only output (PostScript) — the runtime captures stdout only |
| RNAplfold | File-only output — the runtime captures stdout only |
| RNApvmin | Requires GSL dependency (excluded from build) |
| RNAaliduplex | Requires two alignment file arguments (multi-file input incompatible with single-stdin contract) |
| RNAinverse | Stochastic output with no fixed-seed option for deterministic results |
| RNAsnoop | Requires separate snoRNA query and target file inputs (multi-file input incompatible with single-stdin contract) |

These tools remain in the binary for potential future use if the runtime adds
file-output capture or multi-file input support.
