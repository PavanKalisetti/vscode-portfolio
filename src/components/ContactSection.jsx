import React, { useState, useEffect, useRef } from 'react';
import './EditorContent.css';

const ContactSection = () => {
  const [markdownText, setMarkdownText] = useState('');
  const [lineCount, setLineCount] = useState(30);
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
  const containerRef = useRef(null);

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
    setMarkdownText(initialMarkdown);
    
    // Count lines for line numbers
    const lines = initialMarkdown.split('\n').length;
    setLineCount(Math.max(30, lines + 10));
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
    setLineCount(Math.max(30, lines + 10));
  };

  // Apply syntax highlighting to markdown
  const highlightMarkdown = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    let inCodeBlock = false;
    
    return lines.map((line, index) => {
      // Check for code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return <div key={index} className="code-line"><span className="markdown-code">{line}</span></div>;
      }
      
      if (inCodeBlock) {
        return <div key={index} className="code-line"><span className="markdown-code">{line}</span></div>;
      }
      
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
      
      // Links
      if (line.match(/\[.+\]\(.+\)/)) {
        const linkPattern = /\[(.+?)\]\((.+?)\)/g;
        let formattedLine = line;
        let match;
        
        while ((match = linkPattern.exec(line)) !== null) {
          const linkText = match[1];
          const url = match[2];
          
          formattedLine = formattedLine.replace(
            match[0],
            `<span class="markdown-link">[${linkText}](${url})</span>`
          );
        }
        
        return (
          <div key={index} className="code-line">
            <span dangerouslySetInnerHTML={{ __html: formattedLine }}></span>
          </div>
        );
      }
      
      // List items
      if (line.match(/^- .+/)) {
        // Check for bold text within list items
        const boldPattern = /\*\*([^*]+)\*\*/g;
        let formattedLine = line;
        let match;
        
        while ((match = boldPattern.exec(line)) !== null) {
          formattedLine = formattedLine.replace(
            match[0],
            `<span class="markdown-bold">${match[1]}</span>`
          );
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

export default ContactSection; 