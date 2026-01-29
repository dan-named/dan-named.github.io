import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 450px;
  max-width: calc(100vw - 20px);
`

const Header = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CloseButton = styled(Button)`
  margin-left: auto;
  min-width: 20px;
  padding: 0 6px;
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
`

const ToolbarSeparator = styled.div`
  width: 2px;
  height: 20px;
  border-left: 1px solid #808080;
  border-right: 1px solid #FFFFFF;
  margin: 0 4px;
`

const BackIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" style={{ imageRendering: 'pixelated' }}>
    <polygon points="6,1 6,4 14,4 14,10 6,10 6,13 1,7" fill="#000080"/>
    <polygon points="6,2 6,5 13,5 13,9 6,9 6,12 2,7" fill="#00FFFF"/>
  </svg>
)

const UpIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" style={{ imageRendering: 'pixelated' }}>
    {/* Folder */}
    <polygon points="1,6 5,6 6,4 1,4" fill="#FFFF00" stroke="#000000" strokeWidth="0.5"/>
    <rect x="1" y="6" width="12" height="7" fill="#FFFF00" stroke="#000000" strokeWidth="0.5"/>
    {/* Up arrow */}
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
`

const AddressLabel = styled.span`
  font-weight: bold;
`

const AddressPath = styled.div`
  flex: 1;
  background: white;
  padding: 2px 4px;
  border: 2px inset #c0c0c0;
`

const Content = styled(WindowContent)`
  padding: 8px;
  background: white;
  min-height: 200px;
`

const FileGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
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

  &:hover {
    .file-label {
      background: #000080;
      color: white;
    }
  }

  &:active {
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
  ],
  'C:\\Portfolio\\educator': [
    { id: 'aiMindset', name: 'AI Mindset.txt', type: 'file' },
    { id: 'eduson', name: 'Eduson.txt', type: 'file' },
    { id: 'yago', name: 'YAGO.txt', type: 'file' },
  ],
  'C:\\Recycle Bin': [],
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

  // Get folder name from path
  const getFolderName = (path) => {
    const parts = path.split('\\')
    return parts[parts.length - 1]
  }

  useEffect(() => {
    if (position) setPos(position)
  }, [position])

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return
    setIsDragging(true)
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    onFocus()
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      const newPos = { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }
      setPos(newPos)
      onPositionChange?.(newPos)
    }
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
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

  const handleDoubleClick = (item) => {
    if (item.type === 'folder' && item.path) {
      navigateTo(item.path)
    } else if (item.type === 'file' && onOpenFile) {
      onOpenFile(item.id)
    }
  }

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header onMouseDown={handleMouseDown}>
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
              <FileIcon key={item.id} onDoubleClick={() => handleDoubleClick(item)}>
                {item.type === 'folder' ? <FolderIconSmall /> : <DocumentIconSmall />}
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
