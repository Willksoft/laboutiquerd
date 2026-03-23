import { Client, Databases, ID } from 'appwrite';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, 'utf8').split('\n');
        for (const line of lines) {
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                process.env[match[1]] = match[2];
            }
        }
    }
}
loadEnv();

const client = new Client();
client
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID || '69c138dc003803eb6ca8');

const databases = new Databases(client);

const databaseId = 'laboutiquerd';
const brandsCollectionId = 'brands';
const presetsCollectionId = 'tshirt-presets';

const BRANDS = [
  { name: '45', logo: 'font-bold tracking-widest text-[#4A3D2A]', isVisible: true },
  { name: 'Collection Club Med', logo: 'font-serif font-bold tracking-widest text-brand-primary', isVisible: true },
  { name: 'Quiksilver', logo: 'font-sans font-black tracking-tighter text-red-600', isVisible: true },
  { name: 'Billabong', logo: 'font-sans font-bold italic tracking-wide text-gray-800', isVisible: true },
  { name: 'Vilebrequin', logo: 'font-sans font-black uppercase tracking-wide text-blue-900', isVisible: true },
  { name: 'Sundek', logo: 'font-sans font-bold text-orange-500 uppercase', isVisible: true },
  { name: 'Banana Moon', logo: 'font-cursive text-2xl md:text-3xl text-pink-500', isVisible: true },
  { name: 'Havaianas', logo: 'font-sans font-black text-yellow-500 tracking-wider', isVisible: true },
  { name: 'Livia', logo: 'font-serif italic font-bold text-gray-700', isVisible: true },
  { name: 'Carbon', logo: 'font-mono font-bold uppercase tracking-tighter text-gray-900', isVisible: true },
  { name: 'Happy & So', logo: 'font-handwriting text-xl font-bold text-purple-900', isVisible: true },
  { name: 'Gold & Silver', logo: 'font-serif font-bold text-yellow-600', isVisible: true },
  { name: 'Kreoli Bijoux', logo: 'font-sans font-light tracking-[0.2em] uppercase text-gray-800', isVisible: true },
  { name: 'Cacatoès', logo: 'font-sans font-black uppercase text-green-600', isVisible: true },
  { name: 'Hipanema', logo: 'font-serif font-bold text-red-500 tracking-wider', isVisible: true }
];

