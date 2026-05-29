export interface MemoryBlock {
  ptr: number | null;
  size: number;
  memory: Uint8Array | null;
}

export declare function allocMemory(
  size: number
): MemoryBlock;

export declare function freeMemory(
  block: MemoryBlock
): void;