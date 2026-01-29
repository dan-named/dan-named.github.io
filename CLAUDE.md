# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Plan & Review

### Before starting work
- Always enter plan mode first.
- Write the plan to `.claude/tasks/TASK_NAME.md`.
- The plan should include detailed implementation steps, reasoning, and task breakdown.
- Research external packages/knowledge when needed (use Task tool).
- Think MVP - don't over-plan.
- Ask for review before proceeding. Do not continue until plan is approved.

## Project Overview

Personal portfolio website for Dan AI (dan-ai.com) with Windows 95 retro aesthetic, hosted on GitHub Pages.

## Tech Stack

- **React 18** + **Vite** - Build tooling
- **React95** - Windows 95 UI component library
- **styled-components** - CSS-in-JS styling
- **GitHub Pages** - Hosting (custom domain: dan-ai.com)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
```

## Deployment

GitHub Pages deploys from the `dist/` folder or via GitHub Actions. CNAME file configures `dan-ai.com`.

## Architecture

```
src/
├── components/
│   ├── Desktop.jsx       # Main desktop with draggable icons
│   ├── Taskbar.jsx       # Windows 95 taskbar with Start menu
│   └── windows/
│       ├── AboutMe.jsx   # Bio/introduction window
│       ├── Portfolio.jsx # Project showcase window
│       └── CallWindow.jsx # Cal.com booking embed
├── App.jsx               # Root component, window state management
└── main.jsx              # Entry point with React95 theme provider
```

## Key Integrations

- **Cal.com**: Booking widget embedded via iframe (`cal.com/dan-named/quick-start`)

## React95 Notes

- Wrap app in `<ThemeProvider theme={original}>` from react95
- Import `react95/dist/fonts/ms_sans_serif.woff2` for authentic fonts
- Window components: `<Window>`, `<WindowHeader>`, `<WindowContent>`
- Use `<Button>`, `<Toolbar>`, `<List>` for UI elements
