export const EXTENSION_NAME = 'yt-caption-checker'
export const FIELD_COLOR_BG = `${EXTENSION_NAME}_color-bg`
export const FIELD_COLOR_TXT = `${EXTENSION_NAME}_color-txt`
export const FIELD_TAG_FONT_SIZE = `${EXTENSION_NAME}_tag-font-size`
export const FIELD_COMBINE_REGION = `${EXTENSION_NAME}_combine-region`
export const FIELD_LANG = `${EXTENSION_NAME}_lang`
export const FIELD_VIDEO_LANG_LIST_URL = `${EXTENSION_NAME}_video-lang-list-url`

export const DEFAULT_VALUE = {
  [FIELD_COLOR_BG]: '#00000099',
  [FIELD_COLOR_TXT]: '#FFFFFF',
  [FIELD_TAG_FONT_SIZE]: '1.3rem',
  [FIELD_COMBINE_REGION]: true,
  [FIELD_LANG]: 'en',
}

/**
 * @example 
 * s = Storage(chrome.storage.local)
 * @param {any} localStorage
 * @returns 
 */
export const Storage = (localStorage) => {
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

  const _loadData = (fields, callback) => {
    if (!Array.isArray(fields)) 
      fields = [fields]
  
    localStorage.get(fields, items => {
      fields.forEach(field => {
        if (!items.hasOwnProperty(field)) 
          items[field] = DEFAULT_VALUE[field]
      })
  
      callback(items)
    })
  }

  const _saveData = (field, value, callback = null) => {
    localStorage.set({ [field]: value }, callback)
  }

  return {
    loadDataAsync,
    saveDataAsync
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
