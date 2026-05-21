## Variabile și Tipuri de Date

O **variabilă** este un container cu un nume care stochează o valoare în memorie.
Fiecare variabilă are un **tip de date** care determină ce fel de valoare poate stoca.

### Tipuri de Date Comune

| Tip | C++ | Python | Exemplu |
|-----|-----|--------|---------|
| Întreg | `int` | `int` | `42` |
| Virgulă mobilă | `double` | `float` | `3.14` |
| Boolean | `bool` | `bool` | `true / True` |
| Șir de caractere | `string` | `str` | `"Salut"` |

### Declararea Variabilelor

În **C++**, trebuie să declari tipul explicit:

```cpp
int varsta = 17;
double pi = 3.14159;
string nume = "Ana";
bool esteStudent = true;

// Poți declara fără inițializare, dar evită asta —
// variabilele neinițializate conțin valori aleatorii.
int scor;        // RĂU: valoare necunoscută
int scor = 0;    // BUN: inițializează întotdeauna
```

În **Python**, tipul este dedus automat:

```python
varsta = 17
pi = 3.14159
nume = "Ana"
este_student = True

# Python permite și verificarea tipului la rulare:
print(type(varsta))  # <class 'int'>
print(type(nume))    # <class 'str'>
```

### Exemplu Practic: Registru Note Studenți

Să stocăm numele, nota și statusul unui student:

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string numeStudent = "Maria";
    double nota = 8.75;
    bool promovat = nota >= 5.0;

    cout << numeStudent << ": " << nota;
    if (promovat) {
        cout << " (PROMOVAT)" << endl;
    } else {
        cout << " (RESPINS)" << endl;
    }
    // Ieșire: Maria: 8.75 (PROMOVAT)
    return 0;
}
```

```python
nume_student = "Maria"
nota = 8.75
promovat = nota >= 5.0

print(f"{nume_student}: {nota}", end=" ")
print("(PROMOVAT)" if promovat else "(RESPINS)")
# Ieșire: Maria: 8.75 (PROMOVAT)
```

### Reguli Importante

- Numele variabilelor trebuie să înceapă cu o literă sau underscore (`_`).
- Numele sunt **case-sensitive**: `varsta` și `Varsta` sunt variabile diferite.
- Alege nume descriptive: `numarStudenti` este mai bun decât `ns`.
- În C++, inițializează întotdeauna variabilele — cele neinițializate conțin valori aleatorii.

### Conversia Tipurilor

Uneori trebuie să convertești între tipuri:

```cpp
double pret = 9.99;
int rotunjit = (int)pret;          // cast explicit: rotunjit = 9 (trunchiază)
int rotunjit2 = (int)(pret + 0.5); // rotunjit2 = 10

string s = to_string(42);   // int la string
int n = stoi("123");        // string la int
```

```python
pret = 9.99
rotunjit = int(pret)        # rotunjit = 9 (trunchiază, la fel ca C++)
rotunjit2 = round(pret)     # rotunjit2 = 10 (rotunjire corectă)

s = str(42)                 # int la string: "42"
n = int("123")              # string la int: 123
```
