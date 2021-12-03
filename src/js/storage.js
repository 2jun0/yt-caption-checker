export const EXTENSION_NAME = 'YT-SUBTITLE-FILTER';
export const FIELD_COLOR_BG = `${EXTENSION_NAME}_color-bg`;
export const FIELD_COLOR_TXT = `${EXTENSION_NAME}_color-txt`;
export const FIELD_TAG_FONT_SIZE = `${EXTENSION_NAME}_tag-font-size`;
export const FIELD_COMBINE_REGION = `${EXTENSION_NAME}_combine-region`;
export const FIELD_LANG = `${EXTENSION_NAME}_lang`;
export const FIELD_VIDEO_LANG_LIST_URL = `${EXTENSION_NAME}_video-lang-list-url`;

export const DEFAULT_VALUE = {
  [FIELD_COLOR_BG]: '#00000099',
  [FIELD_COLOR_TXT]: '#FFFFFF',
  [FIELD_TAG_FONT_SIZE]: '1.3rem',
  [FIELD_COMBINE_REGION]: true,
  [FIELD_LANG]: 'en',
};

export function loadData(fields, callback) {
  if (!Array.isArray(fields)) fields = [fields];

  function dataInitizier(items) {
    fields.forEach(field => {
      if (!items.hasOwnProperty(field)) items[field] = DEFAULT_VALUE[field];
    });

    callback(items);
  }

  chrome.storage.local.get(fields, dataInitizier);
}

export async function loadDataAsync(fields) {
  return new Promise(resolve => {
    if (!Array.isArray(fields)) fields = [fields];

    function dataInitizier(items) {
      fields.forEach(field => {
        if (!items.hasOwnProperty(field)) items[field] = DEFAULT_VALUE[field];
      });

      resolve(items);
    }

    chrome.storage.local.get(fields, dataInitizier);
  });
}

export function saveData(field, value, callback = null) {
  chrome.storage.local.set({ [field]: value }, callback);
}

export async function saveDataAsync(field, value) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [field]: value }, () => {
      resolve();
    });
  });
}
