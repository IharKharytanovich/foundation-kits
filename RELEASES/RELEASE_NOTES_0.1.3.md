# Foundation 0.1.3

**Release date:** June 1, 2026
**Previous version:** [0.1.2](https://github.com/IharKharytanovich/foundation/releases/tag/v0.1.2) (May 27, 2026)

Release 0.1.3 is a major update: 26 commits, 683 files changed
(+43,363 / −3,461). The main themes are email support, the personal
domain, a set of scientific renderers in markdown, image (vision)
support, and storing secrets in the system keychain.

---

## Highlights

### 📧 Email

- New `email` service in the core: connect mail accounts over IMAP/SMTP,
  plus an **Outlook** preset.
- AI tools for working with mail: reading messages, search, and
  **fetching attachments from emails** as a knowledge source.
- Email account management in Settings (web): add, edit, delete an
  account, choose the active one, and test the connection (Test Connection).
- The `found-render-email` skill for rendering emails in chat.

### 🧠 Personal domain

- Added bundled domains `personal` and `foundation` — the personal domain
  is initialized out of the box.
- Personal domain documentation: `docs/personal-domain/`
  (architecture, Outlook setup, changelog).

### 🔬 Scientific renderers in Markdown

A large set of `found-render-*` renderer skills was added, letting the
agent output interactive and scientific graphics directly in chat:

- `found-render-jsxgraph` (+ JessieCode), `found-render-function-plot`,
  `found-render-plotly`, `found-render-vega-lite`, `found-render-graphs`
- `found-render-chemistry` (chemical formulas, mhchem),
  `found-render-abc` (music notation), `found-render-wavedrom`
  (timing diagrams), `found-render-mindmap`, `found-render-pseudocode`,
  `found-render-datagrid`

### 🖼️ Images and vision

- Images as a knowledge source (`image-knowledge-source`).
- Vision support in models and image display in the UI.

### 🔐 Secret storage

- New `secrets` service: secrets (LLM API keys, mail passwords, MCP tokens)
  are stored in the system keychain, with a fallback to a dotfile backend
  (controlled by `FOUND_SECRETS_BACKEND`).

### 🗂️ Domains: pinning and editing

- **Domain pinning** (pin) and the corresponding sorting logic on the rail.
- Reworked domain editor in the web client: Prompt, Settings, Advanced,
  and **Tools** tabs (tool catalog, adding tools, grouping, counting).

### 💬 Chat and skills

- **Chat search**.
- Skill modes and bundled skills.

---

## Under the hood

- Kernel refactoring and complexity warnings.
- New core services: `conversations`, `sessions`, `domains`, `settings`,
  `file-ingestion`, `transport`, `skills`.
- Expanded server routes (`packages/server/src/routes`) and shared types
  (`@found/types`).
