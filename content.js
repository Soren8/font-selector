function applyFont(font) {
    let style = document.getElementById('font-override-style');
    if (font === 'Off') {
      if (style) {
        style.remove(); // Remove the style tag if it exists
      }
      return;
    }
    if (!style) {
      style = document.createElement('style');
      style.id = 'font-override-style';
      document.head.appendChild(style);
    }
    style.innerHTML = `body { font-family: "${font}" !important; }`;
  }
  
  // Apply the font on page load
  chrome.storage.sync.get('selectedFont', function(data) {
    const font = data.selectedFont || 'Off';
    applyFont(font);
  });
  
  // Listen for storage changes and update the font dynamically
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.selectedFont) {
      applyFont(changes.selectedFont.newValue);
    }
  });