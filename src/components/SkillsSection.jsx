import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const SkillsSection = () => {
  const [htmlText, setHtmlText] = useState('');
  const [lineCount, setLineCount] = useState(50);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
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
    setHtmlText(initialHtml);
    
    // Count lines for line numbers
    const lines = initialHtml.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
  }, []);

  // Sync scrolling between textarea and highlight div
  useEffect(() => {
    const syncScroll = () => {
      if (highlightRef.current && editorRef.current) {
        highlightRef.current.scrollTop = editorRef.current.scrollTop;
        highlightRef.current.scrollLeft = editorRef.current.scrollLeft;
      }
    };

    const textarea = editorRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', syncScroll);
      return () => textarea.removeEventListener('scroll', syncScroll);
    }
  }, []);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setHtmlText(newText);
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
  };

  // Apply syntax highlighting to HTML
  const highlightHtml = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Tag pattern
      const tagPattern = /(<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s+[a-zA-Z][a-zA-Z0-9-]*(?:=(?:"[^"]*"|'[^']*'|[^'">\s]+))?)*\s*\/?>)/g;
      
      // Attribute pattern
      const attrPattern = /\s+([a-zA-Z][a-zA-Z0-9-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^'">\s]+)))?/g;
      
      // Replace tags
      let highlightedLine = line.replace(tagPattern, (match) => {
        // Replace attributes in the tag
        const highlightedTag = match.replace(attrPattern, (attrMatch, attrName, dqValue, sqValue, uqValue) => {
          const value = dqValue || sqValue || uqValue || '';
          const valueHTML = value ? '=' + (dqValue 
            ? `"<span class="html-string">${dqValue}</span>"` 
            : (sqValue 
              ? `'<span class="html-string">${sqValue}</span>'` 
              : `<span class="html-string">${uqValue}</span>`)) 
            : '';
            
          return ` <span class="html-attr">${attrName}</span>${valueHTML}`;
        });
        
        return `<span class="html-tag">${highlightedTag}</span>`;
      });
      
      // Add indentation classes
      const indent = line.match(/^\s*/)[0].length / 2;
      const indentClass = indent > 0 ? `indent-${Math.min(indent, 5)}` : '';
      
      return (
        <div key={index} className={`code-line ${indentClass}`} dangerouslySetInnerHTML={{ __html: highlightedLine }} />
      );
    });
  };

  return (
    <div className="editor-section html-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      
      <div className="html-body" ref={containerRef}>
        <div className="code-editor-container">
          {/* Invisible textarea for editing */}
          <textarea
            ref={editorRef}
            className="code-editor-textarea"
            value={htmlText}
            onChange={handleTextChange}
            spellCheck="false"
          />
          
          {/* Visual overlay for syntax highlighting */}
          <div className="code-editor-highlight" ref={highlightRef}>
            {highlightHtml(htmlText)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsSection; 