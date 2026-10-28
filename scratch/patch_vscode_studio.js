const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

console.log('Original content length:', content.length);

// 1. Add MultiLanguageRunner import if not present
if (!content.includes('MultiLanguageRunner')) {
  const importTarget = "import { vfs } from './engine/virtualFileSystem.js';";
  if (content.includes(importTarget)) {
    content = content.replace(importTarget, `${importTarget}\r\nimport { MultiLanguageRunner } from './engine/multiLanguageRunner.js';`);
    console.log('Added MultiLanguageRunner import.');
  } else {
    console.warn('Could not find virtualFileSystem import marker.');
  }
}

// 2. Add 'vscode-studio' to protectedRoutes
if (!content.includes("'vscode-studio', 'recovery'") && !content.includes("'vscode-studio'")) {
  const protectedTarget = "const protectedRoutes = ['dashboard', 'battle', 'topics', 'practice', 'playground', 'question',";
  const protectedReplace = "const protectedRoutes = ['dashboard', 'battle', 'topics', 'practice', 'playground', 'question', 'vscode-studio',";
  if (content.includes(protectedTarget)) {
    content = content.replace(protectedTarget, protectedReplace);
    console.log('Added vscode-studio to protectedRoutes.');
  } else {
    console.warn('Could not find protectedRoutes marker.');
  }
}

// 3. Update playground-mode / vscode-mode class in render()
const modeTarget = "    if (this.currentRoute === 'playground') {\r\n      mainEl.classList.add('app-playground-mode');\r\n    } else {\r\n      mainEl.classList.remove('app-playground-mode');\r\n    }";
const modeTargetLF = "    if (this.currentRoute === 'playground') {\n      mainEl.classList.add('app-playground-mode');\n    } else {\n      mainEl.classList.remove('app-playground-mode');\n    }";

const modeReplace = `    if (this.currentRoute === 'playground' || this.currentRoute === 'vscode-studio') {
      mainEl.classList.add(this.currentRoute === 'vscode-studio' ? 'app-vscode-mode' : 'app-playground-mode');
    } else {
      mainEl.classList.remove('app-playground-mode', 'app-vscode-mode');
    }`;

if (content.includes(modeTarget)) {
  content = content.replace(modeTarget, modeReplace.replace(/\n/g, '\r\n'));
  console.log('Updated app-vscode-mode in render() (CRLF).');
} else if (content.includes(modeTargetLF)) {
  content = content.replace(modeTargetLF, modeReplace);
  console.log('Updated app-vscode-mode in render() (LF).');
} else {
  console.warn('Could not find app-playground-mode toggle block.');
}

// 4. Update input event listener to handle #vscode-code-editor
const inputTarget = "      if (e.target.id === 'playground-code-input') {";
if (content.includes(inputTarget)) {
  const inputAddition = `      if (e.target.id === 'vscode-code-editor' && this.currentRoute === 'vscode-studio') {
        const val = e.target.value;
        if (this.studioCurrentFile && this.studioCurrentFile !== 'Welcome') {
          vfs.writeFile(this.studioCurrentFile, val);
        }
        const linesCount = val.split('\\n').length;
        const gutter = document.getElementById('vscode-line-gutter');
        if (gutter) {
          gutter.textContent = Array.from({ length: Math.max(16, linesCount) }, (_, i) => i + 1).join('\\n');
        }
      }

      if (e.target.id === 'playground-code-input') {`;
  content = content.replace(inputTarget, inputAddition);
  console.log('Added input listener for #vscode-code-editor.');
}

// 5. Update keydown event listener to handle #terminal-cmd-input and #vscode-code-editor
const keydownTarget = "    document.addEventListener('keydown', (e) => {\r\n      const textarea = e.target;\r\n      if (textarea.id !== 'playground-code-input') return;";
const keydownTargetLF = "    document.addEventListener('keydown', (e) => {\n      const textarea = e.target;\n      if (textarea.id !== 'playground-code-input') return;";

