import { useState, useEffect } from 'react';
import { TShirtPreset } from '../types';
import { TSHIRT_PRESETS as DEFAULT_PRESETS } from '../constants';
import { useTranslation } from 'react-i18next';
import { fetchTShirtPresets, createTShirtPreset, updateTShirtPreset, deleteTShirtPreset } from '../lib/appwrite';

const PRESETS_STORAGE_KEY = 'laboutiquerd_presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<TShirtPreset[]>(() => {
    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Error reading presets from localStorage", e);
    }
    return DEFAULT_PRESETS;
  });
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  // Fetch from Appwrite on mount
  useEffect(() => {
    fetchTShirtPresets()
      .then((docs) => {
        const mapped: TShirtPreset[] = docs.map((d: any) => ({
          id: d.$id,
          name: d.name,
          description: d.description || '',
          logoStyle: d.logoStyle as any,
          baseColorName: d.baseColorName,
          baseColorValue: d.baseColorValue,
          defaultLogoColor: d.defaultLogoColor || undefined,
          tags: d.tags || undefined,
          isVisible: d.isVisible ?? true,
        }));
        if (mapped.length > 0) {
          setPresets(mapped);
          localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(mapped));
        }
      })
      .catch((err) => console.warn('Appwrite presets fetch failed:', err.message))
      .finally(() => setLoading(false));
  }, []);

  // Inject dynamic translations for presets matching their name string
  useEffect(() => {
     presets.forEach(p => {
         if (p.nameEn) i18n.addResourceBundle('en', 'translation', { [p.name]: p.nameEn }, true, true);
         if (p.nameFr) i18n.addResourceBundle('fr', 'translation', { [p.name]: p.nameFr }, true, true);
         if (p.descEn) i18n.addResourceBundle('en', 'translation', { [p.description]: p.descEn }, true, true);
         if (p.descFr) i18n.addResourceBundle('fr', 'translation', { [p.description]: p.descFr }, true, true);
     });
  }, [presets, i18n]);

  // Sync state if another component modifies localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
        if (stored) setPresets(JSON.parse(stored));
      } catch (e) { console.error(e); }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('presetsUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('presetsUpdated', handleStorageChange);
    };
  }, []);

  const persistAndDispatch = (newPresets: TShirtPreset[]) => {
      setPresets(newPresets);
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(newPresets));
      window.dispatchEvent(new Event('presetsUpdated'));
  };

  const addPreset = async (preset: TShirtPreset) => {
    if(presets.some(p => p.id === preset.id)) {
        preset.id = `${preset.id}-${Date.now()}`;
    }
    try {
      const { id, ...rest } = preset;
      await createTShirtPreset(rest as any);
    } catch (e) { console.warn('API create preset failed:', e); }
    persistAndDispatch([preset, ...presets]);
  };

  const updatePreset = async (updatedPreset: TShirtPreset) => {
    try {
      const { id, ...rest } = updatedPreset;
      await updateTShirtPreset(id, rest as any);
    } catch (e) { console.warn('API update preset failed:', e); }
    persistAndDispatch(presets.map(p => p.id === updatedPreset.id ? updatedPreset : p));
  };

  const deletePreset = async (id: string) => {
    try {
      await deleteTShirtPreset(id);
    } catch (e) { console.warn('API delete preset failed:', e); }
    persistAndDispatch(presets.filter(p => p.id !== id));
  };

  return { presets, addPreset, updatePreset, deletePreset, setPresets, loading };
};
