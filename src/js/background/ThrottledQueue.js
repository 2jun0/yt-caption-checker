/**
 * Runs async tasks with a minimum interval between task starts.
 * Pending tasks are drained LIFO so the most recently requested
 * work runs first.
 */
export class ThrottledQueue {
  /**
   * @param {number} minIntervalMs
   */
  constructor(minIntervalMs) {
    this.minIntervalMs = minIntervalMs
    this._pending = []
    this._timer = null
    this._lastStartedAt = -Infinity
  }

  /**
   * Enqueue a task. Resolves or rejects with the task's outcome.
   * @param {() => Promise<any>} task
   * @returns {Promise<any>}
   */
  run(task) {
    return new Promise((resolve, reject) => {
      this._pending.push({ task, resolve, reject })
      this._schedule()
    })
  }

  // entered from both run() and the timer callback, but never
  // concurrently: neither path awaits, so each runs as a single
  // uninterruptible block, and the _timer guard keeps at most
  // one timer pending
  _schedule() {
    if (this._timer !== null || this._pending.length === 0) return

    const wait = Math.max(
      0,
      this._lastStartedAt + this.minIntervalMs - Date.now(),
    )
    this._timer = setTimeout(() => {
      this._timer = null
      const item = this._pending.pop()
      this._lastStartedAt = Date.now()
      try {
        item.task().then(item.resolve, item.reject)
      } catch (err) {
        item.reject(err)
      }
      this._schedule()
    }, wait)
  }
}
