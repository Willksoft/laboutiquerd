// Script para insertar las 15 categorías en Appwrite
// Ejecutar con: node scripts/seed-categories.mjs
import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('69c138dc003803eb6ca8')
  .setKey(process.env.APPWRITE_API_KEY); // Necesitas una API key con permisos de escritura

const db = new Databases(client);
const DATABASE_ID = 'laboutiquerd';
const COLLECTION_ID = 'categories';

const categories = [
  { key: 'Moda & Ropa',          name: 'Moda & Ropa',          nameEn: 'Fashion & Clothing',  nameFr: 'Mode & Vêtements',      emoji: '👗', sortOrder: 1,  isActive: true, image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80&auto=format&fit=crop' },
  { key: 'Calzado',              name: 'Calzado',              nameEn: 'Footwear',            nameFr: 'Chaussures',            emoji: '👟', sortOrder: 2,  isActive: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop' },
  { key: 'Accesorios',           name: 'Accesorios',           nameEn: 'Accessories',         nameFr: 'Accessoires',           emoji: '👜', sortOrder: 3,  isActive: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop' },
  { key: 'Alta Joyería',         name: 'Alta Joyería',         nameEn: 'Fine Jewelry',        nameFr: 'Haute Joaillerie',      emoji: '💎', sortOrder: 4,  isActive: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop' },
  { key: 'Bisutería',            name: 'Bisutería',            nameEn: 'Costume Jewelry',     nameFr: 'Bijoux Fantaisie',      emoji: '📿', sortOrder: 5,  isActive: true, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80&auto=format&fit=crop' },
  { key: 'Cuidado Personal',     name: 'Cuidado Personal',     nameEn: 'Personal Care',       nameFr: 'Soin Personnel',        emoji: '🧴', sortOrder: 6,  isActive: true, image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=80&auto=format&fit=crop' },
  { key: 'Perfumes',             name: 'Perfumes',             nameEn: 'Fragrances',          nameFr: 'Parfums',               emoji: '🌸', sortOrder: 7,  isActive: true, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80&auto=format&fit=crop' },
  { key: 'Artesanía',            name: 'Artesanía',            nameEn: 'Handicrafts',         nameFr: 'Artisanat',             emoji: '🏺', sortOrder: 8,  isActive: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop' },
  { key: 'Artículos del Hogar',  name: 'Artículos del Hogar',  nameEn: 'Home Goods',          nameFr: 'Articles Ménagers',     emoji: '🏠', sortOrder: 9,  isActive: true, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80&auto=format&fit=crop' },
  { key: 'Artículos Personales', name: 'Artículos Personales', nameEn: 'Personal Items',      nameFr: 'Articles Personnels',   emoji: '🎒', sortOrder: 10, isActive: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop' },
  { key: 'Juguetes',             name: 'Juguetes',             nameEn: 'Toys',                nameFr: 'Jouets',                emoji: '🧸', sortOrder: 11, isActive: true, image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80&auto=format&fit=crop' },
  { key: 'Tecnología',           name: 'Tecnología',           nameEn: 'Technology',          nameFr: 'Technologie',           emoji: '📱', sortOrder: 12, isActive: true, image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80&auto=format&fit=crop' },
  { key: 'Bolsos & Carteras',    name: 'Bolsos & Carteras',    nameEn: 'Bags & Wallets',      nameFr: 'Sacs & Portefeuilles',  emoji: '👛', sortOrder: 13, isActive: true, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&auto=format&fit=crop' },
  { key: 'Ropa Interior',        name: 'Ropa Interior',        nameEn: 'Underwear',           nameFr: 'Sous-vêtements',        emoji: '🩱', sortOrder: 14, isActive: true, image: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400&q=80&auto=format&fit=crop' },
  { key: 'Deportes',             name: 'Deportes',             nameEn: 'Sports',              nameFr: 'Sports',                emoji: '⚽', sortOrder: 15, isActive: true, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80&auto=format&fit=crop' },
];

async function seed() {
  console.log('🌱 Insertando categorías en Appwrite...\n');
  let ok = 0, fail = 0;
  for (const cat of categories) {
    try {
      const docId = 'cat-' + cat.key.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/-$/, '');
      await db.createDocument(DATABASE_ID, COLLECTION_ID, docId, cat);
      console.log(`  ✅ ${cat.emoji} ${cat.name}`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${cat.name}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nFinalizado: ${ok} OK, ${fail} errores`);
}

seed();
