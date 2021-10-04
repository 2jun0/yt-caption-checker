// toggle mute ad
const ccStatusExmaple = document.getElementById('cc-status-example');
const colorPicker1 = document.getElementById('color-picker1');
const colorPicker2 = document.getElementById('color-picker2');
const colorPickerWapper1 = document.getElementById('color-picker1-wapper');
const colorPickerWapper2 = document.getElementById('color-picker2-wapper');
const langPicker = document.getElementById('lang-picker');

colorPicker1.onchange = () => { 
  colorPickerWapper1.style.background = colorPicker1.value;
  ccStatusExmaple.style.background = colorPicker1.value;
}
colorPicker2.onchange = () => { 
  colorPickerWapper2.style.background = colorPicker2.value;
  ccStatusExmaple.style.color = colorPicker2.value;
}

colorPicker1.value = '#008000';
colorPicker1.onchange();

colorPicker2.value = '#ffffff';
colorPicker2.onchange();

langPicker.appendChild(
  
)