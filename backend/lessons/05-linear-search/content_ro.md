## Căutare Liniară (Linear Search)

**Căutarea Liniară** verifică fiecare element din tablou unul câte unul până găsește
valoarea țintă sau ajunge la sfârșitul tabloului.

Este cel mai simplu algoritm de căutare și funcționează pe **tablouri nesortate**.

### Cum Funcționează — Pas cu Pas

Caută `7` în `[4, 2, 7, 1, 9, 3]`:

```
indexul 0: arr[0] = 4  ≠ 7  → continuă
indexul 1: arr[1] = 2  ≠ 7  → continuă
indexul 2: arr[2] = 7  = 7  → GĂSIT la indexul 2 ✓
```

Caută `5` în `[4, 2, 7, 1, 9, 3]`:

```
indexul 0: 4 ≠ 5
indexul 1: 2 ≠ 5
indexul 2: 7 ≠ 5
indexul 3: 1 ≠ 5
indexul 4: 9 ≠ 5
indexul 5: 3 ≠ 5
Sfârșitul tabloului → NEGĂSIT, returnează -1
```

### Cod

```cpp
#include <iostream>
#include <vector>
using namespace std;

int cautareLineara(vector<int>& arr, int tinta) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == tinta) {
            return i;   // găsit la indexul i
        }
    }
    return -1;          // negăsit
}

int main() {
    vector<int> arr = {4, 2, 7, 1, 9, 3};
    int idx = cautareLineara(arr, 7);
    if (idx != -1) {
        cout << "Găsit la indexul " << idx << endl;  // Găsit la indexul 2
    } else {
        cout << "Negăsit" << endl;
    }
    return 0;
}
```

```python
def cautare_lineara(arr, tinta):
    for i, val in enumerate(arr):
        if val == tinta:
            return i    # găsit la indexul i
    return -1           # negăsit

arr = [4, 2, 7, 1, 9, 3]
idx = cautare_lineara(arr, 7)
if idx != -1:
    print(f"Găsit la indexul {idx}")   # Găsit la indexul 2
else:
    print("Negăsit")
```

### Exemplu Practic: Găsește un Student după Nume

```cpp
#include <vector>
#include <string>
using namespace std;

int gasesteStudent(vector<string>& nume, string tinta) {
    for (int i = 0; i < nume.size(); i++) {
        if (nume[i] == tinta) return i;
    }
    return -1;
}

int main() {
    vector<string> nume = {"Ana", "Bogdan", "Catalin", "Diana"};
    int poz = gasesteStudent(nume, "Catalin");
    cout << "Catalin este la pozitia " << poz << endl;  // 2
    return 0;
}
```

```python
def gaseste_student(nume, tinta):
    for i, n in enumerate(nume):
        if n == tinta:
            return i
    return -1

nume = ["Ana", "Bogdan", "Catalin", "Diana"]
poz = gaseste_student(nume, "Catalin")
print(f"Catalin este la poziția {poz}")  # 2
```

### Analiza Complexității

| Caz | Timp | Spațiu | Exemplu |
|-----|------|--------|---------|
| Cel mai bun (ținta e prima) | O(1) | O(1) | Ținta la indexul 0 |
| Mediu | O(n) | O(1) | Ținta la mijloc |
| Cel mai rău (negăsit) | O(n) | O(1) | Ținta absentă sau ultima |

### Când să Folosești Căutarea Liniară

✅ Tabloul este **nesortat**
✅ Tabloul este **mic** (sub câteva sute de elemente)
✅ Cauți o singură dată (nu merită sortarea pentru o singură interogare)
❌ Evită pentru tablouri mari sortate — folosește Căutarea Binară (O(log n))

### Vizualizator

Folosește **Vizualizatorul de Algoritmi** de mai jos pentru a urmări Căutarea Liniară pas cu pas.
Introdu un tablou personalizat și o valoare țintă pentru a vedea căutarea în acțiune.
