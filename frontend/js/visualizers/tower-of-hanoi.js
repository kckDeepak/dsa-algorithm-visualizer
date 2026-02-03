/**
 * Tower of Hanoi - Visualizer
 */
import { TowerOfHanoi } from '../algorithms/towerOfHanoi.js';
import { AnimationController, Tween } from '../utils/animator.js';

// Algorithm info
const info = {
  title: 'Tower of Hanoi',
  description: 'A classic recursive puzzle where you move disks from one peg to another.',
  overview: `
    <h3>What is Tower of Hanoi?</h3>
    <p>The Tower of Hanoi is a classic mathematical puzzle invented by French mathematician Édouard Lucas in 1883. It consists of three pegs and a number of disks of different sizes that can slide onto any peg.</p>
    <p>The puzzle starts with all disks stacked on one peg in order of size, with the smallest on top. The goal is to move all disks to another peg, following these rules:</p>
    <ul>
      <li>Only one disk can be moved at a time</li>
      <li>Only the top disk from a stack can be moved</li>
      <li>A larger disk cannot be placed on top of a smaller disk</li>
    </ul>
    <div class="complexity-grid" style="margin-top: 24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(2ⁿ)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(n)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>How It Works</h3>
    <p>The Tower of Hanoi uses a beautiful recursive solution:</p>
    <ol style="padding-left: 24px; margin-bottom: 16px;">
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary); font-size: 14px;">
        <strong style="color: var(--color-text-primary);">Move n-1 disks</strong> from source to auxiliary peg
      </li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary); font-size: 14px;">
        <strong style="color: var(--color-text-primary);">Move the largest disk</strong> from source to target peg
      </li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary); font-size: 14px;">
        <strong style="color: var(--color-text-primary);">Move n-1 disks</strong> from auxiliary to target peg
      </li>
    </ol>
    <p>This recursive approach ensures the minimum number of moves: <code style="background: var(--color-bg-tertiary); padding: 2px 8px; border-radius: 4px; font-family: var(--font-family-mono);">2ⁿ - 1</code></p>
    <p style="margin-top: 16px;">For example, 3 disks require 7 moves, 4 disks require 15 moves, and so on.</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Backup Strategies:</strong> The puzzle represents hierarchical backup rotation schemes in data management</li>
      <li><strong>Teaching Recursion:</strong> Perfect introduction to recursive thinking in computer science education</li>
      <li><strong>Psychological Testing:</strong> Used in neuropsychological assessments to evaluate problem-solving abilities</li>
      <li><strong>Mathematical Analysis:</strong> Demonstrates exponential growth and recurrence relations</li>
    </ul>
    <h3 style="margin-top: 24px;">Fun Fact</h3>
    <p>According to legend, there's a temple in Hanoi where monks move 64 golden disks between three posts. When they finish, the world will end! At one move per second, this would take 585 billion years.</p>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">hanoi</span>(n, source, target, auxiliary):
    <span class="keyword">if</span> n == <span class="number">0</span>:
        <span class="keyword">return</span>
    
    <span class="comment">// Move n-1 disks from source to auxiliary</span>
    <span class="function">hanoi</span>(n - <span class="number">1</span>, source, auxiliary, target)
    
    <span class="comment">// Move the nth disk from source to target</span>
    <span class="function">move</span>(source, target)
    
    <span class="comment">// Move n-1 disks from auxiliary to target</span>
    <span class="function">hanoi</span>(n - <span class="number">1</span>, auxiliary, target, source)
    </div>
  `
};

// State
let algorithm = null;
let animator = null;
let canvas = null;
let ctx = null;
let states = [];
let currentState = null;
let animatingDisk = null;

// Colors
const colors = {
  bg: '#0f172a',
  peg: '#475569',
  pegBase: '#334155',
  diskColors: [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ]
};

// Initialize
export function init() {
  setupDOM();
  setupControls();
  setupAlgorithm();
  setupCanvas();
}

