import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Scissors, ZoomIn, X, Images } from 'lucide-react';
import { useBraidStyles } from '../hooks/useBraidStyles';

const CATEGORIES = ['Todos', 'Damas'];


const BraidsGalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { styles: allModels, loading } = useBraidStyles();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightbox, setLightbox] = useState<{ src: string; name: string } | null>(null);

  const getTranslatedText = (obj: any, field: string) => {
    if (i18n.language.startsWith('en')) {
      const enField = field === 'name' ? 'nameEn' : 'descEn';
      if (obj[enField]) return obj[enField];
    } else if (i18n.language.startsWith('fr')) {
      const frField = field === 'name' ? 'nameFr' : 'descFr';
      if (obj[frField]) return obj[frField];
    }
    return t(obj[field] || '');
  };

  const visibleModels = useMemo(() => {
    return allModels
      .filter(m => m.isVisible !== false)
      .filter(m => activeCategory === 'Todos' || (m.category || 'Damas') === activeCategory)
      .filter(m => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          (m.description || '').toLowerCase().includes(q)
        );
      });
  }, [allModels, activeCategory, search]);

  return (
    <div className="min-h-screen bg-brand-cream pb-20">

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          <div className="text-center" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.name}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white/80 font-bold mt-4 text-lg">{lightbox.name}</p>
          </div>
        </div>
      )}

      {/* Hero header */}
      <div className="bg-brand-primary text-white py-14 px-4">
        <div className="container mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/braids')}
            className="flex items-center gap-2 text-white/60 hover:text-brand-accent transition-colors text-sm font-medium mb-6 group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('backToBooking', 'Volver a Reservas')}
          </button>

          <div className="flex items-center gap-3 mb-3">
            <span className="bg-brand-accent/20 text-brand-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-accent/30">
              {t('Catálogo Visual')}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-3 flex items-center gap-3">
            <Scissors className="text-brand-accent" size={36} />
            {t('galleryTitle', 'Galería de Modelos')}
          </h1>
          <p className="text-white/60 max-w-xl text-[15px]">
            {t('gallerySubtitle', 'Explora todos nuestros modelos de trenzas caribeñas. Haz clic en cualquier foto para ampliarla.')}
          </p>
        </div>
      </div>

      {/* Sticky filters */}
      <div className="sticky top-0 z-30 bg-brand-cream/95 backdrop-blur-sm border-b border-black/5 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('Buscar modelo...')}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/40 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary/30'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          {/* Count */}
          <span className="text-xs text-gray-400 font-medium sm:ml-auto whitespace-nowrap">
            {visibleModels.length} {t('modelos')}
          </span>
        </div>
      </div>

      {/* Gallery grid */}
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : visibleModels.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <Scissors size={48} className="mx-auto mb-4 opacity-30" />
            <p className="font-bold text-lg">{t('No se encontraron modelos')}</p>
            <button onClick={() => { setSearch(''); setActiveCategory('Todos'); }} className="mt-3 text-sm text-brand-primary underline">
              {t('Ver todos')}
            </button>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {visibleModels.map(model => (
              <div
                key={model.id}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                onClick={() => setLightbox({ src: model.image, name: getTranslatedText(model, 'name') })}
              >
                <img
                  src={model.image}
                  alt={getTranslatedText(model, 'name')}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <ZoomIn size={20} className="text-white absolute top-3 right-3 opacity-80" />
                  <p className="text-white font-bold text-sm leading-tight">
                    {getTranslatedText(model, 'name')}
                  </p>
                  {model.description && (
                    <p className="text-white/70 text-[11px] mt-0.5 line-clamp-2">
                      {getTranslatedText(model, 'description')}
                    </p>
                  )}
                  {model.category && (
                    <span className="inline-block mt-1.5 text-[10px] bg-brand-accent/90 text-brand-primary font-bold px-2 py-0.5 rounded-full w-fit">
                      {model.category}
                    </span>
                  )}
                </div>

                {/* Sold-out badge */}
                {(model as any).isSoldOut && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    AGOTADO
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center px-4">
        <p className="text-gray-500 mb-4">{t('galleryFoundStyle', '¿Encontraste tu estilo ideal?')}</p>
        <button
          onClick={() => navigate('/braids')}
          className="bg-brand-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-brand-primary/90 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
        >
          <Scissors size={18} />
          {t('goBookAppointment', 'Ir a Reservar mi Cita')}
        </button>
      </div>
    </div>
  );
};

export default BraidsGalleryPage;
