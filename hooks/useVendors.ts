import { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { fetchVendors } from '../lib/appwrite';
import { databases, DATABASE_ID, COLLECTIONS, ID } from '../lib/appwrite';

const VENDORS_STORAGE_KEY = 'laboutiquerd_vendors';

export const useVendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>(() => {
      try {
        const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) { console.error(e); }
      return [];
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetchVendors()
        .then((docs) => {
          const mapped: Vendor[] = docs.map((d: any) => ({
            id: d.$id,
            name: d.name,
            role: d.role,
          }));
          setVendors(mapped);
          localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(mapped));
        })
        .catch((err) => {
          console.warn('Appwrite vendors fetch failed:', err.message);
        })
        .finally(() => setLoading(false));
    }, []);

    const persistAndDispatch = (newVendors: Vendor[]) => {
      setVendors(newVendors);
      localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(newVendors));
      window.dispatchEvent(new Event('vendorsUpdated'));
    };

    useEffect(() => {
      const handleChange = () => {
        try {
          const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
          if (stored) setVendors(JSON.parse(stored));
        } catch (e) { console.error(e); }
      };
      window.addEventListener('vendorsUpdated', handleChange);
      window.addEventListener('storage', handleChange);
      return () => {
        window.removeEventListener('vendorsUpdated', handleChange);
        window.removeEventListener('storage', handleChange);
      };
    }, []);

    const addVendor = async (vendor: Omit<Vendor, 'id'>) => {
      const tempId = `v-${Date.now()}`;
      const newVendor: Vendor = { id: tempId, ...vendor };
      try {
        const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.VENDORS, ID.unique(), {
          name: vendor.name,
          role: vendor.role,
        });
        newVendor.id = doc.$id;
      } catch (e) { console.warn('API create vendor failed:', e); }
      persistAndDispatch([...vendors, newVendor]);
    };

    const deleteVendor = async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.VENDORS, id);
      } catch (e) { console.warn('API delete vendor failed:', e); }
      persistAndDispatch(vendors.filter(v => v.id !== id));
    };

    const updateVendor = async (updatedVendor: Vendor) => {
      try {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.VENDORS, updatedVendor.id, {
          name: updatedVendor.name,
          role: updatedVendor.role,
        });
      } catch (e) { console.warn('API update vendor failed:', e); }
      persistAndDispatch(vendors.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    };

    return { vendors, addVendor, deleteVendor, updateVendor, loading };
};
