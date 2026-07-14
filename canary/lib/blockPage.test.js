import { looksBlocked } from './blockPage.js'

describe('looksBlocked', () => {
  test('true on consent/sorry redirect URLs', () => {
    expect(looksBlocked('https://consent.youtube.com/m?continue=x', '')).toBe(true)
    expect(looksBlocked('https://www.google.com/sorry/index', '')).toBe(true)
  })
  test('true on bot-wall / consent body markers', () => {
    expect(looksBlocked('https://www.youtube.com/watch?v=x', 'Before you continue to YouTube')).toBe(true)
    expect(looksBlocked('https://www.youtube.com/watch?v=x', 'our systems have detected unusual traffic')).toBe(true)
  })
  test('false on a normal watch page', () => {
    expect(looksBlocked('https://www.youtube.com/watch?v=x', '<html>var ytInitialPlayerResponse = {...}')).toBe(false)
  })
})
