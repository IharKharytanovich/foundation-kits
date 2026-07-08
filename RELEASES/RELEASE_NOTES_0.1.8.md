# Foundation 0.1.8

**Release date:** July 8, 2026
**Previous version:** [0.1.7](https://github.com/IharKharytanovich/foundation-kits/blob/main/RELEASES/RELEASE_NOTES_0.1.7.md) (July 1, 2026)

Where 0.1.7 promoted the knowledge graph to a first-class retrieval channel,
0.1.8 makes that graph **trustworthy, complete, and ready to scale**. Until now
every authored connection claimed the same flat certainty, the graph had no way
to notice its own gaps, semantic similarity lived only as a throwaway in-memory
computation, and the whole structure was re-serialized in full on every write.
This release fixes all four: edges now carry a real, computed confidence; the
graph measures its own coverage and nudges you to close holes; semantic
similarity becomes a persisted layer the agent can actually walk, fused with the
authored graph under a single reasoning pass; and the storage layout is
re-engineered to stay fast at thousands of files. Under the hood, the
server-readiness track that 0.1.5 started moves several steps closer to "one
kernel, many tenants."

Every graph change in this release shipped behind an offline evaluation harness —
each feature is a measured decision, not an assumption — and existing domains keep
working unchanged.

---

## Highlights

### 🎯 Edges that know how sure they are

- Every authored relationship in a domain used to be stamped with a flat
  `confidence: 1.0`. Now each edge carries a **deterministic, composite
  confidence** built from four honest signals: the **source type** behind it (a
  paper-backed claim outranks an agent's guess), whether it's **grounded** in an
  actual supporting sentence, how many independent files **corroborate** it, and
  whether it's **in conflict** with a competing assertion.
- Edge types gain a **polarity vocabulary** — the graph now understands that
  `supports` and `refutes` point in opposite directions — backed by an
  inverse-consistency linter and a new **`conflicted`** status for concept pairs
  that are both supported and refuted. Conflicting edges no longer coexist
  silently.
- **Near-duplicate concepts stop fragmenting the graph.** Entity resolution
  surfaces merge candidates (`react-hooks` vs `hooks-react`) so corroboration and
  backlinks accumulate on one concept instead of splitting across two.
- **Ingested content is treated with appropriate caution.** Edges born from
  email, web, or transport content carry a lower prior than curated files, closing
  a knowledge-poisoning vector. And confidence now flows into **every** channel of
  the graph walk — the `related` and `backlink` channels used to ignore it
  entirely, letting untyped edges outrank weighted ones.

### 🕸️ The graph fills its own gaps

- `_audit.md` learned to answer a question it never could before: **"how much of
  the graph actually exists?"** New intrinsic-coverage metrics — computed without
  any gold reference — show what share of concepts carry a typed edge, which
  schema edge types have become dead vocabulary, and where the population has
  holes. The same numbers are available to the agent through the `auditKnowledge`
  tool, and precision proxies (dangling rate, conflict pairs, bare-concept share)
  sit right next to them so completeness can't be gamed with plausible garbage.
- Schemas can now declare **per-kind cardinality expectations** ("a concept of
  kind `metric` expects a `measured-by` edge") that surface as **advisory** —
  never blocking — conformance notes.
- A **semantic rule verifier** catches edges that pass every structural gate but
  are logically suspect — a `contradicts` aimed at a concept's own ancestor, a
  `supports` pointed at a superseded target — with explained repairs.
- An **opt-in guided reflexion loop** injects a deterministic gap-list into the
  write-tool advisory channel, so the agent is nudged toward the specific holes
  worth closing rather than left to free-form self-critique.
- **Implied structure is now materialized.** Inverse and transitive edges
  (`supports A→B` implies `supported-by B→A`; a `derived-from` chain yields its
  shortcut) are written into `_relations.md` with a distinct `inferred-rule`
  provenance and confidence inherited from the edge that generated them — clean,
  greppable, and embedding-free.

### 🔗 A semantic graph you can walk

- Vector similarity used to be a zero-hop dead end: the agent could ask "what's
  near this file" but couldn't *traverse* semantic neighborhoods, and the full
  similarity graph was rebuilt from scratch, in memory, on every coherence run.
  0.1.8 turns it into a **persisted semantic similarity graph** — symmetric
  mutual-kNN, relative-neighborhood-pruned, degree-capped, with a connectivity
  guard — that lives alongside the authored graph.
- Crucially, the two graphs are **fused under a single Personalized-PageRank
  walk** (the HippoRAG pattern): the agent's existing `walkGraph` and
  `exploreConcept` tools now traverse authored *and* semantic structure in one
  coherent neighborhood, and the semantic signal reinforces authored paths
  *during* the walk instead of arriving late as a flat merged list.
- Like the rest of the index, the semantic graph is derived, never committed, and
  rebuildable — and it's maintained incrementally as files change.

### 🧭 A graph that navigates and retrieves on its own

- The graph channel can now **fire by itself**. A query that names a concept by an
  alias the text never spells out used to retrieve nothing; now the graph seeds
  retrieval directly from concept matches in the `_concepts.md` registry, even
  when lexical and semantic search both miss.
- Retrieval got **specificity-aware**: rare, precise concepts are no longer
  drowned out by generic hubs that happen to be referenced by everything, and the
  walk now discounts `conflicted` and low-provenance edges instead of pushing them
  as hard as undisputed facts.
- **Structural link suggestions reach the agent** — with guardrails. Because
  stronger models anchor *harder* on suggestions, each one ships with a
  falsification framing, a cap, a required edge type and supporting sentence, and a
  **persistent rejection memory** so a wrong suggestion no longer returns forever.
- Navigation guidance now offers a **two-route preamble** so relational questions
  ("how does X relate to Y") can reach for the graph directly instead of paying
  two or three index reads first — and all of it is measured by a new deterministic
  multi-hop / relational benchmark in the retrieval harness.

### 🎚️ Similarity you can trust

- Raw cosine similarity is **demoted from a source of truth to a calibrated,
  cross-checking suggestion tier**. Acceptance of machine-inferred artifacts
  (`_inferred.md`, `_redundant.md`) moves off fixed per-domain constants onto a
  **percentile-hybrid threshold** — a corpus-relative quantile band guarded by an
  absolute per-model floor, with a small-corpus fallback so a 50-file domain
  doesn't accept its top pairs just because they're the top pairs.
- Cosine finally earns its keep as a *suggestion*: a grounding-divergence
  cross-check section in `_audit.md` ("this edge is grounded in text yet its files
  sit far apart"), redundant-cluster dedup candidates for the advisor, and
  high-similarity unlinked pairs offered to the reflexion gap-list.
- A read-time, per-type **decay experiment** ships behind a flag (disabled by
  default, with hard safety rails), and the principle that **all time-derived
  values are computed at read time** is now a fixed project invariant.

### ⚡ Built to scale

- The three generated graph tables — `_relations.md`, `_concepts.md`,
  `_backlinks.md` — used to be **monoliths at the domain root**, re-sorted and
  rewritten in full on every single write. At thousands of files that meant
  multi-megabyte rewrites and giant, non-local git diffs for a one-line edit. They
  are now **per-folder shards**, exactly like the existing per-folder `index.md`:
  a write touches only the changed file's folder, and git diffs stay local —
  while grep and byte-identical regeneration are preserved per shard.
- On top of the shards sits a **disposable SQLite projection** that turns graph
  reads (`walkGraph`, `exploreConcept`, PPR retrieval, concept-seeding) from
  O(whole-domain) scans into **O(neighborhood)** indexed lookups, and adds the
  fan-in index that "who points to X" always lacked. The projection is never
  committed and is rebuilt from the shards — including automatically when a domain
  is **cloned or pulled**, incrementally by changed shard, so a freshly installed
  domain answers graph queries correctly out of the gate.

---

## Under the hood

Alongside the graph work, this release advances the long-running effort to make
`@found/core` a re-mountable, multi-tenant kernel — "one constructor change from a
server."

- **Request-time tenant paths, proven.** The dormant `TenantContext` frame is now
  verified infrastructure: one path family resolves per-tenant at request time,
  and a single composed kernel demonstrably serves two isolated tenant frames —
  the walking skeleton of the "one kernel, N tenants" model. This also confirms
  the partial 0.1.5 server-readiness track is genuinely closed rather than
  silently inherited.
- **The write path now has a seam.** 0.1.5 put file *reads* behind an injectable
  `FileStore` port but left writes on direct synchronous `node:fs`. 0.1.8 closes
  that debt: the ten tools that mutate the filesystem now go through a
  `WritableFileStore` port (async, object-store-shaped), and the five read-only
  tools move onto the read port — no more blocking sync I/O stalling SSE
  heartbeats mid-stream, and a clean place to plug a per-tenant write sandbox. The
  migration is behavior-preserving, verified against byte-identical goldens.
- **Less coupling at the god-hubs.** The kernel facade and `SessionService` were
  the two places everything converged. Repos are unified under one bundle-token
  pattern with a drift guard; four modules that reached for the whole `Kernel` now
  depend on narrow per-consumer role slices; and the 45-field chat-streaming
  dependency assembly is extracted out of `SessionsModule` into a dedicated
  composer.
- **Coherence gets its own namespace.** The knowledge-analytics subsystem had
  grown into a quarter of the top-level `kernel.<name>` surface; it now lives under
  a single aggregating `kernel.coherence.*` namespace, and three god-classes that
  had crept past 700 lines were split along the documented aspect pattern.

---

## Upgrade notes

- **Existing domains keep working unchanged.** Confidence, polarity, implied
  edges, and the sharded layout apply going forward; nothing in an existing domain
  needs to be rewritten by hand.
- **The SQLite graph index and semantic graph are disposable** — derived from your
  committed files, never committed themselves, and rebuilt automatically (including
  on clone / pull). There is nothing new to back up.
- The semantic-graph and calibration features light up where a **semantic index
  exists** and fall back to structural analysis where it doesn't — no feature in
  this release requires a particular embedding provider to be useful.
- As with prior releases, **restart the daemon after upgrading** so the new
  background index and write paths are picked up.
