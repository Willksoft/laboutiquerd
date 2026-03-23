import { BraidModel, BraidService, Offer, Product, LogoStyle, TShirtPreset } from "./types";

export const OFFERS: Offer[] = [
  {
    id: '0', // New first slide
    title: 'Gift Cards',
    subtitle: 'Regala momentos inolvidables. Desde RD$2,500.',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1000', // Generic gift aesthetic
    discount: ''
  },
  {
    id: '1',
    title: 'Larimar Day',
    subtitle: '30% OFF en Artesanía',
    image: 'https://images.unsplash.com/photo-1434389670869-c6e4604f44cb?auto=format&fit=crop&q=80&w=400',
    discount: '30%'
  },
  {
    id: '2',
    title: 'Pack Verano',
    subtitle: 'Compra 4 T-Shirts y paga 3',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=400',
    discount: '4x3'
  }
];

export const PRODUCTS: Product[] = [
  // --- CUSTOM ---

  {
    id: 'p2',
    name: 'T-Shirt Cotton',
    price: 300.00,
    originalPrice: 450.00,
    category: 'custom',
    image: '/products/tshirt.png',
    description: '100% Algodón, estampado duradero. Incluye hasta 2 zonas.',
    tags: ['Best Seller']
  },
  {
    id: 'p6',
    name: 'Gorra Trucker',
    price: 450.00,
    category: 'custom',
    image: '/products/gorra.png',
    description: 'Malla trasera transpirable. Frente acolchado ideal para logos.',
    tags: ['Nuevo']
  },
  {
    id: 'p7',
    name: 'Mochila Urbana',
    price: 1250.00,
    category: 'custom',
    image: '/products/mochila.png',
    description: 'Diseño resistente y espacioso. Perfecta para laptop y uso diario.',
  },
  {
    id: 'p8',
    name: 'Termo Acero 20oz',
    price: 850.00,
    category: 'custom',
    image: '/products/termo.png',
    description: 'Doble pared térmica. Mantiene bebidas frías por 24h o calientes por 12h.',
  },

  // --- TOYS (JUGUETES) ---
  {
    id: 'toy1',
    name: 'Tortuga de Peluche',
    price: 1200.00,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
    description: 'Peluche suave hipoalergénico. Mascota oficial del Club.',
    tags: ['Club Favorite']
  },
  {
    id: 'toy2',
    name: 'Set de Playa Eco',
    price: 950.00,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400',
    description: 'Cubo, pala y moldes hechos de plástico reciclado del océano.',
    tags: ['Eco-Friendly']
  },
  {
    id: 'toy3',
    name: 'Pistola de Agua',
    price: 450.00,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&q=80&w=400',
    description: 'Diversión asegurada en la piscina. Alcance de 5 metros.',
  },
  {
    id: 'toy4',
    name: 'Dominó Dominicano',
    price: 1500.00,
    category: 'toys',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400',
    description: 'Caja de madera tallada a mano. Fichas de alta calidad.',
    tags: ['Familiar']
  },

  // --- GIFT CARDS (Informational) ---
  {
    id: 'gc-decouverte',
    name: 'Découverte',
    price: 2500.00,
    category: 'gift-card',
    image: '', 
    description: 'La opción perfecta para un detalle especial.',
    tags: ['RD$2,500']
  },
  {
    id: 'gc-essentielle',
    name: 'Essentielle',
    price: 5000.00,
    category: 'gift-card',
    image: '', 
    description: 'El equilibrio ideal para disfrutar de la boutique.',
    tags: ['RD$5,000']
  },
  {
    id: 'gc-premium',
    name: 'Premium',
    price: 10000.00,
    category: 'gift-card',
    image: '', 
    description: 'Una experiencia de compra superior.',
    tags: ['RD$10,000']
  },
  {
    id: 'gc-prestige',
    name: 'Prestige',
    price: 15000.00,
    category: 'gift-card',
    image: '', 
    description: 'Lujo y libertad sin límites.',
    tags: ['RD$15,000']
  },

  // --- PERSONAL CARE ---
  {
    id: 'pc1',
    name: 'Protector Solar Orgánico SPF 50',
    price: 850.00,
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400',
    description: 'Protección natural biodegradable. Ideal para arrecifes.',
    tags: ['Eco-Friendly']
  },
  {
    id: 'pc2',
    name: 'Aceite de Coco Puro',
    price: 450.00,
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    description: 'Hidratación profunda para piel y cabello. Prensado en frío.',
  },
  {
    id: 'pc3',
    name: 'Jabón Artesanal de Avena',
    price: 200.00,
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&q=80&w=400',
    description: 'Exfoliante suave hecho a mano. Sin parabenos.',
  },
  {
    id: 'pc4',
    name: 'Gel de Aloe Vera',
    price: 350.00,
    category: 'personal-care',
    image: 'https://images.unsplash.com/photo-1618932260643-ee819ee911eb?auto=format&fit=crop&q=80&w=400',
    description: 'Alivio refrescante post-sol. 99% Aloe natural.',
    tags: ['Esencial']
  },

  // --- BISUTERÍA (Accesorios para Trenzas y Casual) ---
  {
    id: 'bi1',
    name: 'Set de Beads Dorados',
    price: 250.00,
    category: 'bisuteria',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400', // Using bracelet img as placeholder
    description: 'Paquete de 20 aros dorados ajustables para decorar tus trenzas.',
    tags: ['Para Trenzas']
  },
  {
    id: 'bi2',
    name: 'Cuffs de Madera',
    price: 300.00,
    category: 'bisuteria',
    image: 'https://images.unsplash.com/photo-1550639525-c97d455bfcce?auto=format&fit=crop&q=80&w=400', // Using bead-like placeholder
    description: 'Cuentas de madera natural pintadas a mano.',
    tags: ['Estilo Afro']
  },
  {
    id: 'bi3',
    name: 'Tobillera de Hilo',
    price: 150.00,
    category: 'bisuteria',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    description: 'Tobillera tejida resistente al agua salada.',
  },
  {
    id: 'bi4',
    name: 'Aretes de Coco',
    price: 350.00,
    category: 'bisuteria',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400',
    description: 'Aretes ligeros hechos de cáscara de coco pulida.',
  },

  // --- FINE JEWELRY (Alta Joyería / Larimar) ---
  {
    id: 'p3',
    name: 'Collar Larimar Puro',
    price: 1200.00,
    originalPrice: 1500.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    description: 'Piedra semipreciosa dominicana auténtica con cadena de plata.',
    tags: ['Oferta']
  },
  {
    id: 'p10',
    name: 'Anillo Ola Marina',
    price: 850.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    description: 'Diseño inspirado en las olas del caribe. Plata 925.',
  },
  {
    id: 'p11',
    name: 'Pulsera Ámbar',
    price: 950.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    description: 'Ámbar auténtico con propiedades energéticas.',
  },
  {
    id: 'p18',
    name: 'Aretes Coral',
    price: 600.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400',
    description: 'Pequeños detalles en coral rojo.',
  },
  {
    id: 'jw5',
    name: 'Anillo Larimar Corazón',
    price: 1800.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=400',
    description: 'Piedra larimar tallada en corazón montada en plata 925. Pieza única.',
    tags: ['Exclusivo']
  },
  {
    id: 'jw6',
    name: 'Collar Perlas de Mar',
    price: 2200.00,
    originalPrice: 2800.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    description: 'Perlas cultivadas de agua dulce con broche de oro 14k.',
    tags: ['Oferta']
  },
  {
    id: 'jw7',
    name: 'Pulsera Cadena de Plata',
    price: 750.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=400',
    description: 'Cadena eslabones de plata 925 con cierre de seguridad.',
  },
  {
    id: 'jw8',
    name: 'Aretes Larimar Gota',
    price: 1400.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=400',
    description: 'Larimar en forma de gota con marco de plata filigrana.',
    tags: ['Best Seller']
  },
  {
    id: 'jw9',
    name: 'Brazalete Ámbar Dominicano',
    price: 3500.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=400',
    description: 'Ámbar azul dominicano genuino. Pieza de colección con certificado.',
    tags: ['Premium']
  },
  {
    id: 'jw10',
    name: 'Set Aretes + Collar Plata',
    price: 2800.00,
    originalPrice: 3400.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    description: 'Conjunto elegante de aretes y collar en plata 925 con zirconia.',
    tags: ['Set']
  },
  {
    id: 'jw11',
    name: 'Anillo Solitario Oro Rosa',
    price: 4200.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=400',
    description: 'Oro rosa 18k con piedra central de cuarzo rosa. Romántico y moderno.',
    tags: ['Premium']
  },
  {
    id: 'jw12',
    name: 'Tobillera Plata Estrella de Mar',
    price: 550.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400',
    description: 'Cadena fina con charm de estrella de mar. Perfecta para la playa.',
  },
  {
    id: 'jw13',
    name: 'Pendiente Perla Barroca',
    price: 1600.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=400',
    description: 'Perla barroca natural con gancho de oro 14k. Cada pieza es única.',
    tags: ['Artesanal']
  },
  {
    id: 'jw14',
    name: 'Cadena Oro Vermeil 18"',
    price: 3200.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=400',
    description: 'Cadena de plata con baño de oro 18k. Grosor ideal para diario.',
  },
  {
    id: 'jw15',
    name: 'Charm Tridente Boutique',
    price: 900.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=400',
    description: 'Charm exclusivo del tridente de la Boutique en plata 925.',
    tags: ['Exclusivo']
  },
  {
    id: 'jw16',
    name: 'Reloj Artesanal Larimar',
    price: 5800.00,
    category: 'jewelry',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400',
    description: 'Reloj con esfera de larimar genuino y correa de cuero. Edición limitada.',
    tags: ['Edición Limitada']
  },

  // --- CRAFTS ---
  {
    id: 'p4',
    name: 'Bolso Artesanal',
    price: 850.00,
    category: 'crafts',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400',
    description: 'Tejido a mano por artesanos locales con fibras naturales.',
  },
  {
    id: 'p14',
    name: 'Tortuga Tallada',
    price: 450.00,
    category: 'crafts',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=400',
    description: 'Madera de Guayacán tallada a mano.',
    tags: ['Popular']
  },
  {
    id: 'p15',
    name: 'Cuadro "Vida Caribe"',
    price: 2500.00,
    category: 'crafts',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
    description: 'Acrílico sobre lienzo. Artista local.',
  },
  {
    id: 'p17',
    name: 'Maceta de Barro',
    price: 350.00,
    category: 'crafts',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=400',
    description: 'Pintada a mano con motivos taínos.',
  },

  // --- BOUTIQUE PUNTA CANA (Premium / General) ---
  {
    id: 'p5',
    name: 'Maxi Vestido Tropical',
    price: 2500.00,
    originalPrice: 3200.00,
    category: 'boutique-pc',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=400',
    description: 'Elegancia para tus noches en el resort. Tela fresca y caída suave.',
    tags: ['Exclusivo']
  },
  {
    id: 'p20',
    name: 'Conjunto Lino Premium',
    price: 3800.00,
    category: 'boutique-pc',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=400',
    description: 'Set de dos piezas en lino italiano. Sofisticación caribeña.',
  },
  {
    id: 'p21',
    name: 'Blazer Casual Blanco',
    price: 4500.00,
    category: 'boutique-pc',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=400',
    description: 'El complemento perfecto para una cena elegante frente al mar.',
  },
  {
    id: 'p22',
    name: 'Bolso de Diseñador',
    price: 5500.00,
    category: 'boutique-pc',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
    description: 'Cuero genuino importado. Detalles en dorado.',
  },

  // --- BOUTIQUE MICHES (Casual / Local / Boho) ---
  {
    id: 'p12',
    name: 'Camisa Guayabera Modern',
    price: 1800.00,
    category: 'boutique-miches',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400',
    description: 'Reinterpretación de la clásica guayabera. Fresca y versátil.',
    tags: ['Local']
  },
  {
    id: 'p23',
    name: 'Vestido Boho Chic',
    price: 1600.00,
    category: 'boutique-miches',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=400',
    description: 'Estilo bohemio relajado, ideal para caminar por el pueblo.',
  },
  {
    id: 'p24',
    name: 'Pantalón Palazzo',
    price: 1400.00,
    category: 'boutique-miches',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&q=80&w=400',
    description: 'Comodidad y movimiento. Estampados inspirados en la naturaleza.',
  },
  {
    id: 'p25',
    name: 'Top Tejido Crochet',
    price: 950.00,
    category: 'boutique-miches',
    image: 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&q=80&w=400',
    description: 'Hecho a mano. Detalles únicos en cada pieza.',
  },

  // --- BOUTIQUE PLAYA PUNTA CANA (Beachwear) ---
  {
    id: 'p13',
    name: 'Sombrero Panamá',
    price: 900.00,
    category: 'boutique-beach',
    image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?auto=format&fit=crop&q=80&w=400',
    description: 'Protección solar con estilo clásico. Ala ancha.',
    tags: ['Esencial']
  },
  {
    id: 'p16',
    name: 'Sandalias Piel',
    price: 1200.00,
    originalPrice: 1600.00,
    category: 'boutique-beach',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400',
    description: 'Cuero genuino, hechas a mano para caminar en la arena.',
    tags: ['Oferta']
  },
  {
    id: 'p26',
    name: 'Bikini Tropical Print',
    price: 1800.00,
    category: 'boutique-beach',
    image: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?auto=format&fit=crop&q=80&w=400',
    description: 'Colores vibrantes que resaltan tu bronceado.',
  },
  {
    id: 'p27',
    name: 'Pareo Seda',
    price: 750.00,
    category: 'boutique-beach',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=400',
    description: 'Versátil: úsalo como vestido, falda o accesorio.',
  }
];

