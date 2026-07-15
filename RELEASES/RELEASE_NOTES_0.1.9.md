# Foundation 0.1.9

**Release date:** July 15, 2026
**Previous version:** [0.1.8](https://github.com/IharKharytanovich/foundation-kits/blob/main/RELEASES/RELEASE_NOTES_0.1.8.md) (July 8, 2026)

0.1.8 made the knowledge graph trustworthy. 0.1.9 turns that trust on the
agent's own hands: **the write path, the edit path, and the retrieval path**.
Until now the graph was validated after the fact — an agent could delete a
concept definition that a dozen files still pointed at, and nothing objected
until the next audit. Edits failed on invisible formatting artifacts and
reported nothing but "no match." Retrieval walked its channels one at a time.
This release closes all three: writes are checked **before** they land, edits
recover from the mistakes models actually make, and retrieval fires every
channel at once.

Alongside that, this release ran the largest correctness campaign in the
project's history — **three rounds of adversarial code review across
`@found/core`, 40 verified bugs, all fixed**. Several were load-bearing: the
Stop button never actually interrupted a run, agent-created tasks never
executed, and the base system prompt had not reached a live model since May.
If Foundation felt subtly unreliable in ways that were hard to name, this is
the release where that gets addressed.

---

## Highlights

### 🛡️ Writes that can't quietly break the graph

- Every domain write used to be validated **outgoing-only** — the agent's own
  new links were checked, but nothing asked "who was depending on what you just
  removed?" A definition could be edited away while a dozen files still
  referenced it, and the breakage surfaced later, as an audit finding, long
  after the context that caused it was gone.
- 0.1.9 adds a **blocking write gate** in front of the five tools that mutate a
  domain (`editFile`, `createFile`, `deleteFile`, `moveItem`, `renameConcept`).
  A write that would introduce a **new** dangling reference is rejected before
  any filesystem mutation, and the error names the exact files and concepts that
  still depend on it.
- The gate is deliberately narrow: **only new violations block.** Pre-existing
  dangling references in a domain never stand in the way of an unrelated edit,
  so turning this on doesn't hold your existing work hostage. And it
  **fails open** — a truncated impact set, a stale graph index, or an absent
  service downgrades to advisory, never to a false block.
- Successful writes now carry a **fan-in advisory**: a sorted list of the files
  that reference what you just changed. The agent no longer has to guess where
  the ripples went — it gets the list and can repair in the same turn.
- On by default, with a per-domain `writeGate` block in the DCC schema
  (`enabled`, `maxDepth`, `maxFiles`) for domains that want it looser or off.

### ✏️ Edits that actually land

- When a model copied `readFile` output straight into an edit, the `cat -n` line
  numbers came along for the ride — and the `12\t` prefix made every rung of the
  fuzzy-match ladder miss. The edit failed, the error said "no match," and the
  model had nothing to work with. Line-number prefixes are now **stripped**,
  under a guard strict enough that genuine tab-separated content is never
  touched.
- A failed match is no longer a dead end. The tool now returns the **nearest
  matching block** — line range and snippet — as advisory data the model can
  correct against. It is never auto-applied; a near-miss is a hint, not a
  guess.
- **Multi-edit is order-independent.** Edits used to apply sequentially, so
  earlier edits shifted the ground under later ones and the order you listed
  them in changed the result. All edits are now located against the *original*
  content, overlaps are rejected outright with a clear error and no partial
  write, and the rest are applied in a single pass.
- The **concept registry in the system prompt is now ranked, not dumped.**
  It used to be a flat alphabetical list, unbounded, with the most load-bearing
  concepts scattered anywhere in it. It's now ordered by the centrality of the
  concept's owner file and bounded by a character budget — the concepts that
  hold the domain together come first, and large domains stop spending prompt
  budget on an alphabetical tail.

### 🧭 Retrieval that fires every channel at once

- Navigation guidance was a **serial ladder**: pick a route, start from the
  index, walk down. That meant the graph and search were reached for only after
  the index came up short — often several round-trips into a question.
- Both the navigation checklist and the `foundation-free@2.1` contract now
  prescribe a **parallel sweep**: on every substantive question, fire the graph
  walk, hybrid search, and the relevant `index.md` **together**, merge the
  results into a map, and only then read files. The framing is explicit — the
  index tells you *where* knowledge sits, the graph tells you *how* it connects,
  search tells you *what* mentions it. They are not alternatives. Trivial
  "show me file X" requests skip the sweep entirely.
- `searchContent` gains an **`open: true` composite mode** that inlines windowed
  content of the top hits — one call where it used to take a search plus N
  reads.
- **Reranking shipped with a measurement, not a hunch.** Against the retrieval
  harness, a Voyage `rerank-2.5` pass moved **NDCG@10 from 0.1631 to 0.2000**
  and **MRR from 0.1500 to 0.2000**. It stays **off by default** — it needs a
  configured provider — but the verdict is recorded: worth enabling where you
  have one.

### 🧠 An agent that remembers what just failed

- A blocked write returns a tool error — but the SDK flattens that to a plain
  string and drops the `isError` flag along the way. The next step's signal said
  `ok: true` for a write that had just been rejected, so the model would
  cheerfully re-attempt the identical failing operation.
- The new **lesson buffer** catches failures at the point where the error flag is
  still intact, and re-injects them into the context tail until they're
  redeemed by a matching success or expire. It's in-memory and per-turn — never
  written to your message history, never persisted. **On by default**, because
  it adds no tools and no surface: the agent simply stops repeating a failure it
  just hit.
- **Plan recitation** ships alongside it, **opt-in**. On 30–60-step tasks the
  original decomposition drifts to the middle of the context window with nothing
  restating where you are in it. When enabled, a `managePlan` tool appears and
  the root→active-leaf path is re-injected every step; plans persist per
  conversation and survive a resume. It's off by default because it adds a tool
  to every domain — treat it as experimental.
- Both injectors append **after** the cache breakpoint, so nothing they add
  invalidates the cached prefix.

### ⚙️ Your prompt, your rules

- Three system-prompt sections that were hardcoded in TypeScript are now
  **user-editable templates**: **System Prompt** (the core role, knowledge-source
  rules, and tool workflow shared by every domain agent), **Navigation
  Checklist** (the retrieval workflow injected for DCC-enabled domains), and
  **Rich Rendering** (the fenced-code visualisation languages the chat viewer
  understands).
- Overrides live as plain markdown in **`~/.found/prompt-sections/`**, seeded
  from the bundled defaults. Edit them in web Settings → **Prompt Sections**
  with a full text editor and a per-section reset; the TUI deliberately offers
  view-and-reset only, since a terminal is a poor multi-KB markdown editor, and
  points you at the directory.
- Rendering stays byte-deterministic, so customizing your prompt does not cost
  you the provider prompt cache.

### ⚡ A prompt cache that actually hits

- On the web client a fresh `ChatSession` is constructed for **every HTTP turn**,
  and the frozen system-prompt bundle lived on that instance — so the cache
  never hit, and every turn rebuilt the prefix from scratch. Worse, any file
  write that regenerated `index.md` or `_concepts.md` changed the system prefix
  and **silently busted the provider prompt cache** on the next turn. A prompt
  cache miss raises no error; you just pay full price.
- The bundle now lives in a shared, conversation-keyed **`SystemBundleCache`**
  with a TTL mirroring Anthropic's own prefix cache (5 minutes in economy mode,
  1 hour otherwise). The key folds in settings version, domain, provider, model,
  and caching mode, so a settings change rebuilds automatically instead of
  serving something stale. Entries are tenant-namespaced, and the interface is
  the seam a Redis-backed implementation drops into on a server.

