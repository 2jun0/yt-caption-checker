import { debug } from '../utils/common.js'
import { CircuitOpenError } from '../utils/errors.js'

export class CircuitBreaker {
  /**
   * @param {number} failureThreshold
   * @param {number} initialBackoffMs
   * @param {number} maxBackoffMs
   * @param {import('../store/Storage.js').Storage} storage
   * @param {string} stateField
   */
  constructor(failureThreshold, initialBackoffMs, maxBackoffMs, storage, stateField) {
    this.failureThreshold = failureThreshold
    this.initialBackoffMs = initialBackoffMs
    this.maxBackoffMs = maxBackoffMs
    this.storage = storage
    this.stateField = stateField
    this._state = null
  }

  /**
   * Run a task through the circuit.
   * Opens after `failureThreshold` consecutive failures; while open,
   * throws CircuitOpenError without running the task. After the backoff
   * a single probe runs — success closes the circuit, failure doubles
   * the backoff up to `maxBackoffMs`.
   * @param {() => Promise<any>} task
   * @returns {Promise<any>}
   */
  async run(task) {
    const state = await this._loadState()
    const now = Date.now()

    if (now < state.openUntil) throw new CircuitOpenError()

    const isProbe = state.openUntil > 0
    if (isProbe) {
      // re-open tentatively so concurrent calls fail fast during the probe
      await this._saveState({ ...state, openUntil: now + state.backoffMs })
    }

    try {
      const result = await task()
      if (isProbe) debug('circuit closed')
      if (isProbe || state.failures > 0) await this._saveState(this._closedState())
      return result
    } catch (err) {
      await this._recordFailure(state, isProbe)
      throw err
    }
  }

  async _recordFailure(state, isProbe) {
    const now = Date.now()

    if (isProbe) {
      const backoffMs = Math.min(state.backoffMs * 2, this.maxBackoffMs)
      debug('circuit re-opened after failed probe', { backoffMs })
      return this._saveState({
        failures: state.failures,
        backoffMs,
        openUntil: now + backoffMs,
      })
    }

    const failures = state.failures + 1
    if (failures < this.failureThreshold) {
      return this._saveState({ ...state, failures })
    }

    debug('circuit opened', { failures, backoffMs: state.backoffMs })
    return this._saveState({ ...state, failures, openUntil: now + state.backoffMs })
  }

  _closedState() {
    return { failures: 0, backoffMs: this.initialBackoffMs, openUntil: 0 }
  }

  // the state is read from storage once per service worker lifetime
  // and written through on every change
  async _loadState() {
    if (!this._state) {
      const items = await this.storage.loadDataAsync(this.stateField)
      this._state = items[this.stateField] ?? this._closedState()
    }
    return this._state
  }

  async _saveState(state) {
    this._state = state
    await this.storage.saveDataAsync(this.stateField, state)
  }
}
