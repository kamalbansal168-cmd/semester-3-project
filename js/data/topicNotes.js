/* ============================================================
   LEARNPATH AI — Comprehensive Topic Notes & PDF Study Guides
   Masterclass In-Depth DSA Knowledge Base with Sub-Types,
   Memory Models, Dry-Run Tables, and Annotated Java Implementations
   ============================================================ */

export const TOPIC_NOTES_DB = {
  'basic-arrays': {
    id: 'basic-arrays',
    title: 'Array Basics & Memory Architecture',
    subtitle: 'Comprehensive masterclass on zero-indexed arrays, contiguous heap layout, pointer arithmetic, and linear invariants in Java.',
    category: 'Foundations',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '10 min read',
    overview: 'An Array is a contiguous block of memory allocated sequentially on the heap that holds elements of homogeneous type. In Java, arrays are true objects that encapsulate a fixed length upon instantiation and provide O(1) instantaneous random access via direct memory offset calculations.',
    
    memoryModel: {
      title: 'Contiguous Heap Memory & Index Arithmetic',
      diagram: `
+-------------------------------------------------------------------------------+
|                        HEAP MEMORY ADDRESS CALCULATION                        |
+-------------------------------------------------------------------------------+
| Array Reference: 'nums' points to base address 0x1000                        |
| Element Size: 4 bytes per 32-bit signed 'int'                                 |
| Formula: Memory_Address(nums[i]) = Base_Address + (i * Element_Size)          |
+-------------------------------------------------------------------------------+

   RAM Address:   0x1000      0x1004      0x1008      0x100C      0x1010
                +-----------+-----------+-----------+-----------+-----------+
   Array Index: |  nums[0]  |  nums[1]  |  nums[2]  |  nums[3]  |  nums[4]  |
                +-----------+-----------+-----------+-----------+-----------+
   Stored Val:  |    10     |    25     |    -4     |    88     |     7     |
                +-----------+-----------+-----------+-----------+-----------+
   Calculation: | 1000+0*4  | 1000+1*4  | 1000+2*4  | 1000+3*4  | 1000+4*4  |
                +-----------+-----------+-----------+-----------+-----------+
`,
      explanation: 'Because memory is strictly contiguous, the CPU calculates the target byte address in exactly 1 hardware clock cycle without scanning earlier elements. This is why array lookups are strictly O(1) time complexity.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Single-Pass Linear Accumulator & Extremum Scan',
        recognition: 'Trigger: Finding min/max, calculating running sums, or computing statistics in a single pass without extra memory.',
        mechanism: 'Maintain one or more state accumulator variables (e.g. `maxVal`, `runningSum`). Initialize with sensible bounds (`Integer.MIN_VALUE` or `arr[0]`), iterate once from index 0 to N-1, and update state at each step.',
        asciiVisual: `
Step 0: max = -INF
Step 1: [10] -> max = Math.max(-INF, 10) = 10
Step 2: [25] -> max = Math.max(10, 25)   = 25
Step 3: [-4] -> max = Math.max(25, -4)   = 25 (unchanged)
`,
        javaCode: `public int findMaximum(int[] nums) {
    // Edge case guard: empty array
    if (nums == null || nums.length == 0) {
        throw new IllegalArgumentException("Array cannot be empty");
    }
    
    // Initialize accumulator to first element or Integer.MIN_VALUE
    int maxVal = nums[0];
    
    // Linear scan through remaining elements
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > maxVal) {
            maxVal = nums[i]; // Update current record
        }
    }
    return maxVal;
}`,
        dryRunTrace: {
          input: 'nums = [10, 25, -4, 88, 7]',
          headers: ['Iteration (i)', 'nums[i]', 'Previous maxVal', 'Condition (nums[i] > maxVal)', 'New maxVal'],
          rows: [
            ['i = 0 (Init)', '10', 'None', 'Initial Assignment', '10'],
            ['i = 1', '25', '10', '25 > 10 (TRUE)', '25'],
            ['i = 2', '-4', '25', '-4 > 25 (FALSE)', '25'],
            ['i = 3', '88', '25', '88 > 25 (TRUE)', '88'],
            ['i = 4', '7', '88', '7 > 88 (FALSE)', '88']
          ],
          result: 'Output: 88 in O(N) Time and O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: In-Place Reversal & Mirror Swapping',
        recognition: 'Trigger: Need to invert an array or rotate segments without allocating O(N) secondary storage.',
        mechanism: 'Place two boundary index markers: `left = 0` and `right = length - 1`. Exchange values at both indices using a temporary variable, then contract both markers inward (`left++`, `right--`) until `left >= right`.',
        asciiVisual: `
Initial:   [ 10 , 20 , 30 , 40 , 50 ]
             ^                     ^
            left                 right  (Swap 10 and 50)

Step 1:    [ 50 , 20 , 30 , 40 , 10 ]
                  ^         ^
                left      right        (Swap 20 and 40)

Step 2:    [ 50 , 40 , 30 , 20 , 10 ]
                       ^
                   left==right         (Halt condition met)
`,
        javaCode: `public void reverseArray(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left < right) {
        // In-place 3-step value exchange
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
        
        // Move pointers inward
        left++;
        right--;
    }
}`,
        dryRunTrace: {
          input: 'nums = [1, 2, 3, 4]',
          headers: ['Step', 'left', 'right', 'nums[left] & nums[right]', 'Array State After Swap'],
          rows: [
            ['1', '0', '3', 'nums[0]=1, nums[3]=4', '[4, 2, 3, 1]'],
            ['2', '1', '2', 'nums[1]=2, nums[2]=3', '[4, 3, 2, 1]'],
            ['3', '2', '1', 'left >= right (2 >= 1)', 'Halt loop. Done.']
          ],
          result: 'Array successfully reversed in-place in O(N/2) swaps = O(N) Time, O(1) Space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Find element with specific property without sorted order', bestApproach: 'Single-pass Linear Scan O(N)' },
      { trigger: 'Rearrange or reverse elements in-place with zero extra memory', bestApproach: 'Two-Pointer Mirror Swap O(N) Time, O(1) Space' },
      { trigger: 'Need dynamic resizing where initial size is unknown', bestApproach: 'Use ArrayList (Geometric capacity growth amortized O(1))' }
    ],

    pitfalls: [
      'Off-by-one index loop condition: Using `i <= arr.length` causes `ArrayIndexOutOfBoundsException` at runtime.',
      'Shallow Reference Copying: Executing `int[] copy = arr;` does not clone data; both variables point to identical heap address.',
      'Negative Index Misconception: Unlike Python, Java throws runtime exceptions on `arr[-1]`.',
      'Calling `.length()` instead of `.length`: Arrays use a public final field `.length`, not a method call.'
    ],

    complexity: [
      { operation: 'Index Read/Write `arr[i]`', time: 'O(1)', space: 'O(1)' },
      { operation: 'Linear Scan / Search', time: 'O(N)', space: 'O(1)' },
      { operation: 'In-Place Reversal', time: 'O(N)', space: 'O(1)' },
      { operation: 'Insert / Delete at Arbitrary Index', time: 'O(N) (shift required)', space: 'O(1)' }
    ]
  },

  'two-pointer': {
    id: 'two-pointer',
    title: 'Two Pointer Technique & Invariants',
    subtitle: 'Master converging, fast-slow read/write compaction, and multi-array pointer navigation to eliminate O(N²) quadratic bottlenecks.',
    category: 'Optimization Strategy',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '12 min read',
    overview: 'The Two Pointer paradigm coordinates two integer index markers to scan an array simultaneously. By exploiting monotonic trends or partition properties, it reduces quadratic nested loops O(N²) to optimal linear O(N) scans.',
    
    memoryModel: {
      title: 'Converging vs Same-Direction Invariant Geometry',
      diagram: `
Converging Pointers (Opposite Ends):
  left -> [ 1 , 3 , 6 , 8 , 11 , 15 ] <- right
           Moves ->              <- Moves

Fast-Slow Read/Write Pointers (Same Direction):
  slow (write) -> [ 0 , 1 , 0 , 3 , 12 ]
  fast (read)  --------> scans ahead to inspect conditions
`,
      explanation: 'In converging pointers, each step eliminates an entire row or column of the search matrix. In fast-slow pointers, the slow pointer preserves the processed prefix while the fast pointer explores the unprocessed suffix.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Converging / Opposite-Direction Pointers',
        recognition: 'Trigger: Finding pairs with target sum in sorted array, palindrome verification, or maximizing geometric containers.',
        mechanism: 'Start `left = 0` and `right = N - 1`. Evaluate sum or property. If sum < target, advance `left++` (monotonic increase). If sum > target, decrement `right--` (monotonic decrease). Terminate when `left >= right`.',
        asciiVisual: `
Target = 14, Sorted Array: [2, 7, 11, 15]
Step 1: left=0(2) + right=3(15) = 17 > 14  --> right--
Step 2: left=0(2) + right=2(11) = 13 < 14  --> left++
Step 3: left=1(7) + right=2(11) = 18 > 14  --> right--
Step 4: left=1(7) + right=1(7)  --> left == right, Not Found
`,
        javaCode: `public int[] twoSumSorted(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        if (sum == target) {
            return new int[]{left + 1, right + 1}; // 1-indexed answer
        } else if (sum < target) {
            left++;  // Monotonically increase sum
        } else {
            right--; // Monotonically decrease sum
        }
    }
    return new int[]{-1, -1}; // Target not present
}`,
        dryRunTrace: {
          input: 'numbers = [2, 7, 11, 15], target = 9',
          headers: ['Step', 'left', 'right', 'numbers[left] + numbers[right]', 'Decision Action'],
          rows: [
            ['1', '0 (val 2)', '3 (val 15)', '2 + 15 = 17', '17 > 9 -> right--'],
            ['2', '0 (val 2)', '2 (val 11)', '2 + 11 = 13', '13 > 9 -> right--'],
            ['3', '0 (val 2)', '1 (val 7)', '2 + 7 = 9', 'Match Found! Return indices [1, 2]']
          ],
          result: 'Resolved in 3 comparisons instead of 6 in nested loop. O(N) Time, O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Fast & Slow Read/Write Compaction Pointer',
        recognition: 'Trigger: In-place filtering, removing duplicates from sorted arrays, or shifting zeroes to the end.',
        mechanism: '`slow` points to the last validated element in the new prefix. `fast` scans every element. Whenever `nums[fast]` meets the retention criteria, increment `slow` and write `nums[slow] = nums[fast]`.',
        asciiVisual: `
Remove Duplicates: [ 1 , 1 , 2 , 2 , 3 ]
  fast=1: nums[1]==nums[0] -> skip duplicate
  fast=2: nums[2]!=nums[0] -> slow++, nums[slow]=2 -> [1, 2, ...]
  fast=3: nums[3]==nums[1] -> skip duplicate
  fast=4: nums[4]!=nums[1] -> slow++, nums[slow]=3 -> [1, 2, 3]
`,
        javaCode: `public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    
    int slow = 0; // Boundary of unique prefix
    
    for (int fast = 1; fast < nums.length; fast++) {
        // When a new unique element is encountered
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast]; // Overwrite next write slot
        }
    }
    return slow + 1; // Total length of unique elements
}`,
        dryRunTrace: {
          input: 'nums = [1, 1, 2, 3]',
          headers: ['fast index', 'nums[fast]', 'nums[slow]', 'Condition (nums[fast] != nums[slow])', 'Array State'],
          rows: [
            ['Init', '-', 'nums[0]=1', '-', '[1, 1, 2, 3] (slow=0)'],
            ['fast = 1', '1', '1', '1 != 1 (FALSE -> skip)', '[1, 1, 2, 3] (slow=0)'],
            ['fast = 2', '2', '1', '2 != 1 (TRUE -> slow=1, nums[1]=2)', '[1, 2, 2, 3] (slow=1)'],
            ['fast = 3', '3', '2', '3 != 2 (TRUE -> slow=2, nums[2]=3)', '[1, 2, 3, 3] (slow=2)']
          ],
          result: 'Returns unique count = 3. Elements [1, 2, 3] preserved in O(N) time with O(1) space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Array is sorted and you need pair combinations equal to target', bestApproach: 'Opposite-direction Converging Two Pointers' },
      { trigger: 'Remove elements or compact array in-place without new array allocation', bestApproach: 'Fast-Slow Read/Write Pointer' },
      { trigger: 'Compare or merge two independently sorted arrays', bestApproach: 'Dual Array Pointers (i for arr1, j for arr2)' }
    ],

    pitfalls: [
      'Applying converging pointers on UNSORTED arrays: Sorting is a prerequisite for monotonicity.',
      'Using `left <= right` in pair sums: Can cause an element to pair with itself if `target = 2 * nums[i]`.',
      'Premature pointer modification before reading value: Leads to skipping boundary elements.'
    ],

    complexity: [
      { operation: 'Two Sum on Sorted Array', time: 'O(N)', space: 'O(1)' },
      { operation: 'In-Place Duplicate Compaction', time: 'O(N)', space: 'O(1)' },
      { operation: '3Sum (Sorted array + outer loop)', time: 'O(N²)', space: 'O(1)' },
      { operation: 'Container With Most Water', time: 'O(N)', space: 'O(1)' }
    ]
  },

  'sliding-window': {
    id: 'sliding-window',
    title: 'Sliding Window Algorithm & Subarrays',
    subtitle: 'Transform contiguous subarray evaluations from O(N*K) down to optimal O(N) through differential state transitions.',
    category: 'Optimization Strategy',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '11 min read',
    overview: 'The Sliding Window pattern maintains a contiguous segment `[windowStart, windowEnd]` over sequential data. By adding new incoming elements and subtracting outgoing elements, it avoids redundant re-computation of overlapping subarrays.',
    
    memoryModel: {
      title: 'Differential State Window Transition',
      diagram: `
Subarray of Size K = 3:
Old Window: [ (2 + 1 + 5) , 1 , 3 , 2 ]  -> Sum = 8
Slide Right:
Subtract outgoing (2) <--- | Add incoming (1) --->
New Window: [ 2 , (1 + 5 + 1) , 3 , 2 ]  -> Sum = 8 - 2 + 1 = 7
`,
      explanation: 'Instead of spending O(K) time recalculating the entire window sum from scratch for every index, we perform exactly 1 addition and 1 subtraction in O(1) time.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Fixed-Length Window (Size = K)',
        recognition: 'Trigger: "Find maximum/minimum sum or average of any contiguous subarray of exact length K".',
        mechanism: '1. Compute initial sum of first K elements. 2. Slide window from index K to N-1: `windowSum += arr[i] - arr[i - k]`. 3. Update global maximum at each step.',
        asciiVisual: `
arr = [2, 1, 5, 1, 3, 2], k = 3
Window 0: [2, 1, 5] -> sum = 8
Window 1: [1, 5, 1] -> sum = 8 - 2 + 1 = 7
Window 2: [5, 1, 3] -> sum = 7 - 1 + 3 = 9 (MAX)
Window 3: [1, 3, 2] -> sum = 9 - 5 + 2 = 6
`,
        javaCode: `public int maxSubArrayLenK(int[] nums, int k) {
    if (nums.length < k) return 0;
    
    int currentSum = 0;
    // Step 1: Prime the first window
    for (int i = 0; i < k; i++) {
        currentSum += nums[i];
    }
    
    int maxSum = currentSum;
    
    // Step 2: Slide across remaining elements
    for (int i = k; i < nums.length; i++) {
        currentSum += nums[i] - nums[i - k]; // Add incoming, drop outgoing
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}`,
        dryRunTrace: {
          input: 'nums = [2, 1, 5, 1, 3, 2], k = 3',
          headers: ['Index i', 'Incoming nums[i]', 'Outgoing nums[i-k]', 'New currentSum', 'maxSum'],
          rows: [
            ['Prime (0..2)', '[2, 1, 5]', 'None', '8', '8'],
            ['i = 3', 'nums[3]=1', 'nums[0]=2', '8 + 1 - 2 = 7', 'Math.max(8, 7) = 8'],
            ['i = 4', 'nums[4]=3', 'nums[1]=1', '7 + 3 - 1 = 9', 'Math.max(8, 9) = 9'],
            ['i = 5', 'nums[5]=2', 'nums[2]=5', '9 + 2 - 5 = 6', 'Math.max(9, 6) = 9']
          ],
          result: 'Max subarray sum = 9 in O(N) Time and O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Variable-Length Window (Expand & Contract)',
        recognition: 'Trigger: "Find smallest subarray with sum >= target" or "Longest substring with at most K distinct characters".',
        mechanism: 'Expand `right` pointer to include new elements until constraint is met. Then shrink `left` pointer while constraint remains satisfied to find the optimal minimal/maximal window size.',
        asciiVisual: `
Target Sum >= 7, arr = [2, 3, 1, 2, 4, 3]
Expand right until sum >= 7: [2, 3, 1, 2] (sum=8, len=4)
Contract left: [3, 1, 2] (sum=6 < 7, stop shrinking)
Expand right: [3, 1, 2, 4] (sum=10 >= 7) -> Contract: [1, 2, 4] (sum=7, len=3) -> [2, 4] (sum=6)
Expand right: [2, 4, 3] (sum=9) -> Contract: [4, 3] (sum=7, len=2 OPTIMAL)
`,
        javaCode: `public int minSubArrayLen(int target, int[] nums) {
    int minLen = Integer.MAX_VALUE;
    int currentSum = 0;
    int left = 0;
    
    for (int right = 0; right < nums.length; right++) {
        currentSum += nums[right]; // Expand window rightward
        
        // Contract window from left while condition is satisfied
        while (currentSum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            currentSum -= nums[left];
            left++; // Shrink window
        }
    }
    return (minLen == Integer.MAX_VALUE) ? 0 : minLen;
}`,
        dryRunTrace: {
          input: 'nums = [2, 3, 1, 2, 4, 3], target = 7',
          headers: ['right', 'nums[right]', 'currentSum', 'while(sum>=7) Action', 'minLen'],
          rows: [
            ['0', '2', '2', 'No contract', 'INF'],
            ['1', '3', '5', 'No contract', 'INF'],
            ['2', '1', '6', 'No contract', 'INF'],
            ['3', '2', '8', '8 >= 7 -> minLen=4, left becomes 1 (sum=6)', '4'],
            ['4', '4', '10', '10 >= 7 -> minLen=3, left becomes 3 (sum=6)', '3'],
            ['5', '3', '9', '9 >= 7 -> minLen=2, left becomes 5 (sum=3)', '2']
          ],
          result: 'Optimal shortest length = 2 ([4, 3]) in O(2N) = O(N) Time and O(1) Space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Problem mentions "contiguous subarray" with fixed size K', bestApproach: 'Fixed-Size Sliding Window' },
      { trigger: 'Problem asks for "longest" or "shortest" subarray meeting dynamic criteria', bestApproach: 'Variable-Size Sliding Window (Two Pointers)' },
      { trigger: 'Subarray elements can be negative (breaks monotonicity of window shrinkage)', bestApproach: 'Prefix Sum + HashMap (Sliding Window will fail)' }
    ],

    pitfalls: [
      'Applying Sliding Window when array has negative numbers: Subarray sum is no longer monotonic with window expansion.',
      'Forgetting to reset or update window state during contraction loop.',
      'Off-by-one error when computing window length: Correct formula is `(right - left + 1)`.'
    ],

    complexity: [
      { operation: 'Fixed Window of Size K', time: 'O(N)', space: 'O(1)' },
      { operation: 'Variable Window (Expand/Contract)', time: 'O(N) (each index visited at most twice)', space: 'O(1)' },
      { operation: 'Window with Character Frequency Map', time: 'O(N)', space: 'O(min(N, Alphabet_Size))' }
    ]
  },

  'prefix-sum': {
    id: 'prefix-sum',
    title: 'Prefix Sum & Difference Arrays',
    subtitle: 'Accelerate range-sum queries to O(1) instantaneous time and manage multi-interval range updates with difference arrays.',
    category: 'Optimization Strategy',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '12 min read',
    overview: 'Prefix Sum precalculates cumulative cumulative sums up to each index. This allows any range query `sum(L, R)` to be evaluated in O(1) time using the arithmetic principle: `Prefix[R] - Prefix[L-1]`.',
    
    memoryModel: {
      title: 'Cumulative Sum Array & O(1) Range Decomposition',
      diagram: `
Original Array:    nums   = [  3 ,  1 ,  4 ,  1 ,  5 ,  9  ]   (Indices: 0..5)
Prefix Array:      prefix = [  3 ,  4 ,  8 ,  9 , 14 , 23  ]

To find sum from index L=2 to R=4 ([4, 1, 5]):
sum(2, 4) = prefix[4] - prefix[2 - 1]
          = prefix[4] - prefix[1]
          = 14 - 4 = 10
Proof: nums[2] + nums[3] + nums[4] = 4 + 1 + 5 = 10 (MATCH)
`,
      explanation: 'By spending O(N) time once during preprocessing, infinite subsequent range sum queries can be answered in O(1) constant time without looping.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: 1D Basic Prefix Sum & Range Query',
        recognition: 'Trigger: Multiple immutable range sum queries `(left, right)` on a static array.',
        mechanism: 'Create `prefix` array of size `N` (or `N+1` with 1-based indexing for cleaner boundary handling). `prefix[i] = prefix[i-1] + nums[i]`. Query formula: `prefix[R] - (L > 0 ? prefix[L-1] : 0)`.',
        asciiVisual: `
1-Indexed Prefix Array (Handles L=0 gracefully):
nums:      [  2 ,  3 , -1 ,  4  ]
prefix: [0 ,  2 ,  5 ,  4 ,  8  ]  (prefix[0] = 0)
Formula: sum(L, R) = prefix[R + 1] - prefix[L]
`,
        javaCode: `public class NumArray {
    private int[] prefix;
    
    public NumArray(int[] nums) {
        // Size N + 1 avoids boundary check for L = 0
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
        dryRunTrace: {
          input: 'nums = [2, 3, -1, 4], queries: sum(1, 3)',
          headers: ['Query Range [L, R]', 'prefix[R+1]', 'prefix[L]', 'Computation', 'Actual Range Sum'],
          rows: [
            ['sum(0, 2)', 'prefix[3] = 4', 'prefix[0] = 0', '4 - 0 = 4', '2 + 3 + (-1) = 4'],
            ['sum(1, 3)', 'prefix[4] = 8', 'prefix[1] = 2', '8 - 2 = 6', '3 + (-1) + 4 = 6'],
            ['sum(2, 2)', 'prefix[3] = 4', 'prefix[2] = 5', '4 - 5 = -1', 'nums[2] = -1']
          ],
          result: 'All range queries answered in O(1) time after O(N) precomputation.'
        }
      },
      {
        typeName: 'Sub-Type 2: Prefix Sum + Hash Map (Subarray Sum Equals K)',
        recognition: 'Trigger: Find the total number of continuous subarrays whose sum equals K in an array containing POSITIVE AND NEGATIVE numbers.',
        mechanism: 'Maintain a running cumulative sum `currentSum`. At each element, if `(currentSum - K)` exists in our frequency HashMap, it means there are that many valid prefix subarrays ending at the current index. Add the frequency to count.',
        asciiVisual: `
Equation: currentSum - previousPrefix = K  ==>  previousPrefix = currentSum - K
Map stores: { prefixSum : frequency }
`,
        javaCode: `public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1); // Base case: empty subarray has sum 0
    
    int count = 0;
    int currentSum = 0;
    
    for (int num : nums) {
        currentSum += num;
        
        // If (currentSum - k) was seen before, add its frequency
        if (map.containsKey(currentSum - k)) {
            count += map.get(currentSum - k);
        }
        
        // Record frequency of current prefix sum
        map.put(currentSum, map.getOrDefault(currentSum, 0) + 1);
    }
    return count;
}`,
        dryRunTrace: {
          input: 'nums = [1, -1, 1, 1, 1], k = 2',
          headers: ['num', 'currentSum', 'Needed (currentSum - 2)', 'Map State', 'Total count'],
          rows: [
            ['Init', '0', '-', '{0: 1}', '0'],
            ['1', '1', '1 - 2 = -1 (not in map)', '{0: 1, 1: 1}', '0'],
            ['-1', '0', '0 - 2 = -2 (not in map)', '{0: 2, 1: 1}', '0'],
            ['1', '1', '1 - 2 = -1 (not in map)', '{0: 2, 1: 2}', '0'],
            ['1', '2', '2 - 2 = 0 (exists with freq 2!)', '{0: 2, 1: 2, 2: 1}', 'count += 2 (Total: 2)'],
            ['1', '3', '3 - 2 = 1 (exists with freq 2!)', '{0: 2, 1: 2, 2: 1, 3: 1}', 'count += 2 (Total: 4)']
          ],
          result: 'Found all 4 subarrays summing to 2 in O(N) Time and O(N) Space.'
        }
      },
      {
        typeName: 'Sub-Type 3: Difference Array for Batch Range Updates',
        recognition: 'Trigger: Applying multiple range increments `[L, R] += val` on an array, then returning final values.',
        mechanism: 'Initialize a difference array `diff` of size N. For every update `(L, R, val)`: 1. `diff[L] += val` 2. If `R + 1 < N`, `diff[R + 1] -= val`. Finally, compute the prefix sum of `diff` to obtain the final array.',
        asciiVisual: `
Update [1, 3] by +5 on array of size 5:
diff: [ 0 , +5 , 0 , 0 , -5 ]
Prefix Reconstruction:
Index 0: 0
Index 1: 0 + 5 = 5
Index 2: 5 + 0 = 5
Index 3: 5 + 0 = 5
Index 4: 5 - 5 = 0  --> Final: [0, 5, 5, 5, 0] in O(1) per update!
`,
        javaCode: `public int[] applyRangeUpdates(int length, int[][] updates) {
    int[] diff = new int[length];
    
    // Step 1: Record boundary offsets in O(1) per update
    for (int[] u : updates) {
        int left = u[0], right = u[1], val = u[2];
        diff[left] += val;
        if (right + 1 < length) {
            diff[right + 1] -= val;
        }
    }
    
    // Step 2: Reconstruct final array via prefix sum in O(N)
    for (int i = 1; i < length; i++) {
        diff[i] += diff[i - 1];
    }
    return diff;
}`,
        dryRunTrace: {
          input: 'length = 5, updates = [[1, 3, 2], [2, 4, 3]]',
          headers: ['Step', 'diff array state', 'Explanation'],
          rows: [
            ['Update 1: [1, 3] +2', '[0, +2, 0, 0, -2]', 'diff[1]+=2, diff[4]-=2'],
            ['Update 2: [2, 4] +3', '[0, +2, +3, 0, -2]', 'diff[2]+=3, diff[5] out of bounds'],
            ['Prefix Reconstruction', '[0, 2, 5, 5, 3]', 'Running sum of diff produces exact result!']
          ],
          result: 'Batch interval updates completed in O(K + N) instead of O(K * N).'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Frequent range sum queries on immutable array', bestApproach: '1D / 2D Prefix Sum Array' },
      { trigger: 'Subarray sum equal to K with negative integers allowed', bestApproach: 'Prefix Sum + HashMap Frequency Counting' },
      { trigger: 'Multiple batch range additions [L, R] += val followed by final state lookup', bestApproach: 'Difference Array' }
    ],

    pitfalls: [
      'Using Prefix Sum on arrays that undergo frequent element updates: Every update takes O(N) to rebuild prefix array (Use Fenwick Tree / Segment Tree instead).',
      'Forgetting the base case `map.put(0, 1)` in Subarray Sum Equals K: Omitting this misses subarrays starting at index 0.',
      'Integer Overflow: Cumulative sums can easily exceed `Integer.MAX_VALUE` (use `long` when needed).'
    ],

    complexity: [
      { operation: 'Prefix Sum Precomputation', time: 'O(N)', space: 'O(N)' },
      { operation: 'Range Sum Query after preprocessing', time: 'O(1)', space: 'O(1)' },
      { operation: 'Subarray Sum Equals K (Hash Map)', time: 'O(N)', space: 'O(N)' },
      { operation: 'Difference Array Batch Range Update', time: 'O(1) per update', space: 'O(N)' }
    ]
  },

  'searching': {
    id: 'searching',
    title: 'Searching Algorithms & Monotonic Spaces',
    subtitle: 'From linear scans to binary search on value domains, lower/upper bounds, and invariant predicate functions.',
    category: 'Algorithms',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '13 min read',
    overview: 'Searching algorithms locate items in data collections. While Linear Search scans every element in O(N), Binary Search halves the remaining search space at every step in O(log N) by exploiting monotonicity.',
    
    memoryModel: {
      title: 'Logarithmic Search Space Halving',
      diagram: `
Sorted Array (Size N = 16):
Iteration 0: [----------------- 16 Elements -----------------]
Iteration 1: [-------- 8 Elements --------]
Iteration 2: [---- 4 Elements ----]
Iteration 3: [-- 2 Elements --]
Iteration 4: [ 1 ] -> Found! (log2(16) = 4 iterations maximum)
`,
      explanation: 'Binary Search reduces the candidate interval by 50% on every comparison. Even with 1 Billion elements, it finds the target in at most 30 steps.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Standard Binary Search on Exact Target',
        recognition: 'Trigger: Sorted array with unique elements where you need to return the exact index of target.',
        mechanism: 'Set `left = 0, right = arr.length - 1`. Calculate `mid = left + (right - left) / 2`. If `arr[mid] == target`, return `mid`. If `arr[mid] < target`, discard left half (`left = mid + 1`). Else discard right half (`right = mid - 1`).',
        asciiVisual: `
nums = [1, 3, 5, 7, 9, 11], target = 7
Step 1: left=0, right=5 -> mid=2 (val 5) < 7  --> left = 3
Step 2: left=3, right=5 -> mid=4 (val 9) > 7  --> right = 3
Step 3: left=3, right=3 -> mid=3 (val 7) == 7 --> MATCH at index 3!
`,
        javaCode: `public int binarySearch(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        // Safe midpoint to prevent (left + right) integer overflow
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;  // Target in right partition
        } else {
            right = mid - 1; // Target in left partition
        }
    }
    return -1; // Target not found
}`,
        dryRunTrace: {
          input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
          headers: ['Iteration', 'left', 'right', 'mid', 'nums[mid]', 'Action'],
          rows: [
            ['1', '0', '5', '2', 'nums[2] = 3', '3 < 9 -> left = mid + 1 = 3'],
            ['2', '3', '5', '4', 'nums[4] = 9', '9 == 9 -> Match! Return 4']
          ],
          result: 'Located in 2 iterations in O(log N) Time and O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Lower Bound & Upper Bound (First / Last Occurrence)',
        recognition: 'Trigger: Sorted array containing duplicate elements; find the starting or ending position of a target.',
        mechanism: 'When `nums[mid] == target`, instead of returning immediately, keep narrowing the search boundary. For First Occurrence (Lower Bound), set `right = mid - 1`. For Last Occurrence (Upper Bound), set `left = mid + 1`.',
        asciiVisual: `
Duplicate Array: [ 5 , 7 , 7 , 8 , 8 , 10 ], target = 8
Finding First 8:
When mid lands on 8 at index 4: record index 4, but set right = mid - 1 = 3 to check if earlier 8 exists.
`,
        javaCode: `public int findFirstOccurrence(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            result = mid;      // Record potential answer
            right = mid - 1;   // Force search to continue leftward
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}`,
        dryRunTrace: {
          input: 'nums = [2, 4, 4, 4, 7], target = 4',
          headers: ['Iter', 'left', 'right', 'mid', 'nums[mid]', 'result', 'Action'],
          rows: [
            ['1', '0', '4', '2', '4', '2', 'Match! result=2, right = mid-1 = 1'],
            ['2', '0', '1', '0', '2', '2', '2 < 4 -> left = mid+1 = 1'],
            ['3', '1', '1', '1', '4', '1', 'Match! result=1, right = mid-1 = 0'],
            ['4', '1', '0', '-', '-', '1', 'left > right -> loop terminates']
          ],
          result: 'First occurrence identified at index 1 in O(log N) time.'
        }
      },
      {
        typeName: 'Sub-Type 3: Binary Search on Answer Space (Predicate Invariants)',
        recognition: 'Trigger: Optimization problems phrased as "Find the minimum capacity / speed such that a task can be finished within D days".',
        mechanism: 'The answer lies within a continuous range `[minPossible, maxPossible]`. Create a helper function `canAchieve(speed)` which returns a boolean. Because `canAchieve` is monotonic (`F, F, F, T, T, T`), binary search finds the exact first `True`.',
        asciiVisual: `
Search Range for Eating Speed K: [ 1 , 2 , 3 , 4 , ... , MaxPile ]
Feasibility:                      F   F   F   T     T       T
                                              ^
                                  First Speed that Works (Binary Search Target)
`,
        javaCode: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = getMax(piles);
    int optimalSpeed = right;
    
    while (left <= right) {
        int midSpeed = left + (right - left) / 2;
        if (canFinish(piles, midSpeed, h)) {
            optimalSpeed = midSpeed; // Feasible -> try to find smaller speed
            right = midSpeed - 1;
        } else {
            left = midSpeed + 1;     // Too slow -> must increase speed
        }
    }
    return optimalSpeed;
}

private boolean canFinish(int[] piles, int speed, int h) {
    int totalHours = 0;
    for (int p : piles) {
        totalHours += (p + speed - 1) / speed; // Math.ceil(p / speed)
    }
    return totalHours <= h;
}
private int getMax(int[] arr) { int m = arr[0]; for(int x : arr) m = Math.max(m, x); return m; }`,
        dryRunTrace: {
          input: 'piles = [3, 6, 7, 11], h = 8',
          headers: ['left', 'right', 'midSpeed', 'canFinish?', 'optimalSpeed', 'Next Action'],
          rows: [
            ['1', '11', '6', 'Hours = 1+1+2+2 = 6 <= 8 (TRUE)', '6', 'right = 6 - 1 = 5'],
            ['1', '5', '3', 'Hours = 1+2+3+4 = 10 > 8 (FALSE)', '6', 'left = 3 + 1 = 4'],
            ['4', '5', '4', 'Hours = 1+2+2+3 = 8 <= 8 (TRUE)', '4', 'right = 4 - 1 = 3']
          ],
          result: 'Minimum valid speed found = 4 in O(N * log(MaxPile)) Time.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Target search in sorted array with duplicates', bestApproach: 'Lower / Upper Bound Binary Search' },
      { trigger: 'Find minimum/maximum value satisfying a monotonic condition', bestApproach: 'Binary Search on Answer Space' },
      { trigger: 'Array is sorted but rotated around unknown pivot', bestApproach: 'Modified Binary Search (Compare nums[mid] with nums[left])' }
    ],

    pitfalls: [
      'Integer Overflow in Mid calculation: `(left + right) / 2` overflows when `left + right > 2^31 - 1`. Always use `left + (right - left) / 2`.',
      'Infinite Loops: Forgetting `+1` or `-1` when updating boundaries (`left = mid` instead of `left = mid + 1`).',
      'Assuming Binary Search requires a physical array: It works on any monotonic mathematical function or domain.'
    ],

    complexity: [
      { operation: 'Linear Search', time: 'O(N)', space: 'O(1)' },
      { operation: 'Standard Binary Search', time: 'O(log N)', space: 'O(1)' },
      { operation: 'Binary Search on Answer Space', time: 'O(N * log(MaxVal))', space: 'O(1)' }
    ]
  },

  'sorting': {
    id: 'sorting',
    title: 'Sorting Algorithms & Invariants',
    subtitle: 'Deep-dive into divide-and-conquer, partition pivots, stability guarantees, and in-place elemental sorting.',
    category: 'Algorithms',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '13 min read',
    overview: 'Sorting reorders an array into non-decreasing order. Comparison sorts operate within an information-theoretic lower bound of O(N log N) worst-case time complexity.',
    
    memoryModel: {
      title: 'Divide & Conquer Recursion Tree (Merge Sort)',
      diagram: `
Level 0:                 [ 38 , 27 , 43 , 3 , 9 , 82 , 10 ]
                         /                                \\
Level 1:       [ 38 , 27 , 43 , 3 ]              [ 9 , 82 , 10 ]
               /                  \\               /            \\
Level 2:  [ 38 , 27 ]          [ 43 , 3 ]      [ 9 , 82 ]     [ 10 ]
          /        \\           /        \\      /        \\
Level 3: [38]      [27]       [43]      [3]   [9]       [82]
---------------------------------------------------------------------
Merge:   [ 27 , 38 ]          [ 3 , 43 ]      [ 9 , 82 ]      [ 10 ]
               \\                  /                \\            /
Merge:       [ 3 , 27 , 38 , 43 ]                [ 9 , 10 , 82 ]
                         \\                                /
Final:                   [ 3 , 9 , 10 , 27 , 38 , 43 , 82 ]
`,
      explanation: 'Tree height is strictly log₂(N) levels. At each level, merging takes O(N) linear time. Total Work = N * log₂(N).'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Merge Sort (Stable, Guaranteed O(N log N))',
        recognition: 'Trigger: Need guaranteed O(N log N) worst-case time and stability (preserving relative order of duplicate elements).',
        mechanism: 'Recursively split array into halves until base case of length <= 1. Then merge two sorted subarrays into an auxiliary array using two pointers, copying the merged result back.',
        asciiVisual: `
Merging [27, 38] and [3, 43]:
  p1 -> [27, 38]       p2 -> [3, 43]
  Compare 27 vs 3  -> Pick 3
  Compare 27 vs 43 -> Pick 27
  Compare 38 vs 43 -> Pick 38
  Remaining -> Pick 43
  Merged: [3, 27, 38, 43]
`,
        javaCode: `public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return; // Base case: 1 element
    
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);      // Sort left half
    mergeSort(arr, mid + 1, right);  // Sort right half
    merge(arr, left, mid, right);   // Merge sorted halves
}

private void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int p1 = left, p2 = mid + 1, k = 0;
    
    while (p1 <= mid && p2 <= right) {
        if (arr[p1] <= arr[p2]) { // <= ensures algorithm stability
            temp[k++] = arr[p1++];
        } else {
            temp[k++] = arr[p2++];
        }
    }
    while (p1 <= mid) temp[k++] = arr[p1++];
    while (p2 <= right) temp[k++] = arr[p2++];
    
    System.arraycopy(temp, 0, arr, left, temp.length);
}`,
        dryRunTrace: {
          input: 'arr = [4, 1, 3, 2]',
          headers: ['Phase', 'Left Half', 'Right Half', 'Merged Result'],
          rows: [
            ['Sub-merge 1', '[4]', '[1]', '[1, 4]'],
            ['Sub-merge 2', '[3]', '[2]', '[2, 3]'],
            ['Final Merge', '[1, 4]', '[2, 3]', '[1, 2, 3, 4]']
          ],
          result: 'Sorted in exactly O(N log N) time with O(N) auxiliary space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Quick Sort (In-Place Partitioning)',
        recognition: 'Trigger: High performance in-place sorting without O(N) extra memory allocation.',
        mechanism: 'Select a pivot element. Partition the array such that all elements < pivot are moved to the left, and elements > pivot to the right. Recursively sort the sub-partitions.',
        asciiVisual: `
Lomuto Partition with Pivot = 4:
[ 2 , 8 , 7 , 1 , 3 , (4) ]
                   ^ pivot
After Partition: [ 2 , 1 , 3 , (4) , 7 , 8 ]
                 <-- smaller -->  ^  <-- larger -->
`,
        javaCode: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

private int partition(int[] arr, int low, int high) {
    int pivot = arr[high]; // Lomuto pivot selection
    int i = low - 1; // Index of smaller element
    
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high); // Place pivot in final sorted slot
    return i + 1;
}
private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }`,
        dryRunTrace: {
          input: 'arr = [3, 1, 4, 2], pivot = 2 (arr[3])',
          headers: ['j index', 'arr[j]', 'Condition (arr[j] <= 2)', 'i index', 'Array State'],
          rows: [
            ['Init', '-', '-', 'i = -1', '[3, 1, 4, 2]'],
            ['j = 0', '3', '3 <= 2 (FALSE)', 'i = -1', '[3, 1, 4, 2]'],
            ['j = 1', '1', '1 <= 2 (TRUE)', 'i = 0 (swap arr[0], arr[1])', '[1, 3, 4, 2]'],
            ['j = 2', '4', '4 <= 2 (FALSE)', 'i = 0', '[1, 3, 4, 2]'],
            ['Final Swap', 'Pivot 2', 'swap(arr[i+1], arr[3])', 'i+1 = 1', '[1, 2, 4, 3]']
          ],
          result: 'Pivot 2 placed at index 1. Subarrays [1] and [4, 3] sorted recursively.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Stability is strictly required (e.g. sorting by secondary keys)', bestApproach: 'Merge Sort or TimSort' },
      { trigger: 'Memory is severely restricted and average speed is paramount', bestApproach: 'Quick Sort or Heap Sort (O(1) auxiliary space)' },
      { trigger: 'Small array size (N < 50) or nearly sorted input', bestApproach: 'Insertion Sort (O(N) adaptive runtime)' }
    ],

    pitfalls: [
      'QuickSort Worst-Case O(N²): Happens when pivot is always min/max (e.g., already sorted array). Mitigate using randomized pivot selection.',
      'Unstable partitioning: Swapping elements across long distances makes standard QuickSort unstable.',
      'Memory Overhead of Merge Sort: Allocating new arrays inside every recursive call without reusing buffer leads to GC overhead.'
    ],

    complexity: [
      { operation: 'Merge Sort', time: 'Best: O(N log N) | Worst: O(N log N)', space: 'O(N)' },
      { operation: 'Quick Sort', time: 'Best: O(N log N) | Worst: O(N²)', space: 'O(log N) stack' },
      { operation: 'Insertion Sort', time: 'Best: O(N) | Worst: O(N²)', space: 'O(1)' }
    ]
  },

  'strings': {
    id: 'strings',
    title: 'Strings & Character Encoding',
    subtitle: 'Master String immutability, the JVM String Constant Pool, ASCII direct-address hashing, and palindromic expansion.',
    category: 'Foundations',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '10 min read',
    overview: 'In Java, `String` objects are immutable byte arrays stored inside the JVM String Constant Pool. String concatenation inside loops creates O(N²) quadratic garbage unless `StringBuilder` is used.',
    
    memoryModel: {
      title: 'String Pool vs StringBuilder Mutation',
      diagram: `
String Concatenation in Loop (ANTI-PATTERN):
  String s = ""
  s += 'a'  -> creates new String object "a"
  s += 'b'  -> creates new String object "ab", discards "a"
  Total Copying Work = 1 + 2 + 3 + ... + N = O(N²) TIME!

StringBuilder (OPTIMAL):
  StringBuilder sb = new StringBuilder()
  sb.append('a') -> writes byte directly into expandable char buffer
  sb.append('b') -> writes in O(1) amortized time. Total = O(N) TIME!
`,
      explanation: 'Using `StringBuilder` modifies the internal char array buffer directly without allocating new objects for each character.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Direct-Address Frequency Hashing (`int[26]` / `int[128]`)',
        recognition: 'Trigger: Anagram checks, counting character frequencies, or verifying character permutations.',
        mechanism: 'Instead of an expensive `HashMap<Character, Integer>`, allocate an integer array `int[26] freq`. Access index via ASCII subtraction: `c - \'a\'` in O(1) time without boxing overhead.',
        asciiVisual: `
'c' - 'a' = 99 - 97 = Index 2
'z' - 'a' = 122 - 97 = Index 25
freq array: [ freq('a') , freq('b') , freq('c') , ... , freq('z') ]
`,
        javaCode: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    
    int[] count = new int[26];
    
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++; // Increment for s
        count[t.charAt(i) - 'a']--; // Decrement for t
    }
    
    // If anagrams, all frequencies must balance to exactly 0
    for (int c : count) {
        if (c != 0) return false;
    }
    return true;
}`,
        dryRunTrace: {
          input: 's = "rat", t = "car"',
          headers: ['Character pair', 's.charAt(i)', 't.charAt(i)', 'count array impact'],
          rows: [
            ['i = 0', "'r'", "'c'", "count['r'-'a']++, count['c'-'a']--"],
            ['i = 1', "'a'", "'a'", "count['a'-'a']++ and -- (cancels to 0)"],
            ['i = 2', "'t'", "'r'", "count['t'-'a']++, count['r'-'a']-- (r balances to 0, but c=-1, t=+1)"],
            ['Check', '-', '-', "c is -1 != 0 -> Returns FALSE!"]
          ],
          result: 'Anagram validation in O(N) Time and O(1) [26 bytes] Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Expand Around Center (Palindromes)',
        recognition: 'Trigger: Finding longest palindromic substring or counting total palindromic substrings.',
        mechanism: 'A palindrome mirrors around its center. There are 2N - 1 possible centers (N single-character centers like `"aba"` and N - 1 two-character centers like `"abba"`). Expand outward while `s[left] == s[right]`.',
        asciiVisual: `
