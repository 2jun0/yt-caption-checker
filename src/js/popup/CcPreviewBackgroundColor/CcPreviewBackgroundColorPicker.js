import { CcPreviewBackgroundColorPresenter } from "./CcPreviewBackgroundColorPresenter.js";

export const CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID = 'color-bg-picker'

/**
 * @typedef {Object} CcPreviewBackgroundColorPicker
 * @property {(presenter: CcPreviewBackgroundColorPresenter) => void} init
 * @property {function} setColor
 * @property {function} display 
 * @property {function} hide
 * @property {function} isDisplay
 */

/**
 * CC Preview Background Color Picker Element
 * @param {*} iro
 * @returns {CcPreviewBackgroundColorPicker}
 */
export const CcPreviewBackgroundColorPicker = iro => {
  const backgroundColorPicker = new iro.ColorPicker(`#${CC_PREVIEW_BACKGROUND_COLOR_PICKER_ID}`, {
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
  });

  /**
   * init function
   * @param {CcPreviewBackgroundColorPresenter} presenter
   */
  const init = presenter => {
    backgroundColorPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setBackgroundColor(color)
    })
  }

  const setColor = color => {
    backgroundColorPicker.color.hex8String = color
  }

  const hide = () => {
    backgroundColorPicker.el.style.display = 'none'
  }

  const display = () => {
    backgroundColorPicker.el.style.display = 'block'
  }

  /**
   * is color picker displayed
   * @returns {boolean}
   */
  const isDisplay = () => {
    return backgroundColorPicker.el.style.display == 'block'
  }

  return {
    init,
    setColor,
    hide,
    display,
    isDisplay
  }
};
