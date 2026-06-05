const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const componentsDir = path.join(__dirname, 'components');
const appDir = path.join(__dirname, 'app');

const files = [...walkSync(componentsDir), ...walkSync(appDir)].filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Theme replacements
  content = content.replace(/text-white/g, 'text-slate-900');
  content = content.replace(/text-gray-400/g, 'text-slate-600');
  content = content.replace(/text-gray-300/g, 'text-slate-600');
  content = content.replace(/text-gray-200/g, 'text-slate-700');
  
  content = content.replace(/border-white\/10/g, 'border-slate-200');
  content = content.replace(/border-white\/20/g, 'border-slate-300');
  content = content.replace(/border-white\/5/g, 'border-slate-200');
  
  content = content.replace(/bg-white\/5/g, 'bg-slate-50/50');
  content = content.replace(/bg-white\/10/g, 'bg-slate-100');
  
  content = content.replace(/bg-brand-navy/g, 'bg-[#FAFAFA]');
  content = content.replace(/bg-\[\#0D1421\]/g, 'bg-white');
  content = content.replace(/bg-\[\#070B14\]/g, 'bg-slate-50');
  content = content.replace(/bg-\[\#111827\]/g, 'bg-slate-100');
  
  content = content.replace(/from-\[\#070B14\]/g, 'from-white');
  content = content.replace(/to-brand-navy/g, 'to-[#FAFAFA]');
  content = content.replace(/from-brand-navy/g, 'from-[#FAFAFA]');
  
  content = content.replace(/text-brand-lavender/g, 'text-brand-teal');
  
  fs.writeFileSync(file, content);
});

console.log("Theme updated successfully.");
