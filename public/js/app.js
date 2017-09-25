// Label Color Change on Focus
// ---------------------------

var formElements = document.querySelectorAll('input, select, textarea');

function labelChange() {
  if (this.parentNode.classList.contains('focused')) {
    this.parentNode.classList.remove('focused');
  } else {
    this.parentNode.classList.add('focused');
  }
}

for (i=0; i < formElements.length; i++) {
  formElements[i].addEventListener('focus', labelChange);
  formElements[i].addEventListener('blur', labelChange);
}
