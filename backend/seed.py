"""
Seed script — populates the database with the canonical 16-lesson curriculum.

Usage:
  python seed.py            — insert new lessons, skip existing slugs
  python seed.py --update   — insert new + update content of existing lessons
  python seed.py --clear    — DELETE all lessons/quiz_questions first, then insert all 16

The old lesson directories (backend/lessons/*) are left on disk but ignored.
"""
import asyncio
import json
import sys
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select, delete
from database import Base
from models.lesson import Lesson, QuizQuestion

DATABASE_URL = "sqlite+aiosqlite:///./codebite.db"

MOD01 = "MOD_01 // FOUNDATIONS"
MOD02 = "MOD_02 // CONTROL FLOW"
MOD03 = "MOD_03 // NUMBER CRUNCHING"
MOD04 = "MOD_04 // DATA STRUCTURES"
MOD05 = "MOD_05 // CORE ALGORITHMS"
MOD06 = "MOD_06 // THE GRID"

# fmt: off
LESSON_RECORDS = [
    # ── MOD_01 // FOUNDATIONS ────────────────────────────────────────────────
    {
        "slug": "the-kernel",
        "order_index": 1,
        "title_en": "The Kernel",
        "title_ro": "Nucleul (Sintaxă de bază)",
        "macro": MOD01,
        "category": "foundations",
        "difficulty": 1,
        "has_visualizer": False,
        "content_en": (
            "# The Kernel — Basic Syntax\n\n"
            "Every C++ program starts with a `main` function. "
            "The runtime calls it, executes the body, and returns an exit code.\n\n"
            "```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Hello, CodeBite!\" << endl;\n    return 0;\n}\n```\n\n"
            "**Key concepts:** `#include`, `using namespace std`, `main()`, `return 0`."
        ),
        "content_ro": (
            "# Nucleul — Sintaxă de bază\n\n"
            "Orice program C++ pornește cu funcția `main`. "
            "Runtime-ul o apelează, execută corpul și returnează un cod de ieșire.\n\n"
            "```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << \"Salut, CodeBite!\" << endl;\n    return 0;\n}\n```\n\n"
            "**Concepte cheie:** `#include`, `using namespace std`, `main()`, `return 0`."
        ),
        "quiz": [
            {
                "question_en": "Which function is the entry point of every C++ program?",
                "question_ro": "Care funcție este punctul de intrare al oricărui program C++?",
                "options": [{"en": "start()", "ro": "start()"}, {"en": "main()", "ro": "main()"}, {"en": "run()", "ro": "run()"}],
                "correct_index": 1,
                "explanation_en": "`main()` is the mandatory entry point defined by the C++ standard.",
                "explanation_ro": "`main()` este punctul de intrare obligatoriu definit de standardul C++.",
            }
        ],
    },
    {
        "slug": "memory-allocator",
        "order_index": 2,
        "title_en": "Memory Allocator",
        "title_ro": "Variabile și Tipuri",
        "macro": MOD01,
        "category": "foundations",
        "difficulty": 1,
        "has_visualizer": False,
        "content_en": (
            "# Memory Allocator — Variables & Types\n\n"
            "A variable reserves a named slot in memory. "
            "The type tells the compiler how many bytes to allocate and how to interpret the bits.\n\n"
            "```cpp\nint age = 17;        // 4 bytes, signed integer\ndouble gpa = 9.85;   // 8 bytes, floating-point\nbool pass = true;    // 1 byte, boolean\nchar grade = 'A';    // 1 byte, ASCII character\n```\n\n"
            "**Rule:** declare before use; type cannot change after declaration."
        ),
        "content_ro": (
            "# Memory Allocator — Variabile și Tipuri\n\n"
            "O variabilă rezervă un slot cu nume în memorie. "
            "Tipul îi spune compilatorului câți octeți să aloce și cum să interpreteze biții.\n\n"
            "```cpp\nint varsta = 17;     // 4 octeți, întreg cu semn\ndouble medie = 9.85; // 8 octeți, virgulă mobilă\nbool trecut = true;  // 1 octet, boolean\nchar nota = 'A';     // 1 octet, caracter ASCII\n```\n\n"
            "**Regulă:** declară înainte de utilizare; tipul nu poate fi schimbat după declarație."
        ),
        "quiz": [
            {
                "question_en": "How many bytes does an `int` typically occupy on a 32/64-bit system?",
                "question_ro": "Câți octeți ocupă de obicei un `int` pe un sistem 32/64 biți?",
                "options": [{"en": "2 bytes", "ro": "2 octeți"}, {"en": "4 bytes", "ro": "4 octeți"}, {"en": "8 bytes", "ro": "8 octeți"}],
                "correct_index": 1,
                "explanation_en": "`int` is 4 bytes (32 bits) on virtually all modern desktop platforms.",
                "explanation_ro": "`int` are 4 octeți (32 biți) pe aproape toate platformele desktop moderne.",
            }
        ],
    },
    {
        "slug": "io-streams",
        "order_index": 3,
        "title_en": "I/O Streams",
        "title_ro": "Citirea Datelor (cin)",
        "macro": MOD01,
        "category": "foundations",
        "difficulty": 1,
        "has_visualizer": False,
        "content_en": (
            "# I/O Streams — Reading Data with cin\n\n"
            "`cout` writes to the standard output stream; `cin` reads from the standard input stream.\n\n"
            "```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cout << \"Enter a number: \";\n    cin >> n;\n    cout << \"You entered: \" << n << endl;\n    return 0;\n}\n```\n\n"
            "Chain multiple reads with `cin >> a >> b`."
        ),
        "content_ro": (
            "# I/O Streams — Citirea datelor cu cin\n\n"
            "`cout` scrie în fluxul de ieșire standard; `cin` citește din fluxul de intrare standard.\n\n"
            "```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    int n;\n    cout << \"Introdu un număr: \";\n    cin >> n;\n    cout << \"Ai introdus: \" << n << endl;\n    return 0;\n}\n```\n\n"
            "Înlănțuiește citiri multiple cu `cin >> a >> b`."
        ),
        "quiz": [
            {
                "question_en": "Which operator is used with `cin` to read a value into a variable?",
                "question_ro": "Ce operator se folosește cu `cin` pentru a citi o valoare într-o variabilă?",
                "options": [{"en": "<<", "ro": "<<"}, {"en": ">>", "ro": ">>"}, {"en": "=", "ro": "="}],
                "correct_index": 1,
                "explanation_en": "`>>` is the extraction operator — it reads from the stream into the variable.",
                "explanation_ro": "`>>` este operatorul de extracție — citește din flux în variabilă.",
            }
        ],
    },
    {
        "slug": "the-alu",
        "order_index": 4,
        "title_en": "The ALU / Co-Processor",
        "title_ro": "Operatori Aritmetici",
        "macro": MOD01,
        "category": "foundations",
        "difficulty": 1,
        "has_visualizer": False,
        "content_en": (
            "# The ALU — Arithmetic Operators\n\n"
            "The Arithmetic Logic Unit handles all math. C++ exposes it through familiar operators.\n\n"
            "| Operator | Meaning | Example |\n|---|---|---|\n| `+` | Addition | `3 + 4 = 7` |\n| `-` | Subtraction | `9 - 2 = 7` |\n| `*` | Multiplication | `3 * 4 = 12` |\n| `/` | Division (integer truncates) | `7 / 2 = 3` |\n| `%` | Modulo (remainder) | `7 % 2 = 1` |\n\n"
            "**Gotcha:** `7 / 2` is `3` for integers. Use `7.0 / 2` for `3.5`."
        ),
        "content_ro": (
            "# ALU-ul — Operatori Aritmetici\n\n"
            "Unitatea Aritmetică-Logică gestionează toate calculele. C++ o expune prin operatori familiari.\n\n"
            "| Operator | Semnificație | Exemplu |\n|---|---|---|\n| `+` | Adunare | `3 + 4 = 7` |\n| `-` | Scădere | `9 - 2 = 7` |\n| `*` | Înmulțire | `3 * 4 = 12` |\n| `/` | Împărțire (trunchiere la întregi) | `7 / 2 = 3` |\n| `%` | Modulo (restul împărțirii) | `7 % 2 = 1` |\n\n"
            "**Atenție:** `7 / 2` este `3` pentru întregi. Folosește `7.0 / 2` pentru `3.5`."
        ),
        "quiz": [
            {
                "question_en": "What is the result of `17 % 5` in C++?",
                "question_ro": "Care este rezultatul lui `17 % 5` în C++?",
                "options": [{"en": "3", "ro": "3"}, {"en": "2", "ro": "2"}, {"en": "4", "ro": "4"}],
                "correct_index": 1,
                "explanation_en": "17 divided by 5 gives quotient 3 and remainder 2, so `17 % 5 = 2`.",
                "explanation_ro": "17 împărțit la 5 dă câtul 3 și restul 2, deci `17 % 5 = 2`.",
            }
        ],
    },

    # ── MOD_02 // CONTROL FLOW ───────────────────────────────────────────────
    {
        "slug": "logic-gates",
        "order_index": 5,
        "title_en": "Logic Gates",
        "title_ro": "Porți Logice (If/Else)",
        "macro": MOD02,
        "category": "control-flow",
        "difficulty": 1,
        "has_visualizer": False,
        "content_en": (
            "# Logic Gates — If / Else\n\n"
            "Conditional branching is the fundamental decision mechanism in every program.\n\n"
            "```cpp\nint score = 72;\nif (score >= 90) {\n    cout << \"Grade: A\";\n} else if (score >= 70) {\n    cout << \"Grade: B\";\n} else {\n    cout << \"Grade: C or below\";\n}\n```\n\n"
            "Comparison operators: `==`, `!=`, `<`, `>`, `<=`, `>=`."
        ),
        "content_ro": (
            "# Porți Logice — If / Else\n\n"
            "Ramificarea condiționată este mecanismul fundamental de decizie din orice program.\n\n"
            "```cpp\nint scor = 72;\nif (scor >= 90) {\n    cout << \"Nota: 10\";\n} else if (scor >= 70) {\n    cout << \"Nota: 8-9\";\n} else {\n    cout << \"Nota: sub 7\";\n}\n```\n\n"
            "Operatori de comparație: `==`, `!=`, `<`, `>`, `<=`, `>=`."
        ),
        "quiz": [
            {
                "question_en": "Which operator checks for equality in C++?",
                "question_ro": "Ce operator verifică egalitatea în C++?",
                "options": [{"en": "=", "ro": "="}, {"en": "==", "ro": "=="}, {"en": "!=", "ro": "!="}],
                "correct_index": 1,
                "explanation_en": "`==` is the equality comparison operator. `=` is assignment.",
                "explanation_ro": "`==` este operatorul de comparație a egalității. `=` este atribuire.",
            }
        ],
    },
    {
        "slug": "the-engine",
        "order_index": 6,
        "title_en": "The Engine",
        "title_ro": "Bucla While",
        "macro": MOD02,
        "category": "control-flow",
        "difficulty": 1,
        "has_visualizer": True,
        "content_en": (
            "# The Engine — While Loop\n\n"
            "A `while` loop repeats its body as long as the condition is true. "
            "Use it when you don't know the iteration count upfront.\n\n"
            "```cpp\nint n = 1;\nwhile (n <= 5) {\n    cout << n << \" \";\n    n++;\n}\n// Output: 1 2 3 4 5\n```\n\n"
            "**Pitfall:** forgetting to update the loop variable causes an infinite loop."
        ),
        "content_ro": (
            "# The Engine — Bucla While\n\n"
            "O buclă `while` repetă corpul cât timp condiția este adevărată. "
            "Folosește-o când nu știi numărul de iterații din start.\n\n"
            "```cpp\nint n = 1;\nwhile (n <= 5) {\n    cout << n << \" \";\n    n++;\n}\n// Output: 1 2 3 4 5\n```\n\n"
            "**Atenție:** uitarea actualizării variabilei de buclă cauzează o buclă infinită."
        ),
        "quiz": [
            {
                "question_en": "When does a while loop stop executing?",
                "question_ro": "Când se oprește o buclă while?",
                "options": [
                    {"en": "After a fixed number of iterations", "ro": "După un număr fix de iterații"},
                    {"en": "When its condition becomes false", "ro": "Când condiția sa devine falsă"},
                    {"en": "When return is called", "ro": "Când se apelează return"},
                ],
                "correct_index": 1,
                "explanation_en": "A while loop evaluates its condition before each iteration and stops when it evaluates to false.",
                "explanation_ro": "O buclă while evaluează condiția înainte de fiecare iterație și se oprește când aceasta devine falsă.",
            }
        ],
    },
    {
        "slug": "the-factory",
        "order_index": 7,
        "title_en": "The Factory",
        "title_ro": "Bucla For",
        "macro": MOD02,
        "category": "control-flow",
        "difficulty": 1,
        "has_visualizer": True,
        "content_en": (
            "# The Factory — For Loop\n\n"
            "A `for` loop bundles init, condition, and update into one line — ideal for counted loops.\n\n"
            "```cpp\nfor (int i = 0; i < 5; i++) {\n    cout << i * i << \" \";\n}\n// Output: 0 1 4 9 16\n```\n\n"
            "Anatomy: `for (initializer; condition; update) { body }`"
        ),
        "content_ro": (
            "# The Factory — Bucla For\n\n"
            "O buclă `for` îmbină inițializarea, condiția și actualizarea într-o singură linie — ideală pentru bucle cu număr fix.\n\n"
            "```cpp\nfor (int i = 0; i < 5; i++) {\n    cout << i * i << \" \";\n}\n// Output: 0 1 4 9 16\n```\n\n"
            "Anatomie: `for (inițializare; condiție; actualizare) { corp }`"
        ),
        "quiz": [
            {
                "question_en": "In `for (int i = 0; i < 5; i++)`, how many times does the body execute?",
                "question_ro": "În `for (int i = 0; i < 5; i++)`, de câte ori se execută corpul?",
                "options": [{"en": "4 times", "ro": "de 4 ori"}, {"en": "5 times", "ro": "de 5 ori"}, {"en": "6 times", "ro": "de 6 ori"}],
                "correct_index": 1,
                "explanation_en": "i takes values 0,1,2,3,4 — that is 5 iterations.",
                "explanation_ro": "i ia valorile 0,1,2,3,4 — adică 5 iterații.",
            }
        ],
    },

    # ── MOD_03 // NUMBER CRUNCHING ───────────────────────────────────────────
    {
        "slug": "digit-extraction",
        "order_index": 8,
        "title_en": "Digit Extraction",
        "title_ro": "Cifrele unui Număr",
        "macro": MOD03,
        "category": "number-crunching",
        "difficulty": 2,
        "has_visualizer": False,
        "content_en": (
            "# Digit Extraction\n\n"
            "Extract individual digits from an integer using division and modulo.\n\n"
            "```cpp\nint n = 1234;\nwhile (n > 0) {\n    int digit = n % 10;  // last digit\n    cout << digit << \" \";\n    n /= 10;             // drop last digit\n}\n// Output: 4 3 2 1\n```\n\n"
            "This pattern is the backbone of most number-manipulation problems."
        ),
        "content_ro": (
            "# Extragerea Cifrelor\n\n"
            "Extrage cifrele individuale dintr-un întreg folosind împărțirea și modulo.\n\n"
            "```cpp\nint n = 1234;\nwhile (n > 0) {\n    int cifra = n % 10;  // ultima cifră\n    cout << cifra << \" \";\n    n /= 10;             // elimină ultima cifră\n}\n// Output: 4 3 2 1\n```\n\n"
            "Acest tipar este baza majorității problemelor de manipulare a numerelor."
        ),
        "quiz": [
            {
                "question_en": "What does `n % 10` return for `n = 347`?",
                "question_ro": "Ce returnează `n % 10` pentru `n = 347`?",
                "options": [{"en": "3", "ro": "3"}, {"en": "4", "ro": "4"}, {"en": "7", "ro": "7"}],
                "correct_index": 2,
                "explanation_en": "`347 % 10 = 7` — modulo 10 always yields the last digit.",
                "explanation_ro": "`347 % 10 = 7` — modulo 10 returnează întotdeauna ultima cifră.",
            }
        ],
    },
    {
        "slug": "prime-directives",
        "order_index": 9,
        "title_en": "Prime Directives",
        "title_ro": "Divizibilitate și Prime",
        "macro": MOD03,
        "category": "number-crunching",
        "difficulty": 2,
        "has_visualizer": False,
        "content_en": (
            "# Prime Directives — Divisibility & Primes\n\n"
            "A prime number has exactly two divisors: 1 and itself.\n\n"
            "```cpp\nbool isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n```\n\n"
            "**Optimization:** only check divisors up to √n — if none found, n is prime."
        ),
        "content_ro": (
            "# Prime Directives — Divizibilitate și Prime\n\n"
            "Un număr prim are exact doi divizori: 1 și el însuși.\n\n"
            "```cpp\nbool estePrim(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i * i <= n; i++) {\n        if (n % i == 0) return false;\n    }\n    return true;\n}\n```\n\n"
            "**Optimizare:** verifică divizori doar până la √n — dacă niciunul nu îl divide, n este prim."
        ),
        "quiz": [
            {
                "question_en": "Why do we only check divisors up to √n when testing primality?",
                "question_ro": "De ce verificăm divizori doar până la √n când testăm primalitatea?",
                "options": [
                    {"en": "Because primes are always odd", "ro": "Deoarece primele sunt întotdeauna impare"},
                    {"en": "If n has a divisor > √n, it must also have one ≤ √n", "ro": "Dacă n are un divizor > √n, trebuie să aibă și unul ≤ √n"},
                    {"en": "To avoid integer overflow", "ro": "Pentru a evita overflow-ul de întregi"},
                ],
                "correct_index": 1,
                "explanation_en": "Divisors come in pairs (d, n/d). If d > √n then n/d < √n, so we've already checked it.",
                "explanation_ro": "Divizorii vin în perechi (d, n/d). Dacă d > √n atunci n/d < √n, deci l-am verificat deja.",
            }
        ],
    },
    {
        "slug": "euclidean-protocol",
        "order_index": 10,
        "title_en": "Euclidean Protocol",
        "title_ro": "Algoritmul lui Euclid",
        "macro": MOD03,
        "category": "number-crunching",
        "difficulty": 2,
        "has_visualizer": True,
        "content_en": (
            "# Euclidean Protocol — GCD\n\n"
            "The Euclidean algorithm finds the Greatest Common Divisor (GCD) in O(log n) time.\n\n"
            "```cpp\nint gcd(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}\n```\n\n"
            "LCM follows: `lcm(a, b) = a / gcd(a, b) * b`."
        ),
        "content_ro": (
            "# Protocolul lui Euclid — CMDC\n\n"
            "Algoritmul lui Euclid găsește Cel Mai Mare Divizor Comun (CMDC) în timp O(log n).\n\n"
            "```cpp\nint cmdc(int a, int b) {\n    while (b != 0) {\n        int r = a % b;\n        a = b;\n        b = r;\n    }\n    return a;\n}\n```\n\n"
            "CMMMC: `cmmmc(a, b) = a / cmdc(a, b) * b`."
        ),
        "quiz": [
            {
                "question_en": "What is gcd(48, 18)?",
                "question_ro": "Care este cmdc(48, 18)?",
                "options": [{"en": "6", "ro": "6"}, {"en": "9", "ro": "9"}, {"en": "3", "ro": "3"}],
                "correct_index": 0,
                "explanation_en": "48 = 2⁴·3, 18 = 2·3². GCD = 2·3 = 6.",
                "explanation_ro": "48 = 2⁴·3, 18 = 2·3². CMDC = 2·3 = 6.",
            }
        ],
    },

    # ── MOD_04 // DATA STRUCTURES ────────────────────────────────────────────
    {
        "slug": "array-slots",
        "order_index": 11,
        "title_en": "Array Slots",
        "title_ro": "Vectori (1D)",
        "macro": MOD04,
        "category": "data-structures",
        "difficulty": 2,
        "has_visualizer": True,
        "content_en": (
            "# Array Slots — 1D Arrays\n\n"
            "An array is a contiguous block of memory holding elements of the same type.\n\n"
            "```cpp\nint arr[5] = {10, 20, 30, 40, 50};\ncout << arr[0];  // 10\ncout << arr[4];  // 50\narr[2] = 99;     // modify\n```\n\n"
            "**Indexing:** zero-based. `arr[n]` is undefined behaviour — always stay within bounds."
        ),
        "content_ro": (
            "# Array Slots — Vectori 1D\n\n"
            "Un vector este un bloc contiguu de memorie care conține elemente de același tip.\n\n"
            "```cpp\nint arr[5] = {10, 20, 30, 40, 50};\ncout << arr[0];  // 10\ncout << arr[4];  // 50\narr[2] = 99;     // modificare\n```\n\n"
            "**Indexare:** bazată pe zero. `arr[n]` este comportament nedefinit — rămâi mereu în limite."
        ),
        "quiz": [
            {
                "question_en": "For `int arr[6]`, what is the valid index range?",
                "question_ro": "Pentru `int arr[6]`, care este intervalul valid de indici?",
                "options": [{"en": "1 to 6", "ro": "1 la 6"}, {"en": "0 to 5", "ro": "0 la 5"}, {"en": "0 to 6", "ro": "0 la 6"}],
                "correct_index": 1,
                "explanation_en": "Arrays in C++ are zero-indexed. `arr[6]` would be out of bounds.",
                "explanation_ro": "Vectorii în C++ sunt indexați de la zero. `arr[6]` ar fi în afara limitelor.",
            }
        ],
    },
    {
        "slug": "the-scanner",
        "order_index": 12,
        "title_en": "The Scanner",
        "title_ro": "Parcurgerea Vectorilor",
        "macro": MOD04,
        "category": "data-structures",
        "difficulty": 2,
        "has_visualizer": False,
        "content_en": (
            "# The Scanner — Array Traversal\n\n"
            "Traversal means visiting every element exactly once — the foundation of search, sum, and sort.\n\n"
            "```cpp\nint arr[] = {3, 7, 1, 9, 4};\nint n = 5, sum = 0, maxVal = arr[0];\n\nfor (int i = 0; i < n; i++) {\n    sum += arr[i];\n    if (arr[i] > maxVal) maxVal = arr[i];\n}\ncout << \"Sum: \" << sum << \", Max: \" << maxVal;\n```"
        ),
        "content_ro": (
            "# The Scanner — Parcurgerea Vectorilor\n\n"
            "Parcurgerea înseamnă vizitarea fiecărui element exact o dată — baza căutării, sumei și sortării.\n\n"
            "```cpp\nint arr[] = {3, 7, 1, 9, 4};\nint n = 5, suma = 0, maxVal = arr[0];\n\nfor (int i = 0; i < n; i++) {\n    suma += arr[i];\n    if (arr[i] > maxVal) maxVal = arr[i];\n}\ncout << \"Suma: \" << suma << \", Max: \" << maxVal;\n```"
        ),
        "quiz": [
            {
                "question_en": "What does traversing an array mean?",
                "question_ro": "Ce înseamnă parcurgerea unui vector?",
                "options": [
                    {"en": "Sorting its elements", "ro": "Sortarea elementelor sale"},
                    {"en": "Visiting every element exactly once", "ro": "Vizitarea fiecărui element exact o dată"},
                    {"en": "Copying it to another array", "ro": "Copierea sa în alt vector"},
                ],
                "correct_index": 1,
                "explanation_en": "Traversal is a sequential visit of all elements — it underlies most array algorithms.",
                "explanation_ro": "Parcurgerea este o vizitare secvențială a tuturor elementelor — stă la baza majorității algoritmilor pe vectori.",
            }
        ],
    },

    # ── MOD_05 // CORE ALGORITHMS ────────────────────────────────────────────
    {
        "slug": "linear-search",
        "order_index": 13,
        "title_en": "Linear Search",
        "title_ro": "Căutare Liniară",
        "macro": MOD05,
        "category": "core-algorithms",
        "difficulty": 2,
        "has_visualizer": True,
        "content_en": (
            "# Linear Search\n\n"
            "Inspect each element one by one until the target is found or the array is exhausted.\n\n"
            "```cpp\nint linearSearch(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i;\n    }\n    return -1;  // not found\n}\n```\n\n"
            "**Complexity:** O(n) time, O(1) space. Works on unsorted arrays."
        ),
        "content_ro": (
            "# Căutare Liniară\n\n"
            "Inspectează fiecare element pe rând până când ținta este găsită sau vectorul este epuizat.\n\n"
            "```cpp\nint cautareLineara(int arr[], int n, int tinta) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == tinta) return i;\n    }\n    return -1;  // negăsit\n}\n```\n\n"
            "**Complexitate:** O(n) timp, O(1) spațiu. Funcționează pe vectori nesortat."
        ),
        "quiz": [
            {
                "question_en": "What is the time complexity of linear search in the worst case?",
                "question_ro": "Care este complexitatea în timp a căutării liniare în cazul cel mai defavorabil?",
                "options": [{"en": "O(1)", "ro": "O(1)"}, {"en": "O(log n)", "ro": "O(log n)"}, {"en": "O(n)", "ro": "O(n)"}],
                "correct_index": 2,
                "explanation_en": "In the worst case the target is at the end or missing, so all n elements are checked.",
                "explanation_ro": "În cel mai rău caz, ținta este la final sau lipsește, deci se verifică toate n elemente.",
            }
        ],
    },
    {
        "slug": "bubble-sort",
        "order_index": 14,
        "title_en": "Bubble Sort",
        "title_ro": "Sortarea Bubble",
        "macro": MOD05,
        "category": "core-algorithms",
        "difficulty": 2,
        "has_visualizer": True,
        "content_en": (
            "# Bubble Sort\n\n"
            "Repeatedly swap adjacent elements that are out of order. Larger elements \"bubble\" to the end.\n\n"
            "```cpp\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1])\n                swap(arr[j], arr[j + 1]);\n        }\n    }\n}\n```\n\n"
            "**Complexity:** O(n²) time. Simple but slow — use it to understand sorting, not in production."
        ),
        "content_ro": (
            "# Sortarea Bubble\n\n"
            "Schimbă repetat elementele adiacente care sunt în ordine greșită. Elementele mai mari \"plutesc\" spre final.\n\n"
            "```cpp\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n - 1 - i; j++) {\n            if (arr[j] > arr[j + 1])\n                swap(arr[j], arr[j + 1]);\n        }\n    }\n}\n```\n\n"
            "**Complexitate:** O(n²) timp. Simplu dar lent — folosiți-l pentru a înțelege sortarea, nu în producție."
        ),
        "quiz": [
            {
                "question_en": "After the first full pass of bubble sort on [5,3,8,1], which element is in its final position?",
                "question_ro": "După prima trecere completă a bubble sort pe [5,3,8,1], care element este pe poziția finală?",
                "options": [{"en": "5", "ro": "5"}, {"en": "1", "ro": "1"}, {"en": "8", "ro": "8"}],
                "correct_index": 2,
                "explanation_en": "The first pass bubbles the largest element (8) to the last position.",
                "explanation_ro": "Prima trecere ridică cel mai mare element (8) pe ultima poziție.",
            }
        ],
    },

    # ── MOD_06 // THE GRID ───────────────────────────────────────────────────
    {
        "slug": "2d-matrices",
        "order_index": 15,
        "title_en": "2D Matrices",
        "title_ro": "Matrice (2D)",
        "macro": MOD06,
        "category": "the-grid",
        "difficulty": 3,
        "has_visualizer": False,
        "content_en": (
            "# 2D Matrices\n\n"
            "A 2D array is a grid of rows and columns. Declared as `type name[rows][cols]`.\n\n"
            "```cpp\nint mat[3][3] = {{1,2,3},{4,5,6},{7,8,9}};\n\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        cout << mat[i][j] << \" \";\n    }\n    cout << endl;\n}\n```\n\n"
            "Memory layout: row-major — `mat[i][j]` is at offset `i*cols + j`."
        ),
        "content_ro": (
            "# Matrice (2D)\n\n"
            "Un tablou 2D este o grilă de linii și coloane. Declarat ca `tip nume[linii][coloane]`.\n\n"
            "```cpp\nint mat[3][3] = {{1,2,3},{4,5,6},{7,8,9}};\n\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 3; j++) {\n        cout << mat[i][j] << \" \";\n    }\n    cout << endl;\n}\n```\n\n"
            "Stocare în memorie: row-major — `mat[i][j]` se află la offset `i*coloane + j`."
        ),
        "quiz": [
            {
                "question_en": "For a 4×5 matrix, what is the offset of element mat[2][3] in row-major order?",
                "question_ro": "Pentru o matrice 4×5, care este offset-ul elementului mat[2][3] în ordine row-major?",
                "options": [{"en": "11", "ro": "11"}, {"en": "13", "ro": "13"}, {"en": "23", "ro": "23"}],
                "correct_index": 1,
                "explanation_en": "offset = 2*5 + 3 = 13.",
                "explanation_ro": "offset = 2*5 + 3 = 13.",
            }
        ],
    },
    {
        "slug": "the-diagonals",
        "order_index": 16,
        "title_en": "The Diagonals",
        "title_ro": "Diagonalele",
        "macro": MOD06,
        "category": "the-grid",
        "difficulty": 3,
        "has_visualizer": False,
        "content_en": (
            "# The Diagonals\n\n"
            "The main diagonal runs top-left to bottom-right; the secondary runs top-right to bottom-left.\n\n"
            "```cpp\nint n = 4;\nfor (int i = 0; i < n; i++) {\n    cout << \"main[\" << i << \"][\" << i << \"] = \" << mat[i][i] << endl;\n    cout << \"sec[\"  << i << \"][\" << n-1-i << \"] = \" << mat[i][n-1-i] << endl;\n}\n```\n\n"
            "**Pattern:** main diagonal `i == j`; secondary diagonal `i + j == n - 1`."
        ),
        "content_ro": (
            "# Diagonalele\n\n"
            "Diagonala principală merge din stânga-sus în dreapta-jos; cea secundară din dreapta-sus în stânga-jos.\n\n"
            "```cpp\nint n = 4;\nfor (int i = 0; i < n; i++) {\n    cout << \"princ[\" << i << \"][\" << i << \"] = \" << mat[i][i] << endl;\n    cout << \"sec[\"   << i << \"][\" << n-1-i << \"] = \" << mat[i][n-1-i] << endl;\n}\n```\n\n"
            "**Tipar:** diagonala principală `i == j`; diagonala secundară `i + j == n - 1`."
        ),
        "quiz": [
            {
                "question_en": "For an n×n matrix, which condition identifies the secondary diagonal?",
                "question_ro": "Pentru o matrice n×n, ce condiție identifică diagonala secundară?",
                "options": [
                    {"en": "i == j", "ro": "i == j"},
                    {"en": "i + j == n - 1", "ro": "i + j == n - 1"},
                    {"en": "i * j == n", "ro": "i * j == n"},
                ],
                "correct_index": 1,
                "explanation_en": "Secondary diagonal elements satisfy `i + j = n - 1`.",
                "explanation_ro": "Elementele diagonalei secundare satisfac `i + j = n - 1`.",
            }
        ],
    },
]
# fmt: on


