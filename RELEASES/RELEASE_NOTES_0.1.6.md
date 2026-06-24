# Foundation 0.1.6

**Release date:** June 24, 2026
**Previous version:** [0.1.5](https://github.com/IharKharytanovich/foundation/releases/tag/v0.1.5) (June 17, 2026)

Where 0.1.5 was about reach, 0.1.6 is about coherence: a domain that
understands its own knowledge and keeps it consistent. A domain is no longer
a flat pile of files — it now has a measurable shape. Foundation can score how
well that shape holds together, flag the places where it has frayed, and let
you fix them in a click or hand them to the agent. The knowledge graph
validates and reconciles itself on every write, so drift can no longer
accumulate silently. And the agent gains a sense of focus: as it reads, it
learns what the task is about and quietly suggests what to read next — with a
new set of panels that let you watch it think. Rounding things out: four new
rich render types and one-click PDF export.

---

## Highlights

### 🧭 Domain Coherence

- A new **Coherence** view on the domain's Files tab turns your knowledge base
  into something you can actually inspect. It measures how well your domain
  holds together and shows it as an interactive, color-coded **treemap** of
  folders and files — drill into any folder to zoom in.
- The analysis runs across several honest, complementary lenses, each its own
  sub-tab with its own color scale:
  - **Filesystem** — how your folder layout maps onto the real structure.
  - **Scope** — embedding-based semantic cohesion (how on-topic each cluster is).
  - **Structural** — connectivity and fragmentation: island clusters, isolated
    files, dead-ends, and giant-component coverage.
  - **Lexical** — shared vocabulary, with ubiquitous words down-weighted so the
    score reflects what's actually distinctive.
  - **Anomalies** — the concrete list of things to look at.
- **Works on any domain.** Structural and lexical analysis need no embeddings
  at all, so domains without a semantic index now return a full report instead
  of an access error. Where embeddings exist, the semantic lenses light up on
  top. Computation happens on the fly from data you already have — no new
  storage, no model calls, no cost.

### 🚦 Anomalies you can act on

- The **Anomalies** tab now detects **13 kinds** of problem across three
  families: structural decay (cyclic dependencies, broken and one-way links),
  within-document incoherence (files that bundle unrelated topics, off-topic
  sections, duplicated content), and organization issues (misfiled files,
  folders that should split, taxonomy drift). Every finding carries a severity
  — low, medium, or high.
- Each anomaly comes with actions: **Fix** auto-corrects connectivity issues
  (and completes a missing link bidirectionally, so your count actually drops),
  **Send to agent** hands the harder cases to your assistant as a background
  task that starts immediately, and **Dismiss** hides what isn't relevant —
  dismissals travel with your domain and can be reviewed and undone later.
- A compact, always-visible filter band shows each problem type as an icon with
  a live count; click to filter, hover to learn what a type means.

### 🛡️ A self-validating knowledge graph

- **Write-time validation.** When you create or edit a file, every concept
  reference is checked before it touches disk. A link to a concept that doesn't
  exist, or an unsupported relationship type, blocks the write with a clear list
  of what's wrong — defining and referencing a new concept in the same write is
  allowed. Domain drift can no longer creep in one bad link at a time.
- **Deterministic reconciliation.** The concept index now reconciles every
  cross-file change on each write instead of waiting for an occasional full
  rebuild. Define a concept or move its owner file, and every backlink and
  reference updates across the domain immediately.
- **Typed citations and temporal validity.** Cite external works with standard
  identifiers (`cites:: doi:10.1234/abc`, arXiv refs) as tracked edges that
  aren't mistaken for internal concepts. Mark outdated knowledge as superseded
  via a `superseded-by:` frontmatter field — the old claim stays greppable and
  visible rather than vanishing — and the `_relations.md` table gains a
  **status** column showing what's current versus superseded. When you add a
  file that contradicts an existing concept, the engine stamps the old one as
  superseded for you.
- **Audit on rebuild.** Every rebuild runs an integrity audit — orphan concepts,
  broken links, missing folder indexes, mismatched anchors — and writes the
  findings to a generated `_audit.md` you can grep. All of it stays plain files
  and commits to git, and existing domains keep working unchanged.

### 🎯 Coherence Steering

- The agent now builds a lightweight sense of what the current task is about as
  it reads and edits, and proactively suggests **related files worth reading
  before the next step**. Suggestions appear as an unobtrusive "Consider
  reading" note between tool results — they never block or interrupt, and they
  fade when unhelpful.
- The same advisory layer warns about trouble before it compounds: on write it
  flags likely duplicates, broken links, orphans, and files that may belong
  elsewhere; on delete it lists what still references the file you're removing.
- Recommendations fuse several signals at once — semantic similarity, graph
  proximity, and text overlap — and deliberately surface contradicting or
  derived-from context even when raw similarity scores are lower. The session
  stays focused as topics shift, learns from what you skip so it won't
  re-suggest it, and degrades gracefully on un-indexed domains.
- One switch controls it all: **Settings → Other → "Enable coherence advisory"**
  (on by default), governing both reading recommendations and inline write-time
  hints.

### 🔬 Watch the steering think

- A new **Centroid** tab (on the domain's Files canvas) reconstructs the full
  trajectory of how the agent's focus moved across an entire conversation, not
  just live activity. A **Focus Lanes** layout gives every file its own
  horizontal lane with a sparkline of its relevance over the chat, sortable by
  relevance or recency; a timeline scrubber jumps between turns; and a
  files-by-turns heatmap shows what mattered when. A "reconstructed" badge
  signals the view was rebuilt from chat history, and live traces keep updating
  on top of it.
- A companion **Live** trace panel shows the steering system in real time:
  fired/gated status and fire count per turn, a centroid-drift sparkline, an
  anchor-health gauge, the full read-set ranked by relevance (with coverage and
  alignment), and the recommendations it surfaced. Pick a chat to populate it.
- Both panels respect the same coherence-advisory toggle, and the sub-tab strip
  collapses to icons with tooltips on narrow screens.

### 🗺️ Richer rendering

- The agent can now render four new kinds of content in chat: **interactive
  maps** with markers and pan/zoom (OpenStreetMap/Leaflet), side-by-side
  **code diffs** with added/removed highlighting, zoomable **timelines**, and
  **media embeds** — tweets, and videos from YouTube, Vimeo, or direct links.
- Four new bundled skills (`found-render-map`, `found-render-diff-view`,
  `found-render-timeline`, `found-render-embed`) and updated prompts teach the
  agent when to reach for each, and malformed specs get automatic feedback so
  the agent can self-correct rather than leaving a broken card.

### 🖨️ PDF export

- A new **PDF** button sits next to copy on every assistant message and in the
  file viewer toolbar. It opens your browser's native print dialog so you can
  save exactly what's on screen — tables, charts, math, even 3D molecule
  diagrams — as a clean document with no app chrome. It uses the browser's own
  print pipeline, so it works offline and adds no dependencies.

---

## Under the hood

- The coherence and steering stack is gated behind semantic indexing where it
  needs embeddings and falls back to structural/lexical/graph analysis where it
  doesn't — so no feature in this release requires a particular embedding
  provider to be useful.
- Knowledge-graph changes are backward compatible: existing domains, their
  relationships, and external references continue to work unchanged, and the
  new write-time guarantees apply going forward.
- Some delivery and trace features require **restarting the daemon after
  upgrade** to pick up the new background paths.
