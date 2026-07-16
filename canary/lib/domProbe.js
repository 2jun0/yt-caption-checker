import { isThumbnailElement } from '../../src/js/content/view/YtThumbnailView.js'

/**
 * Rebuild a minimal element-like object from a serialized anchor descriptor
 * so the REAL isThumbnailElement predicate can run in Node (zero drift).
 * @param {{tagName: string, id: string, href: string, className: string}} d
 */
export const descriptorToElementLike = d => ({
  tagName: d.tagName,
  id: d.id,
  href: d.href,
  classList: {
    contains: cls =>
      (d.className || '').split(/\s+/).filter(Boolean).includes(cls),
  },
})

/**
 * Run the real thumbnail predicate over serialized anchors.
 * @param {{tagName, id, href, className}[]} descriptors
 */
export const countThumbnailMatches = descriptors => {
  let matches = 0
  let oldStyle = 0
  let newStyle = 0
  for (const d of descriptors) {
    if (isThumbnailElement(descriptorToElementLike(d))) {
      matches++
      if (d.id === 'thumbnail') oldStyle++
      else newStyle++
    }
  }
  const watchLinks = descriptors.filter(d => /\/watch\?v=/.test(d.href || '')).length
  return { matches, oldStyle, newStyle, watchLinks, total: descriptors.length }
}

/**
 * @param {{url?: string, title?: string}} p
 * @returns {boolean}
 */
export const isConsentOrBlockPage = ({ url = '', title = '' }) =>
  /consent\.|\/sorry\//.test(url) || /before you continue/i.test(title)

/**
 * Verdict for the probes of a single surface.
 * A probe is "usable" only if it wasn't blocked and actually had watch links.
 * @param {{blocked?: boolean, watchLinks?: number, matches?: number}[]} probes
 * @returns {'pass'|'fail'|'inconclusive'}
 */
const aggregateSurface = probes => {
  const usable = probes.filter(p => !p.blocked && (p.watchLinks || 0) > 0)
  if (usable.length === 0) return 'inconclusive'
  return usable.some(p => (p.matches || 0) > 0) ? 'pass' : 'fail'
}

/**
 * Aggregate probes into a single verdict, judging each surface separately —
 * search still matching must not mask a broken channel/watch surface.
 * @param {{surface?: string, blocked?: boolean, watchLinks?: number, matches?: number}[]} probes
 * @returns {'pass'|'fail'|'inconclusive'}
 */
export const aggregateDom = probes => {
  const bySurface = new Map()
  for (const p of probes) {
    const key = p.surface || 'default'
    if (!bySurface.has(key)) bySurface.set(key, [])
    bySurface.get(key).push(p)
  }
  const verdicts = [...bySurface.values()].map(aggregateSurface)
  if (verdicts.includes('fail')) return 'fail'
  return verdicts.includes('pass') ? 'pass' : 'inconclusive'
}
