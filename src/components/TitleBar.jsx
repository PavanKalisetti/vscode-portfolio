import React, { useState, useEffect, useRef } from 'react';
import './TitleBar.css';

const TitleBar = ({ onMenuAction }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems = {
    Portfolio: [
      { label: 'About Me', action: 'OPEN_FILE', payload: 'README.md' },
      { label: 'Projects', action: 'OPEN_FILE', payload: 'projects.json' },
      { label: 'Skills', action: 'OPEN_FILE', payload: 'skills.html' },
      { label: 'Contact', action: 'OPEN_FILE', payload: 'contact.md' },
      // { label: 'Download Resume', action: 'DOWNLOAD_RESUME' },
    ],
    View: [
      { label: 'Command Palette...', action: 'COMMAND_PALETTE' },
      { label: 'Explorer', action: 'VIEW_EXPLORER' },
      { label: 'Search', action: 'VIEW_SEARCH' },
      { label: 'GitHub', action: 'VIEW_GIT' }
      // { 
      //   label: 'Appearance', 
      //   submenu: [
      //     { label: 'Dark Theme', action: 'CHANGE_THEME', payload: 'dark' },
      //     { label: 'Light Theme', action: 'CHANGE_THEME', payload: 'light' }
      //   ] 
      // }
    ],
    Connect: [
      { label: 'LinkedIn', action: 'OPEN_LINKEDIN' },
      { label: 'GitHub', action: 'OPEN_GITHUB' },
      { label: 'Twitter', action: 'OPEN_TWITTER' },
      { label: 'Email Me', action: 'OPEN_EMAIL' }
    ],
    Help: [
      { label: 'About This Site', action: 'SHOW_ABOUT_SITE' },
      { label: 'Source Code', action: 'SHOW_SOURCE_CODE' },
      { label: 'Report Issue', action: 'REPORT_ISSUE' }
    ]
  };

  const handleMenuClick = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menu);
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.submenu) {
      // Don't close menu for items with submenus
      return;
    }
    
    // Call the action handler with the action and optional payload
    if (onMenuAction && item.action) {
      onMenuAction(item.action, item.payload);
    }
    
    // Close the menu
    setActiveMenu(null);
  };

  const handleWindowButtonClick = (action) => {
    switch (action) {
      case 'minimize':
        if (onMenuAction) onMenuAction('MINIMIZE_WINDOW');
        break;
      case 'maximize':
        if (onMenuAction) onMenuAction('MAXIMIZE_WINDOW');
        break;
      case 'close':
        if (onMenuAction) onMenuAction('CLOSE_WINDOW');
        break;
      default:
        break;
    }
  };

  // Helper to render submenu items
  const renderMenuItem = (item, index) => {
    if (item.submenu) {
      return (
        <div key={index} className="dropdown-menu-item has-submenu">
          <span className="dropdown-menu-label">{item.label}</span>
          <span className="dropdown-menu-arrow">▶</span>
          <div className="submenu">
            {item.submenu.map((subItem, subIndex) => (
              <div 
                key={subIndex} 
                className="dropdown-menu-item"
                onClick={() => handleMenuItemClick(subItem)}
              >
                <span className="dropdown-menu-label">{subItem.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div 
        key={index} 
        className="dropdown-menu-item"
        onClick={() => handleMenuItemClick(item)}
      >
        <span className="dropdown-menu-label">{item.label}</span>
      </div>
    );
  };

  return (
    <div className="titlebar">
      <div className="titlebar-menu" ref={menuRef}>
        {Object.keys(menuItems).map((menu) => (
          <div key={menu} className="menu-container">
            <span 
              className={`titlebar-menu-item ${activeMenu === menu ? 'active' : ''}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </span>
            {activeMenu === menu && (
              <div className="dropdown-menu">
                {menuItems[menu].map((item, index) => renderMenuItem(item, index))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="titlebar-title">VS Code Edition</div>
      <div className="titlebar-controls">
        <button 
          className="titlebar-button minimize" 
          onClick={() => handleWindowButtonClick('minimize')}
        >—</button>
        <button 
          className="titlebar-button maximize" 
          onClick={() => handleWindowButtonClick('maximize')}
        >□</button>
        <button 
          className="titlebar-button close" 
          onClick={() => handleWindowButtonClick('close')}
        >✕</button>
      </div>
    </div>
  );
};

export default TitleBar; 