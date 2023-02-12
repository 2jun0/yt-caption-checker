import { CcTagFactory } from './CcTagFactory.js'
import { jest } from '@jest/globals'

describe('CcTagFactory', () => {
  /** @type {Document} */
  let document
  /** @type {CcTagFactory} */
  let ccTagFactory

  beforeEach(() => {
    document = {
      createElement: jest.fn().mockImplementation(tag => ({
        appendChild: jest.fn(),
        style: {},
      })),
    }
    ccTagFactory = CcTagFactory(document)
  })

  it('should create a CcTagView', () => {
    const ccTagView = ccTagFactory.createCcTagView(
      '#00000000',
      '#000000',
      '1.2rem',
      'en',
    )
    expect(ccTagView).toBeDefined()
  })
})
