const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add 'vscode-studio' to protectedRoutes
const protectedMarker = "const protectedRoutes = ['dashboard', 'battle', 'topics', 'practice', 'playground', 'question',";
if (content.includes(protectedMarker) && !content.includes("'vscode-studio'")) {
  content = content.replace(
    protectedMarker,
    "const protectedRoutes = ['dashboard', 'battle', 'topics', 'practice', 'playground', 'question', 'vscode-studio',"
  );
  console.log('Added vscode-studio to protectedRoutes.');
} else {
  console.log('protectedRoutes already has vscode-studio or marker not found.');
}

// 2. Add handleStudioTerminalCommand before attachEventListeners()
const attachMarker = "  attachEventListeners() {";
if (content.includes(attachMarker) && !content.includes('handleStudioTerminalCommand(')) {
  const methodsCode = `  /**
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

  const isCRLF = content.includes('\r\n');
  const codeToInsert = isCRLF ? methodsCode.replace(/\n/g, '\r\n') : methodsCode;
  content = content.replace(attachMarker, codeToInsert + attachMarker);
  console.log('Added handleStudioTerminalCommand and finishTerminalCommand methods.');
} else {
  console.log('handleStudioTerminalCommand already exists or attachMarker not found.');
}

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.js final updates complete!');
