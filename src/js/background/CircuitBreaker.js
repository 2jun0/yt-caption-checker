import { debug } from '../utils/common.js'

export class CircuitOpenError extends Error {
  constructor() {
    super('circuit is open')
    this.name = 'CircuitOpenError'
  }
}

const INITIAL_STATE = { failures: 0, backoffMs: null, openUntil: 0 }

/**
 * Circuit breaker for the caption lookup.
 * Opens after `failureThreshold` consecutive failures; while open,
 * run() throws CircuitOpenError without executing the task. After the
 * backoff elapses a single probe call runs — success closes the
 * circuit, failure doubles the backoff (capped at `maxBackoffMs`).
 * State is kept in the injected storage so it survives service worker
 * restarts.
 */
export class CircuitBreaker {
  /**
   * @param {{
   *   failureThreshold: number,
   *   initialBackoffMs: number,
   *   maxBackoffMs: number,
   *   storageKey: string,
   *   storage: {get: (key: string) => Promise<any>, set: (key: string, value: any) => Promise<void>},
   * }} options
   */
  constructor({
    failureThreshold,
    initialBackoffMs,
    maxBackoffMs,
    storageKey,
    storage,
  }) {
    this.failureThreshold = failureThreshold
    this.initialBackoffMs = initialBackoffMs
    this.maxBackoffMs = maxBackoffMs
    this.storageKey = storageKey
    this.storage = storage
  }

  /**
   * Run a task through the circuit.
   * @param {() => Promise<any>} task
   * @returns {Promise<any>}
   */
  async run(task) {
    const state = (await this.storage.get(this.storageKey)) ?? INITIAL_STATE
    const now = Date.now()

    if (now < state.openUntil) throw new CircuitOpenError()

    const isProbe = state.openUntil > 0
    if (isProbe) {
      // re-open tentatively so concurrent calls fail fast during the probe
      await this._save({ ...state, openUntil: now + state.backoffMs })
    }

    try {
      const result = await task()
      if (isProbe || state.failures > 0) {
        if (isProbe) debug('circuit closed', { storageKey: this.storageKey })
        await this._save(INITIAL_STATE)
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
      debug('circuit re-opened after failed probe', {
        storageKey: this.storageKey,
        backoffMs,
      })
      return this._save({
        failures: state.failures,
        backoffMs,
        openUntil: now + backoffMs,
      })
    }

    const failures = state.failures + 1
    if (failures < this.failureThreshold) {
      return this._save({ ...state, failures })
    }

    const backoffMs = state.backoffMs ?? this.initialBackoffMs
    debug('circuit opened', { storageKey: this.storageKey, failures, backoffMs })
    return this._save({ failures, backoffMs, openUntil: now + backoffMs })
  }

  async _save(state) {
    await this.storage.set(this.storageKey, state)
  }
}
