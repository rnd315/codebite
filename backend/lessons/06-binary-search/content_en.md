## Binary Search

**Binary Search** finds a target value in a **sorted** array by repeatedly halving the search range.
Instead of checking every element like Linear Search, it eliminates half the remaining candidates on each step — achieving **O(log n)** time.

> Source algorithm adapted from [pbinfo.ro — Căutarea Binară](https://www.pbinfo.ro/articole/3633/cautarea-binara)

### Prerequisite: the array must be sorted

Binary Search only works on sorted data. If the array is unsorted, sort it first or use Linear Search.

### How It Works — Step by Step

Search for `7` in `[1, 3, 5, 7, 9, 11, 13]` (indices 0–6):

```
st=0, dr=6 → m=3 → arr[3]=7 → FOUND at index 3 ✓
```

Search for `6` in `[1, 3, 5, 7, 9, 11, 13]`:

```
st=0, dr=6 → m=3 → arr[3]=7 > 6 → dr=2
st=0, dr=2 → m=1 → arr[1]=3 < 6 → st=2
st=2, dr=2 → m=2 → arr[2]=5 < 6 → st=3
st=3 > dr=2 → loop ends → NOT FOUND, return -1
```

Each step **halves** the search space: 7 elements → 4 → 2 → 1 → done. That is O(log₂ 7) ≈ 3 steps.

### Code

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Returns index of target in sorted arr, or -1 if not found.
int binarySearch(vector<int>& arr, int target) {
    int st = 0, dr = arr.size() - 1;
    while (st <= dr) {
        int m = (st + dr) / 2;
        if (arr[m] == target) return m;
        if (arr[m] < target)  st = m + 1;  // target in right half
        else                  dr = m - 1;  // target in left half
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    cout << binarySearch(arr, 7)  << endl;  // 3
    cout << binarySearch(arr, 6)  << endl;  // -1
    return 0;
}
```

```python
def binary_search(arr, target):
    st, dr = 0, len(arr) - 1
    while st <= dr:
        m = (st + dr) // 2
        if arr[m] == target:
            return m
        if arr[m] < target:
            st = m + 1   # target in right half
        else:
            dr = m - 1   # target in left half
    return -1

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 6))   # -1
```

### Variant: Find the Largest Index Where arr[pos] ≤ x

A common competitive-programming pattern from the pbinfo.ro article:
find the rightmost position `pos` such that `arr[pos] <= x`.

```cpp
// Returns largest pos where arr[pos] <= x, or -1 if none exists.
int upperFloor(vector<int>& arr, int x) {
    int st = 0, dr = arr.size() - 1, pos = -1;
    while (st <= dr) {
        int m = (st + dr) / 2;
        if (arr[m] <= x) { pos = m; st = m + 1; }
        else              dr = m - 1;
    }
    return pos;
}
```

```python
def upper_floor(arr, x):
    st, dr, pos = 0, len(arr) - 1, -1
    while st <= dr:
        m = (st + dr) // 2
        if arr[m] <= x:
            pos = m
            st = m + 1
        else:
            dr = m - 1
    return pos
```

### Complexity Analysis

| Case | Time | Space |
|------|------|-------|
| Best (target is the midpoint) | O(1) | O(1) |
| Average | O(log n) | O(1) |
| Worst (not found) | O(log n) | O(1) |

For n = 1,000,000 elements: Linear Search needs up to 1,000,000 steps. Binary Search needs at most **20 steps** (log₂ 1,000,000 ≈ 20).

### When to Use Binary Search

✅ Array is **sorted** (or can be sorted once, then searched many times)
✅ Array is **large** — the O(log n) advantage grows dramatically
✅ You need **exact match** or **boundary position** queries
❌ Avoid if the array is unsorted and you only search once — sorting costs O(n log n)

### Visualizer

Use the **Algorithm Visualizer** below to trace Binary Search step by step.
Enter a sorted array and a target value to see `st`, `dr`, and `m` move with each iteration.
