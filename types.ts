
export type Category = 'custom' | 'braids' | 'jewelry' | 'bisuteria' | 'crafts' | 'fashion' | 'boutique-pc' | 'boutique-miches' | 'boutique-beach' | 'personal-care' | 'gift-card' | 'toys';

export interface Brand {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  isVisible?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  role: 'Vendedor' | 'Gerente' | 'Admin';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  gallery?: string[];   // Additional product photos
  description: string;
  brandId?: string;
  isNew?: boolean;
  tags?: string[];
  isVisible?: boolean;
  isSoldOut?: boolean;
  nameEn?: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
}

export interface BraidModel {
  id: string;
  name: string;
  image: string;
  description?: string;
  category?: 'Damas' | 'Caballeros' | 'Niños'; // Optional for filtering
  isVisible?: boolean;
  isSoldOut?: boolean;
  nameEn?: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
}

export interface BraidService {
  id: string;
  name: string;
  price: number;
  description?: string;
  isVisible?: boolean;
  isSoldOut?: boolean;
  nameEn?: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
}

export interface DesignConfig {
  text: string;
  fontFamily: string;
  textColor: string;
  textColorName: string; // Para mostrar en el carrito "Dorado", "Holográfico", etc.
  textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  enabled: boolean; // Indica si el usuario activó esta zona
}

export type LogoStyle = 'classic' | 'dominican';

export type OrderStatus = 'Pendiente' | 'Diseñando' | 'En Producción' | 'Listo para Entrega' | 'Entregado' | 'Cancelado';

export interface Order {
  id: string;
  clientName: string;
  room?: string;
  whatsapp?: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}

export type ReservationStatus = 'Pendiente' | 'Confirmada' | 'Completada' | 'Cancelada' | 'No Show';

export interface Reservation {
  id: string;
  clientName: string;
  room?: string;
  vendorId?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  modelId: string;
  modelName: string;
  servicesDetails: { id: string, name: string, price: number, quantity?: number }[];
  total: number;
  status: ReservationStatus;
}

export interface BlockedTime {
  id: string;
  type: 'date' | 'time' | 'recurring';
  date?: string; // YYYY-MM-DD
  time?: string; // HH:MM
  dayOfWeek?: number; // 0-6
  reason?: string;
}

export interface TShirtPreset {
  id: string;
  name: string; // Ej: "Dominican Blue Edition"
  description: string;
  logoStyle: LogoStyle;
  baseColorName: string; // Ej: "Azul Royal"
  baseColorValue: string; // Hex code
  defaultLogoColor?: string; // Optional: Hex code for specific logo colors (e.g. Neon Green)
  tags?: string[]; // Ej: ["Nuevo", "Popular"]
  isVisible?: boolean;
  isSoldOut?: boolean;
  nameEn?: string;
  nameFr?: string;
  descEn?: string;
  descFr?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  details?: {
    customName?: string; // Nombre único del diseño (Ej: "Camiseta Papá")
    size?: string;
    color?: string;
    logoStyle?: LogoStyle; // 'classic' or 'dominican'
    logoColor?: string; // Specific logo color
    designs?: Record<string, DesignConfig>; // key: 'front' | 'back'
    date?: string; // Para citas
    time?: string; // Para citas
    braidType?: string; // Para citas
    deliveryDate?: string; // NUEVO: Fecha calculada de entrega
    clientName?: string; // Nombre del huésped/cliente
    room?: string; // Habitación del cliente
    vendorId?: string; // Nuevo: El vendedor que lo atiende o reserva
  };
  type: 'product' | 'service' | 'gift-card';
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  discount?: string;
  link?: string;
  isActive?: boolean;
  sortOrder?: number;
  titleEn?: string;
  titleFr?: string;
  subtitleEn?: string;
  subtitleFr?: string;
}

export interface SiteContent {
  id: string;
  key: string;
  value: string;
}