function setupDOM() {
  document.getElementById('algo-title').textContent = info.title;
  document.getElementById('algo-description').textContent = info.description;
  document.getElementById('tab-overview').innerHTML = info.overview;
  document.getElementById('tab-steps').innerHTML = info.steps;
  document.getElementById('tab-applications').innerHTML = info.applications;
  document.getElementById('tab-code').innerHTML = info.code;
}

function setupCanvas() {
  canvas = document.getElementById('visualization-canvas');
  ctx = canvas.getContext('2d');
  
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    draw();
  };
  
  resize();
  window.addEventListener('resize', resize);
}

function setupControls() {
  const panel = document.getElementById('control-panel');
  panel.innerHTML = `
    <div class="control-panel">
      <div class="control-section">
        <h4 class="control-section-title">Playback</h4>
        <div class="playback-controls">
          <button class="playback-btn" id="btn-reset" title="Reset">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-back" title="Step Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="4" x2="5" y2="20"/>
            </svg>
          </button>
          <button class="playback-btn playback-btn-play" id="btn-play" title="Play/Pause">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-play">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="icon-pause hidden">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-forward" title="Step Forward">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="4" x2="19" y2="20"/>
            </svg>
          </button>
        </div>
        <div class="progress-container">
          <div class="progress-bar" id="progress-bar" style="cursor: pointer;">
            <div class="progress-bar-fill" id="progress-fill" style="width: 0%"></div>
          </div>
          <div class="progress-info" id="progress-info">0/0</div>
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Speed</h4>
        <div class="speed-control">
          <span class="speed-label" id="speed-label">1.0x</span>
          <input type="range" class="range-slider" id="speed-slider" min="0.25" max="4" step="0.25" value="1">
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Parameters</h4>
        <div class="input-group">
          <label class="input-label" for="num-disks">Number of Disks (1-8)</label>
          <input type="number" class="input-field" id="num-disks" min="1" max="8" value="4">
        </div>
        <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 8px;">
          Minimum moves required: <strong id="min-moves">15</strong>
        </p>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-solve" style="width: 100%;">
          Solve Puzzle
        </button>
      </div>
    </div>
  `;
  
  // Bind events
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', stepForward);
  document.getElementById('btn-step-back').addEventListener('click', stepBack);
  document.getElementById('btn-solve').addEventListener('click', solve);
  
  document.getElementById('speed-slider').addEventListener('input', (e) => {
    const speed = parseFloat(e.target.value);
    animator.setSpeed(speed);
    document.getElementById('speed-label').textContent = speed.toFixed(2) + 'x';
  });
  
  document.getElementById('num-disks').addEventListener('change', (e) => {
    const n = parseInt(e.target.value);
    algorithm.setNumDisks(n);
    document.getElementById('min-moves').textContent = algorithm.getMinMoves();
    reset();
  });
  
  document.getElementById('progress-bar').addEventListener('click', (e) => {
    const rect = e.target.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const step = Math.floor(pct * (states.length - 1));
    goToStep(step);
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    switch(e.code) {
      case 'Space': e.preventDefault(); togglePlay(); break;
      case 'ArrowLeft': e.preventDefault(); stepBack(); break;
      case 'ArrowRight': e.preventDefault(); stepForward(); break;
      case 'KeyR': e.preventDefault(); reset(); break;
    }
  });
}

function setupAlgorithm() {
  algorithm = new TowerOfHanoi(4);
  animator = new AnimationController();
  animator.stepDuration = 800;
  
  animator.onStepChange = (state, step, total) => {
    currentState = state;
    updateStats();
    draw();
  };
  
  animator.onStateChange = (state) => {
    updatePlayButton(state.isPlaying);
    document.getElementById('progress-fill').style.width = state.progress + '%';
    document.getElementById('progress-info').textContent = `${state.currentStep + 1}/${state.totalSteps}`;
  };
  
  reset();
}

