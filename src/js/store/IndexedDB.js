import { EXTENSION_NAME } from '../utils/common.js'
import { CAPTION_STORE } from './contants.js'

const DB_NAME = `${EXTENSION_NAME}_DB`

export class IndexedDB {
  /** @type{IDBDatabase} */
  _db = null
  /** @type{Promise<void>} */
  _initPromise = null

  async init() {
    this._initPromise ??= new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)

      req.onupgradeneeded = event => {
        const db = event.target.result

        // Create objectStores
        db.createObjectStore(CAPTION_STORE, {
          keyPath: 'videoId',
        })
      }

      req.onsuccess = event => {
        this._db = event.target.result
        resolve()
      }

      req.onerror = event => {
        console.error(event.target.errorCode)
        reject()
      }
    }).catch(error => {
      this._initPromise = null
      indexedDB.deleteDatabase(DB_NAME)
      throw error
    })

    return this._initPromise
  }

  async put(store, value) {
    if (!this._db) await this.init()

    return new Promise(resolve => {
      this._db
        .transaction([store], 'readwrite')
        .objectStore(store)
        .put(value).onsuccess = event => resolve()
    })
  }

  async get(store, key) {
    if (!this._db) await this.init()

    return new Promise(resolve => {
      const objectStore = this._db
        .transaction([store], 'readonly')
        .objectStore(store)

      objectStore.get(key).onsuccess = event => resolve(event.target.result)
    })
  }
}
