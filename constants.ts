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
  { id: 'm1', name: 'Modelo 01', image: '/trenzas/trenzas (1).jpeg' },
  { id: 'm2', name: 'Modelo 02', image: '/trenzas/trenzas (2).jpeg' },
  { id: 'm3', name: 'Modelo 03', image: '/trenzas/trenzas (3).jpeg' },
  { id: 'm4', name: 'Modelo 04', image: '/trenzas/trenzas (4).jpeg' },
  { id: 'm5', name: 'Modelo 05', image: '/trenzas/trenzas (5).jpeg' },
  { id: 'm6', name: 'Modelo 06', image: '/trenzas/trenzas (6).jpeg' },
  { id: 'm7', name: 'Modelo 07', image: '/trenzas/trenzas (7).jpeg' },
  { id: 'm8', name: 'Modelo 08', image: '/trenzas/trenzas (8).jpeg' },
  { id: 'm9', name: 'Modelo 09', image: '/trenzas/trenzas (9).jpeg' },
  { id: 'm10', name: 'Modelo 10', image: '/trenzas/trenzas (10).jpeg' },
  { id: 'm11', name: 'Modelo 11', image: '/trenzas/trenzas (11).jpeg' },
  { id: 'm12', name: 'Modelo 12', image: '/trenzas/trenzas (12).jpeg' }
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
  // --- COLECCIÓN CLÁSICA & BEST SELLERS ---
  {
    id: 'classic-black-gold',
    name: 'Black & Gold Luxury',
    description: 'Elegancia atemporal. Logo dorado sobre fondo negro profundo.',
    logoStyle: 'classic',
    baseColorName: 'Negro',
    baseColorValue: '#1a1a1a',
    defaultLogoColor: '#ca8a04',
    tags: ['Best Seller']
  },
  {
    id: 'classic-white-black',
    name: 'Minimalist White',
    description: 'Limpio y versátil. El básico que no puede faltar.',
    logoStyle: 'classic',
    baseColorName: 'Blanco',
    baseColorValue: '#ffffff',
    defaultLogoColor: '#000000',
    tags: ['Esencial']
  },
  {
    id: 'classic-navy-silver',
    name: 'Navy Silver',
    description: 'Azul marino con detalles en plata. Seriedad y estilo.',
    logoStyle: 'classic',
    baseColorName: 'Azul Marino',
    baseColorValue: '#1e3a8a',
    defaultLogoColor: '#94a3b8',
  },
  {
    id: 'classic-red-white',
    name: 'Red Impact',
    description: 'Rojo vibrante con logo blanco. Imposible de ignorar.',
    logoStyle: 'classic',
    baseColorName: 'Rojo',
    baseColorValue: '#ef4444',
    defaultLogoColor: '#ffffff',
  },
  {
    id: 'classic-charcoal-black',
    name: 'Urban Charcoal',
    description: 'Gris carbón con logo negro. Estilo urbano discreto.',
    logoStyle: 'classic',
    baseColorName: 'Carbón',
    baseColorValue: '#374151',
    defaultLogoColor: '#000000',
  },

  // --- COLECCIÓN NEÓN (Club & Party) ---
  {
    id: 'neon-black-green',
    name: 'Toxic Night',
    description: 'Negro con Verde Neón. Perfecto para la noche.',
    logoStyle: 'classic',
    baseColorName: 'Negro',
    baseColorValue: '#1a1a1a',
    defaultLogoColor: '#a3e635',
    tags: ['Neón']
  },
  {
    id: 'neon-black-pink',
    name: 'Cyber Pink',
    description: 'Contraste alto: Negro con Rosa Neón.',
    logoStyle: 'classic',
    baseColorName: 'Negro',
    baseColorValue: '#1a1a1a',
    defaultLogoColor: '#ec4899',
    tags: ['Neón']
  },
  {
    id: 'neon-white-orange',
    name: 'Summer Orange',
    description: 'Blanco fresco con Naranja Neón.',
    logoStyle: 'classic',
    baseColorName: 'Blanco',
    baseColorValue: '#ffffff',
    defaultLogoColor: '#f97316',
    tags: ['Neón']
  },
  {
    id: 'neon-blue-lime',
    name: 'Electric Blue',
    description: 'Azul Royal con Verde Lima. Explosión de color.',
    logoStyle: 'classic',
    baseColorName: 'Azul Royal',
    baseColorValue: '#2563eb',
    defaultLogoColor: '#a3e635',
  },
  {
    id: 'neon-purple-yellow',
    name: 'Lakers Vibe',
    description: 'Lila con Amarillo Neón. Combinación complementaria.',
    logoStyle: 'classic',
    baseColorName: 'Lila',
    baseColorValue: '#d8b4fe',
    defaultLogoColor: '#facc15',
  },

  // --- COLECCIÓN DOMINICANA (Bandera) ---
  {
    id: 'dom-white',
    name: 'Orgullo Patrio (Blanco)',
    description: 'Camiseta blanca con el logo de la bandera dominicana.',
    logoStyle: 'dominican',
    baseColorName: 'Blanco',
    baseColorValue: '#ffffff',
    tags: ['Dominican']
  },
  {
    id: 'dom-black',
    name: 'Orgullo Patrio (Negro)',
    description: 'El escudo resalta increíblemente sobre negro.',
    logoStyle: 'dominican',
    baseColorName: 'Negro',
    baseColorValue: '#1a1a1a',
    tags: ['Dominican']
  },
  {
    id: 'dom-blue',
    name: 'Azul Quisqueya',
    description: 'Tono sobre tono con los colores de la bandera.',
    logoStyle: 'dominican',
    baseColorName: 'Azul Royal',
    baseColorValue: '#2563eb',
    tags: ['Dominican']
  },
  {
    id: 'dom-red',
    name: 'Rojo Pasión',
    description: 'Fuerza y patriotismo en rojo intenso.',
    logoStyle: 'dominican',
    baseColorName: 'Rojo',
    baseColorValue: '#ef4444',
  },
  {
    id: 'dom-grey',
    name: 'Gris Urbano RD',
    description: 'Estilo callejero con toque dominicano.',
    logoStyle: 'dominican',
    baseColorName: 'Gris',
    baseColorValue: '#9ca3af',
  },

  // --- COLECCIÓN PASTEL (Soft & Cute) ---
  {
    id: 'pastel-pink-white',
    name: 'Cotton Candy',
    description: 'Rosa suave con logo blanco. Dulce y delicado.',
    logoStyle: 'classic',
    baseColorName: 'Rosa',
    baseColorValue: '#ec4899',
    defaultLogoColor: '#ffffff',
    tags: ['Pastel']
  },
  {
    id: 'pastel-mint-grey',
    name: 'Fresh Mint',
    description: 'Verde menta con logo gris. Frescura total.',
    logoStyle: 'classic',
    baseColorName: 'Menta',
    baseColorValue: '#6ee7b7',
    defaultLogoColor: '#374151',
    tags: ['Pastel']
  },
  {
    id: 'pastel-sky-blue',
    name: 'Sky Dreams',
    description: 'Azul cielo con logo blanco. Como un día de verano.',
    logoStyle: 'classic',
    baseColorName: 'Azul Cielo',
    baseColorValue: '#bae6fd',
    defaultLogoColor: '#ffffff',
  },
  {
    id: 'pastel-yellow-black',
    name: 'Banana Pop',
    description: 'Amarillo suave con contraste negro.',
    logoStyle: 'classic',
    baseColorName: 'Amarillo',
    baseColorValue: '#facc15',
    defaultLogoColor: '#000000',
  },
  {
    id: 'pastel-lilac-white',
    name: 'Lavender Love',
    description: 'Lila suave con logo blanco minimalista.',
    logoStyle: 'classic',
    baseColorName: 'Lila',
    baseColorValue: '#d8b4fe',
    defaultLogoColor: '#ffffff',
  },

  // --- COLECCIÓN DARK MODE (Tonos Oscuros) ---
  {
    id: 'dark-navy-gold',
    name: 'Royal Navy',
    description: 'Azul marino profundo con logo dorado.',
    logoStyle: 'classic',
    baseColorName: 'Azul Oscuro',
    baseColorValue: '#172554',
    defaultLogoColor: '#ca8a04',
  },
  {
    id: 'dark-wine-silver',
    name: 'Vino Tinto',
    description: 'Rojo vino elegante con logo plateado.',
    logoStyle: 'classic',
    baseColorName: 'Vino',
    baseColorValue: '#7f1d1d',
    defaultLogoColor: '#94a3b8',
  },
  {
    id: 'dark-olive-white',
    name: 'Military Style',
    description: 'Verde oliva con logo blanco. Estilo táctico.',
    logoStyle: 'classic',
    baseColorName: 'Oliva',
    baseColorValue: '#556b2f',
    defaultLogoColor: '#ffffff',
  },
  {
    id: 'dark-grey-black',
    name: 'Shadow Grey',
    description: 'Gris oscuro con logo negro. Stealth mode.',
    logoStyle: 'classic',
    baseColorName: 'Gris Oscuro',
    baseColorValue: '#374151',
    defaultLogoColor: '#000000',
  },
  {
    id: 'dark-turq-white',
    name: 'Ocean Depth',
    description: 'Turquesa oscuro con logo blanco brillante.',
    logoStyle: 'classic',
    baseColorName: 'Turquesa Oscuro',
    baseColorValue: '#0e7490',
    defaultLogoColor: '#ffffff',
  },

  // --- COLECCIÓN VIBRANTE (Tropical) ---
  {
    id: 'vib-turq-pink',
    name: 'Miami Vibe',
    description: 'Turquesa con logo rosa. Estilo retro 80s.',
    logoStyle: 'classic',
    baseColorName: 'Turquesa',
    baseColorValue: '#06b6d4',
    defaultLogoColor: '#ec4899',
  },
  {
    id: 'vib-orange-blue',
    name: 'Sunset Contrast',
    description: 'Naranja intenso con azul royal.',
    logoStyle: 'classic',
    baseColorName: 'Naranja',
    baseColorValue: '#f97316',
    defaultLogoColor: '#1e3a8a',
  },
  {
    id: 'vib-yellow-turq',
    name: 'Caribbean Sun',
    description: 'Amarillo con turquesa. Pura playa.',
    logoStyle: 'classic',
    baseColorName: 'Amarillo',
    baseColorValue: '#facc15',
    defaultLogoColor: '#06b6d4',
  },
  {
    id: 'vib-green-yellow',
    name: 'Brasil Core',
    description: 'Verde intenso con amarillo. Energía pura.',
    logoStyle: 'classic',
    baseColorName: 'Verde',
    baseColorValue: '#16a34a',
    defaultLogoColor: '#facc15',
  },
  {
    id: 'vib-coral-white',
    name: 'Living Coral',
    description: 'Coral vibrante con blanco.',
    logoStyle: 'classic',
    baseColorName: 'Coral',
    baseColorValue: '#fb7185',
    defaultLogoColor: '#ffffff',
  },

  // --- MÁS COMBINACIONES ---
  { id: 'mix-1', name: 'Arena & Negro', description: 'Tono tierra con logo fuerte.', logoStyle: 'classic', baseColorName: 'Arena', baseColorValue: '#d6d3d1', defaultLogoColor: '#000000' },
  { id: 'mix-2', name: 'Arena & Blanco', description: 'Tono tierra muy sutil.', logoStyle: 'classic', baseColorName: 'Arena', baseColorValue: '#d6d3d1', defaultLogoColor: '#ffffff' },
  { id: 'mix-3', name: 'Gris Claro & Azul', description: 'Deportivo clásico.', logoStyle: 'classic', baseColorName: 'Gris Claro', baseColorValue: '#e5e7eb', defaultLogoColor: '#1e3a8a' },
  { id: 'mix-4', name: 'Gris Claro & Rojo', description: 'Sporty Red.', logoStyle: 'classic', baseColorName: 'Gris Claro', baseColorValue: '#e5e7eb', defaultLogoColor: '#ef4444' },
  { id: 'mix-5', name: 'Blanco & Dorado', description: 'Lujo ligero.', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#ca8a04' },
  { id: 'mix-6', name: 'Blanco & Rosa', description: 'Femenino y sport.', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#ec4899' },
  { id: 'mix-7', name: 'Blanco & Turquesa', description: 'Clean Aqua.', logoStyle: 'classic', baseColorName: 'Blanco', baseColorValue: '#ffffff', defaultLogoColor: '#06b6d4' },
  { id: 'mix-8', name: 'Negro & Plateado', description: 'Futurista.', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#1a1a1a', defaultLogoColor: '#94a3b8' },
  { id: 'mix-9', name: 'Negro & Rojo', description: 'Aggressive Look.', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#1a1a1a', defaultLogoColor: '#ef4444' },
  { id: 'mix-10', name: 'Negro & Azul', description: 'Deep Blue Tech.', logoStyle: 'classic', baseColorName: 'Negro', baseColorValue: '#1a1a1a', defaultLogoColor: '#2563eb' },
  
  // --- DOMINICAN VARIATIONS ---
  { id: 'dom-2-yellow', name: 'Dominicano en Amarillo', description: 'Resalta en fondo amarillo.', logoStyle: 'dominican', baseColorName: 'Amarillo', baseColorValue: '#facc15' },
  { id: 'dom-2-turq', name: 'Dominicano en Turquesa', description: 'Fusión caribeña.', logoStyle: 'dominican', baseColorName: 'Turquesa', baseColorValue: '#06b6d4' },
  { id: 'dom-2-coral', name: 'Dominicano en Coral', description: 'Color de moda.', logoStyle: 'dominican', baseColorName: 'Coral', baseColorValue: '#fb7185' },
  { id: 'dom-2-navy', name: 'Dominicano en Navy', description: 'Sobrio y patriótico.', logoStyle: 'dominican', baseColorName: 'Azul Marino', baseColorValue: '#1e3a8a' },
  { id: 'dom-2-wine', name: 'Dominicano en Vino', description: 'Elegancia.', logoStyle: 'dominican', baseColorName: 'Vino', baseColorValue: '#7f1d1d' },
  
  // --- EXTRAS ---
  { id: 'x-1', name: 'Mostaza & Negro', description: 'Toque hipster.', logoStyle: 'classic', baseColorName: 'Mostaza', baseColorValue: '#eab308', defaultLogoColor: '#000000' },
  { id: 'x-2', name: 'Mostaza & Blanco', description: 'Luz cálida.', logoStyle: 'classic', baseColorName: 'Mostaza', baseColorValue: '#eab308', defaultLogoColor: '#ffffff' },
  { id: 'x-3', name: 'Verde & Blanco', description: 'Naturaleza.', logoStyle: 'classic', baseColorName: 'Verde', baseColorValue: '#16a34a', defaultLogoColor: '#ffffff' },
  { id: 'x-4', name: 'Azul Cielo & Gris', description: 'Nublado suave.', logoStyle: 'classic', baseColorName: 'Azul Cielo', baseColorValue: '#bae6fd', defaultLogoColor: '#374151' },
  { id: 'x-5', name: 'Carbón & Naranja', description: 'Industrial.', logoStyle: 'classic', baseColorName: 'Carbón', baseColorValue: '#374151', defaultLogoColor: '#f97316' },
  { id: 'x-6', name: 'Carbón & Verde', description: 'Eco Dark.', logoStyle: 'classic', baseColorName: 'Carbón', baseColorValue: '#374151', defaultLogoColor: '#a3e635' },
  { id: 'x-7', name: 'Turquesa Oscuro & Oro', description: 'Premium Aqua.', logoStyle: 'classic', baseColorName: 'Turquesa Oscuro', baseColorValue: '#0e7490', defaultLogoColor: '#ca8a04' },
  { id: 'x-8', name: 'Rojo & Negro', description: 'Bad Boy.', logoStyle: 'classic', baseColorName: 'Rojo', baseColorValue: '#ef4444', defaultLogoColor: '#000000' },
  { id: 'x-9', name: 'Azul Royal & Blanco', description: 'Deportivo puro.', logoStyle: 'classic', baseColorName: 'Azul Royal', baseColorValue: '#2563eb', defaultLogoColor: '#ffffff' },
  { id: 'x-10', name: 'Rosa & Negro', description: 'Blackpink.', logoStyle: 'classic', baseColorName: 'Rosa', baseColorValue: '#ec4899', defaultLogoColor: '#000000' },
];
