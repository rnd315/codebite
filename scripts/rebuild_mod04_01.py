"""Rebuilds mod04_01 -- Introducere in Vectori (Arrays). No emojis. Noob-friendly."""
import json, pathlib

ROOT = pathlib.Path(__file__).parent.parent
OUT  = ROOT / "backend/lessons/mod04_vectori/mod04_01_intro.json"

pages = {
  "ro": {
    "cpp": {
      "architect": [
        "### Trenul de date\n\n"
        "Pana acum, o variabila = o cutie. Dar daca ai nevoie de 100 de cutii? "
        "Un **vector** este ca un tren lung in memorie -- un singur nume, "
        "dar cu mai multe vagoane lipite, fiecare tinand o valoare.",

        "### Regula de aur: indexul porneste de la 0!\n\n"
        "Vagoanele nu se numara de la 1, ci de la 0. "
        "Primul vagon este `v[0]`, al doilea `v[1]`. "
        "Daca trenul are 5 vagoane, ultimul e `v[4]`, nu `v[5]`. "
        "Asta e capcana in care pica toti incepatorii.",
      ],
      "hacker": [
        "### Un singur nume, mai multe sloturi\n\n"
        "100 de variabile separate = haos. "
        "Un vector = un singur identificator pentru un bloc continuu de sloturi in memorie. "
        "In C++ declari tipul, numele si marimea. "
        "Sistemul aloca spatiu instant.",

        "### Indexul: contor de la zero\n\n"
        "Slotul 0 = primul element. Slotul `n-1` = ultimul. "
        "Daca vectorul are 5 sloturi si accesezi `v[5]`, iesi din zona alocata. "
        "Programul crapa sau citeste date corupte. Nu exista avertizare.",
      ],
      "socrates": [
        "### O problema de stocare\n\n"
        "Daca ai 5 note si 5 variabile separate, ce se intampla cand ai 500? "
        "Trebuie sa existe o modalitate de a stoca o lista de valori sub un singur nume. "
        "Cum crezi ca ar putea arata asta in memorie?",

        "### De ce numaram de la 0?\n\n"
        "Daca primul vagon al trenului ar fi `v[1]`, ce numar ar fi la inceput? "
        "Computerele numara pozitiile ca distante de la inceput. "
        "Distanta de la start la primul element = 0. "
        "De aceea indexarea incepe mereu de la zero.",
      ],
    },
    "python": {
      "architect": [
        "### Trenul de date\n\n"
        "Pana acum, o variabila = o cutie. Dar daca ai nevoie de 100 de cutii? "
        "In Python un **vector** se numeste **lista** -- un singur nume, "
        "dar cu mai multe vagoane lipite, fiecare tinand o valoare.",

        "### Regula de aur: indexul porneste de la 0!\n\n"
        "Vagoanele nu se numara de la 1, ci de la 0. "
        "Primul vagon este `v[0]`, al doilea `v[1]`. "
        "Daca lista are 5 elemente, ultimul e `v[4]`, nu `v[5]`. "
        "Python iti spune clar cand depasesti limita -- spre deosebire de C++.",
      ],
      "hacker": [
        "### Un singur nume, mai multe sloturi\n\n"
        "100 de variabile separate = haos. "
        "O lista Python = un singur identificator pentru o colectie de elemente. "
        "Nu declari tipul, nu declari marimea fixa -- "
        "Python o gestioneaza automat.",

        "### Indexul: contor de la zero\n\n"
        "Slotul 0 = primul element. Slotul `n-1` = ultimul. "
        "Daca lista are 5 elemente si accesezi `v[5]`, "
        "Python arunca `IndexError: list index out of range`. "
        "Eroare clara, nu crash silentios ca in C++.",
      ],
      "socrates": [
        "### O problema de stocare\n\n"
        "Daca ai 5 note si 5 variabile separate, ce se intampla cand ai 500? "
        "Trebuie sa existe o modalitate de a stoca o lista de valori sub un singur nume. "
        "In Python, cum crezi ca s-ar putea crea un vector cu 5 sloturi?",

        "### De ce numaram de la 0?\n\n"
        "Daca primul element al listei ar fi `v[1]`, ce ar fi la pozitia 0? "
        "Computerele numara ca distante de la inceput. "
        "Distanta de la start la primul element = 0. "
        "Python respecta aceeasi conventie ca toate limbajele majore.",
      ],
    },
  },
  "en": {
    "cpp": {
      "architect": [
        "### The Data Train\n\n"
        "So far, one variable = one box. But what if you need 100 boxes? "
        "An **array** is like a long train in memory -- one single name, "
        "but with multiple cars stuck together, each holding one value.",

        "### Golden rule: the index starts at 0!\n\n"
        "Cars are not numbered from 1, but from 0. "
        "The first car is `v[0]`, the second is `v[1]`. "
        "If the train has 5 cars, the last one is `v[4]`, not `v[5]`. "
        "This is the trap every beginner falls into.",
      ],
      "hacker": [
        "### One name, many slots\n\n"
        "100 separate variables = chaos. "
        "An array = a single identifier for a continuous block of memory slots. "
        "In C++ you declare the type, the name, and the size. "
        "The system allocates space instantly.",

        "### The index: a counter from zero\n\n"
        "Slot 0 = first element. Slot `n-1` = last. "
        "If the array has 5 slots and you access `v[5]`, you exit the allocated zone. "
        "The program crashes or reads corrupted data. No warning.",
      ],
      "socrates": [
        "### A storage problem\n\n"
        "If you have 5 grades and 5 separate variables, what happens when you have 500? "
        "There must be a way to store a list of values under a single name. "
        "How do you think that would look in memory?",

        "### Why do we count from 0?\n\n"
        "If the first car of the train were `v[1]`, what would be at the beginning? "
        "Computers count positions as distances from the start. "
        "The distance from the start to the first element = 0. "
        "That is why indexing always starts from zero.",
      ],
    },
    "python": {
      "architect": [
        "### The Data Train\n\n"
        "So far, one variable = one box. But what if you need 100 boxes? "
        "In Python an **array** is called a **list** -- one single name, "
        "but with multiple cars stuck together, each holding one value.",

        "### Golden rule: the index starts at 0!\n\n"
        "Cars are not numbered from 1, but from 0. "
        "The first car is `v[0]`, the second is `v[1]`. "
        "If the list has 5 elements, the last one is `v[4]`, not `v[5]`. "
        "Python tells you clearly when you go out of bounds -- unlike C++.",
      ],
      "hacker": [
        "### One name, many slots\n\n"
        "100 separate variables = chaos. "
        "A Python list = one identifier for a collection of elements. "
        "No type declaration, no fixed size -- "
        "Python manages it automatically.",

        "### The index: a counter from zero\n\n"
        "Slot 0 = first element. Slot `n-1` = last. "
        "If the list has 5 elements and you access `v[5]`, "
        "Python throws `IndexError: list index out of range`. "
        "A clear error, not a silent crash like in C++.",
      ],
      "socrates": [
        "### A storage problem\n\n"
        "If you have 5 grades and 5 separate variables, what happens when you have 500? "
        "There must be a way to store a list of values under a single name. "
        "In Python, how do you think you would create a vector with 5 slots?",

        "### Why do we count from 0?\n\n"
        "If the first element of the list were `v[1]`, what would be at position 0? "
        "Computers count as distances from the start. "
        "Distance from start to the first element = 0. "
        "Python follows the same convention as every major language.",
      ],
    },
  },
}

