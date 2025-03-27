import React, { useState } from 'react';
import './Explorer.css';

const Explorer = () => {
  const [expandedFolders, setExpandedFolders] = useState({
    'portfolio': true,
    'projects': false,
    'skills': false,
    'contact': false
  });

  const toggleFolder = (folder) => {
    setExpandedFolders({
      ...expandedFolders,
      [folder]: !expandedFolders[folder]
    });
  };

  return (
    <div className="explorer">
      <div className="folder-section">
        <div className="section-header">
          <span>PORTFOLIO</span>
        </div>
        <div className="folder-tree">
          <div className="folder">
            <div className="folder-header" onClick={() => toggleFolder('portfolio')}>
              <span className={`folder-icon ${expandedFolders['portfolio'] ? 'expanded' : ''}`}>▶</span>
              <span className="folder-name">Portfolio</span>
            </div>
            {expandedFolders['portfolio'] && (
              <div className="folder-content">
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">about.md</span>
                </div>
                <div className="file active">
                  <span className="file-icon">📄</span>
                  <span className="file-name">README.md</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="folder">
            <div className="folder-header" onClick={() => toggleFolder('projects')}>
              <span className={`folder-icon ${expandedFolders['projects'] ? 'expanded' : ''}`}>▶</span>
              <span className="folder-name">Projects</span>
            </div>
            {expandedFolders['projects'] && (
              <div className="folder-content">
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">project1.json</span>
                </div>
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">project2.json</span>
                </div>
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">project3.json</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="folder">
            <div className="folder-header" onClick={() => toggleFolder('skills')}>
              <span className={`folder-icon ${expandedFolders['skills'] ? 'expanded' : ''}`}>▶</span>
              <span className="folder-name">Skills</span>
            </div>
            {expandedFolders['skills'] && (
              <div className="folder-content">
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">frontend.html</span>
                </div>
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">backend.html</span>
                </div>
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">others.html</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="folder">
            <div className="folder-header" onClick={() => toggleFolder('contact')}>
              <span className={`folder-icon ${expandedFolders['contact'] ? 'expanded' : ''}`}>▶</span>
              <span className="folder-name">Contact</span>
            </div>
            {expandedFolders['contact'] && (
              <div className="folder-content">
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">contact.md</span>
                </div>
                <div className="file">
                  <span className="file-icon">📄</span>
                  <span className="file-name">social.json</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explorer; 