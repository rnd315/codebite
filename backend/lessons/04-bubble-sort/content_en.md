## Bubble Sort

**Bubble Sort** repeatedly steps through the list, compares adjacent elements,
and swaps them if they are in the wrong order. Larger elements "bubble up" to
their correct position at the end of the array.

### How It Works — Step by Step

Let's sort `[5, 3, 8, 1, 4]`:

**Pass 1:** Compare neighbors left to right, swap if out of order.
```
[5, 3, 8, 1, 4]  →  compare 5,3  → swap  →  [3, 5, 8, 1, 4]
[3, 5, 8, 1, 4]  →  compare 5,8  → ok    →  [3, 5, 8, 1, 4]
[3, 5, 8, 1, 4]  →  compare 8,1  → swap  →  [3, 5, 1, 8, 4]
[3, 5, 1, 8, 4]  →  compare 8,4  → swap  →  [3, 5, 1, 4, 8]
```
After pass 1: `[3, 5, 1, 4, 8]` — **8 is in its final position.**

**Pass 2:**
```
[3, 5, 1, 4, 8]  →  [3, 1, 4, 5, 8]  — 5 bubbles up
```

**Pass 3 & 4:** Continue until fully sorted: `[1, 3, 4, 5, 8]`

### Code

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

### Optimization: Early Exit

If no swaps happen in a full pass, the array is already sorted — stop early.

```cpp
void bubbleSortOptimized(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break;  // already sorted — exit early
    }
}
// On a sorted array: only 1 pass needed instead of n-1
```

```python
def bubble_sort_optimized(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break   # already sorted — exit early
    return arr

# On [1, 2, 3, 4, 5]: only 1 pass needed
print(bubble_sort_optimized([1, 2, 3, 4, 5]))  # [1, 2, 3, 4, 5]
```

### Complexity Analysis

| Case | Time | Space | When |
|------|------|-------|------|
| Best (already sorted) | O(n) | O(1) | With early-exit optimization |
| Average | O(n²) | O(1) | Random input |
| Worst (reverse sorted) | O(n²) | O(1) | `[5,4,3,2,1]` |

**Space is O(1)** because sorting is done in-place — no extra array needed.

### Visualizer

Use the **Algorithm Visualizer** below to step through Bubble Sort on a custom array.
Watch how larger elements bubble toward the right with each pass.
