/* ============================================================
   LEARNPATH AI — Adaptive Recommendation Engine
   ============================================================ */

export class RecommendationEngine {
  /**
   * Generates the primary recommendation for the Student Dashboard
   */
  static getPrimaryRecommendation(state) {
    if (!state.topics || state.topics.length === 0 || state.metrics.questionsSolved === 0) {
      return {
        topicId: 'two-pointer',
        topicName: 'Initial Assessment',
        mastery: 0,
        actionTitle: 'Start Initial Assessment',
        reason: 'Let us understand your current strengths and concept gaps with a 5-question baseline.',
        buttonText: 'Start Assessment →',
        route: 'practice'
      };
    }

    // 1. Check if there is an active strict recovery gate
    if (state.activeRecoveryGate && state.activeRecoveryGate.status === 'ACTIVE') {
      const gateTopic = state.topics.find(t => t.id === state.activeRecoveryGate.topicId) || state.topics[0];
      return {
        topicId: gateTopic.id,
        topicName: gateTopic.name,
        mastery: gateTopic.mastery,
        actionTitle: `Fix ${gateTopic.name} Concept Gap`,
        reason: `Active recovery in progress for ${state.activeRecoveryGate.subtopicName}. Master this topic before advancing!`,
        buttonText: 'Resume 3-Step Remediation →',
        route: 'recovery'
      };
    }

    // 2. Check if there are recent mistakes in notebook
    if (state.mistakesReviewList && state.mistakesReviewList.length > 0) {
      const recentMistake = state.mistakesReviewList[0];
      const mistakeTopic = state.topics.find(t => t.name === recentMistake.topic || t.id === recentMistake.topicId) || state.topics[0];
      return {
        topicId: mistakeTopic.id,
        topicName: mistakeTopic.name,
        mastery: mistakeTopic.mastery,
        actionTitle: `Repair ${mistakeTopic.name} Concept Gap`,
        reason: `Identified gap: ${recentMistake.title}. Complete targeted remediation to strengthen your foundation.`,
        buttonText: 'Repair Concept Now →',
        route: 'recovery'
      };
    }

    // 3. Check if there is an active recovery path in progress
    if (state.recoveryPath && state.recoveryPath.currentStepIndex < state.recoveryPath.totalSteps) {
      const step = state.recoveryPath.steps[state.recoveryPath.currentStepIndex];
      return {
        topicId: state.recoveryPath.topicId,
        topicName: state.recoveryPath.topicName,
        mastery: state.topics.find(t => t.id === state.recoveryPath.topicId)?.mastery || 32,
        actionTitle: `Continue ${state.recoveryPath.conceptName} Recovery`,
        stepName: step.title,
        reason: `You are on Step ${state.recoveryPath.currentStepIndex + 1} of ${state.recoveryPath.totalSteps}: ${step.description}`,
        buttonText: 'Continue Learning →',
        route: 'recovery'
      };
    }

    // Check for lowest mastery topic
    const lowestTopic = [...state.topics].sort((a, b) => a.mastery - b.mastery)[0];
    if (lowestTopic && lowestTopic.mastery < 50) {
      return {
        topicId: lowestTopic.id,
        topicName: lowestTopic.name,
        mastery: lowestTopic.mastery,
        actionTitle: `Practice ${lowestTopic.name}`,
        reason: `Current mastery is ${lowestTopic.mastery}%. Let's strengthen your foundation with targeted practice.`,
        buttonText: 'Start Practice →',
        route: 'practice'
      };
    }

    // Default to progressive topic
    return {
      topicId: 'two-pointer',
      topicName: 'Two Pointer',
      mastery: 72,
      actionTitle: 'Advance to Medium & Hard Challenges',
      reason: 'Your foundational accuracy is strong. Ready for two-pointer sliding window problems.',
      buttonText: 'Practice Now →',
      route: 'practice'
    };
  }

  /**
   * Selects recommended difficulty for a student on a specific topic
   */
  static getRecommendedDifficulty(masteryScore) {
    if (masteryScore < 40) return 'Easy';
    if (masteryScore < 70) return 'Medium';
    if (masteryScore < 85) return 'Medium';
    return 'Hard';
  }
}
