export class MessageManager {
  /**
   * Send a message to the active tab.
   * @param {any} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async sendMessage(key, value) {
    const tabs = await chrome.tabs.query({
      active: true,
    })

    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { [key]: value }).catch(e => {})
    })
  }

  /**
   * Add a listener for incoming messages.
   * @param {(req: any) => void} listener
   */
  addOnMessageListener(listener) {
    chrome.runtime.onMessage.addListener((req, sender, sendRes) => {
      listener.handleMessage(req)
    })
  }
}
