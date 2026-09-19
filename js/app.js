/* ============================================================
   LEARNPATH AI — Main Application Orchestrator & Router (With Notes & 12 Topics)
   ============================================================ */

import { store } from './state.js';
import { renderNavbar } from './components/navbar.js';
import { renderLandingView } from './components/landingView.js';
import { renderAuthView } from './components/authView.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderTopicSelectionView } from './components/topicSelectionView.js';
import { renderPracticeView } from './components/practiceView.js';
import { renderQuestionView } from './components/questionView.js';
import { renderPlaygroundView } from './components/playgroundView.js';
import { renderNotesView } from './components/notesView.js';
import { renderConceptInsightView, renderConceptExplanationView } from './components/conceptInsightView.js';
import { renderRecoveryPathView } from './components/recoveryPathView.js';
import { renderRecoveryGateView } from './components/recoveryGateModal.js';
import { renderRetestView } from './components/retestView.js';
import { renderProgressView } from './components/progressView.js';
import { renderMistakesView } from './components/mistakesView.js';
import { renderProfileView } from './components/profileView.js';
import { QUESTIONS_DB } from './data/questions.js';
import { AIService } from './engine/aiService.js';
import { CodeExecutionEngine } from './engine/codeExecutionEngine.js';

class LearnPathApp {
  constructor() {
    this.currentRoute = 'landing';
    this.isLoggedIn = false;
    this.routeParams = {};
    
    // Active Question State
    this.currentQuestionId = null;
    this.selectedOptionIdx = null;
    this.questionFeedback = null;
    this.timerInterval = null;
    this.secondsElapsed = 0;

    // Active Playground State (LeetCode / HackerRank)
    this.playgroundActiveTab = 'description';
    this.playgroundActiveCaseIdx = 0;
    this.playgroundCode = null;
    this.playgroundRunResults = null;
    this.playgroundSubmission = null;

    // Active Re-Test State
    this.retestCurrentIdx = 0;
    this.retestUserAnswers = {};
    this.retestCompleted = false;

    // Active Practice Filters & Subject
    this.activeSubject = 'java';
    this.selectedPracticeTopic = 'all';
    this.selectedPracticeDifficulty = 'all';

    this.init();
  }

  init() {
    this.render();
    store.subscribe(() => {
      this.render();
    });
    this.attachEventListeners();
  }

