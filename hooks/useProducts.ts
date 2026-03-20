import { useState, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../constants';
import { useTranslation } from 'react-i18next';

const PRODUCTS_STORAGE_KEY = 'laboutiquerd_products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading products from localStorage", e);
    }
    return DEFAULT_PRODUCTS;
  });

  const { i18n } = useTranslation();

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
        if (stored) {
          setProducts(JSON.parse(stored));
        }
      } catch (e) {
         console.error(e);
      }
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

  const addProduct = (product: Product) => {
    if(products.some(p => p.id === product.id)) {
        product.id = `${product.id}-${Date.now()}`;
    }
    const newProducts = [product, ...products];
    persistAndDispatch(newProducts);
  };

  const updateProduct = (updatedProduct: Product) => {
    const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    persistAndDispatch(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    persistAndDispatch(newProducts);
  };

  return { products, addProduct, updateProduct, deleteProduct, setProducts };
};
