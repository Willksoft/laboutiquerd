import { useState, useEffect } from 'react';
import { Vendor } from '../types';
import { fetchVendors } from '../lib/appwrite';

const VENDORS_STORAGE_KEY = 'laboutiquerd_vendors';

const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'María', role: 'Vendedor' },
  { id: 'v2', name: 'Carlos', role: 'Vendedor' },
  { id: 'v3', name: 'Ana', role: 'Gerente' },
  { id: 'v4', name: 'Admin', role: 'Admin' },
];

export const useVendors = () => {
    const [vendors, setVendors] = useState<Vendor[]>(() => {
      try {
        const stored = localStorage.getItem(VENDORS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) { console.error(e); }
      return MOCK_VENDORS;
    });

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
        });
    }, []);

    return { vendors };
};
