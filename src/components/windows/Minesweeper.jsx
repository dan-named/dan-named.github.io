import { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, WindowContent, Button } from 'react95'

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
}

const NUMBER_COLORS = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080'
}

const StyledWindow = styled(Window)`
  position: absolute;
  min-width: fit-content;

  @media (max-width: 768px) {
    left: 4px !important;
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

const MenuBar = styled.div`
  display: flex;
  gap: 0;
  padding: 2px 4px;
  border-bottom: 1px solid #808080;
  position: relative;
`

const MenuItem = styled.span`
  padding: 2px 8px;
  cursor: pointer;
  font-size: 12px;
  position: relative;

  &:hover {
    background: #000080;
    color: white;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 14px;
  }
`

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  box-shadow: 2px 2px 0 #000;
  z-index: 1000;
  min-width: 120px;
`

const DropdownItem = styled.div`
  padding: 4px 20px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #000080;
    color: white;
  }

  ${props => props.$checked && `
    &::before {
      content: '✓';
      position: absolute;
      left: 6px;
    }
  `}

  @media (max-width: 768px) {
    padding: 8px 24px;
    font-size: 14px;
  }
`

const Content = styled(WindowContent)`
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GameContainer = styled.div`
  background: #c0c0c0;
  border: 3px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 6px;
`

const ControlPanel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  padding: 4px 6px;
  margin-bottom: 6px;
`

const LCDDisplay = styled.div`
  background: #000;
  color: #ff0000;
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: bold;
  padding: 2px 4px;
  min-width: 45px;
  text-align: right;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 20px;
    min-width: 40px;
  }
`

const SmileyButton = styled.button`
  width: 26px;
  height: 26px;
  font-size: 16px;
  cursor: pointer;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  background: #c0c0c0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:active {
    border-color: #808080 #ffffff #ffffff #808080;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.$cols}, 16px);
  border: 3px solid;
  border-color: #808080 #ffffff #ffffff #808080;

  @media (max-width: 768px) {
    grid-template-columns: repeat(${props => props.$cols}, 20px);
  }
`

const Cell = styled.button`
  width: 16px;
  height: 16px;
  font-size: 11px;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  color: ${props => NUMBER_COLORS[props.$number] || '#000'};

  ${props => props.$revealed ? `
    border-color: #808080;
    border-width: 1px;
    background: #c0c0c0;
  ` : `
    border-color: #ffffff #808080 #808080 #ffffff;
    background: #c0c0c0;

    &:active:not(:disabled) {
      border-color: #808080;
      border-width: 1px;
    }
  `}

  ${props => props.$mine && props.$exploded && `
    background: #ff0000;
  `}

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 13px;
  }
`

