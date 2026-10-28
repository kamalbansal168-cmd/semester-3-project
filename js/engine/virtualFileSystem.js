/* ============================================================
   LEARNPATH AI — Virtual File System (VFS)
   Hierarchical Folder & File Management with LocalStorage Persistence
   and Real Local Folder Import (VS Code Style)
   ============================================================ */

import { QUESTIONS_DB } from '../data/questions.js';

const STORAGE_KEY = 'learnpath_ide_vfs_v3';

// Default starter files and directories
const DEFAULT_FILES = {
  'java/cooordinat.java': {
    path: 'java/cooordinat.java',
    name: 'cooordinat.java',
    type: 'file',
    isJava: true,
    content: `import java.util.Scanner;

public class cooordinat {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("=== Coordinate Point Processor ===");
        System.out.print("Enter X and Y coordinates (e.g. 5 12): ");
        
        if (sc.hasNextInt()) {
            int x = sc.nextInt();
            int y = sc.nextInt();
            double distance = Math.sqrt(x * x + y * y);
            System.out.printf("Point (%d, %d) distance from origin (0, 0): %.2f\\n", x, y, distance);
            
            String quadrant;
            if (x > 0 && y > 0) quadrant = "Quadrant I";
            else if (x < 0 && y > 0) quadrant = "Quadrant II";
            else if (x < 0 && y < 0) quadrant = "Quadrant III";
            else if (x > 0 && y < 0) quadrant = "Quadrant IV";
            else quadrant = "On Axis / Origin";
            
            System.out.println("Location: " + quadrant);
        } else {
            System.out.println("Please provide X and Y integers in Stdin!");
        }
    }
}`,
    defaultStdin: '5 12'
  },
  'java/Main.java': {
    path: 'java/Main.java',
    name: 'Main.java',
    type: 'file',
    isJava: true,
    content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Welcome to VS Code Java Playground ===");
        System.out.println("Write your code, provide input, and click Run (Shift+F10)!");
        
        System.out.print("Enter your username: ");
        if (scanner.hasNext()) {
            String name = scanner.nextLine();
            System.out.println("Hello, " + name + "! Happy Coding.");
        }
    }
}`,
    defaultStdin: 'Alex'
  },
  'java/Calculator.java': {
    path: 'java/Calculator.java',
    name: 'Calculator.java',
    type: 'file',
    isJava: true,
    content: `import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("--- Math Engine ---");
        
        if (sc.hasNextInt()) {
            int a = sc.nextInt();
            int b = sc.nextInt();
            System.out.println("Sum: " + (a + b));
            System.out.println("Product: " + (a * b));
            System.out.println("Max: " + Math.max(a, b));
        } else {
            System.out.println("Enter two numbers in Stdin!");
        }
    }
}`,
    defaultStdin: '15 25'
  },
  'python/solution.py': {
    path: 'python/solution.py',
    name: 'solution.py',
    type: 'file',
    isPython: true,
    content: `# Python 3.11 Interactive Workspace
def greet(name):
    return f"Hello, {name}! Welcome to VS Code Open World."

if __name__ == "__main__":
    username = input("Enter your name: ") or "Developer"
    print(greet(username))
    
    # Quick demo: Fibonacci numbers
    fib = [0, 1]
    for i in range(2, 10):
        fib.append(fib[-1] + fib[-2])
    print("Fibonacci sequence:", fib)
`,
    defaultStdin: 'Aryan'
  },
  'cpp/main.cpp': {
    path: 'cpp/main.cpp',
    name: 'main.cpp',
    type: 'file',
    isCpp: true,
    content: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    cout << "=== VS Code C++ Workspace ===" << endl;
    string name;
    cout << "Enter your name: ";
    if (cin >> name) {
        cout << "Hello, " << name << "! Happy Competitive Programming." << endl;
    }
    return 0;
}
`,
    defaultStdin: 'Coder'
  },
  'javascript/index.js': {
    path: 'javascript/index.js',
    name: 'index.js',
    type: 'file',
    isJs: true,
    content: `// Node.js & JavaScript Open World Workspace
console.log("=== VS Code JavaScript Sandbox ===");

function calculateStats(numbers) {
    const sum = numbers.reduce((a, b) => a + b, 0);
    const avg = sum / numbers.length;
    return { sum, avg, count: numbers.length };
}

const sample = [12, 45, 68, 23, 91, 54];
console.log("Sample Data:", sample);
console.log("Stats:", calculateStats(sample));
`,
    defaultStdin: ''
  }
};

