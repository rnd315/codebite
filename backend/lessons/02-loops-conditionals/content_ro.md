## Bucle și Instrucțiuni Condiționale

### Instrucțiuni Condiționale

Condiționalele permit programului tău să aleagă căi diferite în funcție de o condiție.

```cpp
int scor = 72;

if (scor >= 90) {
    cout << "Nota: A" << endl;
} else if (scor >= 70) {
    cout << "Nota: B" << endl;
} else if (scor >= 50) {
    cout << "Nota: C" << endl;
} else {
    cout << "Nota: F" << endl;
}
// Ieșire: Nota: B
```

```python
scor = 72

if scor >= 90:
    print("Nota: A")
elif scor >= 70:
    print("Nota: B")
elif scor >= 50:
    print("Nota: C")
else:
    print("Nota: F")
# Ieșire: Nota: B
```

### Bucle For

Folosește o buclă `for` când știi dinainte câte iterații ai nevoie.

```cpp
// Afișează primele 5 pătrate perfecte
for (int i = 1; i <= 5; i++) {
    cout << i << "^2 = " << i * i << endl;
}
// Ieșire:
// 1^2 = 1
// 2^2 = 4
// 3^2 = 9
// 4^2 = 16
// 5^2 = 25
```

```python
# Afișează primele 5 pătrate perfecte
for i in range(1, 6):
    print(f"{i}^2 = {i * i}")
# Ieșire:
# 1^2 = 1
# 2^2 = 4
# 3^2 = 9
# 4^2 = 16
# 5^2 = 25
```

### Bucle While

Folosește o buclă `while` când repeți până când o condiție devine falsă.

```cpp
// Găsește prima putere a lui 2 care depășește 100
int valoare = 1;
int exponent = 0;
while (valoare <= 100) {
    valoare *= 2;
    exponent++;
}
cout << "2^" << exponent << " = " << valoare << " > 100" << endl;
// Ieșire: 2^7 = 128 > 100
```

```python
# Găsește prima putere a lui 2 care depășește 100
valoare = 1
exponent = 0
while valoare <= 100:
    valoare *= 2
    exponent += 1
print(f"2^{exponent} = {valoare} > 100")
# Ieșire: 2^7 = 128 > 100
```

### Exemplu Practic: FizzBuzz

Un test clasic de programare: afișează 1–20, dar înlocuiește multiplii de 3 cu "Fizz",
multiplii de 5 cu "Buzz", și multiplii ambilor cu "FizzBuzz".

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

### Puncte Cheie

- `range(n)` în Python generează numerele `0` până la `n-1`. Folosește `range(1, n+1)` pentru a începe de la 1.
- Bucla `for` în C++: `inițializare; condiție; increment`.
- Indentarea în Python este **obligatorie** — înlocuiește `{}`.
- `%` este operatorul modulo: `10 % 3 == 1` (restul împărțirii 10 ÷ 3).
