import { useState, useEffect } from 'react';
import {
  fetchServices,
  createService as apiCreate,
  updateService as apiUpdate,
  deleteService as apiDelete,
} from '../lib/appwrite';

export interface ServiceItem {
  id: string;
  key: string;               // URL path e.g. '/braids'
  name: string;              // Spanish name
  nameEn?: string;
  nameFr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionFr?: string;
  image?: string;
  emoji?: string;
  tag?: string;              // badge label e.g. 'Reservable'
  sortOrder?: number;
  isActive?: boolean;
}

// Default services shown when DB is empty (fallback only, never used as real IDs)
const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: '__default_braids',
    key: '/braids',
    name: 'Estudio de Trenzas',
    nameEn: 'Braid Studio',
    nameFr: 'Studio de Tresses',
    description: 'Trenzas caribeñas auténticas. Reserva tu cita online.',
    descriptionEn: 'Authentic Caribbean braids. Book your appointment online.',
    descriptionFr: 'Tresses caribéennes authentiques. Réservez votre rendez-vous en ligne.',
    emoji: 'Scissors',
    tag: 'Reservable',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=300',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: '__default_bisuteria',
    key: '/bisuteria',
    name: 'Bisutería & Accesorios',
    nameEn: 'Jewelry & Accessories',
    nameFr: 'Bijoux & Accessoires',
    description: 'Piezas únicas inspiradas en la naturaleza caribeña.',
    descriptionEn: 'Unique pieces inspired by Caribbean nature.',
    descriptionFr: 'Pièces uniques inspirées de la nature caribéenne.',
    emoji: 'Gem',
    tag: 'Artesanal',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94dcdf4?auto=format&fit=crop&q=80&w=300',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: '__default_custom',
    key: '/custom',
    name: 'Personalizados',
    nameEn: 'Custom Products',
    nameFr: 'Produits Personnalisés',
    description: 'Diseña tus camisetas, gorras y accesorios al momento.',
    descriptionEn: 'Design your shirts, caps, and accessories on the spot.',
    descriptionFr: 'Concevez vos vêtements, casquettes et accessoires sur le moment.',
    emoji: 'PenLine',
    tag: 'Exclusivo',
    image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=300',
    sortOrder: 3,
    isActive: true,
  },
];

// IDs that are local defaults and don't exist in Appwrite
const isDefaultId = (id: string) => id.startsWith('__default_');

const mapDoc = (doc: Record<string, unknown>): ServiceItem => ({
  id: doc.$id as string,
  key: (doc.key as string) || '/',
  name: (doc.name as string) || '',
  nameEn: doc.nameEn as string | undefined,
  nameFr: doc.nameFr as string | undefined,
  description: doc.description as string | undefined,
  descriptionEn: doc.descriptionEn as string | undefined,
  descriptionFr: doc.descriptionFr as string | undefined,
  image: doc.image as string | undefined,
  emoji: doc.emoji as string | undefined,
  tag: doc.tag as string | undefined,
  sortOrder: doc.sortOrder as number | undefined,
  isActive: doc.isActive !== false,
});

export const useServices = () => {
  const [services, setServices] = useState<ServiceItem[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices()
      .then((docs) => {
        if (docs.length > 0) {
          const mapped = docs.map(mapDoc).sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setServices(mapped);
        }
        // else keep defaults for display, but don't seed — user creates via admin
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setLoading(false));
  }, []);

  const addService = async (data: Omit<ServiceItem, 'id'>) => {
    const doc = await apiCreate(data as Record<string, unknown>);
    const newSvc = mapDoc(doc as Record<string, unknown>);
    setServices(prev => [...prev, newSvc].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)));
    return newSvc;
  };

  const updateServiceItem = async (id: string, data: Partial<ServiceItem>) => {
    if (isDefaultId(id)) {
      // This is a local default — create it in Appwrite for the first time
      const existing = services.find(s => s.id === id);
      if (!existing) return;
      const merged = { ...existing, ...data } as Omit<ServiceItem, 'id'>;
      const doc = await apiCreate(merged as Record<string, unknown>);
      const created = mapDoc(doc as Record<string, unknown>);
      setServices(prev =>
        prev.map(s => s.id === id ? created : s)
            .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
      );
      return;
    }
    await apiUpdate(id, data as Record<string, unknown>);
    setServices(prev =>
      prev.map(s => s.id === id ? { ...s, ...data } : s)
          .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
    );
  };

  const deleteServiceItem = async (id: string) => {
    if (isDefaultId(id)) {
      // Default services don't exist in DB — just remove from local state
      setServices(prev => prev.filter(s => s.id !== id));
      return;
    }
    await apiDelete(id);
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return { services, loading, addService, updateServiceItem, deleteServiceItem };
};