Odd Center (Single Char):     "a   b   a"
                                  <-^-> (center 'b')

Even Center (Between Chars):  "a   b   b   a"
                                  <-^ ^-> (center 'bb')
`,
        javaCode: `public String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    int start = 0, end = 0;
    
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);     // Odd length center
        int len2 = expandAroundCenter(s, i, i + 1); // Even length center
        int maxLen = Math.max(len1, len2);
        
        if (maxLen > end - start) {
            start = i - (maxLen - 1) / 2;
            end = i + maxLen / 2;
        }
    }
    return s.substring(start, end + 1);
}

private int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1; // Actual length of palindrome
}`,
        dryRunTrace: {
          input: 's = "babad"',
          headers: ['Center Index i', 'Odd Expansion', 'Even Expansion', 'Max Length Found', 'Current Substring'],
          rows: [
            ['i = 0 (\'b\')', 'expand(0,0) -> "b" (len 1)', 'expand(0,1) -> 0', '1', '"b"'],
            ['i = 1 (\'a\')', 'expand(1,1) -> "bab" (len 3)', 'expand(1,2) -> 0', '3', '"bab"'],
            ['i = 2 (\'b\')', 'expand(2,2) -> "aba" (len 3)', 'expand(2,3) -> 0', '3', '"bab" (tied)'],
            ['i = 3 (\'a\')', 'expand(3,3) -> "a" (len 1)', 'expand(3,4) -> 0', '3', '"bab"']
          ],
          result: 'Longest Palindrome identified as "bab" in O(N²) Time and O(1) Space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Count anagrams, character frequencies, or character subsets', bestApproach: 'Direct-Address `int[26]` Array' },
      { trigger: 'Palindromic substring detection', bestApproach: 'Expand Around Center O(N²) or Manacher\'s Algorithm O(N)' },
      { trigger: 'String concatenation inside loops', bestApproach: 'Always use StringBuilder' }
    ],

    pitfalls: [
      'Using `==` to compare Strings: `s1 == s2` compares memory object addresses, NOT character contents. Always use `s1.equals(s2)`.',
      'Forgetting that `String.length()` is a method call with parentheses, while arrays use `.length`.',
      'Modifying String in recursive calls without StringBuilder or char arrays.'
    ],

    complexity: [
      { operation: 'Character Access `s.charAt(i)`', time: 'O(1)', space: 'O(1)' },
      { operation: 'String Equality `s1.equals(s2)`', time: 'O(N)', space: 'O(1)' },
      { operation: 'StringBuilder Append', time: 'O(1) amortized', space: 'O(1)' },
      { operation: 'Substring Extraction `s.substring(i, j)`', time: 'O(K)', space: 'O(K)' }
    ]
  },

  '2d-arrays': {
    id: '2d-arrays',
    title: '2D Arrays & Matrix Traversals',
    subtitle: 'Row-major memory flattening, layer-by-layer spiral navigation, and 4-directional coordinate delta offsets.',
    category: 'Foundations',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '11 min read',
    overview: 'In Java, a 2D Array is an array of array references (`int[][]`). Memory is allocated in Row-Major order, where each row object is indexed sequentially as `matrix[row][col]`.',
    
    memoryModel: {
      title: 'Row-Major Flattening Formula',
      diagram: `
