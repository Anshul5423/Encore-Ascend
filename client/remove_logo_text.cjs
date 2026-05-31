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
    console.log(`Updated text near logo in ${path.basename(filePath)}`);
  }
}

// 1. Auth pages
['Login.jsx', 'Signup.jsx', 'ResetPassword.jsx'].forEach(file => {
  const p = path.join(srcDir, 'pages', file);
  if (fs.existsSync(p)) {
    replaceInFile(p, [
      { search: /<div className="hidden text-center w-full">[\s\S]*?<\/div>/g, replace: '' }
    ]);
  }
});

// 2. Navbar.jsx
const navPath = path.join(srcDir, 'components', 'Navbar.jsx');
if (fs.existsSync(navPath)) {
  replaceInFile(navPath, [
    { search: /<div className="hidden sm:block">[\s\S]*?<\/div>/g, replace: '' }
  ]);
}

// 3. Home.jsx
const homePath = path.join(srcDir, 'pages', 'Home.jsx');
if (fs.existsSync(homePath)) {
  replaceInFile(homePath, [
    // Footer text
    { search: /<span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Encore Ascend<\/span>/g, replace: '' },
    // Phone mockup text
    { search: /<h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 tracking-wider mb-2 drop-shadow-md">\s*ENCORE ASCEND\s*<\/h3>/g, replace: '' }
  ]);
}

// 4. AboutUs.jsx
const aboutPath = path.join(srcDir, 'pages', 'AboutUs.jsx');
if (fs.existsSync(aboutPath)) {
  replaceInFile(aboutPath, [
    { search: /<span className="font-extrabold text-xl tracking-tight">Encore Ascend<\/span>/g, replace: '' }
  ]);
}

// 5. Notes.jsx and Video.jsx
['Notes.jsx', 'Video.jsx'].forEach(file => {
  const p = path.join(srcDir, 'pages', file);
  if (fs.existsSync(p)) {
    replaceInFile(p, [
      { search: /<span className="text-gray-900 font-black text-lg tracking-wider drop-shadow-md hidden sm:block">Encore Ascend<\/span>/g, replace: '' }
    ]);
  }
});

console.log("Logo text removal applied.");