  navigate(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;

    if (params.topic) {
      this.selectedPracticeTopic = params.topic;
    }

    if (route !== 'question' && route !== 'playground') {
      this.stopTimer();
      this.selectedOptionIdx = null;
      this.questionFeedback = null;
      this.playgroundRunResults = null;
      this.playgroundSubmission = null;
    }

    if (route === 'playground') {
      const qid = params.qid || 'tp_code_01';
      this.currentQuestionId = qid;
      const question = QUESTIONS_DB.find(q => q.id === qid);
      this.playgroundCode = question ? question.starterCode : '';
      this.playgroundRunResults = null;
      this.playgroundSubmission = null;
      this.playgroundActiveTab = 'description';
      this.playgroundActiveCaseIdx = 0;
      this.startTimer();
    }

    if (route !== 'retest') {
      this.retestCurrentIdx = 0;
      this.retestUserAnswers = {};
      this.retestCompleted = false;
    }

    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const state = store.getState();
    const navEl = document.getElementById('navbar-mount');
    const mainEl = document.getElementById('main-content-mount');

    if (navEl) {
      navEl.innerHTML = renderNavbar(state, this.currentRoute, this.isLoggedIn);
    }

    if (!mainEl) return;

    switch (this.currentRoute) {
      case 'landing':
        mainEl.innerHTML = renderLandingView();
        break;

      case 'signin':
        mainEl.innerHTML = renderAuthView(false);
        break;

      case 'signup':
        mainEl.innerHTML = renderAuthView(true);
        break;

      case 'dashboard':
        mainEl.innerHTML = renderDashboardView(state);
        break;

      case 'topics':
        mainEl.innerHTML = renderTopicSelectionView(state, this.activeSubject);
        break;

      case 'notes':
        const noteTopic = this.routeParams.topic || 'basic-arrays';
        mainEl.innerHTML = renderNotesView(noteTopic);
        break;

      case 'practice':
        mainEl.innerHTML = renderPracticeView(state, this.selectedPracticeTopic, this.selectedPracticeDifficulty);
        break;

      case 'playground':
        const pqid = this.routeParams.qid || this.currentQuestionId || 'tp_code_01';
        this.currentQuestionId = pqid;
        mainEl.innerHTML = renderPlaygroundView(
          pqid,
          this.playgroundActiveTab,
          this.playgroundActiveCaseIdx,
          this.playgroundCode,
          this.playgroundRunResults,
          this.playgroundSubmission
        );
        this.updateLineNumbers();
        break;

      case 'question':
        const qid = this.routeParams.qid || 'tp_01';
        this.currentQuestionId = qid;
        mainEl.innerHTML = renderQuestionView(qid, this.selectedOptionIdx, this.questionFeedback, this.testCaseResults);
        this.startTimer();
        break;

      case 'insight':
        mainEl.innerHTML = renderConceptInsightView(state);
        break;

      case 'explanation':
        const topic = this.routeParams.topic || 'two-pointer';
        mainEl.innerHTML = renderConceptExplanationView(topic);
        break;

      case 'recovery':
        if (state.activeRecoveryGate) {
          mainEl.innerHTML = renderRecoveryGateView(state);
        } else {
          mainEl.innerHTML = renderRecoveryPathView(state);
        }
        break;

      case 'retest':
        mainEl.innerHTML = renderRetestView(this.retestCurrentIdx, this.retestUserAnswers, this.retestCompleted);
        break;

      case 'progress':
        mainEl.innerHTML = renderProgressView(state);
        break;

      case 'mistakes':
        mainEl.innerHTML = renderMistakesView(state);
        break;

      case 'profile':
        mainEl.innerHTML = renderProfileView(state);
        break;

      default:
        mainEl.innerHTML = renderLandingView();
        break;
    }
  }

  updateLineNumbers() {
    const textarea = document.getElementById('playground-code-input');
    const gutter = document.getElementById('line-numbers-gutter');
    if (textarea && gutter) {
      const lines = (textarea.value.split('\n').length) || 1;
      gutter.textContent = Array.from({ length: Math.max(16, lines) }, (_, i) => i + 1).join('\n');
    }
  }

