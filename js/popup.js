const ccStatusExmaple = document.getElementById('cc-status-example');
const colorPicker1 = document.getElementById('color-picker1');
const colorPicker2 = document.getElementById('color-picker2');
const colorPickerWapper1 = document.getElementById('color-picker1-wapper');
const colorPickerWapper2 = document.getElementById('color-picker2-wapper');
const langPicker = document.getElementById('lang-picker');
const combineRegionCheckbox = document.getElementById('combine-region-checkbox');

var langs;

function sendMessage(message, callback) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message, callback);
    });
  });
}

function updateLangOptions() {
  var prevLang = langPicker.value;

  // Reset lang picker's options
  while (langPicker.firstChild)
    langPicker.removeChild(langPicker.firstChild);

  langs.forEach(lang => {
    if (combineRegionCheckbox.checked && lang.code.includes('-')) return;

    var option = document.createElement("option");
    option.value = lang.code;
    option.textContent = lang.displayName;
    langPicker.appendChild(option);
  });

  langPicker.value = prevLang;
}

function setLanguage(lang) {
  langPicker.value = lang;
  ccStatusExmaple.textContent = langPicker.value.toUpperCase()+' CC'
  // Save data
  chrome.storage.sync.set({ 'YT-SUBTITLE-FILTER_lang': lang }, () => {});
}

function setColor1(color1) {
  colorPicker1.value = color1;
  colorPickerWapper1.style.background = color1;
  ccStatusExmaple.style.background = color1;
  // Save data
  chrome.storage.sync.set({ 'YT-SUBTITLE-FILTER_color1': color1 }, () => {});
}

function setColor2(color2) {
  colorPicker2.value = color2;
  colorPickerWapper2.style.background = color2;
  ccStatusExmaple.style.color = color2;
  // Save data
  chrome.storage.sync.set({ 'YT-SUBTITLE-FILTER_color2': color2 }, () => {});
}

function combineRegion(enable) {
  combineRegionCheckbox.checked = enable;
  if (enable)
    setLanguage(langPicker.value.split('-')[0]);

  updateLangOptions();
  chrome.storage.sync.set({ 'YT-SUBTITLE-FILTER_combine-region': enable }, () => {});
}

langPicker.onchange = () => {
  setLanguage(langPicker.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_lang': langPicker.value });
}
colorPicker1.onchange = () => { 
  setColor1(colorPicker1.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_color1': colorPicker1.value });
}
colorPicker2.onchange = () => { 
  setColor2(colorPicker2.value);
  sendMessage({ 'YT-SUBTITLE-FILTER_color2': colorPicker2.value });
}
combineRegionCheckbox.onchange = () => {
  combineRegion(combineRegionCheckbox.checked);
  sendMessage({ 'YT-SUBTITLE-FILTER_combine-region': combineRegionCheckbox.checked });
}

(async () => {
  // dynamic import
  const src = chrome.runtime.getURL('js/lang.js');
  langs = (await import(src)).langs;
  
  // add langauge options
  updateLangOptions();

  // Load data
  chrome.storage.sync.get(['YT-SUBTITLE-FILTER_lang', 'YT-SUBTITLE-FILTER_color1', 'YT-SUBTITLE-FILTER_color2', 'YT-SUBTITLE-FILTER_combine-region'], (items) => {
    setLanguage(items['YT-SUBTITLE-FILTER_lang'] || 'en');
    setColor1(items['YT-SUBTITLE-FILTER_color1'] || '#008000');
    setColor2(items['YT-SUBTITLE-FILTER_color2'] || '#ffffff');
    combineRegion(items['YT-SUBTITLE-FILTER_combine-region'] || false);
  });
})();