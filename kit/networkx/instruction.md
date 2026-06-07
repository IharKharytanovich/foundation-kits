# NetworkX

NetworkX is the standard Python library for creating, manipulating, and
analysing graphs and complex networks. It supports undirected, directed, and
multi-edge graphs with arbitrary node and edge attributes. NetworkX is used
across domains including biology (protein interaction networks, metabolic
pathways), social-network analysis, and infrastructure modelling. It depends
on NumPy, decorator, and setuptools.

## When to Use

- Creating and manipulating graph structures (nodes, edges, attributes, weights)
- Computing shortest paths, minimum spanning trees, or network flows
- Measuring centrality (degree, betweenness, closeness, PageRank, eigenvector)
- Finding connected components, cliques, or communities
- Generating standard graph topologies (path, cycle, grid, Erdos-Renyi,
  Barabasi-Albert, Watts-Strogatz small-world)
- Reading and writing graph file formats (edge list, GML, GraphML, adjacency
  list, GEXF)
- Analysing biological networks — protein-protein interaction graphs, metabolic
  pathway connectivity, gene co-expression networks

## When NOT to Use

- Phylogenetic tree construction, comparison, or Robinson-Foulds distances (use
  **dendropy** — it handles Newick/Nexus tree formats and phylogenetics-specific
  algorithms)
- Raw matrix operations or sparse-matrix graph algorithms at scale (use
  **numpy** or **scipy** — NetworkX stores graphs as dicts, not sparse matrices)
- Machine-learning on graph features (use **scikit-learn** after extracting
  features from NetworkX)
- Tabular data manipulation (use **pandas**)
- Sequence or structural bioinformatics (use **biopython**)

## Capabilities

| Area | Key API |
|---|---|
| Graph types | `nx.Graph`, `nx.DiGraph`, `nx.MultiGraph`, `nx.MultiDiGraph` |
| Shortest paths | `nx.shortest_path`, `nx.shortest_path_length`, `nx.dijkstra_path` |
| Centrality | `nx.degree_centrality`, `nx.betweenness_centrality`, `nx.pagerank` |
| Components | `nx.connected_components`, `nx.strongly_connected_components`, `nx.is_connected` |
| Generators | `nx.path_graph`, `nx.cycle_graph`, `nx.erdos_renyi_graph`, `nx.barabasi_albert_graph` |
| Traversal | `nx.bfs_edges`, `nx.dfs_edges`, `nx.bfs_tree`, `nx.topological_sort` |
| I/O | `nx.read_edgelist`, `nx.write_graphml`, `nx.from_pandas_edgelist` |
| Attributes | node/edge data dicts, `G.nodes[n]`, `G.edges[u, v]`, weight parameters |

## Worked Example

Find the shortest-path length in a three-node path graph:

```python
import networkx as nx

G = nx.path_graph(3)          # nodes 0—1—2
length = nx.shortest_path_length(G, 0, 2)
str(length)
# → "2"
```

`path_graph(3)` creates an undirected graph with edges 0–1 and 1–2, so the
shortest path from node 0 to node 2 traverses two edges. For weighted graphs,
pass `weight='cost'` to `shortest_path_length` or use `nx.dijkstra_path`.
