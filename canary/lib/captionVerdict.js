/**
 * Decide the caption-canary verdict from per-video results.
 * Tolerant of fixture rot: pass when at least half of the videos parsed OK.
 * @param {{id: string, ok: boolean, error?: string}[]} results
 * @returns {{status: 'pass'|'fail', passed: number, total: number, failures: object[]}}
 */
export const judgeCaptionResults = results => {
  const total = results.length
  const passed = results.filter(x => x.ok).length
  const failures = results.filter(x => !x.ok)
  const status = passed >= Math.ceil(total / 2) ? 'pass' : 'fail'
  return { status, passed, total, failures }
}
