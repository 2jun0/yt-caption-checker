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
  test('false when a normal watch page body merely references consent.youtube (e.g. a link/cookie), so a real break is not mislabeled unreachable', () => {
    const body = '<html><a href="https://consent.youtube.com/">cookies</a>var ytInitialPlayerResponse = {...}'
    expect(looksBlocked('https://www.youtube.com/watch?v=x', body)).toBe(false)
  })
})
