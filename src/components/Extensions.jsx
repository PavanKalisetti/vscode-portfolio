import React from 'react';

const Extensions = () => {
  // List of extensions used to build this site
  const extensions = [
    { id: 'react', name: 'React', icon: '⚛️', publisher: 'Facebook' },
    { id: 'vite', name: 'Vite', icon: '⚡', publisher: 'Evan You' },
    { id: 'prettier', name: 'Prettier', icon: '🎨', publisher: 'Prettier' },
    { id: 'eslint', name: 'ESLint', icon: '🔍', publisher: 'ESLint' },
    { id: 'prismjs', name: 'PrismJS', icon: '🌈', publisher: 'Lea Verou' }
  ];

  return (
    <div className="sidebar-section extensions-panel">
      <div className="section-header">
        <span>EXTENSIONS</span>
      </div>
      <div className="extensions-list">
        {extensions.map((extension) => (
          <div key={extension.id} className="extension-item">
            <span className="extension-icon">{extension.icon}</span>
            <div className="extension-details">
              <span className="extension-name">{extension.name}</span>
              <span className="extension-publisher">{extension.publisher}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extensions; 