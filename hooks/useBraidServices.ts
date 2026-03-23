import { useState, useEffect } from 'react';
import { BraidService } from '../types';
import { BRAID_SERVICES as DEFAULT_BRAID_SERVICES } from '../constants';
import { useTranslation } from 'react-i18next';
import { fetchBraidServices, createBraidService, updateBraidService, deleteBraidService } from '../lib/appwrite';

const BRAID_SERVICES_STORAGE_KEY = 'laboutiquerd_braid_services';

export const useBraidServices = () => {
  const [services, setServices] = useState<BraidService[]>(() => {
    try {
      const stored = localStorage.getItem(BRAID_SERVICES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      /* ignore corrupt data */
    }
    return DEFAULT_BRAID_SERVICES;
  });
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

    useEffect(() => {
    fetchBraidServices()
      .then(async (docs) => {
        const existingNames = docs.map((d: any) => d.name);
        const mapped: BraidService[] = docs.map((d: any) => ({
             id: d.$id,
             name: d.name,
             price: d.price,
             description: d.description || '',
             isVisible: d.isVisible ?? true,
        }));
        
        const missingServices = DEFAULT_BRAID_SERVICES.filter(s => !existingNames.includes(s.name));
        
        if (missingServices.length > 0) {
           console.log(`Seeding ${missingServices.length} missing braid services...`);
           for (const defaultSrv of missingServices) {
               try {
                   const { id, ...data } = defaultSrv;
                   const result = await createBraidService(data as any);
                   mapped.push({ ...defaultSrv, id: result.$id });
               } catch (e) {
                   mapped.push(defaultSrv);
               }
           }
        }
        
        setServices(mapped);
        localStorage.setItem(BRAID_SERVICES_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch(() => { /* silently use cached data */ })
      .finally(() => setLoading(false));
  }, []);

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
        if (stored) setServices(JSON.parse(stored));
      } catch (e) { /* ignore */ }
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

  const addService = async (service: BraidService) => {
    if(services.some(s => s.id === service.id)) {
        service.id = `${service.id}-${Date.now()}`;
    }
    try {
      const { id, ...data } = service;
      await createBraidService(data as any);
    } catch (e) { /* API create failed */ }
    persistAndDispatch([service, ...services]);
  };

  const updateService = async (updatedService: BraidService) => {
    try {
      const { id, ...data } = updatedService;
      await updateBraidService(id, data as any);
    } catch (e) { /* API update failed */ }
    persistAndDispatch(services.map(s => s.id === updatedService.id ? updatedService : s));
  };

  const deleteService = async (id: string) => {
    try {
      await deleteBraidService(id);
    } catch (e) { /* API delete failed */ }
    persistAndDispatch(services.filter(s => s.id !== id));
  };

  return { services, addService, updateService, deleteService, setServices, loading };
};
