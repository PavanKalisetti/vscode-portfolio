import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const AboutSection = () => {
  const [lineCount, setLineCount] = useState(40);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

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

## Contact

- Email: john@example.com
- GitHub: github.com/johndoe
- LinkedIn: linkedin.com/in/johndoe
- Twitter: @johndoe`;

  // Initialize editor with markdown
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = initialMarkdown;
    }
    
    // Count lines for line numbers
    const lines = initialMarkdown.split('\n').length;
    setLineCount(Math.max(40, lines + 10));
  }, []);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.textContent;
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(40, lines + 10));
  };

  // Handle key down for tab insertion
  const handleKeyDown = (e) => {
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
          className="code-editor-single"
          contentEditable="true"
          onInput={handleTextChange}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          data-gramm="false"
        />
      </div>
    </div>
  );
};

export default AboutSection;
