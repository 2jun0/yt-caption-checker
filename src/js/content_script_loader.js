/** dynamic import content_script.js */
const dynamicImport = async () => {
  const src = chrome.runtime.getURL('js/content_script.js')
  const contentScript = await import(src)
}

dynamicImport()
