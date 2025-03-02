function applyFont(font) {
    let style = document.getElementById('font-override-style');
    let fontLink = document.getElementById('font-override-link');
  
    // If "Off" is selected, remove the style and font link
    if (font === 'Off') {
      if (style) style.remove();
      if (fontLink) fontLink.remove();
      return;
    }
  
    // List of fonts that require loading from Google Fonts
    const googleFonts = ['JetBrains Mono', 'Atkinson Hyperlegible'];
  
    // Load Google Fonts if the selected font is in the list
    if (googleFonts.includes(font)) {
      if (!fontLink) {
        fontLink = document.createElement('link');
        fontLink.id = 'font-override-link';
        fontLink.rel = 'stylesheet';
        // Load both JetBrains Mono and Atkinson Hyperlegible
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Atkinson+Hyperlegible:wght@400&display=swap';
        document.head.appendChild(fontLink);
      }
    } else if (fontLink) {
      // Remove the font link if a system font is selected
      fontLink.remove();
    }
  
    // Remove any existing style to avoid conflicts
    if (style) style.remove();
  
    // Create a new style to apply the font universally
    style = document.createElement('style');
    style.id = 'font-override-style';
    style.innerHTML = `* { font-family: "${font}" !important; }`;
    document.head.appendChild(style);
  }
  
  // Apply the font when the page loads
  chrome.storage.sync.get('selectedFont', function(data) {
    const font = data.selectedFont || 'Off';
    applyFont(font);
  });
  
  // Listen for font changes from the extension popup
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.selectedFont) {
      applyFont(changes.selectedFont.newValue);
    }
  });