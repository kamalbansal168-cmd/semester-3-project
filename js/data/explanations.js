/* ============================================================
   LEARNPATH AI — Concept Micro-Learning Refreshes & Visuals
   ============================================================ */

export const CONCEPT_EXPLANATIONS = {
  'two-pointer': {
    title: 'Array Index Handling & Two-Pointer Traversal',
    subtitle: 'Understand pointer boundaries, index updates, and avoiding off-by-one errors.',
    keyPoints: [
      {
        heading: 'What is an Array Index?',
        content: 'In Java, arrays are 0-indexed. For an array of size N, valid indices run strictly from 0 to N - 1. Accessing index N throws an `ArrayIndexOutOfBoundsException`.'
      },
      {
        heading: 'How Two-Pointer Traversal Works',
        content: 'Two pointers (usually `left` and `right`) track positions in the array. In converging traversal, `left` starts at 0 and moves forward (`left++`), while `right` starts at `length - 1` and moves backward (`right--`).'
      },
      {
        heading: 'Common Off-By-One Pitfalls',
        content: 'A classic mistake is advancing a pointer index (`left++`) before reading the current element, or checking lookahead indices without boundary protection.'
      }
    ],
    visualDiagram: {
      arrayValues: [12, 24, 37, 49, 58],
      leftPointerIndex: 0,
      rightPointerIndex: 4,
      description: 'Converging Pointers on int[] arr = {12, 24, 37, 49, 58}'
    },
    codeComparison: {
      bad: {
        title: 'Common Mistake (Index Shift Before Check)',
        code: `// WRONG: left incremented before comparison!\nleft++;\nif (arr[left] + arr[right] == target) {\n    return true;\n}`
      },
      good: {
        title: 'Correct Pattern (Compare, Then Shift)',
        code: `// CORRECT: Evaluate current values first\nint sum = arr[left] + arr[right];\nif (sum == target) return true;\nelse if (sum < target) left++;\nelse right--;`
      }
    },
    readyActionText: 'Try an Easy Question on Index Handling',
    nextQuestionId: 'tp_01'
  },
  'basic-arrays': {
    title: 'Array Basics & Memory Allocation',
    subtitle: 'Zero-indexing, length properties, and safe iterations.',
    keyPoints: [
      {
        heading: 'Heap Allocation & Length',
        content: 'Arrays in Java are objects allocated on the heap. Access the size using the `.length` property (not a method).'
      },
      {
        heading: 'Iteration Boundaries',
        content: 'Standard forward loop: `for (int i = 0; i < arr.length; i++)`. Using `<= arr.length` causes runtime exception.'
      }
    ],
    visualDiagram: {
      arrayValues: [10, 20, 30, 40],
      leftPointerIndex: 0,
      rightPointerIndex: 3,
      description: 'Zero-based indices 0 to 3'
    },
    codeComparison: {
      bad: {
        title: 'Out of Bounds Access',
        code: `for (int i = 0; i <= arr.length; i++) {\n    System.out.println(arr[i]); // Throws on i == arr.length\n}`
      },
      good: {
        title: 'Safe Traversal Bound',
        code: `for (int i = 0; i < arr.length; i++) {\n    System.out.println(arr[i]); // Safe 0 to length-1\n}`
      }
    },
    readyActionText: 'Practice Basic Arrays',
    nextQuestionId: 'arr_01'
  }
};
