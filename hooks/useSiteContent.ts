import { useState, useEffect } from 'react';
import { SiteContent } from '../types';
import { fetchSiteContent, upsertSiteContent } from '../lib/appwrite';
import { sanitizeText, sanitizeDescription, sanitizeUrl } from '../lib/sanitize';

const SITE_CONTENT_STORAGE_KEY = 'laboutiquerd_site_content';

const DEFAULT_CONTENT: Record<string, string> = {
  hero_title: 'LA BOUTIQUE',
  hero_subtitle: 'Tu Tienda de Regalos y Souvenirs Premium en Punta Cana',
  hero_cta: 'Explorar Tienda',
  about_title: 'Tu Tienda de Confianza',
  about_text: 'Somos una boutique de souvenirs premium y personalización ubicada en los hoteles de Punta Cana. Ofrecemos productos únicos, artesanías locales, y camisetas personalizadas con calidad profesional.',
  footer_text: '© Boutique — Todos los derechos reservados.',
  whatsapp_number: '18091234567',
  whatsapp_message: 'Hola, me interesa un producto de la boutique',
  contact_email: 'info@laboutiquerd.com',
  contact_phone: '+1 (809) 123-4567',
  contact_address: 'Punta Cana, República Dominicana',
  braids_title: 'Estudio de Trenzas',
  braids_subtitle: 'Reserva tu cita con nuestras trenzadoras',
  custom_title: 'Personaliza tu Camiseta',
  custom_subtitle: 'Diseña tu propia camiseta con estilo dominicano',
  store_name: 'Boutique',
  store_logo: '',
  home_quick_categories: JSON.stringify([
    { id: 'custom', label: 'Personalizados', icon: 'SwatchIcon' },
    { id: 'braids', label: 'Estudio de Trenzas', icon: 'ScissorsIcon' },
    { id: 'toys', label: 'Juguetes', icon: 'HeartIcon' },
    { id: 'boutiques', label: 'Boutiques', icon: 'BuildingStorefrontIcon' },
    { id: 'jewelry', label: 'Joyería Fina', icon: 'GemIcon' },
    { id: 'gift-cards', label: 'Gift Cards', icon: 'GiftIcon' }
  ]),
};

export const useSiteContent = () => {
  const [content, setContent] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
      if (stored) return { ...DEFAULT_CONTENT, ...JSON.parse(stored) };
    } catch (e) { /* ignore corrupt data */ }
    return DEFAULT_CONTENT;
  });
  const [loading, setLoading] = useState(true);

  // Fetch from Appwrite
  useEffect(() => {
    fetchSiteContent()
      .then(async (docs) => {
        if (docs.length === 0) {
            console.log('Seeding default site content...');
            const defaultEntries = Object.entries(DEFAULT_CONTENT);
            setContent(DEFAULT_CONTENT);
            localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(DEFAULT_CONTENT));
            
            for (const [key, value] of defaultEntries) {
                try {
                    await upsertSiteContent(key, value);
                } catch (e) { console.error('Error seeding site content:', e); }
            }
            return;
        }

        const fromDb: Record<string, string> = {};
        docs.forEach((d: any) => {
          fromDb[d.key] = d.value;
        });
        const merged = { ...DEFAULT_CONTENT, ...fromDb };
        setContent(merged);
        localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(merged));
      })
      .catch(() => { /* silently use cached data */ })
      .finally(() => setLoading(false));
  }, []);

  // Cross-tab sync
  useEffect(() => {
    const handleChange = () => {
      try {
        const stored = localStorage.getItem(SITE_CONTENT_STORAGE_KEY);
        if (stored) setContent({ ...DEFAULT_CONTENT, ...JSON.parse(stored) });
      } catch (e) { /* ignore */ }
    };
    window.addEventListener('storage', handleChange);
    window.addEventListener('siteContentUpdated', handleChange);
    return () => {
      window.removeEventListener('storage', handleChange);
      window.removeEventListener('siteContentUpdated', handleChange);
    };
  }, []);

  const getValue = (key: string): string => {
    return content[key] || DEFAULT_CONTENT[key] || '';
  };

  const updateValue = async (key: string, value: string) => {
    // Sanitize based on key type
    let safeValue = value;
    if (key.includes('url') || key.includes('logo') || key.includes('image')) {
      safeValue = sanitizeUrl(value);
    } else if (key.includes('text') || key.includes('subtitle') || key.includes('about')) {
      safeValue = sanitizeDescription(value);
    } else if (key === 'home_quick_categories') {
      safeValue = value; // JSON string, keep as is
    } else {
      safeValue = sanitizeText(value, 500);
    }

    const newContent = { ...content, [key]: safeValue };
    setContent(newContent);
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(newContent));
    window.dispatchEvent(new Event('siteContentUpdated'));

    try {
      await upsertSiteContent(key, safeValue);
    } catch (e) { /* API upsert failed */ }
  };

  const updateMultiple = async (updates: Record<string, string>) => {
    const newContent = { ...content };
    for (const [key, value] of Object.entries(updates)) {
      let safeValue = value;
      if (key.includes('url') || key.includes('logo') || key.includes('image')) {
        safeValue = sanitizeUrl(value);
      } else if (key.includes('text') || key.includes('subtitle') || key.includes('about')) {
        safeValue = sanitizeDescription(value);
      } else {
        safeValue = sanitizeText(value, 500);
      }
      newContent[key] = safeValue;
    }
    setContent(newContent);
    localStorage.setItem(SITE_CONTENT_STORAGE_KEY, JSON.stringify(newContent));
    window.dispatchEvent(new Event('siteContentUpdated'));

    // Fire all upserts in parallel
    await Promise.allSettled(
      Object.entries(updates).map(([key, value]) => upsertSiteContent(key, value))
    );
  };

  return { content, getValue, updateValue, updateMultiple, loading, DEFAULT_KEYS: Object.keys(DEFAULT_CONTENT) };
};
