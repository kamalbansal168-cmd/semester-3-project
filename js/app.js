/* ============================================================
   LEARNPATH AI â€” Main Application Orchestrator & Router (With Notes & 12 Topics)
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
import { vfs } from './engine/virtualFileSystem.js';

class LearnPathApp {
  constructor() {
    this.currentRoute = 'landing';
    // Fix #2: Restore login state from localStorage on page refresh
    this.isLoggedIn = localStorage.getItem('learnpath_logged_in') === 'true';
    this.routeParams = {};
    
    // Active Question State
    this.currentQuestionId = null;
    this.selectedOptionIdx = null;
    this.questionFeedback = null;
    this.timerInterval = null;
    this.secondsElapsed = 0;

    // Active Playground State â€” Freeform IntelliJ IDEA IDE with Monaco & VFS
    this.ideActiveTab = 'terminal';
    const _initRoot = vfs.projectName || 'java';
    const _initFiles = Object.keys(vfs.getAllFiles());
    this.ideCurrentFile = _initFiles[0] || `${_initRoot}/Main.java`;
    this.ideOpenTabs = [this.ideCurrentFile];
    this.ideStdin = null;          // null = use file's default
    this.ideExecutionResult = null;
    this.monacoInstance = null;
    this.contextMenuTarget = null; // { type: 'folder'|'file'|'root', path: '...' }

    // Legacy playground state kept for DSA challenge pages
    this.playgroundActiveTab = 'description';
    this.playgroundActiveCaseIdx = 0;
    this.playgroundCode = null;
    this.playgroundRunResults = null;
    this.playgroundSubmission = null;
    this.customTestResult = null;

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
    // Fix #2: If logged in but on landing page, redirect to dashboard
    if (this.isLoggedIn) {
      this.currentRoute = 'dashboard';
    }
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
      // New freeform IDE â€” reset to fresh state on navigate
      this.ideActiveTab = 'terminal';
      const projectRoot = vfs.projectName || 'java';
      const allFiles = Object.keys(vfs.getAllFiles());
      const fileToOpen = params.filepath || allFiles[0] || `${projectRoot}/Main.java`;
      this.ideCurrentFile = fileToOpen;
      if (!this.ideOpenTabs.includes(fileToOpen)) {
        this.ideOpenTabs = [fileToOpen];
      }
      this.ideStdin = null;
      this.ideExecutionResult = null;
    }

    // Fix #5: Start timer only on initial navigation to 'question', not on every render
    if (route === 'question') {
      this.stopTimer();
      this.secondsElapsed = 0;
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

      case 'notes': {
        const noteTopic = this.routeParams.topic || 'basic-arrays';
        mainEl.innerHTML = renderNotesView(noteTopic);
        break;
      }

      case 'practice':
        mainEl.innerHTML = renderPracticeView(state, this.selectedPracticeTopic, this.selectedPracticeDifficulty);
        break;

      case 'playground':
        mainEl.innerHTML = renderPlaygroundView(
          this.ideCurrentFile,
          this.ideActiveTab,
          this.ideOpenTabs,
          this.ideStdin,
          this.ideExecutionResult
        );
        setTimeout(() => this.initMonacoEditor(), 50);
        break;

      case 'question': {
        const qid = this.routeParams.qid || 'tp_01';
        this.currentQuestionId = qid;
        // Fix #5: DO NOT call startTimer() here â€” it's called in navigate() to avoid reset on every render
        mainEl.innerHTML = renderQuestionView(qid, this.selectedOptionIdx, this.questionFeedback, this.testCaseResults);
        break;
      }

      case 'insight':
        mainEl.innerHTML = renderConceptInsightView(state);
        break;

      case 'explanation': {
        const topic = this.routeParams.topic || 'two-pointer';
        mainEl.innerHTML = renderConceptExplanationView(topic);
        break;
      }

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
    // Input event for Playground Code textarea and Stdin inputs
    document.addEventListener('input', (e) => {
      if (e.target.id === 'playground-code-input') {
        if (this.currentRoute === 'playground') {
          this.ideCode = e.target.value;
        } else {
          this.playgroundCode = e.target.value;
        }
        this.updateLineNumbers();
      }
      
      // Standard input synchronization between quick bar and full tab
      if (e.target.id === 'ide-stdin-input' || e.target.id === 'quick-stdin-input') {
        const val = e.target.value;
        this.ideStdin = val;
        
        const otherId = e.target.id === 'ide-stdin-input' ? 'quick-stdin-input' : 'ide-stdin-input';
        const otherEl = document.getElementById(otherId);
        if (otherEl && otherEl.value !== val) {
          otherEl.value = val;
        }

        // Update live token counters
        const tokens = val.trim() ? val.trim().split(/\s+/).length : 0;
        const lines = val ? val.split('\n').length : 0;
        
        const metaTag = document.getElementById('quick-stdin-meta');
        if (metaTag) metaTag.textContent = `${tokens} tokens`;

        const metaCounter = document.getElementById('stdin-meta-counter');
        if (metaCounter) metaCounter.textContent = `${tokens} tokens â€¢ ${lines} lines â€¢ ${val.length} chars`;

        const tabBadge = document.querySelector('.stdin-tab-badge');
        if (tabBadge) tabBadge.textContent = tokens;
      }
    });

    // IntelliJ Smart Code Editor Keyboard Interactions
    document.addEventListener('keydown', (e) => {
      const textarea = e.target;
      if (textarea.id !== 'playground-code-input') return;

      // 1. Run Code Shortcut: Shift + F10 or Ctrl + Enter
      if ((e.key === 'F10' && e.shiftKey) || (e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (this.currentRoute === 'playground') {
          this.handleIDERun();
        } else {
          this.handlePlaygroundRun();
        }
        return;
      }

      // 2. Tab & Shift+Tab Indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;

        if (e.shiftKey) {
          // Outdent
          const lineStart = val.lastIndexOf('\n', start - 1) + 1;
          if (val.substring(lineStart, lineStart + 4) === '    ') {
            textarea.value = val.substring(0, lineStart) + val.substring(lineStart + 4);
            textarea.selectionStart = textarea.selectionEnd = Math.max(lineStart, start - 4);
          }
        } else {
          // Indent 4 spaces
          textarea.value = val.substring(0, start) + '    ' + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }
        this.playgroundCode = textarea.value;
        this.updateLineNumbers();
        return;
      }

      // 3. Smart Enter with Auto-Indentation & Brace Expansion
      if (e.key === 'Enter') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;

        // Current line indentation
        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        const currentLine = val.substring(lineStart, start);
        const baseIndent = (currentLine.match(/^\s*/) || [''])[0];

        const charBefore = val.charAt(start - 1);
        const charAfter = val.charAt(start);

        // Case A: Enter pressed between { and }
        if (charBefore === '{' && charAfter === '}') {
          const insert = '\n' + baseIndent + '    \n' + baseIndent;
          textarea.value = val.substring(0, start) + insert + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + baseIndent.length + 5;
        } 
        // Case B: Enter after opening brace { or colon or (
        else if (charBefore === '{' || charBefore === '(' || charBefore === '[' || charBefore === ':') {
          const insert = '\n' + baseIndent + '    ';
          textarea.value = val.substring(0, start) + insert + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + insert.length;
        } 
        // Case C: Standard newline with matched indent
        else {
          const insert = '\n' + baseIndent;
          textarea.value = val.substring(0, start) + insert + val.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + insert.length;
        }

        this.playgroundCode = textarea.value;
        this.updateLineNumbers();
        return;
      }

      // 4. Auto-Closing Brackets & Quotes: { }, ( ), [ ], " ", ' '
      const pairMap = {
        '{': '}',
        '(': ')',
        '[': ']',
        '"': '"',
        "'": "'"
      };

      if (pairMap[e.key]) {
        e.preventDefault();
        const openChar = e.key;
        const closeChar = pairMap[openChar];
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;
        const selected = val.substring(start, end);

        textarea.value = val.substring(0, start) + openChar + selected + closeChar + val.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1 + selected.length;
        this.playgroundCode = textarea.value;
        this.updateLineNumbers();
        return;
      }

      // 5. Backspace pair deletion (e.g. backspacing { deletes both { and } )
      if (e.key === 'Backspace') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (start === end && start > 0) {
          const charBefore = textarea.value.charAt(start - 1);
          const charAfter = textarea.value.charAt(start);
          if ((charBefore === '{' && charAfter === '}') ||
              (charBefore === '(' && charAfter === ')') ||
              (charBefore === '[' && charAfter === ']') ||
              (charBefore === '"' && charAfter === '"') ||
              (charBefore === "'" && charAfter === "'")) {
            e.preventDefault();
            textarea.value = textarea.value.substring(0, start - 1) + textarea.value.substring(start + 1);
            textarea.selectionStart = textarea.selectionEnd = start - 1;
            this.playgroundCode = textarea.value;
            this.updateLineNumbers();
            return;
          }
        }
      }
    });

    document.addEventListener('click', (e) => {

      // Close 3-dot dropdown when clicking outside
      const dotsWrapper = document.getElementById('nav-dots-wrapper');
      if (dotsWrapper && !dotsWrapper.contains(e.target)) {
        const dropdown = document.getElementById('nav-dots-dropdown');
        const btn = document.getElementById('nav-dots-toggle');
        if (dropdown && dropdown.classList.contains('open')) {
          dropdown.classList.remove('open');
          btn && btn.classList.remove('open');
          btn && btn.setAttribute('aria-expanded', 'false');
        }
      }

      // ============================================================
      // FREEFORM INTELLIJ IDE HANDLERS (playground route)
      // ============================================================

      // Hide context menu on any outside click
      const ctxMenu = document.getElementById('ide-context-menu');
      if (ctxMenu && ctxMenu.style.display !== 'none' && !e.target.closest('#ide-context-menu')) {
        this.hideContextMenu();
      }

      // IDE Run Code Button
      if (e.target.closest('#btn-ide-run-code')) {
        this.handleIDERun();
        return;
      }

      // IDE Run with stdin Button (from stdin tab or quick bar)
      if (e.target.closest('#btn-run-with-stdin') || e.target.closest('#btn-quick-run-stdin')) {
        this.handleIDERun();
        return;
      }

      // Quick Switch to Full Stdin Tab Button
      if (e.target.closest('#btn-quick-switch-stdin') && this.currentRoute === 'playground') {
        this.ideActiveTab = 'stdin';
        this.render();
        return;
      }

      // Stdin Preset Pill Click
      const presetBtn = e.target.closest('.btn-preset-pill');
      if (presetBtn && this.currentRoute === 'playground') {
        const presetVal = presetBtn.getAttribute('data-preset');
        const val = presetVal === 'clear' ? '' : presetVal;
        this.ideStdin = val;
        
        const stdinArea = document.getElementById('ide-stdin-input');
        if (stdinArea) stdinArea.value = val;
        const quickInput = document.getElementById('quick-stdin-input');
        if (quickInput) quickInput.value = val;

        const tokens = val.trim() ? val.trim().split(/\s+/).length : 0;
        const lines = val ? val.split('\n').length : 0;
        const metaCounter = document.getElementById('stdin-meta-counter');
        if (metaCounter) metaCounter.textContent = `${tokens} tokens â€¢ ${lines} lines â€¢ ${val.length} chars`;
        const tabBadge = document.querySelector('.stdin-tab-badge');
        if (tabBadge) tabBadge.textContent = tokens;
        
        this.showToast('Stdin Preset Loaded', presetVal === 'clear' ? 'Stdin cleared.' : `Loaded: "${presetVal.replace(/\n/g, ' ')}"`, 'info');
        return;
      }

      // IDE Clear Console
      if (e.target.closest('#btn-clear-console')) {
        this.ideExecutionResult = null;
        this.ideActiveTab = 'terminal';
        this.render();
        return;
      }

      // IDE Format Code Button
      if (e.target.closest('#btn-format-code') && this.currentRoute === 'playground') {
        if (this.monacoInstance) {
          this.monacoInstance.getAction('editor.action.formatDocument')?.run();
          this.showToast('Formatted ðŸ§¹', 'Monaco code formatting applied.', 'info');
        } else {
          const textarea = document.getElementById('playground-code-input');
          if (textarea && textarea.value) {
            const lines = textarea.value.split('\n');
            let depth = 0;
            const formatted = lines.map(line => {
              const trimmed = line.trim();
              if (!trimmed) return '';
              if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
                depth = Math.max(0, depth - 1);
              }
              const res = '    '.repeat(depth) + trimmed;
              if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
                depth++;
              }
              return res;
            }).join('\n');
            textarea.value = formatted;
            vfs.writeFile(this.ideCurrentFile, formatted);
            this.showToast('Formatted ðŸ§¹', '4-space indentation applied.', 'info');
          }
        }
        return;
      }

      // IDE Reset Code Button
      if (e.target.closest('#btn-reset-code') && this.currentRoute === 'playground') {
        this.showModalConfirm('Reset Workspace', 'Do you want to reset all files and folders to default templates?', () => {
          vfs.resetToDefaults();
          this.ideCurrentFile = 'java/Main.java';
          this.ideOpenTabs = ['java/Main.java'];
          this.ideStdin = null;
          this.ideExecutionResult = null;
          this.render();
          this.showToast('Workspace Reset â†º', 'Restored default files & folders.', 'info');
        });
        return;
      }

      // Tab Item Click (Switch Tab)
      const tabItem = e.target.closest('.ide-tab-item[data-tabpath]');
      const closeBtn = e.target.closest('.tab-close-btn[data-closepath]');
      if (tabItem && !closeBtn && this.currentRoute === 'playground') {
        const path = tabItem.getAttribute('data-tabpath');
        this.switchToFile(path);
        return;
      }

      // Tab Close Button Click
      if (closeBtn && this.currentRoute === 'playground') {
        const path = closeBtn.getAttribute('data-closepath');
        this.closeTab(path);
        return;
      }

      // Tree Folder Row Click (Expand / Collapse)
      const folderRow = e.target.closest('.tree-folder-row[data-folderpath]');
      if (folderRow && this.currentRoute === 'playground') {
        const folderPath = folderRow.getAttribute('data-folderpath');
        vfs.toggleFolder(folderPath);
        this.render();
        return;
      }

      // Open Folder Actions
      if (e.target.closest('#btn-header-open-folder') || 
          e.target.closest('#btn-vscode-open-folder') || 
          e.target.closest('#btn-open-folder-hero') || 
          e.target.closest('#btn-quick-import-bottom') ||
          e.target.closest('#ctx-open-folder')) {
        const fileInput = document.getElementById('vfs-folder-input');
        if (fileInput) {
          fileInput.value = '';
          fileInput.click();
        }
        return;
      }

      // Root Section Toggle (e.g. âˆ¨ JAVA)
      if (e.target.closest('#btn-toggle-root-section')) {
        vfs.toggleFolder(vfs.projectName);
        this.render();
        return;
      }

      // Explorer Refresh
      if (e.target.closest('#btn-tree-refresh')) {
        this.render();
        this.showToast('Refreshed', 'Explorer refreshed.', 'info');
        return;
      }

      // Tree File Row Click (Open File)
      const fileRow = e.target.closest('.tree-file-row[data-filepath]');
      if (fileRow && this.currentRoute === 'playground') {
        const filepath = fileRow.getAttribute('data-filepath');
        this.switchToFile(filepath);
        return;
      }

      // Tree Action: New Class / New File from Header
      if (e.target.closest('#btn-ide-new-file') || e.target.closest('#btn-tree-new-file')) {
        this.promptNewClass(vfs.projectName || 'java');
        return;
      }

      // Tree Action: New Folder from Header
      if (e.target.closest('#btn-tree-new-folder')) {
        this.promptNewFolder(vfs.projectName || 'java');
        return;
      }

      // Tree Action: Expand All / Collapse All
      if (e.target.closest('#btn-tree-expand-all')) {
        vfs.expandAll();
        this.render();
        return;
      }
      if (e.target.closest('#btn-tree-collapse-all')) {
        vfs.collapseAll();
        this.render();
        return;
      }

      // Context Menu Actions
      if (e.target.closest('#ctx-new-class')) {
        const baseFolder = this.contextMenuTarget?.type === 'folder' ? this.contextMenuTarget.path : (this.contextMenuTarget?.path ? this.contextMenuTarget.path.split('/').slice(0, -1).join('/') : vfs.projectName);
        this.hideContextMenu();
        this.promptNewClass(baseFolder || vfs.projectName);
        return;
      }
      if (e.target.closest('#ctx-new-file')) {
        const baseFolder = this.contextMenuTarget?.type === 'folder' ? this.contextMenuTarget.path : (this.contextMenuTarget?.path ? this.contextMenuTarget.path.split('/').slice(0, -1).join('/') : vfs.projectName);
        this.hideContextMenu();
        this.promptNewFile(baseFolder || vfs.projectName);
        return;
      }
      if (e.target.closest('#ctx-new-folder')) {
        const baseFolder = this.contextMenuTarget?.type === 'folder' ? this.contextMenuTarget.path : (this.contextMenuTarget?.path ? this.contextMenuTarget.path.split('/').slice(0, -1).join('/') : vfs.projectName);
        this.hideContextMenu();
        this.promptNewFolder(baseFolder || vfs.projectName);
        return;
      }
      if (e.target.closest('#ctx-rename')) {
        const targetPath = this.contextMenuTarget?.path;
        this.hideContextMenu();
        if (targetPath) this.promptRename(targetPath);
        return;
      }
      if (e.target.closest('#ctx-delete')) {
        const targetPath = this.contextMenuTarget?.path;
        this.hideContextMenu();
        if (targetPath) this.confirmDelete(targetPath);
        return;
      }

      // IDE Tool Window Tab: Terminal
      if (e.target.closest('#tool-tab-terminal') && this.currentRoute === 'playground') {
        this.ideActiveTab = 'terminal';
        const tv = document.getElementById('view-terminal-content');
        const sv = document.getElementById('view-stdin-content');
        const dv = document.getElementById('view-dsa-content');
        if (tv) tv.style.display = 'block';
        if (sv) sv.style.display = 'none';
        if (dv) dv.style.display = 'none';
        document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.closest('#tool-tab-terminal').classList.add('active');
        return;
      }

      // IDE Tool Window Tab: Stdin
      if (e.target.closest('#tool-tab-stdin') && this.currentRoute === 'playground') {
        this.ideActiveTab = 'stdin';
        const tv = document.getElementById('view-terminal-content');
        const sv = document.getElementById('view-stdin-content');
        const dv = document.getElementById('view-dsa-content');
        if (tv) tv.style.display = 'none';
        if (sv) sv.style.display = 'block';
        if (dv) dv.style.display = 'none';
        document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.closest('#tool-tab-stdin').classList.add('active');
        return;
      }

      // IDE Tool Window Tab: DSA Testcases
      if (e.target.closest('#tool-tab-dsa') && this.currentRoute === 'playground') {
        this.ideActiveTab = 'dsa_test';
        const tv = document.getElementById('view-terminal-content');
        const sv = document.getElementById('view-stdin-content');
        const dv = document.getElementById('view-dsa-content');
        if (tv) tv.style.display = 'none';
        if (sv) sv.style.display = 'none';
        if (dv) dv.style.display = 'block';
        document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
        e.target.closest('#tool-tab-dsa').classList.add('active');
        return;
      }

      // ============================================================

      // 1. Print / Save as PDF Button
      if (e.target.closest('#btn-print-pdf')) {
        window.print();
        return;
      }

      // 2. Submit Sign In / Sign Up Form
      if (e.target.closest('#btn-submit-auth-action')) {
        const nameInput = document.getElementById('auth-fullname');
        const emailInput = document.getElementById('auth-email');
        const passwordInput = document.getElementById('auth-password');

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // --- Validation ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
          this.showToast('Invalid Email', 'Please enter a valid email address.', 'error');
          if (emailInput) emailInput.focus();
          return;
        }
        if (!password || password.length < 6) {
          this.showToast('Weak Password', 'Password must be at least 6 characters.', 'error');
          if (passwordInput) passwordInput.focus();
          return;
        }
        if (nameInput && name.length < 2) {
          this.showToast('Name Required', 'Please enter your full name (at least 2 characters).', 'error');
          if (nameInput) nameInput.focus();
          return;
        }

        const displayName = name || email.split('@')[0];
        store.setUser(displayName, email);
        this.isLoggedIn = true;
        localStorage.setItem('learnpath_logged_in', 'true');
        localStorage.setItem('learnpath_user_email', email);
        this.showToast(`Welcome, ${displayName}! ðŸŽ‰`, 'Logged in successfully.', 'success');
        this.navigate('dashboard');
        return;
      }

      // 3. Log Out Button
      if (e.target.closest('#btn-logout')) {
        this.isLoggedIn = false;
        // Fix #2: Clear persisted login state on logout
        localStorage.removeItem('learnpath_logged_in');
        localStorage.removeItem('learnpath_user_email');
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
        const requiresAuth = routeTarget.getAttribute('data-requires-auth') === 'true';

        // Fix N6: Guard protected routes â€” redirect to signin if not logged in
        const protectedRoutes = ['dashboard', 'topics', 'practice', 'playground', 'question',
          'recovery', 'retest', 'progress', 'mistakes', 'profile', 'notes', 'insight', 'explanation'];
        if ((requiresAuth || protectedRoutes.includes(route)) && !this.isLoggedIn) {
          this.showToast('Login Required', 'Please sign in to access this feature.', 'warning');
          this.navigate('signin');
          return;
        }

        this.navigate(route, { qid, topic });
        return;
      }

      // 7. 3-Dot Navigation Dropdown Toggle
      if (e.target.closest('#nav-dots-toggle')) {
        const btn = document.getElementById('nav-dots-toggle');
        const dropdown = document.getElementById('nav-dots-dropdown');
        const wrapper = document.getElementById('nav-dots-wrapper');
        if (btn && dropdown) {
          const isOpen = dropdown.classList.contains('open');
          dropdown.classList.toggle('open', !isOpen);
          btn.classList.toggle('open', !isOpen);
          btn.setAttribute('aria-expanded', String(!isOpen));
          dropdown.setAttribute('aria-hidden', String(isOpen));
        }
        return;
      }
      // Close dropdown when clicking a nav-dropdown-item (navigation happens via data-route)
      if (e.target.closest('.nav-dropdown-item') && !e.target.closest('#btn-logout')) {
        const dropdown = document.getElementById('nav-dots-dropdown');
        const btn = document.getElementById('nav-dots-toggle');
        if (dropdown) { dropdown.classList.remove('open'); btn && btn.classList.remove('open'); }
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

      // 10. Playground Sidebar Tab Switching
      if (e.target.closest('#tab-btn-project')) {
        this.playgroundActiveTab = 'project';
        this.render();
        return;
      }
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

      // 10b. IntelliJ Project Tree: Click on any Java problem file to open directly in editor
      const fileTreeRow = e.target.closest('.tree-file-row[data-qid]');
      if (fileTreeRow) {
        const qid = fileTreeRow.getAttribute('data-qid');
        const question = QUESTIONS_DB.find(q => q.id === qid);
        if (question) {
          this.currentQuestionId = qid;
          this.playgroundCode = question.starterCode || '';
          this.playgroundRunResults = null;
          this.customTestResult = null;
          this.render();
          this.showToast('Opened File', `${question.fileName || question.title}`, 'info');
        }
        return;
      }

      // 10c. Format Code Button
      if (e.target.closest('#btn-format-code')) {
        const textarea = document.getElementById('playground-code-input');
        if (textarea && textarea.value) {
          // Cleanly normalize indentations
          const lines = textarea.value.split('\n');
          let depth = 0;
          const formatted = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
              depth = Math.max(0, depth - 1);
            }
            const res = '    '.repeat(depth) + trimmed;
            if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
              depth++;
            }
            return res;
          }).join('\n');
          textarea.value = formatted;
          this.playgroundCode = formatted;
          this.updateLineNumbers();
          this.showToast('Formatted Code ðŸ§¹', 'Applied 4-space IntelliJ code style.', 'info');
        }
        return;
      }

      // 10d. Tool Window Tab Switching
      if (e.target.closest('#tool-tab-testcases')) {
        const tcView = document.getElementById('view-testcases-content');
        const customView = document.getElementById('view-custom-input-content');
        const termView = document.getElementById('view-terminal-content');
        if (tcView && customView && termView) {
          tcView.style.display = 'block';
          customView.style.display = 'none';
          termView.style.display = 'none';
          document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
          e.target.closest('#tool-tab-testcases').classList.add('active');
        }
        return;
      }
      if (e.target.closest('#tool-tab-custom')) {
        const tcView = document.getElementById('view-testcases-content');
        const customView = document.getElementById('view-custom-input-content');
        const termView = document.getElementById('view-terminal-content');
        if (tcView && customView && termView) {
          tcView.style.display = 'none';
          customView.style.display = 'block';
          termView.style.display = 'none';
          document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
          e.target.closest('#tool-tab-custom').classList.add('active');
        }
        return;
      }
      if (e.target.closest('#tool-tab-terminal')) {
        const tcView = document.getElementById('view-testcases-content');
        const customView = document.getElementById('view-custom-input-content');
        const termView = document.getElementById('view-terminal-content');
        if (tcView && customView && termView) {
          tcView.style.display = 'none';
          customView.style.display = 'none';
          termView.style.display = 'block';
          document.querySelectorAll('.tool-tab-btn').forEach(b => b.classList.remove('active'));
          e.target.closest('#tool-tab-terminal').classList.add('active');
        }
        return;
      }

      // 10e. Run Custom Testcase Input
      if (e.target.closest('#btn-run-custom-test')) {
        const question = QUESTIONS_DB.find(q => q.id === this.currentQuestionId);
        const textarea = document.getElementById('playground-code-input');
        const customInputEl = document.getElementById('custom-testcase-input');
        if (question && textarea && customInputEl) {
          const code = textarea.value || '';
          const customInput = customInputEl.value.trim() || question.exampleInput || '';
          const res = CodeExecutionEngine.runCustomInput(question, code, customInput);
          this.customTestResult = res;

          const resBox = document.getElementById('custom-test-result-box');
          const resText = document.getElementById('custom-test-result-text');
          if (resBox && resText) {
            resBox.style.display = 'block';
            resText.className = `testcase-box ${res.success ? 'match' : 'mismatch'}`;
            resText.textContent = res.success ? res.output : `Runtime Error: ${res.error}`;
          }
          this.showToast(res.success ? 'Custom Test Finished âœ“' : 'Custom Test Error âœ•', `${res.executionTimeMs}ms execution`, res.success ? 'success' : 'error');
        }
        return;
      }

      // 11. Playground Testcase Tab Selection
      const caseTab = e.target.closest('.testcase-tab[data-case-idx]');
      if (caseTab) {
        this.playgroundActiveCaseIdx = parseInt(caseTab.getAttribute('data-case-idx'), 10);
        this.render();
        return;
      }

      // 12. Playground Run Code (in playground view)
      if (e.target.closest('#btn-playground-run')) {
        this.handlePlaygroundRun();
        return;
      }

      // Run Code button inside questionView for CODING type questions
      if (e.target.closest('#btn-run-code')) {
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
          this.showToast('Concept Recovery Complete! ðŸŽ‰', 'Mastery updated with verified gain.', 'success');
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
        this.showToast('Stage 1 Complete âœ“', 'Proceeding to 5 Diagnostic MCQs.', 'success');
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
              feedbackText.innerHTML = '<span style="color: #047857;">âœ“ Correct! Invariant applied accurately.</span>';
            } else {
              feedbackBox.style.background = '#FEF2F2';
              feedbackBox.style.border = '1.5px solid #FECACA';
              feedbackText.innerHTML = '<span style="color: #B91C1C;">âœ— Incorrect. See explanation below:</span>';
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
        this.showToast('Remediation Complete! ðŸŽ‰', 'Concept gap resolved! 100% Mastery achieved.', 'success');
        this.render();
        return;
      }

      // Advance to Next Recommended Topic
      const advBtn = e.target.closest('#btn-advance-next-topic');
      if (advBtn) {
        const nextTopic = advBtn.getAttribute('data-topic') || 'sliding-window';
        store.dismissRecoveryGate();
        this.navigate('practice', { topic: nextTopic });
        this.showToast('New Topic Unlocked! ðŸš€', `Welcome to ${nextTopic}!`, 'success');
        return;
      }

      // Fix N5a: "Practice Now" button in Focus Areas (dashboardView)
      const practiceFocusBtn = e.target.closest('.btn-practice-focus[data-topic]');
      if (practiceFocusBtn) {
        const topicId = practiceFocusBtn.getAttribute('data-topic');
        this.navigate('practice', { topic: topicId });
        return;
      }

      // Fix N5b: "Practice Again" button in Mistakes Review (mistakesView)
      const mistakeRetryBtn = e.target.closest('.btn-practice-mistake-again[data-qid]');
      if (mistakeRetryBtn) {
        const qid = mistakeRetryBtn.getAttribute('data-qid');
        const isCoding = qid && (qid.includes('code') || qid.startsWith('lc_'));
        if (isCoding) {
          this.navigate('playground', { qid });
        } else {
          this.navigate('question', { qid });
        }
        return;
      }
    });

    // Handle Practice Filter Changes & Folder Input Import
    document.addEventListener('change', async (e) => {
      if (e.target.id === 'topic-filter') {
        this.selectedPracticeTopic = e.target.value;
        this.render();
      } else if (e.target.id === 'difficulty-filter') {
        this.selectedPracticeDifficulty = e.target.value;
        this.render();
      } else if (e.target.id === 'vfs-folder-input') {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Extract folder root name (e.g. "java" or "my-project")
        const firstRelPath = files[0].webkitRelativePath || files[0].name;
        const rootName = firstRelPath.includes('/') ? firstRelPath.split('/')[0] : 'workspace';

        this.showToast('Importing Folder â³', `Reading ${files.length} files from '${rootName}'...`, 'info');

        const importedPaths = await vfs.importFolder(files, rootName);
        const firstJava = importedPaths.find(p => p.endsWith('.java')) || importedPaths[0];

        if (firstJava) {
          this.ideCurrentFile = firstJava;
          this.ideOpenTabs = [firstJava];
        } else {
          this.ideCurrentFile = `${rootName}/Main.java`;
          vfs.writeFile(this.ideCurrentFile, `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${rootName}!");\n    }\n}`);
          this.ideOpenTabs = [this.ideCurrentFile];
        }

        this.render();
        this.showToast('Folder Opened ðŸ“‚', `Loaded '${rootName}' (${importedPaths.length} files).`, 'success');
      }
    });

    // Drag and Drop folder support on Sidebar
    document.addEventListener('dragover', (e) => {
      if (this.currentRoute !== 'playground') return;
      const scrollArea = e.target.closest('#ide-tree-scroll-container') || e.target.closest('#dropzone-open-folder');
      if (scrollArea) {
        e.preventDefault();
        scrollArea.classList.add('drag-over');
      }
    });

    document.addEventListener('dragleave', (e) => {
      const scrollArea = e.target.closest('#ide-tree-scroll-container') || e.target.closest('#dropzone-open-folder');
      if (scrollArea) {
        scrollArea.classList.remove('drag-over');
      }
    });

    document.addEventListener('drop', async (e) => {
      if (this.currentRoute !== 'playground') return;
      const scrollArea = e.target.closest('#ide-tree-scroll-container') || e.target.closest('#dropzone-open-folder');
      if (scrollArea) {
        e.preventDefault();
        scrollArea.classList.remove('drag-over');

        const items = e.dataTransfer.items;
        if (items && items.length > 0) {
          const fileEntries = [];
          for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : null;
            if (entry) {
              await this.readEntryRecursive(entry, '', fileEntries);
            }
          }

          if (fileEntries.length > 0) {
            const rootName = fileEntries[0].path.split('/')[0] || 'imported-project';
            const importedPaths = await vfs.importFolder(fileEntries, rootName);
            const firstJava = importedPaths.find(p => p.endsWith('.java')) || importedPaths[0];

            if (firstJava) {
              this.ideCurrentFile = firstJava;
              this.ideOpenTabs = [firstJava];
            }

            this.render();
            this.showToast('Folder Dropped ðŸ“‚', `Imported '${rootName}' with ${importedPaths.length} files!`, 'success');
          }
        }
      }
    });

    // Right Click Context Menu on File Tree
    document.addEventListener('contextmenu', (e) => {
      if (this.currentRoute !== 'playground') return;

      const fileRow = e.target.closest('.tree-file-row[data-filepath]');
      const folderRow = e.target.closest('.tree-folder-row[data-folderpath]');
      const treeArea = e.target.closest('#ide-tree-scroll-container') || e.target.closest('.vfs-tree-container');

      if (fileRow) {
        this.showContextMenu(e, { type: 'file', path: fileRow.getAttribute('data-filepath') });
      } else if (folderRow) {
        this.showContextMenu(e, { type: 'folder', path: folderRow.getAttribute('data-folderpath') });
      } else if (treeArea) {
        this.showContextMenu(e, { type: 'root', path: vfs.projectName || 'java' });
      }
    });
  }

  async readEntryRecursive(entry, currentPath, result) {
    if (entry.isFile) {
      const file = await new Promise((resolve) => entry.file(resolve));
      let content = '';
      try {
        content = await file.text();
      } catch (err) {
        content = '// Binary file';
      }
      result.push({
        path: currentPath ? `${currentPath}/${entry.name}` : entry.name,
        name: entry.name,
        content
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const entries = await new Promise((resolve) => dirReader.readEntries(resolve));
      const nextPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      for (const child of entries) {
        await this.readEntryRecursive(child, nextPath, result);
      }
    }
  }

  // ============================================================
  // MONACO EDITOR & VFS INTERFACE METHODS
  // ============================================================

  initMonacoEditor() {
    const container = document.getElementById('monaco-editor-container');
    const fallbackTextarea = document.getElementById('playground-code-input');
    if (!container) return;

    if (window.monaco && window.monaco.editor) {
      this.mountMonacoInstance(container);
      return;
    }

    if (window.require) {
      window.require.config({
        paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }
      });
      window.require(['vs/editor/editor.main'], () => {
        this.defineDarculaTheme();
        this.mountMonacoInstance(container);
      }, (err) => {
        console.warn('VFS/Monaco: Failed to load Monaco from CDN, fallback active', err);
        if (fallbackTextarea) fallbackTextarea.style.display = 'block';
        if (container) container.style.display = 'none';
      });
    } else {
      if (fallbackTextarea) fallbackTextarea.style.display = 'block';
      if (container) container.style.display = 'none';
    }
  }

  defineDarculaTheme() {
    if (!window.monaco) return;
    try {
      window.monaco.editor.defineTheme('intellij-darcula', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          { token: 'keyword', foreground: 'CC7832', fontStyle: 'bold' },
          { token: 'string', foreground: '6A8759' },
          { token: 'number', foreground: '6897BB' },
          { token: 'comment', foreground: '808080', fontStyle: 'italic' },
          { token: 'type', foreground: 'A9B7C6' },
          { token: 'identifier', foreground: 'A9B7C6' },
          { token: 'delimiter', foreground: 'CC7832' }
        ],
        colors: {
          'editor.background': '#1E1F22',
          'editor.foreground': '#BCBEC4',
          'editorLineNumber.foreground': '#4E5157',
          'editorLineNumber.activeForeground': '#A1A3AB',
          'editorGutter.background': '#1E1F22',
          'editor.selectionBackground': '#2E436E',
          'editor.lineHighlightBackground': '#26282E',
          'editorCursor.foreground': '#A7ADBA'
        }
      });
    } catch (e) {
      // theme already defined
    }
  }

  mountMonacoInstance(container) {
    if (this.monacoInstance) {
      try { this.monacoInstance.dispose(); } catch (e) {}
      this.monacoInstance = null;
    }

    const currentFile = vfs.getFile(this.ideCurrentFile) || { content: '' };

    this.monacoInstance = window.monaco.editor.create(container, {
      value: currentFile.content || '',
      language: this.ideCurrentFile.endsWith('.java') ? 'java' : 'plaintext',
      theme: 'intellij-darcula',
      automaticLayout: true,
      fontFamily: 'JetBrains Mono, Consolas, monospace',
      fontSize: 13.5,
      lineHeight: 21,
      tabSize: 4,
      insertSpaces: true,
      minimap: { enabled: true, renderCharacters: false },
      scrollBeyondLastLine: false,
      renderLineHighlight: 'all',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      folding: true
    });

    // Sync changes to VFS
    this.monacoInstance.onDidChangeModelContent(() => {
      const code = this.monacoInstance.getValue();
      vfs.writeFile(this.ideCurrentFile, code);
      const fallback = document.getElementById('playground-code-input');
      if (fallback) fallback.value = code;
    });

    // Shortcuts: Shift+F10 and Ctrl+Enter to Run
    this.monacoInstance.addCommand(window.monaco.KeyMod.Shift | window.monaco.KeyCode.F10, () => {
      this.handleIDERun();
    });
    this.monacoInstance.addCommand(window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.Enter, () => {
      this.handleIDERun();
    });
  }

  switchToFile(filepath) {
    const file = vfs.getFile(filepath);
    if (!file) return;

    // Save current editor content before switching
    if (this.monacoInstance) {
      vfs.writeFile(this.ideCurrentFile, this.monacoInstance.getValue());
    } else {
      const textarea = document.getElementById('playground-code-input');
      if (textarea) vfs.writeFile(this.ideCurrentFile, textarea.value);
    }

    this.ideCurrentFile = filepath;
    if (!this.ideOpenTabs.includes(filepath)) {
      this.ideOpenTabs.push(filepath);
    }

    this.render();
  }

  closeTab(filepath) {
    const idx = this.ideOpenTabs.indexOf(filepath);
    if (idx === -1) return;

    this.ideOpenTabs.splice(idx, 1);
    if (this.ideOpenTabs.length === 0) {
      // Fall back to first available file in VFS, or project root
      const allFiles = Object.keys(vfs.getAllFiles());
      const fallbackFile = allFiles[0] || `${vfs.projectName}/Main.java`;
      this.ideOpenTabs = [fallbackFile];
    }

    if (this.ideCurrentFile === filepath) {
      const newActive = this.ideOpenTabs[Math.max(0, idx - 1)] || this.ideOpenTabs[0];
      this.switchToFile(newActive);
    } else {
      this.render();
    }
  }

  promptNewClass(baseFolder) {
    const root = baseFolder || vfs.projectName || 'java';
    this.showModalPrompt('New Java Class', 'Enter Class Name (e.g. Solution or MathUtils):', '', (className) => {
      const cleanName = className.replace(/[^a-zA-Z0-9_]/g, '') || 'MyClass';
      const cleanFolder = root.replace(/^\/+|\/+$/g, '') || vfs.projectName || 'java';
      const path = `${cleanFolder}/${cleanName}.java`;

      if (vfs.exists(path)) {
        this.showToast('Already Exists', `${cleanName}.java already exists!`, 'warning');
        return;
      }

      const content = `public class ${cleanName} {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${cleanName}!");\n    }\n}`;
      vfs.writeFile(path, content, '');
      this.switchToFile(path);
      this.showToast('Class Created', `Created ${path}`, 'success');
    });
  }

  promptNewFile(baseFolder) {
    const root = baseFolder || vfs.projectName || 'java';
    this.showModalPrompt('New File', 'Enter file name (e.g. data.txt or config.json):', '', (fileName) => {
      const cleanName = fileName.trim().replace(/[\\/:*?"<>|]/g, '') || 'untitled.txt';
      const cleanFolder = root.replace(/^\/+|\/+$/g, '') || vfs.projectName || 'java';
      const path = `${cleanFolder}/${cleanName}`;

      if (vfs.exists(path)) {
        this.showToast('Already Exists', `${cleanName} already exists!`, 'warning');
        return;
      }

      vfs.writeFile(path, '', '');
      this.switchToFile(path);
      this.showToast('File Created', `Created ${path}`, 'success');
    });
  }

  promptNewFolder(baseFolder) {
    const root = baseFolder || vfs.projectName || 'java';
    this.showModalPrompt('New Folder / Package', 'Enter folder name (e.g. models or algorithms):', '', (folderName) => {
      const cleanName = folderName.trim().replace(/[^a-zA-Z0-9_\-]/g, '') || 'new_package';
      const cleanFolder = root.replace(/^\/+|\/+$/g, '') || vfs.projectName || 'java';
      const path = `${cleanFolder}/${cleanName}`;

      vfs.createFolder(path);
      this.render();
      this.showToast('Folder Created', `Created ${path}`, 'success');
    });
  }

  promptRename(targetPath) {
    const oldName = targetPath.split('/').pop();
    this.showModalPrompt('Rename', `Enter new name for ${oldName}:`, oldName, (newName) => {
      const cleanName = newName.trim().replace(/[\\/:*?"<>|]/g, '');
      if (!cleanName || cleanName === oldName) return;

      const parent = targetPath.split('/').slice(0, -1).join('/');
      const newPath = parent ? `${parent}/${cleanName}` : cleanName;

      const ok = vfs.rename(targetPath, newPath);
      if (ok) {
        // Update tabs
        this.ideOpenTabs = this.ideOpenTabs.map(t => {
          if (t === targetPath) return newPath;
          if (t.startsWith(targetPath + '/')) return newPath + t.slice(targetPath.length);
          return t;
        });

        if (this.ideCurrentFile === targetPath || this.ideCurrentFile.startsWith(targetPath + '/')) {
          this.ideCurrentFile = this.ideCurrentFile === targetPath ? newPath : (newPath + this.ideCurrentFile.slice(targetPath.length));
        }

        this.render();
        this.showToast('Renamed âœ“', `Renamed to ${cleanName}`, 'success');
      } else {
        this.showToast('Rename Failed', 'Name collision or invalid path.', 'error');
      }
    });
  }

  confirmDelete(targetPath) {
    const name = targetPath.split('/').pop();
    this.showModalConfirm('Delete', `Are you sure you want to delete '${name}'? This cannot be undone.`, () => {
      vfs.delete(targetPath);
      // Remove from tabs
      this.ideOpenTabs = this.ideOpenTabs.filter(t => t !== targetPath && !t.startsWith(targetPath + '/'));
      if (this.ideOpenTabs.length === 0) {
        const allFiles = Object.keys(vfs.getAllFiles());
        const fallbackFile = allFiles[0] || `${vfs.projectName}/Main.java`;
        this.ideOpenTabs = [fallbackFile];
      }

      if (this.ideCurrentFile === targetPath || this.ideCurrentFile.startsWith(targetPath + '/')) {
        this.ideCurrentFile = this.ideOpenTabs[0];
      }

      this.render();
      this.showToast('Deleted ðŸ—‘ï¸', `Removed ${name}`, 'info');
    });
  }

  showContextMenu(e, target) {
    e.preventDefault();
    this.contextMenuTarget = target;
    const menu = document.getElementById('ide-context-menu');
    if (!menu) return;

    menu.style.display = 'block';
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 220);
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  }

  hideContextMenu() {
    const menu = document.getElementById('ide-context-menu');
    if (menu) menu.style.display = 'none';
  }

  showModalPrompt(title, label, defaultValue, onConfirm) {
    const existing = document.getElementById('ide-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'ide-modal-backdrop';
    backdrop.className = 'ide-modal-backdrop';
    backdrop.innerHTML = `
      <div class="ide-modal-card">
        <div class="ide-modal-header">
          <span>${title}</span>
          <span style="cursor: pointer;" id="btn-modal-close">âœ•</span>
        </div>
        <div class="ide-modal-body">
          <label class="ide-modal-label">${label}</label>
          <input type="text" id="ide-modal-input-val" class="ide-modal-input" value="${defaultValue}" autofocus />
        </div>
        <div class="ide-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-modal-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-modal-ok">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    const input = document.getElementById('ide-modal-input-val');
    if (input) {
      input.focus();
      input.select();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = input.value;
          backdrop.remove();
          if (val.trim()) onConfirm(val.trim());
        } else if (e.key === 'Escape') {
          backdrop.remove();
        }
      });
    }

    document.getElementById('btn-modal-close')?.addEventListener('click', () => backdrop.remove());
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => backdrop.remove());
    document.getElementById('btn-modal-ok')?.addEventListener('click', () => {
      const val = input ? input.value : '';
      backdrop.remove();
      if (val.trim()) onConfirm(val.trim());
    });
  }

  showModalConfirm(title, message, onConfirm) {
    const existing = document.getElementById('ide-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'ide-modal-backdrop';
    backdrop.className = 'ide-modal-backdrop';
    backdrop.innerHTML = `
      <div class="ide-modal-card">
        <div class="ide-modal-header">
          <span>${title}</span>
          <span style="cursor: pointer;" id="btn-modal-close">âœ•</span>
        </div>
        <div class="ide-modal-body">
          <p style="font-size: 0.85rem; color: #DFE1E5; line-height: 1.4;">${message}</p>
        </div>
        <div class="ide-modal-footer">
          <button class="btn btn-secondary btn-sm" id="btn-modal-cancel">Cancel</button>
          <button class="btn btn-primary btn-sm" id="btn-modal-ok" style="background: #DC2626;">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(backdrop);
    document.getElementById('btn-modal-close')?.addEventListener('click', () => backdrop.remove());
    document.getElementById('btn-modal-cancel')?.addEventListener('click', () => backdrop.remove());
    document.getElementById('btn-modal-ok')?.addEventListener('click', () => {
      backdrop.remove();
      onConfirm();
    });
  }

  // ============================================================
  // FREEFORM INTELLIJ IDE â€” Run Handler
  // ============================================================
  handleIDERun() {
    let code = '';
    if (this.monacoInstance) {
      code = this.monacoInstance.getValue();
    } else {
      const codeTextarea = document.getElementById('playground-code-input');
      code = codeTextarea ? codeTextarea.value : '';
    }

    const currentFile = vfs.getFile(this.ideCurrentFile);
    if (currentFile) {
      vfs.writeFile(this.ideCurrentFile, code);
    }

    const stdinTextarea = document.getElementById('ide-stdin-input');
    const quickStdinInput = document.getElementById('quick-stdin-input');
    
    // Resolve stdin with priority: full stdin textarea > quick stdin bar > saved state > file default
    let stdin = '';
    if (stdinTextarea && stdinTextarea.value !== undefined) {
      stdin = stdinTextarea.value;
    } else if (quickStdinInput && quickStdinInput.value !== undefined) {
      stdin = quickStdinInput.value;
    } else if (this.ideStdin !== null && this.ideStdin !== undefined) {
      stdin = this.ideStdin;
    } else if (currentFile && currentFile.defaultStdin) {
      stdin = currentFile.defaultStdin;
    }

    this.ideStdin = stdin;

    if (!code.trim()) {
      this.showToast('Empty Code âœ•', 'Write some Java code before running.', 'error');
      return;
    }

    // Run the code
    const result = CodeExecutionEngine.executeFreeformJava(code, stdin);
    this.ideExecutionResult = result;

    // Award +2 XP on successful run
    if (result.success) {
      store.awardPoints(2);
      this.showToast('â–¶ Execution Successful âœ“', `Output ready! +2 XP Awarded! (${result.executionTimeMs}ms)`, 'success');
    } else {
      if (result.error && result.error.includes('NoSuchElementException')) {
        this.showToast('Input Required âŒ¨ï¸', 'Scanner needs input. Enter input in the Stdin box.', 'warning');
      } else {
        this.showToast('âœ• Execution Error', result.error ? result.error.split('\n')[0] : 'Runtime error occurred.', 'error');
      }
    }

    // Switch to terminal tab to show output
    this.ideActiveTab = 'terminal';
    this.render();
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
      this.showToast('Test Cases Passed! âœ“', `${result.passedCount}/${result.totalCount} public cases matched.`, 'success');
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
      const pointsData = store.markQuestionSolved(question.id, 2);
      
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
      this.showToast('Accepted! â­ +2 XP Points Earned', `Total: ${pointsData.totalPoints} pts â€¢ ${pointsData.newRank}`, 'success');
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

      this.showToast('Concept Recovery Recommended ðŸš¨', `We noticed difficulty on ${question.subtopic || question.title}. Let's repair this concept!`, 'warning');
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
      this.showToast('Correct Solution! âœ“', `Mastery updated and question marked solved.`, 'success');
    } else {
      this.showToast('Concept Insight Detected ðŸ’¡', `Identified gap in ${question.concept || 'Index Boundaries'}.`, 'warning');
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

    let icon = 'â„¹ï¸';
    if (type === 'success') icon = 'âœ…';
    if (type === 'warning') icon = 'âš ï¸';
    if (type === 'error') icon = 'âŒ';

    // Fix #18: Use textContent (not innerHTML) to prevent XSS injection in toast messages
    const iconEl = document.createElement('div');
    iconEl.className = 'toast-icon';
    iconEl.textContent = icon;

    const contentEl = document.createElement('div');
    contentEl.className = 'toast-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = String(title); // safe â€” no HTML injection

    const msgEl = document.createElement('div');
    msgEl.className = 'toast-message';
    msgEl.textContent = String(message); // safe â€” no HTML injection

    contentEl.appendChild(titleEl);
    contentEl.appendChild(msgEl);
    toast.appendChild(iconEl);
    toast.appendChild(contentEl);

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3800);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new LearnPathApp();
  });
} else {
  window.app = new LearnPathApp();
}


