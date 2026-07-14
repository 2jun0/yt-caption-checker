import { judgeCaptionResults } from './captionVerdict.js'

const r = (id, ok) => ({ id, ok })

describe('judgeCaptionResults', () => {
  test('pass when at least half succeed (rot tolerant)', () => {
    const v = judgeCaptionResults([r('a', true), r('b', true), r('c', false), r('d', false)])
    expect(v.status).toBe('pass')
    expect(v.passed).toBe(2)
    expect(v.total).toBe(4)
  })

  test('fail when a majority fail (systemic breakage)', () => {
    const v = judgeCaptionResults([r('a', true), r('b', false), r('c', false), r('d', false)])
    expect(v.status).toBe('fail')
    expect(v.failures).toHaveLength(3)
  })

  test('fail when all fail', () => {
    expect(judgeCaptionResults([r('a', false), r('b', false)]).status).toBe('fail')
  })
})
