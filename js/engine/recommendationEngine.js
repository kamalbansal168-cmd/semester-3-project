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

    // 1. Check if there is an active strict recovery gate in progress
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

    // 1b. If Recovery Gate was recently resolved, recommend the next unlocked topic!
    if (state.activeRecoveryGate && state.activeRecoveryGate.status === 'RESOLVED') {
      const nextId = state.activeRecoveryGate.nextTopicId || 'sliding-window';
      const nextTopic = state.topics.find(t => t.id === nextId) || { id: nextId, name: state.activeRecoveryGate.nextTopicName || 'Sliding Window', mastery: 0 };
      const masteredTopic = state.topics.find(t => t.id === state.activeRecoveryGate.topicId) || { name: 'Previous Topic' };
      return {
        topicId: nextTopic.id,
        topicName: nextTopic.name,
        mastery: nextTopic.mastery || 0,
        actionTitle: `Advance to ${nextTopic.name}`,
        reason: `🎉 You repaired and mastered ${masteredTopic.name} (100% Mastery)! Ready for ${nextTopic.name}.`,
        buttonText: `Start ${nextTopic.name} →`,
        route: 'practice'
      };
    }

    // 2. Check if there are recent mistakes in notebook for unmastered topics (< 75% mastery)
    if (state.mistakesReviewList && state.mistakesReviewList.length > 0) {
      const actionableMistake = state.mistakesReviewList.find(m => {
        const topic = state.topics.find(t => t.name === m.topic || t.id === m.topicId);
        return topic && topic.mastery < 75;
      });

      if (actionableMistake) {
        const mistakeTopic = state.topics.find(t => t.name === actionableMistake.topic || t.id === actionableMistake.topicId) || state.topics[0];
        return {
          topicId: mistakeTopic.id,
          topicName: mistakeTopic.name,
          mastery: mistakeTopic.mastery,
          actionTitle: `Repair ${mistakeTopic.name} Concept Gap`,
          reason: `Identified gap: ${actionableMistake.title}. Complete targeted remediation to strengthen your foundation.`,
          buttonText: 'Repair Concept Now →',
          route: 'recovery'
        };
      }
    }

    // 3. Check if there is an active recovery path in progress for unmastered topic
    if (state.recoveryPath && state.recoveryPath.currentStepIndex < state.recoveryPath.totalSteps) {
      const pathTopic = state.topics.find(t => t.id === state.recoveryPath.topicId);
      if (!pathTopic || pathTopic.mastery < 75) {
        const step = state.recoveryPath.steps[state.recoveryPath.currentStepIndex];
        return {
          topicId: state.recoveryPath.topicId,
          topicName: state.recoveryPath.topicName,
          mastery: pathTopic?.mastery || 32,
          actionTitle: `Continue ${state.recoveryPath.conceptName} Recovery`,
          stepName: step.title,
          reason: `You are on Step ${state.recoveryPath.currentStepIndex + 1} of ${state.recoveryPath.totalSteps}: ${step.description}`,
          buttonText: 'Continue Learning →',
          route: 'recovery'
        };
      }
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

    // Fix #8: Default to the topic with highest mastery (most progress), not hardcoded two-pointer
    const bestTopic = [...state.topics].sort((a, b) => b.mastery - a.mastery)[0] || { id: 'two-pointer', name: 'Two Pointer', mastery: 0 };
    return {
      topicId: bestTopic.id,
      topicName: bestTopic.name,
      mastery: bestTopic.mastery,
      actionTitle: `Advance to Medium & Hard Challenges`,
      reason: `Your foundational accuracy is strong on ${bestTopic.name}. Ready for harder problems!`,
      buttonText: 'Practice Now →',
      route: 'practice'
    };
  }

  /**
   * Selects recommended difficulty for a student on a specific topic
   * Fix #13: Corrected duplicate Medium range — 70-85 should be Hard
   */
  static getRecommendedDifficulty(masteryScore) {
    if (masteryScore < 40) return 'Easy';
    if (masteryScore < 70) return 'Medium';
    if (masteryScore < 85) return 'Hard';
    return 'Hard';
  }
}
