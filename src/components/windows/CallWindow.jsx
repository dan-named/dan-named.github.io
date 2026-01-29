import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 450px;
  height: 550px;
  max-width: calc(100vw - 20px);
  max-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    width: calc(100vw - 16px);
    height: calc(100vh - 80px);
    left: 8px !important;
    top: 8px !important;
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

const Content = styled(WindowContent)`
  height: calc(100% - 33px);
  padding: 0;

  @media (max-width: 768px) {
    height: calc(100% - 40px);
  }
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

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
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
