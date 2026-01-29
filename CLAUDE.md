# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Daniel Vasilyeu (dan-ai.com) with Windows 95 retro aesthetic, hosted on GitHub Pages.

## Tech Stack

- **React 18** + **Vite** - Build tooling
- **React95** - Windows 95 UI component library
- **styled-components** - CSS-in-JS styling
- **GitHub Pages** - Hosting via GitHub Actions

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

## Deployment

Push to `main` triggers GitHub Actions workflow (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages.

## Architecture

### Window Management (App.jsx)

- `openWindows` - Array of currently open window IDs
- `windowOrder` - Separate array for z-index stacking order
- `focusWindow()` - Brings window to front by moving it to end of `windowOrder`
- `WINDOWS` config object maps window IDs to components and props

### Content System

Editable text files in `src/content/` are imported as raw strings (`?raw`) and rendered as HTML in Notepad windows:

```
src/content/
├── desktop/
│   └── dan.txt              → DAN.txt icon on desktop
└── portfolio/
    ├── builder/             → Files in Portfolio > builder folder
    └── educator/            → Files in Portfolio > educator folder
```

**Content supports HTML**: `<b>`, `<a href="..." target="_blank">`, bullet points (•), arrows (→)

### Key Components

- **Desktop.jsx** - Desktop icons (top-left) and Recycle Bin (bottom-right absolute positioned)
- **Taskbar.jsx** - Start menu, window buttons, system tray with clock
- **Portfolio.jsx** - Windows Explorer-style folder navigation with `FOLDER_STRUCTURE` config
- **Notepad.jsx** - Renders HTML content via `dangerouslySetInnerHTML`
- **Terminal.jsx** - Animated typing script about Dan AI
- **CallWindow.jsx** - Cal.com booking iframe

### Window Dragging

All windows implement touch + mouse drag via:
- `handleMouseDown` / `handleTouchStart` on header
- Global `mousemove`/`touchmove` listeners during drag
- Position stored in component state + parent via `onPositionChange`

## React95 Notes

- Wrap app in `<ThemeProvider theme={original}>` from react95
- Import fonts from `react95/dist/fonts/ms_sans_serif.woff2`
- Window components: `<Window>`, `<WindowHeader>`, `<WindowContent>`
