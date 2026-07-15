import { jest } from '@jest/globals'
import { CcLoadingView } from './CcLoadingView.js'

describe('CcLoadingView', () => {
  it('should return the loading element', () => {
    const loadingDiv = { remove: jest.fn() }
    const ccLoadingView = new CcLoadingView(loadingDiv)

    expect(ccLoadingView.loadingElement()).toBe(loadingDiv)
  })

  it('should remove the loading element', () => {
    const loadingDiv = { remove: jest.fn() }
    const ccLoadingView = new CcLoadingView(loadingDiv)

    ccLoadingView.remove()

    expect(loadingDiv.remove).toBeCalled()
  })
})
