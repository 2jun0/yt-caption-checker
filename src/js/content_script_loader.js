/** dynamic import content_script.js */
const dynamicImport = () => {
  const src = chrome.runtime.getURL('js/content_script.js')
  import(src).catch(e => {
    console.error(e)
  })
}

dynamicImport()
