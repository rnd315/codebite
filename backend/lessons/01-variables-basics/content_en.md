## Variables and Data Types

A **variable** is a named container that stores a value in memory.
kkkk variable has a **data type** that determines what kind of value it can hold.

### Common Data Types

| Type | C++ | Python | Example |
|------|-----|--------|---------|
| Integer | `int` | `int` | `42` |
| Floating point | `double` | `float` | `3.14` |
| Boolean | `bool` | `bool` | `true / True` |
| String | `string` | `str` | `"Hello"` |

### Declaring Variables

In **C++**, you must declare the type explicitly:

```cpp
int age = 17;
double pi = 3.14159;
string name = "Alice";
bool isStudent = true;

// You can also declare without initializing, but avoid this —
// uninitialized variables hold garbage values.
int score;        // BAD: unknown value
int score = 0;    // GOOD: always initialize
```

In **Python**, the type is inferred automatically:

```python
age = 17
pi = 3.14159
name = "Alice"
is_student = True

# Python also lets you check the type at runtime:
print(type(age))    # <class 'int'>
print(type(name))   # <class 'str'>
```

### Worked Example: Student Grade Tracker

Let's store a student's name, grade, and pass/fail status:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string studentName = "Maria";
    double grade = 8.75;
    bool passed = grade >= 5.0;

    cout << studentName << ": " << grade;
    if (passed) {
        cout << " (PASSED)" << endl;
    } else {
        cout << " (FAILED)" << endl;
    }
    // Output: Maria: 8.75 (PASSED)
    return 0;
}
```

```python
student_name = "Maria"
grade = 8.75
passed = grade >= 5.0

print(f"{student_name}: {grade}", end=" ")
print("(PASSED)" if passed else "(FAILED)")
# Output: Maria: 8.75 (PASSED)
```

### Key Rules

- Variable names must start with a letter or underscore (`_`).
- Names are **case-sensitive**: `age` and `Age` are different variables.
- Choose descriptive names: `studentCount` is better than `sc`.
- In C++, always initialize variables — uninitialized variables hold garbage values.

### Type Conversion

Sometimes you need to convert between types:

```cpp
double price = 9.99;
int rounded = (int)price;   // explicit cast: rounded = 9 (truncates)
int rounded2 = (int)(price + 0.5);  // rounded2 = 10

string s = to_string(42);   // int to string
int n = stoi("123");        // string to int
```

```python
price = 9.99
rounded = int(price)        # rounded = 9 (truncates, same as C++)
rounded2 = round(price)     # rounded2 = 10 (proper rounding)

s = str(42)                 # int to string: "42"
n = int("123")              # string to int: 123
```
