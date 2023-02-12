import { CcTagModel } from './CcTagModel'

describe('CcTagModel', () => {
  /** @type {CcTagModel} */
  let ccTagModel
  const defaultBackgroundColor = '#ffffffff'
  const defaultTextColor = '#ffffff'
  const defaultFontSize = '1.0rem'
  const defaultLanguage = 'en'
  const defaultCombinedRegion = true

  beforeEach(() => {
    ccTagModel = CcTagModel(
      defaultBackgroundColor,
      defaultTextColor,
      defaultFontSize,
      defaultLanguage,
      defaultCombinedRegion,
    )
  })

  it('should have the correct backgroundColor', () => {
    expect(ccTagModel.backgroundColor()).toBe(defaultBackgroundColor)
  })

  it('should have the correct textColor', () => {
    expect(ccTagModel.textColor()).toBe(defaultTextColor)
  })

  it('should have the correct fontSize', () => {
    expect(ccTagModel.fontSize()).toBe(defaultFontSize)
  })

  it('should have the correct shownLanguage', () => {
    expect(ccTagModel.shownLanguage()).toBe(defaultLanguage)
  })

  it('should have the correct related languages', () => {
    expect(ccTagModel.relatedLanguages().sort()).toEqual(
      ['en', 'en-CA', 'en-IN', 'en-IE', 'en-GB', 'en-US'].sort(),
    )
  })

  it('setBackgroundColor should change backgroundColor', () => {
    const newBackroundColor = '#00000000'
    ccTagModel.setBackgroundColor(newBackroundColor)
    expect(ccTagModel.backgroundColor()).toBe(newBackroundColor)
  })

  it('setTextColor should change textColor', () => {
    const newTextColor = '#000000'
    ccTagModel.setTextColor(newTextColor)
    expect(ccTagModel.textColor()).toBe(newTextColor)
  })

  it('setFontSize should change fontSize', () => {
    const newFontSize = '#000000'
    ccTagModel.setFontSize(newFontSize)
    expect(ccTagModel.fontSize()).toBe(newFontSize)
  })

  describe('should return correct shown language', () => {
    it('en-US and not combinedRegion', () => {
      ccTagModel.setIsCombinedRegion(false)
      ccTagModel.setLanguage('en-US')
      expect(ccTagModel.shownLanguage()).toBe('en-US')
    })

    it('en-US and combinedRegion', () => {
      ccTagModel.setIsCombinedRegion(true)
      ccTagModel.setLanguage('en-US')
      expect(ccTagModel.shownLanguage()).toBe('en')
    })

    it('en and not combinedRegion', () => {
      ccTagModel.setIsCombinedRegion(false)
      ccTagModel.setLanguage('en')
      expect(ccTagModel.shownLanguage()).toBe('en')
    })

    it('en and combinedRegion', () => {
      ccTagModel.setIsCombinedRegion(true)
      ccTagModel.setLanguage('en')
      expect(ccTagModel.shownLanguage()).toBe('en')
    })
  })

  describe('hasCaptions should return correct value', () => {
    it('https://youtu.be/jNQXAC9IVRw has en caption', async () => {
      const result = await ccTagModel.hasCaptions(
        'https://youtu.be/jNQXAC9IVRw',
        ['en'],
      )
      expect(result).toBe(true)
    })

    it("https://youtu.be/jNQXAC9IVRw doesn' have ko caption", async () => {
      const result = await ccTagModel.hasCaptions(
        'https://youtu.be/jNQXAC9IVRw',
        ['ko'],
      )
      expect(result).toBe(false)
    })
  })
})
