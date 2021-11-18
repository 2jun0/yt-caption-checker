const mainDiv = document.getElementById('main');
const ccStatusExmaple = document.getElementById('cc-status-example');
const color1Display = document.getElementById('color1-display');
const color2Display = document.getElementById('color2-display');
const alphaPicker = document.getElementById('alpha-picker');
const tagSizeRange = document.getElementById('tag-size-range');
const langPicker = document.getElementById('lang-picker');
const combineRegionCheckbox = document.getElementById('combine-region-checkbox');
const color1Picker = new iro.ColorPicker('#color1-picker', {
  width: 195,
  borderWidth: 1,
  borderColor: '#B0B0B0',
  margin: 5,
  layout: [
    { 
      component: iro.ui.Box,
      options: { boxHeight: 100 }
    },
    { 
      component: iro.ui.Slider,
      options: { sliderType: 'hue' }
    },
    { 
      component: iro.ui.Slider,
      options: { sliderType: 'alpha' }
    },
  ]
});
const color2Picker = new iro.ColorPicker('#color2-picker', {
  width: 195,
  borderWidth: 1,
  borderColor: '#B0B0B0',
  margin: 5,
  layout: [
    { 
      component: iro.ui.Box,
      options: { boxHeight: 100 }
    },
    { 
      component: iro.ui.Slider,
      options: { sliderType: 'hue' }
    },
  ]
});

var Langs;
var TagFontSizes = ["1.0rem", "1.1rem", "1.2rem", "1.3rem", "1.4rem", "1.5rem", "1.6rem"];

// utils

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

function setColor1(color1, setColorPickerable = true) {
  if(setColorPickerable) color1Picker.color.hex8String = color1;
  color1Display.style.background = color1;
  
  ccStatusExmaple.style.background = color1;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_color1': color1 }, () => {});
}

function setColor2(color2, setColorPickerable = true) {
  if(setColorPickerable) color2Picker.color.hexString = color2;
  color2Display.style.background = color2;

  ccStatusExmaple.style.color = color2;
  // Save data
  chrome.storage.local.set({ 'YT-SUBTITLE-FILTER_color2': color2 }, () => {});
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

color1Display.onclick = () => {;
  if (color1Picker.el.style.display == 'none') color1Picker.el.style.display = 'block';
  else color1Picker.el.style.display = 'none';
};
color2Display.onclick = () => {
  if (color2Picker.el.style.display == 'none') color2Picker.el.style.display = 'block';
  else color2Picker.el.style.display = 'none';
};

mainDiv.onclick = (e) => {
  if (!['color1-picker', 'color1-display'].includes(e.target.id))
    color1Picker.el.style.display = 'none';
  if (!['color2-picker', 'color2-display'].includes(e.target.id))
    color2Picker.el.style.display = 'none';
}

color1Picker.on("color:change", (color) => {
  setColor1(color.hex8String, false);
  sendMessage({ 'YT-SUBTITLE-FILTER_color1': color.hex8String });
});
color2Picker.on("color:change", (color) => {
  setColor2(color.hexString, false);
  sendMessage({ 'YT-SUBTITLE-FILTER_color2': color.hexString });
});

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
    setTagFontSize(items['YT-SUBTITLE-FILTER_tag-font-size'] || TagFontSizes[3]);
    combineRegion('YT-SUBTITLE-FILTER_combine-region' in items ? items['YT-SUBTITLE-FILTER_combine-region'] : true);
  });
})();