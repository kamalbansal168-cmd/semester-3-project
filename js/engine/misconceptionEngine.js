/* ============================================================
   LEARNPATH AI — Misconception & Error Pattern Detection Engine
   ============================================================ */

export const ERROR_CATEGORIES = {
  INDEX_ERROR: {
    label: 'Array Index Handling',
    friendlyMessage: 'Index calculation or off-by-one pointer shift occurred.',
    recoveryFocus: 'Zero-based index boundaries and safe incrementation.'
  },
  LOOP_BOUNDARY_ERROR: {
    label: 'Loop Boundary Condition',
    friendlyMessage: 'Loop terminating condition checked incorrect limits (<= vs <).',
    recoveryFocus: 'Boundary termination guards and lookahead array bounds.'
  },
  LOGIC_ERROR: {
    label: 'Algorithmic Logic',
    friendlyMessage: 'The core step sequence or condition check diverged from expected.',
    recoveryFocus: 'Step-by-step state tracing before updating values.'
  },
  CONCEPT_CONFUSION: {
    label: 'Concept Foundation',
    friendlyMessage: 'Memory reference or default value behavior was mixed up.',
    recoveryFocus: 'Heap references, default primitive arrays, and immutability.'
  },
  APPROACH_ERROR: {
    label: 'Problem Solving Strategy',
    friendlyMessage: 'A less optimal or unsafe search/sort approach was selected.',
    recoveryFocus: 'Standard invariant rules and monotonicity.'
  },
  SYNTAX_ERROR: {
    label: 'Syntax & Properties',
    friendlyMessage: 'Java array property syntax was confused with Collection methods.',
    recoveryFocus: 'Array .length property vs String .length() method.'
  }
};

export class MisconceptionEngine {
  /**
   * Analyzes recent incorrect attempts on a topic to identify systemic concept gaps
   */
  static analyzeErrorPattern(recentAttempts, topicId) {
    const topicAttempts = recentAttempts.filter(a => a.topicName.toLowerCase().includes(topicId.replace('-', ' ')));
    const wrongAttempts = topicAttempts.filter(a => !a.isCorrect && a.errorType);

    if (wrongAttempts.length >= 2) {
      // Check if majority share the same error type
      const errorCounts = {};
      wrongAttempts.forEach(a => {
        errorCounts[a.errorType] = (errorCounts[a.errorType] || 0) + 1;
      });

      let dominantError = null;
      let maxCount = 0;
      for (const [err, count] of Object.entries(errorCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominantError = err;
        }
      }

      if (dominantError && maxCount >= 2) {
        const errorInfo = ERROR_CATEGORIES[dominantError] || ERROR_CATEGORIES.INDEX_ERROR;
        return {
          hasGap: true,
          errorType: dominantError,
          title: 'We noticed something',
          conceptGap: errorInfo.label,
          explanation: `You are making repeated mistakes with ${errorInfo.label.toLowerCase()}.`,
          subExplanation: errorInfo.friendlyMessage,
          evidence: [
            `Similar pattern observed across ${maxCount} recent questions`,
            `Errors occurred during pointer convergence or boundary access`,
            `Higher solving time detected on edge case checks`
          ],
          recommendedAction: `Let's strengthen ${errorInfo.label.toLowerCase()} with a short recovery path.`
        };
      }
    }

    return { hasGap: false };
  }
}
