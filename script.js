// --- JavaScript for Fireworks ---

const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

// Set canvas to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Firework colors from the Indian Flag
const colors = ['#FF9933', '#FFFFFF', '#138808'];
let fireworks = [];
let particles = [];

// --- Firework Object ---
function Firework(x, y, targetX, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.speed = 2;
    this.acceleration = 1.03;
    this.brightness = Math.random() * 20 + 50;
    this.targetRadius = 1;
}

Firework.prototype.update = function(index) {
    // Move the firework
    this.speed *= this.acceleration;
    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.x += vx;
    this.y += vy;

    // Check if firework reached its target
    if (Math.abs(this.x - this.targetX) < this.targetRadius && Math.abs(this.y - this.targetY) < this.targetRadius) {
        // Create explosion
        createParticles(this.targetX, this.targetY, this.color);
        // Remove firework from array
        fireworks.splice(index, 1);
    }
};

Firework.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
};

// --- Particle Object (for the explosion) ---
function Particle(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 8 + 1;
    this.friction = 0.97;
    this.gravity = 1;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.01;
}

Particle.prototype.update = function(index) {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

Particle.prototype.draw = function() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
};

// --- Helper Functions ---
function createParticles(x, y, color) {
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function launchFirework() {
    const startX = Math.random() * canvas.width / 2 + canvas.width / 4;
    const startY = canvas.height;
    const targetX = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height / 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(startX, startY, targetX, targetY, color));
}

// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // Create a semi-transparent background for a trailing effect
    ctx.fillStyle = 'rgba(0, 0, 32, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw fireworks
    fireworks.forEach((firework, i) => {
        firework.update(i);
        firework.draw();
    });

    // Update and draw particles
    particles.forEach((particle, i) => {
        particle.update(i);
        particle.draw();
    });
}

// --- Event Listeners ---
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Launch fireworks periodically
setInterval(launchFirework, 1000);

// Start the animation
animate();
// Launch one immediately for good measure
launchFirework();
