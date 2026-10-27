/* ============================================================
   LEARNPATH AI — Comprehensive Python Topic Notes & Study Guides
   Masterclass In-Depth Python Knowledge Base with Memory Models,
   CPython Architecture, Dry-Run Tables, and Annotated Implementations
   ============================================================ */

export const PYTHON_TOPIC_NOTES = {
  'py-basics': {
    id: 'py-basics',
    title: 'Python Basics & CPython Architecture',
    subtitle: 'Comprehensive deep dive into dynamic typing, everything-is-an-object paradigm, CPython PyObject memory model, reference counting, and integer caching.',
    category: 'Python Foundations',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '11 min read',
    overview: 'In Python, variables do not store values directly; they are named references (pointers) bound to objects residing on the private heap. Everything in Python—including primitive integers, floats, booleans, and functions—is a first-class object encapsulated within a CPython PyObject header containing an object type pointer and reference counter.',
    
    memoryModel: {
      title: 'CPython PyObject Reference Model & Small Integer Cache',
      diagram: `
+-------------------------------------------------------------------------------+
|                       CPYTHON PYOBJECT HEAP MEMORY MODEL                      |
+-------------------------------------------------------------------------------+
| Variable Reference: 'x = 256', 'y = 256', 'z = 257'                          |
| CPython optimizes integers between [-5, 256] via a static pre-allocated array|
+-------------------------------------------------------------------------------+

   Stack Names (Pointers)                 Heap Objects (PyObject)
   +-------------+                     +---------------------------------------+
   |   Name: x   | ------------------> | PyLongObject (Pre-allocated Cache)   |
   | Address: &x |                     | ob_refcnt: 3  | ob_type: &PyLong_Type |
   +-------------+                     | ob_ival: 256  (Address: 0x55AA10)     |
                                       +---------------------------------------+
   +-------------+                                    ^
   |   Name: y   | -----------------------------------+ (x is y -> True)
   | Address: &y |
   +-------------+
   
   +-------------+                     +---------------------------------------+
   |   Name: z1  | ------------------> | PyLongObject (Newly Allocated)        |
   |   (z1=257)  |                     | ob_refcnt: 1  | ob_type: &PyLong_Type |
   +-------------+                     | ob_ival: 257  (Address: 0x77BB20)     |
                                       +---------------------------------------+
   +-------------+                     +---------------------------------------+
   |   Name: z2  | ------------------> | PyLongObject (Distinct New Object)    |
   |   (z2=257)  |                     | ob_refcnt: 1  | ob_type: &PyLong_Type |
   +-------------+                     | ob_ival: 257  (Address: 0x77BB40)     |
                                       +---------------------------------------+
                                       (z1 is z2 -> False, z1 == z2 -> True)
`,
      explanation: 'CPython pre-allocates small integers from -5 to 256 at interpreter startup. When you assign any variable in that range, it points to the identical cached PyObject in memory (verified by the `is` identity operator). Numbers outside this range or created at runtime instantiate separate heap allocations.'
    },

    subtypes: [
      {
        typeName: 'Identity vs Equality (`is` vs `==`) & Type Casting',
        recognition: 'Distinguishing whether two variables refer to the exact same memory address (`id(a) == id(b)`) versus comparing equivalent values.',
        mechanism: 'The `==` operator invokes the object\'s `__eq__()` dunder method to perform a value comparison. The `is` operator strictly compares pointer addresses in C (`a == b` in C code), executing in instantaneous O(1) time without method dispatch.',
        asciiVisual: `
a = [1, 2] --------> Heap Obj @ 0x1000: [1, 2]
b = [1, 2] --------> Heap Obj @ 0x2000: [1, 2]
a == b  --> True  (Both hold equivalent elements: 1 == 1 and 2 == 2)
a is b  --> False (0x1000 != 0x2000; distinct memory allocations)
c = a   --------> Points to 0x1000
a is c  --> True  (Identical pointer address)
`,
        javaCode: `# Demonstrating Identity (is) vs Equality (==) and Type Conversion
def analyze_references():
    # 1. Cached small integers
    val1 = 100
    val2 = 100
    print(f"val1 is val2: {val1 is val2}")  # True (Cached PyLongObject)
    
    # 2. Distinct mutable objects
    list1 = [1, 2, 3]
    list2 = [1, 2, 3]
    print(f"list1 == list2: {list1 == list2}")  # True (Value check)
    print(f"list1 is list2: {list1 is list2}")  # False (Different Heap addresses)
    
    # 3. Explicit type casting with defensive fallback
    raw_input_str = "42"
    parsed_val = int(raw_input_str)
    print(f"Parsed {type(parsed_val)}: {parsed_val * 2}") # 84

if __name__ == "__main__":
    analyze_references()`,
        dryRunTrace: {
          input: 'val1 = 100, val2 = 100, list1 = [1, 2], list2 = [1, 2]',
          headers: ['Expression', 'Operator Type', 'Evaluated Criterion', 'Result'],
          rows: [
            ['val1 == val2', 'Equality', '100 == 100', 'True'],
            ['val1 is val2', 'Identity', 'id(val1) == id(val2)', 'True (Small int cache)'],
            ['list1 == list2', 'Equality', 'elements match sequentially', 'True'],
            ['list1 is list2', 'Identity', '0xHeap1 == 0xHeap2', 'False (Distinct lists)']
          ],
          result: 'Exact understanding of CPython pointer binding and value equality.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to check if a variable is None', bestApproach: 'Always use `if x is None:` (singleton identity check) instead of `if x == None:`' },
      { trigger: 'Multiple assignments needed in one line', bestApproach: 'Tuple unpacking: `a, b = b, a` evaluates RHS into temporary tuple before binding LHS' },
      { trigger: 'Integer division without floating point inaccuracies', bestApproach: 'Use floor division `//` (truncates toward negative infinity)' }
    ],

    pitfalls: [
      'Using `is` for value equality: `x is 1000` may be True in the same compilation unit / REPL line but False across independent scopes.',
      'Floor Division Negative Rounding: In Python `-7 // 2` is `-4`, NOT `-3` (Python rounds down towards negative infinity, unlike Java/C++ which truncate towards zero).',
      'Chained comparisons syntax: `1 < x < 5` is evaluated as `(1 < x) and (x < 5)` with single evaluation of `x`.'
    ],

    complexity: [
      { operation: 'Variable Binding / Re-binding', time: 'O(1)', space: 'O(1)' },
      { operation: 'Identity Comparison (`is`)', time: 'O(1)', space: 'O(1)' },
      { operation: 'Integer Parsing `int(s)` (d digits)', time: 'O(d)', space: 'O(d)' }
    ]
  },

  'py-lists-tuples': {
    id: 'py-lists-tuples',
    title: 'Lists & Tuples: Dynamic Arrays vs Immutability',
    subtitle: 'Deep architectural analysis of CPython PyListObject over-allocation strategy, amortized O(1) appending, pointer arrays, and tuple packing.',
    category: 'Data Structures',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '12 min read',
    overview: 'A Python `list` is a dynamic array of pointers (`PyObject** ob_item`) rather than contiguous values. A `tuple` is an immutable sequence with fixed memory allocation and zero resizing overhead. To achieve O(1) amortized appends, Python lists use an over-allocation growth pattern: (allocated_size = newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6)).',

    memoryModel: {
      title: 'PyListObject Pointer Array & Over-Allocation Layout',
      diagram: `
+-------------------------------------------------------------------------------+
|                       PYLISTOBJECT MEMORY LAYOUT IN RAM                       |
+-------------------------------------------------------------------------------+
| PyListObject Header (ob_refcnt, ob_type, ob_size=3, allocated=6)              |
| ob_item pointer points to a contiguous array of 8-byte pointer addresses:     |
+-------------------------------------------------------------------------------+

   PyListObject Header:
   [ ob_size: 3 | allocated: 6 | ob_item: 0x9000 ]
                                      |
                                      v
   Contiguous Pointer Array (0x9000):
   +----------+----------+----------+----------+----------+----------+
   | [0] Ptr  | [1] Ptr  | [2] Ptr  | [3] NULL | [4] NULL | [5] NULL |
   +----------+----------+----------+----------+----------+----------+
        |          |          |        \________________________/
        |          |          |          Over-allocated free slots
        v          v          v          (Immediate O(1) appends)
     PyObject   PyObject   PyObject
     "apple"       42       [3.14]
   (0xHeapA)   (0xHeapB)   (0xHeapC)
`,
      explanation: 'Notice that items in a Python list can be of mixed types because the list itself only stores memory addresses (pointers). When resizing occurs, CPython allocates extra capacity so consecutive `append()` operations run in pure O(1) amortized time.'
    },

    subtypes: [
      {
        typeName: 'Slicing & Shallow vs Deep Copying',
        recognition: 'Modifying nested sublists unexpectedly alters the original collection or vice-versa.',
        mechanism: 'Standard slicing `lst[:]` or `list(lst)` or `copy.copy()` creates a new PyListObject, but its internal slots point to the SAME child objects in heap. To duplicate nested structures recursively, `copy.deepcopy()` is required.',
        asciiVisual: `
Original: [ Ptr1 ] ------> [ "Inner", "Data" ]
               ^
               | (Shallow copy references the SAME nested sublist)
Copy:     [ Ptr1 ]
`,
        javaCode: `# Demonstrating Python List Over-Allocation & Deep Copy Invariants
import copy

def demonstrate_sequences():
    # 1. Negative indexing & Slicing: list[start:stop:step]
    nums = [10, 20, 30, 40, 50, 60]
    reversed_nums = nums[::-1]        # [60, 50, 40, 30, 20, 10]
    even_indices = nums[::2]          # [10, 30, 50]
    
    # 2. Shallow vs Deep Copy Pitfall
    nested = [[1, 2], [3, 4]]
    shallow = nested.copy()
    deep = copy.deepcopy(nested)
    
    # Mutate nested sub-array
    nested[0][0] = 999
    print("Original:", nested)        # [[999, 2], [3, 4]]
    print("Shallow:", shallow)        # [[999, 2], [3, 4]] -> MUTATED!
    print("Deep:", deep)              # [[1, 2], [3, 4]]   -> PROTECTED!
    
    # 3. Tuple packing & unpacking
    coords = (12.5, 77.2, 900)        # Tuple packing
    lat, lon, alt = coords            # Unpacking
    return reversed_nums, deep

if __name__ == "__main__":
    demonstrate_sequences()`,
        dryRunTrace: {
          input: 'nums = [10, 20, 30, 40, 50, 60], slice: nums[1:5:2]',
          headers: ['Step', 'Index Evaluated', 'Element Taken', 'Collected Slice'],
          rows: [
            ['1 (start)', 'index = 1', '20', '[20]'],
            ['2 (step +2)', 'index = 3', '40', '[20, 40]'],
            ['3 (step +2)', 'index = 5 >= stop(5)', 'Stop boundary met', '[20, 40]']
          ],
          result: 'Slicing produces [20, 40] in O(k) time where k is slice length.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to reverse a list in-place with O(1) auxiliary memory', bestApproach: '`lst.reverse()` (modifies in-place) or two-pointer swap; avoid `lst[::-1]` when memory is constrained' },
      { trigger: 'Need fast insert/pop at BOTH ends of a sequence', bestApproach: 'Use `collections.deque` (O(1) double-ended queue) instead of list `insert(0, val)` which is O(N)' },
      { trigger: 'Data must be used as a dictionary key or set member', bestApproach: 'Use an immutable `tuple` instead of a mutable `list` (tuples are hashable if their elements are hashable)' }
    ],

    pitfalls: [
      'Default mutable arguments in functions: `def add(item, lst=[])` shares the single list instance across all invocations!',
      'Using `*` operator for list initialization of sublists: `[[0] * 3] * 3` creates 3 references to the EXACT SAME sublist. Modifying row 0 modifies all rows.',
      '`list.sort()` vs `sorted()`: `lst.sort()` modifies in-place and returns `None`. Writing `x = lst.sort()` sets `x = None`.'
    ],

    complexity: [
      { operation: 'Index lookup `lst[i]`', time: 'O(1)', space: 'O(1)' },
      { operation: 'Append `lst.append(x)`', time: 'Amortized O(1)', space: 'O(1)' },
      { operation: 'Insert at index 0 `lst.insert(0, x)`', time: 'O(N) [Element shift]', space: 'O(1)' },
      { operation: 'Pop from end `lst.pop()`', time: 'O(1)', space: 'O(1)' },
      { operation: 'Pop from index 0 `lst.pop(0)`', time: 'O(N)', space: 'O(1)' },
      { operation: 'Slicing `lst[a:b]`', time: 'O(b - a)', space: 'O(b - a)' }
    ]
  },

  'py-strings': {
    id: 'py-strings',
    title: 'Strings in Python: Unicode & Memory Representation',
    subtitle: 'PEP 393 Flexible String Representation, immutability guarantees, interning, fast string building via `join()`, and modern f-string interpolation.',
    category: 'Data Structures',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '10 min read',
    overview: 'In Python 3, all strings (`str`) are immutable sequences of Unicode characters. Under PEP 393, CPython optimizes memory usage dynamically: Latin-1 strings (ASCII) use 1 byte per character (`PyASCIIObject`), UCS-2 strings use 2 bytes, and UCS-4 (emojis, complex scripts) use 4 bytes per character. Because strings are immutable, modifying a character creates a new string object in heap.',

    memoryModel: {
      title: 'PEP 393 Compact Unicode Representation & String Interning',
      diagram: `
+-------------------------------------------------------------------------------+
|                       PEP 393 FLEXIBLE STRING STORAGE                         |
+-------------------------------------------------------------------------------+
| ASCII String "cat": 1 byte/char (Compact PyASCIIObject: Header + 3 bytes)      |
| Emoji String "🐱":  4 bytes/char (Compact PyCompactUnicodeObject: UCS-4)      |
+-------------------------------------------------------------------------------+

   String Interning Pool (Shared Immutable Cache):
   "python" (Created at compile-time/identifiers)
   Address: 0x880010
        ^                  ^
        |                  |
   s1 = "python"      s2 = "python"
   (s1 is s2 -> True; identical pointer in Interning dictionary)

   String Concatenation in a Loop Trap:
   s = ""
   for ch in "abc":
       s += ch  # Step 1: "a" (allocates new string @ 0x1)
                # Step 2: "ab" (allocates new string @ 0x2, copies 'a')
                # Step 3: "abc" (allocates new string @ 0x3, copies 'ab')
                # Total Time: O(N^2) quadratic copies!
                # Solution: ''.join(list_of_chars) in O(N) linear time!
`,
      explanation: 'String immutability guarantees hash stability, enabling strings to be safe dictionary keys. Repeated `+=` string concatenation creates intermediate string allocations resulting in O(N^2) algorithmic bloat. Accumulating tokens in a list and calling `"".join(lst)` executes in strict O(N) time.'
    },

    subtypes: [
      {
        typeName: 'String Formatting: f-strings vs `format()` vs `%`',
        recognition: 'Evaluating expressions inside string literals cleanly without type casting or runtime formatting bugs.',
        mechanism: 'Formatted string literals (`f"..."`) introduced in PEP 498 are parsed into specialized CPython bytecode instructions (`BUILD_STRING`) at compile-time, running significantly faster than `.format()` or `%` operator interpolation.',
        asciiVisual: `
f-string: f"{name}: {score:.2f}"
Evaluated at bytecode level directly -> BUILD_STRING
Faster than method call dispatch of str.format()
`,
        javaCode: `# Efficient String Manipulation & Modern Formatting in Python
def process_strings():
    # 1. Efficient accumulation via join (O(N) vs O(N^2))
    tokens = ["LearnPath", "AI", "Python", "Mastery"]
    slug = "-".join(tokens).lower() # "learnpath-ai-python-mastery"
    
    # 2. Modern f-strings with specifiers & expressions
    accuracy = 0.94567
    streak = 14
    report = f"Accuracy: {accuracy * 100:.2f}% | Current Streak: {streak:03d} days"
    print(report)  # "Accuracy: 94.57% | Current Streak: 014 days"
    
    # 3. String Methods & Immutability Check
    text = "  hello, world!  "
    stripped = text.strip()             # "hello, world!"
    capitalized = stripped.title()      # "Hello, World!"
    
    # Palindrome check via slicing
    is_palindrome = lambda s: s == s[::-1]
    print(f"Is 'racecar' a palindrome? {is_palindrome('racecar')}") # True
    
    return slug, report

if __name__ == "__main__":
    process_strings()`,
        dryRunTrace: {
          input: 'tokens = ["A", "B", "C"], delimiter = "-"',
          headers: ['Operation', 'Byte Size Allocated', 'Execution Strategy', 'Final Result'],
          rows: [
            ['Token scan', 'O(N) character count', 'Calculate exact target buffer size', 'Length = 5 bytes'],
            ['Buffer allocation', 'Exact 5 bytes allocated', 'Single PyASCIIObject instantiated', 'Empty buffer'],
            ['C memcpy', 'Direct copy into buffer', 'Copies "A", "-", "B", "-", "C"', '"A-B-C"']
          ],
          result: 'Zero redundant intermediate string creations; pure O(N) performance.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to test if string starts/ends with one of multiple prefixes', bestApproach: 'Pass a tuple to `startswith()`: `s.startswith(("http://", "https://"))`' },
      { trigger: 'Check if all characters are alphanumeric or digits', bestApproach: '`s.isalnum()` or `s.isdigit()` (handles Unicode digits)' },
      { trigger: 'Reverse a string efficiently', bestApproach: '`s[::-1]` (implemented at C level with fast slice copies)' }
    ],

    pitfalls: [
      'Direct index assignment: `s[0] = "H"` raises `TypeError: \'str\' object does not support item assignment`. Strings must be reconstructed.',
      'Case folding: Using `s.lower()` for case-insensitive matching fails on certain non-ASCII scripts (e.g. German "ß"). Use `s.casefold()` for true Unicode-compliant comparisons.',
      '`strip()` argument misunderstanding: `s.strip("abc")` removes ANY combination of individual characters \'a\', \'b\', \'c\' from both ends, NOT the whole substring "abc". Use `s.removeprefix("abc")` in Python 3.9+.'
    ],

    complexity: [
      { operation: 'Index access `s[i]`', time: 'O(1)', space: 'O(1)' },
      { operation: 'Length calculation `len(s)`', time: 'O(1) [Stored in header]', space: 'O(1)' },
      { operation: 'Concatenation with `"".join(lst)`', time: 'O(N)', space: 'O(N)' },
      { operation: 'Sub-string search `sub in s` (Boyer-Moore-Horspool)', time: 'Average O(N)', space: 'O(1)' }
    ]
  },

  'py-dict-sets': {
    id: 'py-dict-sets',
    title: 'Dictionaries & Sets: Hash Tables & Compact Keys',
    subtitle: 'CPython compact dict architecture (PEP 468/469), hash collision resolution via open addressing with pseudo-random perturbation, and set theory math.',
    category: 'Data Structures',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '12 min read',
    overview: 'Python dictionaries (`dict`) and sets (`set`) are high-performance hash tables providing O(1) average-case insertion, lookup, and deletion. Since Python 3.6+, dicts use a memory-efficient compact layout separating a sparse hash index array from a dense entry array, preserving insertion order by default while reducing memory footprint by 25-35%.',

    memoryModel: {
      title: 'Compact Dictionary Memory Layout (Dense Entries + Sparse Indices)',
      diagram: `
+-------------------------------------------------------------------------------+
|                      CPYTHON COMPACT DICT ARCHITECTURE                        |
+-------------------------------------------------------------------------------+
| Dict: {"name": "Alice", "age": 22}                                            |
| 1. Sparse Indices Array: maps hash(key) % capacity -> index in Entries array  |
| 2. Dense Entries Array: preserves EXACT insertion order                       |
+-------------------------------------------------------------------------------+

   Sparse Hash Indices Array (e.g., size 8):
   Index:     [0]   [1]   [2]   [3]   [4]   [5]   [6]   [7]
   Val:       [-1]  [ 0]  [-1]  [-1]  [ 1]  [-1]  [-1]  [-1]
                      |                 |
                      v                 v
   Dense Entries Array (Contiguous, ordered by insertion):
   Index 0: { hash: 0x48A2, key_ptr: &"name", val_ptr: &"Alice" }
   Index 1: { hash: 0x91F0, key_ptr: &"age",  val_ptr: &22 }

   Collision Resolution: Open Addressing with Perturbation:
   j = (5 * j + 1 + perturbation) & mask;  perturbation >>= 5;
`,
      explanation: 'Because the dense entries array stores items in the sequence they were inserted, iterating over `dict.keys()` or `dict.values()` is strictly insertion-ordered. When collisions occur, CPython perturbs the probe sequence across the sparse array to prevent secondary clustering.'
    },

    subtypes: [
      {
        typeName: 'Dictionary Comprehensions, `get()`, & `defaultdict`',
        recognition: 'Avoiding `KeyError` exceptions when retrieving non-existent keys or aggregating frequencies.',
        mechanism: '`dict[key]` raises `KeyError` if key is missing. `dict.get(key, default)` returns the default fallback. For automatic list/int instantiation on missing keys, `collections.defaultdict` or `dict.setdefault()` eliminates manual existence checks.',
        asciiVisual: `
d.get("missing", 0)   --> Returns 0 without modifying dict
d.setdefault("k", []) --> If "k" missing, sets d["k"] = [] and returns reference
defaultdict(list)     --> Automatically instantiates [] upon access
`,
        javaCode: `# Demonstrating High-Performance Dictionary Operations & Set Algebra
from collections import defaultdict

def analyze_hashing():
    # 1. Frequency Counter via defaultdict
    words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
    freq = defaultdict(int)
    for w in words:
        freq[w] += 1
    print("Frequencies:", dict(freq)) # {'apple': 3, 'banana': 2, 'cherry': 1}
    
    # 2. Dictionary Comprehensions
    square_map = {x: x**2 for x in range(1, 6) if x % 2 == 1}
    print("Odd squares:", square_map) # {1: 1, 3: 9, 5: 25}
    
    # 3. Set Operations (Venn Diagram Math)
    tech_stack_a = {"Python", "JavaScript", "SQL", "Docker"}
    tech_stack_b = {"Python", "Rust", "Go", "Docker"}
    
    intersection = tech_stack_a & tech_stack_b     # {"Python", "Docker"}
    union = tech_stack_a | tech_stack_b            # All unique technologies
    difference = tech_stack_a - tech_stack_b       # {"JavaScript", "SQL"}
    symmetric_diff = tech_stack_a ^ tech_stack_b   # In A or B, but NOT both
    
    return freq, intersection

if __name__ == "__main__":
    analyze_hashing()`,
        dryRunTrace: {
          input: 'tech_a = {"Python", "SQL"}, tech_b = {"Python", "Go"}',
          headers: ['Set Expression', 'Mathematical Meaning', 'Evaluated Elements', 'Result'],
          rows: [
            ['a & b', 'Intersection (A ∩ B)', 'Elements present in BOTH sets', '{"Python"}'],
            ['a | b', 'Union (A ∪ B)', 'All unique elements merged', '{"Python", "SQL", "Go"}'],
            ['a - b', 'Relative Complement', 'In A but removed if in B', '{"SQL"}'],
            ['a ^ b', 'Symmetric Difference', 'In either A or B, but NOT in both', '{"SQL", "Go"}']
          ],
          result: 'All set operations leverage O(1) hash lookups per element.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need two-way fast lookup or invertible mapping', bestApproach: 'Invert dictionary: `{v: k for k, v in d.items()}` (guarantee values are unique)' },
      { trigger: 'Remove duplicates from list while maintaining order', bestApproach: '`list(dict.fromkeys(lst))` (O(N) deduplication preserving original order)' },
      { trigger: 'Counting occurrences of elements in an iterable', bestApproach: '`collections.Counter(iterable)`' }
    ],

    pitfalls: [
      'Unhashable types as keys: Attempting to use a mutable `list` or `set` as a dict key raises `TypeError: unhashable type: \'list\'`. Tuples with immutable contents are hashable.',
      'Modifying dict during iteration: Iterating directly over `for k in d:` while adding/deleting keys raises `RuntimeError: dictionary changed size during iteration`. Iterate over `list(d.keys())` instead.',
      '`defaultdict` side-effect: Simply accessing `d["non_existent"]` on a `defaultdict` inserts the key into the dictionary permanently.'
    ],

    complexity: [
      { operation: 'Key Lookup `d[k]` / `k in d`', time: 'Average O(1) / Worst O(N)', space: 'O(1)' },
      { operation: 'Insertion `d[k] = v`', time: 'Average O(1) / Worst O(N)', space: 'O(1)' },
      { operation: 'Deletion `del d[k]`', time: 'Average O(1)', space: 'O(1)' },
      { operation: 'Set Union `s1 | s2`', time: 'O(len(s1) + len(s2))', space: 'O(len(s1) + len(s2))' }
    ]
  },

  'py-functions': {
    id: 'py-functions',
    title: 'Functions, Scope & First-Class Citizens',
    subtitle: 'LEGB scope resolution hierarchy, `*args`/`**kwargs` packing, closures, decorators, lambda functions, and call frame mechanics.',
    category: 'Core Programming',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '11 min read',
    overview: 'In Python, functions are first-class objects: they can be bound to names, passed as arguments, returned from other functions, and stored in data structures. Scope resolution strictly follows the LEGB rule (Local -> Enclosing -> Global -> Built-in). Closures allow inner functions to retain access to variables from an enclosing scope even after that enclosing scope has returned.',

    memoryModel: {
      title: 'LEGB Scope Hierarchy & Closure Free Variable Cell',
      diagram: `
+-------------------------------------------------------------------------------+
|                         LEGB VARIABLE RESOLUTION HIERARCHY                    |
+-------------------------------------------------------------------------------+
|  L: Local       (Defined inside current function / comprehension)             |
|  E: Enclosing   (Defined in enclosing nested functions; closures)            |
|  G: Global      (Defined at top-level module scope or declared 'global')      |
|  B: Built-in    (Pre-loaded names: len, range, print, Exception, etc.)        |
+-------------------------------------------------------------------------------+

   Closure Memory Structure:
   def make_multiplier(factor):
       def multiply(n):
           return n * factor  # 'factor' is a FREE variable
       return multiply

   Stack Frame: make_multiplier(3)
   Heap Allocation: Cell Object [ ob_ref: 3 ]
        ^
        | ( multiply.__closure__[0].cell_contents points to Cell )
   double = make_multiplier(2)
   triple = make_multiplier(3)
   triple(10) -> Resolves 'factor' from closure cell -> returns 30
`,
      explanation: 'When an inner function references a variable from an enclosing outer function, Python creates a specialized `cell` object on the heap. This prevents garbage collection of the outer variable when the outer stack frame pops.'
    },

    subtypes: [
      {
        typeName: 'Variable Arguments (`*args`, `**kwargs`) & Decorators',
        recognition: 'Writing reusable wrappers that intercept function calls, record metrics, or enforce authentication without altering original function logic.',
        mechanism: 'A decorator is a callable that accepts a function as input and returns a replacement callable (closure). Using `functools.wraps` preserves the decorated function\'s original name, docstring, and signature metadata.',
        asciiVisual: `
@timer_decorator
def calculate(): ...
       |
       v Syntactic Sugar For:
calculate = timer_decorator(calculate)
`,
        javaCode: `# Demonstrating Python Decorators, Closures, and Variadic Packing
import functools
import time

def timing_decorator(func):
    """Decorator that measures execution time of any function."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        duration_ms = (time.perf_counter() - start_time) * 1000
        print(f"[METRIC] '{func.__name__}' executed in {duration_ms:.4f} ms")
        return result
    return wrapper

@timing_decorator
def compute_sum(*args, **kwargs):
    """Computes total with optional multiplier from kwargs."""
    multiplier = kwargs.get("multiplier", 1)
    base_sum = sum(args)
    return base_sum * multiplier

if __name__ == "__main__":
    result = compute_sum(10, 20, 30, 40, multiplier=2)
    print("Final Result:", result) # 200`,
        dryRunTrace: {
          input: 'compute_sum(10, 20, 30, 40, multiplier=2)',
          headers: ['Phase', 'Variables Bound', 'Action Taken', 'Intermediate State'],
          rows: [
            ['Invocation', 'args=(10,20,30,40), kwargs={"multiplier":2}', 'Enter wrapper', 'Timer started'],
            ['Original call', 'Passed unpacked into compute_sum', 'Evaluate sum(args)', 'base_sum = 100'],
            ['Multiplier application', 'kwargs.get("multiplier", 1)', '100 * 2', '200'],
            ['Decorator exit', 'Stop timer', 'Print metric log', 'Return 200']
          ],
          result: 'Transparent metadata preservation and dynamic argument interception.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to modify a variable defined outside the local function in the global scope', bestApproach: 'Use `global var_name` statement (use sparingly)' },
      { trigger: 'Need to modify a variable in an enclosing outer function scope', bestApproach: 'Use `nonlocal var_name` statement (binds to nearest enclosing scope)' },
      { trigger: 'Small one-off inline transformation function for `map()` or `sorted()`', bestApproach: 'Use lambda expression: `sorted(users, key=lambda u: u["age"])`' }
    ],

    pitfalls: [
      'Late binding in closures: Creating lambdas inside a loop `[lambda: i for i in range(3)]` binds to the final value of `i` (2). Fix by capturing default argument: `lambda i=i: i`.',
      'UnboundLocalError: Assigning to a variable anywhere in a function makes it local to that function unless declared `global` or `nonlocal`. Writing `x += 1` where `x` is defined globally raises `UnboundLocalError: local variable \'x\' referenced before assignment`.',
      'Missing `@functools.wraps(func)`: Decorators without `wraps` replace `func.__name__` with `"wrapper"`, breaking debugging tools and documentation generators.'
    ],

    complexity: [
      { operation: 'Function Call Overhead', time: 'O(1) [Creates PyFrameObject]', space: 'O(1)' },
      { operation: 'Closure Creation', time: 'O(1) [Creates cell objects]', space: 'O(cells)' },
      { operation: 'Keyword Argument Lookup', time: 'O(1) [Internal hash lookup]', space: 'O(1)' }
    ]
  },

  'py-oop': {
    id: 'py-oop',
    title: 'Object-Oriented Programming & Dunder Protocol',
    subtitle: 'Classes, instance vs class state, dunder (magic) methods, multiple inheritance, Method Resolution Order (MRO with C3 Linearization), and encapsulation.',
    category: 'Object-Oriented Architecture',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '13 min read',
    overview: 'Python implements OOP through dynamic classes where attributes are stored in instance dictionaries (`__dict__`). Python embraces duck typing ("if it walks like a duck and quacks like a duck, it is a duck") and the Data Model protocol where built-in operations (e.g. `+`, `len()`, `[]`, `str()`) map directly to special double-underscore ("dunder") methods like `__add__`, `__len__`, and `__getitem__`.',

    memoryModel: {
      title: 'CPython Instance __dict__ & C3 Linearization MRO',
      diagram: `
+-------------------------------------------------------------------------------+
|                       INSTANCE ATTRIBUTE LOOKUP & MRO                         |
+-------------------------------------------------------------------------------+
| Class Diamond Inheritance:                                                    |
|        A                                                                      |
|       / \\                                                                     |
|      B   C      MRO order determines exact search sequence for methods        |
|       \\ /       Python uses C3 Linearization: [D, B, C, A, object]            |
|        D                                                                      |
+-------------------------------------------------------------------------------+

   Instance in Memory:
   d = D()
   d.__dict__ = {"x": 10}  <-- Looked up 1st! (Instance dictionary)
        |
        v (If not in instance __dict__)
   D.__dict__              <-- Looked up 2nd!
        |
        v (Follows D.__mro__)
   B.__dict__              <-- Looked up 3rd!
        |
   C.__dict__              <-- Looked up 4th!
        |
   A.__dict__              <-- Looked up 5th!
        |
   object.__dict__         <-- Looked up last! (AttributeError if not found)
`,
      explanation: 'Every Python class has an `__mro__` attribute (Method Resolution Order) calculated via the C3 Linearization algorithm. This prevents multiple inheritance ambiguities and ensures base classes are never called more than once when using `super()`.'
    },

    subtypes: [
      {
        typeName: 'Dunder Protocol (`__str__`, `__repr__`, `__eq__`, `__len__`)',
        recognition: 'Custom objects should seamlessly integrate with native Python built-ins like `print()`, `len()`, `sorted()`, and collections.',
        mechanism: 'Implementing the Python Data Model dunder methods lets custom classes hook into language semantics: `__repr__` for developer debugging, `__str__` for user display, `__eq__` and `__hash__` for hashability, and `__len__` for sequence length.',
        asciiVisual: `
len(obj)   --> invokes obj.__len__()
str(obj)   --> invokes obj.__str__() or falls back to obj.__repr__()
a + b      --> invokes a.__add__(b)
`,
        javaCode: `# Comprehensive Object-Oriented Architecture & Dunder Methods
class Vector2D:
    """Immutable-style 2D Vector implementing the Python Data Model."""
    __slots__ = ('_x', '_y')  # Memory optimization: suppresses instance __dict__

    def __init__(self, x: float, y: float):
        self._x = float(x)
        self._y = float(y)

    @property
    def x(self) -> float:
        return self._x

    @property
    def y(self) -> float:
        return self._y

    def __repr__(self) -> str:
        """Formal representation for developers."""
        return f"Vector2D(x={self._x}, y={self._y})"

    def __str__(self) -> str:
        """Informal string for end-users."""
        return f"({self._x}, {self._y})"

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector2D):
            return NotImplemented
        return self._x == other._x and self._y == other._y

    def __add__(self, other: "Vector2D") -> "Vector2D":
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self._x + other._x, self._y + other._y)

    def __abs__(self) -> float:
        """Magnitude of the vector."""
        return (self._x**2 + self._y**2)**0.5

if __name__ == "__main__":
    v1 = Vector2D(3, 4)
    v2 = Vector2D(1, 2)
    v3 = v1 + v2
    print("v3:", v3)              # (4.0, 6.0)
    print("Magnitude |v1|:", abs(v1)) # 5.0
    print("Equality:", v1 == Vector2D(3, 4)) # True`,
        dryRunTrace: {
          input: 'v1 = Vector2D(3, 4), v2 = Vector2D(1, 2), expr: v1 + v2',
          headers: ['Operation', 'Method Dispatched', 'Arguments Passed', 'Return Value'],
          rows: [
            ['Binary +', 'v1.__add__(v2)', 'self=v1, other=v2', 'New Vector2D(4.0, 6.0)'],
            ['Display print', 'v3.__str__()', 'self=v3', '"(4.0, 6.0)"'],
            ['abs(v1)', 'v1.__abs__()', 'self=v1', '5.0'],
            ['v1 == Vector2D(3, 4)', 'v1.__eq__(...)', 'self=v1, other=new vector', 'True']
          ],
          result: 'Custom class behaves with first-class native syntax.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to prevent dynamic creation of new attributes and save RAM on millions of instances', bestApproach: 'Define `__slots__ = (\'x\', \'y\')` to bypass default `__dict__` overhead' },
      { trigger: 'Need methods that operate on the class itself rather than an instance', bestApproach: 'Use `@classmethod` with `cls` as the first argument (ideal for factory constructors)' },
      { trigger: 'Utility method that requires neither `self` nor `cls`', bestApproach: 'Use `@staticmethod` (namespace bundling)' }
    ],

    pitfalls: [
      'Name Mangling: Attributes prefixed with double underscores `__var` are mangled to `_ClassName__var` to avoid inheritance collisions, NOT to make them truly private.',
      'Mutable Class Attributes: Class variables `class Dog: tricks = []` are shared by all instances! Modifying `d1.tricks.append("bark")` modifies tricks for every dog instance. Initialize mutable state in `__init__`.',
      'Calling `super()` incorrectly in multiple inheritance: Never call base class methods directly like `Base.__init__(self)`; always use `super().__init__(...)` to respect the MRO chain.'
    ],

    complexity: [
      { operation: 'Instance Attribute Lookup', time: 'O(1) [dict hash lookup]', space: 'O(1)' },
      { operation: 'Class Attribute Lookup via MRO', time: 'O(MRO depth)', space: 'O(1)' },
      { operation: 'Object Instantiation `Cls()`', time: 'O(1) + __init__ logic', space: 'O(instance fields)' }
    ]
  },

  'py-exceptions': {
    id: 'py-exceptions',
    title: 'Exceptions, Context Managers & File I/O',
    subtitle: 'Exception hierarchy, EAFP vs LBYL philosophy, the `try-except-else-finally` lifecycle, custom exceptions, and deterministic resource release via `with` context managers.',
    category: 'Robust Programming',
    author: 'LearnPath AI Python & Core Systems Council',
    readTime: '11 min read',
    overview: 'Python strongly advocates the EAFP philosophy: "Easier to Ask for Forgiveness than Permission," preferring `try-except` blocks over preemptive condition checking (LBYL: "Look Before You Leap"). Resource cleanup (files, sockets, database locks) is guaranteed using Context Managers conforming to the `__enter__` and `__exit__` protocol via the `with` statement.',

    memoryModel: {
      title: 'Context Manager Protocol & Execution Frame Stack',
      diagram: `
+-------------------------------------------------------------------------------+
|                       CONTEXT MANAGER EXECUTION LIFECYCLE                     |
+-------------------------------------------------------------------------------+
| with open("data.txt", "r") as f:                                              |
|     content = f.read()                                                        |
+-------------------------------------------------------------------------------+

   1. Context Expression Evaluated: manager = open(...)
   2. Context Entry: value = manager.__enter__()
      - File descriptor opened; assigned to 'as f' variable
   3. Body Execution: content = f.read()
      |
      +---> Scenario A: Normal Completion
      |     manager.__exit__(None, None, None)
      |     - File descriptor closed deterministically!
      |
      +---> Scenario B: Exception Raised Inside Body
            manager.__exit__(exc_type, exc_val, exc_tb)
            - If __exit__ returns True: Exception is SUPPRESSED
            - If __exit__ returns False/None: Exception is RE-RAISED
`,
      explanation: 'The `with` statement guarantees that `__exit__()` is called even if an uncaught exception, `return`, or `break` occurs inside the block. This completely eliminates resource leaks (unclosed file handles, orphaned thread locks).'
    },

    subtypes: [
      {
        typeName: 'The Complete `try-except-else-finally` Lifecycle',
        recognition: 'Executing code only when no errors occurred (`else`) versus guaranteeing cleanup regardless of exceptions (`finally`).',
        mechanism: 'The `else` clause executes ONLY if the `try` block completes without raising an exception. The `finally` clause executes in ALL scenarios—even if `return` or unhandled exceptions occur.',
        asciiVisual: `
[ try Block ]
     |
     +---- (Exception Raised) ----> [ except Block ] ----> [ finally Block ]
     |
     +---- (No Exception) -------> [ else Block ]   ----> [ finally Block ]
`,
        javaCode: `# Comprehensive Exception Handling & Custom Context Manager Pattern
import os

class DatabaseTransaction:
    """Custom context manager simulating atomic operations."""
    def __enter__(self):
        print("[DB] Transaction started -> Lock acquired.")
        return self

    def execute(self, query: str):
        if "DROP" in query:
            raise PermissionError("Destructive operations forbidden!")
        print(f"[DB] Executing: {query}")

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            print(f"[DB] Rollback triggered due to error: {exc_val}")
            return False  # Do NOT suppress error; let caller handle it
        print("[DB] Transaction committed successfully -> Lock released.")
        return True

def safe_file_read(filepath: str) -> str:
    """Reads a file using EAFP and try-except-else-finally."""
    file_handle = None
    try:
        file_handle = open(filepath, "r", encoding="utf-8")
        data = file_handle.read()
    except FileNotFoundError as e:
        print(f"Handled error: File '{filepath}' not found.")
        return ""
    else:
        # Executes ONLY if try completed successfully
        print(f"Successfully loaded {len(data)} characters.")
        return data
    finally:
        # Executes ALWAYS
        if file_handle and not file_handle.closed:
            file_handle.close()
            print("Guaranteed cleanup: File closed.")

if __name__ == "__main__":
    # Test context manager
    try:
        with DatabaseTransaction() as db:
            db.execute("SELECT * FROM users")
            db.execute("DROP TABLE users") # Raises error
    except PermissionError as e:
        print(f"Caught at top-level: {e}")`,
        dryRunTrace: {
          input: 'DatabaseTransaction() with queries "SELECT" then "DROP TABLE"',
          headers: ['Event', 'Handler Fired', 'System Action', 'State'],
          rows: [
            ['__enter__', 'DatabaseTransaction.__enter__', 'Acquire DB Lock', 'Transaction Active'],
            ['query 1', 'db.execute("SELECT...")', 'Normal execution', 'Active'],
            ['query 2', 'db.execute("DROP...")', 'PermissionError raised', 'Exception raised'],
            ['__exit__', 'DatabaseTransaction.__exit__', 'Rollback; return False', 'Lock released; error propagated']
          ],
          result: 'Zero resource leaks; atomic rollback guaranteed.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Need to catch multiple specific exceptions in a single block', bestApproach: 'Use tuple of types: `except (ValueError, TypeError) as e:`' },
      { trigger: 'Need to create a quick custom context manager without writing a class with `__enter__` and `__exit__`', bestApproach: 'Use `@contextlib.contextmanager` decorator with `yield`' },
      { trigger: 'Need to chain exceptions while preserving root cause traceback', bestApproach: 'Use exception chaining: `raise CustomError("Failed") from original_error`' }
    ],

    pitfalls: [
      'Bare `except:` trap: Using `except:` without an exception class catches `SystemExit`, `KeyboardInterrupt`, and `MemoryError`, preventing the program from terminating when Ctrl+C is pressed. Always catch `except Exception:` at minimum.',
      '`finally` overriding `return`: If a `finally` block contains a `return` statement, any value returned by `try` or `except` is discarded, and any active exception is silently suppressed!',
      'Reading entire large files into RAM with `f.read()`: For multi-gigabyte files, `f.read()` causes `MemoryError`. Iterate line-by-line: `for line in f:` to process in O(1) streaming memory.'
    ],

    complexity: [
      { operation: 'Zero-Cost Exception (Normal Path, Python 3.11+)', time: 'O(1) [Zero table overhead]', space: 'O(1)' },
      { operation: 'Exception Raised & Caught', time: 'O(stack depth) [Traceback creation]', space: 'O(stack depth)' },
      { operation: 'Streaming File Read `for line in f:`', time: 'O(File size)', space: 'O(Line length)' }
    ]
  }
};
