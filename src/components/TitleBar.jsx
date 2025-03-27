import React from 'react';
import './TitleBar.css';

const TitleBar = () => {
  return (
    <div className="titlebar">
      <div className="titlebar-menu">
        <span className="titlebar-menu-item">File</span>
        <span className="titlebar-menu-item">Edit</span>
        <span className="titlebar-menu-item">Selection</span>
        <span className="titlebar-menu-item">View</span>
        <span className="titlebar-menu-item">Go</span>
        <span className="titlebar-menu-item">Run</span>
        <span className="titlebar-menu-item">Terminal</span>
        <span className="titlebar-menu-item">Help</span>
      </div>
      <div className="titlebar-title">My Portfolio - VS Code</div>
      <div className="titlebar-controls">
        <button className="titlebar-button minimize">—</button>
        <button className="titlebar-button maximize">□</button>
        <button className="titlebar-button close">✕</button>
      </div>
    </div>
  );
};

export default TitleBar; 