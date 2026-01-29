import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { AppBar, Toolbar, Button, MenuList, MenuListItem, Separator } from 'react95'

const TaskbarContainer = styled(AppBar)`
  position: relative !important;
  top: auto !important;
  bottom: 0;
  left: 0;
  right: 0;
`

const StartButton = styled(Button)`
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
  padding-right: 8px;
`

const WindowButton = styled(Button)`
  margin-left: 4px;
  min-width: 120px;
  justify-content: flex-start;
`

const SystemTray = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px;
  border-style: solid;
  border-width: 2px;
  border-color: ${({ theme }) => theme.borderDark} ${({ theme }) => theme.borderLightest} ${({ theme }) => theme.borderLightest} ${({ theme }) => theme.borderDark};
`

const TrayIcon = styled.div`
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    filter: brightness(1.2);
  }
`

const Clock = styled.div`
  padding: 0 8px;
  font-size: 12px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
`

const StartMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 2px;
  z-index: 1000;
`

const MenuHeader = styled.div`
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  background: linear-gradient(180deg, #000080, #1084d0);
  color: white;
  padding: 8px 4px;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 2px;
`

const MenuContent = styled.div`
  display: flex;
`

const MenuItems = styled(MenuList)`
  min-width: 180px;
`

// Windows 95 logo - 4 color waving flag
const Windows95Logo = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" style={{ imageRendering: 'pixelated' }}>
    {/* Red square */}
    <polygon points="1,2 9,1 9,9 1,9" fill="#FF0000"/>
    {/* Green square */}
    <polygon points="10,1 18,2 18,9 10,9" fill="#00FF00"/>
    {/* Blue square */}
    <polygon points="1,10 9,10 9,18 1,17" fill="#0000FF"/>
    {/* Yellow square */}
    <polygon points="10,10 18,10 18,17 10,18" fill="#FFFF00"/>
    {/* Black outlines for depth */}
    <line x1="9" y1="1" x2="9" y2="18" stroke="#000000" strokeWidth="1"/>
    <line x1="1" y1="9" x2="18" y2="9" stroke="#000000" strokeWidth="1"/>
  </svg>
)

// Network icon - two computers
const NetworkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Left computer */}
    <rect x="1" y="4" width="5" height="4" fill="#C0C0C0" stroke="#000000" strokeWidth="1"/>
    <rect x="2" y="5" width="3" height="2" fill="#000080"/>
    <rect x="2" y="9" width="3" height="1" fill="#808080"/>
    {/* Right computer */}
    <rect x="10" y="4" width="5" height="4" fill="#C0C0C0" stroke="#000000" strokeWidth="1"/>
    <rect x="11" y="5" width="3" height="2" fill="#000080"/>
    <rect x="11" y="9" width="3" height="1" fill="#808080"/>
    {/* Connection line */}
    <line x1="6" y1="6" x2="10" y2="6" stroke="#000000" strokeWidth="1"/>
    {/* Signal dots */}
    <rect x="7" y="5" width="2" height="2" fill="#00FF00"/>
  </svg>
)

// Volume/speaker icon
const VolumeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Speaker body */}
    <polygon points="2,6 5,6 9,2 9,14 5,10 2,10" fill="#808080" stroke="#000000" strokeWidth="1"/>
    <polygon points="2,6 5,6 5,10 2,10" fill="#FFFF00"/>
    {/* Sound waves */}
    <path d="M11,5 Q13,8 11,11" stroke="#000000" strokeWidth="1" fill="none"/>
    <path d="M13,3 Q16,8 13,13" stroke="#000000" strokeWidth="1" fill="none"/>
  </svg>
)

// Claude Code icon - terminal with sparkle
const ClaudeCodeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
    {/* Terminal background */}
    <rect x="1" y="2" width="14" height="12" fill="#000000" stroke="#C0C0C0" strokeWidth="1"/>
    {/* Prompt */}
    <text x="2" y="9" fill="#00FF00" fontSize="6" fontFamily="monospace">&gt;_</text>
    {/* Sparkle */}
    <polygon points="12,4 13,6 15,6 13,7 12,10 11,7 9,6 11,6" fill="#D4A574"/>
  </svg>
)

function Taskbar({ openWindows, focusedWindow, onWindowClick, onOpenWindow }) {
  const [startOpen, setStartOpen] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleStartClick = () => {
    setStartOpen(!startOpen)
  }

  const handleMenuItemClick = (windowId) => {
    onOpenWindow(windowId)
    setStartOpen(false)
  }

  return (
    <TaskbarContainer>
      <Toolbar>
        <StartButton active={startOpen} onClick={handleStartClick}>
          <Windows95Logo />
          Start
        </StartButton>

        {startOpen && (
          <StartMenu>
            <MenuContent>
              <MenuHeader>Dan AI</MenuHeader>
              <MenuItems>
                <MenuListItem onClick={() => handleMenuItemClick('aboutMe')}>
                  📄 About Me
                </MenuListItem>
                <MenuListItem onClick={() => handleMenuItemClick('portfolio')}>
                  📁 Portfolio
                </MenuListItem>
                <Separator />
                <MenuListItem onClick={() => handleMenuItemClick('call')}>
                  📞 Book a Call
                </MenuListItem>
              </MenuItems>
            </MenuContent>
          </StartMenu>
        )}

        {openWindows.map(window => (
          <WindowButton
            key={window.id}
            active={window.id === focusedWindow}
            onClick={() => onWindowClick(window.id)}
          >
            {window.title}
          </WindowButton>
        ))}

        <SystemTray>
          <TrayIcon title="Claude Code">
            <ClaudeCodeIcon />
          </TrayIcon>
          <TrayIcon title="Network">
            <NetworkIcon />
          </TrayIcon>
          <TrayIcon title="Volume">
            <VolumeIcon />
          </TrayIcon>
          <Clock>{formatTime(time)}</Clock>
        </SystemTray>
      </Toolbar>
    </TaskbarContainer>
  )
}

export default Taskbar
