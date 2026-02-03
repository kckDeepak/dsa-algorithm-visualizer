/**
 * Merge Sort - Visualizer
 */
import { MergeSort } from '../algorithms/mergeSort.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Merge Sort',
  description: 'A divide-and-conquer algorithm that splits and merges arrays for efficient sorting.',
  overview: `
    <h3>What is Merge Sort?</h3>
    <p>Merge Sort is an efficient, stable, divide-and-conquer sorting algorithm. It was invented by John von Neumann in 1945.</p>
    <p>The algorithm divides the array into halves, recursively sorts them, and then merges the sorted halves back together.</p>
    <ul>
      <li>Guaranteed O(n log n) performance</li>
      <li>Stable sort (preserves order of equal elements)</li>
      <li>Excellent for linked lists and external sorting</li>
    </ul>
    <div class="complexity-grid" style="margin-top: 24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time Complexity</div>
        <div class="complexity-value">O(n log n)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space Complexity</div>
        <div class="complexity-value">O(n)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>How It Works</h3>
    <ol style="padding-left: 24px;">
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">
        <strong style="color: var(--color-text-primary);">Divide:</strong> Split array into two halves
      </li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">
        <strong style="color: var(--color-text-primary);">Conquer:</strong> Recursively sort each half
      </li>
      <li style="list-style: decimal; margin-bottom: 8px; color: var(--color-text-secondary);">
        <strong style="color: var(--color-text-primary);">Merge:</strong> Combine sorted halves into one sorted array
      </li>
    </ol>
    <p style="margin-top: 16px;">Watch the <strong style="color: var(--color-primary-light);">blue bars</strong> being compared and <strong style="color: var(--color-success);">green bars</strong> being sorted.</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>External Sorting:</strong> Sorting large files that don't fit in memory</li>
      <li><strong>Linked Lists:</strong> Preferred algorithm for sorting linked lists</li>
      <li><strong>Databases:</strong> Used in database systems for sorting large datasets</li>
      <li><strong>Java/Python:</strong> Built-in sorting implementations</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">mergeSort</span>(arr):
    <span class="keyword">if</span> length(arr) <= <span class="number">1</span>:
        <span class="keyword">return</span> arr
    
    mid = length(arr) / <span class="number">2</span>
    left = <span class="function">mergeSort</span>(arr[<span class="number">0</span>:mid])
    right = <span class="function">mergeSort</span>(arr[mid:end])
    
    <span class="keyword">return</span> <span class="function">merge</span>(left, right)

<span class="keyword">function</span> <span class="function">merge</span>(left, right):
    result = []
    <span class="keyword">while</span> left and right not empty:
        <span class="keyword">if</span> left[<span class="number">0</span>] <= right[<span class="number">0</span>]:
            result.append(left.pop(<span class="number">0</span>))
        <span class="keyword">else</span>:
            result.append(right.pop(<span class="number">0</span>))
    <span class="keyword">return</span> result + left + right
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  bar: '#3b82f6',
  comparing: '#f59e0b',
  sorted: '#10b981',
  merging: '#8b5cf6'
};

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
          <button class="playback-btn" id="btn-reset">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="19 20 9 12 19 4"/><line x1="5" y1="4" x2="5" y2="20"/>
            </svg>
          </button>
          <button class="playback-btn playback-btn-play" id="btn-play">
            <svg class="icon-play" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21"/>
            </svg>
            <svg class="icon-pause hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
            </svg>
          </button>
          <button class="playback-btn" id="btn-step-forward">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 4 15 12 5 20"/><line x1="19" y1="4" x2="19" y2="20"/>
            </svg>
          </button>
        </div>
        <div class="progress-container">
          <div class="progress-bar" id="progress-bar" style="cursor:pointer">
            <div class="progress-bar-fill" id="progress-fill"></div>
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
        <h4 class="control-section-title">Array Size</h4>
        <div class="input-group">
          <input type="range" class="range-slider" id="size-slider" min="5" max="50" value="20">
          <span style="font-size: 12px; color: var(--color-text-muted);">Size: <span id="size-label">20</span></span>
        </div>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-sort" style="width:100%; margin-bottom: 8px;">Sort Array</button>
        <button class="btn btn-secondary" id="btn-random" style="width:100%;">Randomize</button>
      </div>
    </div>
  `;
  
  document.getElementById('btn-play').addEventListener('click', togglePlay);
  document.getElementById('btn-reset').addEventListener('click', reset);
  document.getElementById('btn-step-forward').addEventListener('click', () => animator.stepForward());
  document.getElementById('btn-step-back').addEventListener('click', () => animator.stepBackward());
  document.getElementById('btn-sort').addEventListener('click', sort);
  document.getElementById('btn-random').addEventListener('click', randomize);
  
  document.getElementById('speed-slider').addEventListener('input', e => {
    animator.setSpeed(parseFloat(e.target.value));
    document.getElementById('speed-label').textContent = e.target.value + 'x';
  });
  
  document.getElementById('size-slider').addEventListener('input', e => {
    document.getElementById('size-label').textContent = e.target.value;
    randomize();
  });
  
  document.getElementById('progress-bar').addEventListener('click', e => {
    const rect = e.target.getBoundingClientRect();
    const step = Math.floor((e.clientX - rect.left) / rect.width * (states.length - 1));
    animator.goToStep(step);
  });
}

