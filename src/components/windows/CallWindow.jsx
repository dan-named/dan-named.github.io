import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 450px;
  height: 550px;
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 60px);
`

const Header = styled(WindowHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CloseButton = styled(Button)`
  margin-left: auto;
`

const Content = styled(WindowContent)`
  height: calc(100% - 33px);
  padding: 0;
`

const IframeContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
`

const CalFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`

function CallWindow({ title, onClose, onFocus, isFocused, zIndex, position, onPositionChange }) {
  const [pos, setPos] = useState(position || { x: 180, y: 60 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

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

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header onMouseDown={handleMouseDown}>
        <span>📞 {title}</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <Content>
        <IframeContainer>
          <CalFrame
            src="https://cal.com/dan-named/quick-start?embed=true"
            title="Book a call with Dan AI"
          />
        </IframeContainer>
      </Content>
    </StyledWindow>
  )
}

export default CallWindow
