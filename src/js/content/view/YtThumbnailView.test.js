import { InvalidYouTubeThumnailElementError } from '../../utils/errors.js'
import { YtThumbnailView } from './YtThumbnailView.js'
import { jest } from '@jest/globals'

const validAEl = {
  tagName: 'A',
  id: 'thumbnail',
  href: 'https://www.youtube.com/watch?v=123456',
}

const invalidAEls = [
  {
    tagName: 'nonA',
    id: 'nonthumbnail',
    href: 'https://www.youtube.com/watch?v=123456',
  },
  {
    tagName: 'A',
    id: 'thumbnail',
    href: 'https://www.youtube.com/watch?v=123456',
  },
  {
    tagName: 'A',
    id: 'thumbnail',
  },
  {
    tagName: 'A',
    id: 'thumbnail',
    href: 'https://www.mytube.com/see?v=123456',
  },
]

describe('YtThumbnailView', () => {
  describe('preconditions', () => {
    it("should throw error if thumbnail element hasn't an A tag", () => {
      const thumbnailEl = {
        tagName: 'YTD-THUMBNAIL',
        querySelector: () => null,
      }
      expect(() => new YtThumbnailView(thumbnailEl)).toThrowError(
        InvalidYouTubeThumnailElementError,
      )
    })

    test.each(
      invalidAEls.map(el => [el]),
      ('should throw error if thumbnail element has an invalid A tag',
      aTag => {
        const thumbnailEl = {
          tagName: 'YTD-THUMBNAIL',
          querySelector: () => aTag,
        }
        expect(() => new YtThumbnailView(thumbnailEl)).toThrowError(
          InvalidYouTubeThumnailElementError,
        )
      }),
    )

    it("should throw error if thumbnail element's tag name is invalid", () => {
      const thumbnailEl = {
        tagName: 'NON-YTD-THUMBNAIL',
        querySelector: () => validAEl,
      }
      expect(() => new YtThumbnailView(thumbnailEl)).toThrowError(
        InvalidYouTubeThumnailElementError,
      )
    })
  })

  it('should return the video url', () => {
    const thumbnailEl = {
      tagName: 'YTD-THUMBNAIL',
      querySelector: () => validAEl,
    }
    const ytThumbnailView = new YtThumbnailView(thumbnailEl)

    expect(ytThumbnailView.videoUrl).toBe(validAEl.href)
  })

  it('should insert cc tag to overlays', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => {},
      insertBefore: jest.fn(),
    }
    const thumbnailEl = {
      tagName: 'YTD-THUMBNAIL',
      querySelector: () => validAEl,
    }
    const ytThumbnailView = new YtThumbnailView(thumbnailEl)
    thumbnailEl.querySelector = () => overlays
    const ccTagView = {
      ccTagElement: () => {},
    }

    await ytThumbnailView.insertCcTag(ccTagView)
    expect(overlays.insertBefore).toBeCalled()
  })

  it('should return true if cc tag exists', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => 'el',
      insertBefore: jest.fn(),
    }
    const thumbnailEl = {
      tagName: 'YTD-THUMBNAIL',
      querySelector: () => validAEl,
    }
    const ytThumbnailView = new YtThumbnailView(thumbnailEl)
    thumbnailEl.querySelector = () => overlays
    const ccTagView = {
      ccTagElement: () => {},
    }

    expect(await ytThumbnailView.hasCcTag()).toBe(true)
  })

  it('should return false if cc tag does not exist', async () => {
    const overlays = {
      childElementCount: 1,
      querySelector: () => null,
      insertBefore: jest.fn(),
    }
    const thumbnailEl = {
      tagName: 'YTD-THUMBNAIL',
      querySelector: () => validAEl,
    }
    const ytThumbnailView = new YtThumbnailView(thumbnailEl)
    thumbnailEl.querySelector = () => overlays
    const ccTagView = {
      ccTagElement: () => {},
    }

    expect(await ytThumbnailView.hasCcTag()).toBe(false)
  })
})
