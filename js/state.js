/* ============================================================
   LEARNPATH AI — Central Reactive State Store (Fresh Mode)
   ============================================================ */

import { FRESH_STUDENT_STATE, INITIAL_TOPICS } from './data/initialData.js';
import { KnowledgeModel } from './engine/knowledgeModel.js';
import { RecoveryPathEngine } from './engine/recoveryPathEngine.js';

const STORAGE_KEY = 'learnpath_ai_state_v4_topics12';

class StateStore {
  constructor() {
    this.subscribers = [];
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    let state = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('learnpath_ai_state_v3_fresh');
      if (saved) {
        state = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read localStorage:', e);
    }
    
    if (!state) {
      state = JSON.parse(JSON.stringify(FRESH_STUDENT_STATE));
    }

    // Auto-merge to ensure all 12 topics from INITIAL_TOPICS are always present
    const existingMap = new Map((state.topics || []).map(t => [t.id, t]));
    state.topics = INITIAL_TOPICS.map(initTopic => {
      const existing = existingMap.get(initTopic.id);
      return existing ? { ...initTopic, ...existing } : JSON.parse(JSON.stringify(initTopic));
    });

    return state;
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
    this.notify();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  getState() {
    return this.state;
  }

  // Check if question is solved
  isQuestionSolved(qid) {
    return Array.isArray(this.state.solvedQuestions) && this.state.solvedQuestions.includes(qid);
  }

  // Mark question solved with Green Tick
  markQuestionSolved(qid) {
    if (!this.state.solvedQuestions) {
      this.state.solvedQuestions = [];
    }
    if (!this.state.solvedQuestions.includes(qid)) {
      this.state.solvedQuestions.push(qid);
    }
    this.saveState();
  }

  // Action: Set User Identity on Login/Signup
  setUser(name, email) {
    this.state.user.name = name || 'Student';
    this.state.user.email = email || 'student@example.com';
    this.state.user.avatar = (name ? name.charAt(0).toUpperCase() : 'S');
    this.saveState();
  }

  // Action: Record Question Attempt
  recordAttempt(attemptData) {
    this.state = KnowledgeModel.recordAttempt(this.state, attemptData);
    if (attemptData.isCorrect && attemptData.question) {
      this.markQuestionSolved(attemptData.question.id);
    }
    // Update weekly activity for today
    if (this.state.weeklyActivity && this.state.weeklyActivity.length > 0) {
      const today = this.state.weeklyActivity.find(w => w.today) || this.state.weeklyActivity[this.state.weeklyActivity.length - 1];
      if (today) today.count = (today.count || 0) + 1;
    }
    // Streak
    if (this.state.metrics.questionsSolved === 1) {
      this.state.user.streakDays = 1;
      this.state.metrics.learningStreak = 1;
    }
    this.saveState();
  }

  // Action: Advance Recovery Path Step
  completeRecoveryStep(stepIndex) {
    this.state = RecoveryPathEngine.completeStep(this.state, stepIndex);
    this.saveState();
  }

  // Action: Apply Successful Re-Test Results
  applyRetestResults(correctCount, totalCount) {
    const topic = this.state.topics.find(t => t.id === 'two-pointer') || this.state.topics[0];
    if (topic) {
      const prevMastery = topic.mastery;
      topic.mastery = Math.min(100, Math.max(65, prevMastery + 35));
      topic.status = KnowledgeModel.getMasteryStatus(topic.mastery);
      topic.solvedCount += totalCount;

      ['retest_01', 'retest_02', 'retest_03', 'retest_04', 'retest_05'].forEach(id => {
        this.markQuestionSolved(id);
      });

      this.state.resolvedConcepts.unshift({
        name: `${topic.name} Concept Recovery`,
        resolvedDate: 'Just now',
        previousMastery: prevMastery,
        currentMastery: topic.mastery
      });

      const total = this.state.topics.reduce((acc, curr) => acc + curr.mastery, 0);
      const newOverall = Math.round(total / this.state.topics.length);
      this.state.metrics.lastWeekMastery = this.state.metrics.overallMastery;
      this.state.metrics.overallMastery = newOverall;
      this.state.metrics.improvementGain = Math.max(0, newOverall - this.state.metrics.lastWeekMastery);
      this.state.metrics.conceptsMastered = this.state.topics.filter(t => t.mastery >= 75).length;

      KnowledgeModel.refreshFocusAreas(this.state);

      if (this.state.recoveryPath) {
        this.state.recoveryPath.currentStepIndex = 5;
        this.state.recoveryPath.steps.forEach(s => s.status = 'COMPLETED');
      }
      this.state.conceptInsight = null;
    }

    this.saveState();
  }

  // ==========================================
  // STRICT RECOVERY GATE & PROGRESSION METHODS
  // ==========================================

  // Trigger strict recovery gate when user struggles on a topic
  triggerRecoveryGate(topicId, subtopicName = 'Core Concept Invariant') {
    const topic = this.state.topics.find(t => t.id === topicId) || this.state.topics[0];
    const gate = RecoveryPathEngine.createRecoveryGate(topic.id, subtopicName);
    this.state.activeRecoveryGate = gate;
    this.saveState();
  }

  // Stage 1: Mark Topic Notes as Read & Complete
  markRecoveryNotesCompleted() {
    if (!this.state.activeRecoveryGate) return;
    this.state.activeRecoveryGate.notesRead = true;
    this.state.activeRecoveryGate.currentStage = 2; // Advance to Stage 2: MCQs
    this.saveState();
  }

  // Stage 2: Record an answer in the 5-MCQ Diagnostic Drill
  recordRecoveryMCQ(isCorrect) {
    if (!this.state.activeRecoveryGate) return;
    const gate = this.state.activeRecoveryGate;
    if (isCorrect) gate.mcqScore += 1;
    gate.mcqIndex += 1;

    // When 5 MCQs are done, advance to Stage 3: Coding
    if (gate.mcqIndex >= gate.mcqsTotal) {
      gate.currentStage = 3;
    }
    this.saveState();
  }

  // Stage 3: Record passing a coding challenge in the playground
  recordRecoveryCodePass(questionId) {
    if (!this.state.activeRecoveryGate) return;
    const gate = this.state.activeRecoveryGate;
    if (!gate.codingSolved.includes(questionId)) {
      gate.codingSolved.push(questionId);
    }
    this.markQuestionSolved(questionId);

    // If both 2 coding questions passed, mark gate as RESOLVED
    if (gate.codingSolved.length >= gate.codingRequired) {
      this.completeRecoveryGate();
    } else {
      this.saveState();
    }
  }

  // Complete Recovery Gate: Boost Topic Mastery to 100%, Unlock Next Topic
  completeRecoveryGate() {
    if (!this.state.activeRecoveryGate) return;
    const gate = this.state.activeRecoveryGate;
    gate.status = 'RESOLVED';
    gate.currentStage = 4; // 4: Celebratory Next Topic Recommendation

    const topic = this.state.topics.find(t => t.id === gate.topicId);
    if (topic) {
      const prevMastery = topic.mastery;
      topic.mastery = 100;
      topic.status = 'Strong';
      topic.solvedCount = (topic.solvedCount || 0) + 7;

      this.state.resolvedConcepts.unshift({
        name: `${topic.name} Concept Repaired & Mastered`,
        resolvedDate: 'Just now',
        previousMastery: prevMastery,
        currentMastery: 100
      });

      const total = this.state.topics.reduce((acc, curr) => acc + curr.mastery, 0);
      this.state.metrics.overallMastery = Math.round(total / this.state.topics.length);
      this.state.metrics.conceptsMastered = this.state.topics.filter(t => t.mastery >= 75).length;
    }

    this.saveState();
  }

  dismissRecoveryGate() {
    this.state.activeRecoveryGate = null;
    this.saveState();
  }

  // Action: Reset All Data to Fresh State
  resetAllData() {
    this.state = JSON.parse(JSON.stringify(FRESH_STUDENT_STATE));
    this.saveState();
  }
}

export const store = new StateStore();
