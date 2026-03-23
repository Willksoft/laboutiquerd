import { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { fetchVendors } from '../lib/appwrite';
import { databases, DATABASE_ID, COLLECTIONS, ID } from '../lib/appwrite';
import { sanitizeName, sanitizeText } from '../lib/sanitize';

const VENDORS_STORAGE_KEY = 'laboutiquerd_vendors';

export const useVendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>(() => {
      try {
        const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) { /* ignore */ }
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
        .catch(() => {
          // Silently use cached data
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
        } catch (e) { /* ignore */ }
      };
      window.addEventListener('vendorsUpdated', handleChange);
      window.addEventListener('storage', handleChange);
      return () => {
        window.removeEventListener('vendorsUpdated', handleChange);
        window.removeEventListener('storage', handleChange);
      };
    }, []);

    const VALID_ROLES = ['Vendedor', 'Gerente', 'Admin'];

    const addVendor = async (vendor: Omit<Vendor, 'id'>) => {
      // ═══════ SANITIZE ═══════
      const safeName = sanitizeName(vendor.name);
      const safeRole = VALID_ROLES.includes(vendor.role) ? vendor.role : 'Vendedor';
      
      if (!safeName) return; // Reject empty names

      const tempId = `v-${Date.now()}`;
      const newVendor: Vendor = { id: tempId, name: safeName, role: safeRole };
      try {
        const doc = await databases.createDocument(DATABASE_ID, COLLECTIONS.VENDORS, ID.unique(), {
          name: safeName,
          role: safeRole,
        });
        newVendor.id = doc.$id;
      } catch (e) { /* API create failed */ }
      persistAndDispatch([...vendors, newVendor]);
    };

    const deleteVendor = async (id: string) => {
      try {
        await databases.deleteDocument(DATABASE_ID, COLLECTIONS.VENDORS, id);
      } catch (e) { /* API delete failed */ }
      persistAndDispatch(vendors.filter(v => v.id !== id));
    };

    const updateVendor = async (updatedVendor: Vendor) => {
      // ═══════ SANITIZE ═══════
      const safeName = sanitizeName(updatedVendor.name);
      const safeRole = VALID_ROLES.includes(updatedVendor.role) ? updatedVendor.role : 'Vendedor';
      
      if (!safeName) return; // Reject empty names

      try {
        await databases.updateDocument(DATABASE_ID, COLLECTIONS.VENDORS, updatedVendor.id, {
          name: safeName,
          role: safeRole,
        });
      } catch (e) { /* API update failed */ }
      persistAndDispatch(vendors.map(v => v.id === updatedVendor.id ? { ...v, name: safeName, role: safeRole } : v));
    };

    return { vendors, addVendor, deleteVendor, updateVendor, loading };
};
