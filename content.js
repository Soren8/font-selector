// Immediately inject our font CSS when content script loads
function injectFontCSS() {
  // Create link to our fonts.css
  const fontLink = document.createElement('link');
  fontLink.id = 'font-override-link';
  fontLink.rel = 'stylesheet';
  
  // Get the URL to our CSS file from the extension
  fontLink.href = chrome.runtime.getURL('fonts.css');
  
  // Add to head immediately, before page fully loads
  document.documentElement.appendChild(fontLink);
}

// Call immediately when script loads
injectFontCSS();

async function applyFont(font) {
  let style = document.getElementById('font-override-style');
  
  // If "Off" is selected, remove the style
  if (font === 'Off') {
    if (style) style.remove();
    return;
  }
  
  // List of custom bundled fonts
  const customFonts = ['JetBrains Mono', 'Atkinson Hyperlegible'];
  
  // For custom fonts, ensure they're ready before applying
  if (customFonts.includes(font)) {
    try {
      // Create a temporary element to force font loading
      const tempElement = document.createElement('span');
      tempElement.style.fontFamily = `"${font}"`;
      tempElement.style.position = 'absolute';
      tempElement.style.opacity = '0';
      tempElement.textContent = 'Font loading';
      document.body.appendChild(tempElement);
      
      // Use FontFace.load() promise to wait for font
      await document.fonts.ready;
      
      // Clean up temp element
      document.body.removeChild(tempElement);
    } catch (e) {
      console.warn(`Error loading font "${font}":`, e);
    }
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
  chrome.storage.sync.get('selectedFont', async function(data) {
    const font = data.selectedFont || 'Atkinson Hyperlegible'; // Default font
    await applyFont(font);
  });
  
  // Listen for font changes from the extension popup
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.selectedFont) {
      applyFont(changes.selectedFont.newValue);
    }
  });