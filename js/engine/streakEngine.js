/* ============================================================
   LEARNPATH AI — LeetCode-Style Streak & Activity Engine
   Calculates submission calendars, streaks, and generates
   the 12-month activity heatmap identical to LeetCode.
   ============================================================ */

/**
 * Formats a Date object to 'YYYY-MM-DD'
 */
export function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object into a readable string: 'Oct 27, 2026'
 */
export function formatReadableDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Generates realistic seed activity matching the LeetCode screenshot:
 * - 63 total submissions in past year
 * - 15 total active days
 * - 3 days max streak
 * - Activity in Feb, Jul, Aug, Sep, Oct
 */
export function generateSeedActivity(referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const currentYear = ref.getFullYear();

  // Pattern matching LeetCode screenshot (63 submissions, 15 active days, max streak 3)
  const items = [
    // Feb: 1 active day, 4 submissions
    { date: `${currentYear}-02-18`, count: 4 },

    // Jul: 1 active day, 3 submissions
    { date: `${currentYear}-07-22`, count: 3 },

    // Aug: 4 active days, 16 submissions
    { date: `${currentYear}-08-04`, count: 3 },
    { date: `${currentYear}-08-14`, count: 5 },
    { date: `${currentYear}-08-15`, count: 4 }, // 2-day streak
    { date: `${currentYear}-08-28`, count: 4 },

    // Sep: 8 active days, 35 submissions (contains 3-day max streak)
    { date: `${currentYear}-09-02`, count: 3 },
    { date: `${currentYear}-09-03`, count: 4 }, // 2-day streak
    { date: `${currentYear}-09-09`, count: 2 },
    { date: `${currentYear}-09-15`, count: 6 },
    { date: `${currentYear}-09-16`, count: 5 },
    { date: `${currentYear}-09-17`, count: 7 }, // 3-day max streak! (Sep 15, 16, 17)
    { date: `${currentYear}-09-24`, count: 4 },
    { date: `${currentYear}-09-25`, count: 4 },

    // Oct: 1 active day (today), 5 submissions
    { date: formatDate(ref), count: 5 }
  ];

  const calendar = {};
  items.forEach(it => {
    calendar[it.date] = it.count;
  });

  return calendar;
}

/**
 * Calculates LeetCode Streak Statistics from a submission calendar:
 * - totalSubmissions: count of submissions in rolling 365 days
 * - totalActiveDays: count of unique days with submissions in rolling 365 days
 * - maxStreak: longest run of consecutive active days
 * - currentStreak: consecutive active days ending today (or yesterday)
 */
