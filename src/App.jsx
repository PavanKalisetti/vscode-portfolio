import { useState } from 'react'
import TitleBar from './components/TitleBar'
import ActivityBar from './components/ActivityBar'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import StatusBar from './components/StatusBar'
import AboutModal from './components/AboutModal'
import './VSCodeTheme.css'
import './App.css'

function App() {
  const [activeIcon, setActiveIcon] = useState('explorer')
  const [activeFile, setActiveFile] = useState('README.md')
  const [theme, setTheme] = useState('dark') // 'dark' or 'light'
  const [showAboutModal, setShowAboutModal] = useState(false)
  
  const handleMenuAction = (action, payload) => {
    switch (action) {
      // View actions
      case 'VIEW_EXPLORER':
        setActiveIcon('explorer')
        break
      case 'VIEW_SEARCH':
        setActiveIcon('search')
        break
      case 'VIEW_GIT':
        setActiveIcon('git')
        break
      case 'VIEW_DEBUG':
        setActiveIcon('debug')
        break
        
      // Theme actions  
      case 'CHANGE_THEME':
        setTheme(payload)
        document.documentElement.setAttribute('data-theme', payload)
        break
        
      // File actions  
      case 'OPEN_FILE':
        setActiveFile(payload)
        break
      case 'DOWNLOAD_RESUME':
        // Would typically link to a PDF file
        alert('Resume download functionality would go here')
        break
        
      // Social media and contact links  
      case 'OPEN_LINKEDIN':
        window.open('https://www.linkedin.com/', '_blank')
        break
      case 'OPEN_GITHUB':
        window.open('https://github.com/', '_blank')
        break
      case 'OPEN_TWITTER':
        window.open('https://twitter.com/', '_blank')
        break
      case 'OPEN_EMAIL':
        window.location.href = 'mailto:your.email@example.com'
        break
        
      // Help section actions  
      case 'SHOW_ABOUT_SITE':
        setShowAboutModal(true)
        break
      case 'SHOW_SOURCE_CODE':
        window.open('https://github.com/yourusername/portfolio-vscode', '_blank')
        break
      case 'REPORT_ISSUE':
        window.location.href = 'mailto:your.email@example.com?subject=Issue%20with%20your%20portfolio%20site'
        break
        
      // Window control actions
      case 'MINIMIZE_WINDOW':
        // In a real app, would minimize the window - here we'll just log it
        console.log('Window minimize requested')
        break
      case 'MAXIMIZE_WINDOW':
        // Toggle fullscreen mode
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        break
      case 'CLOSE_WINDOW':
        // Since we can't close the window, we'll reload the page
        if (confirm('This will refresh the page. Continue?')) {
          window.location.reload()
        }
        break
        
      default:
        console.log('Unhandled menu action:', action)
    }
  }

  return (
    <div className={`vs-container theme-${theme}`}>
      <TitleBar onMenuAction={handleMenuAction} />
      <div className="vs-main">
        <ActivityBar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
        <Sidebar activeIcon={activeIcon} activeFile={activeFile} setActiveFile={setActiveFile} />
        <Editor activeFile={activeFile} setActiveFile={setActiveFile} />
      </div>
      <StatusBar theme={theme} />
      
      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </div>
  )
}

export default App
