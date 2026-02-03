/**
 * Merge Sort - Algorithm Implementation
 */
export class MergeSort {
  constructor() {
    this.array = [];
    this.states = [];
    this.comparisons = 0;
  }

  reset() {
    this.states = [];
    this.comparisons = 0;
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

  // Generate states for visualization
  generateStates() {
    this.reset();
    const arr = [...this.array];
    
    this.states.push({
      array: [...arr],
      comparing: [],
      sorted: [],
      merging: [],
      left: null,
      right: null,
      description: 'Starting Merge Sort',
      comparisons: 0
    });

    this.mergeSort(arr, 0, arr.length - 1);

    this.states.push({
      array: [...arr],
      comparing: [],
      sorted: arr.map((_, i) => i),
      merging: [],
      description: 'Array is now sorted!',
      comparisons: this.comparisons
    });

    return this.states;
  }

  mergeSort(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    this.states.push({
      array: [...arr],
      comparing: [],
      sorted: [],
      dividing: { left, mid, right },
      description: `Dividing: [${left}-${mid}] and [${mid + 1}-${right}]`,
      comparisons: this.comparisons
    });

    this.mergeSort(arr, left, mid);
    this.mergeSort(arr, mid + 1, right);
    this.merge(arr, left, mid, right);
  }

  merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    this.states.push({
      array: [...arr],
      merging: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      leftSubarray: leftArr,
      rightSubarray: rightArr,
      description: `Merging [${left}-${mid}] with [${mid + 1}-${right}]`,
      comparisons: this.comparisons
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++;

      this.states.push({
        array: [...arr],
        comparing: [left + i, mid + 1 + j],
        merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        comparisons: this.comparisons
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      k++;

      this.states.push({
        array: [...arr],
        merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: Array.from({ length: k - left }, (_, idx) => left + idx),
        description: `Placed element at position ${k - 1}`,
        comparisons: this.comparisons
      });
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      i++;
      k++;

      this.states.push({
        array: [...arr],
        merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: Array.from({ length: k - left }, (_, idx) => left + idx),
        description: 'Copying remaining left elements',
        comparisons: this.comparisons
      });
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      j++;
      k++;

      this.states.push({
        array: [...arr],
        merging: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
        sorted: Array.from({ length: k - left }, (_, idx) => left + idx),
        description: 'Copying remaining right elements',
        comparisons: this.comparisons
      });
    }
  }
}

export default MergeSort;
