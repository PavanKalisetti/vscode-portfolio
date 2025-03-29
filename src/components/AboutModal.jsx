import React from 'react';
import './AboutModal.css';

const AboutModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About This Portfolio</h2>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          <div className="about-logo">
            <span className="code-tag">&lt;/&gt;</span>
          </div>
          
          <h3>VS Code Portfolio</h3>
          <p className="version">Version 1.0.0</p>
          
          <div className="about-description">
            <p>Welcome to my interactive portfolio website! This site was designed to resemble Visual Studio Code, the popular code editor used by developers worldwide.</p>
            
            <p>As you navigate through the site, you'll find:</p>
            <ul>
              <li>Interactive editor with real code highlighting</li>
              <li>Navigation sidebar similar to VS Code's explorer</li>
              <li>Working menu bar with portfolio-related actions</li>
              <li>Light and dark theme support</li>
            </ul>
            
            <p>This project was built using React.js and styled with custom CSS to recreate the VS Code experience.</p>
            
            <div className="tech-stack">
              <h4>Tech Stack:</h4>
              <div className="tech-badges">
                <span className="tech-badge">React</span>
                <span className="tech-badge">JavaScript</span>
                <span className="tech-badge">CSS</span>
                <span className="tech-badge">Prism.js</span>
              </div>
            </div>
          </div>
          
          <div className="about-footer">
            <p>Created by: Your Name</p>
            <p>© 2023 All Rights Reserved</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-button primary" onClick={onClose}>Close</button>
          <button className="modal-button" onClick={() => window.open('https://github.com/yourusername/portfolio', '_blank')}>
            View Source
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal; 