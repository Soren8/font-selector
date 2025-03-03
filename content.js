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

async function applyFontAndSize(font, fontSize) {
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
  
  // Create CSS for font family and size
  let css = '';
  
  // Add font-family if a font is selected
  if (font !== 'Off') {
    css += `* { font-family: "${font}" !important; }\n`;
  }
  
  // Add font-size adjustments
  if (fontSize && fontSize !== 100) {
    // Calculate the size adjustment
    const adjustedSize = `${fontSize}%`;
    
    // Apply a simple, direct approach that works well in practice
    css += `
      /* Set the base font size on the root element */
      html {
        font-size: ${adjustedSize} !important;
      }
      
      /* Keep form controls at a reasonable size */
      input, select, textarea, button {
        font-size: 1rem !important;
      }
    `;
  }
  
  // Create a new style to apply the font universally
  style = document.createElement('style');
  style.id = 'font-override-style';
  style.innerHTML = css;
  document.head.appendChild(style);
}
  
  // Apply the font and size when the page loads
  chrome.storage.sync.get(['selectedFont', 'fontSize'], async function(data) {
    const font = data.selectedFont || 'Atkinson Hyperlegible'; // Default font
    const fontSize = data.fontSize || 100; // Default font size
    await applyFontAndSize(font, fontSize);
  });
  
  // Listen for font or font size changes from the extension popup
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    // If either font or font size changes, reapply both
    if (changes.selectedFont || changes.fontSize) {
      chrome.storage.sync.get(['selectedFont', 'fontSize'], function(data) {
        const font = data.selectedFont || 'Atkinson Hyperlegible';
        const fontSize = data.fontSize || 100;
        applyFontAndSize(font, fontSize);
      });
    }
  });