cascades = {
  "ro": {
    "cpp": {
      "architect": (
        "### Cum construim si controlam vectorul in C++\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5];        // tren cu 5 vagoane -- atentie, pline cu gunoaie!\n"
        "    v[0] = 10;\n"
        "    v[1] = 20;\n"
        "    v[2] = 77;       // al treilea vagon primeste 77\n"
        "    v[3] = 40;\n"
        "    v[4] = 50;       // ultimul vagon valide este v[4], nu v[5]!\n\n"
        '    cout << "Vagonul 0: " << v[0] << "\\n";\n'
        '    cout << "Vagonul 2: " << v[2] << "\\n";\n'
        "    // v[5] = 99;    // CRASH! Vagon inexistent -- memorie corupta!\n"
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**Ce face fiecare linie:**\n"
        "- `int v[5];` -- rezerva 5 vagoane de numere intregi; **vagoanele contin gunoaie pana le dai valori!**\n"
        "- `v[2] = 77;` -- pune 77 in al treilea vagon (indexat de la 0)\n"
        "- `cout << v[0]` -- citeste si afiseaza primul vagon\n"
        "- `v[5]` comentat -- ar accesa un vagon inexistent si ar crapa programul\n\n"
        "**Regula critica:** In C++, daca accesezi `v[5]` pe un vector de marime 5, "
        "nu primesti o eroare frumoasa -- programul pur si simplu crapa sau citeste date corupte. "
        "Initializeaza intotdeauna vagoanele si nu uita ca ultimul index valid este `dimensiune - 1`."
      ),
      "hacker": (
        "### Aloca. Incarca. Acceseaza.\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5] = {10, 20, 77, 40, 50};  // init complet -- zero gunoaie\n\n"
        '    cout << v[0] << "\\n";\n'
        '    cout << v[2] << "\\n";             // output: 77\n'
        '    cout << v[4] << "\\n";             // ultimul slot valid\n'
        "    // v[5] -- OUT OF BOUNDS, crash garantat\n"
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**Breakdown:**\n"
        "- `int v[5] = {10,20,77,40,50};` -- aloca si initializeaza in acelasi pas\n"
        "- `v[0]` pana la `v[4]` -- range valid\n"
        "- `v[5]` -- acces in afara zonei alocate: comportament nedefinit, crash probabil\n"
        "- Fara initializare (`int v[5];`) -- sloturi pline cu garbage din RAM\n\n"
        "**Competitive tip:** Cand declari vectori mari, initializeaza cu `= {}` sau `memset`. "
        "Un Garbage Value intr-un vector de 10^6 elemente te poate costa TLE sau WA "
        "fara niciun mesaj de eroare vizibil."
      ),
      "socrates": (
        "### Descoperi singur cum functioneaza vectorul\n\n"
        "Inainte sa citesti explicatiile, ghiceste ce afiseaza codul:\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5] = {10, 20, 77, 40, 50};\n\n"
        '    cout << "Vagonul 0: " << v[0] << "\\n";\n'
        '    cout << "Vagonul 2: " << v[2] << "\\n";\n'
        '    cout << "Vagonul 4: " << v[4] << "\\n";\n'
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**Hai sa verificam:**\n"
        "- De ce `v[2]` afiseaza 77 si nu 20? Numara de la 0: v[0]=10, v[1]=20, v[2]=77.\n"
        "- Ce s-ar intampla daca ai scrie `v[5]`? Nu exista un al 6-lea vagon!\n"
        "- De ce `int v[5];` fara valori e periculos? Vagoanele contin ce era in memorie inainte.\n\n"
        "**Insight:** In C++, indexul gresite nu da o eroare frumoasa -- "
        "programul continua cu date corupte sau se opreste brusc. "
        "Spre deosebire de Python, nu primesti niciun mesaj clar. "
        "Initializeaza mereu si verifica limitele inainte sa accesezi."
      ),
    },
    "python": {
      "architect": (
        "### Cum construim si controlam lista in Python\n\n"
        "```python\n"
        "v = [0] * 5         # creeaza 5 vagoane curate, toate cu valoarea 0\n"
        "v[0] = 10\n"
        "v[1] = 20\n"
        "v[2] = 77           # al treilea vagon primeste 77\n"
        "v[3] = 40\n"
        "v[4] = 50           # ultimul vagon valid este v[4]\n\n"
        "print('Vagonul 0:', v[0])\n"
        "print('Vagonul 2:', v[2])\n"
        "print('Trenul complet:', v)\n"
        "# v[5] = 99         # IndexError: list index out of range\n"
        "```\n\n"
        "**Ce face fiecare linie:**\n"
        "- `[0] * 5` -- creeaza o lista cu 5 elemente, toate 0; **nu exista gunoaie!**\n"
        "- `v[2] = 77` -- pune 77 in al treilea element (indexat de la 0)\n"
        "- `print(v)` -- afiseaza toata lista: `[10, 20, 77, 40, 50]`\n"
        "- `v[5]` comentat -- Python ar arunca un `IndexError` clar\n\n"
        "**Avantaj cheie:** In Python nu exista Garbage Values in liste. "
        "`[0] * 5` initializeaza curatele. "
        "Daca mergi in afara limitelor, primesti `IndexError` cu mesaj clar -- "
        "mult mai usor de depanat decat crashul silentios din C++."
      ),
      "hacker": (
        "### Creeaza. Incarca. Afiseaza.\n\n"
        "```python\n"
        "v = [10, 20, 77, 40, 50]   # initializare completa direct\n\n"
        "print(v[0])                 # 10\n"
        "print(v[2])                 # 77\n"
        "print(v[-1])                # 50 -- Python: indexul -1 = ultimul element\n"
        "print(v)                    # [10, 20, 77, 40, 50]\n"
        "# v[5]                      # IndexError: list index out of range\n"
        "```\n\n"
        "**Breakdown:**\n"
        "- `[10,20,77,40,50]` -- lista cu valori directe, zero garbage\n"
        "- `v[-1]` -- truc Python: indexul negativ acceseaza de la coada\n"
        "- `v[5]` -- IndexError imediat, mesaj clar, nu crash silentios\n"
        "- Marimea listei se obtine cu `len(v)` -- returneaza 5\n\n"
        "**Trick Python:** `v = [0] * n` pentru a crea rapid o lista de `n` zerouri. "
        "Adauga la coada cu `v.append(val)`, sterge cu `v.pop()`. "
        "Lista Python creste si se micsoreaza dinamic -- nu ai marimea fixa ca in C++."
      ),
      "socrates": (
        "### Descoperi singur cum functioneaza lista Python\n\n"
        "Citeste si ghiceste inainte de explicatii:\n\n"
        "```python\n"
        "v = [10, 20, 77, 40, 50]\n\n"
        "print('Vagonul 0:', v[0])\n"
        "print('Vagonul 2:', v[2])\n"
        "print('Vagonul 4:', v[4])\n"
        "print('Trenul complet:', v)\n"
        "```\n\n"
        "**Hai sa verificam:**\n"
        "- De ce `v[2]` afiseaza 77? Numara de la 0: v[0]=10, v[1]=20, v[2]=77.\n"
        "- Ce se intampla daca scrii `v[5]`? Python arunca `IndexError: list index out of range`.\n"
        "- De ce `[0] * 5` e mai sigur decat `int v[5];` din C++? Nu exista gunoaie!\n\n"
        "**Insight:** Python te protejeaza de accesul in afara limitelor cu un mesaj clar. "
        "In C++ acelasi tip de greseala crapa programul fara explicatie. "
        "Asta nu inseamna ca Python e 'mai bun' -- inseamna ca face alegeri diferite: "
        "siguranta in detrimentul vitezei brute."
      ),
    },
  },
  "en": {
    "cpp": {
      "architect": (
        "### How to Build and Control the Array in C++\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5];        // train with 5 cars -- careful, full of garbage!\n"
        "    v[0] = 10;\n"
        "    v[1] = 20;\n"
        "    v[2] = 77;       // the third car gets 77\n"
        "    v[3] = 40;\n"
        "    v[4] = 50;       // the last valid car is v[4], not v[5]!\n\n"
        '    cout << "Car 0: " << v[0] << "\\n";\n'
        '    cout << "Car 2: " << v[2] << "\\n";\n'
        "    // v[5] = 99;    // CRASH! Car does not exist -- corrupted memory!\n"
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**What each line does:**\n"
        "- `int v[5];` -- reserves 5 integer cars; **cars hold garbage until you give them values!**\n"
        "- `v[2] = 77;` -- puts 77 in the third car (indexed from 0)\n"
        "- `cout << v[0]` -- reads and displays the first car\n"
        "- `v[5]` commented out -- would access a non-existent car and crash the program\n\n"
        "**Critical rule:** In C++, accessing `v[5]` on an array of size 5 does not give you a "
        "nice error -- the program simply crashes or reads corrupted data. "
        "Always initialize cars and remember the last valid index is `size - 1`."
      ),
      "hacker": (
        "### Allocate. Load. Access.\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5] = {10, 20, 77, 40, 50};  // full init -- zero garbage\n\n"
        '    cout << v[0] << "\\n";\n'
        '    cout << v[2] << "\\n";             // output: 77\n'
        '    cout << v[4] << "\\n";             // last valid slot\n'
        "    // v[5] -- OUT OF BOUNDS, guaranteed crash\n"
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**Breakdown:**\n"
        "- `int v[5] = {10,20,77,40,50};` -- allocate and initialize in one step\n"
        "- `v[0]` to `v[4]` -- valid range\n"
        "- `v[5]` -- access outside allocated zone: undefined behavior, likely crash\n"
        "- Without initialization (`int v[5];`) -- slots hold garbage from RAM\n\n"
        "**Competitive tip:** When declaring large arrays, initialize with `= {}` or `memset`. "
        "A Garbage Value in a 10^6 element array can cause TLE or WA "
        "with no visible error message."
      ),
      "socrates": (
        "### Discover How the Array Works\n\n"
        "Before reading the explanations, guess what the code outputs:\n\n"
        "```cpp\n"
        "#include <iostream>\n"
        "using namespace std;\n\n"
        "int main() {\n"
        "    int v[5] = {10, 20, 77, 40, 50};\n\n"
        '    cout << "Car 0: " << v[0] << "\\n";\n'
        '    cout << "Car 2: " << v[2] << "\\n";\n'
        '    cout << "Car 4: " << v[4] << "\\n";\n'
        "    return 0;\n"
        "}\n"
        "```\n\n"
        "**Let us check:**\n"
        "- Why does `v[2]` display 77 and not 20? Count from 0: v[0]=10, v[1]=20, v[2]=77.\n"
        "- What would happen if you wrote `v[5]`? There is no sixth car!\n"
        "- Why is `int v[5];` without values dangerous? Cars hold whatever was in memory before.\n\n"
        "**Insight:** In C++, a wrong index does not give a nice error -- "
        "the program continues with corrupted data or stops abruptly. "
        "Unlike Python, you get no clear message. "
        "Always initialize and check bounds before accessing."
      ),
    },
    "python": {
      "architect": (
        "### How to Build and Control the List in Python\n\n"
        "```python\n"
        "v = [0] * 5         # creates 5 clean cars, all set to 0\n"
        "v[0] = 10\n"
        "v[1] = 20\n"
        "v[2] = 77           # the third car gets 77\n"
        "v[3] = 40\n"
        "v[4] = 50           # the last valid car is v[4]\n\n"
        "print('Car 0:', v[0])\n"
        "print('Car 2:', v[2])\n"
        "print('Full train:', v)\n"
        "# v[5] = 99         # IndexError: list index out of range\n"
        "```\n\n"
        "**What each line does:**\n"
        "- `[0] * 5` -- creates a list with 5 elements, all 0; **no garbage values!**\n"
        "- `v[2] = 77` -- puts 77 in the third element (indexed from 0)\n"
        "- `print(v)` -- displays the full list: `[10, 20, 77, 40, 50]`\n"
        "- `v[5]` commented out -- Python would throw a clear `IndexError`\n\n"
        "**Key advantage:** In Python there are no Garbage Values in lists. "
        "`[0] * 5` initializes cleanly. "
        "If you go out of bounds, you get `IndexError` with a clear message -- "
        "much easier to debug than C++'s silent crash."
      ),
      "hacker": (
        "### Create. Load. Display.\n\n"
        "```python\n"
        "v = [10, 20, 77, 40, 50]   # full initialization directly\n\n"
        "print(v[0])                 # 10\n"
        "print(v[2])                 # 77\n"
        "print(v[-1])                # 50 -- Python trick: -1 = last element\n"
        "print(v)                    # [10, 20, 77, 40, 50]\n"
        "# v[5]                      # IndexError: list index out of range\n"
        "```\n\n"
        "**Breakdown:**\n"
        "- `[10,20,77,40,50]` -- list with direct values, zero garbage\n"
        "- `v[-1]` -- Python trick: negative index accesses from the tail\n"
        "- `v[5]` -- IndexError immediately, clear message, no silent crash\n"
        "- Get list size with `len(v)` -- returns 5\n\n"
        "**Python trick:** `v = [0] * n` to quickly create a list of `n` zeros. "
        "Append to the end with `v.append(val)`, remove with `v.pop()`. "
        "Python lists grow and shrink dynamically -- no fixed size like C++."
      ),
      "socrates": (
        "### Discover How the Python List Works\n\n"
        "Read and guess before reading the explanations:\n\n"
        "```python\n"
        "v = [10, 20, 77, 40, 50]\n\n"
        "print('Car 0:', v[0])\n"
        "print('Car 2:', v[2])\n"
        "print('Car 4:', v[4])\n"
        "print('Full train:', v)\n"
        "```\n\n"
        "**Let us check:**\n"
        "- Why does `v[2]` display 77? Count from 0: v[0]=10, v[1]=20, v[2]=77.\n"
        "- What happens if you write `v[5]`? Python throws `IndexError: list index out of range`.\n"
        "- Why is `[0] * 5` safer than `int v[5];` from C++? No garbage values!\n\n"
        "**Insight:** Python protects you from out-of-bounds access with a clear message. "
        "In C++ the same mistake crashes the program without explanation. "
        "This does not mean Python is 'better' -- it means it makes different choices: "
        "safety at the cost of raw speed."
      ),
    },
  },
}

