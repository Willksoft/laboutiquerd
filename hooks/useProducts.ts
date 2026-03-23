import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../constants';
import { useTranslation } from 'react-i18next';
import { fetchProducts, createProduct as apiCreate, updateProduct as apiUpdate, deleteProduct as apiDelete } from '../lib/appwrite';
import { sanitizeText, sanitizeDescription, sanitizeNumber, sanitizeUrl } from '../lib/sanitize';

const PRODUCTS_STORAGE_KEY = 'laboutiquerd_products';

const sanitizeProduct = (product: Product): Product => ({
  ...product,
  name: sanitizeText(product.name, 200),
  description: sanitizeDescription(product.description || ''),
  image: sanitizeUrl(product.image),
  price: sanitizeNumber(product.price, 0, 9999999),
  originalPrice: product.originalPrice ? sanitizeNumber(product.originalPrice, 0, 9999999) : undefined,
  nameEn: product.nameEn ? sanitizeText(product.nameEn, 200) : undefined,
  descEn: product.descEn ? sanitizeDescription(product.descEn) : undefined,
  nameFr: product.nameFr ? sanitizeText(product.nameFr, 200) : undefined,
  descFr: product.descFr ? sanitizeDescription(product.descFr) : undefined,
});

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* ignore corrupt data */
    }
    return DEFAULT_PRODUCTS;
  });
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Fetch from Appwrite on mount
  useEffect(() => {
    fetchProducts()
      .then((docs) => {
        const mapped: Product[] = docs.map((d: any) => ({
          id: d.$id,
          name: d.name,
          price: d.price,
          originalPrice: d.originalPrice || undefined,
          category: d.category,
          image: d.image || '',
          description: d.description || '',
          tags: d.tags || undefined,
          isVisible: d.isVisible ?? true,
          isSoldOut: d.isSoldOut ?? false,
          nameEn: d.nameEn || undefined,
          descEn: d.descEn || undefined,
          nameFr: d.nameFr || undefined,
          descFr: d.descFr || undefined,
        }));
        setProducts(mapped);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch(() => {
        // Silently use cached data
      })
      .finally(() => setLoading(false));
  }, []);

  // Inject dynamic translations
  useEffect(() => {
     products.forEach(p => {
         if (p.nameEn) i18n.addResourceBundle('en', 'translation', { [p.name]: p.nameEn }, true, true);
         if (p.descEn) i18n.addResourceBundle('en', 'translation', { [p.description]: p.descEn }, true, true);
     });
  }, [products, i18n]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (stored) setProducts(JSON.parse(stored));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('productsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('productsUpdated', handleStorageChange);
    };
  }, []);

  const persistAndDispatch = (newProducts: Product[]) => {
      setProducts(newProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(newProducts));
      window.dispatchEvent(new Event('productsUpdated'));
  };

  const addProduct = async (product: Product) => {
    const safe = sanitizeProduct(product);
    if(products.some(p => p.id === safe.id)) {
        safe.id = `${safe.id}-${Date.now()}`;
    }
    try {
      const { id, ...data } = safe;
      await apiCreate(data as any);
    } catch (e) { /* API create failed */ }
    const newProducts = [safe, ...products];
    persistAndDispatch(newProducts);
  };

  const updateProduct = async (updatedProduct: Product) => {
    const safe = sanitizeProduct(updatedProduct);
    try {
      const { id, ...data } = safe;
      await apiUpdate(id, data as any);
    } catch (e) { /* API update failed */ }
    const newProducts = products.map(p => p.id === safe.id ? safe : p);
    persistAndDispatch(newProducts);
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiDelete(id);
    } catch (e) { /* API delete failed */ }
    const newProducts = products.filter(p => p.id !== id);
    persistAndDispatch(newProducts);
  };

  return { products, addProduct, updateProduct, deleteProduct, setProducts, loading };
};
