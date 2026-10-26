/* ============================================================
   LEARNPATH AI — Central Reactive State Store (Fresh Mode)
   ============================================================ */

import { FRESH_STUDENT_STATE, INITIAL_TOPICS } from './data/initialData.js';
import { KnowledgeModel } from './engine/knowledgeModel.js';
import { RecoveryPathEngine } from './engine/recoveryPathEngine.js';

const LEGACY_STORAGE_KEY = 'learnpath_ai_state_v4_topics12';
const REGISTERED_USERS_KEY = 'learnpath_registered_users_v1';

export function getUserStorageKey(email) {
  if (!email) return 'learnpath_user_state_guest';
  const clean = String(email).trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `learnpath_user_state_${clean}`;
}

export class StateStore {
  constructor() {
    this.subscribers = [];
    this.currentEmail = localStorage.getItem('learnpath_user_email') || null;
    this.state = this.loadUserState(this.currentEmail);
  }

  getStorageKey() {
    return getUserStorageKey(this.currentEmail);
  }

  loadUserState(email, fallbackName = '') {
    const key = getUserStorageKey(email);
    let state = null;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        state = JSON.parse(saved);
      } else if (email) {
        // If this user has no isolated key yet, check legacy storage to preserve Aryan's or first user's work
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          try {
            const parsedLegacy = JSON.parse(legacy);
            const legacyEmail = (parsedLegacy.user?.email || '').toLowerCase();
            if (legacyEmail === email.toLowerCase()) {
              state = parsedLegacy;
            }
          } catch (e) {}
        }
      } else {
        // Guest / not logged in
        const savedGuest = localStorage.getItem('learnpath_user_state_guest') || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (savedGuest) {
          state = JSON.parse(savedGuest);
        }
      }
    } catch (e) {
      console.warn('Could not read user state from localStorage:', e);
    }
    
    // If no saved state exists for this specific user, start with a 100% clean baseline
    if (!state) {
      state = JSON.parse(JSON.stringify(FRESH_STUDENT_STATE));
      if (email) {
        const displayName = fallbackName || email.split('@')[0];
        state.user.name = displayName;
        state.user.email = email;
        state.user.avatar = displayName ? displayName.charAt(0).toUpperCase() : 'S';
      }
    }

    // Auto-merge to ensure all 12 topics from INITIAL_TOPICS are always present
    const existingMap = new Map((state.topics || []).map(t => [t.id, t]));
    state.topics = INITIAL_TOPICS.map(initTopic => {
      const existing = existingMap.get(initTopic.id);
      return existing ? { ...initTopic, ...existing } : JSON.parse(JSON.stringify(initTopic));
    });

    // Heal state: If a topic is mastered (>= 75%) or recovery gate is resolved, clear old concept alert
    if (state.conceptInsight) {
      const insightTopic = state.topics.find(t => t.id === state.conceptInsight.topicId || t.name === state.conceptInsight.topicName);
      if (insightTopic && (insightTopic.mastery >= 75 || (state.activeRecoveryGate && state.activeRecoveryGate.status === 'RESOLVED'))) {
        state.conceptInsight = null;
      }
    }

    // Clean up resolved mistakes for mastered topics
    if (state.mistakesReviewList) {
      state.mistakesReviewList = state.mistakesReviewList.filter(m => {
        const topic = state.topics.find(t => t.name === m.topic || t.id === m.topicId);
        return !topic || topic.mastery < 75;
      });
    }

    // Sync recoveryPath if all steps completed
    if (state.recoveryPath && state.activeRecoveryGate && state.activeRecoveryGate.status === 'RESOLVED') {
      state.recoveryPath.currentStepIndex = state.recoveryPath.totalSteps || 5;
      state.recoveryPath.steps.forEach(s => s.status = 'COMPLETED');
    }

    // Points and rank auto-sync
    if (state.user) {
      if (state.user.points === undefined) {
        state.user.points = (state.metrics?.questionsSolved || 0) * 2;
      }
      state.user.rank = this.getRankFromPoints(state.user.points);
      state.user.level = this.getLevelFromPoints(state.user.points);
    }
    if (state.metrics) {
      state.metrics.points = state.user ? state.user.points : 0;
    }

    return state;
  }

  saveState() {
    try {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(this.state));
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
    return JSON.parse(JSON.stringify(this.state));
  }

  // Check if question is solved
  isQuestionSolved(qid) {
    return Array.isArray(this.state.solvedQuestions) && this.state.solvedQuestions.includes(qid);
  }

  // Award points to user (+2 per question by default)
  awardPoints(amount = 2) {
    if (!this.state.user.points) this.state.user.points = 0;
    const oldPoints = this.state.user.points;
    const oldRank = this.state.user.rank || 'Novice Developer';
    
    this.state.user.points += amount;
    this.state.metrics.points = this.state.user.points;

    const newRank = StateStore.getRankFromPoints(this.state.user.points);
    const newLevel = StateStore.getLevelFromPoints(this.state.user.points);
    const rankedUp = newRank !== oldRank;

    this.state.user.rank = newRank;
    this.state.user.level = newLevel;

    this.saveState();

    return {
      pointsEarned: amount,
      totalPoints: this.state.user.points,
      newRank,
      newLevel,
      rankedUp
    };
  }

  // Mark question solved with Green Tick and award points
  markQuestionSolved(qid, pointsToAdd = 2) {
    if (!this.state.solvedQuestions) {
      this.state.solvedQuestions = [];
    }
    const isNewSolve = !this.state.solvedQuestions.includes(qid);
    if (isNewSolve) {
      this.state.solvedQuestions.push(qid);
    }

    // Award +2 points on solve
    return this.awardPoints(pointsToAdd);
  }

  // Helper static rank calculations
  static getRankFromPoints(points = 0) {
    if (points >= 120) return 'Master Code Architect';
    if (points >= 60) return 'Senior Problem Solver';
    if (points >= 20) return 'Junior Algorithmist';
    return 'Novice Developer';
  }

  static getLevelFromPoints(points = 0) {
    if (points >= 120) return 'Master';
    if (points >= 60) return 'Advanced';
    if (points >= 20) return 'Intermediate';
    return 'Beginner';
  }

  getRankFromPoints(points = 0) {
    return StateStore.getRankFromPoints(points);
  }

  getLevelFromPoints(points = 0) {
    return StateStore.getLevelFromPoints(points);
  }

  // Action: Switch Active User (Isolates progress per student email)
  switchUser(name, email) {
    if (!email) {
      this.currentEmail = null;
      this.state = this.loadUserState(null);
      this.notify();
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    this.currentEmail = cleanEmail;

    // Register user in local user registry
    try {
      const reg = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '{}');
      const prevName = reg[cleanEmail]?.name || '';
      const finalName = name || prevName || email.split('@')[0];
      reg[cleanEmail] = {
        name: finalName,
        email: cleanEmail,
        lastActive: new Date().toISOString()
      };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(reg));
    } catch (e) {}

    // Load isolated state for this specific user
    this.state = this.loadUserState(cleanEmail, name);
    if (name) {
      this.state.user.name = name;
      this.state.user.avatar = name.charAt(0).toUpperCase();
    }
    this.state.user.email = cleanEmail;
    this.saveState();
  }

  // Alias for backward compatibility
  setUser(name, email) {
    this.switchUser(name, email);
  }

  // Action: Clear active session on logout
  logout() {
    this.currentEmail = null;
    this.state = this.loadUserState(null);
    this.notify();
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
    // Fix #3: Use actual recovery topic, not hardcoded 'two-pointer'
    const activeTopicId = (this.state.activeRecoveryGate && this.state.activeRecoveryGate.topicId)
      || (this.state.recoveryPath && this.state.recoveryPath.topicId)
      || 'two-pointer';
    const topic = this.state.topics.find(t => t.id === activeTopicId) || this.state.topics[0];
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
      if (this.state.mistakesReviewList) {
        this.state.mistakesReviewList = this.state.mistakesReviewList.filter(
          m => m.topicId !== topic.id && m.topic !== topic.name
        );
      }
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
    if (!gate.codingSolved) gate.codingSolved = [];
    if (!gate.codingSolved.includes(questionId)) {
      gate.codingSolved.push(questionId);
    }
    this.markQuestionSolved(questionId);

    // If both 2 coding questions passed, mark gate as RESOLVED
    if (gate.codingSolved.length >= (gate.codingRequired || 2)) {
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

      // 1. Dismiss concept insight banner when concept is repaired
      this.state.conceptInsight = null;

      // 2. Clear mistakes review for repaired topic
      if (this.state.mistakesReviewList) {
        this.state.mistakesReviewList = this.state.mistakesReviewList.filter(
          m => m.topicId !== topic.id && m.topic !== topic.name
        );
      }

      // 3. Complete recovery path on dashboard
      if (this.state.recoveryPath && (this.state.recoveryPath.topicId === topic.id || this.state.recoveryPath.topicName === topic.name)) {
        this.state.recoveryPath.currentStepIndex = this.state.recoveryPath.totalSteps || 5;
        this.state.recoveryPath.steps.forEach(s => s.status = 'COMPLETED');
      }

      // 4. Refresh focus areas to remove mastered topic
      KnowledgeModel.refreshFocusAreas(this.state);
    }

    this.saveState();
  }

  dismissRecoveryGate() {
    this.state.activeRecoveryGate = null;
    this.state.conceptInsight = null;
    this.saveState();
  }

  // Action: Reset All Data to Fresh State for Current User
  resetAllData() {
    const curEmail = this.currentEmail;
    const curName = this.state.user?.name || (curEmail ? curEmail.split('@')[0] : 'Student');
    this.state = JSON.parse(JSON.stringify(FRESH_STUDENT_STATE));
    if (curEmail) {
      this.state.user.name = curName;
      this.state.user.email = curEmail;
      this.state.user.avatar = curName ? curName.charAt(0).toUpperCase() : 'S';
    }
    this.saveState();
  }
}

export const store = new StateStore();
