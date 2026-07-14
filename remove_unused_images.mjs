import fs from 'fs';
import path from 'path';

const PUBLIC_IMAGES_DIR = './public/images';
const SRC_DIR = './src';

// Recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function run() {
  // Get all images in public/images
  let images = [];
  try {
    images = fs.readdirSync(PUBLIC_IMAGES_DIR);
  } catch (err) {
    console.error(`Could not read ${PUBLIC_IMAGES_DIR}:`, err);
    return;
  }

  // Filter to just files (ignore dirs if any)
  images = images.filter(file => fs.statSync(path.join(PUBLIC_IMAGES_DIR, file)).isFile());
  
  if (images.length === 0) {
    console.log("No images found in public/images.");
    return;
  }

  // Get all source files
  const srcFiles = getAllFiles(SRC_DIR);
  const srcContents = [];

  // Read all src files into memory
  for (const file of srcFiles) {
    // Only read JS/JSX/TS/TSX/CSS files
    if (/\.(js|jsx|ts|tsx|css|json)$/.test(file)) {
      srcContents.push(fs.readFileSync(file, 'utf8'));
    }
  }

  // Also check some root files just in case
  const rootFiles = ['next.config.mjs', 'tailwind.config.js', 'package.json'];
  for (const file of rootFiles) {
    if (fs.existsSync(file)) {
      srcContents.push(fs.readFileSync(file, 'utf8'));
    }
  }

  const combinedContent = srcContents.join('\n');
  const removedImages = [];

  for (const image of images) {
    // Check if the exact filename is mentioned anywhere in the combined source code
    // We check for the filename itself (e.g. "hero_hotel.png")
    if (!combinedContent.includes(image)) {
      const imgPath = path.join(PUBLIC_IMAGES_DIR, image);
      try {
        fs.unlinkSync(imgPath);
        removedImages.push(image);
        console.log(`Removed unused image: ${image}`);
      } catch (e) {
        console.error(`Failed to remove ${image}:`, e);
      }
    }
  }

  console.log(`\nCleanup Complete. Removed ${removedImages.length} unused images.`);
}

run();
