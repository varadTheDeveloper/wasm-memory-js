import ModuleFactory from "./runtime.js";

const Module = await ModuleFactory();

export function allocMemory(size) {
  const ptr = Module._alloc(size);

  return {
    ptr,
    size,

    memory: Module.HEAPU8.subarray(ptr, ptr + size),
  };
}

export function freeMemory(block) {
  if (!block || block.ptr == null) {
    return;
  }

  Module._release(block.ptr);

  // invalidate JS references
  block.ptr = null;
  block.memory = null;
  block.size = 0;
}

