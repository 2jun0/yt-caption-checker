import { ColorTxtPresenter } from "./ColorTxtPresenter.js";

export const COLOR_TXT_PICKER_ID = 'color-txt-picker'

/**
 * @typedef {Object} ColorTxtPicker
 * @property {(presenter: ColorTxtPresenter) => void} init
 * @property {function} setColor
 * @property {function} display 
 * @property {function} hide
 * @property {function} isDisplay
 */

/**
 * CC Preview Text Color Picker Element
 * @param {*} iro 
 * @returns {ColorTxtPicker}
 */
export const ColorTxtPicker = iro => {
  const colorTxtPicker = new iro.ColorPicker(`#${COLOR_TXT_PICKER_ID}`, {
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
   * @param {ColorTxtPresenter} presenter 
   */
  const init = presenter => {
    colorTxtPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setTextColor(color)
    })
  }  

  const setColor = color => {
    colorTxtPicker.color.hexString = color
  }

  const hide = () => {
    colorTxtPicker.el.style.display = 'none'
  }

  const display = () => {
    colorTxtPicker.el.style.display = 'block'
  }

  /**
   * is color picker displayed
   * @returns {boolean}
   */
  const isDisplay = () => {
    return colorTxtPicker.el.style.display == 'block'
  }

  return {
    init,
    setColor,
    hide,
    display,
    isDisplay
  }
};
