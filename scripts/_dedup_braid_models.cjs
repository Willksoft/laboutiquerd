// Find and delete duplicate braid-model docs by image fileId
// URL format: .../files/<fileId>/view?project=...
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new Databases(client);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function extractFileId(url) {
  if (!url) return null;
  const match = url.match(/\/files\/([^/]+)\/view/);
  return match ? match[1] : null;
}

async function run() {
  // Fetch all docs (up to 200)
  const result = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(200),
    Query.orderAsc('$createdAt')
  ]);
  const docs = result.documents;
  console.log(`Total docs: ${docs.length}`);

  // Group by fileId
  const seen = {};   // fileId -> first doc kept
  const toDelete = [];

  for (const doc of docs) {
    const fileId = extractFileId(doc.image);
    if (!fileId) {
      console.log(`  No fileId for: ${doc.name} (${doc.$id}) — skipping`);
      continue;
    }

    if (seen[fileId]) {
      // Duplicate — keep first, delete this one
      toDelete.push({ id: doc.$id, name: doc.name, fileId, keptName: seen[fileId].name });
    } else {
      seen[fileId] = doc;
    }
  }

  console.log(`\nUnique images: ${Object.keys(seen).length}`);
  console.log(`Duplicates to delete: ${toDelete.length}`);

  if (toDelete.length === 0) {
    console.log('\nNo duplicates found!');
    return;
  }

  console.log('\n=== DUPLICATES ===');
  toDelete.forEach((d, i) => {
    console.log(`  ${i+1}. DELETE "${d.name}" (kept: "${d.keptName}") fileId: ${d.fileId}`);
  });

  console.log('\nDeleting duplicates...');
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i++) {
    try {
      await db.deleteDocument(DATABASE_ID, COLLECTION_ID, toDelete[i].id);
      console.log(`  [${i+1}/${toDelete.length}] Deleted: ${toDelete[i].name}`);
      deleted++;
      await sleep(150);
    } catch(e) {
      console.error(`  [${i+1}] ERROR deleting ${toDelete[i].name}:`, e.message);
    }
  }

  const final = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);
  console.log(`\nDone. Deleted ${deleted} duplicates.`);
  console.log(`Final count: ${final.total} braid-model docs`);
}

run().catch(console.error);
