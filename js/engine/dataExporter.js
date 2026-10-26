
/* ============================================================
   LEARNPATH AI — Research Data Exporter
   Exports student interaction data for Python evaluation
   Usage: import { exportResearchData } from './engine/dataExporter.js';
          exportResearchData(store.getState());
   ============================================================ */

/**
 * Exports all research-relevant data from current state
 * as a downloadable JSON file for Python evaluation script.
 */
export function exportResearchData(state) {
  const exportPayload = {
    exportedAt: new Date().toISOString(),
    version: '1.0',

    // ─── 1. Student Info ────────────────────────────────────
    student: {
      name: state.user?.name || 'Anonymous',
      totalQuestionsSolved: state.metrics?.questionsSolved || 0,
      overallMastery: state.metrics?.overallMastery || 0,
      conceptsMastered: state.metrics?.conceptsMastered || 0,
      points: state.user?.points || 0,
      rank: state.user?.rank || 'Novice'
    },

    // ─── 2. Per-Topic Mastery Snapshot ──────────────────────
    topicMastery: (state.topics || []).map(t => ({
      topicId: t.id,
      topicName: t.name,
      masteryPercent: t.mastery,
      masteryProbability: parseFloat((t.mastery / 100).toFixed(4)),
      status: t.status,
      solvedCount: t.solvedCount || 0
    })),

    // ─── 3. Attempt Log ─────────────────────────────────────
    // Each row = one question attempt
    // Used for: AUC, F1, ACC, MSE, BCE Loss calculation
    attemptLog: (state.recentAttempts || []).map(a => ({
      attemptId: a.id,
      questionId: a.questionId,
      topicId: a.topicId,
      topicName: a.topicName,
      difficulty: a.difficulty,
      isCorrect: a.isCorrect ? 1 : 0,           // 1 = correct, 0 = wrong
      errorType: a.errorType || null,            // null if correct
      timeSpent: a.timeSpent || '0m 0s',
      feedbackNote: a.feedbackNote || ''
    })),

    // ─── 4. Recovery Gate Events ────────────────────────────
    // Used for: Recovery Rate calculation
    recoveryEvents: buildRecoveryEvents(state),

    // ─── 5. Mistakes Review List ────────────────────────────
    // Used for: Misconception Detection Accuracy
    mistakesList: (state.mistakesReviewList || []).map(m => ({
      questionId: m.questionId,
      topicId: m.topicId,
      topicName: m.topic,
      difficulty: m.difficulty,
      errorPattern: m.errorPattern,
      whatWentWrong: m.whatWentWrong
    })),

    // ─── 6. Resolved Concepts ───────────────────────────────
    // Used for: Recovery Rate (denominator)
    resolvedConcepts: (state.resolvedConcepts || []).map(r => ({
      conceptName: r.name,
      resolvedDate: r.resolvedDate,
      previousMastery: r.previousMastery,
      currentMastery: r.currentMastery,
      masteryGain: (r.currentMastery || 0) - (r.previousMastery || 0)
    })),

    // ─── 7. Active Recovery Gate State ──────────────────────
    activeRecoveryGate: state.activeRecoveryGate ? {
      topicId: state.activeRecoveryGate.topicId,
      status: state.activeRecoveryGate.status,
      currentStage: state.activeRecoveryGate.currentStage,
      mcqScore: state.activeRecoveryGate.mcqScore,
      mcqsTotal: state.activeRecoveryGate.mcqsTotal,
      mcqsAnswered: state.activeRecoveryGate.mcqsAnswered?.length || 0,
      codingSolved: state.activeRecoveryGate.codingSolved?.length || 0,
      codingRequired: state.activeRecoveryGate.codingRequired,
      notesRead: state.activeRecoveryGate.notesRead,
      startedAt: state.activeRecoveryGate.startedAt
    } : null,

    // ─── 8. Summary Metrics (for quick paper table) ─────────
    summaryMetrics: computeSummaryMetrics(state)
  };

  // Download as JSON file
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanStudentName = (state.user?.name || 'student').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  link.download = `learnpath_${cleanStudentName}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log('✅ Research data exported:', exportPayload);
  return exportPayload;
}

/**
 * Build recovery events summary from state
 */
function buildRecoveryEvents(state) {
  const events = [];

  // From resolved concepts
  (state.resolvedConcepts || []).forEach(r => {
    events.push({
      type: 'RESOLVED',
      conceptName: r.name,
      previousMastery: r.previousMastery,
      currentMastery: r.currentMastery,
      masteryGain: (r.currentMastery || 0) - (r.previousMastery || 0),
      recovered: true
    });
  });

  // Active gate (not yet resolved)
  if (state.activeRecoveryGate && state.activeRecoveryGate.status === 'ACTIVE') {
    events.push({
      type: 'IN_PROGRESS',
      topicId: state.activeRecoveryGate.topicId,
      stage: state.activeRecoveryGate.currentStage,
      mcqScore: state.activeRecoveryGate.mcqScore,
      mcqsTotal: state.activeRecoveryGate.mcqsTotal,
      recovered: false
    });
  }

  return events;
}

/**
 * Compute quick summary metrics directly from state
 */
function computeSummaryMetrics(state) {
  const attempts = state.recentAttempts || [];
  const total = attempts.length;
  const correct = attempts.filter(a => a.isCorrect).length;
  const wrong = attempts.filter(a => !a.isCorrect).length;

  // Simple accuracy
  const accuracy = total > 0 ? (correct / total) : 0;

  // BCE Loss approximation using topic mastery as predicted probability
  const bceLoss = attempts.length > 0
    ? attempts.reduce((sum, a) => {
      const topic = (state.topics || []).find(t => t.id === a.topicId);
      const p = topic ? Math.max(0.01, Math.min(0.99, topic.mastery / 100)) : 0.5;
      const y = a.isCorrect ? 1 : 0;
      return sum + (-(y * Math.log(p) + (1 - y) * Math.log(1 - p)));
    }, 0) / attempts.length
    : null;

  // Recovery stats
  const resolved = (state.resolvedConcepts || []).length;
  const mistakes = (state.mistakesReviewList || []).length;
  const recoveryRate = (resolved + mistakes) > 0
    ? (resolved / (resolved + mistakes))
    : null;

  // Error type distribution
  const errorCounts = {};
  attempts.filter(a => !a.isCorrect && a.errorType).forEach(a => {
    errorCounts[a.errorType] = (errorCounts[a.errorType] || 0) + 1;
  });

  return {
    totalAttempts: total,
    correctAttempts: correct,
    wrongAttempts: wrong,
    rawAccuracy: parseFloat(accuracy.toFixed(4)),
    approximateBCELoss: bceLoss ? parseFloat(bceLoss.toFixed(4)) : null,
    recoveryRate: recoveryRate ? parseFloat(recoveryRate.toFixed(4)) : null,
    resolvedConcepts: resolved,
    pendingMistakes: mistakes,
    errorTypeDistribution: errorCounts,
    overallMastery: state.metrics?.overallMastery || 0,
    conceptsMastered: state.metrics?.conceptsMastered || 0,
    totalTopics: (state.topics || []).length
  };
}
