/* ============================================================
   LEARNPATH AI — Modular AI Service Abstraction
   (Includes intelligent local fallback engine for hints, explanations & insights)
   ============================================================ */

export class AIService {
  /**
   * Generates intelligent step-by-step hint for a problem without spoiling the answer
   */
  static async getHint(question, studentAttemptHistory = []) {
    // Simulated async call (supports future external LLM integration)
    return new Promise((resolve) => {
      setTimeout(() => {
        if (question.topic === 'two-pointer') {
          resolve({
            type: 'HINT',
            title: 'Concept Hint',
            hintText: 'Pay close attention to when pointers move relative to element comparison. Make sure you compare `arr[left]` and `arr[right]` before applying `left++` or `right--`.'
          });
        } else if (question.topic === 'searching') {
          resolve({
            type: 'HINT',
            title: 'Concept Hint',
            hintText: 'Think about integer limits and which search half strictly contains candidates when the target is smaller than mid.'
          });
        } else {
          resolve({
            type: 'HINT',
            title: 'Concept Hint',
            hintText: `Consider the zero-indexed boundaries of the array. The valid range is 0 to length - 1.`
          });
        }
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
