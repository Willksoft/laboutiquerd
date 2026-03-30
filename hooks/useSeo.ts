import { useEffect } from 'react';

const SITE_NAME = 'Boutique Creattive';
const SITE_URL = 'https://laboutiquerd.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const DEFAULT_DESCRIPTION =
  'Tu espacio para estilo personalizado, belleza y arte cultural. Moda resort, trenzas caribeñas, joyería Larimar y artesanía dominicana en Club Med Punta Cana y Michès.';

interface SeoOptions {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'article';
  path?: string;
  price?: number;
  currency?: string;
  /** JSON-LD structured data objects */
  structuredData?: object[];
  noIndex?: boolean;
}

/**
 * useSeo — dynamically updates <head> meta tags for each page.
 * Works for Google (which renders JS). For social bots (WhatsApp, FB, Twitter)
 * the Vercel edge function /api/og handles OG injection server-side.
 */
export const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  path = '',
  price,
  currency = 'DOP',
  structuredData = [],
  noIndex = false,
}: SeoOptions = {}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Punta Cana & Michès`;
  const canonicalUrl = `${SITE_URL}${path}`;

  useEffect(() => {
    // --- Title ---
    document.title = fullTitle;

    // Helper to set/create a meta tag
    const setMeta = (selector: string, value: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('[property') ? 'property' : 'name';
        const key = selector.match(/["']([^"']+)["']/)?.[1] || '';
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    // --- Standard meta ---
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    // --- Canonical ---
    setLink('canonical', canonicalUrl);

    // --- Open Graph ---
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:image"]', image);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:type"]', type === 'product' ? 'product' : 'website');
    setMeta('meta[property="og:site_name"]', SITE_NAME);
    if (price !== undefined) {
      setMeta('meta[property="product:price:amount"]', String(price));
      setMeta('meta[property="product:price:currency"]', currency);
    }

    // --- Twitter Card ---
    setMeta('meta[name="twitter:card"]', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', image);

    // --- Structured Data ---
    // Remove any previously injected dynamic ld+json blocks
    document.querySelectorAll('script[data-seo="dynamic"]').forEach(el => el.remove());

    structuredData.forEach(data => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'dynamic');
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} — Punta Cana & Michès`;
      document.querySelectorAll('script[data-seo="dynamic"]').forEach(el => el.remove());
    };
  }, [fullTitle, description, image, canonicalUrl, type, price, noIndex]);
};

export default useSeo;