export class VirtualFileSystem {
  constructor() {
    this.projectName = 'java';
    this.isImported = false; // true when user has imported a real local folder
    this.files = {};
    this.folders = new Set(['java']);
    this.expandedFolders = new Set(['java']);
    this.loadFromStorage();
    // Only sync DSA challenges when using the default built-in Java workspace
    if (!this.isImported) {
      this.syncDSAChallenges();
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.projectName = parsed.projectName || 'java';
        this.isImported = parsed.isImported || false;
        this.files = parsed.files || {};
        this.folders = new Set(parsed.folders || [this.projectName]);
        this.expandedFolders = new Set(parsed.expandedFolders || [this.projectName]);
      } else {
        this.projectName = 'java';
        this.isImported = false;
        this.files = JSON.parse(JSON.stringify(DEFAULT_FILES));
        this.folders = new Set(['java']);
        this.expandedFolders = new Set(['java']);
      }
    } catch (e) {
      console.warn('VFS: Failed to load from localStorage, resetting to defaults', e);
      this.projectName = 'java';
      this.isImported = false;
      this.files = JSON.parse(JSON.stringify(DEFAULT_FILES));
    }

    // Ensure all file parent folders exist in folders Set
    Object.keys(this.files).forEach(path => {
      this.ensureParentFolders(path);
    });
  }

  saveToStorage() {
    try {
      const data = {
        projectName: this.projectName,
        isImported: this.isImported,
        files: this.files,
        folders: Array.from(this.folders),
        expandedFolders: Array.from(this.expandedFolders)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('VFS: Failed to save to localStorage', e);
    }
  }

  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.projectName = 'java';
    this.isImported = false;
    this.files = JSON.parse(JSON.stringify(DEFAULT_FILES));
    this.folders = new Set(['java']);
    this.expandedFolders = new Set(['java']);
    this.syncDSAChallenges();
    this.saveToStorage();
  }

  syncDSAChallenges() {
    const dsaQuestions = QUESTIONS_DB.filter(q => q.type === 'CODING');
    dsaQuestions.forEach(q => {
      const p = q.fileName ? `${this.projectName}/dsa/${q.fileName}` : `${this.projectName}/dsa/${q.title.replace(/\s+/g, '')}.java`;
      if (!this.files[p]) {
        this.files[p] = {
          path: p,
          name: p.split('/').pop(),
          type: 'file',
          isJava: true,
          isDSA: true,
          questionId: q.id,
          question: q,
          content: q.starterCode || '',
          defaultStdin: q.exampleInput || ''
        };
      }
      this.ensureParentFolders(p);
    });
  }

  ensureParentFolders(filePath) {
    const parts = filePath.split('/');
    let cur = '';
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur ? `${cur}/${parts[i]}` : parts[i];
      this.folders.add(cur);
    }
  }

  // Check if a path exists
  exists(path) {
    return !!this.files[path] || this.folders.has(path);
  }

  // Get file
  getFile(path) {
    return this.files[path] || null;
  }

  // Get all files
  getAllFiles() {
    return this.files;
  }

  // Create or update file
  writeFile(path, content, defaultStdin = '') {
    const normalized = path.replace(/\\/g, '/').replace(/^\/+/, '');
    const name = normalized.split('/').pop();
    this.ensureParentFolders(normalized);

    const existing = this.files[normalized] || {};
    this.files[normalized] = {
      ...existing,
      path: normalized,
      name,
      type: 'file',
      isJava: name.endsWith('.java'),
      content,
      defaultStdin: defaultStdin !== undefined ? defaultStdin : (existing.defaultStdin || '')
    };

    this.saveToStorage();
    return this.files[normalized];
  }

  // Create a new folder
  createFolder(folderPath) {
    const normalized = folderPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    if (!normalized) return false;
    
    this.ensureParentFolders(normalized + '/dummy');
    this.folders.add(normalized);
    this.expandedFolders.add(normalized);
    this.saveToStorage();
    return true;
  }

  // Rename a file or folder
  rename(oldPath, newPath) {
    const oldNorm = oldPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    const newNorm = newPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

    if (oldNorm === newNorm) return true;
    if (this.exists(newNorm)) return false;

    // Check if it's a file
    if (this.files[oldNorm]) {
      const file = this.files[oldNorm];
      delete this.files[oldNorm];
      file.path = newNorm;
      file.name = newNorm.split('/').pop();
      file.isJava = file.name.endsWith('.java');
      this.files[newNorm] = file;
      this.ensureParentFolders(newNorm);
      this.saveToStorage();
      return true;
    }

    // Check if it's a folder
    if (this.folders.has(oldNorm)) {
      this.folders.delete(oldNorm);
      this.folders.add(newNorm);

      if (this.expandedFolders.has(oldNorm)) {
        this.expandedFolders.delete(oldNorm);
        this.expandedFolders.add(newNorm);
      }

      // Rename all nested subfolders and files
      const prefix = oldNorm + '/';
      const newPrefix = newNorm + '/';

      Array.from(this.folders).forEach(f => {
        if (f.startsWith(prefix)) {
          const updated = newPrefix + f.slice(prefix.length);
          this.folders.delete(f);
          this.folders.add(updated);
          if (this.expandedFolders.has(f)) {
            this.expandedFolders.delete(f);
            this.expandedFolders.add(updated);
          }
        }
      });

      Object.keys(this.files).forEach(fPath => {
        if (fPath.startsWith(prefix)) {
          const updated = newPrefix + fPath.slice(prefix.length);
          const file = this.files[fPath];
          delete this.files[fPath];
          file.path = updated;
          file.name = updated.split('/').pop();
          this.files[updated] = file;
        }
      });

      this.saveToStorage();
      return true;
    }

    return false;
  }

  // Delete a file or directory recursively
  delete(targetPath) {
    const norm = targetPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

    // If file
    if (this.files[norm]) {
      delete this.files[norm];
      this.saveToStorage();
      return true;
    }

    // If folder
    if (this.folders.has(norm)) {
      this.folders.delete(norm);
      this.expandedFolders.delete(norm);

      const prefix = norm + '/';
      Array.from(this.folders).forEach(f => {
        if (f.startsWith(prefix)) {
          this.folders.delete(f);
          this.expandedFolders.delete(f);
        }
      });

      Object.keys(this.files).forEach(fPath => {
        if (fPath.startsWith(prefix)) {
          delete this.files[fPath];
        }
      });

      this.saveToStorage();
      return true;
    }

    return false;
  }

  // Toggle folder expanded state
  toggleFolder(folderPath) {
    const norm = folderPath.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
    if (this.expandedFolders.has(norm)) {
      this.expandedFolders.delete(norm);
    } else {
      this.expandedFolders.add(norm);
    }
    this.saveToStorage();
  }

  expandAll() {
    this.folders.forEach(f => this.expandedFolders.add(f));
    this.saveToStorage();
  }

  collapseAll() {
    this.expandedFolders.clear();
    this.saveToStorage();
  }

  // Real Folder Import Method: Reads files from webkitdirectory or Drag & Drop
  async importFolder(filesArray, rootName = 'workspace') {
    if (!filesArray || filesArray.length === 0) return [];

    // Clear current workspace entirely for a clean imported folder view
    this.files = {};
    this.folders = new Set();
    this.expandedFolders = new Set();
    this.projectName = rootName;
    this.isImported = true; // Mark as user-imported — disables DSA auto-sync

    this.folders.add(rootName);
    this.expandedFolders.add(rootName);

    const importedPaths = [];

    for (const fileObj of filesArray) {
      // fileObj can be File object with webkitRelativePath or { path, content }
      let relPath = fileObj.webkitRelativePath || fileObj.path || fileObj.name;
      relPath = relPath.replace(/\\/g, '/').replace(/^\/+/, '');

      // Get content
      let textContent = '';
      if (typeof fileObj.text === 'function') {
        try {
          textContent = await fileObj.text();
        } catch (e) {
          textContent = '// Binary or unreadable file content';
        }
      } else if (typeof fileObj.content === 'string') {
        textContent = fileObj.content;
      }

      const fileName = relPath.split('/').pop();
      // Ignore hidden files / git files / node_modules / bin / target classes
      if (relPath.includes('.git/') || relPath.includes('.idea/') || relPath.includes('target/') || relPath.includes('.class')) {
        continue;
      }

      this.ensureParentFolders(relPath);
      const isJava = fileName.endsWith('.java');

      this.files[relPath] = {
        path: relPath,
        name: fileName,
        type: 'file',
        isJava,
        content: textContent,
        defaultStdin: ''
      };

      importedPaths.push(relPath);
    }

    // Expand all parent folders of imported files
    this.folders.forEach(f => this.expandedFolders.add(f));

    this.saveToStorage();
    return importedPaths;
  }

  // Build a clean tree structure for UI rendering
  getTree() {
    const root = {
      name: this.projectName,
      path: this.projectName,
      type: 'folder',
      isExpanded: true,
      children: {}
    };

    // 1. Add all folders
    Array.from(this.folders).sort().forEach(folderPath => {
      const parts = folderPath.split('/');
      let current = root;
      let curPath = '';

      parts.forEach((part, idx) => {
        curPath = curPath ? `${curPath}/${part}` : part;
        if (idx === 0 && part === this.projectName) return; // skip root prefix in children

        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: curPath,
            type: 'folder',
            isExpanded: this.expandedFolders.has(curPath),
            children: {}
          };
        }
        current = current.children[part];
      });
    });

    // 2. Add all files
    Object.values(this.files).forEach(file => {
      const parts = file.path.split('/');
      const fileName = parts.pop();
      let current = root;
      let curPath = '';

      parts.forEach((part, idx) => {
        curPath = curPath ? `${curPath}/${part}` : part;
        if (idx === 0 && part === this.projectName) return;

        if (!current.children[part]) {
          current.children[part] = {
            name: part,
            path: curPath,
            type: 'folder',
            isExpanded: this.expandedFolders.has(curPath),
            children: {}
          };
        }
        current = current.children[part];
      });

      current.children[fileName] = {
        ...file,
        type: 'file'
      };
    });

    return root;
  }
}

export const vfs = new VirtualFileSystem();
