/**
 * Quick Sort - Visualizer
 */
import { QuickSort } from '../algorithms/quickSort.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'Quick Sort',
  description: 'A fast in-place sorting algorithm using pivot selection and partitioning.',
  overview: `
    <h3>What is Quick Sort?</h3>
    <p>Quick Sort is a highly efficient divide-and-conquer sorting algorithm developed by Tony Hoare in 1959. It's one of the most widely used sorting algorithms.</p>
    <p>The algorithm picks a "pivot" element and partitions the array around it, placing smaller elements before and larger elements after.</p>
    <ul>
      <li>In-place sorting (minimal extra memory)</li>
      <li>Average case O(n log n) performance</li>
      <li>Not stable (may change order of equal elements)</li>
    </ul>
    <div class="complexity-grid" style="margin-top:24px;">
      <div class="complexity-card">
        <div class="complexity-label">Time (Average)</div>
        <div class="complexity-value">O(n log n)</div>
      </div>
      <div class="complexity-card">
        <div class="complexity-label">Space</div>
        <div class="complexity-value">O(log n)</div>
      </div>
    </div>
  `,
  steps: `
    <h3>How It Works</h3>
    <ol style="padding-left:24px;">
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Choose a pivot element from the array</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Partition: move smaller elements left, larger right</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Place pivot in its final sorted position</li>
      <li style="list-style:decimal;margin-bottom:8px;color:var(--color-text-secondary);">Recursively sort left and right partitions</li>
    </ol>
    <p style="margin-top:16px;"><strong style="color:#ec4899">Pink</strong> = pivot, <strong style="color:#f59e0b">Orange</strong> = comparing, <strong style="color:#10b981">Green</strong> = sorted</p>
  `,
  applications: `
    <h3>Real-World Applications</h3>
    <ul>
      <li><strong>Standard Libraries:</strong> Used in C qsort(), Java Arrays.sort() for primitives</li>
      <li><strong>Databases:</strong> Sorting query results</li>
      <li><strong>Operating Systems:</strong> File system organization</li>
      <li><strong>Numerical Computing:</strong> Scientific computing libraries</li>
    </ul>
  `,
  code: `
    <h3>Pseudocode</h3>
    <div class="code-block">
<span class="keyword">function</span> <span class="function">quickSort</span>(arr, low, high):
    <span class="keyword">if</span> low < high:
        pivot = <span class="function">partition</span>(arr, low, high)
        <span class="function">quickSort</span>(arr, low, pivot - <span class="number">1</span>)
        <span class="function">quickSort</span>(arr, pivot + <span class="number">1</span>, high)

<span class="keyword">function</span> <span class="function">partition</span>(arr, low, high):
    pivot = arr[high]
    i = low - <span class="number">1</span>
    <span class="keyword">for</span> j = low to high - <span class="number">1</span>:
        <span class="keyword">if</span> arr[j] < pivot:
            i++
            <span class="function">swap</span>(arr[i], arr[j])
    <span class="function">swap</span>(arr[i+<span class="number">1</span>], arr[high])
    <span class="keyword">return</span> i + <span class="number">1</span>
    </div>
  `
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

const colors = {
  bg: '#0f172a',
  bar: '#3b82f6',
  comparing: '#f59e0b',
  pivot: '#ec4899',
  sorted: '#10b981',
  partitioning: '#8b5cf6',
  swapping: '#ef4444'
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
          <span style="font-size:12px;color:var(--color-text-muted);">Size: <span id="size-label">20</span></span>
        </div>
      </div>
      
      <div class="control-section">
        <h4 class="control-section-title">Pivot Strategy</h4>
        <select class="input-field" id="pivot-select">
          <option value="last">Last Element</option>
          <option value="first">First Element</option>
          <option value="random">Random</option>
          <option value="median">Median of Three</option>
        </select>
      </div>
      
      <div class="control-section">
        <button class="btn btn-primary" id="btn-sort" style="width:100%;margin-bottom:8px;">Sort Array</button>
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
    animator.goToStep(Math.max(0, step));
  });
}

function setupAlgorithm() {
  algorithm = new QuickSort();
  animator = new AnimationController();
  animator.stepDuration = 150;
  
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
  const strategy = document.getElementById('pivot-select').value;
  states = algorithm.generateStates(strategy);
  animator.setSteps(states);
  currentState = states[0];
  updateStats();
  draw();
}

function reset() {
  const arr = [...algorithm.array];
  algorithm.setArray(arr);
  states = [{ array: arr, description: 'Click "Sort" to begin', comparisons: 0, swaps: 0 }];
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
  document.getElementById('stat-moves').textContent = currentState?.swaps || 0;
  document.getElementById('stat-step').textContent = `${animator.currentStep + 1}/${states.length}`;
  document.querySelector('.vis-stat:first-child span:first-child').textContent = 'Swaps:';
}

function draw() {
  if (!ctx || !currentState) return;
  
  const width = canvas.width / (window.devicePixelRatio || 1);
  const height = canvas.height / (window.devicePixelRatio || 1);
  const arr = currentState.array || algorithm.array;
  const n = arr.length;
  
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  
  // Grid
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
    if (currentState.sorted?.includes(i)) color = colors.sorted;
    else if (i === currentState.pivot) color = colors.pivot;
    else if (currentState.swapping?.includes(i)) color = colors.swapping;
    else if (currentState.comparing?.includes(i)) color = colors.comparing;
    else if (currentState.partitioning?.includes(i)) color = colors.partitioning;
    
    // Draw bar
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, lighten(color, 20));
    gradient.addColorStop(1, color);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();
    
    // Glow
    if (i === currentState.pivot || currentState.comparing?.includes(i)) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Value label
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
