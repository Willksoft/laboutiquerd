import { useState, useEffect } from 'react';
import { Brand } from '../types';
import { fetchBrands, createBrand as apiCreate, updateBrand as apiUpdate, deleteBrand as apiDelete } from '../lib/appwrite';
import { sanitizeText, sanitizeUrl, sanitizeDescription } from '../lib/sanitize';

const BRANDS_STORAGE_KEY = 'laboutiquerd_brands';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>(() => {
    try {
      const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore corrupt data */ }
    return [];
  });
  const [loading, setLoading] = useState(true);

  // Default brands matching the landing page for initial seed
  const DEFAULT_BRANDS: Brand[] = [
      { id: 'b1', name: '45', logo: 'font-bold tracking-widest text-[#4A3D2A]', isVisible: true },
      { id: 'b2', name: 'Collection Club Med', logo: 'font-serif font-bold tracking-widest text-brand-primary', isVisible: true },
      { id: 'b3', name: 'Quiksilver', logo: 'font-sans font-black tracking-tighter text-red-600', isVisible: true },
      { id: 'b4', name: 'Billabong', logo: 'font-sans font-bold italic tracking-wide text-gray-800', isVisible: true },
      { id: 'b5', name: 'Vilebrequin', logo: 'font-sans font-black uppercase tracking-wide text-blue-900', isVisible: true },
      { id: 'b6', name: 'Sundek', logo: 'font-sans font-bold text-orange-500 uppercase', isVisible: true },
      { id: 'b7', name: 'Banana Moon', logo: 'font-cursive text-2xl md:text-3xl text-pink-500', isVisible: true },
      { id: 'b8', name: 'Havaianas', logo: 'font-sans font-black text-yellow-500 tracking-wider', isVisible: true },
      { id: 'b9', name: 'Livia', logo: 'font-serif italic font-bold text-gray-700', isVisible: true },
      { id: 'b10', name: 'Carbon', logo: 'font-mono font-bold uppercase tracking-tighter text-gray-900', isVisible: true },
      { id: 'b11', name: 'Happy & So', logo: 'font-handwriting text-xl font-bold text-purple-900', isVisible: true },
      { id: 'b12', name: 'Gold & Silver', logo: 'font-serif font-bold text-yellow-600', isVisible: true },
      { id: 'b13', name: 'Kreoli Bijoux', logo: 'font-sans font-light tracking-[0.2em] uppercase text-gray-800', isVisible: true },
      { id: 'b14', name: 'Cacatoès', logo: 'font-sans font-black uppercase text-green-600', isVisible: true },
      { id: 'b15', name: 'Hipanema', logo: 'font-serif font-bold text-red-500 tracking-wider', isVisible: true }
  ];

  // Fetch from Appwrite
  useEffect(() => {
    fetchBrands()
      .then(async (docs) => {
        const existingNames = docs.map((d: any) => d.name);
        let mapped: Brand[] = docs.map((d: any) => ({
             id: d.$id,
             name: d.name,
             logo: d.logo || '',
             description: d.description || '',
             isVisible: d.isVisible ?? true,
        }));
        
        const missingBrands = DEFAULT_BRANDS.filter(b => !existingNames.includes(b.name));
        
        if (missingBrands.length > 0) {
            console.log(`Seeding ${missingBrands.length} missing brands...`);
            for (const item of missingBrands) {
                try {
                    const { id, ...data } = item;
                    const result = await apiCreate(data as any);
                    mapped.push({ ...item, id: result.$id });
                } catch (e) {
                    mapped.push(item);
                }
            }
        }
        
        setBrands(mapped);
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch(() => { /* silently use cached data */ })
      .finally(() => setLoading(false));
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleChange = () => {
      try {
        const stored = localStorage.getItem(BRANDS_STORAGE_KEY);
        if (stored) setBrands(JSON.parse(stored));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', handleChange);
    window.addEventListener('brandsUpdated', handleChange);
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('brandsUpdated', handleChange);
    };
  }, []);

  const persistAndDispatch = (newBrands: Brand[]) => {
    setBrands(newBrands);
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(newBrands));
    window.dispatchEvent(new Event('brandsUpdated'));
  };

  const addBrand = async (brand: Brand) => {
    const safe: Brand = {
      ...brand,
      name: sanitizeText(brand.name, 100),
      logo: brand.logo ? sanitizeUrl(brand.logo) : '',
      description: brand.description ? sanitizeDescription(brand.description) : '',
    };
    if (brands.some(b => b.id === safe.id)) {
      safe.id = `${safe.id}-${Date.now()}`;
    }
    try {
      const { id, ...data } = safe;
      await apiCreate(data as any);
    } catch (e) { /* API create failed */ }
    persistAndDispatch([safe, ...brands]);
  };

  const updateBrand = async (brand: Brand) => {
    const safe: Brand = {
      ...brand,
      name: sanitizeText(brand.name, 100),
      logo: brand.logo ? sanitizeUrl(brand.logo) : '',
      description: brand.description ? sanitizeDescription(brand.description) : '',
    };
    try {
      const { id, ...data } = safe;
      await apiUpdate(id, data as any);
    } catch (e) { /* API update failed */ }
    persistAndDispatch(brands.map(b => b.id === safe.id ? safe : b));
  };

  const deleteBrand = async (id: string) => {
    try {
      await apiDelete(id);
    } catch (e) { /* API delete failed */ }
    persistAndDispatch(brands.filter(b => b.id !== id));
  };

  return { brands, addBrand, updateBrand, deleteBrand, loading };
};
