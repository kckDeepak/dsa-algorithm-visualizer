/**
 * Quick Sort - Algorithm Implementation
 */
export class QuickSort {
  constructor() {
    this.array = [];
    this.states = [];
    this.comparisons = 0;
    this.swaps = 0;
  }

  reset() {
    this.states = [];
    this.comparisons = 0;
    this.swaps = 0;
  }

  setArray(arr) {
    this.array = [...arr];
    this.reset();
  }

  generateRandomArray(size = 20, min = 10, max = 100) {
    this.array = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
    this.reset();
    return this.array;
  }

  generateStates(pivotStrategy = 'last') {
    this.reset();
    const arr = [...this.array];
    
    this.states.push({
      array: [...arr],
      pivot: null,
      comparing: [],
      sorted: [],
      partitioning: [],
      description: 'Starting Quick Sort',
      comparisons: 0,
      swaps: 0
    });

    this.quickSort(arr, 0, arr.length - 1, pivotStrategy);

    this.states.push({
      array: [...arr],
      pivot: null,
      comparing: [],
      sorted: arr.map((_, i) => i),
      description: 'Array is now sorted!',
      comparisons: this.comparisons,
      swaps: this.swaps
    });

    return this.states;
  }

  quickSort(arr, low, high, pivotStrategy) {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high, pivotStrategy);
      this.quickSort(arr, low, pivotIndex - 1, pivotStrategy);
      this.quickSort(arr, pivotIndex + 1, high, pivotStrategy);
    } else if (low === high) {
      this.states.push({
        array: [...arr],
        pivot: null,
        comparing: [],
        sorted: this.getSortedIndices(arr, low, high),
        description: `Element at ${low} is in place`,
        comparisons: this.comparisons,
        swaps: this.swaps
      });
    }
  }

  partition(arr, low, high, pivotStrategy) {
    // Select pivot based on strategy
    let pivotIndex = high;
    if (pivotStrategy === 'first') pivotIndex = low;
    else if (pivotStrategy === 'random') pivotIndex = Math.floor(Math.random() * (high - low + 1)) + low;
    else if (pivotStrategy === 'median') pivotIndex = this.medianOfThree(arr, low, high);
    
    // Move pivot to end if not already there
    if (pivotIndex !== high) {
      [arr[pivotIndex], arr[high]] = [arr[high], arr[pivotIndex]];
    }

    const pivot = arr[high];
    const range = Array.from({ length: high - low + 1 }, (_, i) => low + i);

    this.states.push({
      array: [...arr],
      pivot: high,
      comparing: [],
      partitioning: range,
      description: `Partitioning [${low}-${high}] with pivot ${pivot}`,
      comparisons: this.comparisons,
      swaps: this.swaps
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;

      this.states.push({
        array: [...arr],
        pivot: high,
        comparing: [j, high],
        i: i,
        j: j,
        partitioning: range,
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        comparisons: this.comparisons,
        swaps: this.swaps
      });

      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          this.swaps++;

          this.states.push({
            array: [...arr],
            pivot: high,
            comparing: [i, j],
            swapping: [i, j],
            partitioning: range,
            description: `Swapped ${arr[j]} and ${arr[i]}`,
            comparisons: this.comparisons,
            swaps: this.swaps
          });
        }
      }
    }

    // Place pivot in correct position
    const pivotPos = i + 1;
    if (pivotPos !== high) {
      [arr[pivotPos], arr[high]] = [arr[high], arr[pivotPos]];
      this.swaps++;
    }

    this.states.push({
      array: [...arr],
      pivot: pivotPos,
      sorted: this.getSortedIndices(arr, low, pivotPos),
      partitioning: [],
      description: `Pivot ${pivot} placed at position ${pivotPos}`,
      comparisons: this.comparisons,
      swaps: this.swaps
    });

    return pivotPos;
  }

  medianOfThree(arr, low, high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[low] > arr[mid]) [arr[low], arr[mid]] = [arr[mid], arr[low]];
    if (arr[low] > arr[high]) [arr[low], arr[high]] = [arr[high], arr[low]];
    if (arr[mid] > arr[high]) [arr[mid], arr[high]] = [arr[high], arr[mid]];
    return mid;
  }

  getSortedIndices(arr, low, high) {
    const sorted = [];
    const sortedArr = [...this.array].sort((a, b) => a - b);
    for (let i = 0; i <= high && i < arr.length; i++) {
      if (arr[i] === sortedArr[i]) sorted.push(i);
    }
    return sorted;
  }
}

export default QuickSort;
