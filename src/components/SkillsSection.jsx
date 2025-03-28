import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const SkillsSection = () => {
  const [lineCount, setLineCount] = useState(50);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Initial HTML content
  const initialHtml = `<!DOCTYPE html>
<html>
<head>
  <title>My Skills</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <section class="skills-section">
      <h1>My Technical Skills</h1>
      
      <div class="skills-container">
        <h2>Frontend Development</h2>
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">React</span>
            <span class="skill-percentage">90%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="width:90%"></div>
          </div>
        </div>
        
        <h2>Backend Development</h2>
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">Node.js</span>
            <span class="skill-percentage">80%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="width:80%"></div>
          </div>
        </div>
        
        <h2>Other Skills</h2>
        <div class="skill-item">
          <div class="skill-info">
            <span class="skill-name">Git/GitHub</span>
            <span class="skill-percentage">90%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="width:90%"></div>
          </div>
        </div>
      </div>
      
    </section>
  </div>
  
  <script src="skills.js"></script>
</body>
</html>`;

  // Initialize editor with HTML
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.textContent = initialHtml;
    }
    
    // Count lines for line numbers
    const lines = initialHtml.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
  }, []);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.textContent;
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
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
    <div className="editor-section html-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      
      <div className="html-body" ref={containerRef}>
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

export default SkillsSection; 