  startTimer() {
    this.stopTimer();
    this.secondsElapsed = 0;
    this.timerInterval = setInterval(() => {
      this.secondsElapsed++;
      const timerEl = document.getElementById('timer-display');
      if (timerEl) {
        const mins = String(Math.floor(this.secondsElapsed / 60)).padStart(2, '0');
        const secs = String(this.secondsElapsed % 60).padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  attachEventListeners() {
    // Input event for Playground Code textarea to sync line numbers
    document.addEventListener('input', (e) => {
      if (e.target.id === 'playground-code-input') {
        this.playgroundCode = e.target.value;
        this.updateLineNumbers();
      }
    });

    // Keyboard Tab Indentation inside editor
    document.addEventListener('keydown', (e) => {
      if (e.target.id === 'playground-code-input' && e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
        this.playgroundCode = textarea.value;
        this.updateLineNumbers();
      }
    });

    document.addEventListener('click', (e) => {
      // 1. Print / Save as PDF Button
      if (e.target.closest('#btn-print-pdf')) {
        window.print();
        return;
      }

      // 2. Submit Sign In / Sign Up Form
      if (e.target.closest('#btn-submit-auth-action')) {
        const nameInput = document.getElementById('auth-fullname');
        const emailInput = document.getElementById('auth-email');
        const name = nameInput ? nameInput.value.trim() : 'Student';
        const email = emailInput ? emailInput.value.trim() : 'student@example.com';
        
        store.setUser(name || 'Student', email);
        this.isLoggedIn = true;
        this.showToast(`Welcome, ${name || 'Student'}!`, 'Logged in successfully.', 'success');
        this.navigate('dashboard');
        return;
      }

      // 3. Log Out Button
      if (e.target.closest('#btn-logout')) {
        this.isLoggedIn = false;
        this.showToast('Logged Out', 'You have been signed out.', 'info');
        this.navigate('landing');
        return;
      }

      // 4. Reset All Progress to 0%
      if (e.target.closest('#btn-reset-fresh-progress')) {
        store.resetAllData();
        this.showToast('Progress Reset', 'All scores, attempts, and green ticks reset to 0%.', 'info');
        this.navigate('dashboard');
        return;
      }

      // 5. Subject Tab Click
      const subjectTab = e.target.closest('.subject-tab[data-subject]');
      if (subjectTab) {
        const subj = subjectTab.getAttribute('data-subject');
        this.activeSubject = subj;
        if (subj === 'java') {
          this.showToast('Java Track Active', 'Viewing Java Array & DSA topics.', 'info');
        } else {
          this.showToast(`${subj.toUpperCase()} Track`, 'Java Arrays is currently the primary focused track.', 'info');
        }
        this.render();
        return;
      }

      // 6. Route Navigation Click
      const routeTarget = e.target.closest('[data-route]');
      if (routeTarget) {
        const route = routeTarget.getAttribute('data-route');
        const qid = routeTarget.getAttribute('data-qid');
        const topic = routeTarget.getAttribute('data-topic');
        this.navigate(route, { qid, topic });
        return;
      }

      // 7. Mobile Nav Toggle
      if (e.target.closest('#mobile-menu-toggle')) {
        const navLinks = document.getElementById('desktop-nav-links');
        if (navLinks) navLinks.classList.toggle('mobile-open');
        return;
      }

      // 8. Solve / Code Question Launcher
      const solveQBtn = e.target.closest('.btn-solve-question');
      if (solveQBtn) {
        const qid = solveQBtn.getAttribute('data-qid');
        const type = solveQBtn.getAttribute('data-type');
        if (type === 'CODING' || (qid && (qid.includes('code') || qid.startsWith('lc_')))) {
          this.navigate('playground', { qid });
        } else {
          this.navigate('question', { qid });
        }
        return;
      }

      // 9. Recovery Step Launcher
      const stepBtn = e.target.closest('.btn-launch-step');
      if (stepBtn) {
        const stepType = stepBtn.getAttribute('data-step-type');
        const qid = stepBtn.getAttribute('data-qid');
        const stepIdx = parseInt(stepBtn.getAttribute('data-step-index') || '0', 10);
        const topicId = stepBtn.getAttribute('data-topic') || (store.getState().recoveryPath?.topicId) || 'two-pointer';

        if (stepType === 'CONCEPT_REFRESH' || stepIdx === 0) {
          this.navigate('notes', { topic: topicId });
        } else if (stepType === 'RE_TEST' || stepIdx === 4) {
          this.navigate('retest');
        } else if (stepType === 'CODING_CHALLENGE' || stepIdx === 3 || (qid && (qid.includes('code') || qid.startsWith('lc_')))) {
          this.navigate('playground', { qid: qid || 'tp_code_01' });
        } else if (qid) {
          this.navigate('question', { qid });
        } else {
          this.navigate('notes', { topic: topicId });
        }
        return;
      }

      // 10. Playground Tab Switching
      if (e.target.closest('#tab-btn-desc')) {
        this.playgroundActiveTab = 'description';
        this.render();
        return;
      }
      if (e.target.closest('#tab-btn-hints') || e.target.closest('#btn-open-hint-tab')) {
        this.playgroundActiveTab = 'hints';
        this.render();
        return;
      }
      if (e.target.closest('#tab-btn-subs')) {
        this.playgroundActiveTab = 'submissions';
        this.render();
        return;
      }

      // 11. Playground Testcase Tab Selection
      const caseTab = e.target.closest('.testcase-tab[data-case-idx]');
      if (caseTab) {
        this.playgroundActiveCaseIdx = parseInt(caseTab.getAttribute('data-case-idx'), 10);
        this.render();
        return;
      }

      // 12. Playground Run Code
      if (e.target.closest('#btn-playground-run')) {
        this.handlePlaygroundRun();
        return;
      }

      // 13. Playground Submit Answer
      if (e.target.closest('#btn-playground-submit')) {
        this.handlePlaygroundSubmit();
        return;
      }

      // 14. Close Acceptance Modal
      if (e.target.closest('#btn-close-acceptance') || e.target.id === 'acceptance-modal-overlay') {
        this.playgroundSubmission = null;
        this.render();
        return;
      }

      // 15. Reset Code Button
      if (e.target.closest('#btn-reset-code')) {
        const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
        if (question) {
          this.playgroundCode = question.starterCode || '';
          this.playgroundRunResults = null;
          this.render();
          this.showToast('Code Reset', 'Restored starter skeleton.', 'info');
        }
        return;
      }

      // 16. MCQ Option Selection
      const mcqOpt = e.target.closest('.mcq-option-card[data-opt-idx]');
      if (mcqOpt && !this.questionFeedback) {
        const idx = parseInt(mcqOpt.getAttribute('data-opt-idx'), 10);
        this.selectedOptionIdx = idx;
        const optionsList = document.querySelectorAll('.mcq-option-card[data-opt-idx]');
        optionsList.forEach(card => {
          if (parseInt(card.getAttribute('data-opt-idx'), 10) === idx) card.classList.add('selected');
          else card.classList.remove('selected');
        });
        const submitBtn = document.getElementById('btn-submit-answer');
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      // 17. MCQ Submit Answer
      if (e.target.closest('#btn-submit-answer')) {
        this.handleSubmitAnswer();
        return;
      }

      // 18. AI Hint
      if (e.target.closest('#btn-get-ai-hint')) {
        this.handleGetHint();
        return;
      }

      // 19. Explanation "Ready" Button
      const expReadyBtn = e.target.closest('#btn-explanation-ready');
      if (expReadyBtn) {
        const qid = expReadyBtn.getAttribute('data-qid') || 'tp_01';
        this.navigate('question', { qid });
        return;
      }

      // 20. Re-Test Option Selection
      const retestOpt = e.target.closest('.mcq-option-card[data-retest-opt]');
      if (retestOpt) {
        const optIdx = parseInt(retestOpt.getAttribute('data-retest-opt'), 10);
        const currentQId = QUESTIONS_DB.filter(q => q.id.startsWith('retest_'))[this.retestCurrentIdx].id;
        this.retestUserAnswers[currentQId] = optIdx;
        this.render();
        return;
      }

      // 21. Re-Test Next / Finish Button
      if (e.target.closest('#btn-retest-next')) {
        const retestQuestions = QUESTIONS_DB.filter(q => q.id.startsWith('retest_'));
        if (this.retestCurrentIdx < retestQuestions.length - 1) {
          this.retestCurrentIdx++;
          this.render();
        } else {
          let correct = 0;
          retestQuestions.forEach(q => {
            if (this.retestUserAnswers[q.id] === q.correct_answer) correct++;
          });
          this.retestCompleted = true;
          store.applyRetestResults(correct, retestQuestions.length);
          this.showToast('Concept Recovery Complete! 🎉', 'Mastery updated with verified gain.', 'success');
          this.render();
        }
        return;
      }

      // 22. Re-Test Return to Dashboard
      if (e.target.closest('#btn-retest-finish-dashboard')) {
        this.navigate('dashboard');
        return;
      }

      // 23. Retry Question from feedback
      if (e.target.closest('#btn-feedback-retry')) {
        this.selectedOptionIdx = null;
        this.questionFeedback = null;
        this.render();
        return;
      }

      // ==========================================
      // 24. STRICT RECOVERY GATE EVENT HANDLERS
      // ==========================================

      // Stage 1: Mark Notes Read & Complete
      if (e.target.closest('#btn-complete-stage-1')) {
        store.markRecoveryNotesCompleted();
        this.showToast('Stage 1 Complete ✓', 'Proceeding to 5 Diagnostic MCQs.', 'success');
        this.render();
        return;
      }

      // Stage 2: Click on MCQ Option
      const recOptBtn = e.target.closest('.recovery-option-btn[data-opt-index]');
      if (recOptBtn) {
        const mcqContainer = document.getElementById('recovery-mcq-container');
        if (mcqContainer && !mcqContainer.classList.contains('answered')) {
          mcqContainer.classList.add('answered');
          const chosenIdx = parseInt(recOptBtn.getAttribute('data-opt-index'), 10);
          const correctIdx = parseInt(mcqContainer.getAttribute('data-correct'), 10);
          const isCorrect = (chosenIdx === correctIdx);
          this.lastRecoveryMCQCorrect = isCorrect;

          const allOptions = mcqContainer.querySelectorAll('.recovery-option-btn');
          allOptions.forEach((btn, idx) => {
            if (idx === correctIdx) {
              btn.classList.add('opt-correct');
            } else if (idx === chosenIdx && !isCorrect) {
              btn.classList.add('opt-wrong');
            }
          });

          const feedbackBox = document.getElementById('mcq-feedback-box');
          const feedbackText = document.getElementById('mcq-feedback-text');
          if (feedbackBox && feedbackText) {
            feedbackBox.style.display = 'block';
            if (isCorrect) {
              feedbackBox.style.background = '#ECFDF5';
              feedbackBox.style.border = '1.5px solid #A7F3D0';
              feedbackText.innerHTML = '<span style="color: #047857;">✓ Correct! Invariant applied accurately.</span>';
            } else {
              feedbackBox.style.background = '#FEF2F2';
              feedbackBox.style.border = '1.5px solid #FECACA';
              feedbackText.innerHTML = '<span style="color: #B91C1C;">✗ Incorrect. See explanation below:</span>';
            }
          }
        }
        return;
      }

      // Stage 2: Next MCQ Button
      if (e.target.closest('#btn-next-mcq')) {
        store.recordRecoveryMCQ(this.lastRecoveryMCQCorrect !== false);
        this.render();
        return;
      }

      // Stage 3: Launch Recovery Coding Problem
      const recCodeBtn = e.target.closest('.btn-launch-recovery-code');
      if (recCodeBtn) {
        const qid = recCodeBtn.getAttribute('data-qid');
        this.navigate('playground', { qid });
        return;
      }

      // Stage 3: Finish All Challenges
      if (e.target.closest('#btn-finish-recovery-gate')) {
        store.completeRecoveryGate();
        this.showToast('Remediation Complete! 🎉', 'Concept gap resolved! 100% Mastery achieved.', 'success');
        this.render();
        return;
      }

      // Advance to Next Recommended Topic
      const advBtn = e.target.closest('#btn-advance-next-topic');
      if (advBtn) {
        const nextTopic = advBtn.getAttribute('data-topic') || 'sliding-window';
        store.dismissRecoveryGate();
        this.navigate('practice', { topic: nextTopic });
        this.showToast('New Topic Unlocked! 🚀', `Welcome to ${nextTopic}!`, 'success');
        return;
      }
    });

    // Handle Practice Filter Changes
    document.addEventListener('change', (e) => {
      if (e.target.id === 'topic-filter') {
        this.selectedPracticeTopic = e.target.value;
        this.render();
      } else if (e.target.id === 'difficulty-filter') {
        this.selectedPracticeDifficulty = e.target.value;
        this.render();
      }
    });
  }

  handlePlaygroundRun() {
    const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
    if (!question) return;

    const textarea = document.getElementById('playground-code-input');
    const code = textarea ? textarea.value : (this.playgroundCode || '');
    this.playgroundCode = code;

    const result = CodeExecutionEngine.runTestCases(question, code, false);
    this.playgroundRunResults = result;

    if (result.success) {
      this.showToast('Test Cases Passed! ✓', `${result.passedCount}/${result.totalCount} public cases matched.`, 'success');
    } else {
      this.showToast('Test Case Mismatch', `Failed on Case ${result.results.findIndex(r => !r.passed) + 1}. Check your output.`, 'error');
    }

    this.render();
  }

  handlePlaygroundSubmit() {
    const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
    if (!question) return;

    const textarea = document.getElementById('playground-code-input');
    const code = textarea ? textarea.value : (this.playgroundCode || '');
    this.playgroundCode = code;

    const result = CodeExecutionEngine.runTestCases(question, code, true);
    this.playgroundRunResults = result;

    if (result.success) {
      this.stopTimer();
      store.markQuestionSolved(question.id);
      
      // If recovery gate is active, record coding challenge pass
      const currentState = store.getState();
      if (currentState.activeRecoveryGate && currentState.activeRecoveryGate.topicId === question.topic) {
        store.recordRecoveryCodePass(question.id);
      }

      store.recordAttempt({
        question,
        isCorrect: true,
        timeSpentSeconds: this.secondsElapsed,
        codeSubmitted: code
      });

      this.playgroundSubmission = result;
      this.showToast('Accepted! Green Tick Applied ✓', `Mastery increased for ${question.topic}!`, 'success');
    } else {
      store.recordAttempt({
        question,
        isCorrect: false,
        timeSpentSeconds: this.secondsElapsed,
        codeSubmitted: code
      });

      // Automatically trigger Concept Recovery Gate if not already active
      const currentState = store.getState();
      if (!currentState.activeRecoveryGate || currentState.activeRecoveryGate.status === 'RESOLVED') {
        store.triggerRecoveryGate(question.topic, question.subtopic || question.title);
      }

      this.showToast('Concept Recovery Recommended 🚨', `We noticed difficulty on ${question.subtopic || question.title}. Let's repair this concept!`, 'warning');
    }

    this.render();
  }

  handleSubmitAnswer() {
    const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
    if (!question) return;

    this.stopTimer();
    if (this.selectedOptionIdx === null) {
      this.showToast('Select an Answer', 'Please choose an option before submitting.', 'warning');
      return;
    }

    const isCorrect = (this.selectedOptionIdx === question.correct_answer);

    this.questionFeedback = {
      isCorrect,
      selectedAnswer: this.selectedOptionIdx,
      timeSpent: this.secondsElapsed
    };

    store.recordAttempt({
      question,
      isCorrect,
      timeSpentSeconds: this.secondsElapsed,
      selectedAnswer: this.selectedOptionIdx
    });

    if (isCorrect) {
      store.markQuestionSolved(question.id);
      this.showToast('Correct Solution! ✓', `Mastery updated and question marked solved.`, 'success');
    } else {
      this.showToast('Concept Insight Detected 💡', `Identified gap in ${question.concept || 'Index Boundaries'}.`, 'warning');
    }

    this.render();
  }

  async handleGetHint() {
    const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
    if (!question) return;

    const hintData = await AIService.getHint(question);
    const hintBox = document.getElementById('ai-hint-box');
    const hintText = document.getElementById('ai-hint-text');

    if (hintBox && hintText) {
      hintText.textContent = hintData.hintText;
      hintBox.style.display = 'block';
      this.showToast('AI Hint Loaded', 'Review the concept advice below.', 'info');
    }
  }

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-mount');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new LearnPathApp();
});
