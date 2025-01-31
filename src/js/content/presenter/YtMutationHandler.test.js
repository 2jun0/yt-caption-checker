import { YtMutationHandler } from './YtMutationHandler'
import { CcTagPresenter } from '../presenter/CcTagPresenter'
import { jest } from '@jest/globals'

describe('YtMutationHandler', () => {
  /** @type {YtMutationHandler} */
  let ytMutationHandler
  /** @type {CcTagPresenter} */
  let ccTagPresenter

  beforeEach(() => {
    ccTagPresenter = {
      onThumbnailAdded: jest.fn(),
    }
    ytMutationHandler = new YtMutationHandler(ccTagPresenter)
  })

  it('should call the `onThumbnailAdded` method of `CcTagPresenter` with a `YtThumbnailView` object if the mutation target is a thumbnail', async () => {
    const thumbnailEl = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
      parentElement: {
        tagName: 'NON-YTD-PLAYLIST-THUMBNAIL',
      },
    }
    const mutations = [
      {
        target: thumbnailEl,
      },
    ]

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).toBeCalled()
  })

  it('should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is not a thumbnail', async () => {
    const nonThumbnailEls = [
      {
        tagName: 'DIV',
        id: 'thumbnail',
        href: 'https://www.youtube.com/watch?v=123456',
        parentElement: {
          tagName: 'NON-YTD-PLAYLIST-THUMBNAIL',
        },
      },
      {
        tagName: 'A',
        id: 'video',
        href: 'https://www.youtube.com/watch?v=123456',
        parentElement: {
          tagName: 'NON-YTD-PLAYLIST-THUMBNAIL',
        },
      },
    ]
    const mutations = nonThumbnailEls.map(el => {
      return {
        target: el,
      }
    })

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })

  it('should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is in a playlist', async () => {
    const thumbnailElInPlaylist = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/watch?v=123456',
      parentElement: {
        tagName: 'YTD-PLAYLIST-THUMBNAIL',
      },
    }
    const mutations = [
      {
        target: thumbnailElInPlaylist,
      },
    ]

    new YtMutationHandler(ccTagPresenter).handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })

  it("should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target doesn't have varified url", async () => {
    const thumbnailElInPlaylist = {
      tagName: 'A',
      id: 'thumbnail',
      href: 'https://www.youtube.com/shorts/123456',
      parentElement: {
        tagName: 'non-YTD-PLAYLIST-THUMBNAIL',
      },
    }
    const mutations = [
      {
        target: thumbnailElInPlaylist,
      },
    ]

    new YtMutationHandler(ccTagPresenter).handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })
})
