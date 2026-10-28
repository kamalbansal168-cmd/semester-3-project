/* ============================================================
   LEARNPATH AI — Visual Studio Code "Open World" Studio Component
   Full web replica of VS Code with Activity Bar, Explorer,
   Extensions Marketplace, Multi-Language Terminal, and Welcome Screen.
   ============================================================ */

import { vfs } from '../engine/virtualFileSystem.js';

export const VSCODE_EXTENSIONS_CATALOG = [
  {
    id: 'ms-python',
    name: 'Python',
    publisher: 'Microsoft',
    icon: '🐍',
    downloads: '108.5M',
    rating: '4.8',
    description: 'IntelliSense (Pylance), Linting, Debugging, code navigation, code formatting for Python 3.',
    installed: true,
    tag: 'Official'
  },
  {
    id: 'vscjava.vscode-java-pack',
    name: 'Extension Pack for Java',
    publisher: 'Microsoft',
    icon: '☕',
    downloads: '64.2M',
    rating: '4.7',
    description: 'Language Support for Java™ by Red Hat, Debugger for Java, Test Runner, and Maven/Gradle project support.',
    installed: true,
    tag: 'Official'
  },
  {
    id: 'ms-vscode.cpptools',
    name: 'C/C++',
    publisher: 'Microsoft',
    icon: '⚡',
    downloads: '58.9M',
    rating: '4.6',
    description: 'C/C++ IntelliSense, debugging, and code browsing with GCC, Clang, and MSVC.',
    installed: true,
    tag: 'Official'
  },
  {
    id: 'esbenp.prettier-vscode',
    name: 'Prettier - Code Formatter',
    publisher: 'Prettier',
    icon: '💅',
    downloads: '45.1M',
    rating: '4.8',
    description: 'Opinionated code formatter for JavaScript, TypeScript, CSS, HTML, JSON, Markdown, and YAML.',
    installed: true,
    tag: 'Verified'
  },
  {
    id: 'github.copilot',
    name: 'GitHub Copilot',
    publisher: 'GitHub',
    icon: '🤖',
    downloads: '21.4M',
    rating: '4.9',
    description: 'Your AI pair programmer. Provides code completions, chat assistance, and refactoring.',
    installed: true,
    tag: 'AI Partner'
  },
  {
    id: 'dracula-theme.theme-dracula',
    name: 'Dracula Official',
    publisher: 'Dracula Theme',
    icon: '🧛',
    downloads: '7.8M',
    rating: '4.9',
    description: 'A dark theme for 200+ apps, the iconic Dracula vampire theme for Visual Studio Code.',
    installed: false,
    themeId: 'dracula'
  },
  {
    id: 'zhuangtongfa.material-theme',
    name: 'One Dark Pro',
    publisher: 'binaryify',
    icon: '🎨',
    downloads: '9.2M',
    rating: '4.9',
    description: 'Atom’s iconic One Dark theme, and one of the most installed themes for VS Code.',
    installed: false,
    themeId: 'onedark'
  },
  {
    id: 'formulahendry.code-runner',
    name: 'Code Runner',
    publisher: 'Jun Han',
    icon: '🏃',
    downloads: '32.1M',
    rating: '4.6',
    description: 'Run code snippet or code file for C, C++, Java, JavaScript, Python, PHP, Ruby, Go, Rust, and more.',
    installed: true,
    tag: 'Runner'
  }
];

export function getFileIcon(filename = '') {
  const ext = filename.split('.').pop().toLowerCase();
  switch (ext) {
    case 'java': return '☕';
    case 'py': return '🐍';
    case 'cpp':
    case 'c':
    case 'h': return '⚡';
    case 'js':
    case 'mjs': return '🟨';
    case 'html': return '🌐';
    case 'css': return '🎨';
    case 'json': return '📋';
    case 'md': return '📝';
    default: return '📄';
  }
}

