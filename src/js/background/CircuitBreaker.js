import { debug } from '../utils/common.js'
import { Storage } from '../store/Storage.js'
import { CIRCUIT_STATE_FIELD } from '../store/contants.js'

export class CircuitOpenError extends Error {
  constructor() {
    super('circuit is open')
    this.name = 'CircuitOpenError'
  }
}

const INITIAL_STATE = { failures: 0, backoffMs: null, openUntil: 0 }

export class CircuitBreaker {
  /**
   * @param {number} failureThreshold
   * @param {number} initialBackoffMs
   * @param {number} maxBackoffMs
   * @param {Storage} storage
   */
  constructor(failureThreshold, initialBackoffMs, maxBackoffMs, storage) {
    this.failureThreshold = failureThreshold
    this.initialBackoffMs = initialBackoffMs
    this.maxBackoffMs = maxBackoffMs
    this.storage = storage
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
    const state = (await this._loadState()) ?? INITIAL_STATE
    const now = Date.now()

    if (now < state.openUntil) throw new CircuitOpenError()

    const isProbe = state.openUntil > 0
    if (isProbe) {
      // re-open tentatively so concurrent calls fail fast during the probe
      await this._saveState({ ...state, openUntil: now + state.backoffMs })
    }

    try {
      const result = await task()
      if (isProbe || state.failures > 0) {
        if (isProbe) debug('circuit closed')
        await this._saveState(INITIAL_STATE)
      }
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

    const backoffMs = state.backoffMs ?? this.initialBackoffMs
    debug('circuit opened', { failures, backoffMs })
    return this._saveState({ failures, backoffMs, openUntil: now + backoffMs })
  }

  async _loadState() {
    const items = await this.storage.loadDataAsync(CIRCUIT_STATE_FIELD)
    return items[CIRCUIT_STATE_FIELD]
  }

  async _saveState(state) {
    await this.storage.saveDataAsync(CIRCUIT_STATE_FIELD, state)
  }
}
