import { ColorBgPresenter } from "./ColorBgPresenter.js";

export const COLOR_BG_PICKER_ID = 'color-bg-picker'

/**
 * @typedef {Object} ColorBgPicker
 * @property {(presenter: ColorBgPresenter) => void} init
 * @property {function} setColor
 * @property {function} display 
 * @property {function} hide
 * @property {function} isDisplay
 */

/**
 * CC Preview Background Color Picker Element
 * @param {*} iro
 * @returns {ColorBgPicker}
 */
export const ColorBgPicker = iro => {
  const colorBgPicker = getColorBgPicker(iro);

  const getColorBgPicker = iro => {
    return new iro.ColorPicker(`#${COLOR_BG_PICKER_ID}`, {
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
  };

  /**
   * init function
   * @param {ColorBgPresenter} presenter
   */
  const init = presenter => {
    colorBgPicker.on('color:change', _color => {
      const color = _color.hex8String
      presenter.setBackgroundColor(color)
    })
  }

  const setColor = color => {
    colorBgPicker.color.hex8String = color
  }

  const hide = () => {
    colorBgPicker.el.style.display = 'none'
  }

  const display = () => {
    colorBgPicker.el.style.display = 'block'
  }

  /**
   * is color picker displayed
   * @returns {boolean}
   */
  const isDisplay = () => {
    return colorBgPicker.el.style.display == 'block'
  }

  return {
    init,
    setColor,
    hide,
    display,
    isDisplay
  }
};
