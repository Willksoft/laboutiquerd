// This script:
// 1. Lists all files in Appwrite bucket
// 2. Lists all existing braid-model documents (to avoid creating duplicates)
// 3. Creates documents only for files that don't have a matching document yet

const { Client, Storage, Databases, ID, Query } = require('node-appwrite');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const BUCKET_ID = 'media';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const storage = new Storage(client);
const db = new Databases(client);

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  // 1. Get all files uploaded recently (last 100)
  const filesResult = await storage.listFiles(BUCKET_ID, [Query.limit(100), Query.orderDesc('$createdAt')]);
  console.log(`Total files in bucket: ${filesResult.total}`);
  
  // 2. Get all existing braid-model docs
  const docsResult = await db.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.limit(100)]);
  const existingImageUrls = new Set(docsResult.documents.map(d => d.image));
  console.log(`Existing braid-model docs: ${docsResult.documents.length}`);
  
  // 3. Find files that don't have a document yet
  const orphanFiles = filesResult.files.filter(f => {
    const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${f.$id}/view?project=${PROJECT_ID}`;
    return !existingImageUrls.has(url);
  });
  
  console.log(`\nFiles without a document: ${orphanFiles.length}`);
  
  // 4. Create documents for orphan files
  let created = 0;
  for (let i = 0; i < orphanFiles.length; i++) {
    const f = orphanFiles[i];
    const imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${f.$id}/view?project=${PROJECT_ID}`;
    
    try {
      await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        name: `Trenza Modelo ${docsResult.total + i + 1}`,
        image: imageUrl,
        description: '',
        category: 'Damas',
        isVisible: true,
      });
      created++;
      console.log(`  [${i+1}/${orphanFiles.length}] Created doc for file: ${f.name || f.$id}`);
      await sleep(200);
    } catch(err) {
      console.error(`  [${i+1}] ERROR:`, err.message);
    }
  }
  
  console.log(`\nDone. Created ${created} new braid-model documents.`);
}

run().catch(console.error);
