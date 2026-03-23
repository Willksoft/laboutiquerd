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
    { label: t('Boutiques'), path: '/boutiques' },
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

        {/* Desktop Nav */}
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

            {/* Mega Menu Panel */}
            {megaMenuOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[780px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slide-down z-50"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
              >
                {/* Header strip */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t('Todas las Categorías')}</span>
                  <button
                    onClick={() => { setMegaMenuOpen(false); navigate('/products'); }}
                    className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                  >
                    {t('Ver todos los productos')} <ChevronRightIcon className="w-3 h-3" />
                  </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-5 gap-0 p-4">
                  {activeCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => goToCategory(cat)}
                      className="group flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 text-center"
                    >
                      {/* Category image */}
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100 relative">
                        <img
                          src={cat.image}
                          alt={getCategoryLabel(cat)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-xl" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 group-hover:text-brand-primary leading-tight">
                        {getCategoryLabel(cat)}
                      </span>
                    </button>
                  ))}
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

          {/* Servicios dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
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
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-glass-lg py-2 animate-slide-down border border-gray-100">
                {navItems[3].subItems!.map((sub) => (
                  <Link
                    key={sub.path}
                    to={sub.path}
                    onClick={() => setServicesDropdownOpen(false)}
                    className={`block px-4 py-2.5 text-sm transition-colors ${
                      currentView === sub.path.substring(1) ? 'text-white bg-black font-semibold' : 'text-brand-primary/70 hover:bg-black hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
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
