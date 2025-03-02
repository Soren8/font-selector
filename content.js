async function applyFont(font) {
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
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&family=Atkinson+Hyperlegible:wght@400&display=swap';
        document.head.appendChild(fontLink);
  
        // Wait briefly for the link to be processed
        await new Promise(resolve => setTimeout(resolve, 50));
      }
  
      // Force the font to load by using it in a temporary element
      const tempElement = document.createElement('span');
      tempElement.style.fontFamily = `"${font}"`;
      tempElement.style.position = 'absolute';
      tempElement.style.visibility = 'hidden';
      tempElement.textContent = 'Loading font...';
      document.body.appendChild(tempElement);
  
      // Wait until the font is loaded, with a timeout to avoid infinite loops
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait (50 * 100ms)
      while (!document.fonts.check(`12px "${font}"`) && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
  
      // Remove the temporary element
      document.body.removeChild(tempElement);
  
      // If font still isn't loaded, log an error (optional for debugging)
      if (attempts >= maxAttempts) {
        console.warn(`Font "${font}" failed to load within 5 seconds.`);
      }
    } else if (fontLink) {
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