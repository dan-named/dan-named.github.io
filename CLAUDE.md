# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Professional portfolio website for Dan Nazarov (DataAI.com) showcasing chatbot development and automation expertise. This is a responsive, cyberpunk-themed static site hosted at `dan-ai.com` via GitHub Pages.

## Repository Structure

- `index.html` - Complete single-page application with embedded CSS and JavaScript
- `CNAME` - Custom domain configuration for GitHub Pages (`dan-ai.com`)
- `CLAUDE.md` - This guidance file

## Development Commands

This is a static site with no build system or dependencies. Changes deploy automatically when pushed to the main branch through GitHub Pages.

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

When updating content:
1. All styling is embedded in the `<style>` section of index.html
2. CSS variables at the top control colors, spacing, and responsive breakpoints
3. JavaScript is minimal and embedded at the bottom
4. Maintain mathematical proportions when adding new elements
5. Test across mobile, tablet, and desktop breakpoints
6. Ensure new content follows the cyberpunk color scheme

## Content Guidelines

- **Professional Tone**: Technical expertise with approachable language
- **Festival Chatbot**: Key portfolio piece - 5 festivals, 33 kimono tracking system
- **International Focus**: English-language targeting for global clients
- **Contact**: Primary CTA is email (dan@dataai.com)
- **Agency Partnership**: Mention collaboration opportunities

The site is designed to be easily maintainable as a single file while providing a professional, modern presentation that effectively showcases chatbot development expertise.