Matrix 2x3:
Row 0: [ A , B , C ]
Row 1: [ D , E , F ]

Flattened 1D Equivalent Index Formula: Index = (Row * TotalCols) + Col
  matrix[1][2] ('F') with TotalCols = 3:
  1D Index = (1 * 3) + 2 = 5 -> [ A , B , C , D , E , (F) ]

Reverse Mapping (1D to 2D):
  Row = Index / TotalCols   (5 / 3 = 1)
  Col = Index % TotalCols   (5 % 3 = 2)
`,
      explanation: 'Flattening formulas allow converting 2D matrix coordinates into 1D arrays for binary searching in sorted matrices.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Layer-by-Layer Boundary Shrink (Spiral Matrix)',
        recognition: 'Trigger: Traverse or fill a matrix in clockwise spiral order.',
        mechanism: 'Maintain 4 boundary markers: `top = 0, bottom = R-1, left = 0, right = C-1`. Traverse Top row (L->R), Right column (T->B), Bottom row (R->L), and Left column (B->T). Contract boundaries after each direction.',
        asciiVisual: `
[ top, left ] ----> Top Row (L->R) ----> [ top, right ]
      ^                                          |
      |                                          v
 Left Col (B->T)                           Right Col (T->B)
      ^                                          |
      |                                          v
