/**
 * Obsidian-Style Callouts for Minimal Mistakes
 * 
 * This script converts Obsidian-style callout syntax in blockquotes
 * to styled HTML callout boxes.
 * 
 * Syntax: > [!type] Optional Title
 * Example: > [!note] This is important
 */

// Wait for the DOM to be fully loaded before processing
document.addEventListener('DOMContentLoaded', function() {

  /**
   * Lazy load the CSS file only when needed
   * This function checks if the CSS is already loaded to avoid duplicates
   */
  function loadCalloutCSS() {
    // Check if CSS is already loaded
    const existingLink = document.querySelector('link[href*="obsidian-callouts.css"]');
    if (existingLink) return; // Already loaded, skip
    
    // Create and inject the CSS link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/obsidian-callouts.css'; // Adjust path if needed
    document.head.appendChild(link);
  }

  const icons = {
    // ... existing icons ...
    note: '📒',
    info: 'ⓘ',
    example: '🧩',
    caution: '⚠️',
    abstract: '👉',
    faq: '❓',
    cite: '🔖',
    theory: '⚛️',
    
    // Your custom icons
    // Use emoji, Unicode symbols, or even HTML/SVG
    // star: '⭐'
  };

  // Find all blockquote elements in the document
  // These are what Markdown renders from > syntax
  const blockquotes = document.querySelectorAll('blockquote');
  
  blockquotes.forEach(blockquote => {
    // Get the first paragraph inside the blockquote
    // This is where the [!type] declaration should be
    const firstP = blockquote.querySelector('p:first-child');
    if (!firstP) return;  // Skip if no paragraph found
    
    // Get the text content of the first paragraph
    const text = firstP.innerHTML.trim();

    // Regular expression to match Obsidian callout syntax:
    // [!type] Optional Title
    // - \[!(\w+)\] : Matches [!word] and captures the type
    // - (.*) : Captures any remaining text as the title
    const calloutRegex = /^\[!(\w+)\](.*)$/i;
    const match = text.match(calloutRegex);
    
    // If this blockquote matches the callout syntax, convert it
    if (match) {
      // Lazy load CSS when any callout is found
      // The function checks internally if CSS is already loaded
      loadCalloutCSS();

      // Extract the callout type (e.g., "note", "warning")
      const type = match[1].toLowerCase();

      // Extract custom title, or use capitalized type as default
      // e.g., [!note] → "Note", [!note] Custom Title → "Custom Title"
      const title = match[2].trim() || type.charAt(0).toUpperCase() + type.slice(1);
      
      // Create the main callout container div
      const callout = document.createElement('div');
      callout.className = `callout callout-${type}`;
      
      // Create the title section (icon + text)
      const calloutTitle = document.createElement('div');
      calloutTitle.className = 'callout-title';
      
      // Create the icon element
      const icon = document.createElement('span');
      icon.className = 'callout-icon';
      icon.textContent = icons[type] || '📌';
      
      // Create the title text element
      const titleText = document.createElement('span');
      titleText.innerHTML = title;
      
      // Assemble the title (icon + text)
      calloutTitle.appendChild(icon);
      calloutTitle.appendChild(titleText);
      
      // Create the content container
      // This will hold all the remaining content from the blockquote
      const calloutContent = document.createElement('div');
      calloutContent.className = 'callout-content';
      
      // Remove the first paragraph since it contained the [!type] declaration
      // We don't need it in the final output
      firstP.remove();
      
      // Move all remaining content from blockquote to callout
      // This preserves all formatting, code blocks, lists, etc.
      while (blockquote.firstChild) {
        calloutContent.appendChild(blockquote.firstChild);
      }
      
      // Assemble the complete callout structure
      callout.appendChild(calloutTitle);
      callout.appendChild(calloutContent);
      
      // Replace the original blockquote with our new callout
      blockquote.parentNode.replaceChild(callout, blockquote);
    }
    // If no match, leave the blockquote as-is (normal blockquote)
  });

  /**
   * Optional: Re-apply syntax highlighting after DOM manipulation
   * Uncomment the section below if code blocks inside callouts lose highlighting
   */
  /*
  if (typeof Prism !== 'undefined') {
    // Re-run Prism syntax highlighting
    Prism.highlightAll();
  } else if (typeof hljs !== 'undefined') {
    // Re-run highlight.js syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
    });
  }
  */
});