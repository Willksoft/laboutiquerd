/**
 * One-time script to restrict the Appwrite Storage bucket 
 * to only allow image file extensions.
 * 
 * Run with: node restrict-bucket.cjs
 */
const https = require('https');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const BUCKET_ID = 'media';

// You need an API Key with storage.buckets.write scope
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
  console.error('❌ Set APPWRITE_API_KEY environment variable first');
  console.error('   $env:APPWRITE_API_KEY="your-api-key-here"');
  process.exit(1);
}

const data = JSON.stringify({
  name: 'media',
  allowedFileExtensions: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'],
  maximumFileSize: 5242880, // 5MB
  permissions: [
    'read("any")',
    'create("users")',
    'update("users")',
    'delete("users")'
  ],
  fileSecurity: false,
  enabled: true,
  compression: 'gzip',
  encryption: false,
  antivirus: true
});

const url = new URL(`${ENDPOINT}/storage/buckets/${BUCKET_ID}`);

const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'X-Appwrite-Project': PROJECT_ID,
    'X-Appwrite-Key': API_KEY,
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Bucket restricted to image files only');
      const result = JSON.parse(body);
      console.log(`   Extensions: ${result.allowedFileExtensions?.join(', ')}`);
      console.log(`   Max size: ${(result.maximumFileSize / 1024 / 1024).toFixed(0)}MB`);
    } else {
      console.error(`❌ Error ${res.statusCode}:`, body);
    }
  });
});

req.on('error', (e) => console.error('❌ Request failed:', e.message));
req.write(data);
req.end();
