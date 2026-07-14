/**
 * Decide the GitHub-issue action for a canary surface, using the list of
 * currently-open canary issues for this surface as the dedup signal.
 * @param {{status:'pass'|'fail'|'inconclusive', openIssues:{number:number}[]}} p
 * @returns {{action:'create'|'close'|'noop', number?:number}}
 */
export const decideIssueAction = ({ status, openIssues }) => {
  const hasOpen = openIssues.length > 0
  if (status === 'fail') return hasOpen ? { action: 'noop' } : { action: 'create' }
  if (status === 'pass') return hasOpen ? { action: 'close', number: openIssues[0].number } : { action: 'noop' }
  return { action: 'noop' } // inconclusive
}
