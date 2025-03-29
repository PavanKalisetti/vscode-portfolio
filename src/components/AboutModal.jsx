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
            <p>Welcome to my interactive VS Code-themed portfolio! This site is designed to showcase my skills and projects in a familiar developer environment.</p>
            
            <p>Features of this portfolio include:</p>
            <ul>
              <li>Fully interactive code editors with syntax highlighting</li>
              <li>VS Code-inspired UI with working navigation</li>
              <li>File explorer with multiple content sections</li>
              <li>Dark and light theme support</li>
              <li>Responsive design that works on all devices</li>
            </ul>
            
            <p>Feel free to explore different sections by using the menu bar at the top or the sidebar navigation!</p>
            
            <div className="tech-stack">
              <h4>Built With:</h4>
              <div className="tech-badges">
                <span className="tech-badge">React</span>
                <span className="tech-badge">JavaScript</span>
                <span className="tech-badge">CSS</span>
                <span className="tech-badge">Prism.js</span>
              </div>
            </div>
          </div>
          
          <div className="about-footer">
            <p>Created with ❤️ in 2023</p>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="modal-button primary" onClick={onClose}>Close</button>
          <button className="modal-button" onClick={() => window.open('https://github.com/yourusername/vs-code-portfolio', '_blank')}>
            View Source Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal; 