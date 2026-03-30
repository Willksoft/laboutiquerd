const { Client, Storage, Databases, ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');

// Config
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

// Files to upload (from comparison)
const uploadList = require('./_upload_list.json');
const newDir = 'trenzanuevas';

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function uploadAll() {
  console.log(`\nUploading ${uploadList.length} new braid models...\n`);
  
  for (let i = 0; i < uploadList.length; i++) {
    const filename = uploadList[i];
    const filePath = path.join(newDir, filename);
    
    try {
      // 1. Upload to Appwrite Storage
      const fileBuffer = fs.readFileSync(filePath);
      const fileBlob = new Blob([fileBuffer], { type: 'image/jpeg' });
      const fileId = ID.unique();
      
      const uploadResult = await storage.createFile(
        BUCKET_ID,
        fileId,
        new File([fileBlob], filename, { type: 'image/jpeg' })
      );
      
      // 2. Build public URL
      const imageUrl = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadResult.$id}/view?project=${PROJECT_ID}`;
      
      // 3. Create document in braid-models collection
      const docName = `Trenza Modelo ${i + 1}`;
      await db.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          name: docName,
          image: imageUrl,
          description: '',
          category: 'Damas',
          isVisible: true,
          price: 0,
          duration: 0,
        }
      );
      
      console.log(`  [${i+1}/${uploadList.length}] OK - ${filename.substring(0,40)}...`);
      await sleep(300); // Rate limit protection
      
    } catch (err) {
      console.error(`  [${i+1}/${uploadList.length}] ERROR - ${filename.substring(0,40)}`);
      console.error('  ', err.message);
    }
  }
  
  console.log('\nDone!');
}

uploadAll().catch(console.error);
