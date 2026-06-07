import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { classifyLicense } from './lib/license-policy.mjs'

/**
 * Redistribution gate for one kit. Confirms the artifact license permits us to
 * host the bytes, and that any non-redistributable file is both excluded at
 * build time (`recipe.build.exclude`) AND documented in `provenance.buildNote`.
 * Cite: architecture §11, .claude/skills/publish-kit.
 *
 * @param {string} id
 * @param {object} [opts]
 * @param {string} [opts.root='kit']
 * @returns {{id:string, ok:boolean, license?:string, classification?:string, issues:string[]}}
 */
export function gateKit(id, { root = 'kit' } = {}) {
  const dir = join(root, id)
  const kitPath = join(dir, 'kit.json')
  if (!existsSync(kitPath)) {
    return { id, ok: false, issues: [`kit.json not found at ${kitPath}`] }
  }

  const kit = JSON.parse(readFileSync(kitPath, 'utf8'))
  const license = kit.provenance?.license
  const classification = classifyLicense(license)
  const issues = []

  // ── 1. License must permit hosting the bytes ────────────────────────────
  if (classification === 'deny') {
    issues.push(`license "${license}" forbids us from redistributing the artifact bytes — must not publish`)
  } else if (classification === 'unknown') {
    issues.push(
      `license "${license}" is not in the redistribution policy — confirm redistribution rights and add it to ` +
        `tooling/lib/license-policy.mjs (REDISTRIBUTABLE / CONDITIONAL / FORBIDDEN)`,
    )
  }

  // ── 2. Non-redistributable files: excluded at build + documented ─────────
  const recipePath = join(dir, 'recipe.json')
  const recipe = existsSync(recipePath) ? JSON.parse(readFileSync(recipePath, 'utf8')) : null
  const excludes = recipe?.build?.exclude ?? []
  const buildNote = kit.provenance?.buildNote ?? ''

  for (const file of excludes) {
    if (!buildNote.includes(file)) {
      issues.push(
        `excluded file "${file}" (recipe.build.exclude) is not documented in provenance.buildNote — ` +
          `record why it is non-redistributable`,
      )
    }
  }

  // A conditional license relies on excluding its non-free files; an empty
  // exclude list means we'd be shipping the bytes it forbids.
  if (classification === 'conditional' && excludes.length === 0) {
    issues.push(
      `license "${license}" permits redistribution only with non-free files excluded, ` +
        `but recipe.build.exclude is empty`,
    )
  }

  return { id, ok: issues.length === 0, license, classification, issues }
}

/**
 * Run the gate over every kit directory under `root`.
 * @param {object} [opts]
 * @param {string} [opts.root='kit']
 */
export function gateAll({ root = 'kit' } = {}) {
  const ids = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory())
  return ids.map((id) => gateKit(id, { root }))
}

// ── CLI entry ─────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const ri = args.indexOf('--root')
  const root = ri >= 0 ? args[ri + 1] : 'kit'
  const all = args.includes('--all')
  const id = args.find((a) => !a.startsWith('--') && a !== root)

  if (!all && !id) {
    console.error('usage: node tooling/license-gate.mjs <id> | --all [--root <dir>]')
    process.exit(1)
  }

  const results = all ? gateAll({ root }) : [gateKit(id, { root })]
  let failed = 0
  for (const r of results) {
    if (r.ok) {
      console.log(`✓ ${r.id} — ${r.license} (${r.classification})`)
    } else {
      failed++
      console.error(`✗ ${r.id}${r.license ? ` — ${r.license} (${r.classification})` : ''}`)
      for (const issue of r.issues) console.error(`    - ${issue}`)
    }
  }

  if (failed > 0) {
    console.error(`\nlicense-gate: ${failed} kit(s) failed the redistribution gate`)
    process.exit(1)
  }
  console.log(`\nlicense-gate: ${results.length} kit(s) clear`)
}
