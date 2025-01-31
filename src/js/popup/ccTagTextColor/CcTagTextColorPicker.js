import { CcTagTextColorPresenter } from './CcTagTextColorPresenter.js'

export const CC_PREVIEW_TEXT_COLOR_PICKER_ID = 'color-txt-picker'

/**
 * CC Tag Text Color Picker Element
 */
export class CcTagTextColorPicker {
  constructor(iro) {
    this.textColorPicker = new iro.ColorPicker(
      `#${CC_PREVIEW_TEXT_COLOR_PICKER_ID}`,
      {
        width: 195,
        borderWidth: 1,
        borderColor: '#B0B0B0',
        margin: 5,
        layout: [
          {
            component: iro.ui.Box,
            options: { boxHeight: 100 },
          },
          {
            component: iro.ui.Slider,
            options: { sliderType: 'hue' },
          },
        ],
      },
    )
  }

  /**
   * init function
   * @param {CcTagTextColorPresenter} presenter
   */
  init(presenter) {
    this.textColorPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setTextColor(color)
    })
  }

  setColor(color) {
    this.textColorPicker.color.hexString = color
  }

  hide() {
    this.textColorPicker.el.style.display = 'none'
  }

  display() {
    this.textColorPicker.el.style.display = 'block'
  }

  isDisplay() {
    return this.textColorPicker.el.style.display === 'block'
  }
}
