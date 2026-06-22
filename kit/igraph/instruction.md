# igraph

igraph (python-igraph) is a high-performance graph analytics library backed by a
compiled C core. It covers community detection (Leiden, Louvain, label
propagation), centrality measures, motif counting, subgraph isomorphism (VF2,
LAD), maximum flow / minimum cut, and standard graph algorithms — all
significantly faster than pure-Python alternatives on large graphs. It bundles
texttable for formatted output.

## When to Use

- Large-scale graph analytics where performance matters (C-core, orders of
  magnitude faster than pure-Python on graphs with 10 k+ edges)
- Community detection — Leiden (`community_leiden`), Louvain
  (`community_multilevel`), label propagation, edge betweenness
- Centrality at scale — betweenness, closeness, eigenvector, PageRank
- Motif counting and census (`motifs_randesu`, `dyad_census`, `triad_census`)
- Subgraph isomorphism — VF2 (`isomorphic_vf2`, `get_isomorphisms_vf2`) and
  LAD algorithms
- Maximum flow / minimum cut (`maxflow`, `mincut`, `st_mincut`)
- Generating classic named graphs (`Graph.Famous`), random graphs
  (`Graph.Erdos_Renyi`, `Graph.Barabasi`), and lattice/tree generators
- Reading/writing graph file formats (GraphML, GML, edge list, Pajek, LEDA)

## When NOT to Use

- Simple graph construction, breadth-first search, shortest paths, or lightweight
  network analysis where pure-Python suffices and interoperability with other
  Python libraries matters more than speed (use **networkx** — it integrates
  naturally with pandas, matplotlib, and the wider Python ecosystem)
- Graph visualisation or drawing (igraph has limited plotting; prefer networkx +
  matplotlib or a dedicated visualisation tool)
- Phylogenetic tree construction or comparison (use **dendropy**)
- Machine-learning on graph features (extract features with igraph, then use
  **scikit-learn**)
- Sparse-matrix linear algebra or spectral methods on graphs (use **scipy** —
  igraph focuses on combinatorial graph algorithms, not matrix factorisations)

## igraph vs networkx

| Aspect | igraph | networkx |
|---|---|---|
| Core | Compiled C library — fast on large graphs | Pure Python — slower but more accessible |
| Community detection | Leiden, Louvain, label propagation (native) | Basic (Girvan-Newman); Leiden via external dep |
| Motifs | `motifs_randesu`, dyad/triad census | Limited |
| Isomorphism | VF2, LAD | VF2 (pure-Python, slower) |
| Ecosystem | Standalone graph analytics | Tight pandas/matplotlib/scipy integration |

**Rule of thumb:** reach for **igraph** when you need performance on large graphs
or specialised algorithms (Leiden, motifs, VF2 at scale); reach for **networkx**
when you need ecosystem interoperability or a simpler API for moderate-size graphs.

## Capabilities

| Area | Key API |
|---|---|
| Community detection | `community_leiden`, `community_multilevel` (Louvain), `community_label_propagation` |
| Centrality | `betweenness`, `closeness`, `eigenvector_centrality`, `pagerank` |
| Motifs | `motifs_randesu`, `dyad_census`, `triad_census` |
| Isomorphism | `isomorphic_vf2`, `get_isomorphisms_vf2`, `subisomorphic_lad` |
| Flow | `maxflow`, `mincut`, `st_mincut` |
| Generators | `Graph.Famous`, `Graph.Erdos_Renyi`, `Graph.Barabasi`, `Graph.Tree`, `Graph.Lattice` |
| Shortest paths | `shortest_paths`, `get_shortest_paths`, `distances` |
| I/O | `Graph.Read_GraphML`, `Graph.Read_GML`, `Graph.Read_Edgelist`, `write_graphml` |
| Components | `connected_components`, `clusters`, `is_connected` |

## Worked Example

Count vertices and edges of the Zachary karate-club graph:

```python
import igraph

g = igraph.Graph.Famous('zachary')
result = (g.vcount(), g.ecount())
str(result)
# → "(34, 78)"
```

The Zachary karate-club graph is a well-known social network with 34 members and
78 ties. `Graph.Famous` provides many named graphs (Petersen, Tutte, etc.) for
quick exploration. For real workloads, build graphs with `Graph()`, `add_vertices`,
`add_edges`, or read from files with `Graph.Read_GraphML`.
