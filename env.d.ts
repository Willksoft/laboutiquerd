/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_BUCKET_ID: string;
  readonly VITE_APPWRITE_PRODUCTS_COLLECTION: string;
  readonly VITE_APPWRITE_OFFERS_COLLECTION: string;
  readonly VITE_APPWRITE_ORDERS_COLLECTION: string;
  readonly VITE_APPWRITE_RESERVATIONS_COLLECTION: string;
  readonly VITE_APPWRITE_BRAID_MODELS_COLLECTION: string;
  readonly VITE_APPWRITE_BRAID_SERVICES_COLLECTION: string;
  readonly VITE_APPWRITE_VENDORS_COLLECTION: string;
  readonly VITE_APPWRITE_TSHIRT_PRESETS_COLLECTION: string;
  readonly VITE_APPWRITE_BRANDS_COLLECTION: string;
  readonly VITE_APPWRITE_SITE_CONTENT_COLLECTION: string;
  readonly VITE_APPWRITE_CATEGORIES_COLLECTION: string;
  readonly VITE_APPWRITE_SERVICES_COLLECTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
