# Font Selector Extension Guidelines

## Project Overview
A Chrome extension that allows users to change the font of web pages.

## Commands
- No build system required - this is a simple browser extension
- To test: Load as an unpacked extension in Chrome's developer mode
- To reload extension: Click refresh icon in chrome://extensions

## Code Style
- Indentation: 2 spaces
- Variables: Use camelCase
- Declarations: Prefer `const` over `let` where possible, avoid `var`
- Default values: Use logical OR (`||`) for defaults
- Async: Use async/await pattern with Promise for timing operations
- Error handling: Log to console.warn for non-critical errors
- CSS: Use specific selectors with a clear hierarchy
- Comments: Use comments to explain sections of functionality

## Extension Structure
- manifest.json: Extension configuration
- popup.html/js: UI for font selection
- content.js: Content script that modifies webpage fonts
- fonts.css: Font definitions and imports

Default font: Atkinson Hyperlegible