// Controlled tag vocabulary — mirror of @found/types DOMAIN_TAG_OPTIONS.
// Source: asset-inventory.md §7. Closed enum; extend by editing this list.
export const KIT_TAGS = [
  'math', 'core', 'symbolic', 'biology', 'sequences', 'genomics',
  'phylogenetics', 'rna', 'structure', 'chemistry', 'physics', 'astronomy',
  'units', 'pde', 'signal', 'statistics', 'fitting', 'sampling', 'optimization',
  'uncertainty', 'ml', 'data-science', 'graphs', 'time', 'parallel', 'caching',
  'serialization', 'compat', 'util',
]

const TAG_SET = new Set(KIT_TAGS)

export function isValidTag(tag) {
  return TAG_SET.has(tag)
}

export function validateTags(tags) {
  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 3) {
    return { ok: false, reason: 'expected 1-3 tags' }
  }
  const unknown = tags.filter((t) => !TAG_SET.has(t))
  if (unknown.length) {
    return { ok: false, reason: `unknown tags: ${unknown.join(', ')}` }
  }
  return { ok: true }
}
