import { useState, useRef, useEffect } from 'react'
// Content supports HTML: use <a href="...">links</a>, <b>bold</b>, <i>italic</i>, etc.
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 500px;
  max-width: calc(100vw - 20px);
  min-height: 350px;

  @media (max-width: 768px) {
    width: calc(100vw - 16px);
    left: 8px !important;
    min-height: 300px;
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

const TextContent = styled.div`
  width: 100%;
  height: 250px;
  overflow-y: auto;
  font-family: 'Fixedsys', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px;
  background: white;
  white-space: pre-wrap;
  word-wrap: break-word;

  @media (max-width: 768px) {
    height: 200px;
    font-size: 14px;
    padding: 8px;
  }

  a {
    color: #0000FF;
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: #FF0000;
    }

    &:visited {
      color: #800080;
    }
  }

  h1, h2, h3 {
    margin: 8px 0;
    font-weight: bold;
  }

  h1 { font-size: 18px; }
  h2 { font-size: 16px; }
  h3 { font-size: 14px; }

  p {
    margin: 4px 0;
  }

  ul, ol {
    margin: 4px 0;
    padding-left: 20px;
  }

  strong, b {
    font-weight: bold;
  }

  em, i {
    font-style: italic;
  }
`

const Content = styled(WindowContent)`
  padding: 0;
  display: flex;
  flex-direction: column;
`

function Notepad({ title, filename, content, onClose, onFocus, isFocused, zIndex, position, onPositionChange }) {
  const [pos, setPos] = useState(position || { x: 80, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (position) setPos(position)
  }, [position])

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true)
    dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y }
    onFocus()
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return
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

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span>📄 {filename || title}</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <MenuBar>
        <MenuItem>File</MenuItem>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Search</MenuItem>
        <MenuItem>Help</MenuItem>
      </MenuBar>
      <Content>
        <TextContent dangerouslySetInnerHTML={{ __html: content }} />
      </Content>
    </StyledWindow>
  )
}

export default Notepad
