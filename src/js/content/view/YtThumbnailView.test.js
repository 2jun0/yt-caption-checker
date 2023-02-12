import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { YtThumbnailView } from './YtThumbnailView.js'
import { jest } from '@jest/globals'

describe('YtThumbnailView', () => {

  describe('preconditions', () => {
    it('should throw error if thumbnail element is not a tag', () => {
      const nonThumbnailEl = {
        tagName: 'nonA',
        id: 'thumbnail',
        href: 'https://www.youtube.com/watch?v=123456'
      }
      expect(() => YtThumbnailView(nonThumbnailEl)).toThrowError(InvalidYouTubeThumnailElementError)
    })

    it('should throw error if thumbnail element doesn\' have thumbnail id', () => {
      const nonThumbnailEl = {
        tagName: 'A',
        id: 'non-thumbnail',
        href: 'https://www.youtube.com/watch?v=123456',
      }
      expect(() => YtThumbnailView(nonThumbnailEl)).toThrowError(InvalidYouTubeThumnailElementError)
    })

    it('should throw error if thumbnail element doesn\' have href', () => {
      const nonThumbnailEl = {
        tagName: 'A',
        id: 'thumbnail'
      }
      expect(() => YtThumbnailView(nonThumbnailEl)).toThrowError(InvalidYouTubeThumnailElementError)
    })
  })

  it('should return the video url', () => {
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
    }
    const ytThumbnailView = YtThumbnailView(thumbnailEl)

    expect(ytThumbnailView.getVideoUrl()).toBe('https://www.youtube.com/watch?v=123456')
  })

  it('should insert cc tag to overlays', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => {},
      insertBefore: jest.fn()
    }
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
      querySelector: () => overlays
    }
    const ccTagView = {
      ccTagElement: () => {}
    }
    const ytThumbnailView = YtThumbnailView(thumbnailEl)

    await ytThumbnailView.insertCcTag(ccTagView)
    expect(overlays.insertBefore).toBeCalled()
  })

  it('should return true if cc tag exists', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => 'el',
      insertBefore: jest.fn()
    }
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
      querySelector: () => overlays
    }
    const ytThumbnailView = YtThumbnailView(thumbnailEl)

    expect(await ytThumbnailView.hasCcTag()).toBe(true)
  })

  it('should return false if cc tag does not exist', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => null,
      insertBefore: jest.fn()
    }
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
      querySelector: () => overlays
    }
    const ytThumbnailView = YtThumbnailView(thumbnailEl)

    expect(await ytThumbnailView.hasCcTag()).toBe(false)
  })
})

