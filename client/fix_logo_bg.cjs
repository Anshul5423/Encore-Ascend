const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  replacements.forEach(r => {
    newContent = newContent.replace(r.search, r.replace);
  });
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated logo backgrounds in ${path.basename(filePath)}`);
  }
}

// 1. Home.jsx
const homePath = path.join(srcDir, 'pages', 'Home.jsx');
if (fs.existsSync(homePath)) {
  replaceInFile(homePath, [
    { search: /bg-white\/40 rounded-\[2\.5rem\]/g, replace: 'bg-zinc-900 rounded-[2.5rem]' }, // Hero logo
    { search: /bg-gray-100 p-8 rounded-\[2rem\]/g, replace: 'bg-zinc-900 p-8 rounded-[2rem]' }, // Phone mockup logo
    { search: /<img src="\/logo\.png" alt="Logo" className="w-8 h-8 object-contain/g, replace: '<div className="bg-zinc-900 p-1.5 rounded-lg flex items-center justify-center shadow-md"><img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain' }, // Footer logo - wrapped
    { search: /<img src="\/logo\.png" alt="Logo" className="w-6 h-6 object-contain drop-shadow-\[0_0_10px_rgba\(234,179,8,0\.4\)\]" onError=\{\(e\) => \{ e\.target\.style\.display='none'; \}\} \/>\s*<span/g, replace: '<img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]" onError={(e) => { e.target.style.display=\'none\'; }} /></div>\n             <span' } // close the div wrapper in footer
  ]);
}

// 2. Auth pages
['Login.jsx', 'Signup.jsx', 'ResetPassword.jsx'].forEach(file => {
  const p = path.join(srcDir, 'pages', file);
  if (fs.existsSync(p)) {
    replaceInFile(p, [
      { search: /className="mb-6 w-64 h-64 lg:w-72 lg:h-72 mx-auto flex items-center justify-center p-2/g, replace: 'className="mb-6 w-56 h-56 lg:w-64 lg:h-64 mx-auto flex items-center justify-center p-6 bg-zinc-900 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.1)] border-4 border-white' }
    ]);
  }
});

// 3. Navbar.jsx
const navPath = path.join(srcDir, 'components', 'Navbar.jsx');
if (fs.existsSync(navPath)) {
  replaceInFile(navPath, [
    { search: /<img src="\/logo\.png" alt="Logo" className="max-w-full max-h-full object-contain/g, replace: '<div className="bg-zinc-900 p-1 rounded-md w-full h-full flex items-center justify-center"><img src="/logo.png" alt="Logo" className="max-w-full max-h-full object-contain' },
    { search: /onError=\{\(e\) => \{ e\.target\.style\.display='none'; \}\}\/>\s*<\/Link>/g, replace: 'onError={(e) => { e.target.style.display=\'none\'; }}/></div>\n          </Link>' }
  ]);
}

// 4. Notes.jsx & Video.jsx & AboutUs.jsx
['Notes.jsx', 'Video.jsx', 'AboutUs.jsx'].forEach(file => {
  const p = path.join(srcDir, 'pages', file);
  if (fs.existsSync(p)) {
    replaceInFile(p, [
      { search: /bg-white\/50 rounded-full border/g, replace: 'bg-zinc-900 rounded-full border' },
      { search: /<img src="\/logo\.png" alt="Logo" className="w-8 h-8 rounded-full/g, replace: '<div className="bg-zinc-900 p-1 rounded-full"><img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain' },
      { search: /onError=\{\(e\) => e\.target\.style\.display='none'\}\/>\s*<div/g, replace: 'onError={(e) => e.target.style.display=\'none\'}/></div>\n          <div' }
    ]);
  }
});

console.log("Logo fixes applied.");
