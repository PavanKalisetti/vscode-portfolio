import React, { useState, useEffect, useRef } from 'react';
import './CommandPalette.css';

const CommandPalette = ({ commands, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCommands, setFilteredCommands] = useState(commands);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const commandsRef = useRef(null);

  // Filter commands when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredCommands(commands);
      return;
    }
    
    const filtered = commands.filter(command => 
      command.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, [searchTerm, commands]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (commandsRef.current && filteredCommands.length > 0) {
      const selectedItem = commandsRef.current.querySelector('.command-item.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter':
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex]);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div 
        className="command-palette-container" 
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="command-palette-header">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="command-palette-input"
          />
        </div>
        
        <div className="command-palette-results" ref={commandsRef}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <div 
                key={command.id}
                className={`command-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => onSelect(command)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {command.label}
              </div>
            ))
          ) : (
            <div className="no-commands">No matching commands found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette; 