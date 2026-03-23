import { useState, useEffect } from 'react';
import { BraidModel } from '../types';
import { BRAID_MODELS as DEFAULT_BRAID_STYLES } from '../constants';
import { useTranslation } from 'react-i18next';
import { fetchBraidModels, createBraidModel, updateBraidModel, deleteBraidModel } from '../lib/appwrite';

const BRAID_STYLES_STORAGE_KEY = 'laboutiquerd_braid_styles';

export const useBraidStyles = () => {
  const [styles, setStyles] = useState<BraidModel[]>(() => {
    try {
      const stored = localStorage.getItem(BRAID_STYLES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* ignore corrupt data */
    }
    return DEFAULT_BRAID_STYLES;
  });
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Fetch from Appwrite on mount
  useEffect(() => {
    fetchBraidModels()
      .then(async (docs) => {
        if (docs.length === 0) {
            const mapped: BraidModel[] = [];
            for (const item of DEFAULT_BRAID_STYLES) {
                try {
                    const { id, ...data } = item;
                    const result = await createBraidModel(data as any);
                    mapped.push({ ...item, id: result.$id });
                } catch (e) {
                    mapped.push(item);
                }
            }
            setStyles(mapped);
            localStorage.setItem(BRAID_STYLES_STORAGE_KEY, JSON.stringify(mapped));
        } else {
            const mapped: BraidModel[] = docs.map((d: any) => ({
              id: d.$id,
              name: d.name,
              image: d.image || '',
              description: d.description || '',
              category: d.category || 'Damas',
              isVisible: d.isVisible ?? true,
            }));
            setStyles(mapped);
            localStorage.setItem(BRAID_STYLES_STORAGE_KEY, JSON.stringify(mapped));
        }
      })
      .catch(() => { /* silently use cached data */ })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
     styles.forEach(s => {
         const nameEn = (s as any).nameEn;
         if (nameEn) i18n.addResourceBundle('en', 'translation', { [s.name]: nameEn }, true, true);
     });
  }, [styles, i18n]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(BRAID_STYLES_STORAGE_KEY);
        if (stored) setStyles(JSON.parse(stored));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('braidStylesUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('braidStylesUpdated', handleStorageChange);
    };
  }, []);

  const persistAndDispatch = (newStyles: BraidModel[]) => {
      setStyles(newStyles);
      localStorage.setItem(BRAID_STYLES_STORAGE_KEY, JSON.stringify(newStyles));
      window.dispatchEvent(new Event('braidStylesUpdated'));
  };

  const addStyle = async (style: BraidModel) => {
    if(styles.some(s => s.id === style.id)) {
        style.id = `${style.id}-${Date.now()}`;
    }
    try {
      const { id, ...data } = style;
      await createBraidModel(data as any);
    } catch (e) { /* API create failed */ }
    persistAndDispatch([style, ...styles]);
  };

  const updateStyle = async (updatedStyle: BraidModel) => {
    try {
      const { id, ...data } = updatedStyle;
      await updateBraidModel(id, data as any);
    } catch (e) { /* API update failed */ }
    persistAndDispatch(styles.map(s => s.id === updatedStyle.id ? updatedStyle : s));
  };

  const deleteStyle = async (id: string) => {
    try {
      await deleteBraidModel(id);
    } catch (e) { /* API delete failed */ }
    persistAndDispatch(styles.filter(s => s.id !== id));
  };

  return { styles, addStyle, updateStyle, deleteStyle, setStyles, loading };
};