[ bottom, left ] <--- Bottom Row (R->L) <--- [ bottom, right ]
`,
        javaCode: `public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    if (matrix.length == 0) return res;
    
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // 1. Traverse Right along Top row
        for (int c = left; c <= right; c++) res.add(matrix[top][c]);
        top++;
        
        // 2. Traverse Down along Right col
        for (int r = top; r <= bottom; r++) res.add(matrix[r][right]);
        right--;
        
        // 3. Traverse Left along Bottom row (guard check)
        if (top <= bottom) {
            for (int c = right; c >= left; c--) res.add(matrix[bottom][c]);
            bottom--;
        }
        
        // 4. Traverse Up along Left col (guard check)
        if (left <= right) {
            for (int r = bottom; r >= top; r--) res.add(matrix[r][left]);
            left++;
        }
    }
    return res;
}`,
        dryRunTrace: {
          input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]',
          headers: ['Step', 'Direction', 'Elements Added', 'New Boundaries'],
          rows: [
            ['1', 'Top Row (left..right)', '1, 2, 3', 'top = 1'],
            ['2', 'Right Col (top..bottom)', '6, 9', 'right = 1'],
            ['3', 'Bottom Row (right..left)', '8, 7', 'bottom = 1'],
            ['4', 'Left Col (bottom..top)', '4', 'left = 1'],
            ['5', 'Inner Center', '5', 'top > bottom (halt)']
          ],
          result: 'Spiral order [1,2,3,6,9,8,7,4,5] produced in O(R*C) Time.'
        }
      },
      {
        typeName: 'Sub-Type 2: 4-Directional Coordinate Delta Navigation',
        recognition: 'Trigger: Grid traversal, pathfinding, or connected component scans (Number of Islands, Word Search).',
        mechanism: 'Define directional displacement vectors `int[] dr = {-1, 1, 0, 0}` and `int[] dc = {0, 0, -1, 1}` (Up, Down, Left, Right). Loop `k = 0..3` to calculate `newRow = r + dr[k]` and `newCol = c + dc[k]`. Check bounds.',
        asciiVisual: `
         [-1, 0] UP
            ^
