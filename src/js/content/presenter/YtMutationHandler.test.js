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
    const thumbnailEl = document.createElement('a')
    thumbnailEl.id = 'thumbnail'
    thumbnailEl.href = 'https://www.youtube.com/watch?v=123456'

    const containerEl = document.createElement('div')
    containerEl.appendChild(thumbnailEl)

    const mutations = [
      {
        addedNodes: [containerEl],
      },
    ]

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).toBeCalled()
  })

  it('should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is not a thumbnail', async () => {
    const containerWithoutAnchor = document.createElement('div')

    const nonThumbnailAnchor = document.createElement('a')
    nonThumbnailAnchor.id = 'video'
    nonThumbnailAnchor.href = 'https://www.youtube.com/watch?v=123456'

    const containerWithNonThumbnailAnchor = document.createElement('div')
    containerWithNonThumbnailAnchor.appendChild(nonThumbnailAnchor)

    const mutations = [
      { addedNodes: [containerWithoutAnchor] },
      { addedNodes: [containerWithNonThumbnailAnchor] },
    ]

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })

  it('should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is in a playlist', async () => {
    const playlistEl = document.createElement('ytd-playlist-thumbnail')
    const thumbnailElInPlaylist = document.createElement('a')
    thumbnailElInPlaylist.id = 'thumbnail'
    thumbnailElInPlaylist.href = 'https://www.youtube.com/watch?v=123456'
    playlistEl.appendChild(thumbnailElInPlaylist)

    const mutations = [
      {
        addedNodes: [playlistEl],
      },
    ]

    new YtMutationHandler(ccTagPresenter).handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })

  it("should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target doesn't have varified url", async () => {
    const thumbnailEl = document.createElement('a')
    thumbnailEl.id = 'thumbnail'
    thumbnailEl.href = 'https://www.youtube.com/shorts/123456'

    const containerEl = document.createElement('div')
    containerEl.appendChild(thumbnailEl)

    const mutations = [
      {
        addedNodes: [containerEl],
      },
    ]

    new YtMutationHandler(ccTagPresenter).handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })
})
