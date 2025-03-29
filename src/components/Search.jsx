import React, { useState, useRef, useEffect } from 'react';
import './Search.css';

const Search = ({ commands, onCommandSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('files'); // 'files' or 'commands'
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const searchInputRef = useRef(null);
  const commandsListRef = useRef(null);

  // Define the files to be displayed and filtered
  const files = [
    { id: 'readme', path: 'README.md', type: 'markdown', icon: '📄', description: 'About Me', action: () => onCommandSelect({ id: 'about', label: 'About Me', action: () => {} }) },
    { id: 'projects', path: 'projects.json', type: 'json', icon: '📊', description: 'Project Portfolio', action: () => onCommandSelect({ id: 'projects', label: 'Projects', action: () => {} }) },
    { id: 'skills', path: 'skills.html', type: 'html', icon: '🧩', description: 'Skills & Technologies', action: () => onCommandSelect({ id: 'skills', label: 'Skills', action: () => {} }) },
    { id: 'contact', path: 'contact.md', type: 'markdown', icon: '✉️', description: 'Contact Information', action: () => onCommandSelect({ id: 'contact', label: 'Contact', action: () => {} }) },
  ];

  const [filteredFiles, setFilteredFiles] = useState(files);
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1);

  // Filter files when search query changes
  useEffect(() => {
    if (searchType === 'files') {
      if (!searchQuery.trim()) {
        setFilteredFiles(files);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = files.filter(file => 
          file.path.toLowerCase().includes(query) || 
          file.description.toLowerCase().includes(query) ||
          file.type.toLowerCase().includes(query)
        );
        setFilteredFiles(filtered);
      }
      setSelectedFileIndex(-1);
    }
  }, [searchQuery, searchType]);

  // Filter commands when search query changes
  useEffect(() => {
    if (searchType === 'commands') {
      if (!searchQuery.trim()) {
        setFilteredCommands(commands);
      } else {
        const filtered = commands.filter(command => 
          command.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCommands(filtered);
      }
      setSelectedCommandIndex(0);
    }
  }, [searchQuery, commands, searchType]);

  // Scroll selected command into view
  useEffect(() => {
    if (searchType === 'commands' && commandsListRef.current && filteredCommands.length > 0) {
      const selectedItem = commandsListRef.current.querySelector('.command-item.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedCommandIndex, searchType]);

  // Focus input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchQuery('');
    if (type === 'commands') {
      setFilteredCommands(commands);
    } else {
      setFilteredFiles(files);
    }
  };

  const handleFileClick = (file) => {
    if (file && file.action) {
      file.action();
    }
  };

  const handleKeyDown = (e) => {
    if (searchType === 'commands') {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedCommandIndex(prevIndex => 
            prevIndex < filteredCommands.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedCommandIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : 0
          );
          break;
        case 'Enter':
          if (filteredCommands[selectedCommandIndex]) {
            onCommandSelect(filteredCommands[selectedCommandIndex]);
          }
          break;
        default:
          break;
      }
    } else if (searchType === 'files') {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedFileIndex(prevIndex => 
            prevIndex < filteredFiles.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedFileIndex(prevIndex => 
            prevIndex > 0 ? prevIndex - 1 : 0
          );
          break;
        case 'Enter':
          if (filteredFiles[selectedFileIndex]) {
            handleFileClick(filteredFiles[selectedFileIndex]);
          }
          break;
        default:
          break;
      }
    }
  };

  // Get file icon based on file type
  const getFileIcon = (file) => {
    return file.icon || '📄';
  };

  return (
    <div className="search-container">
      <div className="search-type-tabs">
        <button 
          className={`search-tab ${searchType === 'files' ? 'active' : ''}`}
          onClick={() => handleSearchTypeChange('files')}
        >
          Files
        </button>
        <button 
          className={`search-tab ${searchType === 'commands' ? 'active' : ''}`}
          onClick={() => handleSearchTypeChange('commands')}
        >
          Commands
        </button>
      </div>

      <div className="search-input-container">
        <input
          ref={searchInputRef}
          type="text"
          className="search-input"
          placeholder={searchType === 'files' ? "Search for files..." : "Type a command..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {searchType === 'files' && (
        <div className="search-results">
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => (
              <div 
                key={file.id}
                className={`file-item ${selectedFileIndex === index ? 'selected' : ''}`}
                onClick={() => handleFileClick(file)}
                onMouseEnter={() => setSelectedFileIndex(index)}
              >
                <span className="file-icon">{getFileIcon(file)}</span>
                <div className="file-details">
                  <span className="file-name">{file.path}</span>
                  <span className="file-description">{file.description}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="search-placeholder">
              <p>No matching files found</p>
            </div>
          )}
        </div>
      )}

      {searchType === 'commands' && (
        <div className="command-results" ref={commandsListRef}>
          {filteredCommands.length > 0 ? (
            filteredCommands.map((command, index) => (
              <div 
                key={command.id}
                className={`command-item ${selectedCommandIndex === index ? 'selected' : ''}`}
                onClick={() => onCommandSelect(command)}
                onMouseEnter={() => setSelectedCommandIndex(index)}
              >
                <span className="command-label">{command.label}</span>
              </div>
            ))
          ) : (
            <div className="no-commands">No matching commands found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 