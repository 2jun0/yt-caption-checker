import { localize } from './utils/common.js'
import {
  FIELD_COLOR_BG,
  FIELD_COLOR_TXT,
  FIELD_TAG_FONT_SIZE,
  FIELD_COMBINE_REGION,
  FIELD_LANG,
  loadData,
  saveData,
} from './utils/storage.js'
import { langs } from './utils/lang.js'

const iro = window.iro

localize()

const mainDiv = document.getElementById('main')
const ccStatusExmaple = document.getElementById('cc-status-example')
const colorBgDisplay = document.getElementById('color-bg-display')
const colorTxtDisplay = document.getElementById('color-txt-display')
const tagSizeRange = document.getElementById('tag-size-range')
const langPicker = document.getElementById('lang-picker')
const combineRegionCheckbox = document.getElementById('combine-region-checkbox')
const colorBgPicker = new iro.ColorPicker('#color-bg-picker', {
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
})
const colorTxtPicker = new iro.ColorPicker('#color-txt-picker', {
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
})

var TagFontSizes = [
  '1.0rem',
  '1.1rem',
  '1.2rem',
  '1.3rem',
  '1.4rem',
  '1.5rem',
  '1.6rem',
]

// utils

const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

const sendMessage = async (key, value) => {
  const tabs = await chrome.tabs.query({
    active: true,
  })

  tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { [key]: value }).catch(e => {})
  })
}

// mains

const updateLangOptions = () => {
  var prevLang = langPicker.value

  // Reset lang picker's options
  while (langPicker.firstChild) langPicker.removeChild(langPicker.firstChild)

  langs.forEach(lang => {
    if (combineRegionCheckbox.checked && lang.code.includes('-')) return

    var option = document.createElement('option')
    option.value = lang.code
    option.textContent = lang.displayName
    langPicker.appendChild(option)
  })

  langPicker.value = prevLang
}

const initTagSizeRange = () => {
  tagSizeRange.min = 0
  tagSizeRange.max = TagFontSizes.length - 1
  tagSizeRange.value = getKeyByValue('1.3rem')
}

const setLanguage = lang => {
  langPicker.value = lang
  ccStatusExmaple.textContent = langPicker.value.toUpperCase() + ' CC'

  saveData(FIELD_LANG, lang)
}

const setColorBg = (colorBg, setColorPickerable = true) => {
  if (setColorPickerable) colorBgPicker.color.hex8String = colorBg
  colorBgDisplay.style.background = colorBg

  ccStatusExmaple.style.background = colorBg
  // Save data
  saveData(FIELD_COLOR_BG, colorBg)
}

const setColorTxt = (colorTxt, setColorPickerable = true) => {
  if (setColorPickerable) colorTxtPicker.color.hexString = colorTxt
  colorTxtDisplay.style.background = colorTxt

  ccStatusExmaple.style.color = colorTxt
  // Save data
  saveData(FIELD_COLOR_TXT, colorTxt)
}

const setTagFontSize = fontSize => {
  tagSizeRange.value = TagFontSizes.indexOf(fontSize)
  ccStatusExmaple.style.fontSize = `calc(${fontSize} - 0.4rem)`
  // Save data
  saveData(FIELD_TAG_FONT_SIZE, fontSize)
}

const combineRegion = enable => {
  combineRegionCheckbox.checked = enable
  if (enable) setLanguage(langPicker.value.split('-')[0])

  updateLangOptions()
  saveData(FIELD_COMBINE_REGION, enable)
}
langPicker.onchange = () => {
  setLanguage(langPicker.value)
  sendMessage(FIELD_LANG, langPicker.value)
}

colorBgDisplay.onclick = () => {
  if (colorBgPicker.el.style.display == 'none')
    colorBgPicker.el.style.display = 'block'
  else colorBgPicker.el.style.display = 'none'
}
colorTxtDisplay.onclick = () => {
  if (colorTxtPicker.el.style.display == 'none')
    colorTxtPicker.el.style.display = 'block'
  else colorTxtPicker.el.style.display = 'none'
}

mainDiv.onclick = e => {
  if (!['color-bg-picker', 'color-bg-display'].includes(e.target.id))
    colorBgPicker.el.style.display = 'none'
  if (!['color-txt-picker', 'color-txt-display'].includes(e.target.id))
    colorTxtPicker.el.style.display = 'none'
}

colorBgPicker.on('color:change', color => {
  setColorBg(color.hex8String, false)
  sendMessage(FIELD_COLOR_BG, color.hex8String)
})
colorTxtPicker.on('color:change', color => {
  setColorTxt(color.hexString, false)
  sendMessage(FIELD_COLOR_TXT, color.hexString)
})

tagSizeRange.oninput = () => {
  let idx = tagSizeRange.value
  setTagFontSize(TagFontSizes[idx])
  sendMessage(FIELD_TAG_FONT_SIZE, TagFontSizes[idx])
}

combineRegionCheckbox.onchange = () => {
  combineRegion(combineRegionCheckbox.checked)
  sendMessage(FIELD_COMBINE_REGION, combineRegionCheckbox.checked)
}

// init tag size range
initTagSizeRange()

// add langauge options
updateLangOptions()

// Load data
loadData(
  [
    FIELD_LANG,
    FIELD_COLOR_BG,
    FIELD_COLOR_TXT,
    FIELD_TAG_FONT_SIZE,
    FIELD_COMBINE_REGION,
  ],
  items => {
    setLanguage(items[FIELD_LANG])
    setColorBg(items[FIELD_COLOR_BG])
    setColorTxt(items[FIELD_COLOR_TXT])
    setTagFontSize(items[FIELD_TAG_FONT_SIZE])
    combineRegion(items[FIELD_COMBINE_REGION])
  },
)
