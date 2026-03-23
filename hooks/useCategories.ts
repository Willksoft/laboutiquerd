import { useState, useEffect } from 'react';
import {
  fetchCategories,
  createCategory as apiCreate,
  updateCategory as apiUpdate,
  deleteCategory as apiDelete,
} from '../lib/appwrite';

export interface ProductCategory {
  id: string;
  key: string;
  name: string;
  nameEn?: string;
  nameFr?: string;
  emoji?: string;
  image?: string;
  sortOrder?: number;
  isActive?: boolean;
}

const DEFAULT_CATEGORIES: ProductCategory[] = [
  { id: 'cat-moda', key: 'Moda & Ropa',          name: 'Moda & Ropa',          nameEn: 'Fashion & Clothing', nameFr: 'Mode & Vêtements',     emoji: '👗', sortOrder: 1,  isActive: true, image: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-calzado', key: 'Calzado',            name: 'Calzado',              nameEn: 'Footwear',           nameFr: 'Chaussures',           emoji: '👟', sortOrder: 2,  isActive: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-acc', key: 'Accesorios',             name: 'Accesorios',           nameEn: 'Accessories',        nameFr: 'Accessoires',          emoji: '👜', sortOrder: 3,  isActive: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-joyeria', key: 'Alta Joyería',       name: 'Alta Joyería',         nameEn: 'Fine Jewelry',       nameFr: 'Haute Joaillerie',     emoji: '💎', sortOrder: 4,  isActive: true, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-bisuteria', key: 'Bisutería',        name: 'Bisutería',            nameEn: 'Costume Jewelry',    nameFr: 'Bijoux Fantaisie',     emoji: '📿', sortOrder: 5,  isActive: true, image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-cuidado', key: 'Cuidado Personal',   name: 'Cuidado Personal',     nameEn: 'Personal Care',      nameFr: 'Soin Personnel',       emoji: '🧴', sortOrder: 6,  isActive: true, image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-perfumes', key: 'Perfumes',          name: 'Perfumes',             nameEn: 'Fragrances',         nameFr: 'Parfums',              emoji: '🌸', sortOrder: 7,  isActive: true, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-artesania', key: 'Artesanía',        name: 'Artesanía',            nameEn: 'Handicrafts',        nameFr: 'Artisanat',            emoji: '🏺', sortOrder: 8,  isActive: true, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-hogar', key: 'Artículos del Hogar',  name: 'Artículos del Hogar',  nameEn: 'Home Goods',         nameFr: 'Articles Ménagers',    emoji: '🏠', sortOrder: 9,  isActive: true, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-personal', key: 'Artículos Personales', name: 'Artículos Personales', nameEn: 'Personal Items',  nameFr: 'Articles Personnels',  emoji: '🎒', sortOrder: 10, isActive: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-juguetes', key: 'Juguetes',          name: 'Juguetes',             nameEn: 'Toys',               nameFr: 'Jouets',               emoji: '🧸', sortOrder: 11, isActive: true, image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-tech', key: 'Tecnología',            name: 'Tecnología',           nameEn: 'Technology',         nameFr: 'Technologie',          emoji: '📱', sortOrder: 12, isActive: true, image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-bolsos', key: 'Bolsos & Carteras',   name: 'Bolsos & Carteras',    nameEn: 'Bags & Wallets',     nameFr: 'Sacs & Portefeuilles', emoji: '👛', sortOrder: 13, isActive: true, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-ropa-int', key: 'Ropa Interior',     name: 'Ropa Interior',        nameEn: 'Underwear',          nameFr: 'Sous-vêtements',       emoji: '🩱', sortOrder: 14, isActive: true, image: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=400&q=80&auto=format&fit=crop' },
  { id: 'cat-deportes', key: 'Deportes',          name: 'Deportes',             nameEn: 'Sports',             nameFr: 'Sports',               emoji: '⚽', sortOrder: 15, isActive: true, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80&auto=format&fit=crop' },
];

const mapDoc = (doc: Record<string, unknown>): ProductCategory => ({
  id: doc.$id as string,
  key: (doc.key as string) || (doc.name as string),
  name: doc.name as string,
  nameEn: doc.nameEn as string | undefined,
  nameFr: doc.nameFr as string | undefined,
  emoji: doc.emoji as string | undefined,
  image: doc.image as string | undefined,
  sortOrder: doc.sortOrder as number | undefined,
  isActive: doc.isActive !== false,
});

export const useCategories = () => {
  const [categories, setCategories] = useState<ProductCategory[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((docs) => {
        if (docs.length > 0) {
          const mapped = docs.map(mapDoc).sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
          setCategories(mapped);
        }
      })
      .catch(() => { /* use defaults */ })
      .finally(() => setLoading(false));
  }, []);

  const addCategory = async (data: Omit<ProductCategory, 'id'>) => {
    const doc = await apiCreate(data as Record<string, unknown>);
    const newCat = mapDoc(doc as Record<string, unknown>);
    setCategories(prev => [...prev, newCat].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99)));
    return newCat;
  };

  const updateCategory = async (id: string, data: Partial<ProductCategory>) => {
    await apiUpdate(id, data as Record<string, unknown>);
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, ...data } : c)
          .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
    );
  };

  const deleteCategory = async (id: string) => {
    await apiDelete(id);
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory };
};
