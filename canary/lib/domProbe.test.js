import {
  countThumbnailMatches,
  isConsentOrBlockPage,
  aggregateDom,
} from './domProbe.js'

const oldThumb = {
  tagName: 'A',
  id: 'thumbnail',
  href: 'https://www.youtube.com/watch?v=abc123',
  className: '',
}
const newThumb = {
  tagName: 'A',
  id: '',
  href: 'https://www.youtube.com/watch?v=def456',
  className: 'yt-lockup-view-model__content-image other-class',
}
const plainLink = { tagName: 'A', id: '', href: 'https://www.youtube.com/feed/subscriptions', className: 'nav' }

describe('countThumbnailMatches', () => {
  test('recognizes both old and new thumbnail forms via the real predicate', () => {
    const c = countThumbnailMatches([oldThumb, newThumb, plainLink])
    expect(c.matches).toBe(2)
    expect(c.oldStyle).toBe(1)
    expect(c.newStyle).toBe(1)
    expect(c.watchLinks).toBe(2)
    expect(c.total).toBe(3)
  })

  test('no matches when thumbnail markers disappear', () => {
    const broken = { tagName: 'A', id: '', href: 'https://www.youtube.com/watch?v=zzz', className: 'brand-new-class' }
    const c = countThumbnailMatches([broken])
    expect(c.matches).toBe(0)
    expect(c.watchLinks).toBe(1)
  })
})

describe('isConsentOrBlockPage', () => {
  test('detects consent redirect and bot walls', () => {
    expect(isConsentOrBlockPage({ url: 'https://consent.youtube.com/m?...', title: '' })).toBe(true)
    expect(isConsentOrBlockPage({ url: 'https://www.google.com/sorry/index', title: '' })).toBe(true)
    expect(isConsentOrBlockPage({ url: 'https://www.youtube.com/results', title: 'news - YouTube' })).toBe(false)
  })
})

describe('aggregateDom', () => {
  test('pass when any usable probe finds thumbnails', () => {
    expect(aggregateDom([{ watchLinks: 20, matches: 18 }, { blocked: true }])).toBe('pass')
  })
  test('fail when usable probes have watch links but zero matches', () => {
    expect(aggregateDom([{ watchLinks: 20, matches: 0 }])).toBe('fail')
  })
  test('inconclusive when every probe is blocked or has no watch links', () => {
    expect(aggregateDom([{ blocked: true }, { watchLinks: 0, matches: 0 }])).toBe('inconclusive')
  })

  test('fail when one surface breaks even if another surface still passes', () => {
    expect(
      aggregateDom([
        { surface: 'search', watchLinks: 110, matches: 27 },
        { surface: 'channel', watchLinks: 30, matches: 0 },
      ]),
    ).toBe('fail')
  })
  test('pass when every usable surface has matches', () => {
    expect(
      aggregateDom([
        { surface: 'search', watchLinks: 110, matches: 27 },
        { surface: 'watch', watchLinks: 20, matches: 20 },
      ]),
    ).toBe('pass')
  })
  test('surface without usable probes (e.g. anonymous home) stays neutral', () => {
    expect(
      aggregateDom([
        { surface: 'home', watchLinks: 0, matches: 0 },
        { surface: 'search', watchLinks: 110, matches: 27 },
      ]),
    ).toBe('pass')
  })
  test('multiple probes within a surface buffer each other', () => {
    expect(
      aggregateDom([
        { surface: 'search', watchLinks: 100, matches: 0 },
        { surface: 'search', watchLinks: 110, matches: 27 },
      ]),
    ).toBe('pass')
  })
})
