# foundation-kits — agent guide

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
kit/REGISTRY.md  Flat index of every kit (name · version · runtime · desc · published)
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
| `manifest.json` | callable surface (strict/loose/callable) + golden | yes |
| `instruction.md` | agent-facing prose (when/why/when-NOT) | yes |
| `LICENSE` | upstream license | yes |
| `recipe.json` | how to build/vendor the artifact | **no — factory-only** |
| `artifacts/` | the `.whl`/`.wasm`/`.cjs`/`.js` bytes | via Release, never git |

## Pipeline commands

- `npm run new-kit <id> -- --runtime wasi|pyodide|jswasm [--family emscripten|wasm-bindgen]` —
  scaffold a kit skeleton. `--family` is required for jswasm.
- `node tooling/vendor-jswasm.mjs <id> | --all` — vendor prebuilt JS-WASM bytes
  into a jswasm kit (copies artifacts, computes sha256, stamps kit.json + recipe.json).
- `npm test` — full factory suite (scoped to `tests/`).
- `npm run verify` — schema-parse + sha256 integrity over all kits.
- `npm run license-gate -- <id> | --all` — redistribution gate (license +
  documented exclusions).
- `npm run publish-kit -- <id>@<ver> [--dry-run]` — assemble + publish a release
  (4 consumer files + artifacts, `recipe.json` excluded). Tag-pushing `<id>@<ver>`
  runs the same flow in CI via `.github/workflows/publish.yml`.
- `npm run backfill-urls` — (re)stamp every `kit.json` `artifacts[].url` from the
  registry base; run after the base in `tooling/lib/release-url.mjs` changes.

The artifact **build/vendor** toolchain (`build/`, `runtime/`) is still follow-on
(see `docs/superpowers/plans/`); publish currently runs where the bytes exist.

## Conventions

- **Artifacts are never committed.** They live in gitignored `kit/*/artifacts/`
  locally and are distributed via GitHub Releases, content-addressed by `sha256`.
- **Publish = tag → CI → Release**, one tag (`<id>@<ver>`) per kit. See
  [.claude/rules/publish.md](.claude/rules/publish.md) — this is the standing
  pipeline; follow it for every new kit.
- **`artifacts[].url` is a predicted template URL**
  (`<base>/<id>@<ver>/<file>`, base in [tooling/lib/release-url.mjs](tooling/lib/release-url.mjs)).
  It is written into `kit.json` **before** the bytes exist (dangling 404 until
  then); the file appears at that URL **only after** the `<id>@<ver>` tag is
  published through CI. Predicted URL and GitHub's real download URL coincide by
  construction; integrity is guaranteed by `sha256`, not by the link.
- **Golden is the single source of truth**, and lives inside `manifest.json`
  (`operations[].golden` for strict, `golden` for loose,
  `operations[].golden` + `scriptGolden` for callable). Tests iterate over
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

- **Kit registry** — flat index of all kits (name, version, runtime, one-line
  description, publish status): [kit/REGISTRY.md](kit/REGISTRY.md).
- Conventions in depth: [.claude/rules/](.claude/rules/) — incl.
  [publish.md](.claude/rules/publish.md) (tag→CI→Release pipeline + URL template).
- **Publish + validation runbook** — the procedure that works *today* (local
  publish where the bytes exist, since CI has no artifacts yet) plus the
  end-to-end download/sha256 validation:
  [docs/publishing-and-validation.md](docs/publishing-and-validation.md).
- jswasm track: [.claude/rules/jswasm.md](.claude/rules/jswasm.md) (callable mode,
  loader, families, vendor workflow).
- Workflows: [.claude/skills/](.claude/skills/) — `scout-kits` (find/vet new kit
  candidates → spec-writer), `add-kit`, `verify-kit`, `publish-kit`
- Large multi-kit work (e.g. batch-importing kits): `spec-writer` +
  `spec-executor` + the orchestrator. 70 kits built (59 wasi/pyodide + 11 jswasm).
