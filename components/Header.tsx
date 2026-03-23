import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteContent } from '../hooks/useSiteContent';
import { useCategories, type ProductCategory } from '../hooks/useCategories';

// Trident SVG icon component
const TridentIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={className} fill="currentColor">
    <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
  </svg>
);

// Category alias for Header (uses ProductCategory from hook)
type Category = ProductCategory;

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onOpenTracking, currentView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaMenuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { content } = useSiteContent();
  const { categories } = useCategories();
  const activeCategories = categories.filter(c => c.isActive !== false);

  const changeLanguage = (lng: string) => { i18n.changeLanguage(lng); };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close services dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mega menu hover handlers with delay to avoid accidental close
  const handleMegaEnter = useCallback(() => {
    if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current);
    setMegaMenuOpen(true);
  }, []);

  const handleMegaLeave = useCallback(() => {
    megaMenuTimeout.current = setTimeout(() => setMegaMenuOpen(false), 180);
  }, []);

  const goToCategory = (cat: Category) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(`/products?category=${encodeURIComponent(cat.key)}`);
  };

  const getCategoryLabel = (cat: Category) => {
    const lang = i18n.language;
    return (lang.startsWith('en') && cat.nameEn) ? cat.nameEn
         : (lang.startsWith('fr') && cat.nameFr) ? cat.nameFr
         : t(cat.name);
  };

  const navItems = [
    { label: t('Inicio'), path: '/' },
    { label: t('Ofertas'), path: '/offers' },
    {
      label: t('Servicios'),
      path: '#',
      subItems: [
        { label: t('Estudio de Trenzas'), path: '/braids' },
        { label: t('Bisutería'), path: '/bisuteria' },
        { label: t('Personalizados'), path: '/custom' },
      ]
    },
    { label: t('Gift Cards'), path: '/gift-cards' },
    { label: t('Boutiques'), path: '/boutiques' },
  ];

  // Service images from admin (siteContent keys) with Unsplash fallbacks
  const serviceItems = [
    {
      path: '/braids',
      emoji: '💆‍♀️',
      image: content.service_img_braids || 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=300',
      titleKey: 'Estudio de Trenzas',
      descKey: 'Trenzas caribeñas auténticas. Reserva tu cita online.',
      tagKey: 'Reservable',
    },
    {
      path: '/bisuteria',
      emoji: '💎',
      image: content.service_img_bisuteria || 'https://images.unsplash.com/photo-1573408301185-9519f94dcdf4?auto=format&fit=crop&q=80&w=300',
      titleKey: 'Bisutería & Accesorios',
      descKey: 'Piezas únicas inspiradas en la naturaleza caribeña.',
      tagKey: 'Artesanal',
    },
    {
      path: '/custom',
      emoji: '✏️',
      image: content.service_img_custom || 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&q=80&w=300',
      titleKey: 'Personalizados',
      descKey: 'Diseña tus camisetas, gorras y accesorios al momento.',
      tagKey: 'Exclusivo',
    },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-glass border-b border-gray-100/50'
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Name with Trident */}
        <Link to="/" className="flex items-center gap-0.5 cursor-pointer group shrink-0">
          {content.store_logo ? (
            <img src={content.store_logo} alt={content.store_name || 'Boutique'} className="h-10 object-contain" />
          ) : (
            <>
              <span className="text-2xl font-bold text-brand-primary tracking-tight" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>
                {content.store_name || 'Boutique'}
              </span>
              <TridentIcon className="w-7 h-7 text-black" />
            </>
          )}
        </Link>

        {/* Desktop Nav — NEW ORDER: Inicio > Ofertas > Productos > Servicios > Gift Cards > Boutiques */}
        <nav className="hidden xl:flex gap-0.5 text-[13px] font-medium items-center">
          {/* Inicio, Ofertas */}
          {navItems.slice(0, 2).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                currentView === item.path.substring(1) || (item.path === '/' && currentView === 'home')
                  ? 'bg-black text-white font-semibold'
                  : 'text-brand-primary/70 hover:bg-black hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Productos – Mega Menu trigger */}
          <div
            className="relative"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleMegaLeave}
          >
            <button
              onClick={() => setMegaMenuOpen(v => !v)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                currentView === 'products'
                  ? 'bg-black text-white font-semibold'
                  : 'text-brand-primary/70 hover:bg-black hover:text-white'
              }`}
            >
              {t('Productos')}
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Panel — Premium Redesign */}
            {megaMenuOpen && (
              <div
                className="fixed left-0 right-0 top-[72px] z-[60]"
                style={{ pointerEvents: 'auto' }}
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                {/* Backdrop blur overlay */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMegaMenuOpen(false)} />

                <div className="relative mx-auto max-w-[1400px] px-6">
                  <div className="relative bg-white/97 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-white/50 overflow-hidden animate-slide-down">

                    {/* Top accent bar */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

                    <div className="flex">
                      {/* Left sidebar — dark feature panel */}
                      <div className="w-56 bg-brand-primary shrink-0 flex flex-col justify-between p-6">
                        <div>
                          <p className="text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-1">{t('Catálogo')}</p>
                          <h3 className="text-white text-xl font-serif font-bold leading-tight mb-4">{t('Explora nuestras categorías')}</h3>
                          <p className="text-white/50 text-xs leading-relaxed">{t('Encuentra los mejores productos artesanales y de boutique.')}</p>
                        </div>
                        <div className="space-y-2 mt-6">
                          <button
                            onClick={() => { setMegaMenuOpen(false); navigate('/products'); }}
                            className="w-full bg-brand-accent text-brand-primary px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-accent/90 transition-all flex items-center justify-between group"
                          >
                            <span>{t('Ver todo')}</span>
                            <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                          <p className="text-white/30 text-[10px] text-center">{activeCategories.length} {t('categorías')}</p>
                        </div>
                      </div>

                      {/* Right — categories grid */}
                      <div className="flex-1 p-5 overflow-y-auto" style={{ maxHeight: '480px' }}>
                        <div className="grid grid-cols-5 gap-3">
                          {activeCategories.map((cat) => (
                            <button
                              key={cat.key}
                              onClick={() => goToCategory(cat)}
                              className="group relative flex flex-col rounded-xl overflow-hidden bg-gray-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                            >
                              {/* Image */}
                              <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
                                {cat.image ? (
                                  <img
                                    src={cat.image}
                                    alt={getCategoryLabel(cat)}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-3xl bg-gray-100">
                                    {cat.emoji || '🛍️'}
                                  </div>
                                )}
                                {/* Gradient overlay — always visible at bottom */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                {/* Emoji badge */}
                                {cat.emoji && (
                                  <span className="absolute top-2 left-2 text-base leading-none drop-shadow-md">{cat.emoji}</span>
                                )}
                                {/* Arrow on hover */}
                                <div className="absolute bottom-2 right-2 w-6 h-6 bg-brand-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                  <ChevronRightIcon className="w-3 h-3 text-brand-primary" />
                                </div>
                              </div>

                              {/* Label */}
                              <div className="px-2.5 py-2">
                                <p className="text-[11px] font-bold text-gray-800 group-hover:text-brand-primary transition-colors leading-tight">
                                  {getCategoryLabel(cat)}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="border-t border-gray-100 px-6 py-2.5 bg-gray-50/80 flex items-center justify-between">
                      <p className="text-[11px] text-gray-400">{t('Las categorías son actualizadas en tiempo real desde el panel de administración.')}</p>
                      <button
                        onClick={() => { setMegaMenuOpen(false); navigate('/products'); }}
                        className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1"
                      >
                        {t('Ver todos los productos')} <ChevronRightIcon className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Boutiques */}
          <Link
            to="/boutiques"
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'boutiques'
                ? 'bg-black text-white font-semibold'
                : 'text-brand-primary/70 hover:bg-black hover:text-white'
            }`}
          >
            {t('Boutiques')}
          </Link>

          {/* Servicios — mega menú premium */}
          <div className="relative" ref={servicesRef}>
            <button
              onMouseEnter={() => { if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current); setServicesDropdownOpen(true); }}
              onMouseLeave={() => { megaMenuTimeout.current = setTimeout(() => setServicesDropdownOpen(false), 180); }}
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                ['/braids', '/bisuteria', '/custom'].some(p => currentView === p.substring(1))
                  ? 'bg-black text-white font-semibold'
                  : 'text-brand-primary/70 hover:bg-black hover:text-white'
              }`}
            >
              {t('Servicios')}
              <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {servicesDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 z-50 animate-slide-down"
                onMouseEnter={() => { if (megaMenuTimeout.current) clearTimeout(megaMenuTimeout.current); setServicesDropdownOpen(true); }}
                onMouseLeave={() => { megaMenuTimeout.current = setTimeout(() => setServicesDropdownOpen(false), 180); }}
                style={{ width: '680px' }}
              >
                <div className="rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-100/60 bg-white/95 backdrop-blur-xl">
                  <div className="flex">
                    {/* Sidebar oscura */}
                    <div className="w-48 bg-gradient-to-b from-gray-950 to-gray-900 p-5 flex flex-col justify-between shrink-0">
                      <div>
                        <span className="text-brand-accent text-[10px] font-bold uppercase tracking-[0.18em] block mb-3">{t('Servicios')}</span>
                        <h3 className="text-white font-serif text-lg leading-tight mb-3">{t('Arte & Estilo Caribeño')}</h3>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                          {t('Servicios exclusivos en Club Med Punta Cana & Michès.')}
                        </p>
                      </div>
                      <button
                        onClick={() => { setServicesDropdownOpen(false); navigate('/braids'); }}
                        className="mt-4 w-full bg-brand-accent text-brand-primary text-[11px] font-bold py-2.5 px-3 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                      >
                        {t('Reservar Cita')} <ChevronRightIcon className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Grid de servicios */}
                    <div className="flex-1 p-5">
                      <div className="grid grid-cols-3 gap-3">
                        {serviceItems.map((svc) => (
                          <button
                            key={svc.path}
                            onClick={() => { setServicesDropdownOpen(false); navigate(svc.path); }}
                            className="group text-left rounded-xl overflow-hidden border border-gray-100 hover:border-brand-accent/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                          >
                            {/* Image */}
                            <div className="relative h-24 overflow-hidden bg-gray-100">
                              <img
                                src={svc.image}
                                alt={t(svc.titleKey)}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                              <span className="absolute top-1.5 left-1.5 text-sm drop-shadow-sm">{svc.emoji}</span>
                              <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-brand-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                <ChevronRightIcon className="w-2.5 h-2.5 text-brand-primary" />
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-2.5">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-accent block mb-0.5">{t(svc.tagKey)}</span>
                              <p className="text-[11px] font-bold text-gray-800 group-hover:text-brand-primary transition-colors leading-tight mb-1">{t(svc.titleKey)}</p>
                              <p className="text-[10px] text-gray-400 leading-relaxed hidden group-hover:block">{t(svc.descKey)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom strip */}
                  <div className="border-t border-gray-100 px-5 py-2 bg-gray-50/80 flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">{t('Servicio presencial en Club Med Punta Cana & Michès')}</p>
                    <button
                      onClick={() => { setServicesDropdownOpen(false); navigate('/braids'); }}
                      className="text-xs font-bold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1"
                    >
                      {t('Ver todos los servicios')} <ChevronRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gift Cards */}
          <Link
            to="/gift-cards"
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'gift-cards'
                ? 'bg-black text-white font-semibold'
                : 'text-brand-primary/70 hover:bg-black hover:text-white'
            }`}
          >
            {t('Gift Cards')}
          </Link>

          {/* Boutiques — LAST in nav */}
          <Link
            to="/boutiques"
            className={`px-3 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'boutiques'
                ? 'bg-black text-white font-semibold'
                : 'text-brand-primary/70 hover:bg-black hover:text-white'
            }`}
          >
            {t('Boutiques')}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="hidden sm:flex items-center gap-0.5 bg-gray-50 rounded-full px-1 py-0.5">
            {['fr', 'en', 'es'].map((lng) => (
              <button
                key={lng}
                onClick={() => changeLanguage(lng)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition-all duration-200 ${
                  i18n.language === lng
                    ? 'bg-black text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                {lng}
              </button>
            ))}
          </div>
          {/* Order Tracking */}
          <button
            onClick={onOpenTracking}
            className="p-2.5 hover:bg-black hover:text-white rounded-xl transition-all duration-200 text-brand-primary"
            title={t("Rastrear Orden / Cita")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.543-1.59-1.59" />
            </svg>
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 hover:bg-black hover:text-white rounded-xl transition-all duration-200"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-brand-primary text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="xl:hidden p-2 hover:bg-black hover:text-white rounded-xl transition-colors"
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileCatsOpen(false); }}
          >
            {mobileMenuOpen
              ? <XMarkIcon className="w-5 h-5" />
              : <Bars3Icon className="w-5 h-5" />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 max-h-[80vh] overflow-y-auto animate-slide-down">
          <nav className="flex flex-col p-4 gap-1">
            {/* Standard nav items */}
            {navItems.map((item) =>
              item.subItems ? (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="text-brand-muted text-[11px] font-bold uppercase tracking-[0.15em] px-3 pt-3 pb-1">{item.label}</div>
                  <div className="flex flex-col gap-0.5 pl-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                          currentView === sub.path.substring(1)
                            ? 'bg-black text-white font-semibold'
                            : 'text-brand-primary/80 hover:bg-black hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                    currentView === item.path.substring(1) || (item.path === '/' && currentView === 'home')
                      ? 'bg-black text-white font-semibold'
                      : 'text-brand-primary/80 hover:bg-black hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}

            {/* Productos / Categories accordion */}
            <div className="mt-1">
              <button
                onClick={() => setMobileCatsOpen(v => !v)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                  currentView === 'products'
                    ? 'bg-black text-white font-semibold'
                    : 'text-brand-primary/80 hover:bg-black hover:text-white'
                }`}
              >
                <span>{t('Productos')}</span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${mobileCatsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatsOpen && (
                <div className="mt-1 pl-2 grid grid-cols-2 gap-1">
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => goToCategory(cat)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-brand-primary/80 hover:bg-black hover:text-white transition-colors text-left"
                    >
                      <span>{cat.emoji}</span>
                      <span>{getCategoryLabel(cat)}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => { navigate('/products'); setMobileMenuOpen(false); }}
                    className="col-span-2 px-3 py-2 rounded-lg text-sm font-bold text-brand-accent hover:bg-brand-accent/10 transition-colors text-center"
                  >
                    {t('Ver todos los productos')} →
                  </button>
                </div>
              )}
            </div>

            {/* Mobile language switcher */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 px-3">
              {['fr', 'en', 'es'].map((lng) => (
                <button
                  key={lng}
                  onClick={() => changeLanguage(lng)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
                    i18n.language === lng
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-brand-muted'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
