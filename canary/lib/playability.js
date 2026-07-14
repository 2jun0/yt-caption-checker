/**
 * Describe a non-OK playabilityStatus (e.g. LOGIN_REQUIRED, UNPLAYABLE).
 * A missing playabilityStatus is not treated as degraded.
 * @param {any} playerResponse
 * @returns {string|null} "STATUS: reason" when degraded, null otherwise
 */
export const describeDegradedPlayability = playerResponse => {
  const status = playerResponse?.playabilityStatus?.status
  if (typeof status !== 'string' || status === 'OK') return null
  const reason = playerResponse.playabilityStatus.reason
  return reason ? `${status}: ${reason}` : status
}