[-1, 0]     |     [0, 1]
 LEFT <-- [r, c] --> RIGHT
            |
            v
         [1, 0] DOWN
`,
        javaCode: `// 4-Directional Boundary-Safe Neighbor Traversal
private static final int[][] DIRS = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

public void exploreNeighbors(int[][] grid, int r, int c) {
    int rows = grid.length;
    int cols = grid[0].length;
    
    for (int[] dir : DIRS) {
        int nr = r + dir[0];
        int nc = c + dir[1];
        
        // Boundary Guard Check
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            // Safe to access grid[nr][nc]
            System.out.println("Valid Neighbor: " + grid[nr][nc]);
        }
    }
}`,
        dryRunTrace: {
          input: 'At cell [0, 0] in 3x3 matrix',
          headers: ['Direction', 'nr, nc Calculation', 'In-Bounds Check', 'Action'],
          rows: [
            ['UP', '0 + (-1) = -1, 0', '-1 >= 0 (FALSE -> Out of bounds)', 'Skip'],
            ['DOWN', '0 + 1 = 1, 0', '1 < 3 (TRUE)', 'Visit grid[1][0]'],
            ['LEFT', '0, 0 + (-1) = -1', '-1 >= 0 (FALSE -> Out of bounds)', 'Skip'],
            ['RIGHT', '0, 0 + 1 = 1', '1 < 3 (TRUE)', 'Visit grid[0][1]']
          ],
          result: 'Safely inspected only valid adjacent neighbors without indexing exceptions.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Matrix is row-wise and column-wise sorted', bestApproach: 'Start search at Top-Right `matrix[0][C-1]` or Bottom-Left' },
      { trigger: 'Rotate matrix 90 degrees clockwise in-place', bestApproach: 'Transpose Matrix (swap `m[i][j]` with `m[j][i]`), then Reverse each Row' },
      { trigger: 'Connected components or area calculations in a grid', bestApproach: '4-Directional DFS/BFS with Visited Matrix' }
    ],

    pitfalls: [
      'Inverting Row and Col Indices: Writing `matrix[c][r]` instead of `matrix[r][c]`.',
      'Forgetting Jagged Array Edge Cases: Checking `matrix.length` (rows) but omitting `matrix[0].length` (cols) when array is empty.',
      'O-by-One in Spiral Boundary checks: Forgetting the `if (top <= bottom)` guard before traversing left/up causes duplicate row printing on non-square matrices.'
    ],

    complexity: [
      { operation: 'Direct Cell Read `matrix[r][c]`', time: 'O(1)', space: 'O(1)' },
      { operation: 'Full Matrix Traversal', time: 'O(R * C)', space: 'O(1)' },
      { operation: 'Matrix Rotation 90° In-Place', time: 'O(R * C)', space: 'O(1)' }
    ]
  },

  'recursion': {
    id: 'recursion',
    title: 'Recursion & Backtracking Invariants',
    subtitle: 'Master JVM call stack activation frames, tree recursion branching, and state-space backtracking (Choose -> Explore -> Unchoose).',
    category: 'Algorithms',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '13 min read',
    overview: 'Recursion is a computational paradigm where a function solves a problem by calling copies of itself on strictly smaller subproblems until hitting a Base Case. Backtracking explores state trees by undoing state changes during stack unwinding.',
    
    memoryModel: {
      title: 'JVM Call Stack Activation Record Frames',
      diagram: `
