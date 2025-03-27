import React from 'react';
import Explorer from './Explorer';
import './Sidebar.css';

const Sidebar = ({ activeIcon }) => {
  const renderContent = () => {
    switch (activeIcon) {
      case 'explorer':
        return <Explorer />;
      case 'search':
        return <div className="sidebar-section">Search</div>;
      case 'git':
        return <div className="sidebar-section">Source Control</div>;
      case 'debug':
        return <div className="sidebar-section">Run and Debug</div>;
      case 'extensions':
        return <div className="sidebar-section">Extensions</div>;
      case 'account':
        return <div className="sidebar-section">Account</div>;
      case 'settings':
        return <div className="sidebar-section">Settings</div>;
      default:
        return <Explorer />;
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