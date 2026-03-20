import { useState, useEffect } from 'react';
import { BraidModel } from '../types';
import { BRAID_MODELS as DEFAULT_BRAID_STYLES } from '../constants';
import { useTranslation } from 'react-i18next';

const BRAID_STYLES_STORAGE_KEY = 'laboutiquerd_braid_styles';

export const useBraidStyles = () => {
  const [styles, setStyles] = useState<BraidModel[]>(() => {
    try {
      const stored = localStorage.getItem(BRAID_STYLES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading braid styles from localStorage", e);
    }
    return DEFAULT_BRAID_STYLES;
  });

  const { i18n } = useTranslation();

  useEffect(() => {
     styles.forEach(s => {
         const nameEn = (s as any).nameEn;
         const descEn = (s as any).descEn;
         if (nameEn) i18n.addResourceBundle('en', 'translation', { [s.name]: nameEn }, true, true);
     });
  }, [styles, i18n]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(BRAID_STYLES_STORAGE_KEY);
        if (stored) {
          setStyles(JSON.parse(stored));
        }
      } catch (e) {
         console.error(e);
      }
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

  const addStyle = (style: BraidModel) => {
    if(styles.some(s => s.id === style.id)) {
        style.id = `${style.id}-${Date.now()}`;
    }
    const newStyles = [style, ...styles];
    persistAndDispatch(newStyles);
  };

  const updateStyle = (updatedStyle: BraidModel) => {
    const newStyles = styles.map(s => s.id === updatedStyle.id ? updatedStyle : s);
    persistAndDispatch(newStyles);
  };

  const deleteStyle = (id: string) => {
    const newStyles = styles.filter(s => s.id !== id);
    persistAndDispatch(newStyles);
  };

  return { styles, addStyle, updateStyle, deleteStyle, setStyles };
};
