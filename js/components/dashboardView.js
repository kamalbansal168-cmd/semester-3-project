/* ============================================================
   LEARNPATH AI — Complete Student Dashboard View
   ============================================================ */

import { RecommendationEngine } from '../engine/recommendationEngine.js';

export function renderDashboardView(state) {
  const user = state.user;
  const metrics = state.metrics;
  const isNewStudent = metrics.questionsSolved === 0;
  const recommendation = RecommendationEngine.getPrimaryRecommendation(state);

  // If brand new student with no attempts, show clean onboarding empty-state
  if (isNewStudent) {
    return renderNewStudentDashboard(user);
  }

  return `
    <div class="dashboard-view">
      ${state.activeRecoveryGate && state.activeRecoveryGate.status === 'ACTIVE' ? `
        <div class="recovery-active-alert-banner">
          <div class="recovery-alert-left">
            <span class="gate-alert-pill">🚨 Action Required</span>
            <span class="recovery-alert-text">
              Concept Gap identified in <strong>${state.activeRecoveryGate.subtopicName}</strong>. Master this topic before moving forward!
            </span>
          </div>
          <button class="btn btn-primary btn-sm" data-route="recovery">
            Continue 3-Step Remediation →
          </button>
        </div>
      ` : ''}

      <!-- 10.2 Welcome Section -->
      <section class="welcome-hero">
        <div>
          <h1 class="welcome-title">Good morning, ${user.name} 👋</h1>
          <p class="welcome-subtitle">Let's continue improving your concepts.</p>
        </div>
        <div class="welcome-streak">
          <span>🔥</span>
          <span>${user.streakDays} day learning streak</span>
        </div>
      </section>

      <!-- 10.3 Learning Snapshot (4 metrics) -->
      <section class="snapshot-grid">
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper mastery">🎯</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Overall Mastery</span>
            <span class="snapshot-value">${metrics.overallMastery}%</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper questions">⚡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Questions Solved</span>
            <span class="snapshot-value">${metrics.questionsSolved}</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper concepts">💡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Concepts Mastered</span>
            <span class="snapshot-value">${metrics.conceptsMastered}</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper streak">🔥</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Learning Streak</span>
            <span class="snapshot-value">${metrics.learningStreak} days</span>
          </div>
        </div>
      </section>

      <!-- 10.12 Concept Insight Banner (If concept gap detected) -->
      ${state.conceptInsight ? renderConceptInsightBanner(state.conceptInsight) : ''}

      <!-- Main 2-Column Grid -->
      <div class="dashboard-grid-main">
        <!-- LEFT COLUMN (Priority Learning & Insights) -->
        <div class="dashboard-col-left">
          
          <!-- 10.5 Continue Learning Hero -->
          <div class="continue-learning-card">
            <span class="continue-badge">Recommended Next Step</span>
            <div class="continue-topic-header">
              <div class="continue-label">Continue Learning</div>
              <div class="continue-topic-name">${recommendation.topicName}</div>
            </div>
            
            <div class="continue-mastery-row">
              <span class="continue-mastery-text">Mastery: ${recommendation.mastery}%</span>
              <div class="progress-bar-container" style="flex: 1;">
                <div class="progress-bar-fill ${getMasteryClass(recommendation.mastery)}" style="width: ${recommendation.mastery}%;"></div>
              </div>
            </div>

            <div class="continue-reason-box">
              <span class="icon">💡</span>
              <span><strong>Why this:</strong> ${recommendation.reason}</span>
            </div>

            <button class="btn btn-primary btn-lg" id="btn-continue-learning" data-route="${recommendation.route}">
              ${recommendation.buttonText || 'Continue Learning →'}
            </button>
          </div>

          <!-- 10.4 Overall Mastery Progress Card -->
          <div class="card overall-mastery-card">
            <div class="card-header">
              <h3 class="card-title">Overall Concept Mastery</h3>
              <span class="mastery-trend-badge">
                ▲ +${metrics.improvementGain}% this week
              </span>
            </div>
            <div class="mastery-score-row">
              <span class="mastery-score-big">${metrics.overallMastery}%</span>
              <p class="mastery-message">
                ${metrics.overallMastery >= 70 
                  ? 'Good progress — keep practicing your weaker topics to reach 85%+.' 
                  : 'Foundation is building — targeted practice will accelerate your mastery.'}
              </p>
            </div>
            <div class="progress-bar-container" style="height: 12px;">
              <div class="progress-bar-fill ${getMasteryClass(metrics.overallMastery)}" style="width: ${metrics.overallMastery}%;"></div>
            </div>
            <div class="mastery-stats-footer">
              <div>
                <div class="stat-mini-label">Last Week</div>
                <div class="stat-mini-val">${metrics.lastWeekMastery}%</div>
              </div>
              <div>
                <div class="stat-mini-label">This Week</div>
                <div class="stat-mini-val">${metrics.overallMastery}%</div>
              </div>
              <div>
                <div class="stat-mini-label">Improvement</div>
                <div class="stat-mini-val" style="color: var(--success);">+${metrics.improvementGain}%</div>
              </div>
            </div>
          </div>

          <!-- 10.7 Focus Areas (Max 3) -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Focus Areas</h3>
              <span class="badge badge-needs-practice">${state.focusAreas.length} Topics Need Attention</span>
            </div>
            <p class="card-subtitle" style="margin-bottom: 16px;">
              Concepts identified by our learning model where targeted practice will yield the highest gains:
            </p>
            <div class="focus-areas-list">
              ${state.focusAreas.length === 0 ? `
                <div class="empty-state-card" style="padding: 20px;">
                  <span class="empty-state-icon">🎉</span>
                  <div class="empty-state-title">No major focus areas right now!</div>
                  <div class="empty-state-desc">You're doing great across all topics. Ready for advanced challenges.</div>
                </div>
              ` : state.focusAreas.map(f => `
                <div class="focus-area-card ${f.urgent ? 'urgent' : ''}">
                  <div class="focus-area-info">
                    <div class="focus-area-top">
                      <span class="focus-area-name">${f.topicName}</span>
                      <span class="badge ${f.mastery < 40 ? 'badge-needs-practice' : 'badge-improving'}">
                        ${f.mastery}% — ${f.tag}
                      </span>
                    </div>
                    <div class="focus-area-desc">${f.reason}</div>
                  </div>
                  <button class="btn btn-outline-primary btn-sm btn-practice-focus" data-topic="${f.topicId}">
                    Practice Now
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 10.10 Recent Practice Attempts -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recent Practice</h3>
              <a class="btn btn-sm btn-secondary" data-route="progress">View All Analytics →</a>
            </div>
            <div class="recent-attempts-list">
              ${state.recentAttempts.map(att => `
                <div class="attempt-row">
                  <div class="attempt-topic-group">
                    <div class="attempt-status-icon ${att.isCorrect ? 'correct' : 'incorrect'}">
                      ${att.isCorrect ? '✓' : '✕'}
                    </div>
                    <div>
                      <div class="attempt-title">${att.topicName} — ${att.questionTitle}</div>
                      <div class="attempt-sub">${att.feedbackNote || ''}</div>
                    </div>
                  </div>
                  <div class="attempt-meta">
                    <span class="badge badge-neutral">${att.difficulty}</span>
                    <span>⏱ ${att.timeSpent}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN (Path Stepper, Activity, Concept Breakdown) -->
        <div class="dashboard-col-right">
          
          <!-- 10.13 Current Learning Path Widget -->
          ${renderLearningPathWidget(state)}

          <!-- 10.11 Verified Improvement Gain Card (Dynamic) -->
          ${state.resolvedConcepts && state.resolvedConcepts.length > 0 ? `
            <div class="improvement-card">
              <div class="improvement-left">
                <div class="improvement-title">Verified Concept Recovery</div>
                <div class="improvement-desc">
                  ${state.resolvedConcepts[0].name}
                </div>
              </div>
              <div class="improvement-gain-badge">
                <span class="gain-label">Learning Gain</span>
                <span class="gain-val">+${state.resolvedConcepts[0].currentMastery - (state.resolvedConcepts[0].previousMastery || 0)}%</span>
              </div>
            </div>
          ` : ''}

          <!-- 10.6 Topic Mastery List ("Your Concepts") -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Your Concepts</h3>
              <a class="btn btn-sm btn-secondary" data-route="topics">Explore All</a>
            </div>
            <div class="topic-mastery-list">
              ${state.topics.map(topic => `
                <div class="topic-mastery-item" data-topic="${topic.id}">
                  <div class="topic-item-header">
                    <span class="topic-item-name">${topic.name}</span>
                    <div class="topic-item-score">
                      <span>${topic.mastery}%</span>
                      <span class="badge ${getStatusBadgeClass(topic.status)}">${topic.status}</span>
                    </div>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill ${getMasteryClass(topic.mastery)}" style="width: ${topic.mastery}%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 10.9 Weekly Learning Activity Chart -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Weekly Activity</h3>
              <span class="badge badge-neutral">Questions Solved</span>
            </div>
            <div class="activity-chart-wrapper">
              <div class="activity-bars">
                ${state.weeklyActivity.map(act => {
                  const heightPercent = Math.min(100, Math.max(10, act.count * 10));
                  return `
                    <div class="activity-bar-col ${act.today ? 'today' : ''}">
                      <div class="activity-bar-track">
                        <div class="activity-bar-fill" style="height: ${heightPercent}%;"></div>
                      </div>
                      <span class="activity-day-label">${act.day}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- 10.15 Quick Actions Grid -->
          <div class="quick-actions-grid">
            <button class="btn-quick-action" data-route="recovery">
              <span class="action-icon">🎯</span>
              <span>Practice Weak Topics</span>
            </button>
            <button class="btn-quick-action" data-route="topics">
              <span class="action-icon">📚</span>
              <span>Explore Topics</span>
            </button>
            <button class="btn-quick-action" data-route="progress">
              <span class="action-icon">📈</span>
              <span>View Progress</span>
            </button>
            <button class="btn-quick-action" data-route="mistakes">
              <span class="action-icon">📝</span>
              <span>Review Mistakes</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  `;
}

// 10.12 Concept Insight Banner Component
function renderConceptInsightBanner(insight) {
  return `
    <div class="concept-insight-banner">
      <div class="concept-insight-icon">💡</div>
      <div class="concept-insight-content">
        <div class="concept-insight-header">
          <span class="concept-insight-title">${insight.title}: ${insight.conceptGap}</span>
          <span class="concept-insight-tag">Action Needed</span>
        </div>
        <div class="concept-insight-message">
          ${insight.explanation} ${insight.subExplanation}
        </div>
        <div class="concept-insight-actions">
          <button class="btn btn-primary btn-sm" id="btn-fix-concept" data-route="recovery">
            Fix This Concept →
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-view-insight-details" data-route="explanation">
            Read Concept Refresh
          </button>
        </div>
      </div>
    </div>
  `;
}

// 10.13 Current Learning Path Widget Component
function renderLearningPathWidget(state) {
  const path = state.recoveryPath;
  if (!path) {
    return `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Learning Path</h3>
        </div>
        <p class="card-subtitle">Solve practice questions to automatically generate your next personalized recovery path.</p>
      </div>
    `;
  }

  const completedCount = path.steps.filter(s => s.status === 'COMPLETED').length;

  return `
    <div class="card learning-path-widget">
      <div class="card-header">
        <h3 class="card-title">Your Current Learning Path</h3>
        <span class="badge badge-good">${completedCount} of ${path.totalSteps} Completed</span>
      </div>
      <div class="path-stepper">
        ${path.steps.map((step, idx) => {
          let icon = idx + 1;
          if (step.status === 'COMPLETED') icon = '✓';
          else if (step.status === 'CURRENT') icon = '→';
          else if (step.status === 'LOCKED') icon = '○';

          return `
            <div class="path-step-row ${step.status.toLowerCase()}">
              <div class="path-step-circle">${icon}</div>
              <div class="path-step-info">
                <div class="path-step-name">${step.title}</div>
                <div class="path-step-status">${step.description}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <button class="btn btn-primary btn-sm" style="width: 100%; margin-top: 8px;" data-route="recovery">
        Open Learning Path →
      </button>
    </div>
  `;
}

// 12. New Student Dashboard (Clean onboarding without fake stats)
function renderNewStudentDashboard(user) {
  return `
    <div class="dashboard-view">
      <section class="welcome-hero">
        <div>
          <h1 class="welcome-title">Welcome to LearnPath AI, ${user.name} 👋</h1>
          <p class="welcome-subtitle">Let's understand your current level and build your personalized learning path.</p>
        </div>
      </section>

      <div class="card" style="padding: 48px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px;">
        <div style="font-size: 3.5rem;">🚀</div>
        <h2 style="font-size: 1.6rem; color: var(--text-main);">Start Your Diagnostic Assessment</h2>
        <p style="max-width: 520px; color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
          Instead of guessing what you should study, solve a 5-question baseline assessment.
          Our system will identify your strengths and highlight concept gaps before building your recovery path.
        </p>
        <button class="btn btn-primary btn-lg" id="btn-start-initial-assessment" data-route="practice">
          Start Initial Assessment (5 Questions) →
        </button>
      </div>

      <div class="snapshot-grid" style="opacity: 0.7;">
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper mastery">🎯</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Overall Mastery</span>
            <span class="snapshot-value">-- %</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper questions">⚡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Questions Solved</span>
            <span class="snapshot-value">0</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper concepts">💡</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Concepts Mastered</span>
            <span class="snapshot-value">0</span>
          </div>
        </div>
        <div class="snapshot-card">
          <div class="snapshot-icon-wrapper streak">🔥</div>
          <div class="snapshot-meta">
            <span class="snapshot-label">Learning Streak</span>
            <span class="snapshot-value">Day 1</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getMasteryClass(score) {
  if (score >= 75) return 'strong';
  if (score >= 50) return 'improving';
  return 'needs-practice';
}

function getStatusBadgeClass(status) {
  if (status === 'Strong') return 'badge-strong';
  if (status === 'Good') return 'badge-good';
  if (status === 'Improving') return 'badge-improving';
  return 'badge-needs-practice';
}
