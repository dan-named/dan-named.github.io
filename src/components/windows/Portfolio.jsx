import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 450px;
  max-width: calc(100vw - 20px);

  @media (max-width: 768px) {
    width: calc(100vw - 16px);
    left: 8px !important;
  }
`

const Header = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
`

const CloseButton = styled(Button)`
  margin-left: auto;
  min-width: 20px;
  padding: 0 6px;

  @media (max-width: 768px) {
    min-width: 32px;
    min-height: 32px;
    font-size: 16px;
  }
`

const MenuBar = styled.div`
  display: flex;
  gap: 0;
  padding: 2px 4px;
  border-bottom: 1px solid #808080;
`

const MenuItem = styled.span`
  padding: 2px 8px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #000080;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 14px;
  }
`

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 4px;
  gap: 2px;
  border-bottom: 1px solid #808080;
  background: #C0C0C0;
`

const NavButton = styled(Button)`
  min-width: 36px;
  height: 22px;
  padding: 2px 4px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;

  &:disabled {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    min-width: 44px;
    height: 32px;
    font-size: 12px;
  }
`

const ToolbarSeparator = styled.div`
  width: 2px;
  height: 20px;
  border-left: 1px solid #808080;
  border-right: 1px solid #FFFFFF;
  margin: 0 4px;

  @media (max-width: 768px) {
    height: 28px;
  }
`

const BackIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" style={{ imageRendering: 'pixelated' }}>
    <polygon points="6,1 6,4 14,4 14,10 6,10 6,13 1,7" fill="#000080"/>
    <polygon points="6,2 6,5 13,5 13,9 6,9 6,12 2,7" fill="#00FFFF"/>
  </svg>
)

const UpIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" style={{ imageRendering: 'pixelated' }}>
    <polygon points="1,6 5,6 6,4 1,4" fill="#FFFF00" stroke="#000000" strokeWidth="0.5"/>
    <rect x="1" y="6" width="12" height="7" fill="#FFFF00" stroke="#000000" strokeWidth="0.5"/>
    <polygon points="8,1 12,5 10,5 10,8 6,8 6,5 4,5" fill="#000080"/>
  </svg>
)

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  gap: 8px;
  border-bottom: 1px solid #808080;
  font-size: 12px;

  @media (max-width: 768px) {
    padding: 6px 8px;
    font-size: 11px;
  }
`

const AddressLabel = styled.span`
  font-weight: bold;

  @media (max-width: 768px) {
    display: none;
  }
`

const AddressPath = styled.div`
  flex: 1;
  background: white;
  padding: 2px 4px;
  border: 2px inset #c0c0c0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Content = styled(WindowContent)`
  padding: 8px;
  background: white;
  min-height: 200px;

  @media (max-width: 768px) {
    min-height: 150px;
  }
`

const FileGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 8px;
    justify-content: flex-start;
  }
`

const FileIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  cursor: pointer;
  width: 70px;
  user-select: none;
  -webkit-user-select: none;

  @media (max-width: 768px) {
    width: 65px;
    padding: 8px 4px;
  }

  &:hover, &:active {
    .file-label {
      background: #000080;
      color: white;
    }
  }
`

const FileImage = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const FileLabel = styled.span`
  font-size: 11px;
  text-align: center;
  padding: 1px 2px;
  word-wrap: break-word;
  max-width: 68px;

  @media (max-width: 768px) {
    font-size: 10px;
    max-width: 62px;
  }
