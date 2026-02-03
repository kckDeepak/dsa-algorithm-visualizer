/**
 * DSA Algorithm Visualizer - Main Application
 */

// Algorithm data
const algorithms = [
  {
    id: 'tower-of-hanoi',
    title: 'Tower of Hanoi',
    description: 'Classic recursive puzzle - move all disks from one peg to another following simple rules.',
    category: 'backtracking',
    timeComplexity: 'O(2ⁿ)',
    spaceComplexity: 'O(n)',
    icon: '🗼'
  },
  {
    id: 'n-queens',
    title: 'N-Queens Problem',
    description: 'Place N queens on an N×N chessboard so no two queens threaten each other.',
    category: 'backtracking',
    timeComplexity: 'O(N!)',
    spaceComplexity: 'O(N)',
    icon: '♛'
  },
  {
    id: 'merge-sort',
    title: 'Merge Sort',
    description: 'Efficient divide-and-conquer sorting algorithm that splits and merges arrays.',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    icon: '📊'
  },
  {
    id: 'quick-sort',
    title: 'Quick Sort',
    description: 'Fast in-place sorting using pivot selection and partitioning.',
    category: 'sorting',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    icon: '⚡'
  },
  {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    description: 'Find the shortest path between nodes in a weighted graph.',
    category: 'pathfinding',
    timeComplexity: 'O((V+E) log V)',
    spaceComplexity: 'O(V)',
    icon: '🗺️'
  },
  {
    id: 'a-star',
    title: 'A* Pathfinding',
    description: 'Intelligent pathfinding using heuristics to find optimal paths faster.',
    category: 'pathfinding',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    icon: '🎯'
  },
  {
    id: 'bst',
    title: 'Binary Search Tree',
    description: 'Visualize insert, search, and traversal operations on a BST.',
    category: 'trees',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(n)',
    icon: '🌳'
  },
  {
    id: 'sudoku',
    title: 'Sudoku Solver',
    description: 'Watch backtracking solve Sudoku puzzles step by step.',
    category: 'backtracking',
    timeComplexity: 'O(9^m)',
    spaceComplexity: 'O(m)',
    icon: '🔢'
  },
  {
    id: 'kmp',
    title: 'KMP String Matching',
    description: 'Efficient pattern matching using the Knuth-Morris-Pratt algorithm.',
    category: 'strings',
    timeComplexity: 'O(n + m)',
    spaceComplexity: 'O(m)',
    icon: '🔍'
  },
  {
    id: 'graph-traversal',
    title: 'Graph Traversal (BFS/DFS)',
    description: 'Explore graphs using Breadth-First and Depth-First Search algorithms.',
    category: 'pathfinding',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    icon: '🕸️'
  },
  {
    id: 'lcs',
    title: 'Longest Common Subsequence',
    description: 'Find the longest subsequence common to two strings using dynamic programming.',
    category: 'dynamic',
    timeComplexity: 'O(m × n)',
    spaceComplexity: 'O(m × n)',
    icon: '📝'
  }
];

// DOM Elements
let algorithmGrid, searchInput, filterBtns, heroCanvas;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  renderAlgorithmCards();
  initHeroAnimation();
  initNavbar();
  initSearch();
  initFilters();
});

// Cache DOM elements
function initElements() {
  algorithmGrid = document.getElementById('algorithm-grid');
  searchInput = document.getElementById('search-input');
  filterBtns = document.querySelectorAll('.filter-btn');
  heroCanvas = document.getElementById('hero-canvas');
}

