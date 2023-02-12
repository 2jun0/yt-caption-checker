/**
 * @typedef {Object} MessageManager
 * @property {(key: any, value: any) => Promise<void>} sendMessage
 * @property {(listener: (req: any) => void) => void} addOnMessageListener
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

  /**
   * add onMessage Listener
   * @param {(req: any) => void} listener
   */
  const addOnMessageListener = listener => {
    chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
      listener(req)
    })
  }

  return {
    sendMessage,
    addOnMessageListener,
  }
}
