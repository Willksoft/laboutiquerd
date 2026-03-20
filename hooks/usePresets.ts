import { useState, useEffect } from 'react';
import { TShirtPreset } from '../types';
import { TSHIRT_PRESETS as DEFAULT_PRESETS } from '../constants';
import { useTranslation } from 'react-i18next';

const PRESETS_STORAGE_KEY = 'laboutiquerd_presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<TShirtPreset[]>(() => {
    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading presets from localStorage", e);
    }
    return DEFAULT_PRESETS;
  });

  const { i18n } = useTranslation();

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
        if (stored) {
          setPresets(JSON.parse(stored));
        }
      } catch (e) {
         console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Add custom event for same-window updates
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

  const addPreset = (preset: TShirtPreset) => {
    // Prevent ID duplicates
    if(presets.some(p => p.id === preset.id)) {
        preset.id = `${preset.id}-${Date.now()}`;
    }
    const newPresets = [preset, ...presets];
    persistAndDispatch(newPresets);
  };

  const updatePreset = (updatedPreset: TShirtPreset) => {
    const newPresets = presets.map(p => p.id === updatedPreset.id ? updatedPreset : p);
    persistAndDispatch(newPresets);
  };

  const deletePreset = (id: string) => {
    const newPresets = presets.filter(p => p.id !== id);
    persistAndDispatch(newPresets);
  };

  return { presets, addPreset, updatePreset, deletePreset, setPresets };
};
