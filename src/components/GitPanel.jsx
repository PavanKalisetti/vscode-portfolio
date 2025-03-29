import React from 'react';

const GitPanel = () => {
  return (
    <div className="sidebar-section git-panel">
      <div className="section-header">
        <span>SOURCE CONTROL</span>
      </div>
      <div className="content-placeholder">
        <p>Visit my GitHub profile to see my projects.</p>
        <div className="git-links">
          <a 
            href="https://github.com/PavanKalisetti" 
            target="_blank" 
            rel="noopener noreferrer"
            className="git-link"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default GitPanel; 