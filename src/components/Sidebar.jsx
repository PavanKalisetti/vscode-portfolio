import React, { useState } from 'react';
import FileExplorer from './FileExplorer';
import Search from './Search';
import GitPanel from './GitPanel';
import DebugPanel from './DebugPanel';
import Extensions from './Extensions';
import './Sidebar.css';

const Sidebar = ({ activeIcon, activeFile, setActiveFile, commands, onCommandSelect }) => {
  const folders = [
    {
      name: 'portfolio',
      files: [
        { name: 'README.md', content: 'About me content' },
        { name: 'projects.json', content: 'Projects data' },
        { name: 'skills.html', content: 'Skills listing' },
        { name: 'contact.md', content: 'Contact information' }
      ]
    }
  ];

  const renderContent = () => {
    switch (activeIcon) {
      case 'explorer':
        return <FileExplorer folders={folders} activeFile={activeFile} onFileSelect={setActiveFile} />;
      case 'search':
        return <Search commands={commands} onCommandSelect={onCommandSelect} />;
      case 'git':
        return <GitPanel />;
      case 'debug':
        return <DebugPanel />;
      case 'extensions':
        return <Extensions />;
      case 'account':
        return <div className="sidebar-section">Account</div>;
      case 'settings':
        return <div className="sidebar-section">Settings</div>;
      default:
        return <FileExplorer folders={folders} activeFile={activeFile} onFileSelect={setActiveFile} />;
    }
  };

  const getTitleByIcon = () => {
    switch (activeIcon) {
      case 'explorer':
        return 'EXPLORER';
      case 'search':
        return 'SEARCH';
      case 'git':
        return 'SOURCE CONTROL';
      case 'debug':
        return 'RUN AND DEBUG';
      case 'extensions':
        return 'EXTENSIONS';
      case 'account':
        return 'ACCOUNT';
      case 'settings':
        return 'SETTINGS';
      default:
        return 'EXPLORER';
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">{getTitleByIcon()}</div>
      {renderContent()}
    </div>
  );
};

export default Sidebar; 