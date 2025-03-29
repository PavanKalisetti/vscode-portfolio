import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markup';

// Initialize Prism to ensure it's ready to use
Prism.manual = true;

// Force Prism to load and be ready
document.addEventListener('DOMContentLoaded', () => {
  // Pre-load Prism languages to ensure they're available immediately
  Prism.languages.markdown = Prism.languages.markdown || {};
  Prism.languages.json = Prism.languages.json || {};
  Prism.languages.markup = Prism.languages.markup || {};
});

/**
 * Get caret position within a contentEditable element
 * @param {Element} element The contentEditable element
 * @returns {Object} The caret position info
 */
function getCaretPosition(element) {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return null;
  
  const range = selection.getRangeAt(0);
  const preCaretRange = range.cloneRange();
  preCaretRange.selectNodeContents(element);
  preCaretRange.setEnd(range.endContainer, range.endOffset);
  
  return {
    start: preCaretRange.toString().length,
    text: element.textContent,
    container: range.endContainer,
    offset: range.endOffset
  };
}

/**
 * Set caret position within a contentEditable element
 * 
 * @param {Element} element The contentEditable element
 * @param {number} position The target character position
 * @returns {boolean} Success status
 */
function setCaretPosition(element, position) {
  // If position is after the last character
  if (position >= element.textContent.length) {
    const lastNode = getLastTextNode(element);
    if (lastNode) {
      const range = document.createRange();
      range.setStart(lastNode, lastNode.length);
      range.setEnd(lastNode, lastNode.length);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
    return false;
  }
  
  const nodes = getTextNodesIn(element);
  let charCount = 0;
  let i = 0;
  
  for (; i < nodes.length; i++) {
    const node = nodes[i];
    const nextCharCount = charCount + node.length;
    
    if (position <= nextCharCount) {
      const range = document.createRange();
      range.setStart(node, position - charCount);
      range.setEnd(node, position - charCount);
      
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return true;
    }
    
    charCount = nextCharCount;
  }
  
  return false;
}

/**
 * Get all text nodes within an element
 * 
 * @param {Element} element The container element
 * @returns {Array} Array of text nodes
 */
function getTextNodesIn(element) {
  const textNodes = [];
  
  function getTextNodes(node) {
    if (node.nodeType === 3) {
      textNodes.push(node);
    } else {
      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        getTextNodes(children[i]);
      }
    }
  }
  
  getTextNodes(element);
  return textNodes;
}

/**
 * Get the last text node within an element
 * 
 * @param {Element} element The container element
 * @returns {Node|null} The last text node or null
 */
function getLastTextNode(element) {
  const nodes = getTextNodesIn(element);
  return nodes.length > 0 ? nodes[nodes.length - 1] : null;
}

/**
 * Applies syntax highlighting to the provided contentEditable element
 * without affecting cursor position or selection
 * 
 * @param {HTMLElement} element - The contentEditable div containing text to highlight
 * @param {string} language - The language to use for highlighting (markdown, json, html)
 */
export const applySyntaxHighlighting = (element, language) => {
  if (!element) return;
  
  // Save current caret position if element is focused
  let caretPosition = null;
  if (document.activeElement === element) {
    caretPosition = getCaretPosition(element);
  }
  
  // Get the raw text
  const text = element.textContent || '';
  if (!text.trim()) return; // Don't process empty content
  
  let html = '';
  
  // Replace line breaks with a marker we can restore later
  const textWithLineBreaks = text.replace(/(\r\n|\n|\r)/g, '\n');
  
  // Apply appropriate syntax highlighting based on language
  try {
    switch (language) {
      case 'markdown':
        html = Prism.highlight(textWithLineBreaks, Prism.languages.markdown, 'markdown');
        break;
      case 'json':
        html = Prism.highlight(textWithLineBreaks, Prism.languages.json, 'json');
        break;
      case 'html':
        html = Prism.highlight(textWithLineBreaks, Prism.languages.markup, 'html');
        break;
      default:
        html = textWithLineBreaks; // No highlighting if language not supported
    }
  } catch (e) {
    console.error("Error during syntax highlighting:", e);
    html = textWithLineBreaks; // Fallback to plain text on error
  }
  
  // Apply the highlighted HTML to the element
  element.innerHTML = html;
  
  // Restore caret position if we had one saved
  if (caretPosition) {
    try {
      setCaretPosition(element, caretPosition.start);
    } catch (e) {
      console.error("Could not restore cursor position:", e);
    }
  }
};

