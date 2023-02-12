import { CcTagFinder } from './CcTagFinder.js'
import { jest } from '@jest/globals'

describe('CcTagFinder', () => {
  /** @type {Document} */
  let document
  /** @type {CcTagFinder} */
  let ccTagFinder

  beforeEach(() => {
    document = {
      querySelectorAll: jest.fn().mockReturnValue([
        { firstChild: {} },
        { firstChild: {} }
      ])
    }
    ccTagFinder = CcTagFinder(document)
  })

  it('should return an array of `CcTagView` objects', () => {
    const ccTagViews = ccTagFinder.findAllCcTagViews()
    expect(Array.isArray(ccTagViews)).toBe(true)
  })
})
