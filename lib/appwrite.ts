import { Client, Databases, Storage, Account, ID, Query } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Services
export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);

// Constants
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

export const COLLECTIONS = {
  PRODUCTS: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION,
  OFFERS: import.meta.env.VITE_APPWRITE_OFFERS_COLLECTION,
  ORDERS: import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION,
  RESERVATIONS: import.meta.env.VITE_APPWRITE_RESERVATIONS_COLLECTION,
  BRAID_MODELS: import.meta.env.VITE_APPWRITE_BRAID_MODELS_COLLECTION,
  BRAID_SERVICES: import.meta.env.VITE_APPWRITE_BRAID_SERVICES_COLLECTION,
  VENDORS: import.meta.env.VITE_APPWRITE_VENDORS_COLLECTION,
  TSHIRT_PRESETS: import.meta.env.VITE_APPWRITE_TSHIRT_PRESETS_COLLECTION,
  BRANDS: import.meta.env.VITE_APPWRITE_BRANDS_COLLECTION,
  SITE_CONTENT: import.meta.env.VITE_APPWRITE_SITE_CONTENT_COLLECTION,
  CATEGORIES: import.meta.env.VITE_APPWRITE_CATEGORIES_COLLECTION,
  SERVICES: import.meta.env.VITE_APPWRITE_SERVICES_COLLECTION,
} as const;

// ─── Helper: Get file preview URL ───────────────────────────
export const getFilePreview = (fileId: string, width?: number, height?: number) => {
  return storage.getFilePreview(BUCKET_ID, fileId, width, height);
};

export const getFileUrl = (fileId: string) => {
  return storage.getFileView(BUCKET_ID, fileId);
};

// ─── PRODUCTS ───────────────────────────────────────────────
export const fetchProducts = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PRODUCTS, [
    Query.limit(100),
    Query.orderAsc('name'),
  ]);
  return response.documents;
};

export const fetchProductsByCategory = async (category: string) => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PRODUCTS, [
    Query.equal('category', category),
    Query.limit(100),
  ]);
  return response.documents;
};

export const createProduct = async (data: Record<string, unknown>) => {
  return databases.createDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, ID.unique(), data);
};

export const updateProduct = async (id: string, data: Record<string, unknown>) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id, data);
};

export const deleteProduct = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.PRODUCTS, id);
};

// ─── OFFERS ─────────────────────────────────────────────────
export const fetchOffers = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.OFFERS, [
    Query.limit(20),
  ]);
  return response.documents;
};

export const createOffer = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.OFFERS, ID.unique(), cleanData);
};

export const updateOffer = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.OFFERS, id, cleanData);
};

export const deleteOffer = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.OFFERS, id);
};

// ─── ORDERS ─────────────────────────────────────────────────
export const fetchOrders = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ORDERS, [
    Query.limit(100),
    Query.orderDesc('$createdAt'),
  ]);
  return response.documents;
};

export const fetchOrderByCode = async (code: string) => {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.ORDERS, code);
    return doc;
  } catch {
    return null;
  }
};

export const createOrder = async (data: Record<string, unknown>) => {
  const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  return databases.createDocument(DATABASE_ID, COLLECTIONS.ORDERS, orderId, data);
};

export const updateOrderStatus = async (id: string, status: string) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, id, { status });
};

export const updateOrder = async (id: string, data: Record<string, unknown>) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.ORDERS, id, data);
};

export const deleteOrder = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.ORDERS, id);
};

// ─── RESERVATIONS ───────────────────────────────────────────
export const fetchReservations = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.RESERVATIONS, [
    Query.limit(100),
    Query.orderDesc('$createdAt'),
  ]);
  return response.documents;
};

export const fetchReservationByCode = async (code: string) => {
  try {
    const doc = await databases.getDocument(DATABASE_ID, COLLECTIONS.RESERVATIONS, code);
    return doc;
  } catch {
    return null;
  }
};

export const createReservation = async (data: Record<string, unknown>) => {
  const reservationId = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
  return databases.createDocument(DATABASE_ID, COLLECTIONS.RESERVATIONS, reservationId, data);
};

export const updateReservationStatus = async (id: string, status: string) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.RESERVATIONS, id, { status });
};

export const updateReservation = async (id: string, data: Record<string, unknown>) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.RESERVATIONS, id, data);
};

export const deleteReservation = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.RESERVATIONS, id);
};