function solve() {
  states = algorithm.generateStates();
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  algorithm.reset();
  states = algorithm.generateStates();
  animator.setSteps(states);
  animator.reset();
  currentState = states[0];
  updateStats();
  draw();
}

function togglePlay() {
  if (states.length <= 1) solve();
  animator.toggle();
}

function stepForward() {
  if (states.length <= 1) solve();
  animator.stepForward();
}

function stepBack() {
  animator.stepBackward();
}

function goToStep(step) {
  animator.goToStep(step);
}

function updatePlayButton(isPlaying) {
  const playIcon = document.querySelector('.icon-play');
  const pauseIcon = document.querySelector('.icon-pause');
  const playBtn = document.getElementById('btn-play');
  
  if (isPlaying) {
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    playBtn.classList.add('active');
  } else {
    playIcon.classList.remove('hidden');
    pauseIcon.classList.add('hidden');
    playBtn.classList.remove('active');
  }
}

function updateStats() {
  const moves = currentState?.moveNumber || 0;
  document.getElementById('stat-moves').textContent = moves;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
}

// Drawing
function draw() {
  if (!ctx || !currentState) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  
  // Clear
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Dimensions
  const baseY = height - 60;
  const pegWidth = 12;
  const pegHeight = height * 0.5;
  const pegSpacing = width / 4;
  const maxDiskWidth = pegSpacing * 0.85;
  const minDiskWidth = 40;
  const diskHeight = Math.min(35, pegHeight / (algorithm.numDisks + 1));
  
  // Draw pegs
  for (let i = 0; i < 3; i++) {
    const pegX = pegSpacing * (i + 1);
    
    // Base
    ctx.fillStyle = colors.pegBase;
    ctx.beginPath();
    ctx.roundRect(pegX - maxDiskWidth/2 - 10, baseY, maxDiskWidth + 20, 12, 6);
    ctx.fill();
    
    // Pole
    const gradient = ctx.createLinearGradient(pegX - pegWidth/2, 0, pegX + pegWidth/2, 0);
    gradient.addColorStop(0, '#64748b');
    gradient.addColorStop(0.5, '#94a3b8');
    gradient.addColorStop(1, '#64748b');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(pegX - pegWidth/2, baseY - pegHeight, pegWidth, pegHeight, [6, 6, 0, 0]);
    ctx.fill();
    
    // Label
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Peg ${i + 1}`, pegX, baseY + 35);
  }
  
  // Draw disks
  const pegs = currentState.pegs;
  for (let pegIndex = 0; pegIndex < 3; pegIndex++) {
    const pegX = pegSpacing * (pegIndex + 1);
    const disks = pegs[pegIndex];
    
    disks.forEach((diskSize, stackIndex) => {
      const diskWidth = minDiskWidth + (diskSize - 1) * ((maxDiskWidth - minDiskWidth) / (algorithm.numDisks - 1 || 1));
      const x = pegX - diskWidth / 2;
      const y = baseY - (stackIndex + 1) * diskHeight - 2;
      
      // Disk gradient
      const color = colors.diskColors[diskSize - 1];
      const gradient = ctx.createLinearGradient(x, y, x, y + diskHeight);
      gradient.addColorStop(0, lightenColor(color, 20));
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, darkenColor(color, 20));
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, diskWidth, diskHeight - 4, 8);
      ctx.fill();
      
      // Glow for moving disk
      if (currentState.movingDisk === diskSize && stackIndex === disks.length - 1) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      
      // Disk number
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(diskSize.toString(), pegX, y + (diskHeight - 4) / 2);
    });
  }
  
  // Draw current move description
  if (currentState.description) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(currentState.description, width / 2, 40);
  }
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `rgb(${R},${G},${B})`;
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
  const B = Math.max(0, (num & 0x0000FF) - amt);
  return `rgb(${R},${G},${B})`;
}

export default { init };