function setupAlgorithm() {
  algorithm = new MergeSort();
  animator = new AnimationController();
  animator.stepDuration = 200;
  
  animator.onStepChange = (state) => {
    currentState = state;
    updateStats();
    draw();
  };
  
  animator.onStateChange = (state) => {
    updatePlayButton(state.isPlaying);
    document.getElementById('progress-fill').style.width = state.progress + '%';
    document.getElementById('progress-info').textContent = `${state.currentStep + 1}/${state.totalSteps}`;
  };
  
  randomize();
}

function sort() {
  states = algorithm.generateStates();
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  const arr = [...algorithm.array];
  algorithm.setArray(arr);
  states = [{ array: arr, description: 'Click "Sort" to begin', comparisons: 0 }];
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function randomize() {
  const size = parseInt(document.getElementById('size-slider').value);
  algorithm.generateRandomArray(size, 10, 100);
  reset();
}

function togglePlay() {
  if (states.length <= 1) sort();
  animator.toggle();
}

function updatePlayButton(isPlaying) {
  document.querySelector('.icon-play').classList.toggle('hidden', isPlaying);
  document.querySelector('.icon-pause').classList.toggle('hidden', !isPlaying);
  document.getElementById('btn-play').classList.toggle('active', isPlaying);
}

function updateStats() {
  document.getElementById('stat-moves').textContent = currentState?.comparisons || 0;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Comparisons:';
}

function draw() {
  if (!ctx || !currentState) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  const arr = currentState.array || algorithm.array;
  const n = arr.length;
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Draw grid
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
  }
  
  const padding = 60;
  const barAreaWidth = width - padding * 2;
  const barWidth = Math.max(4, barAreaWidth / n - 2);
  const gap = (barAreaWidth - barWidth * n) / (n - 1 || 1);
  const maxVal = Math.max(...arr);
  const barAreaHeight = height - 120;
  
  arr.forEach((val, i) => {
    const x = padding + i * (barWidth + gap);
    const barHeight = (val / maxVal) * barAreaHeight;
    const y = height - 60 - barHeight;
    
    // Determine color
    let color = colors.bar;
    if (currentState.sorted?.includes(i)) {
      color = colors.sorted;
    } else if (currentState.comparing?.includes(i)) {
      color = colors.comparing;
    } else if (currentState.merging?.includes(i)) {
      color = colors.merging;
    }
    
    // Draw bar
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, lighten(color, 20));
    gradient.addColorStop(1, color);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();
    
    // Glow for comparing
    if (currentState.comparing?.includes(i)) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Value label for smaller arrays
    if (n <= 25) {
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(val.toString(), x + barWidth / 2, y - 8);
    }
  });
  
  // Description
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px Inter';
  ctx.textAlign = 'center';
  ctx.fillText(currentState.description || '', width / 2, 30);
}

function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const R = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const G = Math.min(255, ((num >> 8) & 0xFF) + Math.round(2.55 * percent));
  const B = Math.min(255, (num & 0xFF) + Math.round(2.55 * percent));
  return `rgb(${R},${G},${B})`;
}

export default { init };
