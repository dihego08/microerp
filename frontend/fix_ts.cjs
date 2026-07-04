const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove "import React from 'react';"
    content = content.replace(/import React from 'react';\r?\n/g, '');
    
    // Replace "import React, { ..." with "import { ..."
    content = content.replace(/import React, \{\s*/g, 'import { ');
    
    // Special cases
    if (filePath.includes('MainLayout.tsx')) {
      content = content.replace(/,\s*X\r?\n/, '\n');
    }
    if (filePath.includes('ProductForm.tsx')) {
      content = content.replace(/, formState: \{ errors \} /g, ' ');
    }
    
    fs.writeFileSync(filePath, content);
  }
});

console.log('Archivos corregidos.');
