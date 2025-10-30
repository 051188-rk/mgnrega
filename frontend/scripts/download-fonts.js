const fs = require('fs');
const https = require('https');
const path = require('path');

// Create the fonts directory if it doesn't exist
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Font files to download
const fontFiles = [
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
    name: 'poppins-v20-latin-regular.woff2'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
    name: 'poppins-v20-latin-600.woff2'
  },
  {
    url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
    name: 'poppins-v20-latin-700.woff2'
  }
];

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', error => {
      fs.unlink(filePath, () => {}); // Delete the file if there's an error
      reject(error);
    });
  });
}

// Download all font files
async function downloadFonts() {
  try {
    for (const font of fontFiles) {
      const filePath = path.join(fontsDir, font.name);
      console.log(`Downloading ${font.name}...`);
      await downloadFile(font.url, filePath);
      console.log(`Downloaded ${font.name}`);
    }
    console.log('All fonts downloaded successfully!');
  } catch (error) {
    console.error('Error downloading fonts:', error);
    process.exit(1);
  }
}

downloadFonts();