export const BRAID_MODELS = [
  { id: 'm1', name: 'Modelo 01', image: 'https://laboutiquerd.com/trenzas/trenzas%20(1).jpeg' },
  { id: 'm2', name: 'Modelo 02', image: 'https://laboutiquerd.com/trenzas/trenzas%20(2).jpeg' },
  { id: 'm3', name: 'Modelo 03', image: 'https://laboutiquerd.com/trenzas/trenzas%20(3).jpeg' },
  { id: 'm4', name: 'Modelo 04', image: 'https://laboutiquerd.com/trenzas/trenzas%20(4).jpeg' },
  { id: 'm5', name: 'Modelo 05', image: 'https://laboutiquerd.com/trenzas/trenzas%20(5).jpeg' },
  { id: 'm6', name: 'Modelo 06', image: 'https://laboutiquerd.com/trenzas/trenzas%20(6).jpeg' },
  { id: 'm7', name: 'Modelo 07', image: 'https://laboutiquerd.com/trenzas/trenzas%20(7).jpeg' },
  { id: 'm8', name: 'Modelo 08', image: 'https://laboutiquerd.com/trenzas/trenzas%20(8).jpeg' },
  { id: 'm9', name: 'Modelo 09', image: 'https://laboutiquerd.com/trenzas/trenzas%20(9).jpeg' },
  { id: 'm10', name: 'Modelo 10', image: 'https://laboutiquerd.com/trenzas/trenzas%20(10).jpeg' },
  { id: 'm11', name: 'Modelo 11', image: 'https://laboutiquerd.com/trenzas/trenzas%20(11).jpeg' },
  { id: 'm12', name: 'Modelo 12', image: 'https://laboutiquerd.com/trenzas/trenzas%20(12).jpeg' }
];

