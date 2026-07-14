import { decideIssueAction } from './issuePolicy.js'

describe('decideIssueAction', () => {
  test('fail + no open issue -> create', () => {
    expect(decideIssueAction({ status: 'fail', openIssues: [] })).toEqual({ action: 'create' })
  })
  test('fail + existing open issue -> noop (no daily re-comment)', () => {
    expect(decideIssueAction({ status: 'fail', openIssues: [{ number: 7 }] })).toEqual({ action: 'noop' })
  })
  test('pass + existing open issue -> close', () => {
    expect(decideIssueAction({ status: 'pass', openIssues: [{ number: 7 }] })).toEqual({ action: 'close', number: 7 })
  })
  test('pass + no open issue -> noop', () => {
    expect(decideIssueAction({ status: 'pass', openIssues: [] })).toEqual({ action: 'noop' })
  })
  test('inconclusive -> always noop', () => {
    expect(decideIssueAction({ status: 'inconclusive', openIssues: [] })).toEqual({ action: 'noop' })
    expect(decideIssueAction({ status: 'inconclusive', openIssues: [{ number: 7 }] })).toEqual({ action: 'noop' })
  })
})
