# Foundation 0.1.10

**Release date:** July 22, 2026
**Previous version:** [0.1.9](https://github.com/IharKharytanovich/foundation-kits/blob/main/RELEASES/RELEASE_NOTES_0.1.9.md) (July 15, 2026)

0.1.8 made the knowledge graph trustworthy. 0.1.9 put that trust in the agent's
hands — the write path, the edit path, the retrieval path. 0.1.10 turns the same
attention on **the graph model itself**. Until now the ontology was hardcoded in
`@found/core`: every domain got the same file-and-concept node types, the same
fixed edge sources, and the same four string-family frontmatter types. Adding a
new *kind* of graph — people, processes, typed numeric facts — meant a pull
request against the engine.

This release makes the graph model **declarative**. A domain now describes its
own node types, edge sources, edge-bearing fields, and typed frontmatter in its
`schema.yaml`, and the whole product follows: storage, retrieval ranking,
`walkGraph`, `exploreConcept`, the link advisor, knowledge-audit. The built-in
ontology becomes just the *default configuration* of that model — byte-identical
for every domain that doesn't opt in. Underneath, the five specialized graph
tables collapse into two generic ones, custom-model domains get the same
neighborhood-bounded reads default domains already had, and the twelve
hand-written schema parsers are replaced by a single validated registry that no
longer silently drops your data.

---

## Highlights

### 🧬 Domains that describe their own graph

- A domain can now declare its own graph ontology in `schema.yaml` via
  **`graph.node-types`** and **`graph.edge-sources`**, instead of being limited
  to the built-in `file` / `concept` node types and fixed edge sources. A
  personality domain can declare `person` nodes (`declared-by: persons`) and a
  `person-mentions` edge source; Foundation materializes those nodes and derives
  the file→person edges from them.
- The declaration is **authoritative and exhaustive.** A schema that omits
  `inline-typed` no longer emits `type:: [[id]]` typed edges at all — the model
  is exactly what you wrote, backed by a closed extractor vocabulary (`field`,
  `wikilink`, `inline-typed`).
- The custom model is usable end-to-end, not just internal. `walkGraph` derives
  its `direction` options dynamically from your declared edge sources and
  describes them in its prompt (capped at 10, with an explicit non-silent note
  when more are declared or an id collides). `exploreConcept` accepts a custom
  node id — bare or `<type>:<id>` — and renders a node card. Retrieval ranking
  (the PPR/adjacency channel) counts custom edges toward relevance, with an
  optional per-source **`weight`** in `(0, 1]`. Knowledge-audit gains a
  **`node-refs`** check that flags dangling references to nonexistent nodes, plus
  coverage by node type.
- **`roles.file-edges`** is the first, smallest step from hardcoded semantics to
  declared ones: a domain names exactly which frontmatter fields act as
  file→file graph edges. Unlike the older `graph.edges` section — which is
  fail-open, so a typo in a field name was silently dropped — roles are
  **validated fail-closed**: a role pointing at a field that doesn't exist, or
  one of the wrong type, is a hard load error that names the field.
- **Nothing changes for domains that don't opt in.** All six bundled contracts
  stay on the default model; tool enums, prompts, ranking, and generated
  artifacts are byte-identical to 0.1.9. Invalid model declarations fail closed
  at load with a section-named error.

### 🔢 Frontmatter fields with real types

- The frontmatter field vocabulary grows from four string-family types into a
  **composable grammar**: scalars `string | number | boolean | date | path | ref`
  in four containers (`T`, `T[]`, `map<string, T>`, `map<string, T[]>`) — 24
  combinations from one `FieldTypeDescriptor` that every consumer (coercion, Zod
  validation, search matchers, `selfQuery` filters, prompts) now reads from.
- `number` and `boolean` are now **real JS primitives** in parsed frontmatter,
  not strings; `date` is a validated ISO-8601 value. Custom disciplines that
  used to encode everything as strings (numeric doses, boolean gates, dated
  claims) can finally say what they mean.
- **`path` and `ref` are existence-checked at write time.** A `path` must point
  at an existing domain file; a `ref` must resolve to a known concept. A write
  that violates that is blocked before it lands, with the offending field named.
- The policy is deliberately asymmetric: **fail-closed** at schema declaration
  (an unknown type or incompatible constraint is a load error), **fail-open** on
  read (an uncoercible value drops out and its name is recorded), and **strict on
  write** (uncoercible or constraint-violating values block `createFile` /
  `editFile`). `min`/`max` mean array length for containers and value bounds for
  `number`; `enum`/`regex` apply only to string scalars.

### 🗄️ Generalized storage, and bounded reads for custom models

- The five specialized SQLite tables (`graph_concepts`, `graph_backlinks`,
  `graph_edges`, …) collapse into **two generic ones** — `graph_nodes` and
  `graph_edges` — discriminated by `node_type` / `from_type` / `to_type`. The
  edge table now carries the provenance columns the graph roadmap has been
  building toward: `valid_from` / `valid_to` / `recorded_at`, `provenance`,
  `confidence`, `grounding`, `corroboration`.
- Custom edges are materialized to a per-folder **`_node-edges.md`** shard
  (mirroring `_backlinks.md`) and projected into the index — so they can be
  bounded, not just held in memory.
- The payoff: **`supportsBoundedReads` now returns `true` for custom models.**
  Custom-domain graph reads move from a whole-domain scan on every read to
  **O(neighborhood)** bounded reads — the same optimization default domains
  already enjoyed. The sole remaining exclusion is schemas with transitive
  implied edges.
- Default domains write **zero extra bytes**: `_node-edges.md` is only produced
  for schemas that declare custom node types, and adjacency weights stay
  byte-identical.

### 🧩 One schema parser, and no more silently-dropped data

- The twelve hand-written `schema.yaml` section parsers (322 lines of duplicated
  manual parsing) are replaced by a single **Zod-based section registry** — one
  declaration per section. Both home-grown YAML parsers now run on the
  **`yaml@2.9.0`** library under an unchanged public API, with a whole-block
  fallback to the legacy regex parser that preserves the never-throws contract.
- This closes a real data-loss bug: **block-style YAML lists and multi-line
  frontmatter values were silently dropped** by the old inline-only parser (it
  bit the Aristotle domain). They now parse correctly.
- Validation errors are unified into one shape with a **section path** and, for
  syntax errors, line and column. A new **`x-*` section-name convention** gives
  authors a guaranteed conflict-free extension namespace.

### 🔀 A graph enrichment pipeline you can compose

- Read-time graph enrichment — `supersession`, `confidence`, `implied-edges` —
  used to be hardcoded and duplicated across two code paths (full assembly and
  bounded neighborhood), kept in sync by hand and prone to drift. A domain can
  now declare a **`graph.enrichment`** section to pick which steps run.
- You can request a subset (`[supersession, confidence]`) or an **empty pipeline**
  (`enrichment: []`) to get the graph exactly as authored — no supersession
  stamps, no recomputed confidence, no inferred edges. Useful for debugging,
  auditing, and comparing authored vs. enriched graphs. Steps always run in the
  fixed canonical order regardless of how they're listed; an unknown, duplicated,
  or mis-ordered name is a hard load error.
- Both the full and bounded read paths now run through **one shared enrichment
  runner**, so they produce byte-identical results for any legal composition.
  Absent the section, behavior is identical to before (all three steps run).

### 🔗 Custom edge fields, honored everywhere

- Declaring a frontmatter field as a graph edge via `graph.edges` used to affect
  only the `walkGraph` tool — every other consumer hardcoded `fm.related`. So
  audit reported false "orphans," missed broken links in custom fields, and
  ranking ignored them. Now retrieval ranking, coherence analysis, the link
  advisor, and knowledge-audit **all honor custom edge fields**, and edges are
  labeled by their field name instead of the hardcoded `related`.
- Generated shard tables (`_concepts.md`, `_relations.md`, `_backlinks.md`) are
  now parsed by **column header rather than column count**, and each carries an
  explicit **`layout v2`** marker — so a new column stops being a silent
  migration risk. Existing artifacts still parse and are rewritten with the new
  marker on the next write.

### 🎚️ Graph channel calibration — measured, not guessed

- The hybrid-search graph channel shipped with un-benchmarked folklore defaults
  (`rrfK=60`, weighted edges, an uncapped candidate pool) and a rerank stage that
  scored graph hits **by filename**. This release built the eval base that was
  missing: a **40-case bundled `foundation` golden suite**, recall@k, per-hop
  (single vs. multi) metric breakdowns, and new `found eval retrieval` modes
  (`--sweep-rrfk`, `--ablate-edge-weights`, `--rerank-check`).
- Two new declarative levers land under `search.graph`: **`channel-cap`**
  (default 30) and **`uniform-edge-weights`** (default false).
- The honest verdict: **almost every tuning gate failed significance, so the
  defaults did not change.** The rrfK sweep, edge-weight ablation, and rerank
  pass all landed inside their confidence intervals. What *did* ship is a
  correctness fix — the rerank cross-encoder now scores graph candidates on
  actual file content (a bounded file head) instead of the bare filename. The
  calibration reports are committed under the spec's `results/` for anyone who
  wants to re-run the sweep on a domain with more signal.

### 📚 The foundation domain moves to `foundation-free@2.2`

- The bundled `foundation` domain now declares and loads **`foundation-free@2.2`**
  (up from 2.1): typed `path[]` / `date` fields, explicit `graph.edge-sources`, a
  `persons` map, and a declared `graph.enrichment` pipeline.
- Bundled domains never pass through the agent write path, so nothing had ever
  validated their frontmatter — **16 files carried `keywords` lists over the max
  of 15**, undetected in CI. A new committed maintenance tool,
  `scripts/validate-context-dcc.ts`, batch-validates any bundled domain against
  its contract using the **exact same write-gate validators** the engine applies
  on every agent write. Those violations (plus two self-referential
  `derived-from` edges) are fixed, and navigation artifacts were regenerated
  deterministically under `layout v2`.

---

## Under the hood

- **A new `services/dcc/` subsystem** consolidates the declarative graph model —
  the section registry, field-type descriptors, roles, and enrichment runner —
  behind one home, built as a dependency chain (edge-meta-consolidation →
  schema-registry / field-types / roles → graph-model → graph-surface →
  graph-storage → enrichment).
- **One database migration (`0020`)** applies automatically at kernel boot. It
  drops the old specialized graph tables and creates the generic `graph_nodes` /
  `graph_edges` pair. The graph index is **disposable by design** — no data is
  migrated; it is rebuilt from the on-disk shards on the next boot-resync.
- **New pinned dependency: `yaml@2.9.0`** (exact-pinned, zero transitive deps).
  The public parser API (`parseSchema`, `parseFrontmatter`, `definesIds`) is
  unchanged; ~25 consumer files were untouched by the swap.
- **Honesty over folklore.** None of the graph-model specs ship a measured
  benchmark — every performance target is stated as complexity and marked
  aspirational, and the one prior weight-tuning experiment was formally withdrawn
  because the test corpus had zero confidence variance to measure against. The
  calibration work above surfaced a real production risk in the process: a silent
  `catch {}` root-shard-only fallback in graph retrieval that can degrade results
  with no log line — filed as the top follow-up.
- **Backward compatibility is gated on byte-identical output.** All six bundled
  schemas remain byte-identical through the parser rewrite; default-model
  artifacts, adjacency weights, tool prompts, and enum surfaces are unchanged.
  Golden and delta-equivalence suites enforce it rather than review discipline.

---

## Upgrade notes

- **Restart the daemon after upgrading.** This release changes the graph storage
  layer, the schema parser, and the write-validation path — a stale daemon will
  serve old behavior.
- **Migration `0020` applies automatically** at kernel boot. The graph index is
  rebuilt from your on-disk shard files on the next boot-resync; **no graph data
  is lost** — the SQLite index is a disposable projection, not the source of
  truth.
- **Write-path tightening — the one behavior change to know about.** Files with
  uncoercible frontmatter values are now **rejected on write**, including for the
  original four string types (previously such junk was silently accepted), and
  `path` / `ref` fields must resolve to an existing file / known concept. This
  only affects `createFile` / `editFile`; reading a domain with bad values still
  works (the value drops out and is recorded). If an agent starts getting write
  rejections it didn't before, this is why — the frontmatter was always invalid;
  it just wasn't checked until now.
- **New fail-closed load errors for hand-authored schemas.** An invalid
  `graph.node-types` / `graph.edge-sources` / `roles.file-edges` /
  `graph.enrichment` declaration now raises a `DccSchemaParseError` naming the
  section, instead of silently degrading. Bundled contracts are unaffected.
- **The default contract is still `foundation-free@1.1`.** Only the bundled
  `foundation` domain moved to `2.2`; existing domains on earlier contracts are
  untouched. `2.2` is additive over `2.1`.
- **Nothing here is opt-in that changes an untouched domain.** Custom node types,
  edge sources, roles, `graph.enrichment`, typed fields, and the two new
  `search.graph` levers are all optional; a domain that declares none of them
  behaves byte-identically to 0.1.9.
- **No new environment variables.**
