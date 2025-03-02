document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('font-select');
  
    // Load the current font from storage, defaulting to Times New Roman
    chrome.storage.sync.get('selectedFont', function(data) {
      select.value = data.selectedFont || 'Times New Roman';
    });
  
    // Save the new selection to storage when the user chooses a font
    select.addEventListener('change', function() {
      const font = select.value;
      chrome.storage.sync.set({ selectedFont: font });
    });
  });