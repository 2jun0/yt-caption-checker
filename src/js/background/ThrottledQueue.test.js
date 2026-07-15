import { jest } from '@jest/globals'
import { ThrottledQueue } from './ThrottledQueue.js'

describe('ThrottledQueue', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should run a task and resolve with its result', async () => {
    const queue = new ThrottledQueue(200)

    const result = queue.run(async () => 'ok')
    jest.advanceTimersByTime(0)

    await expect(result).resolves.toBe('ok')
  })

  it('should reject when the task rejects', async () => {
    const queue = new ThrottledQueue(200)

    const result = queue.run(async () => {
      throw new Error('boom')
    })
    jest.advanceTimersByTime(0)

    await expect(result).rejects.toThrow('boom')
  })

  it('should not start tasks closer than the minimum interval', async () => {
    const queue = new ThrottledQueue(200)
    const startedAt = []
    const task = () => {
      startedAt.push(Date.now())
      return Promise.resolve()
    }

    queue.run(task)
    queue.run(task)
    queue.run(task)
    jest.advanceTimersByTime(1000)

    expect(startedAt).toHaveLength(3)
    expect(startedAt[1] - startedAt[0]).toBeGreaterThanOrEqual(200)
    expect(startedAt[2] - startedAt[1]).toBeGreaterThanOrEqual(200)
  })

  it('should run the most recently added task first (LIFO)', async () => {
    const queue = new ThrottledQueue(200)
    const order = []
    const task = name => () => {
      order.push(name)
      return Promise.resolve()
    }

    queue.run(task('first'))
    queue.run(task('second'))
    queue.run(task('third'))
    jest.advanceTimersByTime(1000)

    expect(order).toEqual(['third', 'second', 'first'])
  })

  it('should keep throttling tasks added while draining', async () => {
    const queue = new ThrottledQueue(200)
    const startedAt = []
    const task = () => {
      startedAt.push(Date.now())
      return Promise.resolve()
    }

    queue.run(task)
    jest.advanceTimersByTime(50)
    queue.run(task)
    jest.advanceTimersByTime(1000)

    expect(startedAt).toHaveLength(2)
    expect(startedAt[1] - startedAt[0]).toBeGreaterThanOrEqual(200)
  })
})
