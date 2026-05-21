## Arrays: The Foundation

An **array** is a collection of elements of the same type stored in **contiguous memory**.
Arrays give you O(1) access to any element by index.

### Declaration and Initialization

```cpp
// Fixed-size array
int grades[5] = {85, 92, 78, 96, 61};

// Dynamic array using vector (preferred in modern C++)
#include <vector>
vector<int> scores = {85, 92, 78, 96, 61};

// Empty vector, then add elements
vector<int> data;
data.push_back(10);  // data = [10]
data.push_back(20);  // data = [10, 20]
```

```python
# Python lists behave like dynamic arrays
grades = [85, 92, 78, 96, 61]

# Empty list, then add elements
data = []
data.append(10)  # data = [10]
data.append(20)  # data = [10, 20]
```

### Zero-Based Indexing

Arrays use **zero-based indexing** — the first element is at index 0.

```
Index:  0    1    2    3    4
Value: [85] [92] [78] [96] [61]
```

```cpp
cout << grades[0];   // 85 — first element
cout << grades[4];   // 61 — last element
cout << grades[2];   // 78 — middle element

// Common mistake: accessing out of bounds causes undefined behavior!
// cout << grades[5];  // WRONG — only indices 0..4 exist
```

```python
print(grades[0])   # 85 — first element
print(grades[4])   # 61 — last element
print(grades[-1])  # 61 — Python shortcut: last element
print(grades[-2])  # 96 — second to last

# Python raises IndexError on out-of-bounds access (safer than C++)
```

### Traversal

```cpp
// Sum all grades and compute average
int total = 0;
int n = grades.size();  // 5

for (int i = 0; i < n; i++) {
    total += grades[i];
}
double average = (double)total / n;
cout << "Average: " << average << endl;  // Average: 82.4
```

```python
# Sum all grades and compute average
total = sum(grades)    # built-in: 412
n = len(grades)        # 5
average = total / n
print(f"Average: {average}")  # Average: 82.4

# Or manually with a loop:
total = 0
for grade in grades:
    total += grade
average = total / len(grades)
```

### Worked Example: Find Min and Max

```cpp
vector<int> temps = {23, 17, 31, 9, 28, 14};
int minTemp = temps[0];
int maxTemp = temps[0];

for (int i = 1; i < temps.size(); i++) {
    if (temps[i] < minTemp) minTemp = temps[i];
    if (temps[i] > maxTemp) maxTemp = temps[i];
}

cout << "Min: " << minTemp << endl;  // Min: 9
cout << "Max: " << maxTemp << endl;  // Max: 31
```

```python
temps = [23, 17, 31, 9, 28, 14]
min_temp = temps[0]
max_temp = temps[0]

for t in temps[1:]:          # slice: skip first element
    if t < min_temp:
        min_temp = t
    if t > max_temp:
        max_temp = t

print(f"Min: {min_temp}")    # Min: 9
print(f"Max: {max_temp}")    # Max: 31

# Python also has built-ins: min(temps) and max(temps)
```

### Time Complexity

| Operation | Complexity | Why |
|-----------|-----------|-----|
| Access by index | O(1) | Direct address computation |
| Search (unsorted) | O(n) | Must check each element |
| Insert at end | O(1) amortized | Just append |
| Insert at position `i` | O(n) | Must shift elements right |
| Delete at position `i` | O(n) | Must shift elements left |
