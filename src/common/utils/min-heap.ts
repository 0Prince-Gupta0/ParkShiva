export class MinHeap {
    private heap: number[];
  
    constructor() {
      this.heap = [];
    }
  
    insert(value: number): void {
      this.heap.push(value);
      this.bubbleUp();
    }
  
    extractMin(): number | null {
      if (this.heap.length === 0) return null;
      if (this.heap.length === 1) return this.heap.pop()!;
      const min = this.heap[0];
      this.heap[0] = this.heap.pop()!;
      this.bubbleDown();
      return min;
    }
  
    peek(): number | null {
      return this.heap.length > 0 ? this.heap[0] : null;
    }
  
    isEmpty(): boolean {
      return this.heap.length === 0;
    }
  
    private bubbleUp(): void {
      let index = this.heap.length - 1;
      while (index > 0) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index] >= this.heap[parentIndex]) break;
        [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
        index = parentIndex;
      }
    }
  
    private bubbleDown(): void {
      let index = 0;
      const length = this.heap.length;
  
      while (true) {
        let left = 2 * index + 1;
        let right = 2 * index + 2;
        let smallest = index;
  
        if (left < length && this.heap[left] < this.heap[smallest]) smallest = left;
        if (right < length && this.heap[right] < this.heap[smallest]) smallest = right;
  
        if (smallest === index) break;
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      }
    }
  }
  