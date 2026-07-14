import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.jsx') || filePath.endsWith('.js') || filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = getAllFiles(srcDir);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Check if file has an <img> tag using regex
  if (/<img[\s\n\r]/.test(content)) {
    let newContent = content;

    newContent = newContent.replace(/<img(?=[\s\n\r])/g, '<Image width={800} height={800}');

    // Add import statement if not exists
    if (!newContent.includes('import Image from "next/image"') && !newContent.includes("import Image from 'next/image'")) {
      const importRegex = /^import .+?;?/gm;
      let lastImportMatch;
      let match;
      while ((match = importRegex.exec(newContent)) !== null) {
        lastImportMatch = match;
      }
      
      if (lastImportMatch) {
        const insertIndex = lastImportMatch.index + lastImportMatch[0].length;
        newContent = newContent.slice(0, insertIndex) + '\nimport Image from "next/image";' + newContent.slice(insertIndex);
      } else {
        if (newContent.includes('"use client"')) {
           newContent = newContent.replace(/"use client";?/, '"use client";\nimport Image from "next/image";');
        } else {
           newContent = 'import Image from "next/image";\n' + newContent;
        }
      }
    }

    if (content !== newContent) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}

console.log('Done updating images.');
