const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;

      // Fix gradients
      content = content.replace(/from-zinc-900 via-zinc-800 to-zinc-900/g, 'from-gray-50 via-white to-gray-100');
      content = content.replace(/from-zinc-800 to-zinc-900/g, 'from-gray-100 to-gray-50');
      content = content.replace(/from-zinc-900\/80/g, 'from-gray-100/80');
      content = content.replace(/from-black via-zinc-500 to-yellow-600/g, 'from-gray-50 via-gray-100 to-yellow-200');
      
      // Fix phone verify buttons on auth pages
      content = content.replace(/from-gray-800 to-gray-900 hover:from-black hover:to-black text-gray-900/g, 'from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900');
      
      // Fix specific text colors
      content = content.replace(/\btext-zinc-200\b/g, 'text-gray-900');
      content = content.replace(/\bplaceholder-zinc-600\b/g, 'placeholder-gray-400');
      content = content.replace(/\bplaceholder-zinc-500\b/g, 'placeholder-gray-400');
      
      // Fix Navbar remaining dark mode
      content = content.replace(/bg-gray-800\/50/g, 'bg-gray-100/50');
      content = content.replace(/bg-gray-700\/50/g, 'bg-gray-200/50');
      content = content.replace(/border-gray-700/g, 'border-gray-300');
      
      // Fix the "Phone Mockup" inner elements
      content = content.replace(/\bbg-zinc-600\b/g, 'bg-gray-300');
      content = content.replace(/bg-yellow-500\/10/g, 'bg-yellow-100');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done fixing light theme.');
