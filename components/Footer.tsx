import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../hooks/useSiteContent';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { content } = useSiteContent();

  const shopLinks = [
    { label: t('Ofertas'), path: '/offers' },
    { label: t('Productos'), path: '/products' },
    { label: t('Boutique Punta Cana'), path: '/boutiques' },
    { label: t('Boutique Miches'), path: '/boutiques' },
    { label: t('Gift Cards'), path: '/gift-cards' },
  ];

  const serviceLinks = [
    { label: t('Personalizados'), path: '/custom' },
    { label: t('Estudio de Trenzas'), path: '/braids' },
    { label: t('Bisutería'), path: '/bisuteria' },
    { label: t('Alta Joyería'), path: '/jewelry' },
    { label: t('Juguetes'), path: '/toys' },
  ];

  return (
    <footer className="bg-black text-white/80 mt-0">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-accent via-brand-accent/60 to-transparent" />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0.5 mb-4">
              {content.store_logo ? (
                <img src={content.store_logo} alt={content.store_name || 'Boutique'} className="h-12 object-contain filter brightness-0 invert" />
              ) : (
                <>
                  <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>
                    {content.store_name || 'Boutique'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-7 h-7 text-brand-accent" fill="currentColor">
                    <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
                  </svg>
                </>
              )}
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {t(content.footer_text || 'Tu espacio para estilo personalizado, belleza y arte cultural en Punta Cana & Michès.')}
            </p>
            <div className="flex flex-wrap gap-3">
              {content.social_facebook && (
                <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {content.social_instagram && (
                <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {content.social_tiktok && (
                <a href={content.social_tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                </a>
              )}
              {content.social_youtube && (
                <a href={content.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                </a>
              )}
              {content.social_twitter && (
                <a href={content.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-accent mb-6">
              {t('Comprar')}
            </h4>
            <ul className="space-y-3">
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-white/50 hover:text-brand-accent transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-accent mb-6">
              {t('Servicios')}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.path} className="text-sm text-white/50 hover:text-brand-accent transition-colors duration-200">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-accent mb-6">
              {t('Contacto')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/50">{content.contact_address || 'Club Med Punta Cana & Michès, República Dominicana'}</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <a href={`mailto:${content.contact_email || 'info@laboutiquerd.com'}`} className="text-sm text-white/50 hover:text-brand-accent transition-colors">{content.contact_email || 'info@laboutiquerd.com'}</a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <a href={`tel:${content.contact_phone || '+18091234567'}`} className="text-sm text-white/50 hover:text-brand-accent transition-colors">{content.contact_phone || '+1 (809) 123-4567'}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} {content.store_name || 'Boutique'}. {t('Todos los derechos reservados.')}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-white/30 text-xs hover:text-brand-accent transition-colors cursor-pointer">{t('Privacidad')}</Link>
            <Link to="/terms" className="text-white/30 text-xs hover:text-brand-accent transition-colors cursor-pointer">{t('Términos')}</Link>
            <span className="text-white/30 text-xs hover:text-brand-accent transition-colors cursor-pointer">{t('Cookies')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
