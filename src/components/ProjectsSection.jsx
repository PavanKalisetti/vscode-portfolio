import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const ProjectsSection = () => {
  const [projectsText, setProjectsText] = useState('');
  const [displayProjects, setDisplayProjects] = useState([]);
  const [error, setError] = useState(null);
  const [lineCount, setLineCount] = useState(50);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
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
    setProjectsText(formattedJson);
    setDisplayProjects(initialProjects);
    
    // Count lines for the line numbers
    const lines = formattedJson.split('\n').length;
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

  // Parse JSON when text changes
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setProjectsText(newText);
    
    try {
      const parsed = JSON.parse(newText);
      if (parsed && parsed.projects && Array.isArray(parsed.projects)) {
        setDisplayProjects(parsed.projects);
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

  const formatJson = () => {
    try {
      const parsed = JSON.parse(projectsText);
      const formatted = JSON.stringify(parsed, null, 2);
      setProjectsText(formatted);
    } catch (err) {
      // If it can't be parsed, leave it as is
    }
  };

  // Syntax highlighting for the displayed code (not the textarea)
  const highlightSyntax = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Replace JSON syntax with highlighted spans
      const keyRegex = /"([^"]+)":/g;
      const stringRegex = /"([^"]+)"/g;
      const numberRegex = /:\s*(\d+)(,|\s|$)/g;
      
      let highlightedLine = line
        .replace(keyRegex, '<span class="json-key">"$1":</span>')
        .replace(stringRegex, (match, p1, offset) => {
          // Avoid replacing the key part that we already replaced
          const prevChar = line[offset - 1];
          if (prevChar === ':') {
            return '<span class="json-string">"' + p1 + '"</span>';
          }
          return match;
        })
        .replace(numberRegex, ': <span class="json-number">$1</span>$2');
        
      // Add indentation classes
      const indent = line.match(/^\s*/)[0].length / 2;
      const indentClass = indent > 0 ? `indent-${Math.min(indent, 5)}` : '';
      
      return (
        <div key={index} className={`code-line ${indentClass}`} dangerouslySetInnerHTML={{ __html: highlightedLine }} />
      );
    });
  };

  return (
    <div className="editor-section json-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      <div className="json-body" ref={containerRef}>
        <div className="code-editor-container">
          {/* Invisible textarea for editing */}
          <textarea
            ref={editorRef}
            className="code-editor-textarea"
            value={projectsText}
            onChange={handleTextChange}
            onBlur={formatJson}
            spellCheck="false"
          />
          
          {/* Visual overlay for syntax highlighting */}
          <div className="code-editor-highlight" ref={highlightRef}>
            {highlightSyntax(projectsText)}
          </div>
        </div>
        
        {error && (
          <div className="json-error">
            {error}
          </div>
        )}

        <div className="projects-display">
          {displayProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-technologies">
                  {project.technologies?.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
                <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection; 