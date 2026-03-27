// Upload the 12 new braid images + create documents (correct attributes only)
const { Client, Storage, Databases, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69c138dc003803eb6ca8';
const API_KEY = 'standard_98c952da1d87decadc560eb22c2e3f1dd5d907ec0e79eb52af8ac9e62da2b5abd5d717193ca6ce12be9f23fe4a528846e5903e1640bce86ce084edcd9ba4631f90fff6f348e89f8967b56758a52b085abc304c78201ec5387d2e5dbe8db826b843b09d09701c9e93810194cb7e708b6f6bcd5cda76ef6d2b000b92f360fb06ca';
const BUCKET_ID = 'media';
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'braid-models';

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const storage = new Storage(client);
const db = new Databases(client);

const uploadList = require('./_upload_list.json');
const newDir = 'trenzanuevas';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  console.log(`\nUploading ${uploadList.length} new braid images...\n`);
  let ok = 0, err = 0;

  // Get current doc count for naming
  const { total } = await db.listDocuments(DATABASE_ID, COLLECTION_ID);
  let nextNum = total + 1;

  for (let i = 0; i < uploadList.length; i++) {
    const filename = uploadList[i];
    const filePath = path.join(newDir, filename);
    const shortName = filename.substring(0, 45) + '...';

    try {
      // Upload image
      const fileBuffer = fs.readFileSync(filePath);
      const fileId = ID.unique();
      const uploaded = await storage.createFile(
        BUCKET_ID,
        fileId,
        new File([new Blob([fileBuffer], { type: 'image/jpeg' })], filename, { type: 'image/jpeg' })
      );

      const imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploaded.$id}/view?project=${PROJECT_ID}`;

      // Create document (only valid attributes)
      await db.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        name: `Trenza Modelo ${nextNum}`,
        image: imageUrl,
        description: '',
        category: 'Damas',
        isVisible: true,
      });

      nextNum++;
      ok++;
      console.log(`  [${i+1}/${uploadList.length}] OK  ${shortName}`);
      await sleep(300);

    } catch (e) {
      err++;
      console.error(`  [${i+1}/${uploadList.length}] FAIL ${shortName} ->`, e.message?.substring(0,80));
    }
  }

  console.log(`\nResult: ${ok} uploaded OK, ${err} errors.`);
}

run().catch(console.error);