Calculating Factorial(3):
Stack Frame 3: fact(1) -> hits Base Case, returns 1          [POPPED]
Stack Frame 2: fact(2) -> waiting for fact(1): 2 * 1 = 2     [POPPED]
Stack Frame 1: fact(3) -> waiting for fact(2): 3 * 2 = 6     [POPPED]
---------------------------------------------------------------------
Stack Overflow occurs if recursion depth exceeds available stack memory
(Default JVM stack size = ~1MB, approx 10,000 recursive frames).
`,
      explanation: 'Every recursive call pushes local variables and return program counter onto the Call Stack. Missing base cases cause StackOverflowError.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Backtracking State Exploration (Subsets & Combinations)',
        recognition: 'Trigger: "Generate all combinations", "Find all valid subsets", or "Sudoku / N-Queens solver".',
        mechanism: 'Follow the 3-Step Invariant: 1. CHOOSE (Add candidate to current path), 2. EXPLORE (Recurse to next depth), 3. UNCHOOSE / BACKTRACK (Remove candidate from path to restore previous state).',
        asciiVisual: `
Decision Tree for Subsets of [1, 2]:
                      []
                 /          \\
            Include 1       Exclude 1
             [ 1 ]             []
            /     \\          /    \\
        Inc 2    Exc 2    Inc 2  Exc 2
       [1, 2]    [ 1 ]    [ 2 ]   []