### 🐛 40 bugs, found adversarially and fixed

Three rounds of multi-agent code review over `@found/core` — candidates
generated broadly, then hand-verified by adversarial verifiers before anything
was called real. The ones most likely to have bitten you:

- **The Stop button didn't stop anything.** AI SDK v6 doesn't throw on abort — it
  enqueues an `abort` event and closes normally. With no handler for it, an
  aborted run was persisted as `completed` and the client was told it finished
  cleanly.
- **Tasks the agent created never ran.** The run row was written but never
  executed — the HTTP route triggered execution, the tool path forgot to. You'd
  ask for a task, be told it was created, and find it stale an hour later.
- **The base system prompt hadn't reached a live model since May 2026.** The
  "System Prompt" setting was silently dead.
- **`CASCADE` deletes never fired** — the SQLite `foreign_keys` pragma was never
  enabled. Embedding chunks accumulated forever while the UI reported them
  cleared, and after an embedding-model change, orphaned vectors of a *different
  dimension* fed NaN centroids into the coherence math.
- **`editFile` corrupted `$$`, `$&`, and `` $` ``** — they were interpreted as
  replacement patterns, so LaTeX silently mangled itself on write.
- **Write protection could be bypassed** — `moveItem` checked `editable` only on
  the destination, so a file could be moved *out* of a read-only root.
- **Cancelled one-shot tasks came back** on the next scheduler tick; a zombie
  `running` row could block a scheduled task forever; editing a cron task didn't
  recompute its next run.
- **Sub-agents cross-attributed progress and usage** when running in parallel.
- **Lost writes** — user turns dropped while the stream carried on as if fine;
  `settings.json` and the dotfile secret store both racing on read-modify-write;
  `undoWrite` silently destroying newer edits.
- **MCP re-auth wiped discovered tools, custom headers, and the enabled flag**;
  an OAuth MCP server added via CLI never passed probe, giving you zero tools in
  chat with no error shown anywhere.
- **Outlook replies silently dropped attachments, bcc, and quoting** — mail went
  out wrong and the tool reported success.
- **The persisted semantic graph was never actually built in production** (the
  lookup key didn't match the write key), and worker pools could hang a queued
  job forever on idle teardown.

Three standing user-reported issues are explained and closed by this campaign:
tasks not running since May 13, the supervisor PID race on Ctrl-C, and MCP
tools silently missing from chat.

### 🔒 Security

- **Three path-traversal / sandbox issues closed**: an unvalidated marker `name`
  allowed writes outside the data directory (bypassing the zip-slip guard); an
  unsanitized `uploadFolderId` allowed writes outside the workspace; and the
  script sandbox could be escaped via `handle.constructor.constructor`.
- **Keychain hardening.** Secret names are validated against control-character
  injection into the macOS `security -i` batch grammar, and values are now
  base64-encoded behind a self-describing marker so nothing in a payload can
  break the tokenizer. Legacy values still read verbatim — upgrades are
  transparent — and **multiline secrets now round-trip correctly**, which they
  previously did not.
- **No more plaintext window on `credentials.json`.** The file was written and
  *then* chmod'ed, leaving a moment where credentials sat at the final path with
  default umask permissions. It's now written atomically with the mode set
  before the rename.
- **Silent security downgrades are now visible.** Falling back from keychain to a
  plaintext dotfile — common on headless Linux, Docker, or SSH without an
  unlocked keyring — logs a **warning** instead of an info line, and the secrets
  API now reports its `backendKind` so the UI can tell you your keys are sitting
  in plaintext.

### 🧬 A contract for pipeline disciplines

- New bundled DCC: **`foundation-onco@1.0`** — `foundation-free@2.1` plus the
  vocabulary a process/pipeline discipline actually needs. **Additive and
  backward-compatible with 2.1.**
- Six new edge types (`precedes`, `feeds-into`, `blocks`, `gated-by`,
  `rate-limits`, `bypasses`) with full inverse, acyclic, transitive, and polarity
  wiring — so the graph understands that a bottleneck points the opposite way
  from a dependency.
- A **weight-graded `source_type` enum with explicit confidence priors**
  (`regulatory` 0.92, `clinical-trial` 0.88, `preprint` 0.70, `corporate-pr`
  0.55, `industry-report` 0.50). The contract is blunt about why this matters:
  mislabeling a market forecast as `paper` inflates the confidence of every edge
  built from it.
- A new **`epistemics` frontmatter field** (`computable | empirical | hybrid`)
  that makes the difference between "verifiable with a compute kit" and "wet-lab
  ground truth" explicit and greppable — an `empirical` claim must carry a source
  and may never be presented as computed.

### 🐳 Docker and reverse proxies

- **MCP OAuth now works in a container.** The flow used to spin up an in-process
  loopback server for the callback — unreachable from the host browser, which
  made OAuth-authenticated MCP servers effectively unusable under Docker. Set the
  new **`FOUND_PUBLIC_URL`** and the callback is served on
  `<public-url>/api/mcp/oauth/callback` instead, with no loopback server at all.
  Outlook auth uses the same base. `docker-compose.yml` sets it out of the box.
- Docs correction worth knowing: **provider API-key env vars were never read by
  the daemon.** The stale `ANTHROPIC_API_KEY` example is gone from the Docker
  docs — keys go through web Settings or `found settings` into the secret store.

---

## Under the hood

The server-readiness track continues: every item here is behavior-neutral by
design and gated on byte-identical output.

- **The last god-hub is decomposed.** `services/sessions/` reached directly into
  **46 sibling services**; three hand-synchronized dependency bags described the
  same set of services in three different shapes (~40 fields, ~90 fields, and a
  third). It now sits behind a flat `ToolEnvironment` seam with a dedicated
  `StreamRunner`, and the fan-out is **down to 16** — enforced by a ratchet test,
  not by review discipline.
- **Tools are coupled only to what they read.** `ToolContext` was a flat
  **70-field god-object** (4 mandatory, 66 optional) handed identically to all 60
  tools — a tool that reads zero fields saw all 70, and a missing service
  surfaced only at runtime. It's now **12 capability-group interfaces**, each
  tool declares the slice it needs, and the mismatch is a compile error. The
  builder went from 487 lines to 37.
- **The file-size control loop was dead and is now real.** The Biome rule the
  project rules claimed to enforce **did not exist in the config**, and every
  watch-list entry was stale. There's now a ratchet test that blocks any
  over-limit file from growing, and two god-files were split behind it:
  `DomainWriteTool` 885 → 382 lines, `CoherenceAdvisorService` 860 → 173.
- **Zero import cycles, enforced in CI.** The `services/ → ai/` direction was
  guarded by nothing but review; `check:deps` existed but never ran. Type-only
  cycles went **34 → 0** (32 of them hanging off a single unused re-export line),
  a `core-services-no-ai` rule now fails the build, and `check:deps` runs in the
  `verify` job. Notably, eleven services were reaching into a *search tool's*
  folder for the frontmatter parser — it now lives where it belongs.
- **Errors stop lying.** A repo returned an empty array on a broken invariant — a
  plausible lie, since `[]` reads as "no descendants" — while its own caller's
  docblock promised an error. Webhook dedup was raw SQL that **silently stopped
  deduplicating inside a transaction**, meaning duplicate webhook processing with
  real external side effects. Both fixed, 99 raw throws were classified into five
  sanctioned paths, and failures from bad DCC schemas, domain installs, and
  scholarly-search upstreams now reach HTTP as proper status codes instead of
  bare 500s.

---

## Upgrade notes

- **Restart the daemon after upgrading.** As always — and this release changes the
  write path, the prompt path, and background indexing, so a stale daemon will
  serve you old behavior.
- **Three database migrations** (`0017`, `0018`, `0019`) apply automatically at
  kernel boot. Nothing to run by hand.
- **Enabling foreign keys has a one-time effect**: cascade deletes that never
  fired now fire. Orphaned embedding chunks left behind by the old bug are
  cleaned up on the next relevant delete — expect the fix to *reduce* your
  database size, not grow it.
- **The write gate is on by default.** It only blocks writes that create *new*
  dangling references, so existing domains keep working unchanged. If a domain
  needs it looser, set `writeGate: { enabled: false }` (or raise `maxDepth` /
  `maxFiles`) in its DCC schema.
- **GitLab is removed as a git-account provider.** GitHub is now the only one.
  Repositories hosted on GitLab and elsewhere **remain installable by public
  URL** — only the connected-account flow is gone. Any orphaned `library-gitlab`
  secrets are inert and can be ignored.
- **New env var: `FOUND_PUBLIC_URL`** — only needed for Docker or reverse-proxy
  deployments that use MCP OAuth or Outlook auth. Unset, everything behaves as
  before.
- **New data directory: `~/.found/prompt-sections/`** — created and seeded on
  demand. Untouched, the bundled defaults apply and nothing changes.
- **Plan recitation is opt-in** (`planRecitationEnabled`, off) and should be
  treated as experimental. The **lesson buffer is on** (`lessonBufferEnabled`) and
  adds no tools.
- **Reranking is off by default** and lights up only where a rerank provider is
  configured. Everything else in this release degrades gracefully without one.
- **`foundation-onco@1.0` is additive** — existing domains on `foundation-free`
  are unaffected, and the default contract is still `foundation-free@1.1`.
