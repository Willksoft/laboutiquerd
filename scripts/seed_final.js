import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno desde .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '69c138dc003803eb6ca8')
    .setKey(process.env.APPWRITE_API_KEY || ''); // Necesitaríamos el API key, pero si no está, usaremos la web de Appwrite o fetch.
