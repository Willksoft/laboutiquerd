import React from 'react';
import { MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white/80 mt-0">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-accent via-brand-accent/60 to-transparent" />
      
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-0.5 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>Boutique</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-7 h-7 text-brand-accent" fill="currentColor">
                <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
              </svg>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              {t('Tu espacio para estilo personalizado, belleza y arte cultural en Punta Cana & Michès.')}
            </p>
            <div className="flex gap-3">
              {['facebook', 'instagram', 'tiktok'].map(social => (
                <a key={social} href="#" className="w-10 h-10 bg-white/5 hover:bg-brand-accent hover:text-black rounded-xl flex items-center justify-center transition-all duration-300 text-white/60 hover:scale-105 border border-white/5">
                  <span className="text-xs font-bold uppercase">{social[0].toUpperCase()}{social[1]}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-brand-accent mb-6">
              {t('Comprar')}
            </h4>
            <ul className="space-y-3">
              {[t('Ofertas'), t('Boutique Punta Cana'), t('Boutique Miches'), t('Boutique Playa'), t('Gift Cards')].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/50 hover:text-brand-accent transition-colors duration-200">{link}</a>
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
              {[t('Personalizados'), t('Estudio de Trenzas'), t('Bisutería'), t('Joyería & Larimar'), t('Juguetes')].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-white/50 hover:text-brand-accent transition-colors duration-200">{link}</a>
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
                <span className="text-sm text-white/50">Club Med Punta Cana & Michès, República Dominicana</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <a href="mailto:info@laboutiquerd.com" className="text-sm text-white/50 hover:text-brand-accent transition-colors">info@laboutiquerd.com</a>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <a href="tel:+18091234567" className="text-sm text-white/50 hover:text-brand-accent transition-colors">+1 (809) 123-4567</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Boutique. {t('Todos los derechos reservados.')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/30 text-xs hover:text-brand-accent transition-colors">{t('Privacidad')}</a>
            <a href="#" className="text-white/30 text-xs hover:text-brand-accent transition-colors">{t('Términos')}</a>
            <a href="#" className="text-white/30 text-xs hover:text-brand-accent transition-colors">{t('Cookies')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
