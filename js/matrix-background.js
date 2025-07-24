/**
 * Advanced Mathematical Art Background System
 * Complex flowing forms with gradient character distribution
 * 
 * Features:
 * - Organic flowing forms using metaball physics
 * - Gradient character distribution: * (center) → # (mid) → % (edge)
 * - Dynamic color system with smooth HSL transitions
 * - Performance-optimized with spatial calculations
 * - Dan AI logo integration as attractor point
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
        this.deltaTime = 0;
        
        // Core systems
        this.grid = [];
        this.flowingForms = [];
        this.logoAttractor = null;
        this.offscreenCanvas = null;
        this.offscreenCtx = null;
        
        // Performance monitoring
        this.fpsMonitor = {
            frames: 0,
            lastTime: performance.now(),
            currentFps: 60
        };
        
        // Configuration
        this.config = {
            numForms: 4,                 // Number of flowing forms
            updateInterval: 16,          // ~60fps
            formSpeed: 0.5,             // Movement speed
            attractorStrength: 50,       // Logo attraction force
            noiseScale: 0.003,          // Perlin noise scale
            colorShiftSpeed: 0.1,       // Color change rate
            transitionSmoothness: 0.15   // Character transition width
        };
        
        // Check for reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.reducedMotion) {
            this.config.formSpeed *= 0.3;
            this.config.colorShiftSpeed *= 0.5;
            this.config.updateInterval = 33; // 30fps
        }
        
        // Dan AI ASCII Logo Pattern (simplified for attractor)
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
        this.initializeNoise();
        this.createOffscreenCanvas();
        this.calculateGrid();
        this.initializeGrid();
        this.initializeFlowingForms();
        this.initializeLogoAttractor();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }
    
    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Set canvas context properties
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';
        this.ctx.font = `${this.charHeight - 2}px "SF Mono", "Monaco", "Inconsolata", "Consolas", monospace`;
    }
    
    // Simplified Perlin noise implementation
    initializeNoise() {
        // Create permutation table for Perlin noise
        this.permutation = [];
        for (let i = 0; i < 256; i++) {
            this.permutation[i] = i;
        }
        
        // Shuffle permutation table
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.permutation[i], this.permutation[j]] = [this.permutation[j], this.permutation[i]];
        }
        
        // Duplicate for easy overflow handling
        for (let i = 0; i < 256; i++) {
            this.permutation[256 + i] = this.permutation[i];
        }
    }
    
    // Perlin noise function
    noise3D(x, y, z) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        
        const A = this.permutation[X] + Y;
        const AA = this.permutation[A] + Z;
        const AB = this.permutation[A + 1] + Z;
        const B = this.permutation[X + 1] + Y;
        const BA = this.permutation[B] + Z;
        const BB = this.permutation[B + 1] + Z;
        
        return this.lerp(w,
            this.lerp(v,
                this.lerp(u, this.grad(this.permutation[AA], x, y, z),
                             this.grad(this.permutation[BA], x - 1, y, z)),
                this.lerp(u, this.grad(this.permutation[AB], x, y - 1, z),
                             this.grad(this.permutation[BB], x - 1, y - 1, z))),
            this.lerp(v,
                this.lerp(u, this.grad(this.permutation[AA + 1], x, y, z - 1),
                             this.grad(this.permutation[BA + 1], x - 1, y, z - 1)),
                this.lerp(u, this.grad(this.permutation[AB + 1], x, y - 1, z - 1),
                             this.grad(this.permutation[BB + 1], x - 1, y - 1, z - 1))));
    }
    
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }
    
    lerp(t, a, b) {
        return a + t * (b - a);
    }
    
    grad(hash, x, y, z) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
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
                const x = col * this.charWidth;
                const y = row * this.charHeight;
                
                this.grid[row][col] = {
                    char: Math.random() < 0.5 ? '0' : '1',
                    x: x,
                    y: y,
                    col: col,
                    row: row,
                    influence: 0,
                    color: '#004466',
                    lastUpdate: 0,
                    noiseOffset: Math.random() * 1000
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
                        this.grid[gridY][gridX].char = logoChar;
                        this.grid[gridY][gridX].isLogo = true;
                        this.grid[gridY][gridX].color = '#00d4ff';
                    }
                }
            }
        }
    }
    
    initializeFlowingForms() {
        this.flowingForms = [];
        
        for (let i = 0; i < this.config.numForms; i++) {
            const form = new FlowingForm(
                Math.random() * this.canvas.width,
                Math.random() * this.canvas.height,
                100 + Math.random() * 150,  // radius
                this.config.formSpeed * (0.5 + Math.random()),
                Math.random() * 360,        // color hue
                Math.random() * 1000        // noise offset
            );
            
            this.flowingForms.push(form);
        }
    }
    
    initializeLogoAttractor() {
        const centerX = (this.columns / 2) * this.charWidth;
        const centerY = (this.rows / 2) * this.charHeight;
        
        this.logoAttractor = new LogoAttractor(
            { x: centerX, y: centerY },
            this.config.attractorStrength
        );
    }
    
    updateFlowingForms() {
        this.flowingForms.forEach(form => {
            // Update position using Perlin noise
            form.updatePosition(this.time, this.config.noiseScale, this.canvas.width, this.canvas.height);
            
            // Apply logo attraction
            if (this.logoAttractor) {
                this.logoAttractor.attractForm(form, this.deltaTime);
            }
            
            // Update color hue
            form.colorHue = (form.colorHue + this.config.colorShiftSpeed * this.deltaTime * 0.01) % 360;
        });
    }
    
    calculateInfluenceGrid() {
        // Reset all influences
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.grid[row][col].influence = 0;
            }
        }
        
        // Calculate influence from each form
        this.flowingForms.forEach(form => {
            const startCol = Math.max(0, Math.floor((form.x - form.radius) / this.charWidth));
            const endCol = Math.min(this.columns - 1, Math.floor((form.x + form.radius) / this.charWidth));
            const startRow = Math.max(0, Math.floor((form.y - form.radius) / this.charHeight));
            const endRow = Math.min(this.rows - 1, Math.floor((form.y + form.radius) / this.charHeight));
            
            for (let row = startRow; row <= endRow; row++) {
                for (let col = startCol; col <= endCol; col++) {
                    const cell = this.grid[row][col];
                    const influence = form.calculateInfluence(cell.x + this.charWidth/2, cell.y + this.charHeight/2);
                    
                    // Take maximum influence from all forms
                    cell.influence = Math.max(cell.influence, influence);
                    
                    // Store dominant form for color calculations
                    if (influence > 0.1) {
                        cell.dominantForm = form;
                    }
                }
            }
        });
    }
    
    updateGridCharactersAndColors() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                
                // Skip logo cells
                if (cell.isLogo) {
                    cell.color = `hsl(180, 100%, ${70 + Math.sin(this.time * 0.005) * 10}%)`;
                    continue;
                }
                
                // Calculate character based on influence with noise for smooth transitions
                const noiseValue = this.noise3D(
                    col * 0.1, 
                    row * 0.1, 
                    this.time * 0.001
                ) * 0.5 + 0.5;
                
                const adjustedInfluence = cell.influence + (noiseValue - 0.5) * this.config.transitionSmoothness;
                
                // Determine character based on influence
                if (adjustedInfluence > 0.7) {
                    cell.char = '*';
                } else if (adjustedInfluence > 0.3) {
                    cell.char = '#';
                } else if (adjustedInfluence > 0.1) {
                    cell.char = '%';
                } else {
                    // Dynamic binary background
                    const binaryNoise = this.noise3D(
                        col * 0.05 + this.time * 0.0001,
                        row * 0.05,
                        this.time * 0.0002
                    );
                    
                    if (Math.abs(binaryNoise) > 0.4) {
                        cell.char = Math.random() < 0.5 ? '0' : '1';
                    }
                }
                
                // Calculate color
                cell.color = this.calculateCellColor(cell, adjustedInfluence);
            }
        }
    }
    
    calculateCellColor(cell, influence) {
        if (cell.char === '*') {
            // Center: Bright, saturated colors that shift
            const baseHue = cell.dominantForm ? cell.dominantForm.colorHue : 180;
            const hue = (baseHue + this.time * 0.01 + influence * 60) % 360;
            return `hsl(${hue}, 85%, 75%)`;
            
        } else if (cell.char === '#') {
            // Mid-range: Medium saturation with color mixing
            const baseHue = cell.dominantForm ? cell.dominantForm.colorHue : 180;
            const hue = (baseHue + this.time * 0.005 + influence * 30) % 360;
            return `hsl(${hue}, 70%, 55%)`;
            
        } else if (cell.char === '%') {
            // Edge: Subtle colors, lower saturation
            const baseHue = cell.dominantForm ? cell.dominantForm.colorHue : 180;
            const hue = (baseHue + this.time * 0.002 + influence * 15) % 360;
            return `hsl(${hue}, 50%, 35%)`;
            
        } else {
            // Binary background: Cyan tones with subtle variation
            const noiseVariation = this.noise3D(cell.col * 0.1, cell.row * 0.1, this.time * 0.001) * 20;
            const lightness = 15 + Math.abs(noiseVariation);
            return `hsl(${180 + noiseVariation}, 90%, ${lightness}%)`;
        }
    }
    
    render() {
        // Clear offscreen canvas with dark background
        this.offscreenCtx.fillStyle = '#0a0a0a';
        this.offscreenCtx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // Render all characters
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const cell = this.grid[row][col];
                this.renderCharacter(cell);
            }
        }
        
        // Copy offscreen canvas to main canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
    
    renderCharacter(cell) {
        const ctx = this.offscreenCtx;
        
        // Set color and glow effects
        ctx.fillStyle = cell.color;
        
        // Add glow for high-influence characters
        if (cell.char === '*') {
            ctx.shadowColor = cell.color;
            ctx.shadowBlur = 8;
        } else if (cell.char === '#') {
            ctx.shadowColor = cell.color;
            ctx.shadowBlur = 4;
        } else if (cell.isLogo) {
            ctx.shadowColor = cell.color;
            ctx.shadowBlur = 6;
        } else {
            ctx.shadowBlur = 0;
        }
        
        // Render character
        ctx.fillText(cell.char, cell.x, cell.y);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    animate() {
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastUpdate;
        
        // FPS control
        if (this.deltaTime >= this.config.updateInterval) {
            this.time = currentTime;
            
            // Update all systems
            this.updateFlowingForms();
            this.calculateInfluenceGrid();
            this.updateGridCharactersAndColors();
            this.render();
            
            this.lastUpdate = currentTime;
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
                this.config.updateInterval = Math.min(33, this.config.updateInterval + 2);
            } else if (this.fpsMonitor.currentFps > 55) {
                this.config.updateInterval = Math.max(12, this.config.updateInterval - 1);
            }
        }
    }
    
    handleResize() {
        // Update canvas dimensions
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate offscreen canvas
        this.createOffscreenCanvas();
        
        // Recalculate grid
        this.calculateGrid();
        this.initializeGrid();
        this.initializeFlowingForms();
        this.initializeLogoAttractor();
        
        // Update font
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
}

// FlowingForm class for metaball physics
class FlowingForm {
    constructor(x, y, radius, speed, colorHue, noiseOffset) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.colorHue = colorHue;
        this.noiseOffset = noiseOffset;
        this.velocityX = 0;
        this.velocityY = 0;
    }
    
    updatePosition(time, noiseScale, canvasWidth, canvasHeight) {
        // Use Perlin noise for smooth, organic movement
        const noiseX = Math.sin(time * 0.001 + this.noiseOffset) * this.speed;
        const noiseY = Math.cos(time * 0.001 + this.noiseOffset + 100) * this.speed;
        
        this.velocityX = noiseX * 0.1 + this.velocityX * 0.9;
        this.velocityY = noiseY * 0.1 + this.velocityY * 0.9;
        
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Soft boundary wrapping
        if (this.x < -this.radius) this.x = canvasWidth + this.radius;
        if (this.x > canvasWidth + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvasHeight + this.radius;
        if (this.y > canvasHeight + this.radius) this.y = -this.radius;
    }
    
    calculateInfluence(gridX, gridY) {
        const dx = gridX - this.x;
        const dy = gridY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Metaball equation with smooth falloff
        if (distance < this.radius) {
            const normalizedDistance = distance / this.radius;
            return 1 - (normalizedDistance * normalizedDistance);
        }
        
        return 0;
    }
}

// LogoAttractor class for gravitational effects
class LogoAttractor {
    constructor(center, strength) {
        this.center = center;
        this.strength = strength;
        this.pulsePhase = 0;
    }
    
    attractForm(form, deltaTime) {
        const dx = this.center.x - form.x;
        const dy = this.center.y - form.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only attract if far enough from logo
        if (distance > 100) {
            const force = this.strength / (distance * distance + 1000);
            const pulseMultiplier = 1 + Math.sin(this.pulsePhase) * 0.1;
            
            form.x += (dx / distance) * force * deltaTime * 0.001 * pulseMultiplier;
            form.y += (dy / distance) * force * deltaTime * 0.001 * pulseMultiplier;
        }
        
        this.pulsePhase += deltaTime * 0.001;
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