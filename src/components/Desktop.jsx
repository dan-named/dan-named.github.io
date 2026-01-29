import styled from 'styled-components'

const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-image: url('/wallpaper.jpg');
  background-size: cover;
  background-position: center;
  background-color: #008080;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 12px;
  }
`

const TopIcons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }
`

const BottomIcons = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Icon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 4px;
  cursor: pointer;
  width: 80px;
  user-select: none;
  -webkit-user-select: none;

  @media (max-width: 768px) {
    width: 70px;
    padding: 8px 4px;
  }

  &:hover, &:active {
    .icon-label {
      background: #000080;
      color: white;
    }
  }
`

const IconImage = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  image-rendering: pixelated;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
`

const IconLabel = styled.span`
  color: white;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', Tahoma, sans-serif;
  text-align: center;
  padding: 2px 4px;
  word-wrap: break-word;
  max-width: 76px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 10px;
    max-width: 66px;
  }
`

// Windows 95 style document icon (Notepad/text file)
const DocumentIcon = () => (
  <IconImage>
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ imageRendering: 'pixelated' }}>
      <rect x="8" y="4" width="28" height="40" fill="#FFFFFF" stroke="#000000" strokeWidth="2"/>
      <polygon points="28,4 36,12 28,12" fill="#C0C0C0" stroke="#000000" strokeWidth="1"/>
      <line x1="28" y1="4" x2="28" y2="12" stroke="#000000" strokeWidth="2"/>
      <line x1="28" y1="12" x2="36" y2="12" stroke="#000000" strokeWidth="2"/>
      <rect x="12" y="18" width="20" height="2" fill="#000080"/>
      <rect x="12" y="24" width="18" height="2" fill="#000080"/>
      <rect x="12" y="30" width="20" height="2" fill="#000080"/>
      <rect x="12" y="36" width="12" height="2" fill="#000080"/>
    </svg>
  </IconImage>
)

// Windows 95 style folder icon
const FolderIcon = () => (
  <IconImage>
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ imageRendering: 'pixelated' }}>
      <polygon points="4,12 16,12 20,8 4,8" fill="#FFFF00" stroke="#000000" strokeWidth="2"/>
      <rect x="4" y="12" width="40" height="28" fill="#FFFF00" stroke="#000000" strokeWidth="2"/>
      <rect x="6" y="14" width="36" height="2" fill="#FFFFAA"/>
      <rect x="6" y="36" width="36" height="2" fill="#808000"/>
    </svg>
  </IconImage>
)

// Windows 95 style phone icon
const PhoneIcon = () => (
  <IconImage>
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ imageRendering: 'pixelated' }}>
      <rect x="8" y="8" width="32" height="32" rx="4" fill="#008080" stroke="#000000" strokeWidth="2"/>
      <path d="M12 16 Q12 12 16 12 L20 12 L20 16 L16 20 L16 28 L20 32 L20 36 L16 36 Q12 36 12 32 Z" fill="#000000"/>
      <path d="M36 16 Q36 12 32 12 L28 12 L28 16 L32 20 L32 28 L28 32 L28 36 L32 36 Q36 36 36 32 Z" fill="#000000"/>
      <rect x="20" y="22" width="8" height="4" fill="#000000"/>
      <rect x="18" y="14" width="12" height="8" fill="#C0C0C0" stroke="#000000" strokeWidth="1"/>
      <rect x="20" y="16" width="2" height="2" fill="#000000"/>
      <rect x="24" y="16" width="2" height="2" fill="#000000"/>
      <rect x="20" y="20" width="2" height="1" fill="#000000"/>
      <rect x="24" y="20" width="2" height="1" fill="#000000"/>
    </svg>
  </IconImage>
)

// Windows 95 MS-DOS Prompt icon
const TerminalIcon = () => (
  <IconImage>
    <svg width="48" height="48" viewBox="0 0 48 48" style={{ imageRendering: 'pixelated' }}>
      <rect x="4" y="4" width="40" height="40" fill="#000000" stroke="#C0C0C0" strokeWidth="2"/>
      <rect x="6" y="6" width="36" height="6" fill="#000080"/>
      <rect x="6" y="12" width="36" height="30" fill="#000000"/>
      <text x="8" y="24" fill="#C0C0C0" fontSize="8" fontFamily="monospace">C:\&gt;</text>
      <rect x="28" y="20" width="6" height="8" fill="#C0C0C0"/>
    </svg>
  </IconImage>
)

