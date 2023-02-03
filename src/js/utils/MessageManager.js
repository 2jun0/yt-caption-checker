/**
 * @typedef {Object} MessageManager
 * @property {(key: any, value: any) => Promise<void>} sendMessage
 */

/**
 * Message Manager
 * @returns {MessageManager}
 */
export const MessageManager = () => {
  const sendMessage = async (key, value) => {
    const tabs = await chrome.tabs.query({
      active: true,
    })
  
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { [key]: value }).catch(e => {})
    })
  }

  return {
    sendMessage
  }
}