const keydownReplacement = `    document.addEventListener('keydown', (e) => {
      // VS Code Studio Terminal command input handler
      if (e.key === 'Enter' && e.target && e.target.id === 'terminal-cmd-input' && this.currentRoute === 'vscode-studio') {
        e.preventDefault();
        const cmd = e.target.value.trim();
        e.target.value = '';
        if (cmd) {
          this.handleStudioTerminalCommand(cmd);
        }
        return;
      }

      // VS Code Editor Tab & Indentation support
      if (e.target && e.target.id === 'vscode-code-editor' && this.currentRoute === 'vscode-studio') {
        const editor = e.target;
        if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey)) || e.key === 'F5') {
          e.preventDefault();
          const runBtn = document.getElementById('btn-vscode-run-active');
          if (runBtn) runBtn.click();
          return;
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = editor.selectionStart;
          const end = editor.selectionEnd;
          const val = editor.value;
          if (e.shiftKey) {
            const lineStart = val.lastIndexOf('\\n', start - 1) + 1;
            if (val.substring(lineStart, lineStart + 2) === '  ') {
              editor.value = val.substring(0, lineStart) + val.substring(lineStart + 2);
              editor.selectionStart = editor.selectionEnd = Math.max(lineStart, start - 2);
            }
          } else {
            editor.value = val.substring(0, start) + '  ' + val.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 2;
          }
          if (this.studioCurrentFile && this.studioCurrentFile !== 'Welcome') {
            vfs.writeFile(this.studioCurrentFile, editor.value);
          }
          return;
        }
      }

      const textarea = e.target;
      if (textarea.id !== 'playground-code-input') return;`;

if (content.includes(keydownTarget)) {
  content = content.replace(keydownTarget, keydownReplacement.replace(/\n/g, '\r\n'));
  console.log('Updated keydown listener with terminal & VS Code editor support (CRLF).');
} else if (content.includes(keydownTargetLF)) {
  content = content.replace(keydownTargetLF, keydownReplacement);
  console.log('Updated keydown listener with terminal & VS Code editor support (LF).');
} else {
  console.warn('Could not find keydown target block.');
}

// 6. Update #btn-vscode-run-active to use MultiLanguageRunner
const runActiveTarget = `        if (ext === 'java') {
          result = CodeExecutionEngine.executeFreeformJava(code, '');
        } else if (ext === 'py') {
          result = CodeExecutionEngine.executePython ? CodeExecutionEngine.executePython(code, '') : { success: true, output: '# Python output simulated', executionTimeMs: 42 };
        } else {
          result = { success: true, output: \`// \${lang} execution simulated. Output: Hello World!\`, executionTimeMs: 38 };
        }`;

const runActiveReplace = `        result = await MultiLanguageRunner.runFile(this.studioCurrentFile, '');
        if (result.stdout && !result.output) result.output = result.stdout;`;

if (content.includes(runActiveTarget.replace(/\n/g, '\r\n'))) {
  content = content.replace(runActiveTarget.replace(/\n/g, '\r\n'), runActiveReplace.replace(/\n/g, '\r\n'));
  console.log('Updated #btn-vscode-run-active to use MultiLanguageRunner (CRLF).');
} else if (content.includes(runActiveTarget)) {
  content = content.replace(runActiveTarget, runActiveReplace);
  console.log('Updated #btn-vscode-run-active to use MultiLanguageRunner (LF).');
} else {
  console.warn('Could not find runActiveTarget block.');
}

// 7. Add handleStudioTerminalCommand method to LearnPathApp class
const methodTarget = "  // ============================================================\r\n  // INITIALIZATION & EVENT LISTENERS";
const methodTargetLF = "  // ============================================================\n  // INITIALIZATION & EVENT LISTENERS";

