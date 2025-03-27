import React, { useState } from 'react';
import Tabs from './Tabs';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ContactSection from './ContactSection';
import './Editor.css';

const Editor = () => {
  const [activeTab, setActiveTab] = useState('README.md');
  
  const tabs = [
    { id: 'README.md', label: 'README.md', type: 'about' },
    { id: 'projects.json', label: 'projects.json', type: 'projects' },
    { id: 'skills.html', label: 'skills.html', type: 'skills' },
    { id: 'contact.md', label: 'contact.md', type: 'contact' }
  ];

  const renderContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    switch (currentTab?.type) {
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'skills':
        return <SkillsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <AboutSection />;
    }
  };

  return (
    <div className="editor-container">
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="editor-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Editor; 