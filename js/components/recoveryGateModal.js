/* ============================================================
   LEARNPATH AI — Strict Topic Recovery Gate & Guided Remediation View
   3-Stage Pipeline: Deep Notes -> 5 MCQs -> 2 Coding Problems
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';
import { TOPIC_NOTES_DB } from '../data/topicNotes.js';
import { store } from '../state.js';

export function renderRecoveryGateView(state) {
  const gate = state.activeRecoveryGate;
  if (!gate) {
    return `
      <div class="card" style="padding: 40px; text-align: center;">
        <h2>No Active Recovery Gate</h2>
        <p style="color: var(--text-muted); margin-top: 8px;">You currently have no detected concept gaps. Keep practicing!</p>
        <button class="btn btn-primary" data-route="practice" style="margin-top: 20px;">Go to Practice Bank →</button>
      </div>
    `;
  }

  const topic = state.topics.find(t => t.id === gate.topicId) || { name: gate.topicId };
  const notes = TOPIC_NOTES_DB[gate.topicId] || TOPIC_NOTES_DB['basic-arrays'];
  
  // Fetch 5 topic MCQs
  const topicMCQs = QUESTIONS_DB.filter(q => q.topic === gate.topicId && q.type === 'MCQ').slice(0, 5);
  // Fallback MCQs if not enough in this specific topic
  const mcqs = topicMCQs.length >= 5 ? topicMCQs : QUESTIONS_DB.filter(q => q.type === 'MCQ').slice(0, 5);

  // Fetch 2 coding questions for stage 3
  const topicCoding = QUESTIONS_DB.filter(q => q.topic === gate.topicId && q.type === 'CODING').slice(0, 2);
  const codingProblems = topicCoding.length >= 2 ? topicCoding : QUESTIONS_DB.filter(q => q.type === 'CODING').slice(0, 2);

  // Stage 4: Mastery Unlocked & Proceed to Next Topic
  if (gate.status === 'RESOLVED' || gate.currentStage === 4) {
    return `
      <div class="recovery-gate-container">
        <div class="card recovery-success-card">
          <div class="recovery-success-icon">🎉</div>
          <h1 class="recovery-success-title">Concept Repaired & Mastered!</h1>
          <p class="recovery-success-desc">
            Awesome work! You have successfully resolved all foundational misconceptions in <strong>${escapeHtml(topic.name)}</strong> by completing the Notes, 5 Diagnostic MCQs, and 2 Coding Challenges.
          </p>
          
          <div class="recovery-stat-badge">
            <span>✨ Topic Mastery: <strong>100%</strong></span>
            <span>✓ Concept Gap: <strong>RESOLVED</strong></span>
          </div>

          <div class="recovery-next-recommendation-box">
            <div class="rec-badge-pill" style="margin-bottom: 8px;">🚀 AI Recommended Next Step</div>
            <h3 style="color: #0F172A; font-size: 1.25rem; font-weight: 800;">Advance to: ${escapeHtml(gate.nextTopicName)}</h3>
            <p style="color: #64748B; font-size: 0.95rem; margin-top: 4px;">
              Now that you have mastered ${escapeHtml(topic.name)}, you possess the exact prerequisites needed to tackle ${escapeHtml(gate.nextTopicName)} with high confidence!
            </p>
            <button class="btn btn-primary btn-lg" id="btn-advance-next-topic" data-route="practice" data-topic="${gate.nextTopicId}" style="margin-top: 16px;">
              Start Learning ${escapeHtml(gate.nextTopicName)} →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Active 3-Stage Remediation Flow
  return `
    <div class="recovery-gate-container">
      <!-- High Urgency Gate Header -->
      <div class="recovery-gate-banner">
        <div class="gate-alert-pill">🚨 Concept Recovery Required</div>
        <h1 class="recovery-gate-title">Mandatory Remediation: ${escapeHtml(topic.name)}</h1>
        <p class="recovery-gate-subtitle">
          Our AI diagnostic engine detected that you encountered difficulties with <strong>${escapeHtml(gate.subtopicName)}</strong>. 
          To ensure long-term mastery, please complete the 3 steps below before advancing to the next topic.
        </p>
      </div>

      <!-- 3-Stage Step Tracker Bar -->
      <div class="recovery-stepper">
        <div class="recovery-step-item ${gate.currentStage === 1 ? 'active' : (gate.currentStage > 1 ? 'completed' : '')}">
          <div class="step-num">${gate.currentStage > 1 ? '✓' : '1'}</div>
          <div class="step-meta">
            <span class="step-title">Stage 1: Deep Notes</span>
            <span class="step-status">${gate.notesRead ? 'Completed' : (gate.currentStage === 1 ? 'In Progress' : 'Pending')}</span>
          </div>
        </div>

        <div class="recovery-step-divider"></div>

        <div class="recovery-step-item ${gate.currentStage === 2 ? 'active' : (gate.currentStage > 2 ? 'completed' : '')}">
          <div class="step-num">${gate.currentStage > 2 ? '✓' : '2'}</div>
          <div class="step-meta">
            <span class="step-title">Stage 2: 5 Concept MCQs</span>
            <span class="step-status">${gate.currentStage > 2 ? '5/5 Passed' : (gate.currentStage === 2 ? `${gate.mcqIndex}/5 Completed` : 'Locked')}</span>
          </div>
        </div>

        <div class="recovery-step-divider"></div>

        <div class="recovery-step-item ${gate.currentStage === 3 ? 'active' : (gate.currentStage > 3 ? 'completed' : '')}">
          <div class="step-num">${gate.currentStage > 3 ? '✓' : '3'}</div>
          <div class="step-meta">
            <span class="step-title">Stage 3: 2 Coding Problems</span>
            <span class="step-status">${gate.codingSolved.length >= 2 ? '2/2 Solved' : (gate.currentStage === 3 ? `${gate.codingSolved.length}/2 Solved` : 'Locked')}</span>
          </div>
        </div>
      </div>

      <!-- STAGE 1: Deep Notes & Invariant Study -->
      ${gate.currentStage === 1 ? `
        <div class="card recovery-stage-card">
          <div class="stage-card-header">
            <span class="stage-badge">📖 Stage 1 of 3</span>
            <h2>Review Masterclass Concept Guide</h2>
            <p>Read the core invariants, hardware memory diagram, and sub-type breakdown for <strong>${escapeHtml(topic.name)}</strong>.</p>
          </div>

          <div class="recovery-notes-preview">
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: var(--radius-lg); padding: 24px; margin-bottom: 20px;">
              <h3 style="color: var(--text-main); font-size: 1.15rem; font-weight: 800; margin-bottom: 8px;">${escapeHtml(notes.title)}</h3>
              <p style="color: #475569; font-size: 0.95rem; line-height: 1.6;">${escapeHtml(notes.overview)}</p>
            </div>

            <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;">
              <button class="btn btn-secondary btn-md" data-route="notes" data-topic="${gate.topicId}">
                📖 Open Full Masterclass Study Notes & PDF Guide →
              </button>
            </div>
          </div>

          <div class="stage-card-footer" style="border-top: 1px solid var(--border-color); padding-top: 20px; display: flex; justify-content: flex-end;">
            <button class="btn btn-primary btn-lg" id="btn-complete-stage-1">
              I Have Read & Understood Notes → Proceed to 5 MCQs
            </button>
          </div>
        </div>
      ` : ''}

      <!-- STAGE 2: 5 Concept Diagnostics MCQs -->
      ${gate.currentStage === 2 ? `
        <div class="card recovery-stage-card">
          <div class="stage-card-header">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="stage-badge">📝 Stage 2 of 3 • Question ${Math.min(gate.mcqIndex + 1, 5)} of 5</span>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--primary);">Score: ${gate.mcqScore} / 5</span>
            </div>
            <h2>Concept Verification Quiz</h2>
            <p>Answer these 5 rapid concept checks to verify your understanding of invariants and boundary conditions.</p>
          </div>

          ${renderCurrentMCQ(mcqs[gate.mcqIndex] || mcqs[0], gate.mcqIndex)}
        </div>
      ` : ''}

      <!-- STAGE 3: 2 Practical Coding Challenges -->
      ${gate.currentStage === 3 ? `
        <div class="card recovery-stage-card">
          <div class="stage-card-header">
            <span class="stage-badge">💻 Stage 3 of 3</span>
            <h2>2 Foundation Coding Challenges</h2>
            <p>Apply your concept recovery in the live IDE playground. Pass all test cases to earn green ticks and unlock the next topic!</p>
          </div>

          <div class="recovery-coding-list" style="display: flex; flex-direction: column; gap: 16px; margin: 24px 0;">
            ${codingProblems.map((prob, idx) => {
              const isSolved = gate.codingSolved.includes(prob.id) || store.isQuestionSolved(prob.id);
              return `
                <div class="card" style="padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1.5px solid ${isSolved ? 'var(--color-success)' : 'var(--border-color)'}; background: ${isSolved ? '#F0FDF4' : 'white'};">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-weight: 800; color: #1E293B;">Challenge ${idx + 1}: ${prob.title}</span>
                      <span class="badge ${prob.difficulty === 'Easy' ? 'badge-good' : 'badge-improving'}">${prob.difficulty}</span>
                    </div>
                    <p style="font-size: 0.88rem; color: #64748B; margin-top: 4px;">${prob.subtopic || prob.concept}</p>
                  </div>

                  <div style="display: flex; align-items: center; gap: 12px;">
                    ${isSolved ? `
                      <span style="color: var(--color-success); font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 4px;">
                        ✓ Passed
                      </span>
                    ` : `
                      <button class="btn btn-primary btn-sm btn-launch-recovery-code" data-qid="${prob.id}" data-route="playground">
                        Open IDE & Code →
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          ${gate.codingSolved.length >= 2 ? `
            <div style="text-align: right; margin-top: 20px;">
              <button class="btn btn-primary btn-lg" id="btn-finish-recovery-gate">
                🎉 All Challenges Passed! Complete & Unlock Next Topic →
              </button>
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

function renderCurrentMCQ(mcq, currentIndex) {
  if (!mcq) return `<p>All questions completed!</p>`;

  return `
    <div class="recovery-mcq-widget" id="recovery-mcq-container" data-correct="${mcq.correct_answer}">
      <h3 class="mcq-question-text" style="font-size: 1.1rem; color: #0F172A; margin-bottom: 14px; line-height: 1.5;">
        ${escapeHtml(mcq.question)}
      </h3>

      ${mcq.snippet ? `
        <pre class="notes-code-block" style="margin-bottom: 16px;"><code>${escapeHtml(mcq.snippet)}</code></pre>
      ` : ''}

      <div class="recovery-options-list" style="display: flex; flex-direction: column; gap: 10px;">
        ${mcq.options.map((opt, idx) => `
          <button class="recovery-option-btn" data-opt-index="${idx}" style="text-align: left; padding: 12px 18px; border-radius: var(--radius-md); border: 1.5px solid var(--border-color); background: white; cursor: pointer; font-size: 0.92rem; transition: all 0.15s ease;">
            <strong style="color: var(--primary); margin-right: 8px;">${String.fromCharCode(65 + idx)}.</strong> ${escapeHtml(opt)}
          </button>
        `).join('')}
      </div>

      <div class="recovery-mcq-feedback" id="mcq-feedback-box" style="display: none; margin-top: 16px; padding: 16px; border-radius: var(--radius-md);">
        <div id="mcq-feedback-text" style="font-weight: 700; margin-bottom: 6px;"></div>
        <div id="mcq-explanation-text" style="font-size: 0.9rem; color: #334155;">${escapeHtml(mcq.explanation)}</div>
        <button class="btn btn-primary btn-md" id="btn-next-mcq" style="margin-top: 12px;">Next Question →</button>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
