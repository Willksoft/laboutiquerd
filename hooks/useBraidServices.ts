import { useState, useEffect } from 'react';
import { BraidService } from '../types';
import { BRAID_SERVICES as DEFAULT_BRAID_SERVICES } from '../constants';
import { useTranslation } from 'react-i18next';

const BRAID_SERVICES_STORAGE_KEY = 'laboutiquerd_braid_services';

export const useBraidServices = () => {
  const [services, setServices] = useState<BraidService[]>(() => {
    try {
      const stored = localStorage.getItem(BRAID_SERVICES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading braid services from localStorage", e);
    }
    return DEFAULT_BRAID_SERVICES;
  });

  const { i18n } = useTranslation();

  useEffect(() => {
     services.forEach(s => {
         const nameEn = (s as any).nameEn;
         const descEn = (s as any).descEn;
         if (nameEn) i18n.addResourceBundle('en', 'translation', { [s.name]: nameEn }, true, true);
         if (descEn && s.description) i18n.addResourceBundle('en', 'translation', { [s.description]: descEn }, true, true);
     });
  }, [services, i18n]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(BRAID_SERVICES_STORAGE_KEY);
        if (stored) {
          setServices(JSON.parse(stored));
        }
      } catch (e) {
         console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('braidServicesUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('braidServicesUpdated', handleStorageChange);
    };
  }, []);

  const persistAndDispatch = (newServices: BraidService[]) => {
      setServices(newServices);
      localStorage.setItem(BRAID_SERVICES_STORAGE_KEY, JSON.stringify(newServices));
      window.dispatchEvent(new Event('braidServicesUpdated'));
  };

  const addService = (service: BraidService) => {
    if(services.some(s => s.id === service.id)) {
        service.id = `${service.id}-${Date.now()}`;
    }
    const newServices = [service, ...services];
    persistAndDispatch(newServices);
  };

  const updateService = (updatedService: BraidService) => {
    const newServices = services.map(s => s.id === updatedService.id ? updatedService : s);
    persistAndDispatch(newServices);
  };

  const deleteService = (id: string) => {
    const newServices = services.filter(s => s.id !== id);
    persistAndDispatch(newServices);
  };

  return { services, addService, updateService, deleteService, setServices };
};
