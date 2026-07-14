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

  // The injected string is exactly '\nimport Image from "next/image";'
  if (content.includes('\nimport Image from "next/image";')) {
     content = content.replace(/\nimport Image from "next\/image";/g, '');
     
     // Now that it is removed, let's re-inject it properly!
     // We will inject it right after the first line (like "use client";) or at the very top.
     if (content.includes('"use client"')) {
        content = content.replace(/"use client";?/, '"use client";\nimport Image from "next/image";');
     } else {
        content = 'import Image from "next/image";\n' + content;
     }
     
     // Ensure no duplicate imports
     content = content.replace(/import Image from "next\/image";\nimport Image from "next\/image";/g, 'import Image from "next/image";');
     
     fs.writeFileSync(file, content, 'utf8');
     console.log('Fixed', file);
  }
}
