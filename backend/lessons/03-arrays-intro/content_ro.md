## Tablouri: Fundația

Un **tablou** este o colecție de elemente de același tip stocate în **memorie contiguă**.
Tablourile îți oferă acces O(1) la orice element prin index.

### Declarare și Inițializare

```cpp
// Tablou de dimensiune fixă
int note[5] = {85, 92, 78, 96, 61};

// Tablou dinamic cu vector (preferat în C++ modern)
#include <vector>
vector<int> scoruri = {85, 92, 78, 96, 61};

// Vector gol, apoi adaugă elemente
vector<int> date;
date.push_back(10);  // date = [10]
date.push_back(20);  // date = [10, 20]
```

```python
# Listele Python se comportă ca tablouri dinamice
note = [85, 92, 78, 96, 61]

# Listă goală, apoi adaugă elemente
date = []
date.append(10)  # date = [10]
date.append(20)  # date = [10, 20]
```

### Indexare de la Zero

Tablourile folosesc **indexare de la zero** — primul element este la indexul 0.

```
Index:  0    1    2    3    4
Valoare:[85] [92] [78] [96] [61]
```

```cpp
cout << note[0];   // 85 — primul element
cout << note[4];   // 61 — ultimul element
cout << note[2];   // 78 — elementul din mijloc

// Greșeală comună: accesul în afara limitelor cauzează comportament nedefinit!
// cout << note[5];  // GREȘIT — există doar indicii 0..4
```

```python
print(note[0])   # 85 — primul element
print(note[4])   # 61 — ultimul element
print(note[-1])  # 61 — scurtătură Python: ultimul element
print(note[-2])  # 96 — penultimul element

# Python aruncă IndexError la acces în afara limitelor (mai sigur decât C++)
```

### Parcurgere

```cpp
// Sumează toate notele și calculează media
int total = 0;
int n = note.size();  // 5

for (int i = 0; i < n; i++) {
    total += note[i];
}
double medie = (double)total / n;
cout << "Medie: " << medie << endl;  // Medie: 82.4
```

```python
# Sumează toate notele și calculează media
total = sum(note)    # built-in: 412
n = len(note)        # 5
medie = total / n
print(f"Medie: {medie}")  # Medie: 82.4

# Sau manual cu o buclă:
total = 0
for nota in note:
    total += nota
medie = total / len(note)
```

### Exemplu Practic: Găsește Minimul și Maximul

```cpp
vector<int> temp = {23, 17, 31, 9, 28, 14};
int minTemp = temp[0];
int maxTemp = temp[0];

for (int i = 1; i < temp.size(); i++) {
    if (temp[i] < minTemp) minTemp = temp[i];
    if (temp[i] > maxTemp) maxTemp = temp[i];
}

cout << "Min: " << minTemp << endl;  // Min: 9
cout << "Max: " << maxTemp << endl;  // Max: 31
```

```python
temp = [23, 17, 31, 9, 28, 14]
min_temp = temp[0]
max_temp = temp[0]

for t in temp[1:]:           # slice: sare primul element
    if t < min_temp:
        min_temp = t
    if t > max_temp:
        max_temp = t

print(f"Min: {min_temp}")    # Min: 9
print(f"Max: {max_temp}")    # Max: 31

# Python are și funcții built-in: min(temp) și max(temp)
```

### Complexitate Temporală

| Operație | Complexitate | De ce |
|----------|-------------|-------|
| Acces prin index | O(1) | Calcul direct al adresei |
| Căutare (nesortat) | O(n) | Trebuie verificat fiecare element |
| Inserare la final | O(1) amortizat | Simplu append |
| Inserare la poziția `i` | O(n) | Trebuie deplasate elementele la dreapta |
| Ștergere la poziția `i` | O(n) | Trebuie deplasate elementele la stânga |
