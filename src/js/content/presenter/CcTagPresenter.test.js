import { jest } from '@jest/globals'
import { CcTagPresenter } from './CcTagPresenter.js'

describe('CcTagPresenter', () => {
  const createThumbnailView = () => ({
    getVideoUrl: () => 'https://www.youtube.com/watch?v=123456',
    insertCcTag: jest.fn(),
    hasCcTag: jest.fn().mockResolvedValue(false),
  })

  const createPresenter = ccTagModel => {
    const ccTagFactory = { createCcTagView: jest.fn().mockReturnValue('ccTagView') }
    return new CcTagPresenter(ccTagFactory, {}, {}, ccTagModel)
  }

  it('should insert cc tag if video has captions', async () => {
    const ccTagModel = {
      relatedLanguages: ['en'],
      hasCaptions: jest.fn().mockResolvedValue(true),
    }
    const thumbnailView = createThumbnailView()
    const presenter = createPresenter(ccTagModel)

    await presenter.checkCaptionsAndCreateCcTag(thumbnailView)

    expect(thumbnailView.insertCcTag).toBeCalled()
  })

  it('should not insert cc tag if video has no captions', async () => {
    const ccTagModel = {
      relatedLanguages: ['en'],
      hasCaptions: jest.fn().mockResolvedValue(false),
    }
    const thumbnailView = createThumbnailView()
    const presenter = createPresenter(ccTagModel)

    await presenter.checkCaptionsAndCreateCcTag(thumbnailView)

    expect(thumbnailView.insertCcTag).not.toBeCalled()
  })

  it('should not throw nor insert cc tag if the caption check fails', async () => {
    const ccTagModel = {
      relatedLanguages: ['en'],
      hasCaptions: jest
        .fn()
        .mockRejectedValue(
          new Error('message channel closed before a response was received'),
        ),
    }
    const thumbnailView = createThumbnailView()
    const presenter = createPresenter(ccTagModel)

    await expect(
      presenter.checkCaptionsAndCreateCcTag(thumbnailView),
    ).resolves.not.toThrow()
    expect(thumbnailView.insertCcTag).not.toBeCalled()
  })
})
