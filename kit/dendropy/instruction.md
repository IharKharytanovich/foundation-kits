# DendroPy

DendroPy is a Python library for phylogenetic computing. It provides rich data
structures for phylogenetic trees and character matrices, along with functions for
reading/writing standard phylogenetic formats (Newick, Nexus, NeXML), computing
tree-to-tree distances, manipulating tree topology, and simulating trees under
birth-death models. The import name is `dendropy` (lowercase), even though the
upstream project is styled "DendroPy".

## When to Use

- Reading or writing phylogenetic trees in Newick, Nexus, or NeXML format
- Computing tree distance metrics (Robinson-Foulds / symmetric difference,
  weighted Robinson-Foulds, Euclidean distance)
- Manipulating tree topology: pruning taxa, rerooting, extracting subtrees,
  collapsing edges
- Building consensus trees (strict, majority-rule) from a set of trees
- Simulating phylogenetic trees under birth-death or coalescent models
- Iterating over nodes, edges, and leaf sets for custom tree statistics
- Working with character matrices (DNA, protein, continuous) alongside trees

## When NOT to Use

- DNA/RNA/protein sequence manipulation or format parsing (use **biopython** —
  DendroPy handles tree formats, not sequence formats like FASTA/GenBank)
- Predicting genes in prokaryotic genomes (use **pyrodigal**)
- RNA secondary structure prediction (use **viennarna**)
- Molecular mass or chemical formula calculations (use **molmass**)
- Numerical array computation or linear algebra (use **numpy**)
- Statistical modelling or optimisation (use **scipy**)

## Capabilities

| Area | Key API |
|---|---|
| Tree I/O | `dendropy.Tree.get(data=..., schema='newick')`, `Tree.as_string(schema=...)` |
| Tree collections | `dendropy.TreeList.get(path=..., schema='nexus')` |
| Distance metrics | `dendropy.calculate.treecompare.symmetric_difference`, `weighted_robinson_foulds_distance` |
| Manipulation | `Tree.prune_taxa(...)`, `Tree.reroot_at_midpoint()`, `Tree.extract_tree(...)` |
| Node access | `Tree.leaf_nodes()`, `Tree.internal_nodes()`, `Tree.preorder_node_iter()` |
| Consensus | `dendropy.calculate.treecompare.strict_consensus_tree(...)` |
| Simulation | `dendropy.simulate.treesim.birth_death_tree(...)`, `dendropy.simulate.treesim.pure_kingman_tree(...)` |
| Character data | `dendropy.DnaCharacterMatrix`, `dendropy.ProteinCharacterMatrix` |

## Worked Example

Parse a Newick tree string and count its leaf nodes:

```python
import dendropy

tree = dendropy.Tree.get(data='(A,(B,C));', schema='newick')
leaf_count = len(tree.leaf_nodes())
str(leaf_count)
# → "3"
```

The tree `(A,(B,C))` has three leaves: A, B, and C. Use `tree.as_string(schema='newick')`
to serialize back, or `treecompare.symmetric_difference` to compare two trees.
