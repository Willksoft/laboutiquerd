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

  // Fetch from Appwrite
  useEffect(() => {
    fetchBrands()
      .then((docs) => {
        const mapped: Brand[] = docs.map((d: any) => ({
          id: d.$id,
          name: d.name,
          logo: d.logo || '',
          description: d.description || '',
          isVisible: d.isVisible ?? true,
        }));
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
