import { YtThumbnailViewManager } from './YtThumbnailViewManager.js'
import { jest } from '@jest/globals'

describe('YtThumbnailViewManager', () => {
  /** @type {Document} */
  let document
  /** @type {YtThumbnailViewManager} */
  let ytThumbnailViewManager

  beforeEach(() => {
    const oldThumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
    }

    const newThumbnailEl = {
      tagName: 'A',
      id: 'non-thumbnail',
      href: 'https://www.youtube.com/watch?v=abcdef',
      classList: {
        contains: jest
          .fn()
          .mockImplementation(cls => cls === 'yt-lockup-view-model__content-image'),
      },
    }

    const nonThumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/',
    }

    document = {
      querySelectorAll: jest
        .fn()
        .mockReturnValue([oldThumbnailEl, newThumbnailEl, nonThumbnailEl]),
    }
    ytThumbnailViewManager = new YtThumbnailViewManager(document)
  })

  it('should return an array of YtThumbnailView objects', () => {
    const thumbnailViews = ytThumbnailViewManager.findAllThumbnailView()

    expect(Array.isArray(thumbnailViews)).toBe(true)
    expect(document.querySelectorAll).toBeCalledWith(
      'a#thumbnail, a.yt-lockup-view-model__content-image',
    )
    expect(thumbnailViews.length).toBe(2)
  })
})
