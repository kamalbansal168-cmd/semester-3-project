/* ============================================================
   LEARNPATH AI — Full-Page Edge-to-Edge Coding Workspace
   VS Code Style Activity Bar, Explorer Sidebar, Real Folder Import,
   Monaco Editor, Multi-Tabs, and Interactive Stdin/Stdout
   ============================================================ */

import { store } from '../state.js';
import { vfs } from '../engine/virtualFileSystem.js';

export function renderPlaygroundView(currentFilePath = 'java/cooordinat.java', activeTab = 'terminal', openTabs = ['java/cooordinat.java'], stdinValue = null, executionResult = null) {
  const allFiles = vfs.getAllFiles();
  const firstPath = Object.keys(allFiles)[0] || 'java/Main.java';
  const activeFile = vfs.getFile(currentFilePath) || vfs.getFile(firstPath) || {
    name: 'cooordinat.java',
    path: 'java/cooordinat.java',
    content: 'public class cooordinat {\n    public static void main(String[] args) {\n        System.out.println("Hello from VS Code!");\n    }\n}',
    defaultStdin: ''
  };

  const stdinToDisplay = stdinValue !== null ? stdinValue : (activeFile.defaultStdin || '');
  const stdinTokens = stdinToDisplay.trim() ? stdinToDisplay.trim().split(/\s+/).length : 0;
  const stdinLines = stdinToDisplay ? stdinToDisplay.split('\n').length : 0;
  const user = store.getState().user || { points: 0, rank: 'Novice Developer' };

  // Generate recursive folder tree from VFS
  const treeRoot = vfs.getTree();
  const projectName = vfs.projectName || 'java';

  return `
    <div class="intellij-ide-container" data-filepath="${activeFile.path}">
      
      <!-- Hidden File Input for Folder Import (webkitdirectory) -->
      <input type="file" id="vfs-folder-input" webkitdirectory directory multiple style="display: none;" />

      <!-- 1. TOP MENU & ACTION TOOLBAR (VS Code / Dark Header) -->
      <div class="intellij-menu-bar">
        <div class="ide-menu-left">
          <div class="ide-project-brand">
            <span style="color: #007ACC; font-size: 1.1rem; font-weight: 800;">⚡</span>
            <span class="ide-project-title">${projectName}</span>
            <span class="ide-branch-tag">Java 17</span>
          </div>

          <!-- Active File Info -->
          <div class="ide-file-tab active" title="${activeFile.path}">
            <span class="vscode-java-icon">J</span>
            <span class="file-name">${activeFile.name}</span>
            <span class="file-status-dot" style="background: #34D399; width: 6px; height: 6px; border-radius: 50%;"></span>
          </div>
        </div>

        <div class="ide-menu-center">
          <div class="ide-run-config-pill" title="Run Configuration">
            <span class="run-config-icon" style="color: #34D399;">▶</span>
            <span class="run-config-name">${activeFile.name}</span>
          </div>

          <!-- Main RUN Code Button -->
          <button class="btn-ide-action btn-ide-run" id="btn-ide-run-code" title="Execute Code with Input (Shift + F10 or Ctrl + Enter)">
            <span style="font-size: 0.9rem;">▶</span> Run (${activeFile.name})
          </button>
        </div>

        <div class="ide-menu-right">
          <!-- Live Gamification Points Badge -->
          <div class="ide-points-pill" title="Earn +2 Points for every successful execution!">
            <span>⭐</span>
            <span style="font-weight: 800; color: #F59E0B;">+2 XP</span>
            <span style="color: #94A3B8; font-size: 0.75rem;">(${user.points || 0} pts)</span>
          </div>

          <!-- Open Folder Button in Header -->
          <button class="btn-ide-tool" id="btn-header-open-folder" title="Import a folder from your computer" style="background: #007ACC; color: white; border-color: #007ACC;">
            📥 Open Folder
          </button>

          <!-- Format Code Button -->
          <button class="btn-ide-tool" id="btn-format-code" title="Auto-Format & Indent Code">
            🧹 Format
          </button>

          <!-- Reset Code Button -->
          <button class="btn-ide-tool" id="btn-reset-code" title="Reset workspace">
            ↺ Reset
          </button>
        </div>
      </div>

      <!-- 2. MAIN WORKSPACE (Activity Bar + Explorer + Code Editor) -->
      <div class="vscode-ide-layout">
        
        <!-- A. FAR LEFT: VS CODE ACTIVITY BAR -->
        <div class="vscode-activity-bar">
          <div class="activity-bar-top">
            <!-- Explorer Icon (Active with badge) -->
            <div class="activity-item active" id="act-explorer" title="Explorer (Ctrl+Shift+E)">
              <span>📑</span>
              <span class="activity-badge">${Object.keys(allFiles).length}</span>
            </div>
            <!-- Search Icon -->
            <div class="activity-item" id="act-search" title="Search (Ctrl+Shift+F)">
              <span>🔍</span>
            </div>
            <!-- Source Control / Git Icon -->
            <div class="activity-item" id="act-git" title="Source Control (Ctrl+Shift+G)">
              <span>🌿</span>
            </div>
            <!-- Run & Debug Icon -->
            <div class="activity-item" id="act-debug" title="Run & Debug (Ctrl+Shift+D)">
              <span>▶️</span>
            </div>
            <!-- Extensions Icon -->
            <div class="activity-item" id="act-extensions" title="Extensions">
              <span>🧩</span>
            </div>
          </div>

          <div class="activity-bar-bottom">
            <div class="activity-item" id="act-settings" title="Settings / Reset">
              <span>⚙️</span>
            </div>
          </div>
        </div>

        <!-- B. EXPLORER SIDEBAR PANE -->
        <div class="vscode-explorer-sidebar" id="ide-sidebar-pane">
          
          <!-- Explorer Header (VS Code Style) -->
          <div class="vscode-explorer-header">
            <span>Explorer</span>
            <div class="vscode-header-actions">
              <button class="vscode-icon-btn" id="btn-vscode-open-folder" title="Open / Import Folder from PC">📥</button>
              <button class="vscode-icon-btn" id="btn-tree-new-file" title="New Java Class / File">📄+</button>
              <button class="vscode-icon-btn" id="btn-tree-new-folder" title="New Folder">📁+</button>
              <button class="vscode-icon-btn" id="btn-tree-collapse-all" title="Collapse Folders in Explorer">⇋</button>
              <button class="vscode-icon-btn" id="btn-tree-refresh" title="Refresh Explorer">↺</button>
            </div>
          </div>

          <!-- Project Root Collapsible Section (e.g. ∨ JAVA) -->
          <div class="vscode-root-section" id="btn-toggle-root-section">
            <div style="display: flex; align-items: center; gap: 4px;">
              <span class="vscode-chevron">∨</span>
              <span class="vscode-root-title">${projectName}</span>
            </div>
            <span style="font-size: 0.65rem; color: #858585; font-weight: normal;">${Object.keys(allFiles).length} files</span>
          </div>

          <!-- Project Tree Scroll View & Dropzone -->
          <div class="vscode-tree-scroll" id="ide-tree-scroll-container">
            <div class="vfs-tree-container">
              
              <!-- Recursive Tree Structure -->
              <div class="tree-children-container">
                ${Object.keys(treeRoot.children).length > 0 
                  ? Object.keys(treeRoot.children).sort().map(childKey => renderTreeNode(treeRoot.children[childKey], activeFile.path, 0)).join('')
                  : `
                    <!-- Open Folder Hero Banner if empty -->
                    <div class="vscode-open-folder-box" id="dropzone-open-folder">
                      <div style="font-size: 1.8rem;">📁</div>
                      <div style="font-size: 0.8rem; color: #CCCCCC; font-weight: 600;">No Folder Opened</div>
                      <div style="font-size: 0.72rem; color: #858585;">You have not yet opened a folder.</div>
                      <button class="btn-vscode-open" id="btn-open-folder-hero">
                        <span>📥</span> Open Folder
                      </button>
                      <div style="font-size: 0.68rem; color: #666; margin-top: 4px;">
                        or Drag & Drop folder here
                      </div>
                    </div>
                  `
                }
              </div>

              <!-- Quick Import Banner at bottom of tree -->
              <div style="padding: 10px; margin: 12px 8px; background: #1F1F1F; border: 1px solid #2B2B2B; border-radius: 4px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                  <span style="font-size: 0.72rem; font-weight: 700; color: #007ACC;">📥 Import Folder</span>
                  <span style="font-size: 0.65rem; color: #858585;">PC → Web</span>
                </div>
                <button class="btn-vscode-open" id="btn-quick-import-bottom" style="font-size: 0.74rem; padding: 4px 8px;">
                  Select Local Folder...
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- C. CENTER / RIGHT: Multi-Tab Bar, Monaco Code Editor & Bottom Run Tool Window -->
        <div class="intellij-editor-pane">
          
          <!-- MULTI-TAB BAR (VS Code Style) -->
          <div class="ide-editor-tabbar" id="ide-editor-tabbar">
            ${openTabs.map(tabPath => {
              const file = vfs.getFile(tabPath) || { name: tabPath.split('/').pop(), path: tabPath };
              const isActive = tabPath === activeFile.path;
              const isJava = file.name.endsWith('.java');
              return `
                <div class="ide-tab-item ${isActive ? 'active' : ''}" data-tabpath="${tabPath}" title="${tabPath}">
                  ${isJava ? `<span class="vscode-java-icon">J</span>` : `<span class="tab-icon">📄</span>`}
                  <span class="tab-title">${file.name}</span>
                  <span class="tab-close-btn" data-closepath="${tabPath}" title="Close Tab (Ctrl+W)">✕</span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- MONACO CODE EDITOR WRAPPER -->
          <div class="intellij-code-area" style="padding: 0; position: relative;">
            <div class="monaco-editor-wrapper">
              <div id="monaco-editor-container"></div>
              <!-- Fallback textarea for offline -->
              <textarea id="playground-code-input" class="monaco-fallback-textarea" style="display: none;" spellcheck="false">${escapeHtml(activeFile.content || '')}</textarea>
            </div>
          </div>

          <!-- BOTTOM TOOL WINDOW: Run Console & Standard Input (stdin) -->
          <div class="intellij-tool-window">
            
            <!-- Tool Window Header -->
            <div class="tool-window-header">
              <div class="tool-window-tabs">
                <button class="tool-tab-btn ${activeTab === 'terminal' ? 'active' : ''}" id="tool-tab-terminal">
                  💻 Run (${activeFile.name}) ${executionResult ? (executionResult.success ? '✓' : '✕') : ''}
                </button>
                <button class="tool-tab-btn ${activeTab === 'stdin' ? 'active' : ''}" id="tool-tab-stdin">
                  ⌨️ Standard Input (stdin) <span class="stdin-tab-badge">${stdinTokens}</span>
                </button>
                ${activeFile.isDSA && activeFile.question ? `
                  <button class="tool-tab-btn ${activeTab === 'dsa_test' ? 'active' : ''}" id="tool-tab-dsa">
                    🧪 DSA Testcases (${activeFile.question?.testCases?.length || 0})
                  </button>
                ` : ''}
              </div>

              <!-- Status Info & Actions -->
              <div class="tool-window-status">
                ${executionResult ? `
                  <span style="font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; color: ${executionResult.success ? '#34D399' : '#EF4444'};">
                    ${executionResult.success ? `✓ Process finished (exit 0) • ${executionResult.executionTimeMs}ms • ${executionResult.memoryMb} MB` : `✕ Execution Error (exit ${executionResult.exitCode || 1})`}
                  </span>
                ` : `
                  <span style="font-size: 0.76rem; color: #64748B;">Shortcuts: Shift + F10 | Ctrl + Enter to Run</span>
                `}
                <button class="btn-clear-console" id="btn-clear-console" title="Clear Console Output">🗑</button>
              </div>
            </div>

            <!-- Tool Window Body Area -->
            <div class="tool-window-content" id="tool-window-body">
              
              <!-- 1. LIVE RUN TERMINAL / OUTPUT CONSOLE -->
              <div id="view-terminal-content" style="display: ${activeTab === 'terminal' ? 'flex' : 'none'}; flex-direction: column; height: 100%;">
                
                <!-- Quick Stdin Input Bar inside Terminal -->
                <div class="terminal-stdin-bar">
                  <div class="terminal-stdin-bar-left">
                    <span class="stdin-badge-label">⌨️ Stdin:</span>
                    <input type="text" id="quick-stdin-input" class="quick-stdin-input" placeholder="Type input (e.g. 5 12) or click 'Standard Input' tab..." value="${escapeHtml(stdinToDisplay)}">
                  </div>
                  <div class="terminal-stdin-bar-right">
                    <span class="stdin-meta-tag" id="quick-stdin-meta">${stdinTokens} tokens</span>
                    <button class="btn-ide-subaction" id="btn-quick-switch-stdin" title="Switch to full multiline Standard Input tab">✏️ Multiline Stdin Tab</button>
                    <button class="btn-ide-subaction btn-run-accent" id="btn-quick-run-stdin" title="Run with this input (Shift + F10)">▶ Run</button>
                  </div>
                </div>

                <div class="ide-terminal-console" id="ide-console-output">
                  <div class="terminal-line"><span style="color: #60A5FA;">/usr/lib/jvm/java-17-openjdk/bin/java</span> -cp target/classes ${activeFile.name.replace('.java', '')}</div>
                  <div class="terminal-divider">--------------------------------------------------------------------------------</div>
                  
                  ${executionResult ? (
                    executionResult.success ? `
                      <div class="terminal-stdout">${escapeHtml(executionResult.stdout || '(Program completed with no stdout output)')}</div>
                      <div class="terminal-divider">--------------------------------------------------------------------------------</div>
                      <div class="terminal-line" style="color: #34D399; font-weight: bold;">
                        Process finished with exit code 0 (Execution Time: ${executionResult.executionTimeMs} ms | Memory: ${executionResult.memoryMb} MB)
                      </div>
                      <div class="terminal-line" style="color: #F59E0B; font-weight: bold;">
                        ⭐ +2 XP Points Added to your profile!
                      </div>
                    ` : `
                      ${executionResult.stdout ? `<div class="terminal-stdout">${escapeHtml(executionResult.stdout)}</div>` : ''}
                      <div class="terminal-error">
                        Exception in thread "main" ${escapeHtml(executionResult.error)}
                            at ${activeFile.name.replace('.java', '')}.main(${activeFile.name}:1)
                      </div>
                      ${executionResult.error && executionResult.error.includes('NoSuchElementException') ? `
                        <div class="terminal-hint-box">
                          💡 <strong>How to fix:</strong> Your Java code uses <code>Scanner(System.in)</code> to read input, but standard input was exhausted. Type your input values in the box above or in the <strong>"⌨️ Standard Input"</strong> tab, then press <strong>▶ Run</strong>!
                        </div>
                      ` : ''}
                      <div class="terminal-divider">--------------------------------------------------------------------------------</div>
                      <div class="terminal-line" style="color: #EF4444; font-weight: bold;">
                        Process finished with exit code ${executionResult.exitCode || 1} (Execution Time: ${executionResult.executionTimeMs} ms)
                      </div>
                    `
                  ) : `
                    <div class="terminal-line" style="color: #64748B;">
                      Tip: Type any input in the <strong>"⌨️ Stdin"</strong> field above or the <strong>"Standard Input (stdin)"</strong> tab, then click <strong>"▶ Run"</strong> or press <strong>Shift + F10</strong>.
                    </div>
                  `}
                </div>
              </div>

              <!-- 2. INTERACTIVE STDIN INPUT TAB -->
              <div id="view-stdin-content" style="display: ${activeTab === 'stdin' ? 'block' : 'none'}; height: 100%;">
                <div class="stdin-container">
                  <div class="stdin-header">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="testcase-field-label">Standard Input Stream (stdin) — Read by <code>Scanner(System.in)</code>:</span>
                      <span class="stdin-meta-pill" id="stdin-meta-counter">${stdinTokens} tokens • ${stdinLines} lines • ${stdinToDisplay.length} chars</span>
                    </div>
                    <button class="btn btn-primary btn-sm" id="btn-run-with-stdin" style="padding: 4px 14px; font-size: 0.8rem; font-weight: 700;">
                      ▶ Run Code with this Input (Shift + F10)
                    </button>
                  </div>

                  <!-- Quick Presets -->
                  <div class="stdin-presets-bar">
                    <span style="font-size: 0.74rem; color: #8C9099; font-weight: 600;">Presets:</span>
                    <button class="btn-preset-pill" data-preset="5 12">🔢 Coordinates (5 12)</button>
                    <button class="btn-preset-pill" data-preset="10 20 30">🔢 Integers (10 20 30)</button>
                    <button class="btn-preset-pill" data-preset="Alex Mercer">🔤 String ("Alex Mercer")</button>
                    <button class="btn-preset-pill" data-preset="5\n10 20 30 40 50">📊 Array (5 items)</button>
                    <button class="btn-preset-pill" data-preset="clear" style="color: #F87171;">🧹 Clear</button>
                  </div>

                  <textarea class="stdin-textarea intellij-font" id="ide-stdin-input" placeholder="Type or paste standard input data here (e.g., numbers, words, lines)...">${escapeHtml(stdinToDisplay)}</textarea>

                  <div class="stdin-footer-guide">
                    <span>💡 <strong>Scanner Info:</strong> <code>sc.nextInt()</code> reads numbers, <code>sc.next()</code> reads tokens, <code>sc.nextLine()</code> reads whole lines. Line breaks and multi-value inputs are preserved.</span>
                  </div>
                </div>
              </div>

              <!-- 3. DSA TESTCASES (if active file is a DSA challenge) -->
              ${activeFile.isDSA && activeFile.question ? `
                <div id="view-dsa-content" style="display: ${activeTab === 'dsa_test' ? 'block' : 'none'}; height: 100%;">
                  <div style="padding: 10px 14px;">
                    <div style="font-size: 0.82rem; font-weight: 700; color: #DFE1E5; margin-bottom: 6px;">
                      Challenge: ${activeFile.question.title} (${activeFile.question.difficulty})
                    </div>
                    <p style="font-size: 0.78rem; color: #9DA0A8; margin-bottom: 10px;">
                      ${activeFile.question.question}
                    </p>
                    <div class="testcase-box" style="margin-bottom: 8px;">
                      <strong>Expected Input:</strong> ${activeFile.question.exampleInput || 'N/A'}<br>
                      <strong>Expected Output:</strong> ${activeFile.question.exampleOutput || 'N/A'}
                    </div>
                  </div>
                </div>
              ` : ''}

            </div>

          </div>

        </div>

      </div>

      <!-- 3. FLOATING VS CODE CONTEXT MENU (Hidden by default) -->
      <div id="ide-context-menu" class="ide-context-menu" style="display: none;">
        <div class="context-menu-item" id="ctx-new-class">
          <div class="context-item-left">
            <span class="vscode-java-icon">J</span>
            <span>New Java Class</span>
          </div>
          <span class="context-item-shortcut">Alt+Insert</span>
        </div>
        <div class="context-menu-item" id="ctx-new-file">
          <div class="context-item-left">
            <span class="context-item-icon">📄</span>
            <span>New File</span>
          </div>
        </div>
        <div class="context-menu-item" id="ctx-new-folder">
          <div class="context-item-left">
            <span class="context-item-icon">📁</span>
            <span>New Folder</span>
          </div>
        </div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" id="ctx-open-folder">
          <div class="context-item-left">
            <span class="context-item-icon">📥</span>
            <span>Open Folder...</span>
          </div>
        </div>
        <div class="context-menu-separator"></div>
        <div class="context-menu-item" id="ctx-rename">
          <div class="context-item-left">
            <span class="context-item-icon">✏️</span>
            <span>Rename...</span>
          </div>
          <span class="context-item-shortcut">F2</span>
        </div>
        <div class="context-menu-item danger" id="ctx-delete">
          <div class="context-item-left">
            <span class="context-item-icon">🗑️</span>
            <span>Delete</span>
          </div>
          <span class="context-item-shortcut">Del</span>
        </div>
      </div>

    </div>
  `;
}

// Recursive Tree Node Renderer matching VS Code layout
function renderTreeNode(node, activeFilePath, depth = 0) {
  if (node.type === 'folder') {
    const isExpanded = node.isExpanded;
    const paddingLeft = depth * 14 + 8;
    const sortedKeys = Object.keys(node.children).sort((a, b) => {
      const childA = node.children[a];
      const childB = node.children[b];
      if (childA.type === childB.type) return a.localeCompare(b);
      return childA.type === 'folder' ? -1 : 1;
    });

    return `
      <div class="tree-folder-group" data-folderpath="${node.path}">
        <div class="tree-node-row tree-folder-row" data-folderpath="${node.path}" style="padding-left: ${paddingLeft}px;" title="${node.path}">
          <div class="tree-node-left">
            <span class="folder-arrow ${isExpanded ? 'expanded' : ''}">▶</span>
            <span class="tree-node-icon" style="font-size: 0.8rem;">📁</span>
            <span class="tree-node-name" style="font-size: 0.8rem;">${node.name}</span>
          </div>
          <span class="tree-node-badge">${Object.keys(node.children).length}</span>
        </div>
        ${isExpanded ? `
          <div class="tree-children-container">
            ${sortedKeys.map(k => renderTreeNode(node.children[k], activeFilePath, depth + 1)).join('')}
          </div>
        ` : ''}
      </div>
    `;
  } else {
    // File node (e.g. J cooordinat.java)
    const isJava = node.name.endsWith('.java');
    const isActive = node.path === activeFilePath;
    const paddingLeft = depth * 14 + 20;
    return `
      <div class="tree-node-row tree-file-row vscode-file-row ${isActive ? 'active' : ''}" data-filepath="${node.path}" style="padding-left: ${paddingLeft}px;" title="${node.path}">
        <div class="tree-node-left" style="gap: 6px;">
          ${isJava ? `<span class="vscode-java-icon">J</span>` : `<span style="font-size: 0.8rem;">📄</span>`}
          <span class="tree-node-name">${node.name}</span>
        </div>
        ${node.isDSA ? `<span class="badge badge-neutral" style="font-size: 0.62rem; padding: 1px 4px;">DSA</span>` : ''}
      </div>
    `;
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
