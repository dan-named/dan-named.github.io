import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Window, WindowHeader, Button } from 'react95'

const StyledWindow = styled(Window)`
  position: absolute;
  width: 600px;
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
  background: #000080;
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

const Screen = styled.div`
  background: #000000;
  color: #00FF00;
  font-family: 'Courier New', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 12px;
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 11px;
    min-height: 300px;
    max-height: 350px;
    padding: 8px;
    line-height: 1.4;
  }
`

const Cursor = styled.span`
  animation: blink 1s step-end infinite;

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`

const SCRIPT = [
  { type: 'output', text: 'Welcome to Dan AI Terminal', delay: 0 },
  { type: 'output', text: '══════════════════════════════════════════\n', delay: 100 },
  { type: 'command', text: '$ whoami', delay: 300 },
  { type: 'output', text: 'Dan AI - AI Developer & Automation Expert\nTransforming events and businesses through intelligent automation since 2020\n', delay: 100 },
  { type: 'command', text: '$ cat about.txt', delay: 500 },
  { type: 'output', text: `I build AI-powered solutions that automate complex workflows,
create intelligent chatbots, and streamline business operations.

From festival management systems handling thousands of attendees
to custom automation pipelines for growing businesses.

I believe in practical AI that solves real problems,
not hype - just results that matter.\n`, delay: 100 },
  { type: 'command', text: '$ ls services/', delay: 500 },
  { type: 'output', text: 'ai-chatbots/  automation/  event-systems/  integrations/\n', delay: 100 },
  { type: 'command', text: '$ cat services/ai-chatbots.txt', delay: 400 },
  { type: 'output', text: `AI Chatbots & Virtual Assistants
• Custom conversational AI for customer support
• Telegram, WhatsApp, and web integrations
• Multi-language support with context awareness
• Knowledge base integration for smart responses\n`, delay: 100 },
  { type: 'command', text: '$ cat services/automation.txt', delay: 400 },
  { type: 'output', text: `Business Process Automation
• Workflow automation with n8n, Make, Zapier
• Data pipeline orchestration
• Report generation and scheduling
• CRM and tool integrations\n`, delay: 100 },
  { type: 'command', text: '$ cat services/event-systems.txt', delay: 400 },
  { type: 'output', text: `Event Management Systems
• Real-time inventory tracking
• Automated scheduling & notifications
• Attendee management and check-in
• Analytics dashboards for insights\n`, delay: 100 },
  { type: 'command', text: '$ cat stack.txt', delay: 400 },
  { type: 'output', text: `Tech Stack:
Claude AI • OpenAI • Python • Node.js • React
n8n • Make • Airtable • Notion • Telegram API\n`, delay: 100 },
  { type: 'command', text: '$ ./contact', delay: 500 },
  { type: 'output', text: `\n══════════════════════════════════════════
Ready to automate? Let's talk!

📧 LinkedIn: linkedin.com/in/vasilyeu/
📞 Book a call: cal.com/dan-named/quick-start
══════════════════════════════════════════\n`, delay: 100 },
  { type: 'command', text: '$ _', delay: 300, cursor: true },
]

function Terminal({ title, onClose, onFocus, isFocused, zIndex, position, onPositionChange }) {
  const [pos, setPos] = useState(position || { x: 100, y: 60 })
  const [isDragging, setIsDragging] = useState(false)
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const screenRef = useRef(null)

  useEffect(() => {
    if (position) setPos(position)
  }, [position])

  // Typing animation effect
  useEffect(() => {
    if (currentIndex >= SCRIPT.length) {
      setShowCursor(true)
      return
    }

    const item = SCRIPT[currentIndex]
    const timeout = setTimeout(() => {
      setDisplayedLines(prev => [...prev, item])
      setCurrentIndex(prev => prev + 1)
    }, item.delay + (item.type === 'command' ? 200 : 50))

    return () => clearTimeout(timeout)
  }, [currentIndex])

  // Auto-scroll to bottom
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight
    }
  }, [displayedLines])

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
        <span style={{ color: 'white' }}>Terminal</span>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      <Screen ref={screenRef}>
        {displayedLines.map((line, index) => (
          <div key={index} style={{ color: line.type === 'command' ? '#FFFF00' : '#00FF00' }}>
            {line.text}
          </div>
        ))}
        {showCursor && <Cursor>█</Cursor>}
      </Screen>
    </StyledWindow>
  )
}

export default Terminal
