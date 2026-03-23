import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  product?: {
    name: string;
    price: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock';
    image?: string;
    sku?: string;
    category?: string;
  };
  noindex?: boolean;
}

const SITE_NAME = 'Boutique Creattive';
// Primary custom domain; Vercel is the deploy origin
const SITE_URL = 'https://laboutiquerd.com';
const SITE_URL_ALT = 'https://laboutiquerd.vercel.app';
// OG image uploaded to Appwrite Storage bucket "media" with ID "og-image"
const DEFAULT_IMAGE = 'https://nyc.cloud.appwrite.io/v1/storage/buckets/media/files/og-image/view?project=69c138dc003803eb6ca8';
const TWITTER_HANDLE = '@LaBoutiqueRD';

// Local Business JSON-LD schema
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: SITE_NAME,
  description: 'Tu espacio para estilo personalizado, belleza y arte cultural en Punta Cana & Michès.',
  url: SITE_URL,
  sameAs: [
    SITE_URL_ALT,
    'https://www.instagram.com/laboutiquerd',
  ],
  logo: `${SITE_URL}/favicon.svg`,
  image: DEFAULT_IMAGE,
  priceRange: 'RD$$-$$$',
  currenciesAccepted: 'USD, DOP',
  paymentAccepted: 'Cash, Credit Card',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Club Med Punta Cana',
      addressLocality: 'Punta Cana',
      addressRegion: 'La Altagracia',
      addressCountry: 'DO',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: 'Club Med Michès Playa Esmeralda',
      addressLocality: 'Michès',
      addressRegion: 'El Seibo',
      addressCountry: 'DO',
    },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '20:00',
  },

  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catálogo Boutique Creattive',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Moda & Ropa Resort' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Trenzas Caribeñas' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Joyería Larimar' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Artesanía Dominicana' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Gift Cards' } },
    ],
  },
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  url,
  type = 'website',
  product,
  noindex = false,
}) => {
  const { i18n } = useTranslation();

  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Punta Cana & Michès`;
  const pageDesc = description || 'Tu espacio para estilo personalizado, belleza y arte cultural. Moda, trenzas caribeñas, joyería Larimar y artesanía dominicana en Club Med Punta Cana y Michès.';
  const pageImage = image || DEFAULT_IMAGE;
  const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const lang = i18n.language?.startsWith('fr') ? 'fr' : i18n.language?.startsWith('en') ? 'en' : 'es';

  // Product JSON-LD schema
  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image || pageImage,
        description: pageDesc,
        sku: product.sku || `sku-${product.name.toLowerCase().replace(/\s+/g, '-')}`,
        category: product.category,
        brand: { '@type': 'Brand', name: SITE_NAME },
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: product.currency || 'DOP',
          availability: `https://schema.org/${product.availability || 'InStock'}`,
          url: pageUrl,
          seller: { '@type': 'Organization', name: SITE_NAME },
        },
      }
    : null;

  return (
    <Helmet>
      {/* Basic */}
      <html lang={lang} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={pageUrl} />
      <link rel="alternate" href={pageUrl.replace(SITE_URL, SITE_URL_ALT)} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:secure_url" content={pageImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} — Boutique en Punta Cana & Michès`} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:locale" content={lang === 'fr' ? 'fr_FR' : lang === 'en' ? 'en_US' : 'es_DO'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={pageImage} />

      {/* Additional SEO */}
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="DO" />
      <meta name="geo.placename" content="Punta Cana, República Dominicana" />
      <meta name="keywords" content="boutique punta cana, trenzas caribeñas, joyería larimar, artesanía dominicana, moda resort, club med boutique, gift cards dominicana, bisutería, personalización camisetas" />

      {/* JSON-LD — Local Business (always) */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* JSON-LD — Product (conditional) */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
