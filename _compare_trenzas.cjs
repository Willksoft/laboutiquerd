const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(data).digest('hex');
}

const existingDir = 'trenzas';
const newDir = 'trenzanuevas';

const existingFiles = fs.readdirSync(existingDir).filter(f => !f.startsWith('.'));
const newFiles = fs.readdirSync(newDir).filter(f => !f.startsWith('.'));

console.log(`Existing (trenzas): ${existingFiles.length} files`);
console.log(`New (trenzanuevas): ${newFiles.length} files\n`);

// Hash all existing files
const existingHashes = {};
for (const f of existingFiles) {
  const h = hashFile(path.join(existingDir, f));
  existingHashes[h] = f;
}

// Compare new files
const toUpload = [];
const duplicates = [];

for (const f of newFiles) {
  const h = hashFile(path.join(newDir, f));
  if (existingHashes[h]) {
    duplicates.push({ new: f, existingMatch: existingHashes[h] });
  } else {
    toUpload.push(f);
  }
}

console.log('=== DUPLICATES (already exist, will NOT upload) ===');
if (duplicates.length === 0) {
  console.log('  None found.');
} else {
  duplicates.forEach(d => console.log(`  NEW: ${d.new}\n  matches EXISTING: ${d.existingMatch}\n`));
}

console.log(`\n=== TO UPLOAD (${toUpload.length} new files) ===`);
toUpload.forEach((f, i) => {
  const size = fs.statSync(path.join(newDir, f)).size;
  console.log(`  ${i+1}. ${f} (${(size/1024).toFixed(1)} KB)`);
});

// Save result for upload script
fs.writeFileSync('_upload_list.json', JSON.stringify(toUpload, null, 2));
console.log('\nSaved to _upload_list.json');
