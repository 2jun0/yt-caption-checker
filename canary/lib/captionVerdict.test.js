import { judgeCaptionResults } from './captionVerdict.js'

const r = (id, outcome) => ({ id, outcome })

describe('judgeCaptionResults', () => {
  test('pass when at least half are ok (rot tolerant)', () => {
    const v = judgeCaptionResults([r('a', 'ok'), r('b', 'ok'), r('c', 'broken'), r('d', 'unreachable')])
    expect(v.status).toBe('pass')
    expect(v.passed).toBe(2)
    expect(v.total).toBe(4)
  })

  test('fail when below half AND at least one broken (real structural break)', () => {
    const v = judgeCaptionResults([r('a', 'ok'), r('b', 'broken'), r('c', 'broken'), r('d', 'unreachable')])
    expect(v.status).toBe('fail')
  })

  test('inconclusive when below half and no broken (only unreachable = no signal)', () => {
    const v = judgeCaptionResults([r('a', 'unreachable'), r('b', 'unreachable'), r('c', 'unreachable'), r('d', 'unreachable')])
    expect(v.status).toBe('inconclusive')
  })

  test('all broken -> fail', () => {
    expect(judgeCaptionResults([r('a', 'broken'), r('b', 'broken')]).status).toBe('fail')
  })
})
