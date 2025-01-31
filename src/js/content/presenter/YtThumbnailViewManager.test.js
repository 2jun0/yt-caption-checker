import { YtThumbnailViewManager } from './YtThumbnailViewManager.js'
import { jest } from '@jest/globals'

describe('YtThumbnailViewManager', () => {
  /** @type {Document} */
  let document
  /** @type {YtThumbnailViewManager} */
  let ytThumbnailViewManager

  beforeEach(() => {
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
    }
    document = {
      querySelectorAll: jest
        .fn()
        .mockReturnValue([thumbnailEl, thumbnailEl, thumbnailEl]),
    }
    ytThumbnailViewManager = new YtThumbnailViewManager(document)
  })

  it('should return an array of YtThumbnailView objects', () => {
    const thumbnailViews = ytThumbnailViewManager.findAllThumbnailView()

    expect(Array.isArray(thumbnailViews)).toBe(true)
    expect(thumbnailViews.length).toBe(3)
  })
})