// ─── BRAID MODELS ───────────────────────────────────────────
export const fetchBraidModels = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BRAID_MODELS, [
    Query.limit(100),
  ]);
  return response.documents;
};

export const createBraidModel = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.BRAID_MODELS, ID.unique(), cleanData);
};

export const updateBraidModel = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.BRAID_MODELS, id, cleanData);
};

export const deleteBraidModel = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.BRAID_MODELS, id);
};

// ─── BRAID SERVICES ─────────────────────────────────────────
export const fetchBraidServices = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BRAID_SERVICES, [
    Query.limit(100),
  ]);
  return response.documents;
};

export const createBraidService = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.BRAID_SERVICES, ID.unique(), cleanData);
};

export const updateBraidService = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.BRAID_SERVICES, id, cleanData);
};

export const deleteBraidService = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.BRAID_SERVICES, id);
};

// ─── VENDORS ────────────────────────────────────────────────
export const fetchVendors = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.VENDORS, [
    Query.limit(50),
  ]);
  return response.documents;
};

// ─── T-SHIRT PRESETS ────────────────────────────────────────
export const fetchTShirtPresets = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.TSHIRT_PRESETS, [
    Query.limit(100),
  ]);
  return response.documents;
};

export const createTShirtPreset = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.TSHIRT_PRESETS, ID.unique(), cleanData);
};

export const updateTShirtPreset = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.TSHIRT_PRESETS, id, cleanData);
};

export const deleteTShirtPreset = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.TSHIRT_PRESETS, id);
};

// ─── AUTH ───────────────────────────────────────────────────
export const login = async (email: string, password: string) => {
  return account.createEmailPasswordSession(email, password);
};

export const logout = async () => {
  return account.deleteSession('current');
};

export const getUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};

// ─── STORAGE (File Upload) ─────────────────────────────────
export const uploadFile = async (file: File) => {
  return storage.createFile(BUCKET_ID, ID.unique(), file);
};

export const deleteFile = async (fileId: string) => {
  return storage.deleteFile(BUCKET_ID, fileId);
};

// Re-export for convenience
export { ID, Query };
export default client;

// ─── BRANDS ─────────────────────────────────────────────────
export const fetchBrands = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.BRANDS, [
    Query.limit(100),
    Query.orderAsc('name'),
  ]);
  return response.documents;
};

export const createBrand = async (data: Record<string, unknown>) => {
  return databases.createDocument(DATABASE_ID, COLLECTIONS.BRANDS, ID.unique(), data);
};

export const updateBrand = async (id: string, data: Record<string, unknown>) => {
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.BRANDS, id, data);
};

export const deleteBrand = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.BRANDS, id);
};

// ─── SITE CONTENT ───────────────────────────────────────────
export const fetchSiteContent = async () => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SITE_CONTENT, [
    Query.limit(100),
  ]);
  return response.documents;
};

export const upsertSiteContent = async (key: string, value: string) => {
  try {
    // Try to find existing document with this key
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SITE_CONTENT, [
      Query.equal('key', key),
      Query.limit(1),
    ]);
    if (existing.documents.length > 0) {
      return databases.updateDocument(DATABASE_ID, COLLECTIONS.SITE_CONTENT, existing.documents[0].$id, { value });
    }
  } catch { /* not found, create new */ }
  return databases.createDocument(DATABASE_ID, COLLECTIONS.SITE_CONTENT, ID.unique(), { key, value });
};

// ─── CATEGORIES ─────────────────────────────────────────────
export const fetchCategories = async () => {

  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.CATEGORIES, [
      Query.limit(100),
      Query.orderAsc('sortOrder'),
    ]);
    return response.documents;
  } catch {
    return [];
  }
};

export const createCategory = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, ID.unique(), cleanData);
};

export const updateCategory = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, id, cleanData);
};

export const deleteCategory = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.CATEGORIES, id);
};

// ─── HEADER SERVICES ────────────────────────────────────────
export const fetchServices = async () => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.SERVICES, [
      Query.limit(50),
      Query.orderAsc('sortOrder'),
    ]);
    return response.documents;
  } catch {
    return [];
  }
};

export const createService = async (data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.createDocument(DATABASE_ID, COLLECTIONS.SERVICES, ID.unique(), cleanData);
};

export const updateService = async (id: string, data: Record<string, unknown>) => {
  const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
  return databases.updateDocument(DATABASE_ID, COLLECTIONS.SERVICES, id, cleanData);
};

export const deleteService = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, COLLECTIONS.SERVICES, id);
};