`,
        javaCode: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(0, nums, new ArrayList<>(), result);
    return result;
}

private void backtrack(int start, int[] nums, List<Integer> currentPath, List<List<Integer>> result) {
    // Add a deep copy of current state to result
    result.add(new ArrayList<>(currentPath));
    
    for (int i = start; i < nums.length; i++) {
        // 1. CHOOSE
        currentPath.add(nums[i]);
        
        // 2. EXPLORE
        backtrack(i + 1, nums, currentPath, result);
        
        // 3. UNCHOOSE (Backtrack to clean state for next loop iteration)
        currentPath.remove(currentPath.size() - 1);
    }
}`,
        dryRunTrace: {
          input: 'nums = [1, 2]',
          headers: ['Call Level', 'start', 'currentPath', 'Action', 'result snapshot'],
          rows: [
            ['Level 0', '0', '[]', 'Add [] to result', '[[]]'],
            ['Level 1', '0', '[1]', 'Add [1] to result', '[[], [1]]'],
            ['Level 2', '1', '[1, 2]', 'Add [1, 2] to result', '[[], [1], [1, 2]]'],
            ['Backtrack', '-', 'remove(2) -> [1]', 'Loop i=1 finishes', '-'],
            ['Level 1 (i=1)', '1', '[2]', 'Add [2] to result', '[[], [1], [1, 2], [2]]']
          ],
          result: 'All 2^N = 4 subsets generated systematically.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Problem requires generating all permutations, subsets, or valid board configurations', bestApproach: 'Backtracking with Choose-Explore-Unchoose' },
      { trigger: 'Problem has optimal substructure and overlapping subproblems', bestApproach: 'Recursion + Memoization (Dynamic Programming)' },
      { trigger: 'Linear recursion with deep stack depth', bestApproach: 'Convert to Iterative loop using explicit Stack to prevent overflow' }
    ],

    pitfalls: [
      'Missing Base Case: Triggers infinite recursion and terminates with `StackOverflowError`.',
      'Forgetting to create a copy when adding to results: `result.add(currentPath)` will add references that will be empty at the end. Must do `result.add(new ArrayList<>(currentPath))`.',
      'Omitting the Unchoose/Backtrack step: Corrupts state for parallel recursion branches.'
    ],

    complexity: [
      { operation: 'Subsets Generation', time: 'O(2^N * N)', space: 'O(N) stack' },
      { operation: 'Permutations Generation', time: 'O(N! * N)', space: 'O(N) stack' },
      { operation: 'Binary Search Recursion', time: 'O(log N)', space: 'O(log N) stack' }
    ]
  },

  'monotonic-stack': {
    id: 'monotonic-stack',
    title: 'Monotonic Stack & Queue Invariants',
    subtitle: 'Master strict order invariant stacks to solve Next Greater Element, Histogram Areas, and Stock Spans in O(N).',
    category: 'Advanced Data Structures',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '12 min read',
    overview: 'A Monotonic Stack is a stack whose elements are strictly sorted in either monotonically increasing or decreasing order. Whenever an incoming element violates the monotonicity invariant, elements are popped and resolved in O(N) linear aggregate time.',
    
    memoryModel: {
      title: 'Monotonic Decreasing Stack for Next Greater Element',
      diagram: `
Array: [ 2 , 1 , 2 , 4 , 3 ]
Stack stores indices/values in decreasing order from bottom to top:

Step 1: Push 2 -> Stack: [ 2 ]
Step 2: Push 1 -> Stack: [ 2, 1 ] (1 < 2, Invariant holds)
Step 3: Encounter 2! 2 > 1 (Violates decreasing order!)
        -> POP 1: The Next Greater Element for 1 is 2!
        -> Push 2: Stack: [ 2, 2 ]
Step 4: Encounter 4! 4 > 2
        -> POP 2: Next Greater for 2 is 4
        -> POP 2: Next Greater for 2 is 4
        -> Push 4: Stack: [ 4 ]
`,
      explanation: 'Every element is pushed exactly once and popped at most once. Hence, total operations across entire array is strictly 2N = O(N) Time.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Next Greater Element (Decreasing Stack)',
        recognition: 'Trigger: "Find the nearest element greater than nums[i] to its right/left for every element".',
        mechanism: 'Maintain a stack of indices. When encountering `nums[i] > nums[stack.peek()]`, pop index and record `result[poppedIndex] = nums[i]`. Push `i`. Any elements remaining in stack at the end have no greater element (-1).',
        asciiVisual: `
nums = [4, 5, 2, 10, 8]
Stack: [ 4 ] -> sees 5 -> pop 4 (next greater = 5) -> push 5
Stack: [ 5 ] -> sees 2 -> push 2 -> Stack: [ 5, 2 ]
Stack: [ 5, 2 ] -> sees 10 -> pop 2 (ans 10), pop 5 (ans 10) -> push 10
Stack: [ 10 ] -> sees 8 -> push 8 -> Stack: [ 10, 8 ]
Remaining 10 and 8 get -1.
`,
        javaCode: `public int[] nextGreaterElements(int[] nums) {
    int[] result = new int[nums.length];
    Arrays.fill(result, -1);
    
    Deque<Integer> stack = new ArrayDeque<>(); // Stores indices
    
    for (int i = 0; i < nums.length; i++) {
        // While stack not empty and current element is strictly greater
        while (!stack.isEmpty() && nums[i] > nums[stack.peek()]) {
            int poppedIndex = stack.pop();
            result[poppedIndex] = nums[i]; // Resolved!
        }
        stack.push(i);
    }
    return result;
}`,
        dryRunTrace: {
          input: 'nums = [2, 1, 3]',
          headers: ['Index i', 'nums[i]', 'Stack before', 'while(nums[i] > nums[top]) action', 'Result array'],
          rows: [
            ['0', '2', '[]', 'Stack empty -> push 0', '[-1, -1, -1]'],
            ['1', '1', '[0 (val 2)]', '1 > 2 (FALSE) -> push 1', '[-1, -1, -1]'],
            ['2', '3', '[1 (val 1), 0 (val 2)]', '3 > 1 -> pop 1, ans[1]=3; 3 > 2 -> pop 0, ans[0]=3; push 2', '[3, 3, -1]']
          ],
          result: 'All next greater elements resolved in O(N) Time and O(N) Space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Find next greater / previous greater element', bestApproach: 'Monotonic Decreasing Stack' },
      { trigger: 'Find next smaller / previous smaller element (e.g. Largest Rectangle in Histogram)', bestApproach: 'Monotonic Increasing Stack' },
      { trigger: 'Sliding window maximum / minimum', bestApproach: 'Monotonic Decreasing Deque' }
    ],

    pitfalls: [
      'Storing values instead of indices: Storing indices is strictly superior because it allows computing distances `(i - poppedIndex)` as well as values.',
      'Using legacy `java.util.Stack`: Use `ArrayDeque` instead because `Stack` extends `Vector` and carries synchronization lock overhead.',
      'Assuming nested while loop makes it O(N²): Amortized analysis proves total pushes and pops are capped at 2N.'
    ],

    complexity: [
      { operation: 'Next Greater Element', time: 'O(N)', space: 'O(N)' },
      { operation: 'Daily Temperatures', time: 'O(N)', space: 'O(N)' },
      { operation: 'Largest Rectangle in Histogram', time: 'O(N)', space: 'O(N)' }
    ]
  },

  'linked-list': {
    id: 'linked-list',
    title: 'Linked Lists & Pointer Manipulation',
    subtitle: 'Master non-contiguous heap node chains, sentinel dummy heads, 3-pointer reversals, and Floyd\'s cycle detection.',
    category: 'Foundations',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '11 min read',
    overview: 'A Linked List is a linear data structure where elements are not stored in contiguous memory locations. Each node object contains a data field and a reference pointer to the next node on the heap.',
    
    memoryModel: {
      title: 'Dispersed Heap Nodes & Pointer Links',
      diagram: `
Node 1 (at 0x2040): [ Val: 10 | Next: 0x5120 ] ----+
                                                   |
Node 2 (at 0x5120): [ Val: 20 | Next: 0x1080 ] <--+
                                                   |
Node 3 (at 0x1080): [ Val: 30 | Next: null   ] <--+
`,
      explanation: 'Because nodes are scattered across the heap, random access `list[i]` is impossible in O(1). Finding the i-th element requires O(N) pointer traversals.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: Sentinel / Dummy Head Node Pattern',
        recognition: 'Trigger: Modifying head of linked list (deletions, insertions, merging two lists, partitioning).',
        mechanism: 'Instantiate `ListNode dummy = new ListNode(0); dummy.next = head;`. Perform operations using `curr` pointer. Always return `dummy.next`. This eliminates all special-case null checks for the head.',
        asciiVisual: `
Remove Val 1 from list: 1 -> 2 -> 3
Without dummy: Need special if (head.val == 1) head = head.next
With dummy:    [Dummy: 0] -> [1] -> [2] -> [3]
               dummy.next = dummy.next.next -> [Dummy] -> [2] -> [3]
               return dummy.next (points cleanly to [2])
`,
        javaCode: `public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    
    ListNode curr = dummy;
    while (curr.next != null) {
        if (curr.next.val == val) {
            curr.next = curr.next.next; // Bypass deleted node
        } else {
            curr = curr.next;           // Advance forward
        }
    }
    return dummy.next;
}`,
        dryRunTrace: {
          input: 'head = [1, 2, 6, 3, 6], val = 6',
          headers: ['curr node', 'curr.next.val', 'Condition (val == 6)', 'Action'],
          rows: [
            ['Dummy(0)', '1', '1 == 6 (FALSE)', 'curr = curr.next (at 1)'],
            ['Node(1)', '2', '2 == 6 (FALSE)', 'curr = curr.next (at 2)'],
            ['Node(2)', '6', '6 == 6 (TRUE)', 'curr.next = curr.next.next (skip first 6)'],
            ['Node(2)', '3', '3 == 6 (FALSE)', 'curr = curr.next (at 3)'],
            ['Node(3)', '6', '6 == 6 (TRUE)', 'curr.next = null (skip second 6)']
          ],
          result: 'Clean list [1, 2, 3] returned via dummy.next without NullPointerExceptions.'
        }
      },
      {
        typeName: 'Sub-Type 2: In-Place 3-Pointer Node Reversal',
        recognition: 'Trigger: Reversing entire linked list or reversing in K-groups with O(1) memory.',
        mechanism: 'Maintain three pointers: `prev = null, curr = head, nextTemp = null`. In each iteration: 1. `nextTemp = curr.next`, 2. `curr.next = prev`, 3. `prev = curr`, 4. `curr = nextTemp`. Return `prev`.',
        asciiVisual: `
Initial: null <- prev    curr -> [ 1 ] -> [ 2 ] -> [ 3 ] -> null
Step 1:  null <- [ 1 ] <- prev   curr -> [ 2 ] -> [ 3 ] -> null
Step 2:  null <- [ 1 ] <- [ 2 ] <- prev  curr -> [ 3 ] -> null
Final:   null <- [ 1 ] <- [ 2 ] <- [ 3 ] <- prev (Return prev as new Head)
`,
        javaCode: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode nextTemp = curr.next; // Save forward link
        curr.next = prev;              // Invert link to point backward
        prev = curr;                   // Advance prev
        curr = nextTemp;               // Advance curr
    }
    return prev; // New head of reversed list
}`,
        dryRunTrace: {
          input: 'head = [1, 2, 3]',
          headers: ['Step', 'curr.val', 'curr.next rewired to', 'prev becomes', 'curr becomes'],
          rows: [
            ['1', '1', 'null', 'Node(1)', 'Node(2)'],
            ['2', '2', 'Node(1)', 'Node(2)', 'Node(3)'],
            ['3', '3', 'Node(2)', 'Node(3)', 'null (Loop terminates)']
          ],
          result: 'List reversed [3 -> 2 -> 1 -> null] in O(N) Time and O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 3: Floyd\'s Tortoise and Hare (Fast & Slow Pointers)',
        recognition: 'Trigger: Cycle detection in linked list or finding exact middle node in single pass.',
        mechanism: '`slow` moves 1 step (`slow = slow.next`), `fast` moves 2 steps (`fast = fast.next.next`). If `fast` and `slow` meet, a cycle exists. If `fast` reaches null, slow is at the exact midpoint.',
        asciiVisual: `
Cycle Detection:
[ 1 ] -> [ 2 ] -> [ 3 ] -> [ 4 ]
                   ^         |
                   +---------+
