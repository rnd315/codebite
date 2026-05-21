## Sortare prin Bulă (Bubble Sort)

**Bubble Sort** parcurge repetat lista, compară elementele adiacente și le
interschimbă dacă sunt în ordinea greșită. Elementele mai mari "se ridică"
(ca bulele de aer) spre pozițiile lor corecte la sfârșitul tabloului.

### Cum Funcționează — Pas cu Pas

Să sortăm `[5, 3, 8, 1, 4]`:

**Trecerea 1:** Compară vecinii de la stânga la dreapta, interschimbă dacă sunt în ordine greșită.
```
[5, 3, 8, 1, 4]  →  compară 5,3  → swap  →  [3, 5, 8, 1, 4]
[3, 5, 8, 1, 4]  →  compară 5,8  → ok    →  [3, 5, 8, 1, 4]
[3, 5, 8, 1, 4]  →  compară 8,1  → swap  →  [3, 5, 1, 8, 4]
[3, 5, 1, 8, 4]  →  compară 8,4  → swap  →  [3, 5, 1, 4, 8]
```
După trecerea 1: `[3, 5, 1, 4, 8]` — **8 este pe poziția sa finală.**

**Trecerea 2:**
```
[3, 5, 1, 4, 8]  →  [3, 1, 4, 5, 8]  — 5 se ridică
```

**Trecerile 3 & 4:** Continuă până la sortare completă: `[1, 3, 4, 5, 8]`

### Cod

```cpp
#include <iostream>
#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}

int main() {
    vector<int> arr = {5, 3, 8, 1, 4};
    bubbleSort(arr);
    for (int x : arr) cout << x << " ";  // 1 3 4 5 8
    return 0;
}
```

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

arr = [5, 3, 8, 1, 4]
print(bubble_sort(arr))  # [1, 3, 4, 5, 8]
```

### Optimizare: Ieșire Timpurie

Dacă nu s-a făcut nicio interschimbare într-o trecere completă, tabloul este deja sortat — oprește-te.

```cpp
void bubbleSortOptimizat(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool interschimbat = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                interschimbat = true;
            }
        }
        if (!interschimbat) break;  // deja sortat — ieși devreme
    }
}
// Pe un tablou sortat: doar 1 trecere în loc de n-1
```

```python
def bubble_sort_optimizat(arr):
    n = len(arr)
    for i in range(n - 1):
        interschimbat = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                interschimbat = True
        if not interschimbat:
            break   # deja sortat — ieși devreme
    return arr

# Pe [1, 2, 3, 4, 5]: doar 1 trecere necesară
print(bubble_sort_optimizat([1, 2, 3, 4, 5]))  # [1, 2, 3, 4, 5]
```

### Analiza Complexității

| Caz | Timp | Spațiu | Când |
|-----|------|--------|------|
| Cel mai bun (deja sortat) | O(n) | O(1) | Cu optimizarea ieșirii timpurii |
| Mediu | O(n²) | O(1) | Input aleatoriu |
| Cel mai rău (sortat invers) | O(n²) | O(1) | `[5,4,3,2,1]` |

**Spațiul este O(1)** deoarece sortarea se face in-place — nu este nevoie de tablou suplimentar.

### Vizualizator

Folosește **Vizualizatorul de Algoritmi** de mai jos pentru a urmări pas cu pas
Bubble Sort pe un tablou personalizat. Observă cum elementele mai mari se ridică spre dreapta cu fiecare trecere.
