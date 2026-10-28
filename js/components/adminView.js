/* ============================================================
   LEARNPATH AI — Super Admin / Company Executive Portal View
   (Owner / "Malik" Full Platform Governance Dashboard)
   ============================================================ */

export function renderAdminView(state) {
  const activeUser = state.user || { name: 'Aryan Soni', points: 42 };

  // Master Registered User Roster (In-House Students + Live Session)
  const masterUsers = [
    { id: 'usr_001', name: 'Priya Sharma', email: 'priya.sharma@learnpath.edu', role: 'Cohort Scholar', solved: 48, mastery: 82, recovery: 74, status: 'Active', plan: 'University Pro' },
    { id: 'usr_002', name: 'Rohit Verma', email: 'rohit.v@learnpath.edu', role: 'Student', solved: 41, mastery: 74, recovery: 62, status: 'Active', plan: 'University Pro' },
    { id: 'usr_003', name: 'Ananya Patel', email: 'ananya.p@learnpath.edu', role: 'Student', solved: 54, mastery: 88, recovery: 85, status: 'Active', plan: 'University Pro' },
    { id: 'usr_004', name: 'Aryan Soni', email: 'aryan.soni@learnpath.edu', role: 'Company Founder / Admin', solved: 62, mastery: 91, recovery: 90, status: 'Active', plan: 'Enterprise SuperAdmin' },
    { id: 'usr_005', name: 'Kavya Iyer', email: 'kavya.iyer@learnpath.edu', role: 'Student', solved: 39, mastery: 79, recovery: 68, status: 'Idle (2h ago)', plan: 'Standard' },
    { id: 'usr_006', name: 'Aditya Rao', email: 'aditya.rao@learnpath.edu', role: 'Student', solved: 32, mastery: 68, recovery: 55, status: 'Active', plan: 'Standard' },
    { id: 'usr_007', name: 'Sneha Gupta', email: 'sneha.g@learnpath.edu', role: 'Student', solved: 46, mastery: 85, recovery: 78, status: 'Active', plan: 'University Pro' },
    { id: 'usr_008', name: 'Aman Tripathi', email: 'aman.tripathi@learnpath.edu', role: 'Student', solved: 51, mastery: 89, recovery: 82, status: 'Active', plan: 'University Pro' },
    { id: 'usr_009', name: 'Ishita Saxena', email: 'ishita.s@learnpath.edu', role: 'Student', solved: 35, mastery: 76, recovery: 65, status: 'Idle (1d ago)', plan: 'Standard' },
    { id: 'usr_010', name: 'Tanmay Deshmukh', email: 'tanmay.d@learnpath.edu', role: 'Student', solved: 44, mastery: 83, recovery: 71, status: 'Active', plan: 'University Pro' }
  ];

  return `
    <div class="admin-view">
      <!-- Executive Header -->
      <div class="admin-header">
        <div class="admin-title-group">
          <h1>
            <span>🏢</span> Company Executive Portal & Super-Admin
          </h1>
          <p>
            LearnPath AI Inc. Global Infrastructure & Enterprise User Governance Dashboard.
          </p>
          <div style="margin-top: 8px;">
            <span class="admin-badge-owner">👑 Platform Owner Access (Full Control)</span>
            <span style="font-size: 0.8rem; color: #10b981; margin-left: 12px; font-weight: 600;">
              🟢 Server Cluster: US-East-1 (Uptime: 99.98% | Latency: 14ms)
            </span>
          </div>
        </div>

        <div class="admin-actions">
          <button class="admin-btn admin-btn-outline" id="btn-admin-export-db">
            <span>📥</span> Export Master Database (CSV/JSON)
          </button>
          <button class="admin-btn admin-btn-primary" id="btn-admin-sync-ml">
            <span>⚡</span> Sync Kaggle DKT Weights
          </button>
        </div>
      </div>

      <!-- Macro Executive KPIs -->
      <div class="admin-kpi-grid">
        <div class="admin-kpi-card gold">
          <div class="admin-kpi-header">
            <span class="admin-kpi-label">Total Platform Users</span>
            <span class="admin-kpi-icon">👥</span>
          </div>
          <div class="admin-kpi-val">1,658</div>
          <div class="admin-kpi-sub">
            <span>▲ +14.2%</span> MoM Growth (65 In-House + 1,589 Benchmark)
          </div>
        </div>

        <div class="admin-kpi-card green">
          <div class="admin-kpi-header">
            <span class="admin-kpi-label">Total Code & Quiz Runs</span>
            <span class="admin-kpi-icon">💻</span>
          </div>
          <div class="admin-kpi-val">15,892</div>
          <div class="admin-kpi-sub">
            <span>▲ 98.4%</span> Zero-latency sandboxed execution
          </div>
        </div>

        <div class="admin-kpi-card purple">
          <div class="admin-kpi-header">
            <span class="admin-kpi-label">Knowledge Recovery Rate</span>
            <span class="admin-kpi-icon">🔄</span>
          </div>
          <div class="admin-kpi-val">68.4%</div>
          <div class="admin-kpi-sub">
            <span>★ Industry Lead</span> Mistakes converted to mastery
          </div>
        </div>

        <div class="admin-kpi-card">
          <div class="admin-kpi-header">
            <span class="admin-kpi-label">Core AI Engine Status</span>
            <span class="admin-kpi-icon">🧠</span>
          </div>
          <div class="admin-kpi-val" style="font-size: 1.65rem; color: #60a5fa;">TransDKT+</div>
          <div class="admin-kpi-sub" style="color: #60a5fa;">
            <span>AUC: 0.854</span> | Accuracy: 79.2%
          </div>
        </div>
      </div>

      <!-- Main Layout: Master User Roster (Left) + System Health & AI Governance (Right) -->
      <div class="admin-layout-split">
        <!-- Master User Directory -->
        <div class="admin-card">
          <div class="admin-card-header">
            <h2 class="admin-card-title">
              <span>👤</span> Master User Directory (Full User Access)
            </h2>
            <div class="admin-search-box">
              <span>🔍</span>
              <input type="text" id="admin-user-search" placeholder="Search user by name or email..." />
            </div>
          </div>

          <div class="admin-table-wrapper">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Student / Account</th>
                  <th>Plan Tier</th>
                  <th>Problems Solved</th>
                  <th>Mastery</th>
                  <th>Recovery Rate</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody id="admin-user-table-body">
                ${masterUsers.map(u => `
                  <tr>
                    <td>
                      <div class="admin-user-cell">
                        <div class="admin-user-avatar">${u.name.charAt(0)}</div>
                        <div>
                          <div class="admin-user-name">${u.name}</div>
                          <div class="admin-user-email">${u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="admin-badge-plan ${u.plan.includes('Enterprise') ? 'pro' : (u.plan.includes('Pro') ? 'pro' : 'standard')}">
                        ${u.plan}
                      </span>
                    </td>
                    <td><strong style="color: #f8fafc;">${u.solved}</strong> questions</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:6px;">
                        <span style="font-weight:700;color:${u.mastery >= 80 ? '#10b981' : '#f59e0b'};">${u.mastery}%</span>
                      </div>
                    </td>
                    <td>
                      <span style="color:#60a5fa;font-weight:600;">${u.recovery}%</span>
                    </td>
                    <td>
                      <span class="admin-badge-status">
                        <span class="admin-status-dot"></span>
                        ${u.status}
                      </span>
                    </td>
                    <td>
                      <button class="admin-btn-action" onclick="alert('Viewing comprehensive learning telemetry for ${u.name}');">
                        Inspect
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right Side: System & Company Governance -->
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- System & Model Governance -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title">
                <span>⚙️</span> Enterprise Infrastructure
              </h3>
            </div>
            <div>
              <div class="admin-system-item">
                <span class="admin-system-key"><span>🗄️</span> Active Dataset</span>
                <span class="admin-system-val">1,657 rows (Kaggle EDM)</span>
              </div>
              <div class="admin-system-item">
                <span class="admin-system-key"><span>🧠</span> Serialized Model</span>
                <span class="admin-system-val">trained_dkt_model.pkl</span>
              </div>
              <div class="admin-system-item">
                <span class="admin-system-key"><span>⚡</span> Web Server Engine</span>
                <span class="admin-system-val">Node.js Express (Port 3000)</span>
              </div>
              <div class="admin-system-item">
                <span class="admin-system-key"><span>🔒</span> Security Protocol</span>
                <span class="admin-system-val">Role-Based Access (Owner)</span>
              </div>
              <div class="admin-system-item">
                <span class="admin-system-key"><span>⏱️</span> In-Memory Cache</span>
                <span class="admin-system-val">VirtualFileSystem (VFS)</span>
              </div>
            </div>
          </div>

          <!-- Misconception Analytics (Company Overview) -->
          <div class="admin-card">
            <div class="admin-card-header">
              <h3 class="admin-card-title">
                <span>⚠️</span> Common User Mistakes
              </h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                  <span>Index Out of Bounds</span>
                  <span style="font-weight: 700; color: #ef4444;">31%</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden;">
                  <div style="width: 31%; height: 100%; background: #ef4444;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                  <span>Loop Boundary (Off-by-One)</span>
                  <span style="font-weight: 700; color: #f59e0b;">28%</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden;">
                  <div style="width: 28%; height: 100%; background: #f59e0b;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                  <span>Time Limit Exceeded (TLE)</span>
                  <span style="font-weight: 700; color: #eab308;">18%</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden;">
                  <div style="width: 18%; height: 100%; background: #eab308;"></div>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                  <span>Null Pointer / Type Mismatch</span>
                  <span style="font-weight: 700; color: #3b82f6;">14%</span>
                </div>
                <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden;">
                  <div style="width: 14%; height: 100%; background: #3b82f6;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
