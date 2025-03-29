import { useState } from 'react'
import TitleBar from './components/TitleBar'
import ActivityBar from './components/ActivityBar'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import StatusBar from './components/StatusBar'
import './VSCodeTheme.css'
import './App.css'

function App() {
  const [activeIcon, setActiveIcon] = useState('explorer')
  const [activeFile, setActiveFile] = useState('README.md')

  return (
    <div className="vs-container">
      <TitleBar />
      <div className="vs-main">
        <ActivityBar activeIcon={activeIcon} setActiveIcon={setActiveIcon} />
        <Sidebar activeIcon={activeIcon} activeFile={activeFile} setActiveFile={setActiveFile} />
        <Editor activeFile={activeFile} setActiveFile={setActiveFile} />
      </div>
      <StatusBar />
    </div>
  )
}

export default App
