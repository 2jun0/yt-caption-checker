/**
 * Detect a YouTube consent / bot-wall page from a fetched watch-page final URL + body.
 * Used to tell "no usable signal" (block/consent) apart from a real structural break.
 * @param {string} finalUrl
 * @param {string} body
 * @returns {boolean}
 */
export const looksBlocked = (finalUrl = '', body = '') =>
  /consent\.|\/sorry\//.test(finalUrl) ||
  /before you continue|our systems have detected unusual traffic/i.test(body)
