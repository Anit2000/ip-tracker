let inputs = document.querySelectorAll('input[name="color-mode"]');
function setTheme() {
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? (document.body.dataset.mode = "dark")
    : (document.body.dataset.mode = "light");
}
inputs.forEach((el) => {
  el.addEventListener("change", function () {
    this.checked ? (document.body.dataset.mode = this.value) : "";
  });
});
setTheme();
