const ccStatusExmaple = document.getElementById('cc-status-example');
const colorPicker1 = document.getElementById('color-picker1');
const colorPicker2 = document.getElementById('color-picker2');
const colorPickerWapper1 = document.getElementById('color-picker1-wapper');
const colorPickerWapper2 = document.getElementById('color-picker2-wapper');
const alphaPicker = document.getElementById('alpha-picker');
const tagSizeRange = document.getElementById('tag-size-range');
const langPicker = document.getElementById('lang-picker');
const combineRegionCheckbox = document.getElementById('combine-region-checkbox');

var Langs;

var AlphaHex = '99';

var AlphaPersentToHex = {
  "0": "00",
  "20": "33",
  "40": "66",
  "60": "99",
  "80": "CC",
  "100": "FF"
};

var TagFontSizes = ["1.0rem", "1.1rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.6rem"];

// utils

function rgbToRgba(rgb, a) {
  return '#'+rgb.substring(1).substring(0,7) + a;
}

// function reverseRbg(rbg) {
//   let dec = parseInt(rbg.substring(1), 16)^0xFFFFFF;
//   let hex = '#'+dec.toString(16);
//   while (rbg.length > hex.length) hex+='0';
//   return hex;
// }

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function sendMessage(message, callback) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message, callback);
    });
  });
}

// mains

function updateLangOptions() {
  var prevLang = langPicker.value;

  // Reset lang picker's options
  while (langPicker.firstChild)
    langPicker.removeChild(langPicker.firstChild);

  Langs.forEach(lang => {
    if (combineRegionCheckbox.checked && lang.code.includes('-')) return;

    var option = document.createElement("option");
    option.value = lang.code;
    option.textContent = lang.displayName;
    langPicker.appendChild(option);
  });

  langPicker.value = prevLang;
}

function initTagSizeRange() {
  tagSizeRange.min = 0;
  tagSizeRange.max = TagFontSizes.length-1;
  tagSizeRange.value = getKeyByValue("1.3rem");
}

function setLanguage(lang) {
  langPicker.value = lang;
  ccStatusExmaple.textContent = langPicker.value.toUpperCase()+' CC'
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_lang': lang }, () => {});
}

function setColor1(color1) {
  // input[type='color'] doesn't support alpha color,
  colorPicker1.value = color1.substring(0,7);
  colorPickerWapper1.style.background = color1.substring(0,7);
  
  alphaPicker.style.background = color1;
  ccStatusExmaple.style.background = color1;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_color1': color1 }, () => {});
}

function setColor2(color2) {
  colorPicker2.value = color2;
  colorPickerWapper2.style.background = color2;

  alphaPicker.style.color = color2;
  ccStatusExmaple.style.color = color2;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_color2': color2 }, () => {});
}

function setAlpha(alphaHex) {
  AlphaHex = alphaHex;
  alphaPicker.value = getKeyByValue(AlphaPersentToHex, alphaHex);
  // Get rgba
  let color1_rgba = rgbToRgba(colorPicker1.value, alphaHex);

  alphaPicker.style.background = color1_rgba;
  ccStatusExmaple.style.background = color1_rgba;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_color1': color1_rgba }, () => {});
}

function setTagFontSize(fontSize) {
  tagSizeRange.value = TagFontSizes.indexOf(fontSize);
  ccStatusExmaple.style.fontSize = `calc(${fontSize} - 0.4rem)`;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_tag-font-size': fontSize }, () => {});
}

function combineRegion(enable) {
  combineRegionCheckbox.checked = enable;
  if (enable)
    setLanguage(langPicker.value.split('-')[0]);

  updateLangOptions();
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_combine-region': enable }, () => {});
}
langPicker.onchange = () => {
  setLanguage(langPicker.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_lang': langPicker.value });
}

colorPicker1.onchange = () => {
  let color1_rgba = rgbToRgba(colorPicker1.value, AlphaHex);
  setColor1(color1_rgba);
  sendMessage({ 'YT-SUBTITLE-FILTER_color1': color1_rgba });
}
colorPicker1.oninput = () => {
  let color1_rgba = rgbToRgba(colorPicker1.value, AlphaHex);
  setColor1(color1_rgba);
  sendMessage({ 'YT-SUBTITLE-FILTER_color1': color1_rgba });
}
colorPicker2.onchange = () => { 
  setColor2(colorPicker2.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_color2': colorPicker2.value });
}
colorPicker2.oninput = () => {
  setColor2(colorPicker2.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_color2': colorPicker2.value });
}
alphaPicker.onclick = () => {
  let keys = Object.keys(AlphaPersentToHex);
  let keyIdx = keys.indexOf(alphaPicker.value);
  // next alpha value
  alphaPicker.value = keys[(keyIdx+1) % keys.length];

  setAlpha(AlphaPersentToHex[alphaPicker.value]);

  let rgba = rgbToRgba(colorPicker1.value, AlphaHex);
  sendMessage({ 'YT-SUBTITLE-FILTER_color1': rgba });
}

tagSizeRange.oninput = () => {
  let idx = tagSizeRange.value;
  setTagFontSize(TagFontSizes[idx]);
  sendMessage({ 'YT-SUBTITLE-FILTER_tag-font-size': TagFontSizes[idx] });
}

combineRegionCheckbox.onchange = () => {
  combineRegion(combineRegionCheckbox.checked);
  sendMessage({ 'YT-SUBTITLE-FILTER_combine-region': combineRegionCheckbox.checked });
}

(async () => {
  // dynamic import
  const src = chrome.runtime.getURL('js/lang.js');
  Langs = (await import(src)).langs;

  // init tag size range
  initTagSizeRange();
  
  // add langauge options
  updateLangOptions();

  // Load data
  chrome.storage.local.get([
    'YT-SUBTITLE-FILTER_lang',
    'YT-SUBTITLE-FILTER_color1', 
    'YT-SUBTITLE-FILTER_color2', 
    'YT-SUBTITLE-FILTER_tag-font-size',
    'YT-SUBTITLE-FILTER_combine-region',
  ], (items) => {
    setLanguage(items['YT-SUBTITLE-FILTER_lang'] || 'en');
    setColor1(items['YT-SUBTITLE-FILTER_color1'] || '#00000099');
    setColor2(items['YT-SUBTITLE-FILTER_color2'] || '#FFFFFF');
    setAlpha(items['YT-SUBTITLE-FILTER_color1'].substring(7,9) || '99');
    setTagFontSize(items['YT-SUBTITLE-FILTER_tag-font-size'] || TagFontSizes[3]);
    combineRegion(items['YT-SUBTITLE-FILTER_combine-region'] || true);
  });
})();