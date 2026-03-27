// Compare braid-model images by downloading them and hashing content
const { Client, Databases, Query, Storage } = require('node-appwrite');
const https = require('https');
const crypto = require('crypto');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new Databases(client);
const storage = new Storage(client);

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    https.get(url, { headers: { 'X-Appwrite-Project': PROJECT_ID, 'X-Appwrite-Key': API_KEY } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function extractFileId(url) {
  const match = (url||'').match(/\/files\/([^/]+)\/view/);
  return match ? match[1] : null;
}

async function run() {
  const result = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(200), Query.orderAsc('$createdAt')]);
  const docs = result.documents;
  console.log(`Total docs: ${docs.length}`);
  console.log('Downloading and hashing images (this may take a moment)...\n');

  const hashMap = {}; // hash -> first doc
  const toDelete = [];
  let i = 0;

  for (const doc of docs) {
    i++;
    const fileId = extractFileId(doc.image);
    if (!fileId || !doc.image) {
      console.log(`  [${i}/${docs.length}] SKIP (no image): ${doc.name}`);
      continue;
    }

    try {
      const buf = await downloadBuffer(doc.image);
      const hash = crypto.createHash('md5').update(buf).digest('hex');
      
      if (hashMap[hash]) {
        toDelete.push({ id: doc.$id, name: doc.name, hash, keptName: hashMap[hash].name });
        console.log(`  [${i}/${docs.length}] DUPLICATE: "${doc.name}" == "${hashMap[hash].name}"`);
      } else {
        hashMap[hash] = doc;
        console.log(`  [${i}/${docs.length}] OK: ${doc.name}`);
      }
      await sleep(100);
    } catch (e) {
      console.error(`  [${i}/${docs.length}] ERROR downloading ${doc.name}: ${e.message}`);
    }
  }

  console.log(`\n=== RESULTS ===`);
  console.log(`Unique: ${Object.keys(hashMap).length}`);
  console.log(`To delete: ${toDelete.length}`);

  if (toDelete.length === 0) {
    console.log('No duplicates found by image content!');
    return;
  }

  console.log('\nDeleting duplicates...');
  let deleted = 0;
  for (let j = 0; j < toDelete.length; j++) {
    try {
      await db.deleteDocument(DATABASE_ID, COLLECTION_ID, toDelete[j].id);
      console.log(`  [${j+1}/${toDelete.length}] Deleted: "${toDelete[j].name}" (dup of "${toDelete[j].keptName}")`);
      deleted++;
      await sleep(150);
    } catch(e) {
      console.error(`  [${j+1}] ERROR:`, e.message);
    }
  }

  const final = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);
  console.log(`\nDeleted ${deleted} duplicates. Final count: ${final.total}`);
}

run().catch(console.error);