// Debounce function to limit how often highlighting is applied
const debounce = (func, delay) => {
  let timerId;
  return function(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = null;
    }, delay);
  };
};

/**
 * Create a MutationObserver that will apply syntax highlighting
 * when the content of the element changes, with debouncing
 * 
 * @param {HTMLElement} element - The contentEditable div to observe
 * @param {string} language - The language to use for highlighting
 * @returns {MutationObserver} - The observer instance
 */
export const createSyntaxHighlightingObserver = (element, language) => {
  // Debounced version of applySyntaxHighlighting
  const debouncedHighlight = debounce((el, lang) => {
    applySyntaxHighlighting(el, lang);
  }, 100); // 100ms debounce
  
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    // Check if the mutations are relevant for highlighting
    for (const mutation of mutations) {
      if (mutation.type === 'characterData' || 
          mutation.type === 'childList' ||
          (mutation.type === 'attributes' && mutation.attributeName === 'textContent')) {
        shouldUpdate = true;
        break;
      }
    }
    
    if (shouldUpdate) {
      // Disconnect temporarily to avoid infinite loops
      observer.disconnect();
      
      // Apply highlighting with debouncing
      debouncedHighlight(element, language);
      
      // Reconnect the observer
      observer.observe(element, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }
  });
  
  return observer;
};

/**
 * Initialize the editor with content and apply syntax highlighting
 * This function ensures syntax highlighting is applied immediately after content is set
 * 
 * @param {HTMLElement} editorRef - Reference to the editor element
 * @param {string} initialContent - The initial content to set
 * @param {string} language - The language for syntax highlighting
 * @param {Function} observerRef - Reference to store the created observer
 * @param {Function} setLineCount - Function to update line count
 * @returns {void}
 */
export const initializeEditor = (editorRef, initialContent, language, observerRef, setLineCount) => {
  if (!editorRef || !editorRef.current) return;
  
  // Set the initial content
  editorRef.current.textContent = initialContent;
  
  // Force a small delay to ensure the DOM is updated before applying highlighting
  setTimeout(() => {
    // Apply initial syntax highlighting
    applySyntaxHighlighting(editorRef.current, language);
    
    // Setup observer for real-time highlighting
    if (observerRef && typeof observerRef === 'object') {
      observerRef.current = createSyntaxHighlightingObserver(editorRef.current, language);
      observerRef.current.observe(editorRef.current, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }
    
    // Update line count if setLineCount function is provided
    if (setLineCount && typeof setLineCount === 'function') {
      const lines = initialContent.split('\n').length;
      setLineCount(Math.max(lines + 10, 30));
    }
  }, 50);
};

// Add a helper function to handle Enter key press
export const handleEnterKey = (e, editorRef, textChangeHandler) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    
    // Get selection
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    
    // Create a new text node with a line break
    const lineBreak = document.createTextNode('\n');
    range.insertNode(lineBreak);
    
    // Move the cursor after the inserted line break
    range.setStartAfter(lineBreak);
    range.setEndAfter(lineBreak);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger text change handler
    if (textChangeHandler && editorRef.current) {
      textChangeHandler({ target: editorRef.current });
    }
    
    return true;
  }
  
  return false;
};

export default {
  applySyntaxHighlighting,
  createSyntaxHighlightingObserver,
  handleEnterKey,
  initializeEditor
};