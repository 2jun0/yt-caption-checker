import { YtMutationHandler } from './YtMutationHandler';
import { CcTagPresenter } from '../presenter/CcTagPresenter';
import { jest } from '@jest/globals'

describe("YtMutationHandler", () => {
  /** @type {YtMutationHandler} */
  let ytMutationHandler
  /** @type {CcTagPresenter} */
  let ccTagPresenter

  beforeEach(() => {
    ccTagPresenter = {
      onThumbnailAdded: jest.fn(),
    };
    ytMutationHandler = YtMutationHandler(ccTagPresenter)
  })

  it("should call the `onThumbnailAdded` method of `CcTagPresenter` with a `YtThumbnailView` object if the mutation target is a thumbnail", async () => {
    const thumbnailEl = {
      tagName: "A",
      id: "thumbnail",
      parentElement: {
        tagName: "NON-YTD-PLAYLIST-THUMBNAIL",
      },
    }
    const mutations = [{
      target: thumbnailEl
    }]

    ytMutationHandler(mutations);

    expect(ccTagPresenter.onThumbnailAdded).toBeCalled();
  });

  it("should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is not a thumbnail", async () => {
    const nonThumbnailEls = [{
      tagName: "DIV",
      id: "thumbnail",
      parentElement: {
        tagName: "NON-YTD-PLAYLIST-THUMBNAIL",
      },
    },{
      tagName: "A",
      id: "video",
      parentElement: {
        tagName: "NON-YTD-PLAYLIST-THUMBNAIL",
      },
    }]
    const mutations = nonThumbnailEls.map(el => {return {
      target: el
    }})

    ytMutationHandler(mutations);

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled();
  });

  it("should not call the `onThumbnailAdded` method of `CcTagPresenter` if the mutation target is in a playlist", async () => {
    const thumbnailElInPlaylist = {
      tagName: "A",
      id: "thumbnail",
      parentElement: {
        tagName: "YTD-PLAYLIST-THUMBNAIL",
      },
    }
    const mutations = [{
      target: thumbnailElInPlaylist
    }]

    YtMutationHandler(ccTagPresenter)(mutations);

    expect(ccTagPresenter.onThumbnailAdded).not.toHaveBeenCalled();
  });
});