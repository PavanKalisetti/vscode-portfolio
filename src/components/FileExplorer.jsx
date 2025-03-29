import React from 'react';
import './Explorer.css';

const FileExplorer = ({ folders, activeFile, onFileSelect }) => {
  const handleFileClick = (fileName) => {
    onFileSelect(fileName);
  };

  // Function to get file icon based on file type or extension
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.md')) {
      return <span className="file-icon">📝</span>;
    } else if (fileName.endsWith('.json')) {
      return <span className="file-icon">🔢</span>;
    } else if (fileName.endsWith('.html')) {
      return <span className="file-icon">🌐</span>;
    } else if (fileName.endsWith('.css')) {
      return <span className="file-icon">🎨</span>;
    } else if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
      return <span className="file-icon">📜</span>;
    } else {
      return <span className="file-icon">📄</span>;
    }
  };

  return (
    <div className="explorer">
      {folders.map((folder) => (
        <div key={folder.name} className="folder">
          <div className="section-header">
            <span>{folder.name.toUpperCase()}</span>
          </div>
          <div className="file-list">
            {folder.files.map((file) => (
              <div 
                key={file.name}
                className={`file ${activeFile === file.name ? 'active' : ''}`}
                onClick={() => handleFileClick(file.name)}
              >
                {getFileIcon(file.name)}
                <span className="file-name">{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileExplorer; 