`

// Windows 95 style document icon (small)
const DocumentIconSmall = () => (
  <FileImage>
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="2" width="20" height="28" fill="#FFFFFF" stroke="#000000" strokeWidth="1"/>
      <polygon points="18,2 24,8 18,8" fill="#C0C0C0" stroke="#000000" strokeWidth="1"/>
      <line x1="18" y1="2" x2="18" y2="8" stroke="#000000" strokeWidth="1"/>
      <line x1="18" y1="8" x2="24" y2="8" stroke="#000000" strokeWidth="1"/>
      <rect x="7" y="12" width="14" height="1" fill="#000080"/>
      <rect x="7" y="16" width="12" height="1" fill="#000080"/>
      <rect x="7" y="20" width="14" height="1" fill="#000080"/>
      <rect x="7" y="24" width="8" height="1" fill="#000080"/>
    </svg>
  </FileImage>
)

// Windows 95 style folder icon (small)
const FolderIconSmall = () => (
  <FileImage>
    <svg width="32" height="32" viewBox="0 0 32 32" style={{ imageRendering: 'pixelated' }}>
      <polygon points="2,8 10,8 12,5 2,5" fill="#FFFF00" stroke="#000000" strokeWidth="1"/>
      <rect x="2" y="8" width="28" height="20" fill="#FFFF00" stroke="#000000" strokeWidth="1"/>
      <rect x="3" y="9" width="26" height="2" fill="#FFFFAA"/>
      <rect x="3" y="25" width="26" height="2" fill="#808000"/>
    </svg>
  </FileImage>
)

// ChatGPT app icon
const ChatGPTIcon = () => (
  <FileImage>
    <svg width="32" height="32" viewBox="0 0 512 509.639">
      <path fill="#fff" d="M115.612 0h280.775C459.974 0 512 52.026 512 115.612v278.415c0 63.587-52.026 115.613-115.613 115.613H115.612C52.026 509.64 0 457.614 0 394.027V115.612C0 52.026 52.026 0 115.612 0z"/>
      <path fillRule="nonzero" d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"/>
    </svg>
  </FileImage>
)

// Folder structure - all data lives here
const FOLDER_STRUCTURE = {
  'C:\\Portfolio': [
    { id: 'builder', name: 'builder', type: 'folder', path: 'C:\\Portfolio\\builder' },
    { id: 'educator', name: 'educator', type: 'folder', path: 'C:\\Portfolio\\educator' },
  ],
  'C:\\Portfolio\\builder': [
    { id: 'mamaPapaBaby', name: 'MamaPapaBaby.txt', type: 'file' },
    { id: 'openMe', name: 'OpenMe.txt', type: 'file' },
    { id: 'kimonoBot', name: 'Kimono Bot.txt', type: 'file' },
    { id: 'headhunterParser', name: 'HeadHunter Parser.txt', type: 'file' },
    { id: 'aiMindsetBuilder', name: 'AI Mindset.txt', type: 'file' },
  ],
  'C:\\Portfolio\\educator': [
    { id: 'aiMindsetEducator', name: 'AI Mindset.txt', type: 'file' },
    { id: 'eduson', name: 'Eduson.txt', type: 'file' },
    { id: 'yago', name: 'YAGO.txt', type: 'file' },
  ],
  'C:\\Recycle Bin': [
    { id: 'chatgpt', name: 'ChatGPT', type: 'app' },
  ],
}

function Portfolio({ title, onClose, onFocus, onOpenFile, isFocused, zIndex, position, onPositionChange, initialPath }) {
  const [currentPath, setCurrentPath] = useState(initialPath || 'C:\\Portfolio')
  const [history, setHistory] = useState([initialPath || 'C:\\Portfolio'])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [pos, setPos] = useState(position || { x: 120, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const folderItems = FOLDER_STRUCTURE[currentPath] || []
  const canGoBack = historyIndex > 0
  const canGoUp = currentPath.split('\\').length > 2

  const getFolderName = (path) => {
    const parts = path.split('\\')
    return parts[parts.length - 1]
  }

  useEffect(() => {
    if (position) setPos(position)
  }, [position])

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true)
    dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y }
    onFocus()
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button')) return
    const touch = e.touches[0]
    handleDragStart(touch.clientX, touch.clientY)
  }

  useEffect(() => {
    const handleMove = (clientX, clientY) => {
      if (!isDragging) return
      const newPos = { x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y }
      setPos(newPos)
      onPositionChange?.(newPos)
    }

    const handleMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
    const handleEnd = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleEnd)
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', handleEnd)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, onPositionChange])

  const navigateTo = (path) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(path)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    setCurrentPath(path)
  }

  const goBack = () => {
    if (canGoBack) {
      setHistoryIndex(historyIndex - 1)
      setCurrentPath(history[historyIndex - 1])
    }
  }

  const goUp = () => {
    if (canGoUp) {
      const parts = currentPath.split('\\')
      const parentPath = parts.slice(0, -1).join('\\')
      navigateTo(parentPath)
    }
  }

  const handleItemClick = (e, item) => {
    if (item.type === 'folder' && item.path) {
      navigateTo(item.path)
    } else if (item.type === 'file' && onOpenFile) {
      e.stopPropagation() // Prevent Portfolio from stealing focus after opening file
      onOpenFile(item.id)
    }
  }

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span>📁 {getFolderName(currentPath)}</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <MenuBar>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>View</MenuItem>
        <MenuItem>Help</MenuItem>
      </MenuBar>
      <ToolbarRow>
        <NavButton onClick={goBack} disabled={!canGoBack}>
          <BackIcon /> Back
        </NavButton>
        <ToolbarSeparator />
        <NavButton onClick={goUp} disabled={!canGoUp}>
          <UpIcon />
        </NavButton>
      </ToolbarRow>
      <AddressBar>
        <AddressLabel>Address:</AddressLabel>
        <AddressPath>{currentPath}</AddressPath>
      </AddressBar>
      <Content>
        <FileGrid>
          {folderItems.length > 0 ? (
            folderItems.map(item => (
              <FileIcon key={item.id} onClick={(e) => handleItemClick(e, item)}>
                {item.type === 'folder' ? <FolderIconSmall /> :
                 item.type === 'app' ? <ChatGPTIcon /> : <DocumentIconSmall />}
                <FileLabel className="file-label">{item.name}</FileLabel>
              </FileIcon>
            ))
          ) : (
            <div style={{ color: '#808080', fontSize: '12px' }}>This folder is empty</div>
          )}
        </FileGrid>
      </Content>
    </StyledWindow>
  )
}

export default Portfolio
