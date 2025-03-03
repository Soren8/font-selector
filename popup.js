document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('font-select');
  const decreaseBtn = document.getElementById('decrease-size');
  const increaseBtn = document.getElementById('increase-size');
  const resetBtn = document.getElementById('reset-size');
  const sizeDisplay = document.getElementById('size-display');
  
  // Default font size percentage
  const DEFAULT_SIZE = 100;
  // Step size for increase/decrease (in percentage)
  const STEP_SIZE = 10;
  
  // Load the current font and size from storage
  chrome.storage.sync.get(['selectedFont', 'fontSize'], function(data) {
    select.value = data.selectedFont || 'Off';
    
    // Set the font size display
    const fontSize = data.fontSize || DEFAULT_SIZE;
    sizeDisplay.textContent = fontSize + '%';
  });
  
  // Save the new selection to storage when the user chooses a font
  select.addEventListener('change', function() {
    const font = select.value;
    chrome.storage.sync.set({ selectedFont: font });
  });
  
  // Font size decrease button
  decreaseBtn.addEventListener('click', function() {
    chrome.storage.sync.get('fontSize', function(data) {
      const currentSize = data.fontSize || DEFAULT_SIZE;
      const newSize = Math.max(50, currentSize - STEP_SIZE); // Minimum 50%
      
      sizeDisplay.textContent = newSize + '%';
      chrome.storage.sync.set({ fontSize: newSize });
    });
  });
  
  // Font size increase button
  increaseBtn.addEventListener('click', function() {
    chrome.storage.sync.get('fontSize', function(data) {
      const currentSize = data.fontSize || DEFAULT_SIZE;
      const newSize = Math.min(200, currentSize + STEP_SIZE); // Maximum 200%
      
      sizeDisplay.textContent = newSize + '%';
      chrome.storage.sync.set({ fontSize: newSize });
    });
  });
  
  // Reset font size button
  resetBtn.addEventListener('click', function() {
    sizeDisplay.textContent = DEFAULT_SIZE + '%';
    chrome.storage.sync.set({ fontSize: DEFAULT_SIZE });
  });
});