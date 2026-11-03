/* ============================================================
   LEARNPATH AI — Central Reactive State Store (Fresh Mode)
   ============================================================ */

import { FRESH_STUDENT_STATE, INITIAL_TOPICS, ALL_TOPICS } from './data/initialData.js';
import { KnowledgeModel } from './engine/knowledgeModel.js';
import { RecoveryPathEngine } from './engine/recoveryPathEngine.js';
import { calculateStreakStats, formatDate, generateSeedActivity } from './engine/streakEngine.js';

const LEGACY_STORAGE_KEY = 'learnpath_ai_state_v4_topics12';
const REGISTERED_USERS_KEY = 'learnpath_registered_users_v1';

export const DEFAULT_USERS = {
  'admin@learnpath.edu': {
    name: 'System Administrator',
    email: 'admin@learnpath.edu',
    password: 'admin123',
    role: 'admin',
    track: 'java',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'student@example.com': {
    name: 'Student',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    track: 'java',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'aryan.soni@learnpath.edu': {
    name: 'Aryan Soni',
    email: 'aryan.soni@learnpath.edu',
    password: 'aryan123',
    role: 'student',
    track: 'java',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  'priya.sharma@learnpath.edu': {
    name: 'Priya Sharma',
    email: 'priya.sharma@learnpath.edu',
    password: 'priya123',
    role: 'student',
    track: 'java',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
};

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
    if (email && state.user) {
      state.user.role = (email.toLowerCase() === 'admin@learnpath.edu') ? 'admin' : (state.user.role || 'student');
    }

    // Auto-merge to ensure all topics from Java and Python are always present
    const topicCatalog = ALL_TOPICS || INITIAL_TOPICS;
    const existingMap = new Map((state.topics || []).map(t => [t.id, t]));
    state.topics = topicCatalog.map(initTopic => {
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

    // LeetCode Streak & Submission Calendar auto-sync
    if (!state.submissionCalendar) {
      state.submissionCalendar = generateSeedActivity();
    }
    const streakStats = calculateStreakStats(state.submissionCalendar);
    if (state.user) {
      state.user.streakDays = streakStats.currentStreak;
    }
    if (state.metrics) {
      state.metrics.learningStreak = streakStats.currentStreak;
      state.metrics.maxStreak = streakStats.maxStreak;
      state.metrics.totalActiveDays = streakStats.totalActiveDays;
      state.metrics.totalSubmissions = streakStats.totalSubmissions;
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

  // Mark question solved with Green Tick and award points (only for new solves)
  markQuestionSolved(qid, pointsToAdd = 2) {
    if (!this.state.solvedQuestions) {
      this.state.solvedQuestions = [];
    }
    const isNewSolve = !this.state.solvedQuestions.includes(qid);
    if (isNewSolve) {
      this.state.solvedQuestions.push(qid);
      return this.awardPoints(pointsToAdd);
    }

    return {
      pointsEarned: 0,
      totalPoints: this.state.user ? this.state.user.points : 0,
      newRank: this.state.user ? this.state.user.rank : 'Novice Developer',
      newLevel: this.state.user ? this.state.user.level : 'Beginner',
      rankedUp: false
    };
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

  // Retrieve all registered users, ensuring seed demo accounts exist
  getRegisteredUsers() {
    let users = {};
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY);
      if (saved) {
        users = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading registered users from localStorage:', e);
    }

    let modified = false;
    for (const [email, defUser] of Object.entries(DEFAULT_USERS)) {
      if (!users[email]) {
        users[email] = { ...defUser };
        modified = true;
      } else if (!users[email].password) {
        // Upgrade legacy user record with default password
        users[email].password = defUser.password;
        if (!users[email].role) users[email].role = defUser.role;
        modified = true;
      }
    }
    if (modified) {
      try {
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
      } catch (e) {}
    }
    return users;
  }

  saveRegisteredUsers(users) {
    try {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.warn('Error saving registered users to localStorage:', e);
    }
  }

  // Register a new student account
  registerUser(name, email, password, track = 'java') {
    const cleanEmail = String(email).trim().toLowerCase();
    const users = this.getRegisteredUsers();

    if (cleanEmail === 'admin@learnpath.edu') {
      return { success: false, error: 'The email "admin@learnpath.edu" is reserved for the Super Admin. Please sign in instead.' };
    }

    if (users[cleanEmail]) {
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: password,
      track: track || 'java',
      role: 'student',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    users[cleanEmail] = newUser;
    this.saveRegisteredUsers(users);

    return { success: true, user: newUser };
  }

  // Verify credentials on sign-in
  verifyCredentials(email, password) {
    const cleanEmail = String(email).trim().toLowerCase();
    const users = this.getRegisteredUsers();

    // Check Admin
    if (cleanEmail === 'admin@learnpath.edu') {
      if (password === 'admin123') {
        return {
          success: true,
          user: {
            name: 'System Administrator',
            email: 'admin@learnpath.edu',
            role: 'admin',
            track: 'java'
          }
        };
      } else {
        return { success: false, error: 'Incorrect password for admin account. Please try again.' };
      }
    }

    const user = users[cleanEmail];
    if (!user) {
      return {
        success: false,
        error: 'No account found with this email. Please check your spelling or click "Create Account".'
      };
    }

    // Support both student123 and password123 for demo student account
    const isDemoStudent = (cleanEmail === 'student@example.com');
    const validDemoPassword = isDemoStudent && (password === 'student123' || password === 'password123');

    if (user.password && user.password !== password && !validDemoPassword) {
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // If user record lacked password (legacy), set it now
    if (!user.password) {
      user.password = password;
    }

    user.lastActive = new Date().toISOString();
    this.saveRegisteredUsers(users);

    return { success: true, user };
  }

  // Reset password for an existing account
  resetPassword(email, newPassword) {
    const cleanEmail = String(email).trim().toLowerCase();
    const users = this.getRegisteredUsers();
    if (users[cleanEmail]) {
      users[cleanEmail].password = newPassword;
      this.saveRegisteredUsers(users);
      return true;
    }
    return false;
  }

  // Action: Switch Active User (Isolates progress per student email)
  switchUser(name, email, role = 'student') {
    if (!email) {
      this.currentEmail = null;
      this.state = this.loadUserState(null);
      this.notify();
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    this.currentEmail = cleanEmail;
    const detectedRole = role || (cleanEmail === 'admin@learnpath.edu' ? 'admin' : 'student');

    // Register user in local user registry
    try {
      const users = this.getRegisteredUsers();
      const prevName = users[cleanEmail]?.name || '';
      const finalName = name || prevName || email.split('@')[0];
      if (!users[cleanEmail]) {
        users[cleanEmail] = {
          name: finalName,
          email: cleanEmail,
          role: detectedRole,
          lastActive: new Date().toISOString()
        };
      } else {
        users[cleanEmail].lastActive = new Date().toISOString();
        if (role) users[cleanEmail].role = detectedRole;
      }
      this.saveRegisteredUsers(users);
    } catch (e) {}

    // Load isolated state for this specific user
    this.state = this.loadUserState(cleanEmail, name);
    if (name) {
      this.state.user.name = name;
      this.state.user.avatar = name.charAt(0).toUpperCase();
    }
    this.state.user.email = cleanEmail;
    this.state.user.role = detectedRole;
    this.saveState();
  }

  // Alias for backward compatibility
  setUser(name, email, role = 'student') {
    this.switchUser(name, email, role);
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
    // Update LeetCode Submission Calendar & Streak
    const todayStr = formatDate(new Date());
    if (!this.state.submissionCalendar) {
      this.state.submissionCalendar = {};
    }
    this.state.submissionCalendar[todayStr] = (this.state.submissionCalendar[todayStr] || 0) + 1;
    const streakStats = calculateStreakStats(this.state.submissionCalendar);
    this.state.user.streakDays = streakStats.currentStreak;
    this.state.metrics.learningStreak = streakStats.currentStreak;
    this.state.metrics.maxStreak = streakStats.maxStreak;
    this.state.metrics.totalActiveDays = streakStats.totalActiveDays;
    this.state.metrics.totalSubmissions = streakStats.totalSubmissions;
    this.saveState();
  }

  // Action: Manually Log Submission (e.g. for testing / playground solves)
  logSubmission(count = 1, dateStr = null) {
    const targetDate = dateStr || formatDate(new Date());
    if (!this.state.submissionCalendar) {
      this.state.submissionCalendar = {};
    }
    this.state.submissionCalendar[targetDate] = (this.state.submissionCalendar[targetDate] || 0) + count;
    const stats = calculateStreakStats(this.state.submissionCalendar);
    this.state.user.streakDays = stats.currentStreak;
    this.state.metrics.learningStreak = stats.currentStreak;
    this.state.metrics.maxStreak = stats.maxStreak;
    this.state.metrics.totalActiveDays = stats.totalActiveDays;
    this.state.metrics.totalSubmissions = stats.totalSubmissions;
    this.saveState();
    return stats;
  }

  // Action: Restore Demo Seed Activity (63 submissions, 15 active days, max streak 3)
  restoreDemoSeedActivity() {
    this.state.submissionCalendar = generateSeedActivity();
    const stats = calculateStreakStats(this.state.submissionCalendar);
    this.state.user.streakDays = stats.currentStreak;
    this.state.metrics.learningStreak = stats.currentStreak;
    this.state.metrics.maxStreak = stats.maxStreak;
    this.state.metrics.totalActiveDays = stats.totalActiveDays;
    this.state.metrics.totalSubmissions = stats.totalSubmissions;
    this.saveState();
    return stats;
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
