import { jest } from '@jest/globals'
import { CaptionLoader } from './CaptionLoader.js'
import { CircuitOpenError } from '../utils/errors.js'

const HOUR = 3600 * 1000
const MINUTE = 60 * 1000

describe('CaptionLoader', () => {
  const passthrough = { run: task => task() }

  const createLoader = ({
    entries = {},
    fetchCaptionLanguages,
    circuitBreaker,
  } = {}) => {
    const indexedDB = {
      get: jest.fn(async (store, videoId) => entries[videoId]),
      put: jest.fn(async () => {}),
    }
    const loader = new CaptionLoader(
      indexedDB,
      fetchCaptionLanguages ?? jest.fn(async () => ['en']),
      passthrough,
      circuitBreaker ?? passthrough,
    )
    return { loader, indexedDB }
  }

  it('should fetch and cache captions on a cache miss', async () => {
    const fetchCaptionLanguages = jest.fn(async () => ['en', 'ko'])
    const { loader, indexedDB } = createLoader({ fetchCaptionLanguages })

    await expect(loader.getCaptions('123456')).resolves.toEqual(['en', 'ko'])
    expect(indexedDB.put).toBeCalledWith(
      'captions',
      expect.objectContaining({ videoId: '123456', captions: ['en', 'ko'] }),
    )
  })

  it('should return fresh cached captions without fetching', async () => {
    const fetchCaptionLanguages = jest.fn()
    const { loader } = createLoader({
      entries: {
        123456: { videoId: '123456', captions: ['en'], updatedAt: Date.now() - HOUR },
      },
      fetchCaptionLanguages,
    })

    await expect(loader.getCaptions('123456')).resolves.toEqual(['en'])
    expect(fetchCaptionLanguages).not.toBeCalled()
  })

  it('should refetch when the cached entry is older than a day', async () => {
    const fetchCaptionLanguages = jest.fn(async () => ['ko'])
    const { loader } = createLoader({
      entries: {
        123456: {
          videoId: '123456',
          captions: ['en'],
          updatedAt: Date.now() - 25 * HOUR,
        },
      },
      fetchCaptionLanguages,
    })

    await expect(loader.getCaptions('123456')).resolves.toEqual(['ko'])
    expect(fetchCaptionLanguages).toBeCalled()
  })

  it('should cache a failure marker and rethrow when the lookup fails', async () => {
    const fetchCaptionLanguages = jest.fn(async () => {
      throw new Error('bot wall')
    })
    const { loader, indexedDB } = createLoader({ fetchCaptionLanguages })

    await expect(loader.getCaptions('123456')).rejects.toThrow('bot wall')
    expect(indexedDB.put).toBeCalledWith(
      'captions',
      expect.objectContaining({ videoId: '123456', failed: true }),
    )
  })

  it('should not cache a failure marker when the circuit is open', async () => {
    const circuitBreaker = {
      run: async () => {
        throw new CircuitOpenError()
      },
    }
    const { loader, indexedDB } = createLoader({ circuitBreaker })

    await expect(loader.getCaptions('123456')).rejects.toThrow(CircuitOpenError)
    expect(indexedDB.put).not.toBeCalled()
  })

  it('should not refetch while a failure marker is fresh', async () => {
    const fetchCaptionLanguages = jest.fn()
    const { loader } = createLoader({
      entries: {
        123456: {
          videoId: '123456',
          failed: true,
          updatedAt: Date.now() - 5 * MINUTE,
        },
      },
      fetchCaptionLanguages,
    })

    await expect(loader.getCaptions('123456')).resolves.toBeNull()
    expect(fetchCaptionLanguages).not.toBeCalled()
  })

  it('should refetch once the failure marker expires', async () => {
    const fetchCaptionLanguages = jest.fn(async () => ['en'])
    const { loader } = createLoader({
      entries: {
        123456: {
          videoId: '123456',
          failed: true,
          updatedAt: Date.now() - 11 * MINUTE,
        },
      },
      fetchCaptionLanguages,
    })

    await expect(loader.getCaptions('123456')).resolves.toEqual(['en'])
    expect(fetchCaptionLanguages).toBeCalled()
  })

  it('should share one request between concurrent lookups of the same video', async () => {
    const fetchCaptionLanguages = jest.fn(async () => ['en'])
    const { loader } = createLoader({ fetchCaptionLanguages })

    const results = await Promise.all([
      loader.getCaptions('123456'),
      loader.getCaptions('123456'),
    ])

    expect(results).toEqual([['en'], ['en']])
    expect(fetchCaptionLanguages).toBeCalledTimes(1)
  })
})
