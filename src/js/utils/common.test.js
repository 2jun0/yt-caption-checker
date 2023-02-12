import { getYTVideoId } from './common'
import { InvalidYouTubeVideoUrlError as InvalidYouTubeVideoUrlError } from './errors'

describe('get YouTube video id', () => {
  describe('should get correct youtube video id of \'www.youtube.com/watch?v=XXXXX\'', () => {
    it('www.youtube.com/watch?v=sruC4aX-dZ0', () => {
      expect(getYTVideoId('https://www.youtube.com/watch?v=sruC4aX-dZ0')).toBe('sruC4aX-dZ0')
    })
  })

  describe('should throw error when getting incorrect url', () => {
    it('abc', () => {
      expect(() => getYTVideoId('abc')).toThrowError(InvalidYouTubeVideoUrlError)
    })
  })
})