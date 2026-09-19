import { RecoveryPathEngine } from './recoveryPathEngine.js';

export class KnowledgeModel {
  /**
   * Updates student state after a question attempt
   */
  static recordAttempt(state, attemptData) {
    const { question, isCorrect, timeSpentSeconds, selectedAnswer, codeSubmitted } = attemptData;
    const topicId = question.topic;

    // 1. Update questions solved count
    state.metrics.questionsSolved += 1;

    // 2. Find target topic in student state
    const topic = state.topics.find(t => t.id === topicId);
    if (!topic) return state;

    topic.solvedCount = (topic.solvedCount || 0) + 1;

    // 3. Dynamic Mastery Adjustment
    const prevMastery = topic.mastery;
    let delta = 0;

    if (isCorrect) {
      if (question.difficulty === 'Easy') delta = 8;
      else if (question.difficulty === 'Medium') delta = 12;
      else if (question.difficulty === 'Hard') delta = 16;
      
      // Bonus if recovering
      if (topic.mastery < 40) delta += 5;
    } else {
      if (question.difficulty === 'Easy') delta = -6;
      else if (question.difficulty === 'Medium') delta = -5;
      else if (question.difficulty === 'Hard') delta = -3;
    }

    topic.mastery = Math.min(100, Math.max(0, topic.mastery + delta));

    // Update Topic Status
    topic.status = this.getMasteryStatus(topic.mastery);

    // 4. Update Overall Mastery (weighted average of all topics)
    const totalMastery = state.topics.reduce((acc, curr) => acc + curr.mastery, 0);
    const newOverall = Math.round(totalMastery / state.topics.length);
    state.metrics.lastWeekMastery = state.metrics.overallMastery;
    state.metrics.overallMastery = newOverall;
    state.metrics.improvementGain = Math.max(0, newOverall - state.metrics.lastWeekMastery);

    // 5. Update Concepts Mastered (count topics with mastery >= 75)
    state.metrics.conceptsMastered = state.topics.filter(t => t.mastery >= 75).length;

    // 6. Record Recent Attempt
    const attemptRecord = {
      id: 'att_' + Date.now(),
      questionId: question.id,
      topicName: topic.name,
      questionTitle: question.subtopic || question.question.slice(0, 40) + '...',
      isCorrect,
      difficulty: question.difficulty,
      timeSpent: `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s`,
      errorType: isCorrect ? null : (question.misconception_tag || 'LOGIC_ERROR'),
      feedbackNote: isCorrect ? 'Great job! Concept applied accurately.' : (question.common_errors || question.explanation.slice(0, 70) + '...')
    };

    state.recentAttempts.unshift(attemptRecord);
    if (state.recentAttempts.length > 8) {
      state.recentAttempts.pop();
    }

    // 7. If incorrect, add to Review Mistakes notebook & trigger recovery
    if (!isCorrect) {
      const existingMistake = state.mistakesReviewList.find(m => m.questionId === question.id);
      if (!existingMistake) {
        state.mistakesReviewList.unshift({
          id: 'mistake_' + Date.now(),
          questionId: question.id,
          topic: topic.name,
          topicId: topic.id,
          title: question.subtopic || question.question.slice(0, 45),
          difficulty: question.difficulty,
          whatWentWrong: question.common_errors || 'Incorrect selection or off-by-one boundary check.',
          correctApproach: question.explanation,
          errorPattern: question.misconception_tag || 'LOGIC_ERROR'
        });
      }

      // Generate Concept Insight for Dashboard
      state.conceptInsight = {
        title: 'Identified Knowledge Gap',
        conceptGap: `${topic.name}: ${question.subtopic || question.concept || 'Boundary Handling'}`,
        topicId: topic.id,
        topicName: topic.name,
        explanation: question.common_errors || `Identified error pattern: ${question.misconception_tag || 'Logic Trap'}.`,
        subExplanation: question.explanation || 'Review the core invariants to fix this gap.',
        detectedAt: 'Just now'
      };

      // Set active recovery gate
      if (!state.activeRecoveryGate || state.activeRecoveryGate.status === 'RESOLVED') {
        state.activeRecoveryGate = RecoveryPathEngine.createRecoveryGate(topic.id, question.subtopic || question.title);
      }

      // Set active learning path on dashboard
      state.recoveryPath = RecoveryPathEngine.createRecoveryPath(topic.id, topic.name, question.subtopic || question.concept || 'Invariant');
    }

    // 8. Recompute Focus Areas
    this.refreshFocusAreas(state);

    return state;
  }

  /**
   * Recompute top 3 focus areas based on lowest mastery and recent mistakes
   */
  static refreshFocusAreas(state) {
    const mistakeTopicNames = new Set((state.mistakesReviewList || []).map(m => m.topic));

    const sorted = [...state.topics]
      .filter(t => t.mastery < 85)
      .sort((a, b) => {
        const aHasMistake = mistakeTopicNames.has(a.name) ? -1 : 1;
        const bHasMistake = mistakeTopicNames.has(b.name) ? -1 : 1;
        if (aHasMistake !== bHasMistake) return aHasMistake - bHasMistake;
        return a.mastery - b.mastery;
      });

    state.focusAreas = sorted.slice(0, 3).map(t => ({
      topicId: t.id,
      topicName: t.name,
      mastery: t.mastery,
      tag: t.status,
      reason: mistakeTopicNames.has(t.name)
        ? 'Identified mistake in recent practice session. Targeted remediation recommended.'
        : (t.mastery < 40 
          ? 'Repeated index handling and traversal boundary struggles' 
          : 'Accuracy drops during intermediate difficulty problems'),
      urgent: mistakeTopicNames.has(t.name) || t.mastery < 40
    }));
  }

  /**
   * Maps numeric mastery score (0-100) to student-friendly status
   */
  static getMasteryStatus(score) {
    if (score >= 85) return 'Strong';
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Improving';
    return 'Needs Practice';
  }
}
