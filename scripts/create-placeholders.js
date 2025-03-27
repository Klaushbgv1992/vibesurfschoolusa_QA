const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration for placeholder images
const config = {
  width: 800,
  height: 600,
  background: '#f0f0f0',
  textColor: '#333333',
  textFont: '30px Arial',
};

// Directories that need placeholder images
const imageDirectories = [
  {
    path: 'public/images/surfing',
    count: 12,
    color: '#0066cc',
    label: 'Surf Image'
  },
  {
    path: 'public/images/snorkeling-diving',
    count: 3,
    color: '#33ccff',
    label: 'Snorkeling/Diving'
  },
  {
    path: 'public/images/paddleboarding',
    count: 3,
    color: '#66cc99',
    label: 'Paddleboarding'
  },
  {
    path: 'public/images/locations',
    files: ['pompano.jpg', 'dania.jpg'],
    color: '#996633',
    label: 'Location'
  },
  {
    path: 'public/images/merchandise',
    files: ['tshirt.jpg', 'blackhood.jpg', 'whitehood.jpg', 'truckercap.jpg', 'buckethat.jpg', 'towel.jpg', 'totebag.jpg', 'bottle.jpg'],
    color: '#663399',
    label: 'Merchandise'
  },
  {
    path: 'public/images/webcams',
    files: ['webcam-locations.png'],
    color: '#999999',
    label: 'Webcam'
  }
];

// Create a placeholder image
function createPlaceholderImage(outputPath, text, bgColor = config.background) {
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, config.width, config.height);
  
  // Draw border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, config.width - 20, config.height - 20);
  
  // Draw text
  ctx.fillStyle = config.textColor;
  ctx.font = config.textFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, config.width / 2, config.height / 2);
  
  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath}`);
}

// Ensure directory exists
function ensureDirectoryExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
    console.log(`Created directory: ${directoryPath}`);
  }
}

// Generate placeholder images for all directories
imageDirectories.forEach(dir => {
  ensureDirectoryExists(dir.path);
  
  if (dir.count) {
    // Generate numbered files
    for (let i = 1; i <= dir.count; i++) {
      const outputPath = path.join(dir.path, `${i}.jpg`);
      const label = `${dir.label} ${i}`;
      createPlaceholderImage(outputPath, label, dir.color);
    }
  } else if (dir.files) {
    // Generate specific named files
    dir.files.forEach((filename, index) => {
      const outputPath = path.join(dir.path, filename);
      const label = filename.replace(/\.\w+$/, '');
      createPlaceholderImage(outputPath, label, dir.color);
    });
  }
});

console.log('All placeholder images have been created successfully!');
