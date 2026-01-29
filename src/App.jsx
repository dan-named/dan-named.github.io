import { useState, useCallback } from 'react'
import styled from 'styled-components'
import Desktop from './components/Desktop'
import Taskbar from './components/Taskbar'
import Notepad from './components/windows/Notepad'
import Portfolio from './components/windows/Portfolio'
import CallWindow from './components/windows/CallWindow'
import Terminal from './components/windows/Terminal'

// Import text content from editable files
import danContent from './content/dan.txt?raw'
import mamaPapaBabyContent from './content/mamapapababy.txt?raw'
import openMeContent from './content/openme.txt?raw'
import kimonoBotContent from './content/kimonobot.txt?raw'
import headhunterParserContent from './content/headhunterparser.txt?raw'
import aiMindsetContent from './content/aimindset.txt?raw'
import edusonContent from './content/eduson.txt?raw'
import yagoContent from './content/yago.txt?raw'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  overflow: hidden;
`

const DesktopArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
`

// Notepad file contents - edit files in src/content/ folder
const FILE_CONTENTS = {
  aboutMe: danContent,
  mamaPapaBaby: mamaPapaBabyContent,
  openMe: openMeContent,
  aiMindset: aiMindsetContent,
  kimonoBot: kimonoBotContent,
  headhunterParser: headhunterParserContent,
  eduson: edusonContent,
  yago: yagoContent,
}

const WINDOWS = {
  aboutMe: {
    id: 'aboutMe',
    title: 'DAN.txt - Notepad',
    component: Notepad,
    props: { filename: 'DAN.txt', content: FILE_CONTENTS.aboutMe }
  },
  portfolio: {
    id: 'portfolio',
    title: 'Portfolio',
    component: Portfolio,
    props: { initialPath: 'C:\\Portfolio' }
  },
  call: {
    id: 'call',
    title: 'Book a Call',
    component: CallWindow
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    component: Terminal
  },
  recycleBin: {
    id: 'recycleBin',
    title: 'Recycle Bin',
    component: Portfolio,
    props: { initialPath: 'C:\\Recycle Bin' }
  },
  mamaPapaBaby: {
    id: 'mamaPapaBaby',
    title: 'MamaPapaBaby.txt - Notepad',
    component: Notepad,
    props: { filename: 'MamaPapaBaby.txt', content: FILE_CONTENTS.mamaPapaBaby }
  },
  openMe: {
    id: 'openMe',
    title: 'OpenMe.txt - Notepad',
    component: Notepad,
    props: { filename: 'OpenMe.txt', content: FILE_CONTENTS.openMe }
  },
  aiMindset: {
    id: 'aiMindset',
    title: 'AI Mindset.txt - Notepad',
    component: Notepad,
    props: { filename: 'AI Mindset.txt', content: FILE_CONTENTS.aiMindset }
  },
  kimonoBot: {
    id: 'kimonoBot',
    title: 'Kimono Bot.txt - Notepad',
    component: Notepad,
    props: { filename: 'Kimono Bot.txt', content: FILE_CONTENTS.kimonoBot }
  },
  headhunterParser: {
    id: 'headhunterParser',
    title: 'HeadHunter Parser.txt - Notepad',
    component: Notepad,
    props: { filename: 'HeadHunter Parser.txt', content: FILE_CONTENTS.headhunterParser }
  },
  eduson: {
    id: 'eduson',
    title: 'Eduson.txt - Notepad',
    component: Notepad,
    props: { filename: 'Eduson.txt', content: FILE_CONTENTS.eduson }
  },
  yago: {
    id: 'yago',
    title: 'YAGO.txt - Notepad',
    component: Notepad,
    props: { filename: 'YAGO.txt', content: FILE_CONTENTS.yago }
  },
}

function App() {
  const [openWindows, setOpenWindows] = useState([])
  const [focusedWindow, setFocusedWindow] = useState(null)
  const [windowPositions, setWindowPositions] = useState({})
  const [windowOrder, setWindowOrder] = useState([]) // Track z-order separately

  const openWindow = useCallback((windowId) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows(prev => [...prev, windowId])
      setWindowOrder(prev => [...prev, windowId])
    } else {
      // Move to top of z-order
      setWindowOrder(prev => [...prev.filter(id => id !== windowId), windowId])
    }
    setFocusedWindow(windowId)
  }, [openWindows])

  const closeWindow = useCallback((windowId) => {
    setOpenWindows(prev => prev.filter(id => id !== windowId))
    setWindowOrder(prev => prev.filter(id => id !== windowId))
    if (focusedWindow === windowId) {
      const remaining = openWindows.filter(id => id !== windowId)
      setFocusedWindow(remaining[remaining.length - 1] || null)
    }
  }, [focusedWindow, openWindows])

  const focusWindow = useCallback((windowId) => {
    setFocusedWindow(windowId)
    // Move to top of z-order
    setWindowOrder(prev => [...prev.filter(id => id !== windowId), windowId])
  }, [])

  const updatePosition = useCallback((windowId, position) => {
    setWindowPositions(prev => ({ ...prev, [windowId]: position }))
  }, [])

  return (
    <AppContainer>
      <DesktopArea>
        <Desktop onOpenWindow={openWindow} />
        {openWindows.map((windowId) => {
          const windowConfig = WINDOWS[windowId]
          if (!windowConfig) return null
          const WindowComponent = windowConfig.component
          const zIndex = 100 + windowOrder.indexOf(windowId)
          return (
            <WindowComponent
              key={windowId}
              title={windowConfig.title}
              onClose={() => closeWindow(windowId)}
              onFocus={() => focusWindow(windowId)}
              onOpenFile={openWindow}
              isFocused={focusedWindow === windowId}
              zIndex={zIndex}
              position={windowPositions[windowId]}
              onPositionChange={(pos) => updatePosition(windowId, pos)}
              {...(windowConfig.props || {})}
            />
          )
        })}
      </DesktopArea>
      <Taskbar
        openWindows={openWindows.map(id => WINDOWS[id]).filter(Boolean)}
        focusedWindow={focusedWindow}
        onWindowClick={focusWindow}
        onOpenWindow={openWindow}
      />
    </AppContainer>
  )
}

export default App
