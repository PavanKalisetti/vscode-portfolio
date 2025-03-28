import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const ProjectsSection = () => {
  const [error, setError] = useState(null);
  const [lineCount, setLineCount] = useState(50);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Initial projects data
  const initialProjects = [
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'A full-featured e-commerce platform with product listings, search, cart, and checkout functionality.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: '/react-img.svg',
      link: '#'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A Kanban-style task management application with drag-and-drop functionality and team collaboration features.',
      technologies: ['Vue.js', 'Firebase', 'Vuex', 'SCSS'],
      image: '/js-img.svg',
      link: '#'
    },
    {
      id: 3,
      title: 'Portfolio Website',
      description: 'A minimalist portfolio website for a photographer showcasing their work with a gallery and contact form.',
      technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
      image: '/word-press-img.svg',
      link: '#'
    }
  ];

  // Initialize the editor with formatted JSON
  useEffect(() => {
    const formattedJson = JSON.stringify({ projects: initialProjects }, null, 2);
    
    if (editorRef.current) {
      editorRef.current.textContent = formattedJson;
    }
    
    // Count lines for the line numbers
    const lines = formattedJson.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
  }, []);

  // Handle text changes
  const handleTextChange = (e) => {
    const newText = e.target.textContent;
    
    try {
      const parsed = JSON.parse(newText);
      if (parsed && parsed.projects && Array.isArray(parsed.projects)) {
        setError(null);
      } else {
        setError("Invalid projects format. Expected { projects: [...] }");
      }
    } catch (err) {
      setError("Invalid JSON: " + err.message);
    }
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(50, lines + 10));
  };

  // Format JSON when editor loses focus
  const formatJson = () => {
    try {
      const currentText = editorRef.current.textContent;
      const parsed = JSON.parse(currentText);
      const formatted = JSON.stringify(parsed, null, 2);
      editorRef.current.textContent = formatted;
    } catch (error) {
      // If it can't be parsed, leave it as is
      console.log("Could not format JSON:", error);
    }
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
    <div className="editor-section json-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <div className="json-body" ref={containerRef}>
        <div 
          ref={editorRef}
          className="code-editor-single"
          contentEditable="true"
          onInput={handleTextChange}
          onBlur={formatJson}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          data-gramm="false"
        />
        
        {error && (
          <div className="json-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection; 