export function renderVSCodeStudioView(state = {}, options = {}) {
  const currentFile = options.currentFile || 'Welcome';
  const openTabs = options.openTabs || ['Welcome', 'java/Main.java', 'python/solution.py'];
  const activeSidebarTab = options.activeSidebarTab || 'explorer'; // 'explorer' | 'search' | 'git' | 'extensions' | 'settings'
  const isSidebarCollapsed = options.isSidebarCollapsed || false;
  const isTerminalCollapsed = options.isTerminalCollapsed || false;
  const terminalTab = options.terminalTab || 'bash'; // 'bash' | 'python' | 'java' | 'node' | 'cpp'
  const terminalLogs = options.terminalLogs || [
    { type: 'cmd', text: 'LearnPath AI Visual Studio Code Studio [Version 1.94.2]' },
    { type: 'info', text: 'All runtimes initialized: Java 17, Python 3.11, GCC 13, Node.js 20.' },
    { type: 'success', text: 'Type "python <file>", "java <file>", or "help" for command list.' }
  ];
  const activeTheme = options.activeTheme || 'dark-plus';
  const installedExtensions = options.installedExtensions || ['ms-python', 'vscjava.vscode-java-pack', 'ms-vscode.cpptools', 'esbenp.prettier-vscode', 'github.copilot', 'formulahendry.code-runner'];

  const allFiles = vfs.getAllFiles();
  const fileKeys = Object.keys(allFiles);
  const activeFileObj = currentFile !== 'Welcome' ? vfs.getFile(currentFile) : null;
  const fileContent = activeFileObj ? (activeFileObj.content || '') : '';
  const linesCount = (fileContent.split('\n').length) || 1;
  const lineNumbers = Array.from({ length: Math.max(16, linesCount) }, (_, i) => i + 1).join('\n');

  // Detect file language for status bar
  const fileExt = currentFile.split('.').pop().toLowerCase();
  const langName = fileExt === 'java' ? 'Java' : (fileExt === 'py' ? 'Python' : (fileExt === 'cpp' ? 'C++' : (fileExt === 'js' ? 'JavaScript' : (currentFile === 'Welcome' ? 'Markdown' : 'Plain Text'))));

  return `
    <div class="vscode-studio-container vscode-theme-${activeTheme}" id="vscode-studio-container">
      
      <!-- 1. VS Code Menu & Title Bar -->
      <div class="vscode-title-bar">
        <div class="vscode-menu-items">
          <div class="vscode-app-logo" title="Visual Studio Code">
            <span>💻</span>
          </div>
          <span class="vscode-menu-item" id="btn-menu-file">File</span>
          <span class="vscode-menu-item" id="btn-menu-edit">Edit</span>
          <span class="vscode-menu-item" id="btn-menu-selection">Selection</span>
          <span class="vscode-menu-item" id="btn-menu-view">View</span>
          <span class="vscode-menu-item" id="btn-menu-go">Go</span>
          <span class="vscode-menu-item" id="btn-menu-run">Run</span>
          <span class="vscode-menu-item" id="btn-menu-terminal">Terminal</span>
          <span class="vscode-menu-item" id="btn-menu-help">Help</span>
        </div>

        <!-- Center Search / Command Center -->
        <div class="vscode-command-center" id="vscode-command-center" title="Type a command or search files (Ctrl + P)">
          <span>🔍</span>
          <span>LearnPath AI Code Studio — Search files, commands (Ctrl + P)</span>
        </div>

        <!-- Right Action Items -->
        <div class="vscode-title-actions">
          <button class="btn-vscode-mode-switch" id="btn-switch-to-problem-mode" title="Switch back to LeetCode Split Problem View">
            <span>🎯</span> Switch to Problem Mode
          </button>
          <button class="btn-vscode-quick-run" id="btn-vscode-run-active" title="Run Active File in Terminal (F5)">
            <span>▶</span> Run Code
          </button>
          <button class="vscode-title-icon-btn" id="btn-toggle-terminal" title="Toggle Integrated Terminal (Ctrl + \`)">
            <span>🖥️</span>
          </button>
          <button class="vscode-title-icon-btn" id="btn-toggle-sidebar" title="Toggle Primary Side Bar (Ctrl + B)">
            <span>⊞</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Workspace Split (Activity Bar + Sidebar + Editor + Terminal) -->
      <div class="vscode-workspace-split">
        
        <!-- Left Activity Bar -->
        <div class="vscode-activity-bar">
          <div class="activity-icons-top">
            <button class="activity-btn ${activeSidebarTab === 'explorer' && !isSidebarCollapsed ? 'active' : ''}" data-tab="explorer" title="Explorer (Ctrl + Shift + E)">
              <span>📁</span>
            </button>
            <button class="activity-btn ${activeSidebarTab === 'search' && !isSidebarCollapsed ? 'active' : ''}" data-tab="search" title="Search (Ctrl + Shift + F)">
              <span>🔍</span>
            </button>
            <button class="activity-btn ${activeSidebarTab === 'git' && !isSidebarCollapsed ? 'active' : ''}" data-tab="git" title="Source Control (Ctrl + Shift + G)">
              <span>🌿</span>
              <span class="activity-badge">1</span>
            </button>
            <button class="activity-btn ${activeSidebarTab === 'run' && !isSidebarCollapsed ? 'active' : ''}" data-tab="run" title="Run and Debug (Ctrl + Shift + D)">
              <span>🐞</span>
            </button>
            <button class="activity-btn ${activeSidebarTab === 'extensions' && !isSidebarCollapsed ? 'active' : ''}" data-tab="extensions" title="Extensions Marketplace (Ctrl + Shift + X)">
              <span>🧩</span>
              <span class="activity-badge">${installedExtensions.length}</span>
            </button>
          </div>

          <div class="activity-icons-bottom">
            <button class="activity-btn" id="btn-vscode-accounts" title="Accounts">
              <span>👤</span>
            </button>
            <button class="activity-btn ${activeSidebarTab === 'settings' && !isSidebarCollapsed ? 'active' : ''}" data-tab="settings" title="Manage Settings">
              <span>⚙️</span>
            </button>
          </div>
        </div>

        <!-- Collapsible Primary Side Bar -->
        <div class="vscode-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}" id="vscode-sidebar">
          
          <!-- EXPLORER TAB -->
          ${activeSidebarTab === 'explorer' ? `
            <div class="sidebar-header">
              <span>Explorer: Workspace</span>
              <div class="sidebar-actions">
                <button class="sidebar-icon-btn" id="btn-vfs-new-file" title="New File">➕</button>
                <button class="sidebar-icon-btn" id="btn-vfs-new-folder" title="New Folder">📁</button>
                <button class="sidebar-icon-btn" id="btn-vfs-refresh" title="Refresh Explorer">🔄</button>
                <button class="sidebar-icon-btn" id="btn-vfs-collapse" title="Collapse Folders">▾</button>
              </div>
            </div>
            <div class="sidebar-content-scroll">
              <div class="explorer-folder-header" id="explorer-root-toggle">
                <span>📂 LEARNPATH_WORKSPACE</span>
                <span style="font-size: 0.7rem; color: #858585;">vfs</span>
              </div>
              <div class="explorer-files-list">
                ${fileKeys.map(fk => {
                  const isActive = currentFile === fk;
                  const icon = getFileIcon(fk);
                  return `
                    <div class="explorer-tree-item ${isActive ? 'active' : ''}" data-path="${fk}" title="${fk}">
                      <span class="file-icon">${icon}</span>
                      <span class="file-label">${fk.split('/').pop()}</span>
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Quick Local Folder Import -->
              <div style="padding: 18px 14px; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 14px;">
                <label for="vfs-folder-input" style="display: block; font-size: 0.75rem; color: #38bdf8; font-weight: 700; cursor: pointer; text-align: center; border: 1px dashed #38bdf8; border-radius: 6px; padding: 8px;">
                  📂 Open Local Folder...
                </label>
                <input type="file" id="vfs-folder-input" webkitdirectory directory multiple style="display: none;" />
              </div>
            </div>
          ` : ''}

          <!-- EXTENSIONS TAB -->
          ${activeSidebarTab === 'extensions' ? `
            <div class="sidebar-header">
              <span>Extensions: Marketplace</span>
              <span style="font-size: 0.7rem; color: #858585;">${installedExtensions.length} Installed</span>
            </div>
            <div class="extensions-panel">
              <div class="extensions-search-bar">
                <input type="text" class="extensions-search-input" id="ext-search-input" placeholder="Search Extensions in Marketplace..." />
              </div>
              <div class="sidebar-content-scroll">
                ${VSCODE_EXTENSIONS_CATALOG.map(ext => {
                  const isInst = installedExtensions.includes(ext.id);
                  return `
                    <div class="extension-card" data-ext-id="${ext.id}" data-theme-id="${ext.themeId || ''}">
                      <div class="extension-icon-box">${ext.icon}</div>
                      <div class="extension-meta">
                        <div class="extension-title-row">
                          <span class="extension-name">${ext.name}</span>
                          <button class="btn-install-extension ${isInst ? 'installed' : ''}" data-ext-id="${ext.id}">
                            ${isInst ? 'Installed ✓' : 'Install'}
                          </button>
                        </div>
                        <div class="extension-desc">${ext.description}</div>
                        <div class="extension-stats-row">
                          <span>${ext.publisher}</span>
                          <span>⬇ ${ext.downloads} • ⭐ ${ext.rating}</span>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- SEARCH TAB -->
          ${activeSidebarTab === 'search' ? `
            <div class="sidebar-header">
              <span>Search & Replace</span>
            </div>
            <div class="sidebar-content-scroll" style="padding: 12px;">
              <input type="text" class="extensions-search-input" id="vfs-search-query" placeholder="Search in files..." style="margin-bottom: 8px;" />
              <input type="text" class="extensions-search-input" id="vfs-replace-query" placeholder="Replace with..." />
              <div style="font-size: 0.78rem; color: #858585; margin-top: 14px; text-align: center;">
                Press Enter to search all ${fileKeys.length} files in workspace.
              </div>
            </div>
          ` : ''}

          <!-- GIT SOURCE CONTROL TAB -->
          ${activeSidebarTab === 'git' ? `
            <div class="sidebar-header">
              <span>Source Control: Git</span>
              <span style="font-size: 0.7rem; color: #38bdf8;">main</span>
            </div>
            <div class="sidebar-content-scroll" style="padding: 12px;">
              <textarea class="extensions-search-input" placeholder="Commit message (Enter to commit)" style="height: 60px; resize: none; margin-bottom: 10px;"></textarea>
              <button class="btn-vscode-quick-run" style="width: 100%; justify-content: center;" id="btn-git-commit">
                ✓ Commit & Stage (${fileKeys.length} files)
              </button>
              <div style="margin-top: 14px; font-size: 0.76rem; color: #858585;">
                Branch: <strong>main*</strong> (Clean tree)
              </div>
            </div>
          ` : ''}

          <!-- SETTINGS TAB -->
          ${activeSidebarTab === 'settings' ? `
            <div class="sidebar-header">
              <span>Settings: Visual Studio Code</span>
            </div>
            <div class="sidebar-content-scroll" style="padding: 14px; display: flex; flex-direction: column; gap: 14px;">
              <div class="setting-row">
                <span>Color Theme:</span>
                <select class="setting-select" id="vscode-theme-selector">
                  <option value="dark-plus" ${activeTheme === 'dark-plus' ? 'selected' : ''}>Dark+ (Default VS Code)</option>
                  <option value="dracula" ${activeTheme === 'dracula' ? 'selected' : ''}>Dracula Theme</option>
                  <option value="onedark" ${activeTheme === 'onedark' ? 'selected' : ''}>One Dark Pro</option>
                  <option value="monokai" ${activeTheme === 'monokai' ? 'selected' : ''}>Monokai</option>
                  <option value="light" ${activeTheme === 'light' ? 'selected' : ''}>Light+ (Default Light)</option>
                </select>
              </div>

              <div class="setting-row">
                <span>Font Size:</span>
                <select class="setting-select" id="vscode-fontsize-selector">
                  <option value="13">13px</option>
                  <option value="14" selected>14px (Default)</option>
                  <option value="16">16px</option>
                  <option value="18">18px</option>
                </select>
              </div>

              <div class="setting-row">
                <span>Tab Size:</span>
                <select class="setting-select" id="vscode-tabsize-selector">
                  <option value="2">2 Spaces</option>
                  <option value="4" selected>4 Spaces</option>
                </select>
              </div>

              <div class="setting-row">
                <span>Auto Save:</span>
                <select class="setting-select" id="vscode-autosave-selector">
                  <option value="afterDelay" selected>afterDelay (1000ms)</option>
                  <option value="onFocusChange">onFocusChange</option>
                  <option value="off">off</option>
                </select>
              </div>

              <div class="setting-row">
                <span>Word Wrap:</span>
                <select class="setting-select" id="vscode-wordwrap-selector">
                  <option value="on" selected>on</option>
                  <option value="off">off</option>
                </select>
              </div>
            </div>
          ` : ''}

        </div>

        <!-- Center Editor Pane -->
        <div class="vscode-editor-pane">
          
          <!-- Tab Bar -->
          <div class="vscode-tabs-bar" id="vscode-tabs-bar">
            ${openTabs.map(tab => {
              const isActive = tab === currentFile;
              const isWelcome = tab === 'Welcome';
              const icon = isWelcome ? '💻' : getFileIcon(tab);
              const label = isWelcome ? 'Welcome' : tab.split('/').pop();
              return `
                <div class="vscode-tab ${isActive ? 'active' : ''}" data-path="${tab}">
                  <span>${icon}</span>
                  <span>${label}</span>
                  <span class="tab-close-btn" data-close-path="${tab}" title="Close (Ctrl + W)">×</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Breadcrumbs Bar -->
          <div class="vscode-breadcrumbs-bar">
            <span>learnpath_workspace</span>
            <span>›</span>
            <span>${currentFile.replace('/', ' › ')}</span>
          </div>

          <!-- Active Editor Content -->
          ${currentFile === 'Welcome' ? `
            <!-- Pixel-Perfect VS Code Welcome Screen (Editing Evolved) -->
            <div class="vscode-welcome-screen">
              <div class="welcome-hero">
                <h1 class="welcome-title">Visual Studio Code</h1>
                <div class="welcome-subtitle">Editing evolved</div>
              </div>

              <div class="welcome-columns-grid">
                <!-- Left: Start & Recent -->
                <div class="welcome-col">
                  <div class="welcome-section-title">Start</div>
                  <div class="welcome-action-list">
                    <div class="welcome-action-item" id="welcome-action-new-file">
                      <span>📄</span> <span>New File...</span>
                    </div>
                    <div class="welcome-action-item" id="welcome-action-open-file">
                      <span>📂</span> <span>Open File...</span>
                    </div>
                    <div class="welcome-action-item" id="welcome-action-open-folder">
                      <span>📁</span> <span>Open Folder...</span>
                    </div>
                    <div class="welcome-action-item" id="welcome-action-clone-git">
                      <span>🌿</span> <span>Clone Git Repository...</span>
                    </div>
                    <div class="welcome-action-item" id="welcome-action-switch-problem">
                      <span>⚡</span> <span>Open Problem Solving Arena...</span>
                    </div>
                  </div>

                  <div class="welcome-section-title" style="margin-top: 24px;">Recent</div>
                  <div class="welcome-recent-list">
                    ${fileKeys.slice(0, 5).map(fk => `
                      <div class="welcome-recent-item" data-path="${fk}">
                        <span class="recent-name">${fk.split('/').pop()}</span>
                        <span class="recent-path">C:\\learnpath\\workspace\\${fk}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Right: Walkthroughs -->
                <div class="welcome-col">
                  <div class="welcome-section-title">Walkthroughs</div>
                  <div class="walkthrough-cards-list">
                    
                    <div class="walkthrough-card" data-walkthrough="get-started">
                      <div class="walkthrough-card-icon">⭐</div>
                      <div>
                        <div class="walkthrough-card-title">Get started with VS Code</div>
                        <div class="walkthrough-card-desc">Customize your editor, learn the basics, and start coding.</div>
                      </div>
                    </div>

                    <div class="walkthrough-card" data-walkthrough="fundamentals">
                      <div class="walkthrough-card-icon">💡</div>
                      <div>
                        <div class="walkthrough-card-title">Learn the Fundamentals</div>
                        <div class="walkthrough-card-desc">Jump into core editing tricks, multi-cursor, and command palette.</div>
                      </div>
                    </div>

                    <div class="walkthrough-card" data-walkthrough="copilot">
                      <div class="walkthrough-card-icon">🤖</div>
                      <div>
                        <div class="walkthrough-card-title">
                          <span>GitHub Copilot</span>
                          <span class="walkthrough-tag-updated">Updated</span>
                        </div>
                        <div class="walkthrough-card-desc">Experience AI-assisted coding, auto-complete, and explanation directly in editor.</div>
                      </div>
                    </div>

                    <div class="walkthrough-card" data-walkthrough="python" data-path="python/solution.py">
                      <div class="walkthrough-card-icon">🐍</div>
                      <div>
                        <div class="walkthrough-card-title">
                          <span>Get Started with Python Development</span>
                          <span class="walkthrough-tag-updated">Updated</span>
                        </div>
                        <div class="walkthrough-card-desc">Write, run, and debug Python 3.11 scripts with interactive REPL terminal.</div>
                      </div>
                    </div>

                    <div class="walkthrough-card" data-walkthrough="java" data-path="java/Main.java">
                      <div class="walkthrough-card-icon">☕</div>
                      <div>
                        <div class="walkthrough-card-title">
                          <span>Get Started with Java Development</span>
                          <span class="walkthrough-tag-updated">Updated</span>
                        </div>
                        <div class="walkthrough-card-desc">Compile and run Java classes with full standard library & Scanner input support.</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              <!-- Welcome Bottom Banner -->
              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 18px; margin-top: 14px;">
                <label style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #858585; cursor: pointer;">
                  <input type="checkbox" checked /> Show welcome page on startup
                </label>
                <button class="btn-vscode-mode-switch" id="btn-welcome-practice-jump">
                  🚀 Launch Problem Solving Arena →
                </button>
              </div>
            </div>
          ` : `
            <!-- Active Code Editor Area -->
            <div class="vscode-editor-main">
              <div class="vscode-gutter" id="vscode-line-gutter">${lineNumbers}</div>
              <textarea
                class="vscode-code-input"
                id="vscode-code-editor"
                spellcheck="false"
                data-filepath="${currentFile}">${fileContent}</textarea>
            </div>
          `}

          <!-- Integrated Multi-Language Terminal (Bottom Panel) -->
          <div class="vscode-terminal-panel ${isTerminalCollapsed ? 'collapsed' : ''}" id="vscode-terminal-panel">
            <div class="terminal-header">
              <div class="terminal-tabs">
                <div class="terminal-tab ${terminalTab === 'bash' ? 'active' : ''}" data-term-tab="bash">
                  <span>🖥️</span> <span>bash</span>
                </div>
                <div class="terminal-tab ${terminalTab === 'python' ? 'active' : ''}" data-term-tab="python">
                  <span>🐍</span> <span>python (3.11)</span>
                </div>
                <div class="terminal-tab ${terminalTab === 'java' ? 'active' : ''}" data-term-tab="java">
                  <span>☕</span> <span>java (17)</span>
                </div>
                <div class="terminal-tab ${terminalTab === 'cpp' ? 'active' : ''}" data-term-tab="cpp">
                  <span>⚡</span> <span>cpp (g++)</span>
                </div>
                <div class="terminal-tab ${terminalTab === 'node' ? 'active' : ''}" data-term-tab="node">
                  <span>🟨</span> <span>node.js</span>
                </div>
              </div>

              <div class="terminal-actions">
                <button class="sidebar-icon-btn" id="btn-term-clear" title="Clear Terminal Output">🗑️</button>
                <button class="sidebar-icon-btn" id="btn-term-maximize" title="Maximize / Restore Terminal">^</button>
                <button class="sidebar-icon-btn" id="btn-term-close" title="Hide Terminal">×</button>
              </div>
            </div>

            <!-- Terminal Output & Prompt -->
            <div class="terminal-body" id="vscode-terminal-body">
              ${terminalLogs.map(l => `
                <div class="terminal-output-line ${l.type}">${l.text}</div>
              `).join('')}
              <div class="terminal-input-row">
                <span class="terminal-prompt">${terminalTab === 'python' ? '>>> ' : 'user@learnpath:~$ '}</span>
                <input type="text" class="terminal-input-cmd" id="terminal-cmd-input" placeholder="Type command here (e.g. 'python solution.py', 'java Main.java', 'ls', 'help')..." autocomplete="off" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- 3. VS Code Status Bar (Bottom 24px) -->
      <div class="vscode-status-bar">
        <div class="status-bar-left">
          <div class="status-item" title="Git Branch">
            <span>🌿</span> <span>main*</span>
          </div>
          <div class="status-item" title="No syntax errors">
            <span>⊗ 0</span> <span>⚠ 0</span>
          </div>
          <div class="status-item" id="status-terminal-indicator">
            <span>🖥️ Terminal: Ready</span>
          </div>
        </div>

        <div class="status-bar-right">
          <div class="status-item">
            <span>Ln 1, Col 1</span>
          </div>
          <div class="status-item">
            <span>Spaces: 4</span>
          </div>
          <div class="status-item">
            <span>UTF-8</span>
          </div>
          <div class="status-item">
            <span>LF</span>
          </div>
          <div class="status-item" id="status-lang-selector" style="font-weight: 700;">
            <span>${langName}</span>
          </div>
          <div class="status-item" title="Prettier Formatter Active">
            <span>💅 Prettier</span>
          </div>
          <div class="status-item" title="GitHub Copilot Online">
            <span>🤖</span>
          </div>
          <div class="status-item" title="Notifications">
            <span>🔔</span>
          </div>
        </div>
      </div>

    </div>
  `;
}
