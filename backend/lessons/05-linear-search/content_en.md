## Linear Search

**Linear Search** checks each element in the array one by one until it finds
the target value or reaches the end of the array.

It is the simplest search algorithm and works on **unsorted arrays**.

### How It Works — Step by Step

Search for `7` in `[4, 2, 7, 1, 9, 3]`:

```
index 0: arr[0] = 4  ≠ 7  → continue
index 1: arr[1] = 2  ≠ 7  → continue
index 2: arr[2] = 7  = 7  → FOUND at index 2 ✓
```

Search for `5` in `[4, 2, 7, 1, 9, 3]`:

```
index 0: 4 ≠ 5
index 1: 2 ≠ 5
index 2: 7 ≠ 5
index 3: 1 ≠ 5
index 4: 9 ≠ 5
index 5: 3 ≠ 5
End of array → NOT FOUND, return -1
```

### Code

```cpp
#include <iostream>
#include <vector>
using namespace std;

int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;   // found at index i
        }
    }
    return -1;          // not found
}

int main() {
    vector<int> arr = {4, 2, 7, 1, 9, 3};
    int idx = linearSearch(arr, 7);
    if (idx != -1) {
        cout << "Found at index " << idx << endl;  // Found at index 2
    } else {
        cout << "Not found" << endl;
    }
    return 0;
}
```

```python
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i    # found at index i
    return -1           # not found

arr = [4, 2, 7, 1, 9, 3]
idx = linear_search(arr, 7)
if idx != -1:
    print(f"Found at index {idx}")   # Found at index 2
else:
    print("Not found")
```

### Worked Example: Find a Student by Name

```cpp
#include <vector>
#include <string>
using namespace std;

int findStudent(vector<string>& names, string target) {
    for (int i = 0; i < names.size(); i++) {
        if (names[i] == target) return i;
    }
    return -1;
}

int main() {
    vector<string> names = {"Ana", "Bogdan", "Catalin", "Diana"};
    int pos = findStudent(names, "Catalin");
    cout << "Catalin is at position " << pos << endl;  // 2
    return 0;
}
```

```python
def find_student(names, target):
    for i, name in enumerate(names):
        if name == target:
            return i
    return -1

names = ["Ana", "Bogdan", "Catalin", "Diana"]
pos = find_student(names, "Catalin")
print(f"Catalin is at position {pos}")  # 2
```

### Complexity Analysis

| Case | Time | Space | Example |
|------|------|-------|---------|
| Best (target is first) | O(1) | O(1) | Target at index 0 |
| Average | O(n) | O(1) | Target in the middle |
| Worst (not found) | O(n) | O(1) | Target absent or last |

### When to Use Linear Search

✅ Array is **unsorted**
✅ Array is **small** (under a few hundred elements)
✅ You only search **once** (not worth sorting for a single query)
❌ Avoid for large sorted arrays — use Binary Search instead (O(log n))

### Visualizer

Use the **Algorithm Visualizer** below to trace Linear Search step by step.
Enter a custom array and a target value to see the search in action.
