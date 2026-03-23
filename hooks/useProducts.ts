import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../constants';
import { useTranslation } from 'react-i18next';
import { fetchProducts, createProduct as apiCreate, updateProduct as apiUpdate, deleteProduct as apiDelete } from '../lib/appwrite';
import { sanitizeText, sanitizeDescription, sanitizeNumber, sanitizeUrl } from '../lib/sanitize';

const PRODUCTS_STORAGE_KEY = 'laboutiquerd_products';

const autoTranslate = async (text: string, targetLang: 'en' | 'fr'): Promise<string> => {
   if (!text) return '';
   try {
       const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
       const data = await res.json();
       // Google Translate API returns [[["translated_text", "original_text"]], null, 'es']
       return data[0].map((item: any) => item[0]).join('');
   } catch {
       return text;
   }
};

const sanitizeProduct = (product: Product): Product => ({
  ...product,
  name: sanitizeText(product.name, 200),
  description: sanitizeDescription(product.description || ''),
  image: sanitizeUrl(product.image),
  gallery: product.gallery?.map(u => sanitizeUrl(u)).filter(Boolean) || [],
  price: sanitizeNumber(product.price, 0, 9999999),
  originalPrice: product.originalPrice ? sanitizeNumber(product.originalPrice, 0, 9999999) : undefined,
  brandId: product.brandId ? sanitizeText(product.brandId, 100) : undefined,
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
      .then(async (docs) => {
        if (docs.length === 0) {
            console.log('Seeding default products...');
            setProducts(DEFAULT_PRODUCTS);
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
            
            for (const item of DEFAULT_PRODUCTS) {
                try {
                    await apiCreate({
                      name: sanitizeText(item.name, 200),
                      category: item.category,
                      price: item.price,
                      originalPrice: item.originalPrice,
                      image: item.image,
                      description: item.description,
                      brandId: item.brandId,
                      tags: item.tags,
                      isVisible: item.isVisible !== false,
                      isSoldOut: item.isSoldOut || false
                    });
                } catch (e) { console.error('Error seeding product:', e); }
            }
            return;
        }

        const mapped: Product[] = docs.map((d: any) => ({
          id: d.$id,
          name: d.name,
          price: d.price,
          originalPrice: d.originalPrice || undefined,
          category: d.category,
          image: d.image || '',
          gallery: Array.isArray(d.gallery) ? d.gallery.filter(Boolean) : [],
          description: d.description || '',
          brandId: d.brandId || undefined,
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
    let safe = sanitizeProduct(product);
    
    // Auto-translate if empty
    try {
        if (!safe.nameEn) safe.nameEn = await autoTranslate(safe.name, 'en');
        if (!safe.descEn && safe.description) safe.descEn = await autoTranslate(safe.description, 'en');
        
        if (!safe.nameFr) safe.nameFr = await autoTranslate(safe.name, 'fr');
        if (!safe.descFr && safe.description) safe.descFr = await autoTranslate(safe.description, 'fr');
    } catch (err) {
        console.error('Translation failed', err);
    }

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
    let safe = sanitizeProduct(updatedProduct);
    
    try {
        if (!safe.nameEn) safe.nameEn = await autoTranslate(safe.name, 'en');
        if (!safe.descEn && safe.description) safe.descEn = await autoTranslate(safe.description, 'en');
        
        if (!safe.nameFr) safe.nameFr = await autoTranslate(safe.name, 'fr');
        if (!safe.descFr && safe.description) safe.descFr = await autoTranslate(safe.description, 'fr');
    } catch (err) {
        console.error('Translation failed', err);
    }

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
