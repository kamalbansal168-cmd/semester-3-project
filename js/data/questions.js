/* ============================================================
   LEARNPATH AI — Realistic Java Arrays Question Bank (30+ Questions)
   ============================================================ */

export const QUESTIONS_DB = [
  // ==========================================
  // TOPIC: CODING PLAYGROUND PROBLEMS (LeetCode / HackerRank Style)
  // ==========================================
  {
    id: 'tp_code_01',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'In-Place Array Reverse',
    difficulty: 'Easy',
    type: 'CODING',
    title: 'Reverse Array In-Place',
    question: 'Write a function that reverses an array of integers in-place using the two-pointer approach. You must do this by modifying the input array in-place with O(1) extra memory.',
    concept: 'Two Pointer In-Place Reversal',
    misconception_tag: 'INDEX_ERROR',
    constraints: [
      '1 <= arr.length <= 10^5',
      '-10^9 <= arr[i] <= 10^9',
      'Must use O(1) auxiliary space'
    ],
    starterCode: `class Solution {
    public int[] reverseArray(int[] arr) {
        // Write your code here
        
    }
}`,
    exampleInput: 'arr = [1, 2, 3, 4, 5]',
    exampleOutput: '[5, 4, 3, 2, 1]',
    explanation: 'Initialize left=0 and right=arr.length-1. Swap elements at left and right, increment left and decrement right until pointers cross.',
    testCases: [
      { input: 'arr = [1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]' },
      { input: 'arr = [10, 20, 30, 40]', expected: '[40, 30, 20, 10]' },
      { input: 'arr = [7]', expected: '[7]' },
      { input: 'arr = [9, -2, 4, 11, 0, 3]', expected: '[3, 0, 11, 4, -2, 9]' }
    ]
  },
  {
    id: 'tp_code_02',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Move Zeroes to End',
    difficulty: 'Easy',
    type: 'CODING',
    title: 'Move Zeroes to End',
    question: 'Given an integer array `nums`, move all `0`s to the end of it while maintaining the relative order of the non-zero elements in-place.',
    concept: 'Two-Pointer In-Place Shift',
    misconception_tag: 'INDEX_ERROR',
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1'
    ],
    starterCode: `class Solution {
    public int[] moveZeroes(int[] nums) {
        // Write your code here
        
    }
}`,
    exampleInput: 'nums = [0, 1, 0, 3, 12]',
    exampleOutput: '[1, 3, 12, 0, 0]',
    explanation: 'Maintain an insertPos pointer. When nums[i] != 0, swap nums[insertPos] with nums[i] and increment insertPos.',
    testCases: [
      { input: 'nums = [0, 1, 0, 3, 12]', expected: '[1, 3, 12, 0, 0]' },
      { input: 'nums = [0]', expected: '[0]' },
      { input: 'nums = [1, 2, 3]', expected: '[1, 2, 3]' },
      { input: 'nums = [0, 0, 1]', expected: '[1, 0, 0]' }
    ]
  },
  {
    id: 'lc_two_sum',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    type: 'CODING',
    title: 'Two Sum II - Sorted Array',
    question: 'Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number. Return the indices of the two numbers added by one.',
    concept: 'Two Pointer Sorted Convergence',
    misconception_tag: 'INDEX_ERROR',
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order'
    ],
    starterCode: `class Solution {
    public int[] twoSum(int[] numbers, int target) {
        // Write your code here
        
    }
}`,
    exampleInput: 'numbers = [2, 7, 11, 15], target = 9',
    exampleOutput: '[1, 2]',
    explanation: 'Because array is sorted, incrementing left increases sum, decrementing right decreases sum.',
    testCases: [
      { input: 'numbers = [2, 7, 11, 15], target = 9', expected: '[1, 2]' },
      { input: 'numbers = [2, 3, 4], target = 6', expected: '[1, 3]' },
      { input: 'numbers = [-1, 0], target = -1', expected: '[1, 2]' }
    ]
  },
  {
    id: 'lc_max_sub',
    subject: 'java',
    topic: 'basic-arrays',
    subtopic: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    type: 'CODING',
    title: 'Maximum Subarray (Kadane)',
    question: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    concept: "Kadane's Dynamic Prefix Optimization",
    misconception_tag: 'LOGIC_ERROR',
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    starterCode: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your code here
        
    }
}`,
    exampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    exampleOutput: '6',
    explanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6.',
    testCases: [
      { input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
      { input: 'nums = [1]', expected: '1' },
      { input: 'nums = [5, 4, -1, 7, 8]', expected: '23' }
    ]
  },

  // ==========================================
  // TOPIC: TWO POINTER MCQ
  // ==========================================
  {
    id: 'tp_01',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Pointer Convergence',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Pointer Convergence Termination',
    question: 'In a standard two-pointer array reversal technique on `int[] arr`, what is the correct while loop termination condition?',
    snippet: `int left = 0;\nint right = arr.length - 1;\nwhile (/* ??? */) {\n    int temp = arr[left];\n    arr[left] = arr[right];\n    arr[right] = temp;\n    left++;\n    right--;\n}`,
    options: [
      'left <= right',
      'left < right',
      'left != right',
      'right > 0'
    ],
    correct_answer: 1,
    explanation: 'When `left < right`, all pairs of elements from both ends swap until they meet in the middle. If left == right on an odd-length array, the middle element is already in place and does not need to swap with itself.',
    concept: 'Two Pointer Boundary Conditions',
    common_errors: 'Using left <= right or left != right (which can cause redundant swaps or skip)',
    misconception_tag: 'LOOP_BOUNDARY_ERROR'
  },
  {
    id: 'tp_02',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Index Handling & Pointer Increment',
    difficulty: 'Medium',
    type: 'MCQ',
    title: 'Sorted Array Pointer Progression',
    question: 'In the Two Sum II problem on a sorted array, you need to find two numbers that add up to `target`. If `arr[left] + arr[right] < target`, which pointer update is correct without causing an off-by-one error?',
    snippet: `int sum = arr[left] + arr[right];\nif (sum < target) {\n    // Which update is safe and correct?\n}`,
    options: [
      'arr[left++] = target - arr[right];',
      'left++; // Move left pointer to next larger value',
      'left = left + 2;',
      'right--; // Decrement right pointer'
    ],
    correct_answer: 1,
    explanation: 'Since the array is sorted in ascending order, moving the left pointer rightward (`left++`) increases the total sum towards the target without modifying or corrupting array contents.',
    concept: 'Sorted Array Pointer Progression',
    common_errors: 'Overwriting elements or incrementing pointer inside bracket access before reading',
    misconception_tag: 'INDEX_ERROR'
  },
  {
    id: 'tp_03',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Fast and Slow Pointer',
    difficulty: 'Medium',
    type: 'MCQ',
    title: 'In-Place Array Compaction',
    question: 'Consider removing duplicates in-place from a sorted array. What should you do when `nums[fast] != nums[slow]`?',
    snippet: `int slow = 0;\nfor (int fast = 1; fast < nums.length; fast++) {\n    if (nums[fast] != nums[slow]) {\n        // What goes here?\n    }\n}`,
    options: [
      'nums[slow] = nums[fast]; slow++;',
      'slow++; nums[slow] = nums[fast];',
      'nums[fast] = nums[slow++];',
      'nums[slow + 1] = nums[fast + 1];'
    ],
    correct_answer: 1,
    explanation: 'First advance the `slow` index to the next open unique slot (`slow++`), then assign the newly discovered distinct value `nums[slow] = nums[fast]`.',
    concept: 'In-Place Array Compaction',
    common_errors: 'Overwriting before advancing slow index or skipping indices',
    misconception_tag: 'INDEX_ERROR'
  },
  {
    id: 'tp_04',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: '3-Sum Left-Right Pointer Collision',
    difficulty: 'Hard',
    type: 'MCQ',
    title: 'Lookahead Index Guarding',
    question: 'When skipping duplicate elements in Two Pointer after finding a valid pair in 3-Sum, what check must be included inside the skip loops?',
    snippet: `while (left < right && nums[left] == nums[left + 1]) left++;\nwhile (left < right && nums[right] == nums[right - 1]) right--;`,
    options: [
      'Always check `left < right` before reading `left + 1` or `right - 1` to prevent ArrayIndexOutOfBoundsException',
      'Check if nums[left] == 0',
      'Check nums.length > 3',
      'No boundary check needed because outer loop handles it'
    ],
    correct_answer: 0,
    explanation: 'Whenever you look ahead by 1 index (`left + 1` or `right - 1`), you must guard the boundary with `left < right` to prevent index overflow/underflow.',
    concept: 'Lookahead Index Guarding',
    common_errors: 'Neglecting lookahead boundary checks leading to ArrayIndexOutOfBoundsException',
    misconception_tag: 'LOOP_BOUNDARY_ERROR'
  },

  // ==========================================
  // TOPIC: ARRAY BASICS
  // ==========================================
  {
    id: 'arr_01',
    subject: 'java',
    topic: 'basic-arrays',
    subtopic: 'Array Declaration & Default Values',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'JVM Array Default Values',
    question: 'In Java, what are the initial default values of an uninitialized integer array created with `int[] numbers = new int[5];`?',
    snippet: `int[] numbers = new int[5];\nSystem.out.println(numbers[0]);`,
    options: [
      'null',
      '0',
      'Garbage value',
      '-1'
    ],
    correct_answer: 1,
    explanation: 'In Java, array elements of primitive numeric types are automatically initialized to 0 when allocated on the heap.',
    concept: 'JVM Array Default Values',
    misconception_tag: 'CONCEPT_CONFUSION'
  },
  {
    id: 'arr_02',
    subject: 'java',
    topic: 'basic-arrays',
    subtopic: 'Array Length Property',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Java Array Member Access',
    question: 'How do you obtain the number of elements in a Java array `int[] arr`?',
    snippet: `int[] arr = {10, 20, 30};`,
    options: [
      'arr.length()',
      'arr.size()',
      'arr.length',
      'arr.count()'
    ],
    correct_answer: 2,
    explanation: 'In Java, `length` is a final public instance field on array objects, not a method.',
    concept: 'Java Array Member Access',
    misconception_tag: 'SYNTAX_ERROR'
  },
  {
    id: 'arr_03',
    subject: 'java',
    topic: 'basic-arrays',
    subtopic: 'Zero-based Index Boundaries',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Zero-indexed Boundary Checking',
    question: 'What happens when executing the following code snippet?',
    snippet: `int[] data = new int[4];\ndata[4] = 100;`,
    options: [
      'The array dynamically expands to size 5',
      'Compiles with a warning and sets the value',
      'Throws ArrayIndexOutOfBoundsException at runtime',
      'Sets data[3] to 100'
    ],
    correct_answer: 2,
    explanation: 'An array of size 4 has valid indices from 0 to 3. Accessing index 4 throws ArrayIndexOutOfBoundsException.',
    concept: 'Zero-indexed Boundary Checking',
    misconception_tag: 'INDEX_ERROR'
  },
  {
    id: 'arr_04',
    subject: 'java',
    topic: 'basic-arrays',
    subtopic: 'Safe Array Traversal',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Standard Array Traversal Loop',
    question: 'Which loop correctly iterates through all elements of `int[] arr` from start to end without missing the first or last element?',
    options: [
      'for (int i = 1; i <= arr.length; i++)',
      'for (int i = 0; i < arr.length; i++)',
      'for (int i = 0; i <= arr.length; i++)',
      'for (int i = 1; i < arr.length; i++)'
    ],
    correct_answer: 1,
    explanation: 'Valid indices start at 0 and terminate strictly before `arr.length` (`i < arr.length`).',
    concept: 'Standard Array Traversal Loop',
    misconception_tag: 'LOOP_BOUNDARY_ERROR'
  },

  // ==========================================
  // TOPIC: SEARCHING
  // ==========================================
  {
    id: 'sr_01',
    subject: 'java',
    topic: 'searching',
    subtopic: 'Binary Search Mid Formula',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Integer Overflow Prevention in Search',
    question: 'To prevent potential 32-bit integer overflow when computing the midpoint `mid` in binary search, which formula is recommended?',
    options: [
      'int mid = (low + high) / 2;',
      'int mid = low + (high - low) / 2;',
      'int mid = (high - low) / 2;',
      'int mid = low + high / 2;'
    ],
    correct_answer: 1,
    explanation: '`low + (high - low) / 2` is overflow-safe and avoids exceeding Integer.MAX_VALUE.',
    concept: 'Integer Overflow Prevention in Search',
    misconception_tag: 'APPROACH_ERROR'
  },
  {
    id: 'sr_02',
    subject: 'java',
    topic: 'searching',
    subtopic: 'Binary Search Termination Condition',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Binary Search Inclusion Boundary',
    question: 'In standard binary search on a sorted array where single-element search intervals must be checked, what is the while condition?',
    options: [
      'low < high',
      'low <= high',
      'low != high',
      'high > 0'
    ],
    correct_answer: 1,
    explanation: '`while (low <= high)` guarantees evaluating the single remaining candidate element at `arr[mid]`.',
    concept: 'Binary Search Inclusion Boundary',
    misconception_tag: 'LOOP_BOUNDARY_ERROR'
  },

  // ==========================================
  // RE-TEST QUESTIONS (Validation Set)
  // ==========================================
  {
    id: 'retest_01',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Targeted Re-Test: Boundary Convergence',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Re-Test: Boundary Convergence',
    question: 'Targeted Re-Test Q1/5: In a two-pointer swap algorithm, if `left = 0` and `right = 4`, how many swap iterations occur before `left < right` becomes false?',
    snippet: `int left = 0, right = 4;\nwhile (left < right) {\n    // swap arr[left] & arr[right]\n    left++;\n    right--;\n}`,
    options: [
      '2 swaps (indices (0,4) and (1,3))',
      '3 swaps',
      '4 swaps',
      '5 swaps'
    ],
    correct_answer: 0,
    explanation: 'Iteration 1: left=0, right=4. Swapped. left=1, right=3. Iteration 2: left=1, right=3. Swapped. left=2, right=2. Loop ends. Total = 2 swaps.',
    concept: 'Two Pointer Iteration Step Tracing',
    misconception_tag: 'LOOP_BOUNDARY_ERROR'
  },
  {
    id: 'retest_02',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Targeted Re-Test: Off-By-One Index Avoidance',
    difficulty: 'Easy',
    type: 'MCQ',
    title: 'Re-Test: Off-By-One Index Guarding',
    question: 'Targeted Re-Test Q2/5: Which line avoids an `ArrayIndexOutOfBoundsException` when accessing adjacent elements during two-pointer window expansion?',
    options: [
      'if (right + 1 < arr.length && arr[right + 1] == arr[right])',
      'if (arr[right + 1] == arr[right] && right < arr.length)',
      'if (right <= arr.length && arr[right + 1] > 0)',
      'if (arr[right++] == arr[right--])'
    ],
    correct_answer: 0,
    explanation: 'Java uses short-circuit evaluation (`&&`). Placing `right + 1 < arr.length` first protects against out-of-bounds array access.',
    concept: 'Short-Circuit Index Guarding',
    misconception_tag: 'INDEX_ERROR'
  },
  {
    id: 'retest_03',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Targeted Re-Test: Pointer Movement Rules',
    difficulty: 'Medium',
    type: 'MCQ',
    title: 'Re-Test: Pointer Movement Rules',
    question: 'Targeted Re-Test Q3/5: When using Two Pointers on a sorted array `arr` to find `arr[l] + arr[r] == target`, if `arr[l] + arr[r] > target`, what should you do?',
    options: [
      'Decrement right pointer (`r--`) to reduce total sum',
      'Increment left pointer (`l++`) to increase sum',
      'Reset both pointers to 0',
      'Multiply target by 2'
    ],
    correct_answer: 0,
    explanation: 'Because array is sorted, elements left of `r` are smaller. Decrementing `r--` reduces sum toward `target`.',
    concept: 'Sorted Array Monotonic Convergence',
    misconception_tag: 'APPROACH_ERROR'
  },
  {
    id: 'retest_04',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Targeted Re-Test: In-Place Write Pointer',
    difficulty: 'Medium',
    type: 'MCQ',
    title: 'Re-Test: In-Place Write Pointer',
    question: 'Targeted Re-Test Q4/5: In removing target element `val` in-place from `nums`, what is the correct write pointer action when `nums[i] != val`?',
    options: [
      'nums[k++] = nums[i];',
      'nums[++k] = nums[i];',
      'nums[i] = nums[k++];',
      'k = i + 1;'
    ],
    correct_answer: 0,
    explanation: '`nums[k++] = nums[i]` writes at slot `k` and post-increments `k` to the next slot.',
    concept: 'Post-Increment Array Index Insertion',
    misconception_tag: 'INDEX_ERROR'
  },
  {
    id: 'retest_05',
    subject: 'java',
    topic: 'two-pointer',
    subtopic: 'Targeted Re-Test: Complexity Verification',
    difficulty: 'Medium',
    type: 'MCQ',
    title: 'Re-Test: Complexity Verification',
    question: 'Targeted Re-Test Q5/5: What is the time and auxiliary space complexity of the optimal Two Pointer array reversal algorithm?',
    options: [
      'Time: O(N), Auxiliary Space: O(1)',
      'Time: O(N^2), Auxiliary Space: O(N)',
      'Time: O(log N), Auxiliary Space: O(1)',
      'Time: O(N), Auxiliary Space: O(N)'
    ],
    correct_answer: 0,
    explanation: 'Linear time O(N) with in-place O(1) auxiliary space.',
    concept: 'Two Pointer Algorithmic Efficiency',
    misconception_tag: 'APPROACH_ERROR'
  }
];
