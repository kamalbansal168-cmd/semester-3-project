const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'js', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

// Find the "Folder Opened" toast line and the closing });
// and add the VS Code theme selector handler after it
const marker = "      }\n    });";
const markerCRLF = "      }\r\n    });";

const addition = `      } else if (e.target.id === 'vscode-theme-selector' && this.currentRoute === 'vscode-studio') {
        this.studioTheme = e.target.value;
        this.render();
      } else if (e.target.id === 'vscode-fontsize-selector' && this.currentRoute === 'vscode-studio') {
        const editor = document.getElementById('vscode-code-editor');
        if (editor) editor.style.fontSize = e.target.value + 'px';
      }
    });`;

// Find the exact match - the change listener closing block after the vfs-folder-input handler
const searchStr = "this.showToast('Folder Opened";
const idx = content.indexOf(searchStr);
if (idx === -1) {
  console.error('Could not find "Folder Opened" marker');
  process.exit(1);
}

// Find the end of that line's closing block
const closingIdx = content.indexOf('    });', idx);
if (closingIdx === -1) {
  console.error('Could not find closing });');
  process.exit(1);
}

// The block we want to replace: from "      }\r\n    });" or "      }\n    });"
// Check what's right before the }); - should be the "      }" closing the else if
const before = content.substring(idx, closingIdx + 7); // include "    });"
console.log('Found block (last 50 chars):', JSON.stringify(before.slice(-80)));

// Replace only the last "}\n    });" occurrence in that block
const newClosing = content.indexOf('\r\n    });', idx) !== -1
  ? addition.replace('\n    });', '\r\n    });').replace(/\n/g, '\r\n')
  : addition;

// Find the exact "      }\n    });" or "      }\r\n    });" pattern after our marker
let replaceTarget;
let replacement;

if (content.indexOf('      }\r\n    });', idx) !== -1) {
  const pos = content.indexOf('      }\r\n    });', idx);
  replaceTarget = content.substring(pos, pos + 16); // "      }\r\n    });"
  replacement = addition.replace(/\n/g, '\r\n');
} else {
  const pos = content.indexOf('      }\n    });', idx);
  replaceTarget = content.substring(pos, pos + 15);
  replacement = addition;
}

console.log('Replacing at position:', content.indexOf(replaceTarget, idx));
console.log('Target:', JSON.stringify(replaceTarget));

const newContent = content.slice(0, content.indexOf(replaceTarget, idx)) + replacement + content.slice(content.indexOf(replaceTarget, idx) + replaceTarget.length);
fs.writeFileSync(appPath, newContent, 'utf8');
console.log('Done! File written successfully.');
