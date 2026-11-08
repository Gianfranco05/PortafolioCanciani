// Hojas de "Programo en papel". title, notas y código son bilingües ({ es, en }); se resuelven con tr().
//
// Para usar una foto o escaneo REAL de tu cuaderno: guardala en public/images/papel/
// (ej. public/images/papel/busqueda-binaria.jpg) y poné la ruta en `image`. Cuando hay
// `image`, la hoja manuscrita simulada se reemplaza por la foto.
const papel = [
  {
    id: "binaria",
    title: { es: "Búsqueda binaria", en: "Binary search" },
    image: null,
    imageAlt: {
      es: "Hoja de cuaderno con la búsqueda binaria resuelta a mano",
      en: "Notebook page with binary search worked out by hand",
    },
    sheet: {
      es: [
        "Buscar 57 en [3 8 15 23 42 57 61 78 90]",
        "1) izq=0  der=8  medio=4 → 42",
        "     42 < 57 → tiro la izquierda",
        "2) izq=5  der=8  medio=6 → 61",
        "     61 > 57 → tiro la derecha",
        "3) izq=5  der=5  medio=5 → 57 ✓",
        "Cada vuelta descarta la mitad:",
        "→ log₂ n pasos, no n",
      ],
      en: [
        "Find 57 in [3 8 15 23 42 57 61 78 90]",
        "1) lo=0  hi=8  mid=4 → 42",
        "     42 < 57 → drop the left half",
        "2) lo=5  hi=8  mid=6 → 61",
        "     61 > 57 → drop the right half",
        "3) lo=5  hi=5  mid=5 → 57 ✓",
        "Every round drops half:",
        "→ log₂ n steps, not n",
      ],
    },
    code: {
      es: `function busquedaBinaria(a, x) {
  let izq = 0, der = a.length - 1;
  while (izq <= der) {
    const medio = Math.floor((izq + der) / 2);
    if (a[medio] === x) return medio;
    if (a[medio] < x) izq = medio + 1;
    else der = medio - 1;
  }
  return -1;
}`,
      en: `function binarySearch(a, x) {
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (a[mid] === x) return mid;
    if (a[mid] < x) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    },
  },
  {
    id: "burbuja",
    title: { es: "Ordenamiento burbuja", en: "Bubble sort" },
    image: null,
    imageAlt: {
      es: "Hoja de cuaderno con el ordenamiento burbuja resuelto a mano",
      en: "Notebook page with bubble sort worked out by hand",
    },
    sheet: {
      es: [
        "Ordenar [5 2 9 1 6]",
        "pasada 1:  2 5 1 6 9   (el 9 ya quedó)",
        "pasada 2:  2 1 5 6 9",
        "pasada 3:  1 2 5 6 9",
        "pasada 4:  sin cambios → listo",
        "Si una pasada no cambia nada,",
        "ya está ordenado: corto.",
        "Dos for anidados → n² comparaciones",
      ],
      en: [
        "Sort [5 2 9 1 6]",
        "pass 1:  2 5 1 6 9   (9 is in place)",
        "pass 2:  2 1 5 6 9",
        "pass 3:  1 2 5 6 9",
        "pass 4:  no swaps → done",
        "If a pass changes nothing,",
        "it is sorted: stop early.",
        "Two nested loops → n² comparisons",
      ],
    },
    code: {
      es: `function burbuja(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let huboCambio = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        huboCambio = true;
      }
    }
    if (!huboCambio) break;
  }
  return a;
}`,
      en: `function bubbleSort(a) {
  for (let i = 0; i < a.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return a;
}`,
    },
  },
];

export default papel;
