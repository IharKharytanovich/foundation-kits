# foundation-kids

The **kit factory** for [Foundation](https://github.com/) — authors, builds,
verifies, and publishes **Kits**: portable, sandbox-executable scientific
capabilities (WASI binaries and Pyodide wheels) that Foundation loads on demand.

This repo is the **source of truth for kit definitions**. It is not the runtime —
Foundation resolves and executes kits.

## What is a Kit?

A Kit packages one coherent scientific capability with everything needed to use
it verifiably: an artifact (`.whl` or `.wasm`), metadata, an agent-facing
instruction, and a manifest describing its callable surface plus a golden
example. Each `kit/<id>/` contains:

| File | Role |
|---|---|
| `kit.json` | metadata, provenance, `artifacts[].sha256`, dependencies |
| `manifest.json` | callable surface (strict ops / loose code) + golden |
| `instruction.md` | agent-facing prose: when/why/when-not |
| `LICENSE` | upstream license |
| `recipe.json` | factory-only: how to build/vendor the artifact |

## Distribution

- **Definitions** (the files above, minus `recipe.json`) live in **git**.
- **Artifacts** (`.whl`/`.wasm` bytes) are **never committed** — they are
  attached to **GitHub Releases**, content-addressed by `sha256`.
- Foundation's Library resolves `id@version+sha256`, downloads the release asset,
  verifies the hash, and drops it into the user's kit directory.

## Quick start

```bash
npm install
npm test                                   # factory verification suite
npm run new-kit -- <id> --runtime pyodide  # scaffold a new kit
npm run verify                             # schema-parse + sha256 integrity
```

## Contributing a kit

Use the `add-kit` workflow ([.claude/skills/add-kit](.claude/skills/add-kit)) and
follow the conventions in [.claude/rules/](.claude/rules/). Design background:
[docs/architecture.md](docs/architecture.md).

## Status

Scaffolding is in place: kit schemas, integrity checks, tag vocabulary, the
scaffolder, and verification over the seed kits (`numpy`, `scipy`, `sympy`,
`seqtk`). **Follow-on:** vendored verification runtime (golden execution), the
Docker build toolchain, and CI publish. See `docs/superpowers/plans/`.
