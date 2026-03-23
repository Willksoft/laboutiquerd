import { useState, useEffect } from 'react';
import { Offer } from '../types';
import { fetchOffers, createOffer as apiCreate, updateOffer as apiUpdate, deleteOffer as apiDelete } from '../lib/appwrite';
import { sanitizeText, sanitizeUrl } from '../lib/sanitize';
import { OFFERS as DEFAULT_OFFERS } from '../constants'; // fallback

const OFFERS_STORAGE_KEY = 'laboutiquerd_offers';

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>(() => {
    try {
      const stored = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) { /* ignore corrupt data */ }
    return [];
  });
  const [loading, setLoading] = useState(true);

  // Fetch from Appwrite
  useEffect(() => {
    fetchOffers()
      .then(async (docs) => {
        const existingTitles = docs.map((d: any) => d.title);
        let mapped: Offer[] = docs.map((d: any) => ({
             id: d.$id,
             title: d.title,
             titleEn: d.titleEn || '',
             titleFr: d.titleFr || '',
             subtitle: d.subtitle || '',
             subtitleEn: d.subtitleEn || '',
             subtitleFr: d.subtitleFr || '',
             image: d.image || '',
             discount: d.discount || '',
             link: d.link || '',
             isActive: d.isActive ?? true,
             sortOrder: d.sortOrder ?? 0,
        }));
        
        // Seed default offers if completely empty
        if (mapped.length === 0) {
            console.log(`Seeding default offers...`);
            for (let i = 0; i < DEFAULT_OFFERS.length; i++) {
                const item = DEFAULT_OFFERS[i];
                try {
                    const { id, ...data } = item;
                    const finalData = { ...data, isActive: true, sortOrder: i };
                    const result = await apiCreate(finalData as any);
                    mapped.push({ ...finalData, id: result.$id });
                } catch (e) {
                    mapped.push({ ...item, isActive: true, sortOrder: i });
                }
            }
        }
        
        // sort by sortOrder
        mapped.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        
        setOffers(mapped);
        localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(mapped));
      })
      .catch(() => { /* silently use cached data */ })
      .finally(() => setLoading(false));
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleChange = () => {
      try {
        const stored = localStorage.getItem(OFFERS_STORAGE_KEY);
        if (stored) setOffers(JSON.parse(stored));
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', handleChange);
    window.addEventListener('offersUpdated', handleChange);
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('offersUpdated', handleChange);
    };
  }, []);

  const persistAndDispatch = (newOffers: Offer[]) => {
    setOffers(newOffers);
    localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(newOffers));
    window.dispatchEvent(new Event('offersUpdated'));
  };

  const addOffer = async (offer: Offer) => {
    const safe: Offer = {
      ...offer,
      title: sanitizeText(offer.title, 100),
      subtitle: sanitizeText(offer.subtitle, 200),
      image: offer.image ? sanitizeUrl(offer.image) : '',
      discount: offer.discount ? sanitizeText(offer.discount, 50) : '',
      link: offer.link ? sanitizeUrl(offer.link) : '',
    };
    try {
        const { id, ...data } = safe;
        const result = await apiCreate(data as any);
        const finalList = [...offers, { ...safe, id: result.$id }].sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        persistAndDispatch(finalList);
    } catch (error) {
        console.error('Failed to create offer:', error);
        // Optimistic UI
        const optimistic = [...offers, { ...safe, id: `temp-${Date.now()}` }].sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        persistAndDispatch(optimistic);
    }
  };

  const updateOffer = async (updatedOffer: Offer) => {
    const safe: Offer = {
      ...updatedOffer,
      title: sanitizeText(updatedOffer.title, 100),
      subtitle: sanitizeText(updatedOffer.subtitle, 200),
      image: updatedOffer.image ? sanitizeUrl(updatedOffer.image) : '',
      discount: updatedOffer.discount ? sanitizeText(updatedOffer.discount, 50) : '',
      link: updatedOffer.link ? sanitizeUrl(updatedOffer.link) : '',
    };
    try {
        const { id, ...data } = safe;
        if (!id.startsWith('temp-')) {
            await apiUpdate(id, data as any);
        }
        const finalList = offers.map(o => (o.id === updatedOffer.id ? safe : o)).sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        persistAndDispatch(finalList);
    } catch (error) {
        console.error('Failed to update offer:', error);
        const fallback = offers.map(o => (o.id === updatedOffer.id ? safe : o)).sort((a,b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        persistAndDispatch(fallback);
    }
  };

  const deleteOffer = async (id: string) => {
    try {
        if (!id.startsWith('temp-')) await apiDelete(id);
        persistAndDispatch(offers.filter(o => o.id !== id));
    } catch (error) {
        console.error('Failed to delete offer:', error);
        persistAndDispatch(offers.filter(o => o.id !== id));
    }
  };

  const updateOrderings = async (orderedList: Offer[]) => {
     // Batch update all orderings
     persistAndDispatch(orderedList);
     for (const o of orderedList) {
        if (!o.id.startsWith('temp-')) {
            apiUpdate(o.id, { sortOrder: o.sortOrder });
        }
     }
  };

  return { offers, loading, addOffer, updateOffer, deleteOffer, updateOrderings };
};
