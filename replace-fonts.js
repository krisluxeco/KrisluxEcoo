const fs = require('fs');
const path = require('path');

function replaceFontsInDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceFontsInDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace hardcoded "Cormorant Garamond" strings
      content = content.replace(/'Cormorant Garamond', Georgia, serif/g, 'var(--font-playfair), Georgia, serif');
      content = content.replace(/'Cormorant Garamond', serif/g, 'var(--font-playfair), Georgia, serif');
      
      // Replace hardcoded "DM Sans" strings
      content = content.replace(/'DM Sans', sans-serif/g, 'var(--font-montserrat), sans-serif');
      
      // Replace the ugly prank fonts
      content = content.replace(/'Black Ops One', sans-serif/g, 'var(--font-montserrat), sans-serif');
      content = content.replace(/'Jersey 10 Charted', serif/g, 'var(--font-playfair), Georgia, serif');
      
      // Also catch any inline styles that use the exact string
      content = content.replace(/fontFamily: "'Black Ops One', sans-serif"/g, 'fontFamily: "var(--font-montserrat), sans-serif"');
      content = content.replace(/fontFamily: "'Jersey 10 Charted', serif"/g, 'fontFamily: "var(--font-playfair), Georgia, serif"');
      content = content.replace(/fontFamily: "'Cormorant Garamond', Georgia, serif"/g, 'fontFamily: "var(--font-playfair), Georgia, serif"');
      content = content.replace(/fontFamily: "'DM Sans', sans-serif"/g, 'fontFamily: "var(--font-montserrat), sans-serif"');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

replaceFontsInDirectory(path.join(__dirname, 'src'));
console.log("Fonts replaced successfully!");
