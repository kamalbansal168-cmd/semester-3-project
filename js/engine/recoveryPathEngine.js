/* ============================================================
   LEARNPATH AI — Strict Concept Recovery Gate & Progression Engine
   3-Stage Remediation: Deep Notes -> 5 MCQs -> 2 Coding Problems
   ============================================================ */

export const TOPIC_PROGRESSION_MAP = {
  'basic-arrays': { nextId: 'two-pointer', nextName: 'Two Pointer Technique' },
  'two-pointer': { nextId: 'sliding-window', nextName: 'Sliding Window' },
  'sliding-window': { nextId: 'prefix-sum', nextName: 'Prefix Sum & Cumulative' },
  'prefix-sum': { nextId: 'searching', nextName: 'Searching Algorithms' },
  'searching': { nextId: 'sorting', nextName: 'Sorting Algorithms' },
  'sorting': { nextId: 'strings', nextName: 'Strings & Char Arrays' },
  'strings': { nextId: '2d-arrays', nextName: '2D Arrays & Matrices' },
  '2d-arrays': { nextId: 'recursion', nextName: 'Recursion & Backtracking' },
  'recursion': { nextId: 'monotonic-stack', nextName: 'Monotonic Stacks & Queues' },
  'monotonic-stack': { nextId: 'linked-list', nextName: 'Linked List Fundamentals' },
  'linked-list': { nextId: 'bit-manipulation', nextName: 'Bit Manipulation & Hashing' },
  'bit-manipulation': { nextId: 'basic-arrays', nextName: 'Advanced Problem Solving' }
};

export class RecoveryPathEngine {
  /**
   * Generates a strict 3-stage recovery gate session
   */
  static createRecoveryGate(topicId, subtopicName = 'Core Invariant') {
    const nextProgression = TOPIC_PROGRESSION_MAP[topicId] || { nextId: 'two-pointer', nextName: 'Next Topic' };

    return {
      id: `gate_${topicId}_${Date.now()}`,
      topicId,
      subtopicName,
      status: 'ACTIVE', // 'ACTIVE' | 'RESOLVED'
      currentStage: 1, // 1: Notes, 2: 5 MCQs, 3: 2 Coding Problems
      notesRead: false,
      mcqIndex: 0,
      mcqScore: 0,
      mcqsTotal: 5,
      mcqsAnswered: [],
      codingSolved: [],
      codingRequired: 2,
      nextTopicId: nextProgression.nextId,
      nextTopicName: nextProgression.nextName,
      startedAt: new Date().toISOString()
    };
  }

  /**
   * Returns next topic recommendation details
   */
  static getNextTopic(topicId) {
    return TOPIC_PROGRESSION_MAP[topicId] || { nextId: 'two-pointer', nextName: 'Next Topic' };
  }

  /**
   * Fix N7: Creates a structured recovery path for the dashboard Learning Path Widget.
   * This method was called in knowledgeModel.js but was missing — causing Recovery Path
   * to always be null and the widget to show "Solve questions to generate a path."
   */
  static createRecoveryPath(topicId, topicName, conceptName = 'Core Invariant') {
    return {
      topicId,
      topicName,
      conceptName,
      currentStepIndex: 0,
      totalSteps: 5,
      steps: [
        {
          id: 'step_refresh',
          title: 'Concept Refresh',
          description: `Visual refresher on ${topicName} boundaries & core logic`,
          status: 'CURRENT',
          type: 'CONCEPT_REFRESH',
          questionId: null
        },
        {
          id: 'step_easy',
          title: 'Easy Practice',
          description: `Warm-up questions on ${topicName} fundamentals`,
          status: 'LOCKED',
          type: 'PRACTICE',
          questionId: null
        },
        {
          id: 'step_med',
          title: 'Medium Practice',
          description: `Targeted practice to avoid common ${topicName} mistakes`,
          status: 'LOCKED',
          type: 'PRACTICE',
          questionId: null
        },
        {
          id: 'step_code',
          title: 'Coding Challenge',
          description: `Implement a real ${topicName} algorithm in the playground`,
          status: 'LOCKED',
          type: 'CODING_CHALLENGE',
          questionId: null
        },
        {
          id: 'step_retest',
          title: 'Re-Test',
          description: '5-question validation to verify concept recovery & update mastery',
          status: 'LOCKED',
          type: 'RE_TEST',
          questionId: null
        }
      ]
    };
  }
}