// Render algorithm cards
function renderAlgorithmCards(filter = 'all', search = '') {
  const filtered = algorithms.filter(algo => {
    const matchesFilter = filter === 'all' || algo.category === filter;
    const matchesSearch = algo.title.toLowerCase().includes(search.toLowerCase()) ||
                         algo.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  algorithmGrid.innerHTML = filtered.map((algo, index) => `
    <a href="algorithm.html#${algo.id}" class="algo-card animate-fade-in-up" style="animation-delay: ${index * 50}ms">
      <div class="algo-card-preview">
        <span style="font-size: 4rem;">${algo.icon}</span>
      </div>
      <div class="algo-card-content">
        <span class="algo-card-category">${getCategoryLabel(algo.category)}</span>
        <h3 class="algo-card-title">${algo.title}</h3>
        <p class="algo-card-description">${algo.description}</p>
      </div>
      <div class="algo-card-footer">
        <div class="algo-card-complexity">
          <span>Time: ${algo.timeComplexity}</span>
          <span>Space: ${algo.spaceComplexity}</span>
        </div>
        <div class="algo-card-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </a>
  `).join('');
}

// Get category label
function getCategoryLabel(category) {
  const labels = {
    sorting: '📊 Sorting',
    pathfinding: '🗺️ Pathfinding',
    backtracking: '🔄 Backtracking',
    dynamic: '📈 Dynamic Programming',
    trees: '🌳 Trees',
    strings: '🔍 Strings'
  };
  return labels[category] || category;
}

// Initialize navbar scroll effect
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Initialize search
function initSearch() {
  searchInput.addEventListener('input', (e) => {
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderAlgorithmCards(activeFilter, e.target.value);
  });
}

// Initialize filters
function initFilters() {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderAlgorithmCards(btn.dataset.filter, searchInput.value);
    });
  });
}

// Hero canvas animation
function initHeroAnimation() {
  if (!heroCanvas) return;
  
  const ctx = heroCanvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size
  function resize() {
    const rect = heroCanvas.getBoundingClientRect();
    heroCanvas.width = rect.width * dpr;
    heroCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize);

  // Animation state
  let bars = [];
  const barCount = 15;
  const barWidth = 20;
  const gap = 8;
  let sorting = false;
  let sortIndex = 0;

  // Initialize bars
  function initBars() {
    bars = [];
    const canvasWidth = heroCanvas.width / dpr;
    const canvasHeight = heroCanvas.height / dpr;
    const totalWidth = barCount * barWidth + (barCount - 1) * gap;
    const startX = (canvasWidth - totalWidth) / 2;
    
    for (let i = 0; i < barCount; i++) {
      bars.push({
        x: startX + i * (barWidth + gap),
        height: 30 + Math.random() * (canvasHeight * 0.6),
        targetHeight: 0,
        color: `hsl(${200 + i * 6}, 80%, 60%)`
      });
    }
  }

  // Draw bars
  function draw() {
    const canvasWidth = heroCanvas.width / dpr;
    const canvasHeight = heroCanvas.height / dpr;
    
    // Clear
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
    
    // Draw bars
    bars.forEach((bar, i) => {
      const gradient = ctx.createLinearGradient(bar.x, canvasHeight, bar.x, canvasHeight - bar.height);
      gradient.addColorStop(0, bar.color);
      gradient.addColorStop(1, `hsl(${200 + i * 6}, 90%, 75%)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(bar.x, canvasHeight - bar.height - 40, barWidth, bar.height, [6, 6, 0, 0]);
      ctx.fill();
      
      // Glow effect
      ctx.shadowColor = bar.color;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  // Bubble sort animation step
  function sortStep() {
    if (sortIndex >= bars.length - 1) {
      sorting = false;
      setTimeout(() => {
        initBars();
        sorting = true;
        sortIndex = 0;
      }, 2000);
      return;
    }
    
    for (let i = 0; i < bars.length - sortIndex - 1; i++) {
      if (bars[i].height > bars[i + 1].height) {
        // Swap
        const temp = bars[i].height;
        bars[i].height = bars[i + 1].height;
        bars[i + 1].height = temp;
        
        const tempColor = bars[i].color;
        bars[i].color = bars[i + 1].color;
        bars[i + 1].color = tempColor;
      }
    }
    sortIndex++;
  }

  // Animation loop
  let lastSortTime = 0;
  function animate(time) {
    // Sort step every 200ms
    if (sorting && time - lastSortTime > 200) {
      sortStep();
      lastSortTime = time;
    }
    
    draw();
    requestAnimationFrame(animate);
  }

  initBars();
  sorting = true;
  requestAnimationFrame(animate);
}
