import { jest } from '@jest/globals'
import { createHasCaptionsListener } from './createHasCaptionsListener.js'

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0))

describe('createHasCaptionsListener', () => {
  const message = {
    type: 'has-captions',
    value: { videoId: '123456', languages: ['en', 'ko'] },
  }

  it('should respond true if captions match a requested language', async () => {
    const getCaptions = jest.fn().mockResolvedValue(['en', 'fr'])
    const sendRes = jest.fn()
    const listener = createHasCaptionsListener(getCaptions)

    const keepChannelOpen = listener(message, {}, sendRes)
    await flushPromises()

    expect(keepChannelOpen).toBe(true)
    expect(sendRes).toBeCalledWith(true)
  })

  it('should respond false if no captions match', async () => {
    const getCaptions = jest.fn().mockResolvedValue(['fr'])
    const sendRes = jest.fn()
    const listener = createHasCaptionsListener(getCaptions)

    listener(message, {}, sendRes)
    await flushPromises()

    expect(sendRes).toBeCalledWith(false)
  })

  it('should respond false if captions are unavailable', async () => {
    const getCaptions = jest.fn().mockResolvedValue(null)
    const sendRes = jest.fn()
    const listener = createHasCaptionsListener(getCaptions)

    listener(message, {}, sendRes)
    await flushPromises()

    expect(sendRes).toBeCalledWith(false)
  })

  it('should respond false if the caption lookup fails', async () => {
    const getCaptions = jest
      .fn()
      .mockRejectedValue(new Error('bot wall: no ytInitialPlayerResponse'))
    const sendRes = jest.fn()
    const listener = createHasCaptionsListener(getCaptions)

    const keepChannelOpen = listener(message, {}, sendRes)
    await flushPromises()

    expect(keepChannelOpen).toBe(true)
    expect(sendRes).toBeCalledWith(false)
  })

  it('should not keep the channel open for unrelated message types', () => {
    const getCaptions = jest.fn()
    const sendRes = jest.fn()
    const listener = createHasCaptionsListener(getCaptions)

    const keepChannelOpen = listener({ type: 'other' }, {}, sendRes)

    expect(keepChannelOpen).toBe(false)
    expect(getCaptions).not.toBeCalled()
  })
})
