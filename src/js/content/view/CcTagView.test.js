import { CcTagView } from './CcTagView.js'
import { jest } from '@jest/globals'

describe('CcTagView', () => {
  /** @type {HTMLElement} */
  let ccTagDiv
  /** @type {HTMLElement} */
  let ccTagSpan
  /** @type {CcTagView} */
  let ccTagView

  beforeEach(() => {
    ccTagDiv = {
      style: {
        backgroundColor: null,
        color: null,
        fontSize: null,
      },
      remove: jest.fn(),
    }
    ccTagSpan = {
      textContent: null,
      remove: jest.fn(),
    }
    ccTagView = CcTagView(ccTagDiv, ccTagSpan)
  })

  it('should set the background color of the ccTagDiv element', () => {
    const backgroundColor = '#00000000'
    ccTagView.setBackgroundColor(backgroundColor)
    expect(ccTagDiv.style.backgroundColor).toBe(backgroundColor)
  })

  it('should set the text color of the ccTagDiv element', () => {
    const textColor = '#FFFFFF'
    ccTagView.setTextColor(textColor)
    expect(ccTagDiv.style.color).toBe(textColor)
  })

  it('should set the font size of the ccTagDiv element', () => {
    const fontSize = '1.2rem'
    ccTagView.setFontSize(fontSize)
    expect(ccTagDiv.style.fontSize).toBe(fontSize)
  })

  it('should set the text content of the ccTagSpan element', () => {
    const language = 'en'
    ccTagView.setLanguage(language)
    expect(ccTagSpan.textContent).toBe(language)
  })

  it('should remove the ccTagSpan and ccTagDiv elements from the DOM', () => {
    ccTagView.remove()
    expect(ccTagDiv.remove).toBeCalled()
    expect(ccTagSpan.remove).toBeCalled()
  })

  it('should return the ccTagDiv element', () => {
    expect(ccTagView.ccTagElement()).toBe(ccTagDiv)
  })
})
