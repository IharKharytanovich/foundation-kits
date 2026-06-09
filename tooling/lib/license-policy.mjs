// Redistribution policy: which `provenance.license` strings permit us to *host
// the bytes* of an artifact on a GitHub Release. Cite: architecture §11.
//
// Fail-closed: a license we don't recognize is NOT auto-approved — it surfaces
// as `unknown` so a human confirms the redistribution right and adds it here.

// Permissive, weak-copyleft, and copyleft licenses that PERMIT redistribution
// of compiled artifacts. (Copyleft like GPL/LGPL still *permits* redistribution
// — it constrains derivative licensing, not hosting the bytes.)
export const REDISTRIBUTABLE = new Set([
  'MIT',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'Apache-2.0',
  'ISC',
  'Zlib',
  'MPL-2.0',
  'PSF-2.0',
  'Python-2.0',
  'CC0-1.0',
  'Unlicense',
  'PublicDomain',
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'Biopython',
  'HDF5',
])

// Custom licenses that permit redistribution ONLY with specific non-free files
// removed. The byte-level exclusion is enforced by the gate via
// `recipe.build.exclude` + a documenting `provenance.buildNote`.
// e.g. ViennaRNA redistributes freely once `naview.c` is excluded.
export const CONDITIONAL = new Set([
  'ViennaRNA',
])

// Licenses we know forbid us from hosting the bytes — explicit deny.
export const FORBIDDEN = new Set([
  'Proprietary',
  'Commercial',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0',
  'CC-BY-ND-4.0',
  'SSPL-1.0',
  'BUSL-1.1',
  'JSON',           // "shall be used for Good, not Evil" — non-free
  'Aladdin',
  'no-redistribution',
])

/**
 * Classify a license string for redistribution.
 * @param {string|undefined} license
 * @returns {'allow'|'conditional'|'deny'|'unknown'}
 */
export function classifyLicense(license) {
  if (!license || typeof license !== 'string') return 'unknown'
  const l = license.trim()
  if (FORBIDDEN.has(l)) return 'deny'
  if (REDISTRIBUTABLE.has(l)) return 'allow'
  if (CONDITIONAL.has(l)) return 'conditional'
  return 'unknown'
}
