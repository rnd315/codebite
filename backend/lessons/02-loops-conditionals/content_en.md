## Loops and Conditionals

### Conditionals

Conditionals let your program choose different paths based on a condition.

```cpp
int score = 72;

if (score >= 90) {
    cout << "Grade: A" << endl;
} else if (score >= 70) {
    cout << "Grade: B" << endl;
} else if (score >= 50) {
    cout << "Grade: C" << endl;
} else {
    cout << "Grade: F" << endl;
}
// Output: Grade: B
```

```python
score = 72

if score >= 90:
    print("Grade: A")
elif score >= 70:
    print("Grade: B")
elif score >= 50:
    print("Grade: C")
else:
    print("Grade: F")
# Output: Grade: B
```

### For Loops

Use a `for` loop when you know in advance how many iterations you need.

```cpp
// Print the first 5 square numbers
for (int i = 1; i <= 5; i++) {
    cout << i << "^2 = " << i * i << endl;
}
// Output:
// 1^2 = 1
// 2^2 = 4
// 3^2 = 9
// 4^2 = 16
// 5^2 = 25
```

```python
# Print the first 5 square numbers
for i in range(1, 6):
    print(f"{i}^2 = {i * i}")
# Output:
# 1^2 = 1
# 2^2 = 4
# 3^2 = 9
# 4^2 = 16
# 5^2 = 25
```

### While Loops

Use a `while` loop when you repeat until a condition becomes false.

```cpp
// Find the first power of 2 that exceeds 100
int value = 1;
int exponent = 0;
while (value <= 100) {
    value *= 2;
    exponent++;
}
cout << "2^" << exponent << " = " << value << " > 100" << endl;
// Output: 2^7 = 128 > 100
```

```python
# Find the first power of 2 that exceeds 100
value = 1
exponent = 0
while value <= 100:
    value *= 2
    exponent += 1
print(f"2^{exponent} = {value} > 100")
# Output: 2^7 = 128 > 100
```

### Worked Example: FizzBuzz

A classic programming test: print 1–20, but replace multiples of 3 with "Fizz",
multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".

```cpp
for (int i = 1; i <= 20; i++) {
    if (i % 3 == 0 && i % 5 == 0) {
        cout << "FizzBuzz" << endl;
    } else if (i % 3 == 0) {
        cout << "Fizz" << endl;
    } else if (i % 5 == 0) {
        cout << "Buzz" << endl;
    } else {
        cout << i << endl;
    }
}
// 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz,
// 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz
```

```python
for i in range(1, 21):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
# 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz,
# 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz
```

### Key Points

- `range(n)` in Python generates numbers `0` to `n-1`. Use `range(1, n+1)` to start from 1.
- C++ `for` loop: `init; condition; increment`.
- Indentation in Python is **mandatory** — it replaces `{}`.
- `%` is the modulo operator: `10 % 3 == 1` (remainder of 10 ÷ 3).
