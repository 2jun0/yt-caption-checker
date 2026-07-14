/**
 * Decide the caption-canary verdict from per-video outcomes.
 * outcome: 'ok' (parsed w/ usable languageCode) | 'broken' (page loaded, caption
 * data structurally wrong = real break) | 'unreachable' (consent/bot-wall/network = no signal).
 * Rot tolerant: pass when at least half are ok. Below that, fail only if there is a
 * definite structural break; if every failure is just "no signal", stay inconclusive
 * (avoids daily false alarms from CI-IP consent walls).
 * @param {{id: string, outcome: 'ok'|'broken'|'unreachable', error?: string}[]} results
 * @returns {{status:'pass'|'fail'|'inconclusive', passed:number, total:number, broken:object[], unreachable:object[]}}
 */
export const judgeCaptionResults = results => {
  const total = results.length
  const passed = results.filter(r => r.outcome === 'ok').length
  const broken = results.filter(r => r.outcome === 'broken')
  const unreachable = results.filter(r => r.outcome === 'unreachable')
  let status
  if (passed >= Math.ceil(total / 2)) status = 'pass'
  else if (broken.length > 0) status = 'fail'
  else status = 'inconclusive'
  return { status, passed, total, broken, unreachable }
}