export const BRAID_SERVICES = [
  { id: 's1', name: 'Tresse sans cheveux (Sin extensiones)', price: 250 },
  { id: 's2', name: 'Tresse avec cheveux (Con extensiones)', price: 350 },
  { id: 's3', name: 'Tresse avec perles (Con perlas)', price: 350 },
  { id: 's4', name: 'Tresse avec cheveux + perles', price: 450 },
  { id: 's5', name: 'Natte sans cheveux (Sin extensiones)', price: 450 },
  { id: 's6', name: 'Natte avec cheveux (Con extensiones)', price: 600 },
  { id: 's7', name: 'Natte avec perles (Con perlas)', price: 700 },
  { id: 's8', name: 'Natte avec perles + cheveux', price: 800 },
  { id: 's9', name: 'Demi Natte sans cheveux', price: 300 },
  { id: 's10', name: 'Demi Natte avec cheveux', price: 450 },
  { id: 's11', name: 'Demi Natte avec perles', price: 550 },
  { id: 's12', name: 'Demi Natte avec perles + cheveux', price: 700 },
  { id: 'acc1', name: 'Accessoires (x3)', price: 50 },
];


export const MODEL_STYLES: { id: LogoStyle; label: string; desc: string; img: string }[] = [
  { 
    id: 'classic', 
    label: '45 Clásico', 
    desc: 'Logo monocolor adaptable. Diseño elegante con contorno o sólido.',
    img: '/logos/45_classic_front.svg'
  },
  {
    id: 'dominican',
    label: '45 Dominicano',
    desc: 'Edición Especial Bandera. Con mapa de RD y colores patrios.',
    img: '/logos/45_dominican_front.svg'
  }
];

