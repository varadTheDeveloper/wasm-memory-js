# malloc-js

Manual memory management for JavaScript powered by WebAssembly.

`malloc-js` brings a familiar C-style memory model to JavaScript. Allocate raw memory blocks, work directly with bytes through TypedArrays, and explicitly free memory when you're done.

## Why?

JavaScript normally relies on garbage collection.

Sometimes, especially when working with:

* WebAssembly
* Large binary files
* Video processing
* Audio processing
* Custom runtimes
* Low-level systems experiments

it can be useful to manage memory manually.

`malloc-js` provides a simple API inspired by C's `malloc()` and `free()`.

---

## Installation

```bash
npm install malloc-js
```

---

## Basic Usage

```js
import {
  allocMemory,
  freeMemory
} from "malloc-js";

const block = allocMemory(100);

block.memory[0] = 65;
block.memory[1] = 66;
block.memory[2] = 67;

freeMemory(block);
```

---

## Memory Block

Calling:

```js
const block = allocMemory(100);
```

returns:

```js
{
  ptr: 1024,
  size: 100,
  memory: Uint8Array(...)
}
```

## Large Memory Allocations

`malloc-js` is configured with **1 GB of initial WebAssembly memory**, allowing applications to work with large binary datasets and memory-intensive workloads.

Examples:

```js
const block = allocMemory(
  1024 * 1024 * 100
); // 100 MB
```

```js
const block = allocMemory(
  1024 * 1024 * 1024
); // 1 GB
```

Check the current WebAssembly memory size:

```js
console.log(
  block.memory.buffer.byteLength
);
```

Typical use cases:

* Large file processing
* Video and audio pipelines
* WebAssembly runtimes
* Binary protocols
* Custom memory allocators
* Systems programming experiments

### Notes

* Actual usable memory depends on available system resources.
* WebAssembly memory is backed by virtual memory and may not immediately consume physical RAM.
* Extremely large allocations may still fail if insufficient memory is available.
* Always free memory when finished:

```js
freeMemory(block);
```

### Properties

| Property | Description                               |
| -------- | ----------------------------------------- |
| ptr      | Pointer/address inside WebAssembly memory |
| size     | Allocated size in bytes                   |
| memory   | Uint8Array view over the allocated memory |

---

## Writing Data

```js
const block = allocMemory(4);

block.memory[0] = 10;
block.memory[1] = 20;
block.memory[2] = 30;
block.memory[3] = 40;
```

---

## Reading Data

```js
console.log(block.memory[0]);
console.log(block.memory[1]);
```

---

## Working With Strings

```js
const block = allocMemory(100);

const bytes =
  new TextEncoder().encode("hello");

block.memory.set(bytes);

const text =
  new TextDecoder().decode(
    block.memory.subarray(
      0,
      bytes.length
    )
  );

console.log(text);
```

Output:

```txt
hello
```

---

## Freeing Memory

```js
freeMemory(block);
```

After freeing:

```js
block.ptr === null;
block.memory === null;
block.size === 0;
```

This helps prevent accidental use-after-free bugs.

---

## Important Notes

### Memory Is Not Erased

Calling:

```js
freeMemory(block);
```

does not immediately erase bytes.

It marks the memory as available for future allocations.

---

### Do Not Use Freed Blocks

Bad:

```js
freeMemory(block);

block.memory[0] = 123;
```

Good:

```js
block.memory[0] = 123;

freeMemory(block);
```

---

## Inspiration

`malloc-js` is inspired by:

```c
void* ptr = malloc(size);

/* use memory */

free(ptr);
```

and brings a similar workflow to JavaScript through WebAssembly.

---

## License

MIT
