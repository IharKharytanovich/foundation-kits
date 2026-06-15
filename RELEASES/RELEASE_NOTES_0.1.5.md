# Foundation 0.1.5

**Release date:** June 17, 2026
**Previous version:** [0.1.4](https://github.com/IharKharytanovich/foundation/releases/tag/v0.1.4) (June 2026)

Release 0.1.5 is a release about reach: where domains come from, what the
agent can pull into them, and how external work flows back to the chat that
asked for it. Domains become git-native — clone, pull, push, and publish.
The agent gains a research stack, nine new domain tools, and the ability to
read Excel, Parquet, and biological-sequence files. Embeddings open up to
five providers, async work is delivered straight back into the conversation
that started it, and the new knowledge-contract format maintains its own
navigation automatically.

---

## Highlights

### 🔗 Git-linked domains

- Installed knowledge domains become **git-native**: instead of a one-way
  detached copy, a domain is a tracked part of a cloned repository. Pull
  upstream updates without losing your local edits, and push your own changes
  back.
- Three ways to bring in a domain from the Library: **Copy** (a lightweight
  snapshot, today's behaviour), **Install** (clone the full repository), and
  **Publish** (move a domain you created into one of your GitHub repositories
  and push it).
- A new **Git tab** on the domain page shows whether a domain is up-to-date,
  behind, ahead, or diverged, with ahead/behind counts and a per-file change
  list (what was added, modified, deleted, and by how many lines). It offers
  **Refresh** to pull updates and **Push** to send yours, with a "Connect
  GitHub" prompt when no account is linked.
- Domains appear and disappear without restarting the app. Pushing for the
  first time asks GitHub for write permission.

### 📡 Multiple Library sources

- Manage your **own list of sources** (repository URLs) for the Library,
  instead of being limited to a single connected GitHub account and a built-in
  registry.
- A new **Sources** control in the Library header lets you bind a GitHub
  account, add sources by URL, see each source's status, remove sources, and
  refresh them all at once.
- Each source is scanned once for **both** knowledge resources and compute
  kits. A source that fails to load never blocks the others.

### 🧰 New domain tools

Nine new tools you can switch on per domain from the Tools catalog:

- **Search history** — search the domain's past conversations.
- **Extract document** — pull text out of binary files (PDF, DOCX, notebooks,
  and more) already in the workspace.
- **Manage skills** and **Manage kits** — let the agent find, install, and
  attach skills and compute kits itself.
- **Audit knowledge** — lint the knowledge base for broken links, orphan
  files, and missing entries.
- **Snapshot** — create, list, compare, and restore checkpoints of a domain's
  context.
- **Data query** — run read-only SQL queries over data files.
- **HTTP request** — call allow-listed web endpoints.
- **Export report** — write a structured Markdown report into a workspace.

Web access is governed by a per-domain allow-list, and any secrets used stay
out of tool output and logs. Installing a kit verifies it and asks for your
confirmation in the conversation.

### 📚 Scholarly search & full-article retrieval

- A new **Scholarly search** tool queries **Crossref, arXiv, PubMed, and
  Semantic Scholar** at once (no API keys needed) and returns clean, citable
  papers — title, authors, year, venue, PDF link, and abstract — with
  duplicates merged across sources. Results show as publication cards in the
  web client.
- A new **Fetch document** tool downloads a paper or file from a URL into the
  domain's workspace and returns its full text — so it also shows up in the
  file browser and is searchable.
- **Web scrape** is much sturdier: it no longer fails on non-HTML pages, reads
  scientific article formats into clean Markdown, sends PDFs through the
  document fetcher, follows arXiv abstract links to the full text, and strips
  reference-list clutter.

### 📊 New data formats

- The agent can now read three lab-grade formats: **Excel (.xlsx)**, **Parquet
  (.parquet)**, and **biological sequences (FASTA and FASTQ)**. It produces
  readable summaries — sheet headers and sample rows, column lists, sequence
  statistics, FASTQ quality info — rather than dumping every record.
- The **Data query** tool now runs SQL over Excel and Parquet files too, with a
  setting to pick a worksheet and support for compressed Parquet files.

### 🧠 More embedding providers

- Semantic-search embeddings grow from two providers to **five** — adding
  **OpenAI**, **Google**, and **OpenAI-compatible** servers (LM Studio, vLLM,
  llama.cpp, TEI) alongside Voyage and Ollama. All are configurable in both the
  web Settings and the `found settings` screen.
- Existing setups keep working with no action needed, search quality improves
  for providers that distinguish search queries from documents, and switching
  provider safely rebuilds the index with a clear warning.

### 🔄 Async results come back to your chat

- When an async cross-domain (CCTP) request finishes, the result is now
  delivered **back into the same conversation** that asked for it, as a new
  agent turn — no more separate orphan chats. Several results that arrive
  together are combined into one reply.
- The same now applies to **transports**, and transports work for standalone
  domains too — both incoming webhooks and outgoing actions — with a new
  **Transports** tab on the domain page and a `found transport invoke <domain>`
  command.
- Delivery survives restarts: pending results are re-delivered automatically.
  (Requires restarting the daemon after upgrade.)

### 🧩 Self-maintaining knowledge index

- A new version of the knowledge-contract format generates a domain's
  navigation — its index tree, concept list, relations, and backlinks —
  **automatically on every edit**, instead of asking the agent to maintain them
  by hand. Everything stays as plain files and commits to git.
- It's opt-in per domain; existing domains are unchanged. It adds source
  provenance (where a fact came from and when), typed relationships between
  concepts (contradicts, derived-from, measured-by), and a tool to rename a
  concept everywhere at once.
- A one-click **Rebuild context index** button, a check for dangling concept
  links, and per-concept definitions round it out. Generation is fully
  automatic and free — it uses no model calls.

### 📐 Domain token-budget badge

- A live **token-budget badge** in the Domains header shows roughly how many
  input tokens a domain costs before you even type — its prompt, every enabled
  tool, connected MCP servers, and context sections (for example, "≈ 12.3k
  tok").
- The number uses the **real tokenizer of the domain's model**, and updates as
  you change tools, skills, MCP servers, or the model.

### 🧮 Scriptable compute kits

- Ten compute kits that previously couldn't be invoked (coolprop, eigen,
  geodesy, geos, gmp, highs-js, manifold, meshoptimizer, rapier2d, rapier3d)
  now work: the agent can drive them with a short script and get a result back.
- Scripts run in a hardened, sandboxed, time-limited environment; failures fail
  safely as a result the agent can read, never crashing the chat.

### 🎨 Charts that fix themselves

- When a chart the agent draws (vega-lite, plotly, cytoscape, datagrid) fails
  to render, the failure is now fed back to the agent on its next turn so it can
  **correct the chart itself**, instead of leaving a silent error card. The
  correction happens behind the scenes without cluttering your chat history.
- The diagram skill also got clearer guidance on which renderer to use for which
  kind of graph.

---

## Under the hood

- Two large internal passes hardened the foundation for the upcoming
  multi-tenant cloud server — slimming the biggest modules into focused pieces,
  moving file reads off the critical path so the agent responds faster, and
  making error handling consistent so failures are logged instead of swallowed.
- All of this is behaviour-preserving: existing domains, settings, and data
  continue to work unchanged after upgrading.
