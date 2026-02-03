import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'
import { ReactPainter } from 'react-painter'

const COLORS = [
  '#000000', '#808080', '#800000', '#808000',
  '#008000', '#008080', '#000080', '#800080',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00',
  '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
]

const BRUSH_SIZES = [2, 4, 8, 16]

const StyledWindow = styled(Window)`
  position: absolute;
  min-width: 360px;

  @media (max-width: 768px) {
    left: 4px !important;
    min-width: unset;
    width: calc(100vw - 8px);
    max-width: calc(100vw - 8px);
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
  padding: 0;
  display: flex;
  flex-direction: column;
`

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-bottom: 1px solid #808080;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 4px;
    padding: 4px;
  }
`

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1px;
  background: #808080;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 1px;
`

const ColorSwatch = styled.button`
  width: 16px;
  height: 16px;
  background: ${props => props.$color};
  border: ${props => props.$selected ? '2px solid #000' : '1px solid #808080'};
  cursor: pointer;
  padding: 0;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`

const BrushSizeBtn = styled.button`
  width: 24px;
  height: 24px;
  background: ${props => props.$selected ? '#000080' : '#c0c0c0'};
  color: ${props => props.$selected ? '#fff' : '#000'};
  border: 2px solid;
  border-color: ${props => props.$selected ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff'};
  cursor: pointer;
  font-size: 10px;
  font-weight: bold;

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }
`

const ToolBtn = styled.button`
  padding: 2px 8px;
  background: ${props => props.$active ? '#000080' : '#c0c0c0'};
  color: ${props => props.$active ? '#fff' : '#000'};
  border: 2px solid;
  border-color: ${props => props.$active ? '#808080 #ffffff #ffffff #808080' : '#ffffff #808080 #808080 #ffffff'};
  cursor: pointer;
  font-size: 11px;

  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }

  @media (max-width: 768px) {
    padding: 4px 10px;
    font-size: 12px;
  }
`

const CanvasContainer = styled.div`
  background: #808080;
  padding: 4px;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  margin: 4px;
  overflow: auto;

  canvas {
    display: block;
    background: #ffffff;
    cursor: crosshair;
  }
`

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 6px;
  border-top: 1px solid #808080;
  font-size: 11px;
  background: #c0c0c0;
`

function Paint({ onClose, onFocus, isFocused, zIndex, position, onPositionChange }) {
  const [pos, setPos] = useState(position || { x: 100, y: 60 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(4)
  const [isEraser, setIsEraser] = useState(false)

  // Store painter control functions
  const painterRef = useRef({ setColor: null, setLineWidth: null })

  // Dragging logic
  useEffect(() => {
    if (position) setPos(position)
  }, [position])

  const handleDragStart = (clientX, clientY) => {
    setIsDragging(true)
    dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y }
    onFocus()
  }

  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('canvas') || e.target.closest('.toolbar-area')) return
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('canvas') || e.target.closest('.toolbar-area')) return
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

  const handleSave = useCallback((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'painting.png'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleColorChange = useCallback((c) => {
    setColor(c)
    setIsEraser(false)
    painterRef.current.setColor?.(c)
  }, [])

  const handleBrushSizeChange = useCallback((size) => {
    setBrushSize(size)
    painterRef.current.setLineWidth?.(size)
  }, [])

  const handleEraserToggle = useCallback(() => {
    setIsEraser(prev => {
      const newIsEraser = !prev
      painterRef.current.setColor?.(newIsEraser ? '#ffffff' : color)
      return newIsEraser
    })
  }, [color])

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span>🎨 Paint</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <Content>
        <ReactPainter
          width={320}
          height={240}
          initialColor={color}
          initialLineWidth={brushSize}
          render={({ triggerSave, canvas, setColor: setPainterColor, setLineWidth }) => {
            // Store refs to painter controls (only on first render)
            if (!painterRef.current.setColor) {
              painterRef.current.setColor = setPainterColor
              painterRef.current.setLineWidth = setLineWidth
            }

            return (
              <>
                <Toolbar className="toolbar-area">
                  <ColorPalette>
                    {COLORS.map(c => (
                      <ColorSwatch
                        key={c}
                        $color={c}
                        $selected={color === c && !isEraser}
                        onClick={() => handleColorChange(c)}
                      />
                    ))}
                  </ColorPalette>
                  <ToolGroup>
                    {BRUSH_SIZES.map(size => (
                      <BrushSizeBtn
                        key={size}
                        $selected={brushSize === size}
                        onClick={() => handleBrushSizeChange(size)}
                      >
                        {size}
                      </BrushSizeBtn>
                    ))}
                  </ToolGroup>
                  <ToolBtn
                    $active={isEraser}
                    onClick={handleEraserToggle}
                  >
                    Eraser
                  </ToolBtn>
                  <ToolBtn onClick={() => triggerSave(handleSave)}>
                    Save
                  </ToolBtn>
                </Toolbar>
                <CanvasContainer>
                  {canvas}
                </CanvasContainer>
              </>
            )
          }}
        />
        <StatusBar>
          <span>Color: {isEraser ? 'Eraser' : color}</span>
          <span>Size: {brushSize}px</span>
        </StatusBar>
      </Content>
    </StyledWindow>
  )
}

export default Paint
