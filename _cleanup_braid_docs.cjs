// Clean up: delete braid-model docs that point to non-braid files
// (created incorrectly by _fix_braid_docs.cjs)
// We keep only docs whose image URL contains files that are WhatsApp images or trenzas
const { Client, Storage, Databases, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const BUCKET_ID = 'media';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const storage = new Storage(client);
const db = new Databases(client);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  // Get all docs
  const all = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(200)]);
  console.log('Total docs:', all.total);

  // Get all files in bucket with their metadata
  const filesResult = await storage.listFiles(BUCKET_ID, [Query.limit(200)]);
  const filesById = {};
  for (const f of filesResult.files) {
    filesById[f.$id] = f;
  }

  // Check each doc: extract fileId from image URL
  // URL format: .../files/<fileId>/view?project=...
  const toDelete = [];
  const toKeep = [];

  for (const doc of all.documents) {
    const url = doc.image || '';
    const match = url.match(/\/files\/([^/]+)\/view/);
    if (!match) {
      toDelete.push({ id: doc.$id, reason: 'no image URL', name: doc.name });
      continue;
    }
    const fileId = match[1];
    const file = filesById[fileId];
    if (!file) {
      toDelete.push({ id: doc.$id, reason: 'file not in bucket', name: doc.name });
      continue;
    }
    const fname = (file.name || '').toLowerCase();
    // Keep if it's a WhatsApp image or named trenzas
    if (fname.includes('whatsapp') || fname.includes('trenza') || fname.startsWith('trenzas')) {
      toKeep.push({ id: doc.$id, name: doc.name, file: fname });
    } else {
      toDelete.push({ id: doc.$id, reason: `non-braid file: ${file.name}`, name: doc.name });
    }
  }

  console.log(`\nTo KEEP: ${toKeep.length}`);
  console.log(`To DELETE: ${toDelete.length}`);
  
  if (toDelete.length > 0) {
    console.log('\nDeleting spurious docs...');
    for (let i = 0; i < toDelete.length; i++) {
      const d = toDelete[i];
      try {
        await db.deleteDocument(DATABASE_ID, COLLECTION_ID, d.id);
        console.log(`  [${i+1}/${toDelete.length}] Deleted: ${d.name} (${d.reason})`);
        await sleep(150);
      } catch(e) {
        console.error(`  [${i+1}] ERROR deleting ${d.name}:`, e.message);
      }
    }
  }

  console.log('\nFinal count check...');
  const final = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);
  console.log('Final braid-model docs:', final.total);
}

run().catch(console.error);
