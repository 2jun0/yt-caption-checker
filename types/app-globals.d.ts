declare global {
  type IndexedDB = import('../src/js/store/IndexedDB.js').IndexedDB
  type ThrottledQueue = import('../src/js/background/ThrottledQueue.js').ThrottledQueue
  type CircuitBreaker = import('../src/js/background/CircuitBreaker.js').CircuitBreaker
  type CcTagLanguagePresenter =
    import('../src/js/popup/ccTagLanguage/CcTagLanguagePresenter.js').CcTagLanguagePresenter
}

export {}
