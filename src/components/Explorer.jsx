import React from 'react';
import './Explorer.css';

const Explorer = ({ activeFile, setActiveFile }) => {
  // List of files directly available in the editor
  const files = [
    { id: 'README.md', name: 'README.md', icon: '📄', type: 'markdown' },
    { id: 'projects.json', name: 'projects.json', icon: '📄', type: 'json' },
    { id: 'skills.html', name: 'skills.html', icon: '📄', type: 'html' },
    { id: 'contact.md', name: 'contact.md', icon: '📄', type: 'markdown' }
  ];

  const handleFileClick = (fileId) => {
    setActiveFile(fileId);
    // You could add logic here to communicate with the Editor component
    // to open the selected file
  };

  // Function to get file icon based on file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'markdown':
        return <span className="file-icon">📝</span>;
      case 'json':
        return <span className="file-icon">🔢</span>;
      case 'html':
        return <span className="file-icon">🌐</span>;
      default:
        return <span className="file-icon">📄</span>;
    }
  };

  return (
    <div className="explorer">
      <div className="section-header">
        <span>PORTFOLIO</span>
      </div>
      <div className="file-list">
        {files.map((file) => (
          <div 
            key={file.id}
            className={`file ${activeFile === file.id ? 'active' : ''}`}
            onClick={() => handleFileClick(file.id)}
          >
            {getFileIcon(file.type)}
            <span className="file-name">{file.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorer; 