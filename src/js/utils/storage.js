import { EXTENSION_NAME } from './common.js'

export const COLOR_BG_FIELD = `${EXTENSION_NAME}_color-bg`
export const COLOR_TXT_FIELD = `${EXTENSION_NAME}_color-txt`
export const CC_PREVIEW_FONT_SIZE_FIELD = `${EXTENSION_NAME}_tag-font-size`
export const IS_COMBINED_REGION_FIELD = `${EXTENSION_NAME}_combine-region`
export const LANGUAGE_FIELD = `${EXTENSION_NAME}_lang`

export const FIELD_VIDEO_LANG_LIST_URL = `${EXTENSION_NAME}_video-lang-list-url`

export const DEFAULT_VALUE = {
  [COLOR_BG_FIELD]: '#00000099',
  [COLOR_TXT_FIELD]: '#FFFFFF',
  [CC_PREVIEW_FONT_SIZE_FIELD]: '1.3rem',
  [IS_COMBINED_REGION_FIELD]: true,
  [LANGUAGE_FIELD]: 'en',
}

/**
 * @typedef {Object} Storage
 * @property {(fields: any, callback: any) => void} loadData
 * @property {(fields: any) => Promise<any>} loadDataAsync
 * @property {(field: any, value: any, callback?: null) => void} saveData
 * @property {(field: any, value: any) => Promise<any>} saveDataAsync
 */

/**
 * @example
 * s = Storage(chrome.storage.local)
 * @param {any} localStorage
 * @returns {Storage}
 */
export const Storage = localStorage => {
  const loadDataAsync = async fields => {
    return new Promise(resolve => {
      loadData(fields, items => {
        resolve(items)
      })
    })
  }

  const saveDataAsync = async (field, value) => {
    return new Promise(resolve => {
      saveData(field, value, resolve)
    })
  }

  const loadData = (fields, callback) => {
    if (!Array.isArray(fields)) fields = [fields]

    localStorage.get(fields, items => {
      fields.forEach(field => {
        if (!items.hasOwnProperty(field)) items[field] = DEFAULT_VALUE[field]
      })

      callback(items)
    })
  }

  const saveData = (field, value, callback = null) => {
    localStorage.set({ [field]: value }, callback)
  }

  return {
    loadDataAsync,
    loadData,
    saveDataAsync,
    saveData,
  }
}

export const loadData = (fields, callback) => {
  if (!Array.isArray(fields)) fields = [fields]

  chrome.storage.local.get(fields, items => {
    fields.forEach(field => {
      if (!items.hasOwnProperty(field)) items[field] = DEFAULT_VALUE[field]
    })

    callback(items)
  })
}

export const loadDataAsync = async fields => {
  return new Promise(resolve => {
    loadData(fields, items => {
      resolve(items)
    })
  })
}

export const saveData = (field, value, callback = null) => {
  chrome.storage.local.set({ [field]: value }, callback)
}

export async function saveDataAsync(field, value) {
  return new Promise(resolve => {
    saveData(field, value, resolve)
  })
}
