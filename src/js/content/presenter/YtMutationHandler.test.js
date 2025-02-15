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
      tagName: 'YTD-THUMBNAIL',
      querySelector: () => ({
        tagName: 'A',
        id: 'thumbnail',
        href: 'https://www.youtube.com/watch?v=123456',
      }),
    }
    const mutations = [
      {
        target: { querySelectorAll: () => [thumbnailEl] },
      },
    ]

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).toBeCalled()
  })

  it('should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is not a thumbnail', async () => {
    const nonThumbnailEls = [
      {
        tagName: 'DIV',
        querySelector: () => null,
      },
      {
        tagName: 'A',
        id: 'video',
        href: 'https://www.youtube.com/watch?v=123456',
        querySelector: () => null,
      },
    ]
    const mutations = nonThumbnailEls.map(el => ({
      target: { querySelectorAll: () => [el] },
    }))

    ytMutationHandler.handleMutations(mutations)

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled()
  })
})
