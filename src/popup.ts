import { initializePopup } from './popup/PopupManager';

document.addEventListener('DOMContentLoaded', () => {
  initializePopup();
});



document.getElementById("enableCheckingButton")?.addEventListener("click", function () {
  const button = this;
  const checkBox = document.getElementById("enableChecking") as HTMLInputElement;
  if (button.classList.contains("off")) {
    button.classList.remove("off");
    button.classList.add("on");
    button.textContent = "ON";  // ボタンのテキストをONに変更
    checkBox.checked = true;
    console.log("ON");
  } else {
    button.classList.remove("on");
    button.classList.add("off");
    button.textContent = "OFF";  // ボタンのテキストをOFFに変更
    checkBox.checked = false;
    console.log("OFF");
  }
});