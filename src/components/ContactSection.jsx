import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';
import '../utils/prism-vscode-theme.css';
import { applySyntaxHighlighting, createSyntaxHighlightingObserver, handleEnterKey } from '../utils/SyntaxHighlighter';

const ContactSection = () => {
  const [lineCount, setLineCount] = useState(30);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Initial markdown content
  const initialMarkdown = `# Get in Touch

Feel free to contact me if you have any questions, job opportunities, or just want to say hello!

## Contact Information

- **Email**: john@example.com
- **Phone**: +1 (555) 123-4567
- **Location**: San Francisco, CA

## Social Media

- [GitHub](https://github.com/johndoe)
- [LinkedIn](https://linkedin.com/in/johndoe)
- [Twitter](https://twitter.com/johndoe)

## Contact Form

Please use the form below to send me a message:

\`\`\`
Name: [Your Name]
Email: [Your Email]
Subject: [Subject]
Message: [Your Message]
\`\`\`

I will get back to you as soon as possible!
`;

  // Initialize editor with markdown
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = initialMarkdown;
      
      // Initial syntax highlighting
      applySyntaxHighlighting(editorRef.current, 'markdown');
      
      // Setup observer for real-time highlighting
      observerRef.current = createSyntaxHighlightingObserver(editorRef.current, 'markdown');
      observerRef.current.observe(editorRef.current, {
        characterData: true,
        childList: true,
        subtree: true
      });
    }
    
    // Count lines for line numbers
    const lines = initialMarkdown.split('\n').length;
    setLineCount(Math.max(30, lines + 10));
    
    // Cleanup observer on unmount
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.textContent;
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(30, lines + 10));
  };

  // Called after keydown to ensure cursor position is maintained
  const handleKeyUp = (e) => {
    // For certain keys, we may need to manually maintain cursor position
    if (e.key === 'Backspace' || e.key === 'Delete') {
      // Let the observer handle it via debounce
    }
  };

  // Handle key down for special key processing
  const handleKeyDown = (e) => {
    // Handle Enter key for line breaks
    if (handleEnterKey(e, editorRef, handleTextChange)) {
      return;
    }
    
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Insert a tab at cursor position
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      const tabNode = document.createTextNode('  ');
      range.insertNode(tabNode);
      
      // Move cursor after tab
      range.setStartAfter(tabNode);
      range.setEndAfter(tabNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      // Trigger the change event manually
      handleTextChange({ target: editorRef.current });
    }
  };

  return (
    <div className="editor-section markdown-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      
      <div className="markdown-body code-editor" ref={containerRef}>
        <div 
          ref={editorRef}
          className="code-editor-single language-markdown"
          contentEditable="true"
          onInput={handleTextChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          spellCheck="false"
          data-gramm="false"
          data-language="markdown"
        />
      </div>
    </div>
  );
};

export default ContactSection; 