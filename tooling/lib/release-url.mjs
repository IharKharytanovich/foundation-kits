import { basename } from 'node:path'

// Base of our content-addressed distribution registry: GitHub Releases on this
// repo. A release is tagged `<id>@<version>`; each artifact is an asset on it.
// One constant for all kits — if the registry moves (e.g. ghcr/OCI, architecture
// §9), change it here and re-stamp via tooling/backfill-urls.mjs.
export const RELEASE_BASE = 'https://github.com/IharKharytanovich/foundation-kits/releases/download'

/**
 * Deterministic download URL for an artifact on its `<id>@<version>` release.
 * @param {string} id
 * @param {string} version
 * @param {string} file - the `kit.json` artifact path (e.g. `artifacts/x.whl`)
 * @returns {string}
 */
export function artifactUrl(id, version, file) {
  return `${RELEASE_BASE}/${id}@${version}/${basename(file)}`
}
