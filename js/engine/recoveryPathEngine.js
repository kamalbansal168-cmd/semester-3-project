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
}
