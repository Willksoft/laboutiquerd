import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OFFERS as DEFAULT_OFFERS } from '../constants';
import { fetchOffers } from '../lib/appwrite';
import { Offer } from '../types';

interface HeroProps {}

const Hero: React.FC<HeroProps> = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Fetch offers from Appwrite
  useEffect(() => {
    fetchOffers()
      .then((docs) => {
        const mapped: Offer[] = docs.map((d: any) => ({
          id: d.$id,
          title: d.title,
          subtitle: d.subtitle || '',
          image: d.image || '',
          discount: d.discount || '',
        }));
        if (mapped.length > 0) setOffers(mapped);
      })
      .catch(() => {/* use defaults */});
  }, []);

  useEffect(() => {
    if (offers.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [offers.length]);

  const offer = offers[currentSlide];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/offers?q=' + encodeURIComponent(searchQuery));
    }
  };

  return (
    <div className="relative w-full bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[420px] md:min-h-[480px] items-center py-10 lg:py-8">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            {/* Breadcrumb style label */}
            <div className="flex items-center gap-2 text-xs font-medium text-brand-muted mb-6">
              <span className="font-bold text-sm" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>Boutique</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-4 h-4 text-black" fill="currentColor"><path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/></svg>
              <span>•</span>
              <span className="font-bold text-brand-primary">{t('Ofertas')}</span>
            </div>

            {/* Title */}
            <h1 
              key={currentSlide + '-title'}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-primary mb-5 leading-[1.1] tracking-tight animate-fade-in-up"
            >
              {t(offer.title)}
            </h1>

            {/* Subtitle */}
            <p 
              key={currentSlide + '-sub'}
              className="text-base md:text-lg text-brand-muted mb-6 leading-relaxed max-w-md animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              {t(offer.subtitle)}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative flex items-center">
                <MagnifyingGlassIcon className="absolute left-4 w-5 h-5 text-brand-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('Buscar productos, servicios...')}
                  className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-full text-sm text-brand-primary placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all shadow-card"
                />
                <button 
                  type="submit"
                  className="absolute right-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-accent hover:text-brand-primary transition-all duration-300"
                >
                  {t('Buscar')}
                </button>
              </div>
            </form>

            {/* CTA + Scroll indicator */}
            <div className="flex items-center gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <button 
                onClick={() => navigate('/offers')}
                className="inline-flex items-center gap-2 bg-black text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-brand-accent hover:text-brand-primary transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('Ver Ofertas')}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              
              {/* Slide indicators */}
              <div className="hidden md:flex items-center gap-3">
                {offers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-500 rounded-full ${
                      currentSlide === idx 
                        ? 'bg-black w-8 h-2.5' 
                        : 'bg-brand-primary/20 w-2.5 h-2.5 hover:bg-brand-primary/40'
                    }`}
                  />
                ))}
                <span className="text-brand-muted text-xs font-medium ml-2">
                  {String(currentSlide + 1).padStart(2, '0')} / {String(offers.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] shadow-glass-lg">
              {offers.map((o, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentSlide === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={o.image}
                    alt={o.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay bottom with title */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-20">
                    <div className="flex items-end justify-between">
                      <span className="text-white font-serif text-xl font-bold">{t(o.title)}</span>
                      <button 
                        onClick={() => navigate('/offers')}
                        className="w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
