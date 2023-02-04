import { CcTagTextColorPresenter } from "./CcTagTextColorPresenter.js";

export const CC_PREVIEW_TEXT_COLOR_PICKER_ID = 'color-txt-picker'

/**
 * @typedef {Object} CcTagTextColorPicker
 * @property {(presenter: CcTagTextColorPresenter) => void} init
 * @property {function} setColor
 * @property {function} display 
 * @property {function} hide
 * @property {function} isDisplay
 */

/**
 * CC Tag Text Color Picker Element
 * @param {*} iro 
 * @returns {CcTagTextColorPicker}
 */
export const CcTagTextColorPicker = iro => {
  const textColorPicker = new iro.ColorPicker(`#${CC_PREVIEW_TEXT_COLOR_PICKER_ID}`, {
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
  });

  /**
   * init function
   * @param {CcTagTextColorPresenter} presenter 
   */
  const init = presenter => {
    textColorPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setTextColor(color)
    })
  }  

  const setColor = color => {
    textColorPicker.color.hexString = color
  }

  const hide = () => {
    textColorPicker.el.style.display = 'none'
  }

  const display = () => {
    textColorPicker.el.style.display = 'block'
  }

  /**
   * is color picker displayed
   * @returns {boolean}
   */
  const isDisplay = () => {
    return textColorPicker.el.style.display == 'block'
  }

  return {
    init,
    setColor,
    hide,
    display,
    isDisplay
  }
};
