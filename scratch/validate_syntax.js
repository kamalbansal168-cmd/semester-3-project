const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function checkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (file.endsWith('.js')) {
      try {
        execSync(`node --check "${full}"`);
      } catch (err) {
        console.error('Syntax error in:', full, err.message);
        process.exit(1);
      }
    }
  });
}

checkDir('js');
console.log('✓ All JS files in js/ pass syntax validation!');