const methodCode = `  /**
   * Visual Studio Code Interactive Terminal Command Execution
   */
  async handleStudioTerminalCommand(cmd) {
    cmd = (cmd || '').trim();
    if (!cmd) return;

    const currentTermTab = this.studioTerminalTab || 'bash';
    const prompt = currentTermTab === 'python' ? '>>> ' : 'user@learnpath:~$ ';
    this.studioTerminalLogs = [
      ...this.studioTerminalLogs,
      { type: 'cmd', text: \`\${prompt}\${cmd}\` }
    ];

    const parts = cmd.split(/\\s+/);
    const baseCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (baseCmd === 'clear' || baseCmd === 'cls') {
      this.studioTerminalLogs = [];
      this.render();
      setTimeout(() => {
        const inp = document.getElementById('terminal-cmd-input');
        if (inp) inp.focus();
      }, 50);
      return;
    }

    if (baseCmd === 'help') {
      this.studioTerminalLogs.push(
        { type: 'info', text: 'VS Code Terminal — Available Commands:' },
        { type: 'output', text: '  ls, dir           — List workspace files' },
        { type: 'output', text: '  run [file]        — Run active or named file' },
        { type: 'output', text: '  python <file.py>  — Execute Python script' },
        { type: 'output', text: '  java <file.java>  — Compile and run Java class' },
        { type: 'output', text: '  node <file.js>    — Run JavaScript/Node script' },
        { type: 'output', text: '  cat <file>        — View file contents' },
        { type: 'output', text: '  pwd, whoami, date — System utilities' },
        { type: 'output', text: '  theme <name>      — Change theme (dark-plus, dracula, onedark, monokai, light)' },
        { type: 'output', text: '  clear             — Clear terminal screen' }
      );
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'ls' || baseCmd === 'dir') {
      const files = vfs.getAllFiles();
      const list = Object.entries(files).map(([path, file]) => {
        const size = (file.content || '').length;
        return \`  \${path.padEnd(25)} (\${size} B)\`;
      });
      this.studioTerminalLogs.push(
        { type: 'info', text: \`Directory: /workspace (\${list.length} files)\` },
        { type: 'output', text: list.join('\\n') }
      );
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'pwd') {
      this.studioTerminalLogs.push({ type: 'output', text: '/workspace/learnpath-project' });
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'whoami') {
      const user = store.getState().user;
      this.studioTerminalLogs.push({ type: 'output', text: \`\${user.name || 'developer'} (Full-Stack Engineer)\` });
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'date') {
      this.studioTerminalLogs.push({ type: 'output', text: new Date().toString() });
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'theme') {
      const themeName = args[0] ? args[0].toLowerCase() : '';
      const validThemes = ['dark-plus', 'dracula', 'onedark', 'monokai', 'light'];
      if (validThemes.includes(themeName)) {
        this.studioTheme = themeName;
        this.studioTerminalLogs.push({ type: 'success', text: \`Theme switched to '\${themeName}'\` });
      } else {
        this.studioTerminalLogs.push({ type: 'error', text: \`Unknown theme. Choose one of: \${validThemes.join(', ')}\` });
      }
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'cat') {
      const target = args[0] || (this.studioCurrentFile !== 'Welcome' ? this.studioCurrentFile : 'java/Main.java');
      const file = vfs.getFile(target);
      if (file) {
        this.studioTerminalLogs.push({ type: 'output', text: file.content || '(empty file)' });
      } else {
        this.studioTerminalLogs.push({ type: 'error', text: \`cat: \${target}: No such file or directory\` });
      }
      this.finishTerminalCommand();
      return;
    }

    if (baseCmd === 'run' || baseCmd === 'python' || baseCmd === 'python3' || baseCmd === 'java' || baseCmd === 'node') {
      let target = args[0];
      if (!target) {
        if (this.studioCurrentFile && this.studioCurrentFile !== 'Welcome') {
          target = this.studioCurrentFile;
        } else {
          target = (baseCmd === 'python' || baseCmd === 'python3') ? 'python/solution.py' :
                   baseCmd === 'java' ? 'java/Main.java' :
                   baseCmd === 'node' ? 'javascript/app.js' : 'java/Main.java';
        }
      }

      const file = vfs.getFile(target);
      if (!file) {
        this.studioTerminalLogs.push({ type: 'error', text: \`\${baseCmd}: Cannot open '\${target}': No such file in workspace\` });
        this.finishTerminalCommand();
        return;
      }

      this.studioTerminalLogs.push({ type: 'info', text: \`[\${baseCmd}] Executing \${target}...\` });
      const result = await MultiLanguageRunner.runFile(target, '');
      if (result.success) {
        this.studioTerminalLogs.push({ type: 'success', text: result.stdout || '(no output)' });
        if (result.executionTimeMs) {
          this.studioTerminalLogs.push({ type: 'info', text: \`Process completed in \${result.executionTimeMs}ms (exit code 0)\` });
        }
        store.awardPoints(1);
      } else {
        this.studioTerminalLogs.push({ type: 'error', text: result.error || 'Execution failed' });
      }
      this.finishTerminalCommand();
      return;
    }

    if (currentTermTab === 'python') {
      const res = MultiLanguageRunner.runPython(cmd, '');
      if (res.success) {
        if (res.stdout) this.studioTerminalLogs.push({ type: 'success', text: res.stdout });
      } else {
        this.studioTerminalLogs.push({ type: 'error', text: res.error || 'SyntaxError' });
      }
      this.finishTerminalCommand();
      return;
    }

    this.studioTerminalLogs.push({
      type: 'error',
      text: \`bash: \${baseCmd}: command not found. Type 'help' to see available commands.\`
    });
    this.finishTerminalCommand();
  }

  finishTerminalCommand() {
    this.studioTerminalCollapsed = false;
    this.render();
    setTimeout(() => {
      const body = document.getElementById('vscode-terminal-body');
      if (body) body.scrollTop = body.scrollHeight;
      const inp = document.getElementById('terminal-cmd-input');
      if (inp) inp.focus();
    }, 50);
  }

`;

if (content.includes(methodTarget)) {
  content = content.replace(methodTarget, methodCode.replace(/\n/g, '\r\n') + methodTarget);
  console.log('Added handleStudioTerminalCommand method (CRLF).');
} else if (content.includes(methodTargetLF)) {
  content = content.replace(methodTargetLF, methodCode + methodTargetLF);
  console.log('Added handleStudioTerminalCommand method (LF).');
} else {
  console.warn('Could not find methodTarget marker.');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('All patches applied successfully!');
