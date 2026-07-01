# Foundation 0.1.7

_Released 2026-07-01 · previous: [0.1.6](https://github.com/IharKharytanovich/foundation-kits/blob/main/RELEASES/RELEASE_NOTES_0.1.6.md)_

Where 0.1.6 taught a domain to *see* its own structure, 0.1.7 makes that
structure **load-bearing**. The knowledge graph stops being a decoration on top
of vector search and becomes a first-class part of how the agent finds, reads,
and reasons about your files — provenance-tracked, confidence-weighted, and
aware of time. Steering learns to remember across sessions and to stay quiet
when you're already on track. And every one of these levers ships behind an
offline eval, so nothing lands on intuition alone.

## Highlights

**🧭 The graph now answers your searches**

Hybrid search used to be lexical + semantic, with a global PageRank score bolted
on afterwards. That was the weakest way to use a graph. Now the graph is a real
retrieval channel:

- **Query-seeded graph channel** — a Personalized PageRank seeded from *your
  query's* entry points, fused as a full third list alongside lexical and
  semantic (not a post-hoc nudge), and gated to the structural queries where it
  actually helps.
- **Graduated field boosts** — a `topic` hit now outranks an `anchors` hit
  outranks a `body` hit, instead of all fields flattening into one list before
  fusion.
- **Structural-importance prior** — a file that twenty others link to outranks a
  private helper, via a cached per-domain PageRank over the `related`/backlink
  graph.
- **Self-query filters and per-query routing** — the agent can constrain by
  frontmatter fields before ranking, and a rule-based classifier re-weights the
  channels by query shape (entity lookup → lexical, conceptual → semantic, "how
  X relates to Y" → graph).
- **Cross-encoder rerank behind a gate** — an optional final re-scoring stage,
  **off by default**, that only turns on once the offline eval proves a lift on
  your domain's own golden set.

**🔎 Explore a concept in one call**

A new **`exploreConcept`** tool returns a concept's neighbourhood, the snippets
that define it, and its downstream blast-radius in a single call — the surgical
"give me everything that touches this" move, adapted from CodeGraph to free-form
prose. Edit-time output now also carries an **"affects N concepts"** line so the
agent sees the ripple before it writes.

**🏷️ Every edge knows where it came from**

Relations are no longer undifferentiated facts:

- **Provenance + confidence** are first-class on every edge — you can tell an
  author-declared relation from a machine-inferred one, and each carries a score.
- **Inferred edges are materialized** — high-confidence semantic neighbours the
  coherence geometry already detected (and used to throw away) are written into a
  machine-owned `_inferred.md` graph file, kept fresh lazily without a
  per-edit watcher.
- **Retrieval trusts the scores** — a 0.85 inferred edge no longer pulls as hard
  as an authored fact, near-duplicate hits collapse to "representative + N
  similar", and explorer/advisor output labels each edge ("inferred (0.82)" vs
  "authored").

**⏳ A knowledge graph with a memory of time**

Temporal edge validity is now real and honored everywhere. The old boolean
`current`/`superseded` flag — written but ignored by most readers — is replaced
by a Graphiti-style **bitemporal model**: `valid-from`/`valid-to` event time plus
`recorded-at` transaction time, with `status` derived. Superseded edges are now
correctly filtered out of PageRank, centrality, coherence, and graph traversal,
and a cheap no-LLM structural scan flags conflicting edges.

**🗺️ Agents that navigate instead of guess**

The DCC bet is "structure beats similarity" — but only if the agent actually
uses the structure. This release closes that gap:

- The navigation guidance moves from prose buried mid-prompt to an **actionable
  checklist at the end** — the reformatting the research links to near-perfect
  navigation adoption.
- **Folder indexes now carry file counts**, so the agent can route without
  opening files first.
- **Lateral traversal is first-class** — following a `related`/`[[id]]`
  cross-link is now a sanctioned next-read move, not an afterthought.
- The write path gains a **structural linter with explained repair**: rejections
  come back with a human-readable reason *and* a suggested fix (cardinalities,
  `derived-from` acyclicity), never an auto-applied one.

**🎯 Steering that remembers — and knows when to stay quiet**

The "Consider reading:" nudges got substantially smarter and less noisy:

- **Memory across sessions** — the steering centroid now survives daemon
  restarts and fresh CLI sessions, rebuilt from persisted history with wall-clock
  decay, so a file you read yesterday isn't recommended to you as "new" today.
- **Less drift** — a prior-dominant update rule plus an always-on anchor blend
  and change-point re-anchoring keep the centroid from wandering off the task.
- **Diverse, adaptive picks** — a Determinantal-Point-Process selector structurally
  refuses near-duplicate recommendations and stops early when the topic is sharp
  (recommend one file, not three, when one is right).
- **On-track suppression** — steering stays silent when your own tool-call
  trajectory shows you're making progress; it fires on novelty *and* struggle,
  never on similarity alone.
- **Typed edges you can read** — a `contradicts` or `derived-from` relation now
  renders its label *and* referent (`(contradicts auth.md)`) even when the file
  is also semantically near, so a contrasting document no longer reads as
  supportive context.

**🔬 Health metrics you can trust — and track over time**

Coherence analysis got an honesty pass and a time axis:

- **Embedding-space hygiene** — fixed cosine thresholds (which silently break on
  an embedder swap) are replaced by per-corpus percentile calibration, and
  mean-centering + whitening + hubness correction de-bias the geometry before any
  metric runs.
- **Honest cluster validity** — the folder tightness score is now null-referenced
  against random samples of your own corpus (so a small folder no longer looks
  "tight" as an artifact), with DBCV added as an exploratory label-free index.
- **Richer structural detectors** — k-core, bridges/articulation points, and
  Forman-Ricci edge curvature replace the old binary dead-end/island signals with
  theorem-backed ones.
- **Coherence over time** — `found coherence snapshot <domain>` captures a
  point-in-time summary and `found coherence trends <domain>` reports the
  direction of travel (Mann-Kendall + Sen's slope on the coherence series,
  giant-component and centroid drift).

## Under the hood

Every steering, graph, and retrieval change in 0.1.7 is a **hypothesis with a
gate**. This release ships a full suite of offline, deterministic eval harnesses
so each lever is a decision, not a guess: `found eval steering` (now splitting
the recoverable *abstain* failure from the dangerous *wrong-action* one),
`found eval links`, `found eval nav`, `found eval complementarity`, and
`found eval retrieval <domain>`. Features that depend on an embedding space
degrade gracefully on domains without embeddings, and behaviour is unchanged when
steering/advisory is disabled — every new lever sits behind a conservative,
config-tunable, fully reversible default. The generated context tables preserve
their byte-identity invariant, so the bitemporal and provenance schema changes
are backward compatible. As before, some steering and trace features require
restarting the daemon after upgrade to activate their background processes.