Fast travels at 2x relative speed; within cycle, the distance between Fast and Slow decreases by 1 node per iteration until meeting.
`,
        javaCode: `public boolean hasCycle(ListNode head) {
    if (head == null || head.next == null) return false;
    
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1 step
        fast = fast.next.next;    // 2 steps
        
        if (slow == fast) {
            return true; // Pointers collided -> Cycle confirmed!
        }
    }
    return false; // Reached end -> No cycle
}`,
        dryRunTrace: {
          input: 'List with cycle: 1 -> 2 -> 3 -> 4 -> (back to 2)',
          headers: ['Step', 'slow at node', 'fast at node', 'slow == fast?'],
          rows: [
            ['Init', 'Node 1', 'Node 1', 'Equal (start)'],
            ['Step 1', 'Node 2', 'Node 3', 'No'],
            ['Step 2', 'Node 3', 'Node 2 (looped)', 'No'],
            ['Step 3', 'Node 4', 'Node 4', 'YES! Cycle detected.']
          ],
          result: 'Cycle identified in O(N) Time and O(1) Auxiliary Space.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Modifying head of linked list or merging lists', bestApproach: 'Sentinel Dummy Node `new ListNode(0)`' },
      { trigger: 'Find midpoint or detect loop in linked list', bestApproach: 'Floyd\'s Fast & Slow Pointers' },
      { trigger: 'Reverse list or sub-segment', bestApproach: '3-Pointer In-Place Reversal' }
    ],

    pitfalls: [
      'NullPointerException on `fast.next.next`: Always check both `fast != null && fast.next != null` in while loop condition.',
      'Losing Reference to Next Node during Reversal: Must save `ListNode nextTemp = curr.next` BEFORE rewiring `curr.next = prev`.',
      'Memory Leaks: Creating circular references unintentionally when manipulating node pointers.'
    ],

    complexity: [
      { operation: 'Insert / Delete at Head', time: 'O(1)', space: 'O(1)' },
      { operation: 'Random Lookup by Index k', time: 'O(N)', space: 'O(1)' },
      { operation: 'List In-Place Reversal', time: 'O(N)', space: 'O(1)' },
      { operation: 'Cycle Detection (Floyd\'s)', time: 'O(N)', space: 'O(1)' }
    ]
  },

  'bit-manipulation': {
    id: 'bit-manipulation',
    title: 'Bit Manipulation & Binary Arithmetic',
    subtitle: 'Master binary representation, bitwise operators (&, |, ^, ~, <<, >>), XOR cancellation, and Brian Kernighan\'s algorithm.',
    category: 'Foundations',
    author: 'LearnPath AI DSA Expert Council',
    readTime: '10 min read',
    overview: 'Bit Manipulation operates directly on binary digit bits (0s and 1s) at the hardware level. Bitwise operations execute in 1 CPU clock cycle and provide ultra-fast constant time solutions.',
    
    memoryModel: {
      title: 'Fundamental Bitwise Operator Truth Table',
      diagram: `
+---+---+-------+------+-------+-------+
| A | B | A & B | A|B  | A ^ B |  ~A   |
+---+---+-------+------+-------+-------+
| 0 | 0 |   0   |  0   |   0   |   1   |
| 0 | 1 |   0   |  1   |   1   |   1   |
| 1 | 0 |   0   |  1   |   1   |   0   |
| 1 | 1 |   1   |  1   |   0   |   0   |
+---+---+-------+------+-------+-------+

XOR Magic Properties:
  1. Identity:      x ^ 0 = x
  2. Self-Inverse:  x ^ x = 0
  3. Commutative:   a ^ b ^ a = (a ^ a) ^ b = 0 ^ b = b
`,
      explanation: 'XOR self-cancellation enables finding unique non-duplicate elements in O(N) time and O(1) space.'
    },

    subtypes: [
      {
        typeName: 'Sub-Type 1: XOR Pair Cancellation (Single Number)',
        recognition: 'Trigger: Every element appears twice except one unique element; find the unique element in O(1) space.',
        mechanism: 'XOR all numbers together. All pairs cancel out to 0 (`x ^ x = 0`), leaving only the single non-paired number.',
        asciiVisual: `
nums = [4, 1, 2, 1, 2]
XOR Chain: 4 ^ 1 ^ 2 ^ 1 ^ 2
Reorder:   4 ^ (1 ^ 1) ^ (2 ^ 2)
Evaluate:  4 ^ 0 ^ 0 = 4 (Single Number Isolated!)
`,
        javaCode: `public int singleNumber(int[] nums) {
    int unique = 0;
    for (int num : nums) {
        unique ^= num; // XOR accumulator
    }
    return unique;
}`,
        dryRunTrace: {
          input: 'nums = [2, 3, 2]',
          headers: ['Step', 'num', 'unique (Binary)', 'Operation', 'New unique'],
          rows: [
            ['Init', '-', '0000_0000 (0)', '-', '0'],
            ['1', '2', '0000_0000 ^ 0000_0010', '0 ^ 2', '2 (0010)'],
            ['2', '3', '0000_0010 ^ 0000_0011', '2 ^ 3', '1 (0001)'],
            ['3', '2', '0000_0001 ^ 0000_0010', '1 ^ 2', '3 (0011)']
          ],
          result: 'Resolved single number = 3 in O(N) Time and O(1) Space.'
        }
      },
      {
        typeName: 'Sub-Type 2: Brian Kernighan\'s Set Bit Counting (`n & (n - 1)`)',
        recognition: 'Trigger: Count total number of 1-bits (Hamming Weight) or test if an integer is a power of two.',
        mechanism: 'The operation `n & (n - 1)` always clears the lowest set bit (rightmost 1) of `n`. Repeat until `n == 0`. Loop runs exactly K times where K is number of set bits (much faster than 32 full bit shifts).',
        asciiVisual: `
n = 12:      1 1 0 0
n - 1 = 11:  1 0 1 1
--------------------
n & (n-1):   1 0 0 0  (Lowest 1-bit cleared in 1 step!)
`,
        javaCode: `public int countSetBits(int n) {
    int count = 0;
    while (n != 0) {
        n = n & (n - 1); // Erase rightmost set bit
        count++;
    }
    return count;
}

// Check Power of Two Invariant: Exactly one set bit!
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}`,
        dryRunTrace: {
          input: 'n = 11 (Binary: 1011)',
          headers: ['Iteration', 'n before', 'n - 1', 'n & (n - 1)', 'count'],
          rows: [
            ['1', '11 (1011)', '10 (1010)', '10 (1010)', '1'],
            ['2', '10 (1010)', '9 (1001)', '8 (1000)', '2'],
            ['3', '8 (1000)', '7 (0111)', '0 (0000)', '3']
          ],
          result: 'Counted 3 set bits in exactly 3 loop cycles instead of 32.'
        }
      },
      {
        typeName: 'Sub-Type 3: Bitmasking & Individual Bit Manipulation',
        recognition: 'Trigger: Managing 32 boolean flags inside a single 4-byte integer or testing K-th bit status.',
        mechanism: 'Use bitwise shifts (`1 << k`). 1. Check K-th bit: `(n & (1 << k)) != 0`, 2. Set K-th bit: `n | (1 << k)`, 3. Clear K-th bit: `n & ~(1 << k)`, 4. Toggle K-th bit: `n ^ (1 << k)`.',
        asciiVisual: `
Mask for k=3 (1 << 3):  0 0 0 0 1 0 0 0
Original n:             1 0 1 0 0 1 0 1
Set 3rd bit (n | mask): 1 0 1 0 1 1 0 1
`,
        javaCode: `public class BitmaskUtils {
    public static boolean checkKthBit(int n, int k) {
        return (n & (1 << k)) != 0;
    }
    public static int setKthBit(int n, int k) {
        return n | (1 << k);
    }
    public static int clearKthBit(int n, int k) {
        return n & ~(1 << k);
    }
    public static int toggleKthBit(int n, int k) {
        return n ^ (1 << k);
    }
}`,
        dryRunTrace: {
          input: 'n = 5 (0101 in binary), k = 1',
          headers: ['Operation', 'Binary Formula', 'Result Binary', 'Result Decimal'],
          rows: [
            ['Check 1st bit', '0101 & (1<<1 = 0010)', '0000 (0)', 'FALSE (0 at index 1)'],
            ['Set 1st bit', '0101 | (0010)', '0111', '7'],
            ['Clear 0th bit', '0101 & ~(0001)', '0100', '4'],
            ['Toggle 2nd bit', '0101 ^ (0100)', '0001', '1']
          ],
          result: 'Constant time O(1) bitflag state manipulation.'
        }
      }
    ],

    patternRecognition: [
      { trigger: 'Find single unique element amongst pairs', bestApproach: 'XOR Accumulator `^`' },
      { trigger: 'Count 1-bits or test power of two', bestApproach: 'Brian Kernighan\'s `n & (n - 1)`' },
      { trigger: 'Store state of up to 32 boolean flags with zero heap allocation', bestApproach: 'Integer Bitmask with Bitwise Shifts' }
    ],

    pitfalls: [
      'Operator Precedence Trap: Bitwise operators (`&`, `|`, `^`) have LOWER precedence than comparison operators (`==`, `!=`, `<`, `>`). Always write `(n & 1) == 0`, NOT `n & 1 == 0`.',
      'Signed vs Unsigned Right Shift: `>>` performs arithmetic shift (preserves sign bit), while `>>>` performs logical zero-fill shift.',
      'Negative Number Power of Two: `-2147483648` has `(n & (n-1)) == 0` but is NOT a positive power of two (guard with `n > 0`).'
    ],

    complexity: [
      { operation: 'Bitwise AND / OR / XOR / Shift', time: 'O(1) [1 CPU cycle]', space: 'O(1)' },
      { operation: 'Single Number Search', time: 'O(N)', space: 'O(1)' },
      { operation: 'Brian Kernighan Count Bits', time: 'O(Set_Bits)', space: 'O(1)' }
    ]
  }
};