function Minesweeper({ onClose, onFocus, isFocused, zIndex, position, onPositionChange }) {
  const [pos, setPos] = useState(position || { x: 120, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const [difficulty, setDifficulty] = useState('beginner')
  const [board, setBoard] = useState([])
  const [gameState, setGameState] = useState('playing') // playing, won, lost
  const [time, setTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [flagCount, setFlagCount] = useState(0)
  const [firstClick, setFirstClick] = useState(true)
  const [menuOpen, setMenuOpen] = useState(null)
  const [mouseDown, setMouseDown] = useState(false)

  const config = DIFFICULTIES[difficulty]

  // Initialize board
  const initBoard = useCallback(() => {
    const newBoard = []
    for (let row = 0; row < config.rows; row++) {
      const rowArr = []
      for (let col = 0; col < config.cols; col++) {
        rowArr.push({
          revealed: false,
          mine: false,
          flagged: false,
          adjacentMines: 0,
          exploded: false
        })
      }
      newBoard.push(rowArr)
    }
    setBoard(newBoard)
    setGameState('playing')
    setTime(0)
    setTimerActive(false)
    setFlagCount(0)
    setFirstClick(true)
  }, [config.rows, config.cols])

  useEffect(() => {
    initBoard()
  }, [initBoard])

  // Timer
  useEffect(() => {
    let interval
    if (timerActive && gameState === 'playing') {
      interval = setInterval(() => {
        setTime(t => Math.min(t + 1, 999))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timerActive, gameState])

  // Place mines (avoiding first click)
  const placeMines = useCallback((excludeRow, excludeCol) => {
    const newBoard = board.map(row => row.map(cell => ({ ...cell })))
    let placed = 0

    while (placed < config.mines) {
      const row = Math.floor(Math.random() * config.rows)
      const col = Math.floor(Math.random() * config.cols)

      // Don't place on first click or adjacent cells
      const isExcluded = Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1

      if (!newBoard[row][col].mine && !isExcluded) {
        newBoard[row][col].mine = true
        placed++
      }
    }

    // Calculate adjacent mine counts
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!newBoard[row][col].mine) {
          let count = 0
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = row + dr
              const nc = col + dc
              if (nr >= 0 && nr < config.rows && nc >= 0 && nc < config.cols) {
                if (newBoard[nr][nc].mine) count++
              }
            }
          }
          newBoard[row][col].adjacentMines = count
        }
      }
    }

    return newBoard
  }, [board, config.mines, config.rows, config.cols])

  // Flood-fill reveal
  const revealCell = useCallback((boardState, row, col) => {
    if (row < 0 || row >= config.rows || col < 0 || col >= config.cols) return
    const cell = boardState[row][col]
    if (cell.revealed || cell.flagged) return

    cell.revealed = true

    if (cell.adjacentMines === 0 && !cell.mine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealCell(boardState, row + dr, col + dc)
          }
        }
      }
    }
  }, [config.rows, config.cols])

  // Check win condition
  const checkWin = useCallback((boardState) => {
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        const cell = boardState[row][col]
        if (!cell.mine && !cell.revealed) return false
      }
    }
    return true
  }, [config.rows, config.cols])

  // Handle left click
  const handleCellClick = useCallback((row, col) => {
    if (gameState !== 'playing') return

    let currentBoard = board

    if (firstClick) {
      currentBoard = placeMines(row, col)
      setFirstClick(false)
      setTimerActive(true)
    }

    const newBoard = currentBoard.map(r => r.map(c => ({ ...c })))
    const cell = newBoard[row][col]

    if (cell.flagged || cell.revealed) return

    if (cell.mine) {
      // Game over - reveal all mines
      cell.exploded = true
      for (let r = 0; r < config.rows; r++) {
        for (let c = 0; c < config.cols; c++) {
          if (newBoard[r][c].mine) {
            newBoard[r][c].revealed = true
          }
        }
      }
      setBoard(newBoard)
      setGameState('lost')
      setTimerActive(false)
      return
    }

    revealCell(newBoard, row, col)
    setBoard(newBoard)

    if (checkWin(newBoard)) {
      setGameState('won')
      setTimerActive(false)
    }
  }, [board, gameState, firstClick, placeMines, revealCell, checkWin, config.rows, config.cols])

  // Handle right click (flag)
  const handleRightClick = useCallback((e, row, col) => {
    e.preventDefault()
    if (gameState !== 'playing' || firstClick) return

    const newBoard = board.map(r => r.map(c => ({ ...c })))
    const cell = newBoard[row][col]

    if (cell.revealed) return

    cell.flagged = !cell.flagged
    setFlagCount(prev => cell.flagged ? prev + 1 : prev - 1)
    setBoard(newBoard)
  }, [board, gameState, firstClick])

  // Get smiley face based on game state
  const getSmiley = () => {
    if (gameState === 'won') return '😎'
    if (gameState === 'lost') return '😵'
    if (mouseDown) return '😮'
    return '🙂'
  }

  // Get cell display content
  const getCellContent = (cell) => {
    if (!cell.revealed) {
      return cell.flagged ? '🚩' : ''
    }
    if (cell.mine) return '💣'
    if (cell.adjacentMines > 0) return cell.adjacentMines
    return ''
  }

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
    if (e.target.closest('button') || e.target.closest('.menu-area')) return
    handleDragStart(e.clientX, e.clientY)
  }

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('.menu-area')) return
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = () => setMenuOpen(null)
    if (menuOpen) {
      document.addEventListener('click', handleClick)
    }
    return () => document.removeEventListener('click', handleClick)
  }, [menuOpen])

  const handleNewGame = () => {
    initBoard()
    setMenuOpen(null)
  }

  const handleDifficultyChange = (diff) => {
    setDifficulty(diff)
    setMenuOpen(null)
  }

  useEffect(() => {
    initBoard()
  }, [difficulty, initBoard])

  const mineDisplay = String(Math.max(0, config.mines - flagCount)).padStart(3, '0')
  const timeDisplay = String(time).padStart(3, '0')

  return (
    <StyledWindow
      style={{ left: pos.x, top: pos.y, zIndex }}
      onClick={onFocus}
    >
      <Header
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <span>💣 Minesweeper</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <MenuBar className="menu-area">
        <MenuItem onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === 'game' ? null : 'game') }}>
          Game
          {menuOpen === 'game' && (
            <DropdownMenu onClick={e => e.stopPropagation()}>
              <DropdownItem onClick={handleNewGame}>New</DropdownItem>
              <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '2px 0' }} />
              <DropdownItem $checked={difficulty === 'beginner'} onClick={() => handleDifficultyChange('beginner')}>
                Beginner
              </DropdownItem>
              <DropdownItem $checked={difficulty === 'intermediate'} onClick={() => handleDifficultyChange('intermediate')}>
                Intermediate
              </DropdownItem>
              <DropdownItem $checked={difficulty === 'expert'} onClick={() => handleDifficultyChange('expert')}>
                Expert
              </DropdownItem>
            </DropdownMenu>
          )}
        </MenuItem>
        <MenuItem>Help</MenuItem>
      </MenuBar>
      <Content>
        <GameContainer>
          <ControlPanel>
            <LCDDisplay>{mineDisplay}</LCDDisplay>
            <SmileyButton onClick={handleNewGame}>
              {getSmiley()}
            </SmileyButton>
            <LCDDisplay>{timeDisplay}</LCDDisplay>
          </ControlPanel>
          <Grid
            $cols={config.cols}
            onMouseDown={() => setMouseDown(true)}
            onMouseUp={() => setMouseDown(false)}
            onMouseLeave={() => setMouseDown(false)}
          >
            {board.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <Cell
                  key={`${rowIdx}-${colIdx}`}
                  $revealed={cell.revealed}
                  $mine={cell.mine}
                  $exploded={cell.exploded}
                  $number={cell.adjacentMines}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  onContextMenu={(e) => handleRightClick(e, rowIdx, colIdx)}
                  disabled={gameState !== 'playing' && !cell.revealed}
                >
                  {getCellContent(cell)}
                </Cell>
              ))
            )}
          </Grid>
        </GameContainer>
      </Content>
    </StyledWindow>
  )
}

export default Minesweeper
