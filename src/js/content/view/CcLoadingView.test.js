import { jest } from '@jest/globals'
import { CcLoadingView } from './CcLoadingView.js'

describe('CcLoadingView', () => {
  it('should return the loading element', () => {
    const ccLoadingDiv = { remove: jest.fn() }
    const ccLoadingView = new CcLoadingView(ccLoadingDiv)

    expect(ccLoadingView.ccLoadingElement()).toBe(ccLoadingDiv)
  })

  it('should remove the loading element', () => {
    const ccLoadingDiv = { remove: jest.fn() }
    const ccLoadingView = new CcLoadingView(ccLoadingDiv)

    ccLoadingView.remove()

    expect(ccLoadingDiv.remove).toBeCalled()
  })
})
