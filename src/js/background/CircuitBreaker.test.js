import { jest } from '@jest/globals'
import { CircuitBreaker, CircuitOpenError } from './CircuitBreaker.js'

const createMemoryStorage = () => {
  const data = {}
  return {
    loadDataAsync: async field => ({ [field]: data[field] }),
    saveDataAsync: async (field, value) => {
      data[field] = value
    },
  }
}

const createBreaker = storage =>
  new CircuitBreaker(3, 60_000, 240_000, storage ?? createMemoryStorage())

const failNTimes = async (breaker, n) => {
  for (let i = 0; i < n; i++) {
    await expect(
      breaker.run(() => Promise.reject(new Error('fetch failed'))),
    ).rejects.toThrow('fetch failed')
  }
}

describe('CircuitBreaker', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should pass results through while closed', async () => {
    const breaker = createBreaker()

    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should stay closed below the failure threshold', async () => {
    const breaker = createBreaker()

    await failNTimes(breaker, 2)

    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should reset the failure count on success', async () => {
    const breaker = createBreaker()

    await failNTimes(breaker, 2)
    await breaker.run(async () => 'ok')
    await failNTimes(breaker, 2)

    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should fail fast without running the task once the threshold is hit', async () => {
    const breaker = createBreaker()
    await failNTimes(breaker, 3)

    const task = jest.fn()
    await expect(breaker.run(task)).rejects.toThrow(CircuitOpenError)
    expect(task).not.toBeCalled()
  })

  it('should let a probe through after the backoff and close on success', async () => {
    const breaker = createBreaker()
    await failNTimes(breaker, 3)

    jest.advanceTimersByTime(60_000)

    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should block concurrent calls while a probe is in flight', async () => {
    const breaker = createBreaker()
    await failNTimes(breaker, 3)

    jest.advanceTimersByTime(60_000)

    let resolveProbe
    const probe = breaker.run(
      () => new Promise(resolve => (resolveProbe = resolve)),
    )
    // flush microtasks so the probe's tentative re-open is saved
    for (let i = 0; i < 10; i++) await Promise.resolve()

    await expect(breaker.run(async () => 'ok')).rejects.toThrow(CircuitOpenError)

    resolveProbe('ok')
    await expect(probe).resolves.toBe('ok')
  })

  it('should double the backoff when the probe fails', async () => {
    const breaker = createBreaker()
    await failNTimes(breaker, 3)

    jest.advanceTimersByTime(60_000)
    await failNTimes(breaker, 1) // failed probe → backoff 120s

    jest.advanceTimersByTime(60_000)
    await expect(breaker.run(async () => 'ok')).rejects.toThrow(CircuitOpenError)

    jest.advanceTimersByTime(60_000)
    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should cap the backoff at the maximum', async () => {
    const breaker = createBreaker()
    await failNTimes(breaker, 3)

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(240_000)
      await failNTimes(breaker, 1) // failed probes keep doubling up to the cap
    }

    jest.advanceTimersByTime(240_000)
    await expect(breaker.run(async () => 'ok')).resolves.toBe('ok')
  })

  it('should persist state through the given storage', async () => {
    const storage = createMemoryStorage()
    const breaker = createBreaker(storage)
    await failNTimes(breaker, 3)

    const revived = createBreaker(storage)
    await expect(revived.run(async () => 'ok')).rejects.toThrow(CircuitOpenError)
  })
})
