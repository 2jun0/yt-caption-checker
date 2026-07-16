import { jest } from '@jest/globals'
import { CcTagPresenter } from './CcTagPresenter.js'

describe('CcTagPresenter', () => {
  const createThumbnailView = () => ({
    getVideoUrl: () => 'https://www.youtube.com/watch?v=123456',
    insertCcTag: jest.fn(),
    insertCcLoading: jest.fn(),
    hasCcTag: jest.fn().mockReturnValue(false),
  })

  const createCcLoadingView = () => ({
    remove: jest.fn(),
    ccLoadingElement: () => {},
  })

  const createPresenter = (
    ccTagModel,
    ccLoadingView = createCcLoadingView(),
  ) => {
    const ccTagFactory = {
      createCcTagView: jest.fn().mockReturnValue('ccTagView'),
      createCcLoadingView: jest.fn().mockReturnValue(ccLoadingView),
    }
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

  describe('loading indicator', () => {
    beforeEach(() => {
      jest.useFakeTimers()
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('should not show the loading indicator when the check answers quickly', async () => {
      const ccTagModel = {
        relatedLanguages: ['en'],
        hasCaptions: jest.fn().mockResolvedValue(true),
      }
      const thumbnailView = createThumbnailView()
      const presenter = createPresenter(ccTagModel)

      await presenter.checkCaptionsAndCreateCcTag(thumbnailView)
      jest.advanceTimersByTime(1000)

      expect(thumbnailView.insertCcLoading).not.toBeCalled()
    })

    it('should show the loading indicator when the check takes longer than the delay', async () => {
      let resolveCheck
      const ccTagModel = {
        relatedLanguages: ['en'],
        hasCaptions: jest.fn(
          () => new Promise(resolve => (resolveCheck = resolve)),
        ),
      }
      const ccLoadingView = createCcLoadingView()
      const thumbnailView = createThumbnailView()
      const presenter = createPresenter(ccTagModel, ccLoadingView)

      const check = presenter.checkCaptionsAndCreateCcTag(thumbnailView)
      jest.advanceTimersByTime(300)
      expect(thumbnailView.insertCcLoading).toBeCalledWith(ccLoadingView)

      resolveCheck(true)
      await check

      expect(ccLoadingView.remove).toBeCalled()
      expect(thumbnailView.insertCcTag).toBeCalled()
    })

    it('should remove the loading indicator when the check fails', async () => {
      let rejectCheck
      const ccTagModel = {
        relatedLanguages: ['en'],
        hasCaptions: jest.fn(
          () => new Promise((resolve, reject) => (rejectCheck = reject)),
        ),
      }
      const ccLoadingView = createCcLoadingView()
      const thumbnailView = createThumbnailView()
      const presenter = createPresenter(ccTagModel, ccLoadingView)

      const check = presenter.checkCaptionsAndCreateCcTag(thumbnailView)
      jest.advanceTimersByTime(300)
      rejectCheck(new Error('check failed'))
      await check

      expect(ccLoadingView.remove).toBeCalled()
      expect(thumbnailView.insertCcTag).not.toBeCalled()
    })
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
