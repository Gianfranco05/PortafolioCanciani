// Algoritmos de ordenamiento y búsqueda que devuelven la lista de PASOS (no solo el resultado),
// para poder reproducirlos, pausarlos y retroceder en el visualizador del Lab.
//
// Cada paso: { a, kind, idx, sorted, cmps, swaps, ...extras }
//   a      copia del arreglo en ese momento
//   kind   "start" | "compare" | "swap" | "newmin" | "pivot" | "place" | "done"
//          | (búsqueda) "probe" | "found" | "missing"
//   idx    posiciones que se están mirando
//   sorted posiciones que ya quedaron en su lugar definitivo
// Los textos se arman en la pantalla según `kind`, así se pueden traducir.

function recorder(input) {
  const a = [...input];
  const steps = [];
  const sorted = new Set();
  const stats = { cmps: 0, swaps: 0 };
  const push = (kind, extra = {}) =>
    steps.push({ a: [...a], kind, sorted: [...sorted], cmps: stats.cmps, swaps: stats.swaps, idx: [], ...extra });
  const swap = (i, j) => {
    [a[i], a[j]] = [a[j], a[i]];
    stats.swaps += 1;
  };
  return { a, steps, sorted, stats, push, swap };
}

export function bubbleSort(input) {
  const { a, steps, sorted, stats, push, swap } = recorder(input);
  const n = a.length;
  push("start");
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      stats.cmps += 1;
      push("compare", { idx: [j, j + 1], gt: a[j] > a[j + 1] });
      if (a[j] > a[j + 1]) {
        swap(j, j + 1);
        swapped = true;
        push("swap", { idx: [j, j + 1] });
      }
    }
    sorted.add(n - 1 - i);
    if (!swapped) {
      // una pasada sin intercambios: ya está todo ordenado
      for (let k = 0; k < n - 1 - i; k++) sorted.add(k);
      break;
    }
  }
  sorted.add(0);
  push("done");
  return steps;
}

export function selectionSort(input) {
  const { a, steps, sorted, stats, push, swap } = recorder(input);
  const n = a.length;
  push("start");
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      stats.cmps += 1;
      push("compare", { idx: [min, j], gt: a[min] > a[j], min });
      if (a[j] < a[min]) {
        min = j;
        push("newmin", { idx: [min], min });
      }
    }
    if (min !== i) {
      swap(i, min);
      push("swap", { idx: [i, min] });
    }
    sorted.add(i);
  }
  sorted.add(n - 1);
  push("done");
  return steps;
}

export function insertionSort(input) {
  const { a, steps, sorted, stats, push, swap } = recorder(input);
  const n = a.length;
  sorted.add(0);
  push("start");
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      stats.cmps += 1;
      push("compare", { idx: [j - 1, j], gt: a[j - 1] > a[j] });
      if (a[j - 1] > a[j]) {
        swap(j - 1, j);
        push("swap", { idx: [j - 1, j] });
        j -= 1;
      } else {
        break;
      }
    }
    sorted.add(i);
  }
  push("done");
  return steps;
}

// Quick sort con partición de Lomuto (pivote = último elemento del tramo).
export function quickSort(input) {
  const { a, steps, sorted, stats, push, swap } = recorder(input);
  push("start");
  const sort = (lo, hi) => {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.add(lo);
      return;
    }
    const pivot = hi;
    push("pivot", { idx: [pivot], range: [lo, hi], pivot });
    let store = lo;
    for (let j = lo; j < hi; j++) {
      stats.cmps += 1;
      push("compare", { idx: [j, pivot], range: [lo, hi], pivot, gt: a[j] >= a[pivot] });
      if (a[j] < a[pivot]) {
        if (store !== j) {
          swap(store, j);
          push("swap", { idx: [store, j], range: [lo, hi], pivot });
        }
        store += 1;
      }
    }
    if (store !== pivot) swap(store, pivot);
    sorted.add(store);
    push("place", { idx: [store], range: [lo, hi] });
    sort(lo, store - 1);
    sort(store + 1, hi);
  };
  sort(0, a.length - 1);
  push("done");
  return steps;
}

export function linearSearch(input, target) {
  const a = [...input];
  const steps = [];
  let cmps = 0;
  const push = (kind, extra) => steps.push({ a: [...a], kind, cmps, swaps: 0, sorted: [], idx: [], target, ...extra });
  push("start");
  for (let i = 0; i < a.length; i++) {
    cmps += 1;
    push("probe", { idx: [i], rel: a[i] === target ? "eq" : "ne", value: a[i] });
    if (a[i] === target) {
      push("found", { idx: [i], at: i });
      return steps;
    }
  }
  push("missing");
  return steps;
}

// Búsqueda binaria: el arreglo tiene que venir ordenado.
export function binarySearch(input, target) {
  const a = [...input];
  const steps = [];
  let cmps = 0;
  const push = (kind, extra) => steps.push({ a: [...a], kind, cmps, swaps: 0, sorted: [], idx: [], target, ...extra });
  let lo = 0;
  let hi = a.length - 1;
  push("start", { range: [lo, hi] });
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    cmps += 1;
    const rel = a[mid] === target ? "eq" : a[mid] < target ? "lt" : "gt";
    push("probe", { idx: [mid], range: [lo, hi], rel, value: a[mid] });
    if (rel === "eq") {
      push("found", { idx: [mid], range: [mid, mid], at: mid });
      return steps;
    }
    if (rel === "lt") lo = mid + 1;
    else hi = mid - 1;
  }
  push("missing", { range: [lo, hi] });
  return steps;
}

export const SORTERS = { bubble: bubbleSort, selection: selectionSort, insertion: insertionSort, quick: quickSort };
export const SEARCHERS = { linear: linearSearch, binary: binarySearch };

// Arreglo pseudoaleatorio reproducible (mulberry32) para que "nuevo arreglo" sea determinista por semilla.
export function makeArray(size, seed, { sorted = false, unique = true } = {}) {
  let t = (seed * 2654435761) >>> 0;
  const rnd = () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const pool = new Set();
  const out = [];
  while (out.length < size) {
    const v = 5 + Math.floor(rnd() * 95);
    if (unique && pool.has(v)) continue;
    pool.add(v);
    out.push(v);
  }
  return sorted ? out.sort((x, y) => x - y) : out;
}
