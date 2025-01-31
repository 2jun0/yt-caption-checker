import { CcTagBackgroundColorPresenter } from './CcTagBackgroundColorPresenter.js'

export const CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID = 'color-bg-picker'

export class CcTagBackgroundColorPicker {
  constructor(iro) {
    this.backgroundColorPicker = new iro.ColorPicker(
      `#${CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID}`,
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
          {
            component: iro.ui.Slider,
            options: { sliderType: 'alpha' },
          },
        ],
      },
    )
  }

  /**
   * init function
   * @param {CcTagBackgroundColorPresenter} presenter
   */
  init(presenter) {
    this.backgroundColorPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setBackgroundColor(color)
    })
  }

  setColor(color) {
    this.backgroundColorPicker.color.hex8String = color
  }

  hide() {
    this.backgroundColorPicker.el.style.display = 'none'
  }

  display() {
    this.backgroundColorPicker.el.style.display = 'block'
  }

  /**
   * check if the color picker is displayed
   * @returns {boolean}
   */
  isDisplay() {
    return this.backgroundColorPicker.el.style.display === 'block'
  }
}
