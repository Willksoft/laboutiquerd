import { Client, Databases, Query, ID } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT!)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY || ''); // if not present, will fail

const databases = new Databases(client);

async function check() {
    try {
        const result = await databases.listAttributes(process.env.VITE_APPWRITE_DATABASE_ID!, process.env.VITE_APPWRITE_TSHIRT_PRESETS_COLLECTION!);
        console.log(result.attributes);
    } catch (e) {
        console.error(e);
    }
}

check();
