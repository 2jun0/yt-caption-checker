import {
  COLOR_BG_FIELD,
  COLOR_TXT_FIELD,
  CC_PREVIEW_FONT_SIZE_FIELD,
  IS_COMBINED_REGION_FIELD,
  LANGUAGE_FIELD,
} from './contants.js'

export const DEFAULT_VALUE = {
  [COLOR_BG_FIELD]: '#00000099',
  [COLOR_TXT_FIELD]: '#FFFFFF',
  [CC_PREVIEW_FONT_SIZE_FIELD]: '1.3rem',
  [IS_COMBINED_REGION_FIELD]: true,
  [LANGUAGE_FIELD]: 'en',
}

export class Storage {
  constructor(localStorage) {
    this.localStorage = localStorage
  }

  async loadDataAsync(fields) {
    return new Promise(resolve => {
      this.loadData(fields, items => {
        resolve(items)
      })
    })
  }

  async saveDataAsync(field, value) {
    return new Promise(resolve => {
      this.saveData(field, value, resolve)
    })
  }

  loadData(fields, callback) {
    if (!Array.isArray(fields)) fields = [fields]

    this.localStorage.get(fields, items => {
      fields.forEach(field => {
        if (!items.hasOwnProperty(field)) items[field] = DEFAULT_VALUE[field]
      })

      callback(items)
    })
  }

  saveData(field, value, callback = null) {
    this.localStorage.set({ [field]: value }, callback)
  }
}
