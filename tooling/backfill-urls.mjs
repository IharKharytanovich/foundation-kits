import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { artifactUrl } from './lib/release-url.mjs'

/**
 * Stamp `artifacts[].url` into every kit's kit.json from the deterministic
 * release URL (id@version/<file>). Idempotent. Re-run after RELEASE_BASE moves.
 *
 * @param {object} [opts]
 * @param {string} [opts.root='kit']
 * @returns {Array<{id:string, changed:boolean}>}
 */
export function backfillUrls({ root = 'kit' } = {}) {
  const ids = readdirSync(root).filter((d) => statSync(join(root, d)).isDirectory())
  const results = []
  for (const id of ids) {
    const path = join(root, id, 'kit.json')
    const kit = JSON.parse(readFileSync(path, 'utf8'))
    let changed = false
    for (const art of kit.artifacts) {
      const url = artifactUrl(kit.id, kit.version, art.file)
      if (art.url !== url) {
        art.url = url
        changed = true
      }
    }
    if (changed) writeFileSync(path, JSON.stringify(kit, null, '\t') + '\n')
    results.push({ id, changed })
  }
  return results
}

// ── CLI entry ───────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const ri = args.indexOf('--root')
  const root = ri >= 0 ? args[ri + 1] : 'kit'
  for (const r of backfillUrls({ root })) {
    console.log(`${r.changed ? 'stamped ' : 'ok      '} ${r.id}`)
  }
}
