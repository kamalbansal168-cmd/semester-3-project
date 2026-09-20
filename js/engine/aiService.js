/* ============================================================
   LEARNPATH AI — Modular AI Service Abstraction
   Fix #9: Specific hints added for all 12 topics (previously only 2 had real hints)
   ============================================================ */

// Hint map for all 12 supported topics
const TOPIC_HINTS = {
  'basic-arrays': 'Remember: Java arrays are zero-indexed. Valid indices are 0 to length-1. An `ArrayIndexOutOfBoundsException` means you crossed that boundary. Always check `i < arr.length` not `i <= arr.length`.',
  'searching': 'Think about integer limits and which search half strictly contains candidates. In binary search, when `target < arr[mid]`, move `right = mid - 1`. Ensure `left <= right` as the loop guard, not `left < right`.',
  'sorting': 'Focus on the loop invariant: after each pass of Bubble Sort, the largest unsorted element is in its final position. For Selection Sort, swap only once per outer iteration. Merge Sort uses O(n) extra space — track merge boundaries carefully.',
  'strings': 'Java `String` is immutable — every concatenation creates a new object. Use `StringBuilder` for loops. `charAt(i)` returns a `char`, not a `String`. Remember `str.length()` is a method call, unlike `arr.length` which is a property.',
  '2d-arrays': 'In 2D arrays, `matrix[row][col]` — row index first, then column. For traversal, outer loop on rows (`i < matrix.length`), inner loop on columns (`j < matrix[i].length`). Careful with rectangular vs square assumptions.',
  'two-pointer': 'Pay close attention to when pointers move relative to element comparison. Compare `arr[left]` and `arr[right]` BEFORE moving pointers. Use `left < right` (not `<=`) to avoid crossing. Move only the pointer that satisfies the condition.',
  'sliding-window': 'For fixed-size windows: maintain a window of exactly `k` elements — add new element, remove oldest (`i - k`). For dynamic windows: expand right pointer freely, shrink left pointer when constraint is violated. Track window state with variables, not re-computation.',
  'prefix-sum': 'Build prefix array where `prefix[i] = prefix[i-1] + arr[i-1]`. Then range sum from index `l` to `r` is `prefix[r+1] - prefix[l]` in O(1). Remember 1-indexed prefix arrays avoid special-case handling for index 0.',
  'recursion': 'Every recursive function needs: (1) a base case that stops recursion, and (2) a recursive call that makes progress toward the base case. Trace the call stack for small inputs. Check: does your base case cover empty arrays and single-element arrays?',
  'monotonic-stack': 'A monotonic stack maintains elements in increasing or decreasing order. For "Next Greater Element": iterate right-to-left OR use a stack. When you find a greater element, pop all smaller ones — they found their answer. Stack stores indices, not values.',
  'linked-list': 'Always save `next` before modifying pointers: `ListNode next = curr.next; curr.next = prev;`. For cycle detection: fast pointer moves 2 steps, slow moves 1. They meet inside the cycle. Use a `dummy` head node to simplify edge cases.',
  'bit-manipulation': 'XOR key properties: `a ^ a = 0`, `a ^ 0 = a`. To check if bit `k` is set: `(n >> k) & 1`. To count set bits: use `n & (n-1)` which clears the lowest set bit — count iterations until `n == 0`.'
};

export class AIService {
  /**
   * Generates intelligent step-by-step hint for a problem without spoiling the answer
   * Fix #9: Now covers all 12 topics with specific, meaningful hints
   */
  static async getHint(question, studentAttemptHistory = []) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const hintText = TOPIC_HINTS[question.topic]
          || `Consider the zero-indexed boundaries carefully. Trace through a small example (e.g., 3-4 elements) manually to verify your logic before coding.`;

        resolve({
          type: 'HINT',
          title: 'Concept Hint',
          hintText
        });
      }, 300);
    });
  }

  /**
   * Generates a personalized post-attempt diagnostic explanation
   */
  static analyzeMistake({ question, selectedOptionText, timeSpentSeconds }) {
    return {
      possibleConcept: question.concept || 'Array Boundary Invariants',
      detectedPattern: question.misconception_tag || 'LOGIC_ERROR',
      simpleExplanation: `In this question, the key was: ${question.explanation}`,
      recommendedAction: 'Review the loop guard condition before trying another question.',
      recommendedDifficulty: 'Easy'
    };
  }
}
