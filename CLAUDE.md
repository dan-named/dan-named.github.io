# CLAUDE.md

## Plan & Review

### Before starting work
-  Always in plan mode to make a plan.
-  After getting the plan, make sure you write the plan to `.claude/tasks/TASK_NAME.md`.
-  The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
-  If the task requires external knowledge or certain packages, also research to get the latest knowledge (Use Task tool for research).
-  Don't over plan it; always think MVP.
-  Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional portfolio website for Dan Nazarov (DataAI.com) showcasing chatbot development and automation expertise. This is a responsive, cyberpunk-themed static site hosted at `dan-ai.com` via GitHub Pages.

## Repository Structure

- `index.html` - Complete single-page application with embedded CSS and JavaScript
- `CNAME` - Custom domain configuration for GitHub Pages (`dan-ai.com`)
- `CLAUDE.md` - This guidance file

## Development Commands

This is a static site with no build system or dependencies. Changes deploy automatically when pushed to the main branch through GitHub Pages.

**Common Operations:**
- **Local Development**: Open `index.html` directly in browser or use `python3 -m http.server 8000` for local server
- **Deployment**: Push to main branch - GitHub Pages automatically deploys from root directory
- **Testing**: Test responsiveness at mobile (320px), tablet (768px), and desktop (1200px+) breakpoints
- **Domain**: Custom domain `dan-ai.com` configured via CNAME file

## Architecture & Design System

### Mathematical Design Principles
- **Golden Ratio**: 1.618 used throughout for proportions and spacing
- **Fibonacci Sequence**: Applied to spacing system (8px, 13px, 21px, 34px, 55px, 89px)
- **CSS Grid**: Mathematical precision for responsive layouts
- **Responsive Breakpoints**: Mobile (320px-767px), Tablet (768px-1199px), Desktop (1200px+)

### Cyberpunk Aesthetic
- **Color System**: Purple gradients (#6B46C1, #8B5CF6, #A855F7) with neon accents (#00FFFF, #FF00FF, #39FF14)
- **Typography**: Orbitron (headings) and Rajdhani (body) from Google Fonts
- **Animations**: Subtle CSS animations with performance optimization
- **Dark Theme**: Deep space backgrounds (#0F0F23, #1E1E3F)

### Performance Optimizations
- **Inline CSS/JS**: Everything embedded for minimal HTTP requests
- **Preconnect**: Google Fonts optimization
- **Reduced Motion**: Accessibility support for animation preferences
- **Intersection Observer**: Lazy animation triggers
- **Mobile-First**: Optimized for low-power devices

### Content Structure
1. **Hero Section**: Professional introduction with animated gradient text
2. **Expertise**: Three-column grid of core competencies
3. **Portfolio**: Festival chatbot case study (5 festivals, 33 kimono tracking)
4. **Services**: Four service offerings in responsive grid
5. **Contact**: Professional contact information and inquiry prompt

### Accessibility Features
- **Semantic HTML5**: Proper heading hierarchy and ARIA labels
- **Skip Links**: Keyboard navigation support
- **Focus Indicators**: High-contrast focus styles
- **Screen Readers**: Comprehensive alt text and descriptions
- **Color Contrast**: WCAG AA compliance

### SEO Implementation
- **Meta Tags**: Title, description, keywords, author
- **Open Graph**: Facebook sharing optimization
- **Twitter Cards**: Social media preview support
- **Structured Data**: Professional portfolio markup

## Making Changes

**File Structure:**
- **Single File Architecture**: Everything is contained in `index.html` for optimal performance
- **CSS Location**: All styles in `<style>` section (lines 27-405)
- **JavaScript Location**: Minimal JS at bottom (lines 550-586)
- **CSS Variables**: Design system controlled via CSS custom properties (lines 29-67)

**When updating content:**
1. **Styling**: All styling is embedded in the `<style>` section of index.html
2. **Design System**: CSS variables at the top control colors, spacing, and responsive breakpoints
3. **JavaScript**: Minimal and embedded at the bottom - only smooth scrolling and intersection observer
4. **Mathematical Proportions**: Maintain golden ratio (1.618) and Fibonacci spacing when adding elements
5. **Responsive Testing**: Test across mobile (320px), tablet (768px), and desktop (1200px+) breakpoints
6. **Color Scheme**: Ensure new content follows cyberpunk purple/cyan/magenta theme
7. **Performance**: Keep everything inline to minimize HTTP requests

## Content Guidelines

- **Professional Tone**: Technical expertise with approachable language
- **Festival Chatbot**: Key portfolio piece - 5 festivals, 33 kimono tracking system
- **International Focus**: English-language targeting for global clients
- **Contact**: Primary CTA is email (dan@dataai.com)
- **Agency Partnership**: Mention collaboration opportunities

The site is designed to be easily maintainable as a single file while providing a professional, modern presentation that effectively showcases chatbot development expertise.

## Key Technical Details

**CSS Architecture:**
- **Design System**: CSS custom properties define the entire design system (colors, spacing, typography)
- **Grid System**: Mathematical CSS Grid with golden ratio proportions
- **Animation System**: Performance-optimized CSS animations with reduced motion support
- **Mobile-First**: Responsive design prioritizing mobile performance

**JavaScript Functionality:**
- **Smooth Scrolling**: Navigation link click handlers for smooth page transitions
- **Intersection Observer**: Performance-optimized fade-in animations for cards
- **Progressive Enhancement**: All features work without JavaScript

**Performance Features:**
- **Inline Everything**: CSS and JS embedded to eliminate HTTP requests
- **Font Optimization**: Google Fonts with preconnect for faster loading
- **Accessibility**: WCAG AA compliance with skip links and focus indicators
- **SEO**: Complete meta tag implementation with Open Graph and Twitter Cards