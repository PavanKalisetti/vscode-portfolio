import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const AboutSection = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [lineCount, setLineCount] = useState(40);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
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
    setMarkdownText(initialMarkdown);
    
    // Count lines for line numbers
    const lines = initialMarkdown.split('\n').length;
    setLineCount(Math.max(40, lines + 10));
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
    setMarkdownText(newText);
    
    // Update line count
    const lines = newText.split('\n').length;
    setLineCount(Math.max(40, lines + 10));
  };

  // Apply syntax highlighting to markdown
  const highlightMarkdown = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Check for different markdown elements
      
      // Headers
      if (line.match(/^# .+/)) {
        return <div key={index} className="code-line"><span className="markdown-heading">{line}</span></div>;
      }
      
      if (line.match(/^## .+/)) {
        return <div key={index} className="code-line"><span className="markdown-heading">{line}</span></div>;
      }
      
      if (line.match(/^### .+/)) {
        return <div key={index} className="code-line"><span className="markdown-subheading">{line}</span></div>;
      }
      
      // Italic text
      if (line.match(/^\*.+\*$/)) {
        return <div key={index} className="code-line"><span className="markdown-italic">{line}</span></div>;
      }
      
      // List items
      if (line.match(/^- .+/)) {
        // Check for bold text within list items
        const boldPattern = /\*\*([^*]+)\*\*/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        
        const lineCopy = line;
        let formattedLine = line;
        
        while ((match = boldPattern.exec(lineCopy)) !== null) {
          const start = match.index;
          const end = start + match[0].length;
          
          formattedLine = 
            formattedLine.substring(0, start) + 
            `<span class="markdown-bold">${match[1]}</span>` + 
            formattedLine.substring(end);
        }
        
        return (
          <div key={index} className="code-line">
            <span className="markdown-list" dangerouslySetInnerHTML={{ __html: formattedLine }}></span>
          </div>
        );
      }
      
      // Empty line
      if (line.trim() === '') {
        return <div key={index} className="code-line"></div>;
      }
      
      // Default text
      return <div key={index} className="code-line"><span className="markdown-text">{line}</span></div>;
    });
  };

  return (
    <div className="editor-section markdown-content">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} className="line-number">{i + 1}</div>
        ))}
      </div>
      
      <div className="markdown-body code-editor" ref={containerRef}>
        <div className="code-editor-container">
          {/* Invisible textarea for editing */}
          <textarea
            ref={editorRef}
            className="code-editor-textarea"
            value={markdownText}
            onChange={handleTextChange}
            spellCheck="false"
          />
          
          {/* Visual overlay for syntax highlighting */}
          <div className="code-editor-highlight" ref={highlightRef}>
            {highlightMarkdown(markdownText)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
