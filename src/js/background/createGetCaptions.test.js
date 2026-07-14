import { jest } from '@jest/globals'
import { createGetCaptions } from './createGetCaptions.js'

const HOUR = 3600 * 1000
const MINUTE = 60 * 1000

describe('createGetCaptions', () => {
  const createStore = entries => ({
    get: jest.fn(async (store, videoId) => entries[videoId]),
    put: jest.fn(async () => {}),
  })

  const passthroughPipeline = task => task()

  const create = ({ entries = {}, fetchLanguages, pipeline } = {}) => {
    const store = createStore(entries)
    const getCaptions = createGetCaptions({
      store,
      fetchLanguages: fetchLanguages ?? jest.fn(async () => ['en']),
      pipeline: pipeline ?? passthroughPipeline,
    })
    return { getCaptions, store }
  }

  it('should fetch and cache captions on a cache miss', async () => {
    const fetchLanguages = jest.fn(async () => ['en', 'ko'])
    const { getCaptions, store } = create({ fetchLanguages })

    await expect(getCaptions('123456')).resolves.toEqual(['en', 'ko'])
    expect(store.put).toBeCalledWith(
      'captions',
      expect.objectContaining({ videoId: '123456', captions: ['en', 'ko'] }),
    )
  })

  it('should return fresh cached captions without fetching', async () => {
    const fetchLanguages = jest.fn()
    const { getCaptions } = create({
      entries: {
        123456: { videoId: '123456', captions: ['en'], updatedAt: Date.now() - HOUR },
      },
      fetchLanguages,
    })

    await expect(getCaptions('123456')).resolves.toEqual(['en'])
    expect(fetchLanguages).not.toBeCalled()
  })

  it('should refetch when the cached entry is older than a day', async () => {
    const fetchLanguages = jest.fn(async () => ['ko'])
    const { getCaptions } = create({
      entries: {
        123456: {
          videoId: '123456',
          captions: ['en'],
          updatedAt: Date.now() - 25 * HOUR,
        },
      },
      fetchLanguages,
    })

    await expect(getCaptions('123456')).resolves.toEqual(['ko'])
    expect(fetchLanguages).toBeCalled()
  })

  it('should cache a failure marker and rethrow when the lookup fails', async () => {
    const fetchLanguages = jest.fn(async () => {
      throw new Error('bot wall')
    })
    const { getCaptions, store } = create({ fetchLanguages })

    await expect(getCaptions('123456')).rejects.toThrow('bot wall')
    expect(store.put).toBeCalledWith(
      'captions',
      expect.objectContaining({ videoId: '123456', failed: true }),
    )
  })

  it('should not refetch while a failure marker is fresh', async () => {
    const fetchLanguages = jest.fn()
    const { getCaptions } = create({
      entries: {
        123456: {
          videoId: '123456',
          failed: true,
          updatedAt: Date.now() - 5 * MINUTE,
        },
      },
      fetchLanguages,
    })

    await expect(getCaptions('123456')).resolves.toBeNull()
    expect(fetchLanguages).not.toBeCalled()
  })

  it('should refetch once the failure marker expires', async () => {
    const fetchLanguages = jest.fn(async () => ['en'])
    const { getCaptions } = create({
      entries: {
        123456: {
          videoId: '123456',
          failed: true,
          updatedAt: Date.now() - 11 * MINUTE,
        },
      },
      fetchLanguages,
    })

    await expect(getCaptions('123456')).resolves.toEqual(['en'])
    expect(fetchLanguages).toBeCalled()
  })

  it('should not cache a failure marker when the circuit is open', async () => {
    const circuitOpen = new Error('circuit is open')
    circuitOpen.name = 'CircuitOpenError'
    const { getCaptions, store } = create({
      pipeline: async () => {
        throw circuitOpen
      },
    })

    await expect(getCaptions('123456')).rejects.toThrow('circuit is open')
    expect(store.put).not.toBeCalled()
  })

  it('should run the lookup through the given pipeline', async () => {
    const pipeline = jest.fn(task => task())
    const { getCaptions } = create({ pipeline })

    await getCaptions('123456')

    expect(pipeline).toBeCalled()
  })
})
