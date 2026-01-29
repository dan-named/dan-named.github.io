import { useState, useRef, useEffect } from 'react'
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

const TextArea = styled.textarea`
  width: 100%;
  height: 250px;
  border: none;
  resize: none;
  font-family: 'Fixedsys', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.4;
  padding: 4px;
  outline: none;
  background: white;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    height: 200px;
    font-size: 16px;
    padding: 8px;
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
  const [text, setText] = useState(content || '')
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
    if (e.target.closest('button') || e.target.closest('textarea')) return
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea')) return
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
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
        />
      </Content>
    </StyledWindow>
  )
}

export default Notepad
