import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { Product } from '../types';

interface ProductDetailPageProps {
  products: Product[];
  onCustomize?: (product: Product) => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ products, onCustomize }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const product = products.find(p => p.id === id);

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

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-brand-primary mb-2">{t('Producto no encontrado')}</h2>
        <p className="text-gray-500 mb-6">{t('El producto que buscas no existe o fue eliminado.')}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-brand-primary font-semibold hover:underline"
        >
          <ArrowLeftIcon className="w-4 h-4" /> {t('Volver')}
        </button>
      </div>
    );
  }

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const categoryLabel: Record<string, string> = {
    jewelry: 'Joyería',
    crafts: 'Artesanía',
    fashion: 'Moda',
    toys: 'Juguetes',
    'personal-care': 'Cuidado Personal',
    bisuteria: 'Bisutería',
    custom: 'Personalizado',
    'boutique-pc': 'Boutique Punta Cana',
    'boutique-miches': 'Boutique Michès',
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Breadcrumb / Back */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-brand-primary hover:text-brand-accent font-medium transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('Volver al catálogo')}
          </button>
          <span>/</span>
          <span className="text-gray-400">{t(categoryLabel[product.category] || product.category)}</span>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-[200px]">{getTranslatedText(product, 'name')}</span>
        </nav>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Image Column */}
            <div className="relative lg:w-1/2 min-h-[320px] lg:min-h-[520px] bg-gray-100">
              <img
                src={product.image}
                alt={getTranslatedText(product, 'name')}
                className="w-full h-full object-cover absolute inset-0"
                style={{ maxHeight: 600 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                {product.tags?.map(tag => (
                  !tag.startsWith('RD$') && (
                    <span key={tag} className="badge badge-gold backdrop-blur-sm text-xs px-3 py-1">
                      {t(tag)}
                    </span>
                  )
                ))}
                {discountPct && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">

              {/* Category badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-muted uppercase tracking-[0.12em] border border-gray-200 px-3 py-1.5 rounded-full">
                  <TagIcon className="w-3 h-3" />
                  {t(categoryLabel[product.category] || product.category)}
                </span>
              </div>

              {/* Name */}
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-brand-primary leading-tight mb-5">
                {getTranslatedText(product, 'name')}
              </h1>

              {/* Fake Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[1,2,3,4,5].map(s => (
                  <StarIcon key={s} className="w-4 h-4 text-amber-400" />
                ))}
                <span className="text-xs text-gray-400 ml-1">(4.9)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
                <span className="text-4xl font-display font-bold text-brand-primary tracking-tight">
                  RD${product.price.toLocaleString('en', { minimumFractionDigits: 2 })}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through mb-1">
                    RD${product.originalPrice.toLocaleString('en', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-8 flex-1">
                <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3">
                  {t('Descripción')}
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {getTranslatedText(product, 'description')}
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-3">
                {product.category === 'custom' && onCustomize ? (
                  <button
                    onClick={() => onCustomize(product)}
                    className="w-full bg-brand-primary text-white font-bold py-4 rounded-2xl hover:bg-brand-primary/90 transition-all duration-200 flex items-center justify-center gap-2 text-sm tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    ✏️ {t('Personalizar este producto')}
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 text-center">
                    <p className="text-sm font-semibold text-brand-primary">
                      {t('¿Te interesa este producto?')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      {t('Visítanos en nuestra tienda física o contáctanos para consultar disponibilidad.')}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-colors text-sm"
                >
                  ← {t('Ver más productos')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related products (same category) */}
        {(() => {
          const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
          if (related.length === 0) return null;
          return (
            <div className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-brand-primary mb-6">{t('Productos relacionados')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {related.map(rp => (
                  <div
                    key={rp.id}
                    onClick={() => navigate(`/product/${rp.id}`)}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img src={rp.image} alt={t(rp.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-primary transition-colors line-clamp-2">{t(rp.name)}</p>
                      <p className="text-sm font-bold text-brand-primary mt-1">RD${rp.price.toLocaleString('en', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default ProductDetailPage;
