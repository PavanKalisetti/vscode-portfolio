import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';
import '../utils/prism-vscode-theme.css';
import { handleEnterKey, initializeEditor } from '../utils/SyntaxHighlighter';

const AboutSection = () => {
  const [lineCount, setLineCount] = useState(40);
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  // Initial markdown content
  const initialMarkdown = `# About Me

Hello! I'm a passionate frontend developer with expertise in building beautiful, responsive, and user-friendly web applications. With over 5 years of experience in the industry, I've worked on a variety of projects ranging from small business websites to large enterprise applications.

## Skills

- **Languages**: JavaScript (ES6+), TypeScript, HTML5, CSS3/SCSS
- **Frontend**: React, Vue.js, Next.js, Redux, Tailwind CSS
- **Backend**: Node.js, Express, Firebase
- **Tools**: Git, Webpack, Docker, VS Code
- **Design**: Figma, Adobe XD, Photoshop

## Experience

### Senior Frontend Developer @ Tech Solutions Inc.
*Jan 2020 - Present*

Leading the frontend development team, implementing best practices, and building scalable web applications using modern technologies.

### UI Developer @ Creative Digital
*Mar 2018 - Dec 2019*

Developed responsive websites and implemented complex UI components for various clients across different industries.

## Education

### BSc in Computer Science
*2014 - 2018*
University of Technology

## Features

This portfolio website includes a **Gemini AI Voice Assistant**. To use it:
1. Click on the AI icon in the Activity Bar (6th icon from the top)
2. Click "Start Listening" to speak to the AI
3. Ask any questions and get voice responses from Gemini AI
4. Click "Show System Prompt" to customize the AI's behavior with different instructions

## Contact

- Email: itspavan09@gmail.com
- GitHub: github.com/PavanKalisetti
- LinkedIn: https://www.linkedin.com/in/pavan-kalisetti-207b411b9/
- Twitter: @ungrad_engineer`;

  // Initialize editor with markdown
  useEffect(() => {
    // Use the new initializeEditor function for better initial setup
    initializeEditor(editorRef, initialMarkdown, 'markdown', observerRef, setLineCount);
    
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
    setLineCount(Math.max(40, lines + 10));
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

export default AboutSection;
