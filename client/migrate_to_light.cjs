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

      // Dark to Light mapping
      // Backgrounds
      content = content.replace(/\bbg-zinc-950\b/g, 'bg-gray-50');
      content = content.replace(/\bbg-black\b/g, 'bg-white'); // We might need to be careful with bg-black if it's used for buttons
      content = content.replace(/\bbg-zinc-900\b/g, 'bg-white');
      content = content.replace(/\bbg-zinc-800\b/g, 'bg-gray-100');
      content = content.replace(/\bhover:bg-zinc-800\b/g, 'hover:bg-gray-100');
      content = content.replace(/\bbg-zinc-700\b/g, 'bg-gray-200');
      content = content.replace(/\bbg-gray-900\b/g, 'bg-white');
      content = content.replace(/\bhover:bg-gray-800\b/g, 'hover:bg-gray-100');
      content = content.replace(/\bhover:bg-zinc-900\b/g, 'hover:bg-gray-100');
      content = content.replace(/\bhover:bg-black\b/g, 'hover:bg-gray-200');

      // Text colors
      content = content.replace(/\btext-white\b/g, 'text-gray-900');
      content = content.replace(/\btext-zinc-300\b/g, 'text-gray-600');
      content = content.replace(/\btext-zinc-400\b/g, 'text-gray-500');
      content = content.replace(/\btext-zinc-500\b/g, 'text-gray-400');
      content = content.replace(/\btext-gray-300\b/g, 'text-gray-600');
      content = content.replace(/\btext-gray-400\b/g, 'text-gray-500');
      
      // Border colors
      content = content.replace(/\bborder-zinc-800\b/g, 'border-gray-200');
      content = content.replace(/\bborder-zinc-700\b/g, 'border-gray-300');
      content = content.replace(/\bborder-gray-800\b/g, 'border-gray-200');
      content = content.replace(/\bborder-white\/30\b/g, 'border-gray-300');
      
      // Fix buttons that became text-gray-900 on white bg instead of black on yellow
      // Actually, buttons with bg-yellow-500 usually had text-black or text-white. 
      // If they had text-white, they are now text-gray-900.
      
      // Auth Gradients (Login, Signup, ResetPassword)
      content = content.replace(/from-black via-zinc-900 to-yellow-600/g, 'from-gray-50 via-gray-100 to-yellow-200');
      content = content.replace(/bg-black opacity-40/g, 'bg-white opacity-60');
      content = content.replace(/shadow-black\/50/g, 'shadow-gray-200/50');
      
      // App.jsx loading screen bg
      content = content.replace(/bg-zinc-950/g, 'bg-gray-50');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  });
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done migrating to light theme.');
