// Delete braid-model docs that have no image URL or broken/empty image
const { Client, Databases, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const db = new Databases(client);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const result = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(200)]);
  console.log('Total docs:', result.total);

  const toDelete = result.documents.filter(doc => {
    const img = (doc.image || '').trim();
    // Delete if: no image, empty string, or points to old domain (laboutiquerd.com)
    return !img || img === '' || img.includes('laboutiquerd.com');
  });

  console.log(`Docs with no/broken image: ${toDelete.length}`);
  toDelete.forEach(d => console.log(`  - ${d.name} | image: "${(d.image||'').substring(0,60)}..."`));

  if (toDelete.length === 0) {
    console.log('\nNothing to delete.');
    return;
  }

  console.log('\nDeleting...');
  for (let i = 0; i < toDelete.length; i++) {
    try {
      await db.deleteDocument(DATABASE_ID, COLLECTION_ID, toDelete[i].$id);
      console.log(`  [${i+1}/${toDelete.length}] Deleted: ${toDelete[i].name}`);
      await sleep(150);
    } catch(e) {
      console.error(`  [${i+1}] ERROR:`, e.message);
    }
  }

  const final = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(1)]);
  console.log(`\nFinal count: ${final.total} braid-model docs`);
}

run().catch(console.error);
