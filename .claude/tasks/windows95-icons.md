# Windows 95 Icons & System Tray Enhancement

## Goal
Transform the current macOS-style icons back to authentic Windows 95 pixel-art style, make them bigger, add Windows logo to START button, and create a proper system tray with icons.

## Current State
- Icons are macOS "Liquid Glass" style with rounded corners and gradients
- START button uses emoji 🪟 instead of Windows 95 logo
- Clock is simple, no system tray icons

## Implementation Plan

### 1. Update Desktop Icons to Windows 95 Style
Replace `GlassIcon` components with pixel-art Windows 95 icons:
- **My Computer** style for DAN.md → classic document icon
- **Folder** style for PORTFOLIO.md → classic folder icon
- **Phone/Call** icon → classic phone receiver
- **MS-DOS** prompt style for Terminal
- **Application** icons for Claude/Obsidian

Make icons bigger: 48x48 → 64x64 or 80x80

### 2. Add Windows 95 Logo to START Button
Create authentic Windows 95 "waving flag" logo SVG:
- 4-color flag (red, green, blue, yellow)
- Placed before "Start" text

### 3. Create System Tray (Right side of taskbar)
Add `SystemTray` component with:
- Network icon (two connected computers)
- Volume/speaker icon
- Claude Code icon (terminal with sparkle)
- Separator between tray icons and clock

### 4. Styling
- Remove rounded corners (Windows 95 has square icons)
- Add pixel-art appearance with sharp edges
- Use classic Windows 95 color palette
- Add selection highlight (dark blue background with white text)

## Files to Modify
- `src/components/Desktop.jsx` - Replace icon components
- `src/components/Taskbar.jsx` - Add Windows logo + System tray

## Icon References
Classic Windows 95 icons are 32x32 pixels with:
- 16-color palette
- Black outlines
- Simple geometric shapes
- No gradients or shadows