theory = {}
for lang in ("ro", "en"):
    theory[lang] = {}
    for tech in ("cpp", "python"):
        theory[lang][tech] = {}
        for style in ("architect", "hacker", "socrates"):
            theory[lang][tech][style] = {
                "pages":   pages[lang][tech][style],
                "cascade": cascades[lang][tech][style],
            }

data = {
    "id": "mod04_01",
    "titleKey": "lessons.mod04_01",
    "interactiveComponent": "MissionVectorBasics",
    "theory": theory,
    "visualizer_data": [
        { "step": 1, "action": "CREATE_TRAIN", "size": 5 },
        { "step": 2, "action": "INSERT_VALUE", "index": 2, "value": 77 },
        { "step": 3, "action": "TRIGGER_CRASH", "index": 5, "reason": "OUT_OF_BOUNDS" },
    ],
    "quiz": [
        {
            "question_ro": "Daca un tren de date (vector) are 5 vagoane in total, care este numarul (indexul) ultimului vagon?",
            "question_en": "If a data train (array) has 5 cars in total, what is the index of the very last car?",
            "options_ro": ["5", "4", "1", "0"],
            "options_en": ["5", "4", "1", "0"],
            "correctAnswerIndex": 1,
            "explanation_ro": "Vagoanele se numara de la 0, nu de la 1. Primul vagon e v[0], al doilea e v[1]... al cincilea e v[4]. Daca ai 5 vagoane, ultimul are indexul 4, nu 5. Indexul 5 ar insemna un al saselea vagon care nu exista.",
            "explanation_en": "Cars are counted from 0, not from 1. The first car is v[0], the second is v[1]... the fifth is v[4]. If you have 5 cars, the last one has index 4, not 5. Index 5 would mean a sixth car that does not exist.",
        },
        {
            "question_ro": "Ce se intampla in C++ daca incerci sa accesezi v[5] intr-un vector declarat de marime 5?",
            "question_en": "What happens in C++ if you try to access v[5] in an array declared with a size of 5?",
            "options_ro": [
                "Se creeaza automat al 6-lea vagon",
                "Programul crapa sau citeste dintr-o zona de memorie interzisa (Index Out of Bounds)",
                "Valoarea se pune in primul vagon",
                "Nu se intampla nimic, codul ignora comanda",
            ],
            "options_en": [
                "A 6th car is automatically created",
                "The program crashes or reads from a forbidden memory zone (Index Out of Bounds)",
                "The value is placed in the first car",
                "Nothing happens, the code ignores the command",
            ],
            "correctAnswerIndex": 1,
            "explanation_ro": "In C++ nu exista o verificare automata a limitelor. Daca accesezi v[5] pe un vector de marime 5, computerul citeste sau scrie in zone de memorie care nu iti apartin. Asta poate crapa programul sau produce rezultate complet gresite fara niciun mesaj de eroare.",
            "explanation_en": "In C++ there is no automatic bounds checking. If you access v[5] on an array of size 5, the computer reads or writes in memory zones that do not belong to you. This can crash the program or produce completely wrong results with no error message.",
        },
        {
            "question_ro": "Prin ce se diferentiaza Python la crearea unui vector (lista) fata de C++?",
            "question_en": "How does Python differ from C++ when creating an array (list)?",
            "options_ro": [
                "In Python trebuie sa specifici tipul de date din vagoane obligatoriu",
                "In Python lista isi poate schimba marimea pe parcurs si nu risti valori gunoi la initializare",
                "In Python vagoanele se numara de la 1",
                "Python nu permite stocarea de numere in liste",
            ],
            "options_en": [
                "In Python you must strictly specify the data type inside the cars",
                "In Python the list can dynamically change size and you don't risk garbage values on initialization",
                "In Python cars are indexed starting from 1",
                "Python does not allow storing numbers in lists",
            ],
            "correctAnswerIndex": 1,
            "explanation_ro": "`[0] * 5` creeaza 5 sloturi curate, fara valori reziduale. Lista Python poate creste cu `append()` si se micsoreaza cu `pop()` -- nu are o marime fixa. In C++, `int v[5]` are marime fixa si trebuie initializata manual pentru a evita garbage values.",
            "explanation_en": "`[0] * 5` creates 5 clean slots, no residual values. A Python list can grow with `append()` and shrink with `pop()` -- it has no fixed size. In C++, `int v[5]` has a fixed size and must be manually initialized to avoid garbage values.",
        },
    ],
}

out = json.dumps(data, ensure_ascii=False, indent=2)
OUT.write_text(out, encoding="utf-8")
print(f"Written {len(out):,} bytes to {OUT}")

parsed = json.loads(out)
assert parsed["id"] == "mod04_01"
assert isinstance(parsed["quiz"], list) and len(parsed["quiz"]) == 3
assert len(parsed["visualizer_data"]) == 3
for lang in ("ro", "en"):
    for tech in ("cpp", "python"):
        for style in ("architect", "hacker", "socrates"):
            b = parsed["theory"][lang][tech][style]
            assert len(b["pages"]) == 2 and b["cascade"], f"{lang}/{tech}/{style}"
print("Valid -- 12 theory variants, 3-question flat quiz, visualizer_data included")
