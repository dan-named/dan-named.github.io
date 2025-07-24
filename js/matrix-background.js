/**
 * VS Code-Style Binary Matrix Rain Background
 * Mathematical design pattern with ASCII art logo formation
 * 
 * Features:
 * - Dynamic binary matrix rain effect
 * - Dan AI logo formation using ASCII art
 * - Performance-optimized Canvas rendering
 * - Responsive grid calculation
 * - Accessibility support
 */

class MatrixBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Grid dimensions and character sizing
        this.charWidth = 12;
        this.charHeight = 16;
        this.columns = 0;
        this.rows = 0;
        
        // Animation and timing
        this.time = 0;
        this.lastUpdate = 0;
        this.fps = 60;
        this.fpsMonitor = {
            frames: 0,
            lastTime: performance.now(),
            currentFps: 60
        };
        
        // Grid data structure
        this.grid = [];
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        
        // Configuration
        this.config = {
            changeRate: 0.005,           // 0.5% chance per frame
            binaryProbability: 0.7,      // 70% binary, 30% ASCII
            logoGlowIntensity: 5,        // Glow blur radius
            backgroundOpacity: 0.95,     // Trail effect opacity
            updateInterval: 16           // ~60fps
        };
        
        // Check for reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.reducedMotion) {
            this.config.changeRate = 0.001;     // Much slower updates
            this.config.updateInterval = 100;   // Lower FPS
        }
        
        // Color system
        this.colors = {
            background: '#0a0a0a',
            binary: 'rgba(0, 215, 255, 0.15)',
            logo: '#00d4ff',
            highlight: '#ffffff',
            logoGlow: '#00d4ff'
        };
        
        // Dan AI ASCII Logo Pattern
        this.logoPattern = [
            "    ██████    ",
            "  ██████████  ",
            " ████████████ ",
            "██████████████",
            "██  ██████  ██",
            "██  ██████  ██",
            "██  ████████  ",
            "██   ██████   ",
            "██    ████    ",
            "██     ██     "
        ];
        
        this.init();
        this.createOffscreenCanvas();
        this.calculateGrid();
        this.initializeGrid();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
        
        // Performance monitoring
        this.monitorPerformance();
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set canvas context properties
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';
        this.ctx.font = `${this.charHeight - 2}px "SF Mono", "Monaco", "Inconsolata", "Consolas", monospace`;
    }
    
    createOffscreenCanvas() {
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.offscreenCtx.textBaseline = 'top';
        this.offscreenCtx.textAlign = 'left';
        this.offscreenCtx.font = `${this.charHeight - 2}px "SF Mono", "Monaco", "Inconsolata", "Consolas", monospace`;
    }
    
    calculateGrid() {
        this.columns = Math.floor(this.canvas.width / this.charWidth);
        this.rows = Math.floor(this.canvas.height / this.charHeight);
    }
    
    initializeGrid() {
        this.grid = [];
        
        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.columns; col++) {
                this.grid[row][col] = {
                    char: this.getRandomCharacter(),
                    type: 'binary',
                    opacity: Math.random() * 0.3 + 0.1,
                    lastUpdate: 0,
                    pulsePhase: Math.random() * Math.PI * 2
                };
            }
        }
        
        // Apply logo pattern
        this.applyLogoPattern();
    }
    
    applyLogoPattern() {
        const centerX = Math.floor(this.columns / 2);
        const centerY = Math.floor(this.rows / 2);
        const logoWidth = this.logoPattern[0].length;
        const logoHeight = this.logoPattern.length;
        const startX = centerX - Math.floor(logoWidth / 2);
        const startY = centerY - Math.floor(logoHeight / 2);
        
        for (let logoY = 0; logoY < logoHeight; logoY++) {
            for (let logoX = 0; logoX < logoWidth; logoX++) {
                const gridX = startX + logoX;
                const gridY = startY + logoY;
                
                if (gridX >= 0 && gridX < this.columns && 
                    gridY >= 0 && gridY < this.rows) {
                    
                    const logoChar = this.logoPattern[logoY][logoX];
                    
                    if (logoChar !== ' ') {
                        this.grid[gridY][gridX] = {
                            char: logoChar,
                            type: 'logo',
                            opacity: 1.0,
                            lastUpdate: this.time,
                            pulsePhase: Math.random() * Math.PI * 2
                        };
                    }
                }
            }
        }
    }
    
    getRandomCharacter() {
        if (Math.random() < this.config.binaryProbability) {
            return Math.random() < 0.5 ? '0' : '1';
        } else {
            const asciiChars = ['*', '#', '=', '%', '-', '+', 'x', '~', '|', '/', '\\'];
            return asciiChars[Math.floor(Math.random() * asciiChars.length)];
        }
    }
    
    updateGrid() {
        const currentTime = this.time;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                
                // Skip logo cells for character updates
                if (cell.type === 'logo') {
                    // Only update pulse phase for logo cells
                    cell.pulsePhase += 0.02;
                    continue;
                }
                
                // Random character updates
                if (Math.random() < this.config.changeRate) {
                    cell.char = this.getRandomCharacter();
                    cell.lastUpdate = currentTime;
                    cell.opacity = Math.random() * 0.4 + 0.1;
                }
                
                // Update pulse phase for visual interest
                cell.pulsePhase += 0.01;
                
                // Occasional highlight effect
                if (Math.random() < 0.0001) { // Very rare highlights
                    cell.type = 'highlight';
                    cell.opacity = 1.0;
                    setTimeout(() => {
                        if (cell.type === 'highlight') {
                            cell.type = 'binary';
                            cell.opacity = Math.random() * 0.3 + 0.1;
                        }
                    }, 1000 + Math.random() * 2000);
                }
            }
        }
    }
    
    render() {
        // Clear offscreen canvas with slight trail effect
        this.offscreenCtx.fillStyle = this.colors.background;
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Render all characters
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                const x = col * this.charWidth;
                const y = row * this.charHeight;
                
                this.renderCharacter(cell, x, y);
            }
        }
        
        // Copy offscreen canvas to main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
    
    renderCharacter(cell, x, y) {
        const ctx = this.offscreenCtx;
        let fillStyle, shadowBlur = 0, shadowColor = 'transparent';
        
        // Calculate pulsing opacity
        const pulseEffect = 0.8 + Math.sin(cell.pulsePhase) * 0.2;
        const finalOpacity = cell.opacity * pulseEffect;
        
        switch (cell.type) {
            case 'logo':
                fillStyle = this.colors.logo;
                shadowBlur = this.config.logoGlowIntensity;
                shadowColor = this.colors.logoGlow;
                break;
                
            case 'highlight':
                fillStyle = this.colors.highlight;
                shadowBlur = 3;
                shadowColor = this.colors.highlight;
                break;
                
            default: // binary
                const alpha = Math.max(0.05, Math.min(0.3, finalOpacity));
                fillStyle = `rgba(0, 215, 255, ${alpha})`;
                break;
        }
        
        // Apply shadow/glow effect
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.fillStyle = fillStyle;
        
        // Render character
        ctx.fillText(cell.char, x, y);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    animate() {
        const currentTime = performance.now();
        
        // FPS control
        if (currentTime - this.lastUpdate >= this.config.updateInterval) {
            this.time = currentTime;
            this.updateGrid();
            this.render();
            this.lastUpdate = currentTime;
            
            // FPS monitoring
            this.updateFPSMonitor(currentTime);
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateFPSMonitor(currentTime) {
        this.fpsMonitor.frames++;
        
        if (currentTime - this.fpsMonitor.lastTime >= 1000) {
            this.fpsMonitor.currentFps = this.fpsMonitor.frames;
            this.fpsMonitor.frames = 0;
            this.fpsMonitor.lastTime = currentTime;
            
            // Adaptive performance adjustment
            if (this.fpsMonitor.currentFps < 30) {
                this.config.updateInterval = Math.min(32, this.config.updateInterval + 2);
            } else if (this.fpsMonitor.currentFps > 55) {
                this.config.updateInterval = Math.max(12, this.config.updateInterval - 1);
            }
        }
    }
    
    monitorPerformance() {
        // Performance monitoring for debugging
        setInterval(() => {
            console.log(`Matrix FPS: ${this.fpsMonitor.currentFps}, Update Interval: ${this.config.updateInterval}ms`);
        }, 5000);
    }
    
    handleResize() {
        // Update canvas dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate offscreen canvas
        this.createOffscreenCanvas();
        
        // Recalculate grid
        const oldColumns = this.columns;
        const oldRows = this.rows;
        this.calculateGrid();
        
        // Only reinitialize if dimensions changed significantly
        if (Math.abs(this.columns - oldColumns) > 2 || Math.abs(this.rows - oldRows) > 2) {
            this.initializeGrid();
        }
        
        // Update font size for new context
        this.ctx.font = `${this.charHeight - 2}px "SF Mono", "Monaco", "Inconsolata", "Consolas", monospace`;
        this.offscreenCtx.font = `${this.charHeight - 2}px "SF Mono", "Monaco", "Inconsolata", "Consolas", monospace`;
    }
    
    // Utility function for debouncing resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API for external control
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    
    updateColors(newColors) {
        this.colors = { ...this.colors, ...newColors };
    }
    
    // Clean up resources
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        // Stop animation loop would require additional tracking
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixBackground;
}

// Global assignment for direct script inclusion
if (typeof window !== 'undefined') {
    window.MatrixBackground = MatrixBackground;
}