# 🎯 DSA Algorithm Visualizer

A beautiful, interactive web platform for visualizing Data Structures and Algorithms. Watch algorithms come to life with stunning animations, step-by-step breakdowns, and comprehensive explanations.

![DSA Visualizer Banner](https://img.shields.io/badge/Algorithms-11+-blue?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

## ✨ Features

- **🎨 Modern UI/UX** - Sleek dark theme with glassmorphism effects and smooth animations
- **⏯️ Full Playback Control** - Play, pause, step forward/backward, and scrub through algorithm execution
- **🎚️ Adjustable Speed** - Control animation speed from 0.25x to 4x
- **📊 Real-time Stats** - Track moves, comparisons, and current step
- **📚 Comprehensive Explanations** - Each algorithm includes overview, step-by-step guide, pseudocode, and real-world applications
- **🔍 Search & Filter** - Quickly find algorithms by name or category
- **📱 Responsive Design** - Works on desktop and tablet devices
- **⌨️ Keyboard Shortcuts** - Space to play/pause, arrow keys to step through

## 🧮 Algorithms Included

### Sorting
| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **Merge Sort** | O(n log n) | O(n) |
| **Quick Sort** | O(n log n) avg | O(log n) |

### Pathfinding
| Algorithm | Description |
|-----------|-------------|
| **Dijkstra's Algorithm** | Find shortest paths in weighted graphs |
| **A* Pathfinding** | Intelligent pathfinding with heuristics |
| **Graph Traversal (BFS/DFS)** | Explore graphs systematically |

### Backtracking
| Algorithm | Description |
|-----------|-------------|
| **Tower of Hanoi** | Classic recursive disk-moving puzzle |
| **N-Queens Problem** | Place N queens without conflicts |
| **Sudoku Solver** | Solve puzzles with backtracking |

### Trees
| Algorithm | Description |
|-----------|-------------|
| **Binary Search Tree** | Insert, search, and traverse BST operations |

### Dynamic Programming
| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **Longest Common Subsequence (LCS)** | O(m × n) | O(m × n) |

### String Algorithms
| Algorithm | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| **KMP String Matching** | O(n + m) | O(m) |

## 🚀 Getting Started

### Prerequisites
- Node.js (for local development server)
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dsa-algorithm-visualizer.git
   cd dsa-algorithm-visualizer
   ```

2. **Start the development server**
   ```bash
   npx serve frontend -l 5000
   ```

3. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
dsa-algorithm-visualizer/
├── frontend/
│   ├── index.html              # Homepage
│   ├── algorithm.html          # Algorithm visualization page
│   ├── css/
│   │   ├── styles.css          # Main styles
│   │   ├── algorithm.css       # Algorithm page styles
│   │   └── animations.css      # Animation utilities
│   └── js/
│       ├── main.js             # Homepage logic
│       ├── algorithms/         # Algorithm implementations
│       │   ├── towerOfHanoi.js
│       │   ├── nQueens.js
│       │   ├── mergeSort.js
│       │   ├── quickSort.js
│       │   ├── dijkstra.js
│       │   ├── aStar.js
│       │   ├── bst.js
│       │   ├── sudoku.js
│       │   ├── kmp.js
│       │   ├── graphTraversal.js
│       │   └── lcs.js
│       ├── visualizers/        # Visualization components
│       │   ├── tower-of-hanoi.js
│       │   ├── n-queens.js
│       │   ├── merge-sort.js
│       │   ├── quick-sort.js
│       │   ├── dijkstra.js
│       │   ├── a-star.js
│       │   ├── bst.js
│       │   ├── sudoku.js
│       │   ├── kmp.js
│       │   ├── graph-traversal.js
│       │   └── lcs.js
│       └── utils/
│           └── animator.js     # Animation controller
└── README.md
```

## 🎮 Usage

### Homepage
- Browse available algorithms organized by category
- Use the search bar to find specific algorithms
- Filter by category (Sorting, Pathfinding, Backtracking, etc.)
- Click on any algorithm card to view its visualization

### Visualization Page
- **Play/Pause** - Start or stop the animation
- **Step Forward/Back** - Move through algorithm steps manually
- **Reset** - Return to initial state
- **Speed Slider** - Adjust animation speed
- **Progress Bar** - Click anywhere to jump to that step
- **Tabs** - Switch between Overview, Steps, Applications, and Code

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Step backward |
| `→` | Step forward |
| `R` | Reset |

## 🛠️ Adding New Algorithms

### 1. Create the Algorithm Class
Create a new file in `frontend/js/algorithms/`:

```javascript
// frontend/js/algorithms/myAlgorithm.js
export class MyAlgorithm {
  constructor() {
    this.states = [];
  }
  
  // Your algorithm logic here
  solve() {
    this.states = [];
    // Add states as algorithm progresses
    this.states.push({
      // State data for visualization
      description: 'Step description'
    });
  }
}

export default MyAlgorithm;
```

### 2. Create the Visualizer
Create a new file in `frontend/js/visualizers/`:

```javascript
// frontend/js/visualizers/my-algorithm.js
import { MyAlgorithm } from '../algorithms/myAlgorithm.js';
import { AnimationController } from '../utils/animator.js';

const info = {
  title: 'My Algorithm',
  description: '...',
  overview: '...',
  steps: '...',
  applications: '...',
  code: '...'
};

let algorithm, animator, canvas, ctx;
let states = [], currentState = null;

export function init() {
  setupDOM();
  setupControls();
  setupAlgorithm();
  setupCanvas();
}

// Implement setupDOM, setupControls, setupAlgorithm, setupCanvas, draw, etc.

export default { init };
```

### 3. Register the Algorithm
1. Add to the visualizers mapping in `algorithm.html`
2. Add to the algorithms array in `main.js`

## 🎨 Customization

### Colors
Edit the CSS custom properties in `styles.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-accent: #8b5cf6;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
}
```

### Animation Speed
Adjust the step duration in each visualizer's `setupAlgorithm()`:

```javascript
animator.stepDuration = 500; // milliseconds between steps
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-algorithm`)
3. **Commit** your changes (`git commit -m 'Add amazing algorithm'`)
4. **Push** to the branch (`git push origin feature/amazing-algorithm`)
5. **Open** a Pull Request

### Ideas for Contribution
- Add new algorithms (Heap Sort, Bellman-Ford, Floyd-Warshall, etc.)
- Improve visualizations
- Add mobile responsiveness
- Add dark/light theme toggle
- Add algorithm comparison mode
- Add export/share functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspiration from various algorithm visualization platforms
- Icons and design influenced by modern UI trends
- Built with vanilla JavaScript, HTML5 Canvas, and CSS3

---

<p align="center">
  Made with ❤️ for learning algorithms
</p>

<p align="center">
  <a href="#-dsa-algorithm-visualizer">Back to Top ⬆️</a>
</p>
