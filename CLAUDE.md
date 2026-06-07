# foundation-kids — agent guide

This repo is the **kit factory**: it authors, builds, verifies, and publishes
**Kits** — portable, sandbox-executable scientific capabilities consumed by the
main **Foundation** project. This repo is the **source of truth for kit
definitions**. It is NOT the runtime; Foundation resolves `id@version+sha256`
from GitHub Releases and executes kits there.

Background: [docs/architecture.md](docs/architecture.md) ·
[docs/asset-inventory.md](docs/asset-inventory.md).

## Repo map

```
kit/<id>/        Kit definitions — source of truth (in git)
tooling/         Pipeline (Node .mjs): new-kit scaffolder + lib/ (schema, sha256, tags)
tests/           vitest — schema-parse + integrity over every kit/*
docs/            Architecture + design specs + plans (docs/superpowers/)
build/           [follow-on] Docker build toolchain per track (wasi / pyodide)
runtime/         [follow-on] Vendored pyodide + node:wasi runtime for golden execution
.claude/         rules/, skills/ (add-kit, verify-kit, publish-kit), orchestrator/
```

`build/` and `runtime/` are not implemented yet — they are follow-on plans (full
verification runtime, Docker toolchain, CI/publish).

## Kit anatomy

A `kit/<id>/` holds four **consumer files** (ship to Foundation) plus one
**factory-only** file:

| File | Role | Ships to Foundation? |
|---|---|---|
| `kit.json` | metadata, provenance, `artifacts[].sha256`, deps | yes |
| `manifest.json` | callable surface (strict/loose) + golden | yes |
| `instruction.md` | agent-facing prose (when/why/when-NOT) | yes |
| `LICENSE` | upstream license | yes |
| `recipe.json` | how to build/vendor the artifact | **no — factory-only** |
| `artifacts/` | the `.whl`/`.wasm` bytes | via Release, never git |

## Pipeline commands

- `npm run new-kit <id> -- --runtime wasi|pyodide` — scaffold a kit skeleton.
- `npm test` — full factory suite (scoped to `tests/`).
- `npm run verify` — schema-parse + sha256 integrity over all kits.

Build and publish are follow-on (see `docs/superpowers/plans/`).

## Conventions

- **Artifacts are never committed.** They live in gitignored `kit/*/artifacts/`
  locally and are distributed via GitHub Releases, content-addressed by `sha256`.
- **Golden is the single source of truth**, and lives inside `manifest.json`
  (`operations[].golden` for strict, `golden` for loose). Tests iterate over
  manifests — a new kit with a manifest is covered automatically.
- **Tags** come from the controlled vocabulary in
  [tooling/lib/tags.mjs](tooling/lib/tags.mjs) (29 tags, 1–3 per kit).
- **Dependencies are exact-pinned** (`id@version+sha256`); `dependencies[]` lists
  only **shared** kits. Exclusive deps are bundled into `artifacts[]`.
- **`recipe.json` does not ship to Foundation** — it encodes build provenance
  and redistribution exclusions, factory-internal only.
- Schemas in [tooling/lib/schema.mjs](tooling/lib/schema.mjs) are the **enforced
  source of truth** for `kit.json` / `manifest.json` / `recipe.json`.

## Pointers

- Conventions in depth: [.claude/rules/](.claude/rules/)
- Workflows: [.claude/skills/](.claude/skills/) — `add-kit`, `verify-kit`, `publish-kit`
- Large multi-kit work (e.g. importing the remaining 32 kits): `spec-writer` +
  `spec-executor` + the orchestrator.
