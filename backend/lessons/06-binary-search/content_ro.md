## Căutarea Binară

**Căutarea Binară** găsește o valoare țintă într-un tablou **sortat** înjumătățind repetat intervalul de căutare.
În loc să verifice fiecare element ca la Căutarea Liniară, elimină jumătate din candidații rămași la fiecare pas — obținând complexitate **O(log n)**.

> Algoritm adaptat din [pbinfo.ro — Căutarea Binară](https://www.pbinfo.ro/articole/3633/cautarea-binara)

### Condiție obligatorie: tabloul trebuie să fie sortat

Căutarea Binară funcționează doar pe date sortate. Dacă tabloul nu este sortat, sortează-l mai întâi sau folosește Căutarea Liniară.

### Cum funcționează — pas cu pas

Căutăm `7` în `[1, 3, 5, 7, 9, 11, 13]` (indici 0–6):

```
st=0, dr=6 → m=3 → arr[3]=7 → GĂSIT la indicele 3 ✓
```

Căutăm `6` în `[1, 3, 5, 7, 9, 11, 13]`:

```
st=0, dr=6 → m=3 → arr[3]=7 > 6 → dr=2
st=0, dr=2 → m=1 → arr[1]=3 < 6 → st=2
st=2, dr=2 → m=2 → arr[2]=5 < 6 → st=3
st=3 > dr=2 → bucla se termină → NEGĂSIT, returnăm -1
```

La fiecare pas, spațiul de căutare **se înjumătățește**: 7 elemente → 4 → 2 → 1 → gata. Adică O(log₂ 7) ≈ 3 pași.

### Cod

```cpp
#include <iostream>
#include <vector>
using namespace std;

// Returnează indicele țintei în arr sortat, sau -1 dacă nu există.
int cautareBinara(vector<int>& arr, int tinta) {
    int st = 0, dr = arr.size() - 1;
    while (st <= dr) {
        int m = (st + dr) / 2;
        if (arr[m] == tinta) return m;
        if (arr[m] < tinta)  st = m + 1;  // tinta e în jumătatea dreaptă
        else                 dr = m - 1;  // tinta e în jumătatea stângă
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9, 11, 13};
    cout << cautareBinara(arr, 7)  << endl;  // 3
    cout << cautareBinara(arr, 6)  << endl;  // -1
    return 0;
}
```

```python
def cautare_binara(arr, tinta):
    st, dr = 0, len(arr) - 1
    while st <= dr:
        m = (st + dr) // 2
        if arr[m] == tinta:
            return m
        if arr[m] < tinta:
            st = m + 1   # tinta e în jumătatea dreaptă
        else:
            dr = m - 1   # tinta e în jumătatea stângă
    return -1

arr = [1, 3, 5, 7, 9, 11, 13]
print(cautare_binara(arr, 7))   # 3
print(cautare_binara(arr, 6))   # -1
```

### Variantă: cel mai mare indice unde arr[poz] ≤ x

Un șablon frecvent la concursuri, menționat în articolul pbinfo.ro:
găsește cea mai mare poziție `poz` astfel încât `arr[poz] <= x`.

```cpp
// Returnează cel mai mare poz unde arr[poz] <= x, sau -1 dacă nu există.
int limitaSup(vector<int>& arr, int x) {
    int st = 0, dr = arr.size() - 1, poz = -1;
    while (st <= dr) {
        int m = (st + dr) / 2;
        if (arr[m] <= x) { poz = m; st = m + 1; }
        else              dr = m - 1;
    }
    return poz;
}
```

```python
def limita_sup(arr, x):
    st, dr, poz = 0, len(arr) - 1, -1
    while st <= dr:
        m = (st + dr) // 2
        if arr[m] <= x:
            poz = m
            st = m + 1
        else:
            dr = m - 1
    return poz
```

### Analiza complexității

| Caz | Timp | Spațiu |
|-----|------|--------|
| Cel mai bun (ținta e mijlocul) | O(1) | O(1) |
| Mediu | O(log n) | O(1) |
| Cel mai rău (negăsit) | O(log n) | O(1) |

Pentru n = 1.000.000 de elemente: Căutarea Liniară necesită până la 1.000.000 de pași. Căutarea Binară necesită cel mult **20 de pași** (log₂ 1.000.000 ≈ 20).

### Când să folosești Căutarea Binară

✅ Tabloul este **sortat** (sau poate fi sortat o dată, apoi interogat de multe ori)
✅ Tabloul este **mare** — avantajul O(log n) crește dramatic
✅ Ai nevoie de **potrivire exactă** sau **poziție limită**
❌ Evită dacă tabloul nu e sortat și cauți o singură dată — sortarea costă O(n log n)

### Vizualizator

Folosește **Vizualizatorul de Algoritmi** de mai jos pentru a urmări Căutarea Binară pas cu pas.
Introdu un tablou sortat și o valoare țintă pentru a vedea cum se mișcă `st`, `dr` și `m` la fiecare iterație.
