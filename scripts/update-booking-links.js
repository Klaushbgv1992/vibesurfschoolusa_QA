const fs = require('fs');
const path = require('path');

// Function to recursively find all JS files in a directory
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.next') {
      fileList = findJsFiles(filePath, fileList);
    } else if (path.extname(file) === '.js') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update links in a file
function updateLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let updated = false;
  
  // Replace Fort Lauderdale links
  if (content.includes('vibesurfschool.setmore.com/fortlauderdale')) {
    content = content.replace(/href="https:\/\/vibesurfschool.setmore.com\/fortlauderdale"/g, 'href="/booking"');
    updated = true;
  }
  
  // Replace Pompano Beach links (point to the same booking system but we'll add beach selection)
  if (content.includes('vibesurfschool.setmore.com/pompanobeach')) {
    content = content.replace(/href="https:\/\/vibesurfschool.setmore.com\/pompanobeach"/g, 'href="/booking"');
    updated = true;
  }
  
  // Update target="_blank" and rel attributes for booking links
  content = content.replace(/href="\/booking"\s+target="_blank"\s+rel="noopener noreferrer"/g, 'href="/booking"');
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated links in: ${filePath}`);
  }
}

// Find and process all JS files
const appDir = path.join(__dirname, '../app');
const jsFiles = findJsFiles(appDir);
console.log(`Found ${jsFiles.length} JS files to process`);

// Update links in each file
jsFiles.forEach(file => {
  updateLinksInFile(file);
});

console.log('All booking links have been updated!');
