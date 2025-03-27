import React from 'react';
import './Tabs.css';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const getTabIcon = (tabLabel) => {
    if (tabLabel.endsWith('.md')) {
      return '/markdown_icon.svg';
    } else if (tabLabel.endsWith('.json')) {
      return '/json_icon.svg';
    } else if (tabLabel.endsWith('.html')) {
      return '/html_icon.svg';
    }
    return null;
  };

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => handleTabClick(tab.id)}
        >
          {getTabIcon(tab.label) && (
            <img 
              src={getTabIcon(tab.label)} 
              alt={`${tab.label} icon`} 
              className="tab-icon" 
            />
          )}
          <span className="tab-label">{tab.label}</span>
          <button className="tab-close">×</button>
        </div>
      ))}
    </div>
  );
};

export default Tabs; 