// Windows 95 Recycle Bin icon (empty) - authentic
const RecycleBinIcon = () => (
  <IconImage>
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect width="8" height="3" x="18" y="6" fill="#e0e0e0"></rect>
      <rect width="3" height="3" x="22" y="5" fill="#e0e0e0"></rect>
      <rect width="4" height="3" x="27" y="6" fill="#e0e0e0"></rect>
      <rect width="4" height="3" x="26" y="7" fill="#e0e0e0"></rect>
      <rect width="4" height="12" x="29" y="7" fill="#e0e0e0"></rect>
      <rect width="4" height="12" x="27" y="9" fill="#e0e0e0"></rect>
      <rect width="4" height="12" x="33" y="13" fill="#e0e0e0"></rect>
      <rect width="4" height="11" x="36" y="14" fill="#e0e0e0"></rect>
      <rect width="3" height="8" x="21.5" y="7.5" fill="#e0e0e0"></rect>
      <polygon fill="#e0e0e0" points="8,9 11,9 27,9 27,46 26,45 26,44 24,44 24,43 22,43 22,42 20,42 20,41 18,41 18,40 16,40 16,39 14,39 14,38 12,38 12,30 11,30 11,25 10,25 10,20 9,20 9,15 8,15"></polygon>
      <polygon fill="#919191" points="27,45 27,19 30,19 30,18 33,18 33,17 37,17 37,16 40,16 36,43 34,43 32,44 29,45"></polygon>
      <polygon fill="#33691e" points="24,21 24,23 23,23 23,22 18,22 18,24 21,24 21,25 20,25 20,26 21,26 24,26 25,26 25,25 25,23 25,21"></polygon>
      <polygon fill="#33691e" points="24,27 24,30 23,30 23,31 20,31 20,29 19,29 19,30 18,30 18,31 17,31 17,33 18,33 18,34 19,34 19,35 20,35 20,33 23,33 24,33 24,32 25,32 25,27"></polygon>
      <polygon fill="#33691e" points="12,23 12,24 13,24 13,25 12,25 12,30 13,30 13,31 14,31 14,32 16,32 16,30 15,30 15,29 14,29 14,26 15,26 15,27 16,27 16,23"></polygon>
      <rect width="3" height="1" x="32" y="43" fill="#212121"></rect>
      <rect width="3" height="1" x="29" y="44" fill="#212121"></rect>
      <rect width="3" height="1" x="26" y="45" fill="#212121"></rect>
      <rect width="2" height="1" x="24" y="44" fill="#212121"></rect>
      <rect width="2" height="1" x="22" y="43" fill="#212121"></rect>
      <rect width="2" height="1" x="20" y="42" fill="#212121"></rect>
      <rect width="2" height="1" x="18" y="41" fill="#212121"></rect>
      <rect width="2" height="1" x="16" y="40" fill="#212121"></rect>
      <rect width="2" height="1" x="14" y="39" fill="#212121"></rect>
      <rect width="2" height="1" x="12" y="38" fill="#212121"></rect>
      <rect width="1" height="5" x="8" y="15" fill="#919191"></rect>
      <rect width="1" height="5" x="9" y="20" fill="#919191"></rect>
      <rect width="1" height="5" x="10" y="25" fill="#919191"></rect>
      <rect width="1" height="8" x="11" y="30" fill="#919191"></rect>
      <polygon fill="#919191" points="9,8 9,9 7,9 7,15 8,15 8,10 9,10 9,12 11,12 11,9 13,9 13,8"></polygon>
      <polygon fill="#919191" points="14,13 14,14 16,14 16,8 18,8 18,7 20,7 20,6 16,6 16,7 13,7 13,8 15,8 15,13"></polygon>
      <rect width="3" height="1" x="11" y="12" fill="#919191"></rect>
      <rect width="3" height="1" x="16" y="14" fill="#919191"></rect>
      <rect width="1" height="3" x="18" y="8" fill="#919191"></rect>
      <rect width="3" height="1" x="19" y="5" fill="#919191"></rect>
      <rect width="3" height="1" x="22" y="4" fill="#919191"></rect>
      <rect width="3" height="1" x="28" y="8" fill="#919191"></rect>
      <rect width="1" height="3" x="28" y="8" fill="#919191"></rect>
      <rect width="3" height="1" x="26" y="11" fill="#919191"></rect>
      <rect width="2" height="1" x="32" y="10" fill="#919191"></rect>
      <rect width="3" height="1" x="31" y="9" fill="#919191"></rect>
      <rect width="3" height="1" x="18" y="10" fill="#919191"></rect>
      <rect width="1" height="5" x="25" y="9" fill="#919191"></rect>
      <rect width="1" height="5" x="24" y="4" fill="#919191"></rect>
      <rect width="3" height="1" x="24" y="6" fill="#919191"></rect>
      <rect width="4" height="1" x="27" y="5" fill="#919191"></rect>
      <rect width="2" height="1" x="31" y="6" fill="#919191"></rect>
      <rect width="1" height="6" x="33" y="7" fill="#919191"></rect>
      <rect width="4" height="1" x="33" y="12" fill="#919191"></rect>
      <rect width="3" height="2" x="34" y="14" fill="#919191"></rect>
      <rect width="1" height="2" x="34" y="14" fill="#919191"></rect>
      <rect width="6" height="1" x="29" y="16" fill="#919191"></rect>
      <rect width="4" height="1" x="37" y="13" fill="#919191"></rect>
      <rect width="1" height="1" x="40" y="14" fill="#919191"></rect>
      <rect width="1" height="3" x="20" y="10" fill="#919191"></rect>
      <rect width="3" height="1" x="20" y="12" fill="#919191"></rect>
      <rect width="1" height="3" x="23" y="12" fill="#919191"></rect>
      <rect width="1" height="3" x="24" y="14" fill="#919191"></rect>
      <rect width="3" height="1" x="19" y="15" fill="#919191"></rect>
      <rect width="4" height="1" x="21" y="16" fill="#919191"></rect>
      <rect width="5" height="1" x="25" y="17" fill="#919191"></rect>
      <rect width="1" height="4" x="8" y="10" fill="#e0e0e0"></rect>
      <rect width="5" height="2" x="25" y="18" fill="#fff"></rect>
      <rect width="4" height="2" x="21" y="17" fill="#fff"></rect>
      <rect width="2" height="2" x="19" y="16" fill="#fff"></rect>
      <rect width="3" height="2" x="16" y="15" fill="#fff"></rect>
      <rect width="2" height="2" x="14" y="14" fill="#fff"></rect>
      <rect width="3" height="2" x="11" y="13" fill="#fff"></rect>
      <rect width="3" height="2" x="8" y="12" fill="#fff"></rect>
      <rect width="1" height="2" x="8" y="10" fill="#fff"></rect>
      <rect width="4" height="2" x="30" y="17" fill="#fff"></rect>
      <rect width="3" height="2" x="34" y="16" fill="#fff"></rect>
      <rect width="4" height="2" x="36" y="14" fill="#fff"></rect>
      <polygon fill="#212121" points="39,14 39,20 38,20 38,25 37,25 37,30 36,30 36,38 35,38 35,43 37,43 37,38 38,38 38,30 39,30 39,25 40,25 40,20 41,20 41,14"></polygon>
      <polygon fill="#fff" points="26,10 28,10 28,8 31,8 31,9 33,9 33,7 31,7 31,6 27,6 27,7 25,7 25,9 26,9"></polygon>
      <polygon fill="#fff" points="25,15 29,15 29,13 31,13 31,12 33,12 33,11 32,11 32,10 31,10 31,9 29,9 29,12 26,12 26,14 25,14"></polygon>
      <polygon fill="#fff" points="11,12 11,9 13,9 13,8 15,8 15,13 14,13 14,12"></polygon>
      <polygon fill="#fff" points="24,15 24,16 22,16 22,15 19,15 19,14 16,14 16,8 18,8 18,11 20,11 20,13 23,13 23,15"></polygon>
      <polygon fill="#fff" points="19,9 21,9 21,10 23,10 23,11 25,11 25,9 24,9 24,5 22,5 22,6 20,6 20,7 18,7 18,8 19,8"></polygon>
    </svg>
  </IconImage>
)

// Icon definitions - top left
const topIcons = [
  { id: 'aboutMe', label: 'DAN.txt', IconComponent: DocumentIcon },
  { id: 'portfolio', label: 'Portfolio', IconComponent: FolderIcon },
  { id: 'call', label: 'Book a Call', IconComponent: PhoneIcon },
  { id: 'terminal', label: 'Terminal', IconComponent: TerminalIcon },
]

function Desktop({ onOpenWindow }) {
  const handleClick = (id) => {
    onOpenWindow(id)
  }

  return (
    <DesktopContainer>
      <TopIcons>
        {topIcons.map(icon => (
          <Icon key={icon.id} onClick={() => handleClick(icon.id)}>
            <icon.IconComponent />
            <IconLabel className="icon-label">{icon.label}</IconLabel>
          </Icon>
        ))}
      </TopIcons>
      <BottomIcons>
        <Icon onClick={() => handleClick('recycleBin')}>
          <RecycleBinIcon />
          <IconLabel className="icon-label">Recycle Bin</IconLabel>
        </Icon>
      </BottomIcons>
    </DesktopContainer>
  )
}

export default Desktop