async def seed(update: bool = False, clear: bool = False):
    engine = create_async_engine(DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    Session = async_sessionmaker(engine, expire_on_commit=False)
    async with Session() as session:
        if clear:
            await session.execute(delete(QuizQuestion))
            await session.execute(delete(Lesson))
            await session.commit()
            print("Cleared all lessons and quiz questions.")

        for record in LESSON_RECORDS:
            result = await session.execute(
                select(Lesson).where(Lesson.slug == record["slug"])
            )
            existing = result.scalar_one_or_none()

            if existing:
                if not update:
                    print(f"  Skipping {record['slug']} (already exists — use --update to refresh)")
                    continue
                existing.title_en = record["title_en"]
                existing.title_ro = record["title_ro"]
                existing.macro = record["macro"]
                existing.category = record["category"]
                existing.difficulty = record["difficulty"]
                existing.has_visualizer = record["has_visualizer"]
                existing.content_en = record["content_en"]
                existing.content_ro = record["content_ro"]
                old_qs = await session.execute(
                    select(QuizQuestion).where(QuizQuestion.lesson_id == existing.id)
                )
                for q in old_qs.scalars().all():
                    await session.delete(q)
                lesson_id = existing.id
                print(f"  Updated: {record['title_en']}")
            else:
                lesson = Lesson(
                    slug=record["slug"],
                    order_index=record["order_index"],
                    title_en=record["title_en"],
                    title_ro=record["title_ro"],
                    macro=record["macro"],
                    category=record["category"],
                    difficulty=record["difficulty"],
                    has_visualizer=record["has_visualizer"],
                    content_en=record["content_en"],
                    content_ro=record["content_ro"],
                )
                session.add(lesson)
                await session.flush()
                lesson_id = lesson.id
                print(f"  Seeded: {record['title_en']}")

            for q_data in record["quiz"]:
                question = QuizQuestion(
                    lesson_id=lesson_id,
                    question_en=q_data["question_en"],
                    question_ro=q_data["question_ro"],
                    options_json=json.dumps(q_data["options"]),
                    correct_index=q_data["correct_index"],
                    explanation_en=q_data["explanation_en"],
                    explanation_ro=q_data["explanation_ro"],
                )
                session.add(question)

        await session.commit()

    await engine.dispose()
    print("Done. Database seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed(update="--update" in sys.argv, clear="--clear" in sys.argv))