export function calculateStreakStats(calendar = {}, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const todayStr = formatDate(ref);

  const oneYearAgo = new Date(ref);
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  const oneYearAgoStr = formatDate(oneYearAgo);

  const activeDates = Object.keys(calendar)
    .filter(d => (calendar[d] || 0) > 0)
    .sort();

  let totalSubmissions = 0;
  let totalActiveDays = 0;

  activeDates.forEach(d => {
    if (d >= oneYearAgoStr && d <= todayStr) {
      totalSubmissions += calendar[d];
      totalActiveDays += 1;
    }
  });

  // Calculate Max Streak across all recorded dates
  let maxStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  activeDates.forEach(dStr => {
    const d = new Date(dStr + 'T00:00:00');
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffMs = d.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > maxStreak) {
      maxStreak = tempStreak;
    }
    prevDate = d;
  });

  // Calculate Current Streak
  const yesterday = new Date(ref);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let currentStreak = 0;
  let checkDate = new Date(ref);

  if ((calendar[todayStr] || 0) > 0) {
    while (true) {
      const s = formatDate(checkDate);
      if ((calendar[s] || 0) > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  } else if ((calendar[yesterdayStr] || 0) > 0) {
    checkDate = new Date(yesterday);
    while (true) {
      const s = formatDate(checkDate);
      if ((calendar[s] || 0) > 0) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  return {
    totalSubmissions,
    totalActiveDays,
    maxStreak: Math.max(maxStreak, currentStreak),
    currentStreak
  };
}

/**
 * Returns color intensity level (0 to 3) for a submission count
 */
export function getSubmissionLevel(count = 0) {
  if (count <= 0) return 0;
  if (count <= 2) return 1; // 1-2: dark forest green
  if (count <= 5) return 2; // 3-5: medium emerald green
  return 3;                 // 6+: bright luminous green
}

/**
 * Generates the 12-month calendar data structure for the LeetCode heatmap grid
 */
export function generateHeatmapMonths(calendar = {}, referenceDate = new Date()) {
  const ref = new Date(referenceDate);
  const todayStr = formatDate(ref);
  const monthsData = [];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // 12 months rolling: from 11 months ago up to current month
  for (let offset = 11; offset >= 0; offset--) {
    const d = new Date(ref.getFullYear(), ref.getMonth() - offset, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthName = monthNames[month];

    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun, 6 = Sat
    const totalDays = new Date(year, month + 1, 0).getDate();

    const weeks = [];
    let currentWeek = [];

    // Pad beginning of first week if month does not start on Sunday
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ inMonth: false });
    }

    // Fill days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = new Date(year, month, day);
      const dayOfWeek = dayDate.getDay();
      const dateStr = formatDate(dayDate);
      const count = calendar[dateStr] || 0;
      const level = getSubmissionLevel(count);
      const isToday = dateStr === todayStr;

      currentWeek.push({
        inMonth: true,
        day,
        dayOfWeek,
        dateStr,
        formattedDate: formatReadableDate(dayDate),
        count,
        level,
        isToday
      });

      // Close column at Saturday (day 6) or on the last day of the month
      if (dayOfWeek === 6 || day === totalDays) {
        if (day === totalDays) {
          // Pad the remainder of the last week with transparent spacers
          while (currentWeek.length < 7) {
            currentWeek.push({ inMonth: false });
          }
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    monthsData.push({
      year,
      month,
      monthName,
      weeks
    });
  }

  return monthsData;
}

/**
 * Renders the HTML markup for the LeetCode-style Streak Heatmap Card
 */
export function renderStreakHeatmapCard(state) {
  const calendar = state.submissionCalendar || {};
  const stats = calculateStreakStats(calendar);
  const months = generateHeatmapMonths(calendar);

  return `
    <div class="leetcode-streak-card" id="leetcode-streak-card">
      <!-- Card Header: Stats & Meta -->
      <div class="streak-header-row">
        <div class="streak-header-left">
          <span class="streak-main-count">${stats.totalSubmissions}</span>
          <span class="streak-main-label">submissions in the past one year</span>
          <span class="streak-info-icon" title="Submissions include all concept recoveries, practice challenges, re-tests, and code attempts.">ⓘ</span>
        </div>
        <div class="streak-header-right">
          <div class="streak-stat-item">
            <span class="streak-stat-label">Total active days:</span>
            <span class="streak-stat-val">${stats.totalActiveDays}</span>
          </div>
          <div class="streak-stat-item">
            <span class="streak-stat-label">Max streak:</span>
            <span class="streak-stat-val">${stats.maxStreak}</span>
          </div>
          <div class="streak-stat-item streak-current-pill">
            <span class="streak-stat-label">Current:</span>
            <span class="streak-stat-val fire">🔥 ${stats.currentStreak}d</span>
          </div>
        </div>
      </div>

      <!-- Heatmap Scroll Wrapper -->
      <div class="streak-heatmap-scroll" id="streak-heatmap-scroll">
        <div class="streak-months-container">
          ${months.map(m => `
            <div class="streak-month-block" data-month="${m.monthName}" data-year="${m.year}">
              <!-- Grid of Weeks (columns) -->
              <div class="streak-month-grid">
                ${m.weeks.map(w => `
                  <div class="streak-week-col">
                    ${w.map(cell => {
                      if (!cell.inMonth) {
                        return `<div class="streak-cell-spacer" aria-hidden="true"></div>`;
                      }
                      const activeClass = cell.count > 0 ? `level-${cell.level}` : 'level-0';
                      const todayClass = cell.isToday ? 'is-today' : '';
                      const tooltipText = cell.count > 0
                        ? `${cell.count} submission${cell.count > 1 ? 's' : ''} on ${cell.formattedDate}`
                        : `No submissions on ${cell.formattedDate}`;
                      return `
                        <div
                          class="streak-cell ${activeClass} ${todayClass}"
                          data-date="${cell.dateStr}"
                          data-formatted="${cell.formattedDate}"
                          data-count="${cell.count}"
                          data-tooltip="${tooltipText}"
                          role="gridcell"
                          tabindex="0"
                          aria-label="${tooltipText}">
                        </div>
                      `;
                    }).join('')}
                  </div>
                `).join('')}
              </div>
              <!-- Month Label Below Month Column -->
              <div class="streak-month-label">${m.monthName}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Card Footer: Interactive Details & Legend -->
      <div class="streak-footer-row">
        <div class="streak-footer-info" id="streak-inspected-date">
          <span class="streak-hint-icon">✨</span>
          <span class="streak-hint-text">Hover or click any square to inspect activity for that day.</span>
        </div>

        <div class="streak-legend-wrapper">
          <span class="legend-text">Less</span>
          <div class="legend-cell level-0" title="0 submissions"></div>
          <div class="legend-cell level-1" title="1-2 submissions"></div>
          <div class="legend-cell level-2" title="3-5 submissions"></div>
          <div class="legend-cell level-3" title="6+ submissions"></div>
          <span class="legend-text">More</span>
        </div>
      </div>

      <!-- Quick Interactive Actions Bar -->
      <div class="streak-actions-bar">
        <div class="streak-actions-left">
          <button class="streak-btn-quick" id="btn-streak-simulate-solve" title="Add 1 practice submission to today's date and watch your streak grow!">
            ⚡ +1 Practice Solve (Simulate)
          </button>
          <button class="streak-btn-link" id="btn-streak-restore-demo" title="Restore sample 63-submission calendar">
            🔄 Reset to 63-Submissions Sample
          </button>
        </div>
        <button class="streak-btn-primary" data-route="practice">
          🔥 Solve Problems to Keep Streak →
        </button>
      </div>

      <!-- Floating Custom Tooltip -->
      <div class="streak-tooltip" id="streak-floating-tooltip" style="display: none;"></div>
    </div>
  `;
}