const PRESETS = [
    { name: 'Logo Rosado', description: 'T-shirt turquesa oscuro', logoStyle: 'classic', baseColorName: 'Turquesa Oscuro', baseColorValue: '#00ced1', defaultLogoColor: '#ffc0cb', isVisible: true, nameEn: 'Pink Logo', descEn: 'Dark Turquoise T-shirt', nameFr: 'Logo Rose', descFr: 'T-shirt Turquoise Foncé' },
    { name: 'Logo Amarillo', description: 'T-shirt turquesa oscuro', logoStyle: 'classic', baseColorName: 'Turquesa Oscuro', baseColorValue: '#00ced1', defaultLogoColor: '#ffff00', isVisible: true, nameEn: 'Yellow Logo', descEn: 'Dark Turquoise T-shirt', nameFr: 'Logo Jaune', descFr: 'T-shirt Turquoise Foncé' },
    { name: 'Logo Verde Neon', description: 'T-shirt negro', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#39ff14', isVisible: true, nameEn: 'Neon Green Logo', descEn: 'Black T-shirt', nameFr: 'Logo Vert Néon', descFr: 'T-shirt Noir' },
    { name: 'Logo Verde Neon Blanco', description: 'T-shirt blanco con Verde Neon', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#39ff14', isVisible: true, nameEn: 'White Neon Green Logo', descEn: 'White T-shirt', nameFr: 'Logo Blanc Vert Néon', descFr: 'T-shirt Blanc' },
    { name: 'Logo Naranja Neon', description: 'T-shirt negro', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#ff5f1f', isVisible: true, nameEn: 'Neon Orange Logo', descEn: 'Black T-shirt', nameFr: 'Logo Orange Néon', descFr: 'T-shirt Noir' },
    { name: 'Logo Verde Gris', description: 'T-shirt gris', logoStyle: 'classic', baseColorName: 'Gris', baseColorValue: '#808080', defaultLogoColor: '#008000', isVisible: true, nameEn: 'Green Logo Gray', descEn: 'Gray T-shirt', nameFr: 'Logo Vert Gris', descFr: 'T-shirt Gris' },
    { name: 'Logo Blanco Rosado', description: 'T-shirt rosado', logoStyle: 'classic', baseColorName: 'Rosado', baseColorValue: '#ffc0cb', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'White Logo Pink', descEn: 'Pink T-shirt', nameFr: 'Logo Blanc Rose', descFr: 'T-shirt Rose' },
    { name: 'Logo Rojo Vino', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#722f37', isVisible: true, nameEn: 'Wine Red Logo', descEn: 'White T-shirt', nameFr: 'Logo Rouge Vin', descFr: 'T-shirt Blanc' },
    { name: 'Logo Blanco Azul Cielo', description: 'T-shirt azul cielo', logoStyle: 'classic', baseColorName: 'Azul Cielo', baseColorValue: '#87ceeb', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'White Logo Sky Blue', descEn: 'Sky Blue T-shirt', nameFr: 'Logo Blanc Bleu Ciel', descFr: 'T-shirt Bleu Ciel' },
    { name: 'Logo Dominicano', description: 'T-shirt azul oscuro', logoStyle: 'dominican', baseColorName: 'Azul Oscuro', baseColorValue: '#00008b', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'Dominican Logo Dark Blue', descEn: 'Dark Blue T-shirt', nameFr: 'Logo Dominicain Bleu Foncé', descFr: 'T-shirt Bleu Foncé' },
    { name: 'Logo Dorado', description: 'T-shirt negro', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#ffd700', isVisible: true, nameEn: 'Gold Logo Black', descEn: 'Black T-shirt', nameFr: 'Logo Or Noir', descFr: 'T-shirt Noir' },
    { name: 'Logo Azul Claro Metalico Negro', description: 'T-shirt negro', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#add8e6', isVisible: true, nameEn: 'Light Blue Metallic Logo', descEn: 'Black T-shirt', nameFr: 'Logo Bleu Clair Métallique', descFr: 'T-shirt Noir' },
    { name: 'Logo Azul Claro Metalico Blanco', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#add8e6', isVisible: true, nameEn: 'Light Blue Metallic Logo White', descEn: 'White T-shirt', nameFr: 'Logo Bleu Clair Métallique Blanc', descFr: 'T-shirt Blanc' },
    { name: 'Logo Plateado', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#c0c0c0', isVisible: true, nameEn: 'Silver Logo White', descEn: 'White T-shirt', nameFr: 'Logo Argent Blanc', descFr: 'T-shirt Blanc' },
    { name: 'Logo Dominicano Rosado', description: 'T-shirt rosado', logoStyle: 'dominican', baseColorName: 'Rosado', baseColorValue: '#ffc0cb', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'Dominican Logo Pink', descEn: 'Pink T-shirt', nameFr: 'Logo Dominicain Rose', descFr: 'T-shirt Rose' },
    { name: 'Logo Blanco Rojo Claro', description: 'T-shirt rojo claro', logoStyle: 'classic', baseColorName: 'Rojo Claro', baseColorValue: '#ff4c4c', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'White Logo Light Red', descEn: 'Light Red T-shirt', nameFr: 'Logo Blanc Rouge Clair', descFr: 'T-shirt Rouge Clair' },
    { name: 'Logo Naranja Neon Gris Oscuro', description: 'T-shirt gris oscuro', logoStyle: 'classic', baseColorName: 'Gris Oscuro', baseColorValue: '#a9a9a9', defaultLogoColor: '#ff5f1f', isVisible: true, nameEn: 'Neon Orange Logo Dark Gray', descEn: 'Dark Gray T-shirt', nameFr: 'Logo Orange Néon Gris Foncé', descFr: 'T-shirt Gris Foncé' },
    { name: 'Logo Mostaza Blanco', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#ffdb58', isVisible: true, nameEn: 'Mustard Logo White', descEn: 'White T-shirt', nameFr: 'Logo Moutarde Blanc', descFr: 'T-shirt Blanc' },
    { name: 'Logo Azul Turquesa Negro', description: 'T-shirt negro', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#40e0d0', isVisible: true, nameEn: 'Turquoise Blue Logo Black', descEn: 'Black T-shirt', nameFr: 'Logo Bleu Turquoise Noir', descFr: 'T-shirt Noir' },
    { name: 'Logo Azul Casi Negro', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#00008b', isVisible: true, nameEn: 'Almost Black Blue Logo White', descEn: 'White T-shirt', nameFr: 'Logo Bleu Presque Noir Blanc', descFr: 'T-shirt Blanc' },
    { name: 'Logo Azul Blanco', description: 'T-shirt blanco', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#0000ff', isVisible: true, nameEn: 'Blue Logo White', descEn: 'White T-shirt', nameFr: 'Logo Bleu Blanc', descFr: 'T-shirt Blanc' },
    { name: 'Logo Blanco Mostaza', description: 'T-shirt mostaza', logoStyle: 'classic', baseColorName: 'Mostaza', baseColorValue: '#ffdb58', defaultLogoColor: '#ffffff', isVisible: true, nameEn: 'White Logo Mustard', descEn: 'Mustard T-shirt', nameFr: 'Logo Blanc Moutarde', descFr: 'T-shirt Moutarde' },
    { name: 'Logo Azul Turquesa Azul Oscuro', description: 'T-shirt azul oscuro', logoStyle: 'classic', baseColorName: 'Azul Oscuro', baseColorValue: '#00008b', defaultLogoColor: '#40e0d0', isVisible: true, nameEn: 'Turquoise Blue Logo Dark Blue', descEn: 'Dark Blue T-shirt', nameFr: 'Logo Bleu Turquoise Bleu Foncé', descFr: 'T-shirt Bleu Foncé' },
    { name: 'Logo Azul Oscuro Gris Claro', description: 'T-shirt gris claro', logoStyle: 'classic', baseColorName: 'Gris Claro', baseColorValue: '#d3d3d3', defaultLogoColor: '#00008b', isVisible: true, nameEn: 'Dark Blue Logo Light Gray', descEn: 'Light Gray T-shirt', nameFr: 'Logo Bleu Foncé Gris Clair', descFr: 'T-shirt Gris Clair' }
];

async function seed() {
    try {
        console.log("Seeding brands...");
        // Clear all brands first or just add?
        const currentBrands = await databases.listDocuments(databaseId, brandsCollectionId);
        for (const brand of currentBrands.documents) {
            await databases.deleteDocument(databaseId, brandsCollectionId, brand.$id);
        }
        for (const brand of BRANDS) {
            await databases.createDocument(databaseId, brandsCollectionId, ID.unique(), {
                id: ID.unique(),
                name: brand.name,
                logo: brand.logo,
                isVisible: brand.isVisible
            });
            console.log(`Brand ${brand.name} added`);
        }

        console.log("Seeding presets...");
        const currentPresets = await databases.listDocuments(databaseId, presetsCollectionId);
        for (const preset of currentPresets.documents) {
            await databases.deleteDocument(databaseId, presetsCollectionId, preset.$id);
        }
        for (const preset of PRESETS) {
            await databases.createDocument(databaseId, presetsCollectionId, ID.unique(), {
                id: ID.unique(),
                ...preset
            });
            console.log(`Preset ${preset.name} added`);
        }
        console.log("Seeding done.");
    } catch (e) {
        console.error(e);
    }
}
seed();
