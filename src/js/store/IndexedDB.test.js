import { jest } from '@jest/globals'
import { IndexedDB } from './IndexedDB.js'

describe('IndexedDB', () => {
  const createOpenRequest = () => ({
    onupgradeneeded: null,
    onsuccess: null,
    onerror: null,
  })

  const openRequests = []

  beforeEach(() => {
    openRequests.length = 0
    global.indexedDB = {
      open: jest.fn(() => {
        const request = createOpenRequest()
        openRequests.push(request)
        return request
      }),
      deleteDatabase: jest.fn(),
    }
  })

  afterEach(() => {
    delete global.indexedDB
  })

  it('should open the database only once for concurrent init calls', async () => {
    const db = new IndexedDB()

    const first = db.init()
    const second = db.init()
    openRequests[0].onsuccess({ target: { result: 'db' } })
    await Promise.all([first, second])

    expect(global.indexedDB.open).toBeCalledTimes(1)
    expect(db._db).toBe('db')
  })

  it('should retry the open after a failed init', async () => {
    const db = new IndexedDB()

    const first = db.init()
    openRequests[0].onerror({ target: { errorCode: 1 } })
    await expect(first).rejects.toBeUndefined()

    const second = db.init()
    openRequests[1].onsuccess({ target: { result: 'db' } })
    await second

    expect(global.indexedDB.open).toBeCalledTimes(2)
    expect(db._db).toBe('db')
  })
})
