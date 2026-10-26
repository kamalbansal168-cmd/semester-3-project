/* ============================================================
   LEARNPATH AI — Multiplayer Real-Time Battle Arena View
   Supports up to 10+ participants, MCQ + Coding questions,
   Live participant radar, AI bots, and victory podium leaderboard
   ============================================================ */

export function renderBattleView(engineState, activeTab = 'battle') {
  const room = engineState.currentRoom;
  const myId = engineState.myParticipantId;

  // 1. If not in a room, render Hub (Create / Join / Active Rooms)
  if (!room) {
    return renderBattleHub();
  }

  // 2. If in Lobby waiting for players to join
  if (room.status === 'LOBBY') {
    return renderBattleLobby(room, myId, engineState.isHost);
  }

  // 3. If Battle is Active
  if (room.status === 'IN_BATTLE') {
    return renderBattleArena(room, myId, engineState);
  }

  // 4. If Battle Finished
  if (room.status === 'FINISHED') {
    return renderBattleLeaderboard(room, myId);
  }

  return renderBattleHub();
}

// ------------------------------------------------------------
// 1. BATTLE HUB SCREEN
// ------------------------------------------------------------
function renderBattleHub() {
  return `
    <div class="battle-hub-container">
      <!-- Hero Header -->
      <div class="battle-hero">
        <div class="battle-badge-pill">🔥 REAL-TIME MULTIPLAYER ARENA</div>
        <h1 class="battle-hero-title">
          Live <span class="gradient-text">Code Battle</span> Arena
        </h1>
        <p class="battle-hero-subtitle">
          Compete live against up to 10+ classmates or AI bots in synchronized coding & MCQ battles. Test your DSA mastery under pressure!
        </p>

        <!-- Quick 1-Click Demo Button for Viva / Presentation -->
        <div class="quick-demo-banner">
          <div class="demo-banner-content">
            <span class="demo-icon">⚡</span>
            <div>
              <strong>Instant 10-Player Demo (Solo Presentation Mode)</strong>
              <p>Creates a 10-participant arena and auto-fills 9 intelligent AI bots so you can showcase the live leaderboard without needing extra devices.</p>
            </div>
          </div>
          <button class="btn btn-warning btn-md" id="btn-quick-demo">
            Launch 10-Player Demo 🚀
          </button>
        </div>
      </div>

      <!-- Action Cards Grid -->
      <div class="battle-cards-grid">
        <!-- Card 1: Create Custom Battle Room -->
        <div class="battle-card create-card">
          <div class="card-header-icon">👑</div>
          <h2 class="card-title">Create Battle Room</h2>
          <p class="card-desc">Set custom rules, choose topic, select MCQ & coding question mix, and invite your peers.</p>

          <form id="form-create-battle" class="battle-form">
            <div class="form-group">
              <label for="create-room-name">Battle Name</label>
              <input type="text" id="create-room-name" class="battle-input" placeholder="e.g. DSA Championship 2026" value="DSA Code Clash" required />
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="create-max-players">Max Participants</label>
                <select id="create-max-players" class="battle-select">
                  <option value="2">2 Players (1v1 Duel)</option>
                  <option value="4">4 Players (Squad)</option>
                  <option value="8">8 Players (Mini-Tourney)</option>
                  <option value="10" selected>10 Players (Classroom)</option>
                  <option value="15">15 Players (Batch)</option>
                  <option value="20">20 Players (Mega Battle)</option>
                </select>
              </div>

              <div class="form-group">
                <label for="create-time-limit">Time Limit</label>
                <select id="create-time-limit" class="battle-select">
                  <option value="5">5 Minutes (Blitz)</option>
                  <option value="10" selected>10 Minutes (Standard)</option>
                  <option value="15">15 Minutes (Pro)</option>
                  <option value="20">20 Minutes (Deep)</option>
                  <option value="30">30 Minutes (Tournament)</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="create-topic">DSA Topic</label>
                <select id="create-topic" class="battle-select">
                  <option value="all" selected>🌟 All Topics (Mixed)</option>
                  <option value="two-pointer">👉 Two-Pointer Technique</option>
                  <option value="sliding-window">🪟 Sliding Window</option>
                  <option value="basic-arrays">📊 Basic Arrays & Bounds</option>
                  <option value="searching">🔍 Binary Search</option>
                  <option value="sorting">🔄 Sorting Algorithms</option>
                  <option value="strings">🔤 Strings & Immutability</option>
                  <option value="2d-arrays">🧱 2D Arrays & Matrices</option>
                  <option value="prefix-sum">➕ Prefix Sum</option>
                  <option value="recursion">🔁 Recursion & Base Cases</option>
                  <option value="linked-list">🔗 Linked Lists</option>
                  <option value="monotonic-stack">📚 Monotonic Stack</option>
                  <option value="bit-manipulation">⚡ Bit Manipulation</option>
                </select>
              </div>

              <div class="form-group">
                <label for="create-difficulty">Difficulty</label>
                <select id="create-difficulty" class="battle-select">
                  <option value="all" selected>Mixed (Easy + Medium)</option>
                  <option value="Easy">Easy (Beginner Friendly)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Hard">Hard (Advanced)</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label for="create-mcq-count">MCQ Questions</label>
                <select id="create-mcq-count" class="battle-select">
                  <option value="0">0 MCQs (Pure Coding)</option>
                  <option value="1">1 MCQ</option>
                  <option value="2" selected>2 MCQs</option>
                  <option value="3">3 MCQs</option>
                  <option value="5">5 MCQs</option>
                </select>
              </div>

              <div class="form-group">
                <label for="create-coding-count">Coding DSA Questions</label>
                <select id="create-coding-count" class="battle-select">
                  <option value="1" selected>1 Coding Problem</option>
                  <option value="2">2 Coding Problems</option>
                  <option value="3">3 Coding Problems</option>
                  <option value="0">0 Coding (Pure Quiz)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-battle-action">
              Create Arena Room 🚀
            </button>
          </form>
        </div>

        <!-- Card 2: Join Existing Room -->
        <div class="battle-card join-card">
          <div class="card-header-icon">⚔️</div>
          <h2 class="card-title">Join Battle Room</h2>
          <p class="card-desc">Enter a Room Code shared by your host to jump straight into the arena.</p>

          <form id="form-join-battle" class="battle-form">
            <div class="form-group">
              <label for="join-room-code">Room Code</label>
              <input type="text" id="join-room-code" class="battle-input room-code-input" placeholder="e.g. BATTLE-7429" maxlength="12" required />
            </div>

            <div class="form-group">
              <label for="join-player-name">Your Display Name</label>
              <input type="text" id="join-player-name" class="battle-input" placeholder="Enter your name" value="Coder_${Math.floor(Math.random() * 800 + 100)}" required />
            </div>

            <div class="form-group">
              <label>Select Avatar</label>
              <div class="avatar-picker" id="avatar-picker">
                <span class="avatar-opt active" data-avatar="⚔️">⚔️</span>
                <span class="avatar-opt" data-avatar="🚀">🚀</span>
                <span class="avatar-opt" data-avatar="💎">💎</span>
                <span class="avatar-opt" data-avatar="🧠">🧠</span>
                <span class="avatar-opt" data-avatar="👾">👾</span>
                <span class="avatar-opt" data-avatar="🔥">🔥</span>
                <span class="avatar-opt" data-avatar="⚡">⚡</span>
                <span class="avatar-opt" data-avatar="🦊">🦊</span>
              </div>
            </div>

            <button type="submit" class="btn btn-secondary btn-block btn-battle-action">
              Enter Battle Room ⚔️
            </button>
          </form>

          <!-- Arena Rules / Tips -->
          <div class="battle-rules-box">
            <h4>🏆 Arena Scoring Rules:</h4>
            <ul>
              <li><strong>MCQ Questions:</strong> +100 points for correct answer (+ speed bonus).</li>
              <li><strong>Coding Problems:</strong> +250 points for passing all test cases.</li>
              <li><strong>Speed Factor:</strong> Earlier submissions earn up to +80 speed bonus points!</li>
              <li><strong>Rankings:</strong> Live leaderboard updates dynamically as everyone codes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 2. BATTLE WAITING LOBBY
// ------------------------------------------------------------
function renderBattleLobby(room, myId, isHost) {
  const participants = room.participants || [];
  const currentCount = participants.length;
  const maxCount = room.maxParticipants || 10;

  return `
    <div class="battle-lobby-container">
      <!-- Lobby Header -->
      <div class="lobby-header-card">
        <div class="lobby-meta-left">
          <span class="lobby-status-pulse"></span>
          <div>
            <h1 class="lobby-room-name">${room.name}</h1>
            <div class="lobby-tags">
              <span class="lobby-tag">Topic: <strong>${room.topic.toUpperCase()}</strong></span>
              <span class="lobby-tag">Difficulty: <strong>${room.difficulty}</strong></span>
              <span class="lobby-tag">Format: <strong>${room.mcqCount} MCQs + ${room.codingCount} Coding</strong></span>
              <span class="lobby-tag">Timer: <strong>${room.timeLimitMinutes} Mins</strong></span>
            </div>
          </div>
        </div>

        <!-- Room Code Share Badge -->
        <div class="room-code-badge-container">
          <div class="room-code-label">ROOM CODE</div>
          <div class="room-code-display" id="lobby-room-code-val">${room.code}</div>
          <button class="btn btn-sm btn-outline btn-copy-code" id="btn-copy-room-code" title="Copy Room Code">
            📋 Copy Code
          </button>
        </div>
      </div>

      <!-- Participants Grid Header -->
      <div class="participants-section-header">
        <div class="section-title">
          <h3>Participants <span class="badge-count">${currentCount} / ${maxCount}</span></h3>
          <p class="section-sub">Up to ${maxCount} students can compete simultaneously in this arena.</p>
        </div>

        <!-- Host Actions / Bot Injections -->
        <div class="lobby-action-buttons">
          <button class="btn btn-sm btn-secondary" id="btn-add-one-bot" ${currentCount >= maxCount ? 'disabled' : ''}>
            🤖 Add 1 AI Bot
          </button>
          <button class="btn btn-sm btn-secondary" id="btn-fill-bots" ${currentCount >= maxCount ? 'disabled' : ''}>
            ⚡ Fill with AI Bots (+5)
          </button>
          <button class="btn btn-sm btn-danger-outline" id="btn-leave-room">
            Exit Lobby
          </button>
        </div>
      </div>

      <!-- Participants Grid -->
      <div class="participants-grid">
        ${participants.map((p, idx) => `
          <div class="participant-card ${p.id === myId ? 'is-me' : ''} ${p.isHost ? 'is-host' : ''}">
            <div class="p-avatar-circle">${p.avatar || '👤'}</div>
            <div class="p-details">
              <div class="p-name">
                ${p.name}
                ${p.id === myId ? '<span class="pill-you">YOU</span>' : ''}
              </div>
              <div class="p-badges">
                ${p.isHost ? '<span class="pill-host">👑 Host</span>' : ''}
                ${p.isBot ? '<span class="pill-bot">🤖 AI Competitor</span>' : '<span class="pill-human">👤 Human</span>'}
              </div>
              <div class="p-status">
                <span class="status-dot"></span> Ready for clash
              </div>
            </div>
            <div class="p-index">#${idx + 1}</div>
          </div>
        `).join('')}

        <!-- Empty slots visualization -->
        ${Array.from({ length: Math.max(0, Math.min(4, maxCount - currentCount)) }).map((_, i) => `
          <div class="participant-card empty-slot">
            <div class="empty-icon">+</div>
            <div class="empty-text">Waiting for Player ${currentCount + i + 1}...</div>
          </div>
        `).join('')}
      </div>

      <!-- Start Battle Floating Bar -->
      <div class="lobby-footer-bar">
        ${isHost ? `
          <div class="host-start-info">
            <span>You are the Host. When everyone is ready, launch the contest:</span>
          </div>
          <button class="btn btn-primary btn-lg btn-start-battle" id="btn-start-battle">
            🚀 Launch Battle Arena (${currentCount} Ready)
          </button>
        ` : `
          <div class="waiting-host-notice">
            <div class="spinner-mini"></div>
            <span>Waiting for room host to start the battle... Get ready!</span>
          </div>
        `}
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 3. LIVE BATTLE ARENA (SPLIT SCREEN)
// ------------------------------------------------------------
function renderBattleArena(room, myId, engineState) {
  const questions = room.questions || [];
  const currentQIdx = engineState.activeQuestionIdx || 0;
  const currentQ = questions[currentQIdx] || questions[0];
  const participants = [...(room.participants || [])].sort((a, b) => b.score - a.score);
  const myParticipant = participants.find((p) => p.id === myId) || {};

  const remainingSec = engineState.remainingSeconds || (room.timeLimitMinutes * 60);
  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isTimeCritical = remainingSec < 120; // under 2 mins

  const isMcq = currentQ && currentQ.type === 'MCQ';

  return `
    <div class="battle-arena-layout">
      <!-- 1. Top Synchronized Battle Bar -->
      <header class="battle-top-bar">
        <div class="bar-left">
          <div class="arena-tag">⚔️ LIVE ARENA</div>
          <h2 class="arena-room-title">${room.name}</h2>
          <span class="arena-room-code-tag">${room.code}</span>
        </div>

        <!-- Question Tabs Navigator -->
        <div class="arena-questions-nav">
          ${questions.map((q, idx) => {
            const isCurrent = idx === currentQIdx;
            const qTypeTag = q.type === 'MCQ' ? 'MCQ' : 'CODE';
            return `
              <button class="arena-q-tab ${isCurrent ? 'active' : ''}" data-qidx="${idx}">
                <span class="q-tab-num">Q${idx + 1}</span>
                <span class="q-tab-type">${qTypeTag}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Synchronized Countdown Timer & Score -->
        <div class="bar-right">
          <div class="my-live-score" title="Your current battle points">
            <span class="score-icon">⭐</span>
            <span class="score-val" id="arena-my-score">${myParticipant.score || 0}</span>
            <span class="score-unit">pts</span>
          </div>

          <div class="countdown-timer-box ${isTimeCritical ? 'pulse-danger' : ''}" id="arena-timer-box">
            <span class="timer-icon">⏱️</span>
            <span class="timer-digits" id="arena-timer-digits">${timeFormatted}</span>
          </div>

          <button class="btn btn-sm btn-outline btn-leave-battle" id="btn-leave-battle" title="Leave Battle">
            Surrender 🏳️
          </button>
        </div>
      </header>

      <!-- 2. Arena Main Body: Split Screen -->
      <div class="battle-arena-body">
        <!-- LEFT: Question Workspace -->
        <div class="arena-workspace">
          ${isMcq ? renderArenaMcq(currentQ, currentQIdx, engineState) : renderArenaCoding(currentQ, currentQIdx, engineState)}
        </div>

        <!-- RIGHT: Live Participant Radar & Activity Ticker -->
        <aside class="arena-radar-sidebar">
          <div class="radar-header">
            <div class="radar-title">
              <span class="radar-dot"></span>
              <h3>Live Leaderboard</h3>
            </div>
            <span class="radar-player-count">${participants.length} Competing</span>
          </div>

          <!-- Live Leaderboard List -->
          <div class="radar-participants-list" id="radar-participants-list">
            ${participants.map((p, idx) => {
              const isMe = p.id === myId;
              const rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
              const progressPct = Math.round(((p.solvedCount || 0) / Math.max(1, questions.length)) * 100);

              return `
                <div class="radar-participant-row ${isMe ? 'is-me' : ''}">
                  <div class="radar-rank">${rankIcon}</div>
                  <div class="radar-avatar">${p.avatar || '👤'}</div>
                  <div class="radar-info">
                    <div class="radar-name-row">
                      <span class="radar-name">${p.name} ${isMe ? '(You)' : ''}</span>
                      <span class="radar-score">${p.score || 0} pts</span>
                    </div>
                    <!-- Live Progress Bar -->
                    <div class="radar-progress-bar-bg">
                      <div class="radar-progress-fill" style="width: ${progressPct}%"></div>
                    </div>
                    <div class="radar-status-msg">
                      <span>${p.status || 'Thinking...'}</span>
                      <span class="radar-solved-tag">${p.solvedCount || 0}/${questions.length} Solved</span>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Live Activity Feed Ticker -->
          <div class="arena-activity-feed">
            <div class="feed-header">📡 Live Activity Feed</div>
            <div class="feed-items-box" id="arena-feed-box">
              <div class="feed-item">🚀 Battle officially launched! Timer started.</div>
              ${(engineState.feedHistory || []).slice(-5).map((f) => `
                <div class="feed-item">${f}</div>
              `).join('')}
            </div>
          </div>
        </aside>
      </div>
    </div>
  `;
}

// 3A. MCQ Arena Renderer
function renderArenaMcq(q, qIdx, engineState) {
  const answeredResult = engineState.mcqAnswers && engineState.mcqAnswers[q.id];

  return `
    <div class="mcq-arena-card">
      <div class="mcq-card-top">
        <div class="mcq-badges">
          <span class="badge-q-type">MCQ QUESTION ${qIdx + 1}</span>
          <span class="badge-difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
          <span class="badge-topic">${q.topic}</span>
        </div>
        <div class="mcq-points-pot">+100 PTS (+ SPEED BONUS)</div>
      </div>

      <h2 class="mcq-question-title">${q.title}</h2>
      <p class="mcq-question-text">${q.question}</p>

      ${q.snippet ? `
        <div class="mcq-code-snippet">
          <pre><code>${q.snippet}</code></pre>
        </div>
      ` : ''}

      <!-- Options List -->
      <div class="mcq-options-container" id="mcq-options-container">
        ${(q.options || []).map((opt, optIdx) => {
          let optClass = 'mcq-option-btn';
          if (answeredResult) {
            if (optIdx === q.correct_answer) optClass += ' option-correct';
            else if (optIdx === answeredResult.selectedIdx) optClass += ' option-wrong';
            else optClass += ' option-disabled';
          }

          return `
            <button class="${optClass}" data-optidx="${optIdx}" ${answeredResult ? 'disabled' : ''}>
              <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Instant Feedback Box -->
      ${answeredResult ? `
        <div class="mcq-feedback-banner ${answeredResult.isCorrect ? 'banner-success' : 'banner-wrong'}">
          <div class="feedback-icon">${answeredResult.isCorrect ? '🎉' : '❌'}</div>
          <div>
            <strong>${answeredResult.isCorrect ? 'Correct Answer! +' + (answeredResult.ptsEarned || 100) + ' Points Earned' : 'Incorrect Choice'}</strong>
            <p>${answeredResult.explanation || q.explanation}</p>
          </div>
        </div>
      ` : `
        <div class="mcq-action-bar">
          <button class="btn btn-primary btn-md" id="btn-submit-mcq" disabled>
            Submit Answer 🚀
          </button>
        </div>
      `}
    </div>
  `;
}

// 3B. Coding Arena Renderer
function renderArenaCoding(q, qIdx, engineState) {
  const currentCode = engineState.codingSubmissions && engineState.codingSubmissions[q.id]
    ? engineState.codingSubmissions[q.id].code
    : (q.starterCode || `class Solution {\n    // Implement your solution here\n}`);

  const runResults = engineState.lastRunResults;
  const isSubmitted = engineState.codingSubmissions && engineState.codingSubmissions[q.id] && engineState.codingSubmissions[q.id].isSubmitted;

  return `
    <div class="coding-arena-layout">
      <!-- Left Split: Problem Specs -->
      <div class="coding-spec-panel">
        <div class="spec-header">
          <span class="badge-q-type">CODING CHALLENGE ${qIdx + 1}</span>
          <span class="badge-difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
          <span class="spec-points">+250 PTS POT</span>
        </div>

        <h2 class="problem-title">${q.title}</h2>
        <div class="problem-desc">${q.question}</div>

        <div class="problem-examples">
          <h4>Example Case:</h4>
          <div class="example-box">
            <div><strong>Input:</strong> <code>${q.exampleInput || 'arr = [1, 2, 3]'}</code></div>
            <div><strong>Output:</strong> <code>${q.exampleOutput || '[3, 2, 1]'}</code></div>
          </div>
        </div>

        ${q.constraints ? `
          <div class="problem-constraints">
            <h4>Constraints:</h4>
            <ul>
              ${q.constraints.map((c) => `<li><code>${c}</code></li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Test Case Results Cards -->
        <div class="test-results-panel">
          <h4>Test Cases Execution</h4>
          ${runResults ? `
            <div class="test-cases-summary ${runResults.allPassed ? 'summary-passed' : 'summary-failed'}">
              ${runResults.allPassed ? '✅ ALL TEST CASES PASSED!' : `⚙️ ${runResults.passedCount}/${runResults.totalCount} Test Cases Passed`}
            </div>
            <div class="test-cases-list">
              ${(runResults.results || []).map((tc) => `
                <div class="tc-item ${tc.passed ? 'tc-pass' : 'tc-fail'}">
                  <div class="tc-top">
                    <span>Case #${tc.caseIndex}</span>
                    <span class="tc-status-pill">${tc.passed ? 'PASSED' : 'FAILED'}</span>
                  </div>
                  <div class="tc-io">
                    <div>Input: <code>${tc.input}</code></div>
                    <div>Expected: <code>${tc.expected}</code></div>
                    <div>Actual: <code>${tc.actual}</code></div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="test-placeholder">
              Click <strong>"Run Test Cases"</strong> to verify your logic against sample test cases before submitting.
            </div>
          `}
        </div>
      </div>

      <!-- Right Split: Code Editor -->
      <div class="coding-editor-panel">
        <div class="editor-top-bar">
          <div class="lang-tag">☕ Java Solution.java</div>
          <button class="btn btn-sm btn-outline" id="btn-reset-code">Reset Starter Code</button>
        </div>

        <div class="editor-textarea-wrapper">
          <textarea id="battle-code-textarea" class="battle-code-textarea" spellcheck="false">${currentCode}</textarea>
        </div>

        <!-- Action Footer -->
        <div class="editor-action-footer">
          <button class="btn btn-secondary btn-md" id="btn-run-code">
            ▶️ Run Test Cases
          </button>
          <button class="btn btn-primary btn-md ${isSubmitted ? 'btn-submitted' : ''}" id="btn-submit-code">
            ${isSubmitted ? '✅ Solution Submitted' : '🚀 Submit Final Solution'}
          </button>
        </div>
      </div>
    </div>
  `;
}

// ------------------------------------------------------------
// 4. BATTLE VICTORY PODIUM & LEADERBOARD
// ------------------------------------------------------------
function renderBattleLeaderboard(room, myId) {
  const participants = [...(room.participants || [])].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.solvedCount - a.solvedCount;
  });

  const p1 = participants[0];
  const p2 = participants[1];
  const p3 = participants[2];

  const myRank = participants.findIndex((p) => p.id === myId) + 1;
  const myParticipant = participants.find((p) => p.id === myId) || {};

  return `
    <div class="battle-results-container">
      <!-- Victory Confetti & Header -->
      <div class="results-hero">
        <div class="victory-trophy-icon">🏆</div>
        <h1 class="results-title">Battle Concluded!</h1>
        <p class="results-subtitle">
          ${room.name} — ${room.topic.toUpperCase()} Arena Results
        </p>

        <!-- Your Performance Banner -->
        <div class="my-result-badge">
          <span>Your Final Rank: <strong>#${myRank || '-'}</strong> out of ${participants.length} Players</span>
          <span class="earned-xp">+${myParticipant.score || 0} XP Earned</span>
        </div>
      </div>

      <!-- 3D Victory Podium for Top 3 -->
      <div class="victory-podium-container">
        <!-- 2nd Place (Silver) -->
        ${p2 ? `
          <div class="podium-pillar pillar-silver">
            <div class="podium-avatar-wrapper">
              <span class="podium-crown">🥈</span>
              <div class="podium-avatar">${p2.avatar || '👤'}</div>
            </div>
            <div class="podium-name">${p2.name}</div>
            <div class="podium-score">${p2.score} pts</div>
            <div class="podium-block block-2">
              <span class="podium-rank-num">2</span>
            </div>
          </div>
        ` : ''}

        <!-- 1st Place (Gold Winner) -->
        ${p1 ? `
          <div class="podium-pillar pillar-gold">
            <div class="podium-avatar-wrapper">
              <span class="podium-crown">👑</span>
              <div class="podium-avatar winner-avatar">${p1.avatar || '👑'}</div>
            </div>
            <div class="podium-name winner-name">${p1.name}</div>
            <div class="podium-score winner-score">${p1.score} pts</div>
            <div class="podium-block block-1">
              <span class="podium-rank-num">1</span>
            </div>
          </div>
        ` : ''}

        <!-- 3rd Place (Bronze) -->
        ${p3 ? `
          <div class="podium-pillar pillar-bronze">
            <div class="podium-avatar-wrapper">
              <span class="podium-crown">🥉</span>
              <div class="podium-avatar">${p3.avatar || '👤'}</div>
            </div>
            <div class="podium-name">${p3.name}</div>
            <div class="podium-score">${p3.score} pts</div>
            <div class="podium-block block-3">
              <span class="podium-rank-num">3</span>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Complete Standings Table for All Participants -->
      <div class="complete-standings-card">
        <h3 class="standings-title">Complete Standings (${participants.length} Participants)</h3>
        <div class="standings-table-wrapper">
          <table class="standings-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Participant</th>
                <th>Type</th>
                <th>Solved</th>
                <th>Status</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              ${participants.map((p, idx) => {
                const isMe = p.id === myId;
                const medal = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`;
                return `
                  <tr class="${isMe ? 'row-is-me' : ''}">
                    <td class="td-rank"><strong>${medal}</strong></td>
                    <td class="td-player">
                      <span class="player-avatar">${p.avatar || '👤'}</span>
                      <span class="player-name">${p.name} ${isMe ? '<span class="pill-you">YOU</span>' : ''}</span>
                    </td>
                    <td>${p.isBot ? '<span class="pill-bot">AI Bot</span>' : '<span class="pill-human">Human</span>'}</td>
                    <td><strong>${p.solvedCount || 0} / ${room.questions ? room.questions.length : 3}</strong></td>
                    <td class="td-status">${p.status || 'Finished'}</td>
                    <td class="td-score"><strong>${p.score || 0} pts</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Exit / Play Again Actions -->
      <div class="results-actions">
        <button class="btn btn-primary btn-lg" id="btn-results-new-battle">
          ⚔️ Play Another Battle
        </button>
        <button class="btn btn-secondary btn-lg" id="btn-results-dashboard">
          📊 Back to Dashboard
        </button>
      </div>
    </div>
  `;
}
