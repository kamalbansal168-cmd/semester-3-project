/* ============================================================
   LEARNPATH AI — CodeChef-Style Contests View Components
   Includes: Contest Lobby, Arena IDE, and Live Leaderboard Matrix
   ============================================================ */

import { ContestEngine } from '../engine/contestEngine.js';
import { QUESTIONS_DB } from '../data/questions.js';

/**
 * 1. CONTESTS LOBBY VIEW
 * Shows Live, Upcoming, and Past Contests with registration & entry
 */
export function renderContestsLobbyView(state, currentFilter = 'all') {
  const user = state.user || { name: 'Student', email: 'student@learnpath.edu' };
  const isAdmin = state.user?.role === 'admin' || state.user?.email === 'admin@learnpath.edu';
  const contests = ContestEngine.getAllContests();

  const filtered = contests.filter(c => {
    if (currentFilter === 'live') return c.status === 'LIVE';
    if (currentFilter === 'upcoming') return c.status === 'UPCOMING';
    if (currentFilter === 'ended') return c.status === 'ENDED';
    return true;
  });

  const liveCount = contests.filter(c => c.status === 'LIVE').length;
  const upcomingCount = contests.filter(c => c.status === 'UPCOMING').length;
  const endedCount = contests.filter(c => c.status === 'ENDED').length;

  return `
    <div class="contest-view-wrapper">
      <!-- Hero Banner -->
      <div class="contest-hero">
        <div class="contest-hero-left">
          <h1>
            <span>🏆</span> LearnPath Competitive Contests Arena
          </h1>
          <p>
            Compete in CodeChef & LeetCode style timed algorithmic contests. Solve curated DSA problems,
            track real-time ICPC ranklists, and earn rating points with automated test execution.
          </p>
          <div class="contest-hero-badges">
            <span class="contest-badge-item">⚡ Zero-Latency Sandboxed Code Runner</span>
            <span class="contest-badge-item">📊 Dynamic ICPC Time-Penalty Leaderboard</span>
            <span class="contest-badge-item">🛡️ Misconception Diagnostics on Submissions</span>
          </div>
        </div>

        ${isAdmin ? `
          <div class="contest-hero-right">
            <button class="btn btn-primary" id="btn-open-create-contest" style="padding:12px 20px; font-weight:800; display:flex; align-items:center; gap:8px;">
              <span>➕</span> Schedule New Contest
            </button>
          </div>
        ` : ''}
      </div>

      <!-- Filter Tabs -->
      <div class="contest-filter-bar">
        <div class="contest-tabs">
          <button class="contest-tab-btn ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
            All Contests (${contests.length})
          </button>
          <button class="contest-tab-btn ${currentFilter === 'live' ? 'active' : ''}" data-filter="live">
            🔥 Live Now (${liveCount})
          </button>
          <button class="contest-tab-btn ${currentFilter === 'upcoming' ? 'active' : ''}" data-filter="upcoming">
            📅 Upcoming (${upcomingCount})
          </button>
          <button class="contest-tab-btn ${currentFilter === 'ended' ? 'active' : ''}" data-filter="ended">
            🏁 Past Contests (${endedCount})
          </button>
        </div>

        <div style="font-size: 0.86rem; color: #94a3b8;">
          Showing <strong style="color:#ffffff;">${filtered.length}</strong> contest(s)
        </div>
      </div>

      <!-- Contest Cards Grid -->
      <div class="contest-cards-grid">
        ${filtered.map(contest => {
          const isRegistered = ContestEngine.isUserRegistered(contest.id, user.email);
          const isLive = contest.status === 'LIVE';
          const isUpcoming = contest.status === 'UPCOMING';
          const isEnded = contest.status === 'ENDED';

          // Format timing string
          const startFormatted = new Date(contest.startTime).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          });

          return `
            <div class="contest-card ${isLive ? 'live-card' : (isUpcoming ? 'upcoming-card' : 'ended-card')}">
              <div>
                <div class="contest-card-top">
                  <span class="contest-status-pill ${contest.status.toLowerCase()}">
                    ${isLive ? '<span class="pulsing-dot"></span>' : ''}
                    ${contest.badge}
                  </span>
                  <span style="font-size:0.8rem; color:#94a3b8; font-weight:600;">
                    ${contest.durationMinutes} Mins
                  </span>
                </div>

                <h3 class="contest-card-title">${contest.title}</h3>
                <p class="contest-card-tagline">${contest.tagline}</p>

                <div class="contest-card-meta">
                  <div class="contest-meta-item">
                    <span class="contest-meta-label">Start Time</span>
                    <span class="contest-meta-val">🕒 ${startFormatted}</span>
                  </div>
                  <div class="contest-meta-item">
                    <span class="contest-meta-label">Problems</span>
                    <span class="contest-meta-val">🧩 ${contest.problems.length} Challenges</span>
                  </div>
                  <div class="contest-meta-item">
                    <span class="contest-meta-label">Registered</span>
                    <span class="contest-meta-val">👥 ${contest.registeredUsers.length} Students</span>
                  </div>
                  <div class="contest-meta-item">
                    <span class="contest-meta-label">Host</span>
                    <span class="contest-meta-val">👑 ${contest.author || 'Admin'}</span>
                  </div>
                </div>
              </div>

              <div class="contest-card-actions">
                ${isLive ? `
                  <button class="btn-contest btn-contest-enter btn-enter-contest" data-cid="${contest.id}">
                    <span>🚀</span> Enter Arena
                  </button>
                  <button class="btn-contest btn-contest-standings btn-view-standings" data-cid="${contest.id}">
                    <span>📊</span> Leaderboard
                  </button>
                ` : isUpcoming ? `
                  <button class="btn-contest ${isRegistered ? 'btn-contest-registered btn-unregister-contest' : 'btn-contest-register btn-register-contest'}" data-cid="${contest.id}">
                    <span>${isRegistered ? '✅ Registered' : '⚡ Register Now'}</span>
                  </button>
                ` : `
                  <button class="btn-contest btn-contest-standings btn-view-standings" data-cid="${contest.id}" style="flex:1;">
                    <span>🏆</span> View Standings & Problems
                  </button>
                `}

                ${isAdmin ? `
                  <button class="btn-contest btn-delete-contest" data-cid="${contest.id}" style="background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(239,68,68,0.3); flex:0; padding:10px 14px;" title="Delete Contest">
                    🗑️
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Create Contest Modal (Admin Only) -->
    <div id="create-contest-modal-container" style="display:none;"></div>
    <!-- Leaderboard Modal Container -->
    <div id="contest-leaderboard-modal-container" style="display:none;"></div>
  `;
}

/**
 * 2. CONTEST ARENA VIEW (Problem Solving Workspace)
 */
export function renderContestArenaView(state, contest, activeProbIndex = 0, userCode = null, runResults = null) {
  const user = state.user || { name: 'Student', email: 'student@learnpath.edu' };
  const problemMeta = contest.problems[activeProbIndex] || contest.problems[0];
  const fullQuestion = QUESTIONS_DB.find(q => q.id === problemMeta.id) || {
    id: problemMeta.id,
    title: problemMeta.title,
    difficulty: problemMeta.difficulty,
    question: 'Solve this algorithmic problem using in-place time and memory optimization.',
    constraints: ['1 <= N <= 10^5', 'Time Limit: 1.0s'],
    starterCode: `class Solution {\n    public void solve() {\n        // Write solution\n    }\n}`,
    testCases: []
  };

  const initialCode = userCode !== null ? userCode : (fullQuestion.starterCode || '');

  // Calculate user's current contest score
  const leaderboard = ContestEngine.getLeaderboard(contest.id, user);
  const myEntry = leaderboard.find(e => e.isCurrentUser) || { score: 0, rank: '-' };

  return `
    <div class="arena-container">
      <!-- Arena Top Bar -->
      <div class="arena-topbar">
        <div class="arena-title-group">
          <button class="btn btn-sm btn-secondary" id="btn-exit-arena" style="margin-right:12px;">
            ← Back to Contests
          </button>
          <h2><span>🏆</span> ${contest.title}</h2>
        </div>

        <div class="arena-clock" id="arena-live-clock">
          <span>⏳</span>
          <span id="arena-clock-time">LIVE CONTEST</span>
        </div>

        <div class="arena-stats-group">
          <div class="arena-stat-badge" style="border-color: rgba(96, 165, 250, 0.4); color: #60a5fa;">
            Score: <strong>${myEntry.score} pts</strong>
          </div>
          <div class="arena-stat-badge">
            Rank: <strong>#${myEntry.rank}</strong>
          </div>
          <button class="btn btn-sm btn-primary btn-view-standings" data-cid="${contest.id}" style="display:flex; align-items:center; gap:6px;">
            <span>📊</span> Standings
          </button>
        </div>
      </div>

      <!-- Problem Navigation Strip -->
      <div class="arena-problem-strip">
        ${contest.problems.map((p, idx) => {
          const isActive = idx === activeProbIndex;
          const status = myEntry.problemResults ? myEntry.problemResults[p.code]?.status : null;
          return `
            <button class="arena-prob-btn ${isActive ? 'active' : ''} btn-switch-problem" data-pidx="${idx}">
              <span>${p.code}: ${p.title}</span>
              <span style="font-size:0.75rem; color:#94a3b8;">[${p.points} pts]</span>
              ${status === 'AC' ? '<span class="prob-status-tag ac">✓ AC</span>' : (status === 'WA' ? '<span class="prob-status-tag wa">✗ WA</span>' : '')}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Split Workspace -->
      <div class="arena-workspace">
        <!-- Left: Problem Description -->
        <div class="arena-problem-panel">
          <div class="arena-prob-header">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="arena-difficulty-tag ${fullQuestion.difficulty}">
                ${fullQuestion.difficulty}
              </span>
              <span style="font-size:0.85rem; color:#60a5fa; font-weight:700;">
                Points: ${problemMeta.points}
              </span>
            </div>
            <h1>${problemMeta.code}. ${fullQuestion.title || problemMeta.title}</h1>
            <div style="font-size:0.8rem; color:#94a3b8;">Time Limit: 1.0s | Memory Limit: 256MB</div>
          </div>

          <div class="arena-prob-body">
            <h4>Problem Statement</h4>
            <p>${fullQuestion.question}</p>

            ${fullQuestion.exampleInput ? `
              <h4>Sample Input</h4>
              <pre>${fullQuestion.exampleInput}</pre>
            ` : ''}

            ${fullQuestion.exampleOutput ? `
              <h4>Sample Output</h4>
              <pre>${fullQuestion.exampleOutput}</pre>
            ` : ''}

            ${fullQuestion.constraints && fullQuestion.constraints.length > 0 ? `
              <h4>Constraints</h4>
              <ul>
                ${fullQuestion.constraints.map(c => `<li><code>${c}</code></li>`).join('')}
              </ul>
            ` : ''}
          </div>
        </div>

        <!-- Right: Code Editor & Sandboxed Test Harness -->
        <div class="arena-editor-panel">
          <div class="arena-editor-header">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:0.85rem; font-weight:700; color:#cbd5e1;">Language:</span>
              <select class="contest-form-control" style="width:auto; padding:4px 10px; font-size:0.82rem;" id="arena-lang-select">
                <option value="java">Java (OpenJDK 17)</option>
                <option value="javascript">JavaScript (Node v20)</option>
                <option value="python">Python 3.12</option>
              </select>
            </div>
            <button class="btn btn-sm btn-secondary" id="btn-reset-code" style="padding:4px 10px; font-size:0.8rem;">
              ↺ Reset Template
            </button>
          </div>

          <textarea class="arena-editor-textarea" id="arena-code-input" spellcheck="false">${initialCode}</textarea>

          <!-- Drawer for Test Results -->
          ${runResults ? `
            <div class="arena-results-drawer" id="arena-results-drawer">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-weight:700; color:${runResults.allPassed ? '#34d399' : '#f87171'}; font-size:0.95rem;">
                  ${runResults.isContestSubmit 
                    ? (runResults.allPassed ? '🎉 ACCEPTED (AC) — Points Awarded!' : '❌ WRONG ANSWER (WA)')
                    : (runResults.allPassed ? '✓ Sample Tests Passed' : '⚠ Some Tests Failed')}
                </span>
                <span style="font-size:0.8rem; color:#94a3b8;">
                  Passed: ${runResults.passedCount}/${runResults.totalCount} | Time: ${runResults.executionTimeMs}ms
                </span>
              </div>

              ${runResults.runtimeError ? `
                <div style="background:rgba(239,68,68,0.15); color:#fca5a5; padding:8px 12px; border-radius:6px; font-family:monospace; font-size:0.85rem; margin-bottom:8px;">
                  ${runResults.runtimeError}
                </div>
              ` : ''}

              <div style="display:flex; flex-direction:column; gap:6px;">
                ${(runResults.results || []).map((tc, idx) => `
                  <div style="background:#090d16; padding:8px 12px; border-radius:6px; font-size:0.82rem; border-left:3px solid ${tc.passed ? '#10b981' : '#ef4444'};">
                    <span style="font-weight:700; color:${tc.passed ? '#34d399' : '#f87171'};">Case #${idx+1}: ${tc.passed ? 'PASSED' : 'FAILED'}</span>
                    <div style="color:#94a3b8; margin-top:2px; font-family:monospace;">Expected: ${tc.expected} | Got: ${tc.actual}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <div class="arena-editor-footer">
            <span style="font-size:0.8rem; color:#64748b;">
              ⚡ Sandboxed Execution Engine Active (<1ms)
            </span>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary btn-sm" id="btn-run-sample-tests" style="font-weight:600;">
                ▶ Run Sample Tests
              </button>
              <button class="btn btn-primary btn-sm" id="btn-submit-contest-solution" style="font-weight:700; background:#10b981; border-color:#10b981;">
                🚀 Submit Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * 3. CONTEST LEADERBOARD MODAL (CodeChef Style Matrix)
 */
export function renderContestLeaderboardModal(contest, currentUser) {
  const leaderboard = ContestEngine.getLeaderboard(contest.id, currentUser);

  return `
    <div class="leaderboard-modal-overlay" id="leaderboard-modal-overlay">
      <div class="leaderboard-modal-card">
        <div class="leaderboard-modal-header">
          <h2>
            <span>🏆</span> Live Standings: ${contest.title}
          </h2>
          <button class="btn btn-sm btn-secondary" id="btn-close-leaderboard" style="padding:4px 10px;">
            ✕ Close
          </button>
        </div>

        <div class="leaderboard-table-container">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th style="width: 60px;">Rank</th>
                <th style="text-align: left;">Contestant</th>
                <th>Score</th>
                <th>Penalty</th>
                ${contest.problems.map(p => `
                  <th class="prob-cell">${p.code} (${p.points})</th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${leaderboard.map(entry => {
                const isUser = entry.isCurrentUser;
                const medal = entry.rank === 1 ? '🥇 ' : (entry.rank === 2 ? '🥈 ' : (entry.rank === 3 ? '🥉 ' : ''));
                
                return `
                  <tr class="${isUser ? 'current-user-row' : ''}">
                    <td class="rank-cell">${medal}${entry.rank}</td>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar-circle">${entry.avatar || 'S'}</div>
                        <div>
                          <div style="font-weight:700; color:${isUser ? '#60a5fa' : '#ffffff'};">${entry.name}</div>
                          <div style="font-size:0.75rem; color:#94a3b8;">${entry.rating || '⭐⭐ Pupil'}</div>
                        </div>
                      </div>
                    </td>
                    <td class="score-cell">${entry.score}</td>
                    <td class="penalty-cell">${entry.penalty}m</td>
                    ${contest.problems.map(p => {
                      const res = entry.problemResults ? entry.problemResults[p.code] : null;
                      if (!res || res.status === 'UNSOLVED') {
                        return `<td class="prob-cell"><span class="matrix-pill none">-</span></td>`;
                      }
                      if (res.status === 'AC') {
                        return `<td class="prob-cell"><span class="matrix-pill ac">+${res.attempts} (${res.time}m)</span></td>`;
                      }
                      return `<td class="prob-cell"><span class="matrix-pill wa">-${res.attempts}</span></td>`;
                    }).join('')}
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

/**
 * 4. ADMIN CREATE CONTEST MODAL
 */
export function renderCreateContestModal() {
  const codingQuestions = QUESTIONS_DB.filter(q => q.type === 'CODING' || q.testCases?.length > 0);

  return `
    <div class="leaderboard-modal-overlay" id="create-contest-modal-overlay">
      <div class="create-contest-modal">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(148,163,184,0.2); padding-bottom:12px;">
          <h2 style="font-size:1.3rem; font-weight:800; color:#ffffff; display:flex; align-items:center; gap:8px;">
            <span>🛠️</span> Schedule New Coding Contest (Admin)
          </h2>
          <button class="btn btn-sm btn-secondary" id="btn-close-create-modal" style="padding:4px 10px;">✕</button>
        </div>

        <form id="form-create-contest">
          <div class="contest-form-group">
            <label>Contest Title *</label>
            <input type="text" class="contest-form-control" id="new-contest-title" placeholder="e.g. LearnPath Starters 43" required />
          </div>

          <div class="contest-form-group">
            <label>Tagline / Description</label>
            <input type="text" class="contest-form-control" id="new-contest-tagline" placeholder="Weekly challenge on Two Pointers & Binary Search" />
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
            <div class="contest-form-group">
              <label>Start Date & Time *</label>
              <input type="datetime-local" class="contest-form-control" id="new-contest-start" required />
            </div>
            <div class="contest-form-group">
              <label>Duration (Minutes) *</label>
              <input type="number" class="contest-form-control" id="new-contest-duration" value="90" min="15" max="360" required />
            </div>
          </div>

          <div class="contest-form-group">
            <label>Select Contest Coding Problems (Check to include):</label>
            <div style="max-height:180px; overflow-y:auto; background:#0f172a; border:1px solid rgba(148,163,184,0.2); border-radius:8px; padding:10px;">
              ${codingQuestions.map(q => `
                <label style="display:flex; align-items:center; gap:10px; margin-bottom:8px; cursor:pointer; font-size:0.86rem; color:#e2e8f0;">
                  <input type="checkbox" name="contest_problems" value="${q.id}" checked />
                  <span><strong>${q.title || q.subtopic}</strong> (${q.difficulty} - ${q.topic})</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:24px;">
            <button type="button" class="btn btn-secondary" id="btn-cancel-create-modal">Cancel</button>
            <button type="submit" class="btn btn-primary" style="font-weight:700;">🚀 Publish Contest</button>
          </div>
        </form>
      </div>
    </div>
  `;
}
