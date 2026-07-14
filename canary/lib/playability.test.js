import { describeDegradedPlayability } from './playability.js'

describe('describeDegradedPlayability', () => {
  test('LOGIN_REQUIRED bot wall is degraded, message carries status and reason', () => {
    const pr = {
      playabilityStatus: {
        status: 'LOGIN_REQUIRED',
        reason: 'Sign in to confirm you’re not a bot',
      },
    }
    expect(describeDegradedPlayability(pr)).toBe(
      'LOGIN_REQUIRED: Sign in to confirm you’re not a bot',
    )
  })

  test('non-OK status without reason is still degraded', () => {
    const pr = { playabilityStatus: { status: 'UNPLAYABLE' } }
    expect(describeDegradedPlayability(pr)).toBe('UNPLAYABLE')
  })

  test('OK status is not degraded', () => {
    const pr = { playabilityStatus: { status: 'OK' } }
    expect(describeDegradedPlayability(pr)).toBeNull()
  })

  test('missing playabilityStatus is not degraded (keeps real-break detection)', () => {
    expect(describeDegradedPlayability({})).toBeNull()
    expect(describeDegradedPlayability(undefined)).toBeNull()
  })
})