export const TSHIRT_PRESETS: TShirtPreset[] = [
  // 24 custom items mentioned by user
  { id: 'p-1', name: 'Logo Rosado - t shirt turqueza osucro', description: 'T-Shirt Turquesa Oscuro con Logo Rosado', logoStyle: 'classic', baseColorName: 'Turquesa Oscuro', baseColorValue: '#0f766e', defaultLogoColor: '#db2777', nameEn: 'Pink Logo - dark turquoise t shirt', nameFr: 'Logo Rose - t shirt turquoise foncé' },
  { id: 'p-2', name: 'logo amarillo - t shirt turqueza osucro', description: 'T-Shirt Turquesa Oscuro con Logo Amarillo', logoStyle: 'classic', baseColorName: 'Turquesa Oscuro', baseColorValue: '#0f766e', defaultLogoColor: '#eab308', nameEn: 'Yellow Logo - dark turquoise t shirt', nameFr: 'Logo Jaune - t shirt turquoise foncé' },
  { id: 'p-3', name: 'Logo Verde Neon - t shirt negro', description: 'T-Shirt Negro con Logo Verde Neón', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#39ff14', nameEn: 'Neon Green Logo - black t shirt', nameFr: 'Logo Vert Néon - t shirt noir' },
  { id: 'p-4', name: 'Logo Verde Neon - t shirt blanco', description: 'T-Shirt Blanco con Logo Verde Neón', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#39ff14', nameEn: 'Neon Green Logo - white t shirt', nameFr: 'Logo Vert Néon - t shirt blanc' },
  { id: 'p-5', name: 'Logo Naranja Neon - t shirt negro', description: 'T-Shirt Negro con Logo Naranja Neón', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#ff6700', nameEn: 'Neon Orange Logo - black t shirt', nameFr: 'Logo Orange Néon - t shirt noir' },
  { id: 'p-6', name: 'Logo Verde - t shirt gris', description: 'T-Shirt Gris con Logo Verde', logoStyle: 'classic', baseColorName: 'Gris', baseColorValue: '#9ca3af', defaultLogoColor: '#22c55e', nameEn: 'Green Logo - grey t shirt', nameFr: 'Logo Vert - t shirt gris' },
  { id: 'p-7', name: 'Logo blanco - t shirt rosado', description: 'T-Shirt Rosado con Logo Blanco', logoStyle: 'classic', baseColorName: 'Rosado', baseColorValue: '#f472b6', defaultLogoColor: '#ffffff', nameEn: 'White Logo - pink t shirt', nameFr: 'Logo Blanc - t shirt rose' },
  { id: 'p-8', name: 'logo rojo vino - t shirt blanco', description: 'T-Shirt Blanco con Logo Rojo Vino', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#831843', nameEn: 'Wine Red Logo - white t shirt', nameFr: 'Logo Rouge Vin - t shirt blanc' },
  { id: 'p-9', name: 'logo blanco t shirt azul cielo', description: 'T-Shirt Azul Cielo con Logo Blanco', logoStyle: 'classic', baseColorName: 'Azul Cielo', baseColorValue: '#38bdf8', defaultLogoColor: '#ffffff', nameEn: 'White Logo sky blue t shirt', nameFr: 'Logo Blanc t shirt bleu ciel' },
  { id: 'p-10', name: 'logo dominicano - t shirt azul osucro', description: 'T-Shirt Azul Oscuro con Logo Dominicano', logoStyle: 'dominican', baseColorName: 'Azul Oscuro', baseColorValue: '#1e3a8a', defaultLogoColor: '#ffffff', nameEn: 'Dominican logo - dark blue t shirt', nameFr: 'Logo Dominicain - t shirt bleu foncé' },
  { id: 'p-11', name: 'logo dorado - t shirt negro', description: 'T-Shirt Negro con Logo Dorado', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#d4af37', nameEn: 'Gold logo - black t shirt', nameFr: 'Logo Or - t shirt noir' },
  { id: 'p-12', name: 'logo azul claro metalico - t shirt negro', description: 'T-Shirt Negro con Logo Azul Claro Metálico', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#93c5fd', nameEn: 'Metallic light blue logo - black t shirt', nameFr: 'Logo bleu clair métallique - t shirt noir' },
  { id: 'p-13', name: 'logo azul claro metalico - t shirt blanco', description: 'T-Shirt Blanco con Logo Azul Claro Metálico', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#93c5fd', nameEn: 'Metallic light blue logo - white t shirt', nameFr: 'Logo bleu clair métallique - t shirt blanc' },
  { id: 'p-14', name: 'logo plateado - t shirt blanco', description: 'T-Shirt Blanco con Logo Plateado', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#c0c0c0', nameEn: 'Silver logo - white t shirt', nameFr: 'Logo argent - t shirt blanc' },
  { id: 'p-15', name: 'logo dominicano - t shirt rosado', description: 'T-Shirt Rosado con Logo Dominicano', logoStyle: 'dominican', baseColorName: 'Rosado', baseColorValue: '#f472b6', defaultLogoColor: '#ffffff', nameEn: 'Dominican logo - pink t shirt', nameFr: 'Logo Dominicain - t shirt rose' },
  { id: 'p-16', name: 'logo blanco t shirt - rojo claro', description: 'T-Shirt Rojo Claro con Logo Blanco', logoStyle: 'classic', baseColorName: 'Rojo Claro', baseColorValue: '#f87171', defaultLogoColor: '#ffffff', nameEn: 'White logo t shirt - light red', nameFr: 'Logo blanc t shirt - rouge clair' },
  { id: 'p-17', name: 'logo naranja neon t shirt griss oscuro', description: 'T-Shirt Gris Oscuro con Logo Naranja Neón', logoStyle: 'classic', baseColorName: 'Gris Oscuro', baseColorValue: '#4b5563', defaultLogoColor: '#ff6700', nameEn: 'Neon orange logo dark grey t shirt', nameFr: 'Logo orange néon t shirt gris foncé' },
  { id: 'p-18', name: 'logo mostaza - t shirt blanco', description: 'T-Shirt Blanco con Logo Mostaza', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#eab308', nameEn: 'Mustard logo - white t shirt', nameFr: 'Logo moutarde - t shirt blanc' },
  { id: 'p-19', name: 'logo azul turqueza t shirt negro', description: 'T-Shirt Negro con Logo Azul Turquesa', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#000000', defaultLogoColor: '#06b6d4', nameEn: 'Turquoise blue logo black t shirt', nameFr: 'Logo bleu turquoise t shirt noir' },
  { id: 'p-20', name: 'logo azul casi negro - t shirt blanco', description: 'T-Shirt Blanco con Logo Azul Casi Negro', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#0f172a', nameEn: 'Almost black blue logo - white t shirt', nameFr: 'Logo bleu presque noir - t shirt blanc' },
  { id: 'p-21', name: 'logo azul - t shirt blanco', description: 'T-Shirt Blanco con Logo Azul', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#3b82f6', nameEn: 'Blue logo - white t shirt', nameFr: 'Logo bleu - t shirt blanc' },
  { id: 'p-22', name: 'logo blanco - t shirt mozatasa', description: 'T-Shirt Mostaza con Logo Blanco', logoStyle: 'classic', baseColorName: 'Mostaza', baseColorValue: '#ca8a04', defaultLogoColor: '#ffffff', nameEn: 'White logo - mustard t shirt', nameFr: 'Logo blanc - t shirt moutarde' },
  { id: 'p-23', name: 'logo azul turquesa- t shirt azul oscuro', description: 'T-Shirt Azul Oscuro con Logo Azul Turquesa', logoStyle: 'classic', baseColorName: 'Azul Oscuro', baseColorValue: '#1e3a8a', defaultLogoColor: '#06b6d4', nameEn: 'Turquoise blue logo - dark blue t shirt', nameFr: 'Logo bleu turquoise - t shirt bleu foncé' },
  { id: 'p-24', name: 'logo azul osucro - t shirt gris claro', description: 'T-Shirt Gris Claro con Logo Azul Oscuro', logoStyle: 'classic', baseColorName: 'Gris Claro', baseColorValue: '#d1d5db', defaultLogoColor: '#1e3a8a', nameEn: 'Dark blue logo - light grey t shirt', nameFr: 'Logo bleu foncé - t shirt gris clair' },

  // Let's add the core standard ones so it's not totally empty from before
  { id: 'classic-black-gold', name: 'Black & Gold Luxury', description: 'Elegancia atemporal. Logo dorado', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#1a1a1a', defaultLogoColor: '#ca8a04', tags: ['Best Seller'] },
  { id: 'classic-white-black', name: 'Minimalist White', description: 'Limpio y versátil. El básico.', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#000000', tags: ['Esencial'] },
];

export const BRANDS = [
  { id: 'b1', name: '45', fontClass: 'font-bold tracking-widest text-[#4A3D2A]' },
  { id: 'b2', name: 'Collection Club Med', fontClass: 'font-serif font-bold tracking-widest text-brand-primary' },
  { id: 'b3', name: 'Quiksilver', fontClass: 'font-sans font-black tracking-tighter text-red-600' },
  { id: 'b4', name: 'Billabong', fontClass: 'font-sans font-bold italic tracking-wide text-gray-800' },
  { id: 'b5', name: 'Vilebrequin', fontClass: 'font-sans font-black uppercase tracking-wide text-blue-900' },
  { id: 'b6', name: 'Sundek', fontClass: 'font-sans font-bold text-orange-500 uppercase' },
  { id: 'b7', name: 'Banana Moon', fontClass: 'font-cursive text-2xl md:text-3xl text-pink-500' },
  { id: 'b8', name: 'Havaianas', fontClass: 'font-sans font-black text-yellow-500 tracking-wider' },
  { id: 'b9', name: 'Livia', fontClass: 'font-serif italic font-bold text-gray-700' },
  { id: 'b10', name: 'Carbon', fontClass: 'font-mono font-bold uppercase tracking-tighter text-gray-900' },
  { id: 'b11', name: 'Happy & So', fontClass: 'font-handwriting text-xl font-bold text-purple-900' },
  { id: 'b12', name: 'Gold & Silver', fontClass: 'font-serif font-bold text-yellow-600' },
  { id: 'b13', name: 'Kreoli Bijoux', fontClass: 'font-sans font-light tracking-[0.2em] uppercase text-gray-800' },
  { id: 'b14', name: 'Cacatoès', fontClass: 'font-sans font-black uppercase text-green-600' },
  { id: 'b15', name: 'Hipanema', fontClass: 'font-serif font-bold text-red-500 tracking-wider' }
];
