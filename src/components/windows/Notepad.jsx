import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button, Toolbar, MenuList, MenuListItem } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 500px;
  max-width: calc(100vw - 20px);
  min-height: 350px;
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

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea')) return
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

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header onMouseDown={handleMouseDown}>
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
