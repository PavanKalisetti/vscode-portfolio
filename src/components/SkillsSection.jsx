import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const SkillsSection = () => {
  const [htmlText, setHtmlText] = useState('');
  const [lineCount, setLineCount] = useState(50);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
  const containerRef = useRef(null);

  // Skill data for rendering
  const frontendSkills = [
    { name: 'React', proficiency: 90 },
    { name: 'JavaScript', proficiency: 95 },
    { name: 'HTML5', proficiency: 90 },
    { name: 'CSS3/SCSS', proficiency: 85 },
    { name: 'TypeScript', proficiency: 80 },
    { name: 'Vue.js', proficiency: 75 },
    { name: 'Redux', proficiency: 85 },
    { name: 'Next.js', proficiency: 70 }
  ];

  const backendSkills = [
    { name: 'Node.js', proficiency: 80 },
    { name: 'Express', proficiency: 75 },
    { name: 'MongoDB', proficiency: 70 },
    { name: 'Firebase', proficiency: 80 },
    { name: 'REST API', proficiency: 85 }
  ];

  const otherSkills = [
    { name: 'Git/GitHub', proficiency: 90 },
    { name: 'Webpack', proficiency: 75 },
    { name: 'Docker', proficiency: 65 },
    { name: 'Figma', proficiency: 80 },
    { name: 'Adobe XD', proficiency: 70 }
  ];

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
        <!-- Frontend skills go here -->
        
        <h2>Backend Development</h2>
        <!-- Backend skills go here -->
        
        <h2>Other Skills</h2>
        <!-- Other skills go here -->
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

  // Render skill progress bar
  const renderSkillBar = (skill) => {
    return (
      <div key={skill.name} className="skill-item">
        <div className="skill-info">
          <span className="skill-name">{skill.name}</span>
          <span className="skill-percentage">{skill.proficiency}%</span>
        </div>
        <div className="skill-bar">
          <div 
            className="skill-progress" 
            style={{ width: `${skill.proficiency}%` }}
          ></div>
        </div>
      </div>
    );
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

        {/* Skills display */}
        <div className="skills-display">
          <h2>Frontend Development</h2>
          {frontendSkills.map(skill => renderSkillBar(skill))}
        </div>
        
        <div className="skills-display">
          <h2>Backend Development</h2>
          {backendSkills.map(skill => renderSkillBar(skill))}
        </div>
        
        <div className="skills-display">
          <h2>Other Skills</h2>
          {otherSkills.map(skill => renderSkillBar(skill))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection; 