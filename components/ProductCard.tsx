import React from 'react';
import { ChevronRightIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onCustomize?: (product: Product) => void;
  onView?: (product: Product) => void;
  variant?: 'default' | 'overlay' | 'minimal' | 'horizontal';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize, onView, variant = 'default' }) => {
  const { t, i18n } = useTranslation();

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

  // === VARIANT: OVERLAY — Club Med style (image fills card, title at bottom) ===
  if (variant === 'overlay') {
    return (
      <div 
        className={`group relative rounded-3xl overflow-hidden h-[400px] md:h-[450px] ${product.isSoldOut ? 'cursor-not-allowed opacity-90' : 'cursor-pointer hover-lift'}`}
        onClick={() => !product.isSoldOut && onView && onView(product)}
      >
        <img 
          src={product.image} 
          alt={getTranslatedText(product, 'name')}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${!product.isSoldOut ? 'group-hover:scale-105' : 'grayscale'}`}
        />
        {product.isSoldOut && (
            <div className="absolute inset-x-0 inset-y-0 z-10 flex items-center justify-center backdrop-blur-sm bg-white/10">
                <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">Agotado</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            {product.tags.map(tag => (
              <span key={tag} className="bg-brand-accent text-brand-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {t(tag)}
              </span>
            ))}
          </div>
        )}

        {product.originalPrice && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-serif text-xl font-bold text-white mb-1 leading-tight">{getTranslatedText(product, 'name')}</h3>
          <div className="flex items-end justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-white/50 text-xs line-through mr-2">RD${product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-white font-bold text-lg">RD${product.price.toFixed(2)}</span>
            </div>
            <button className="w-10 h-10 rounded-full border-2 border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300 group-hover:border-white">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === VARIANT: MINIMAL — Clean card, no image overlay ===
  if (variant === 'minimal') {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden hover-lift flex flex-col h-full">
        <div 
          className={`relative aspect-square overflow-hidden ${product.isSoldOut ? 'cursor-not-allowed grayscale' : 'cursor-pointer'}`}
          onClick={() => !product.isSoldOut && onView && onView(product)}
        >
          <img 
            src={product.image} 
            alt={getTranslatedText(product, 'name')}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${!product.isSoldOut ? 'group-hover:scale-105' : ''}`}
          />
          {product.isSoldOut && (
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20">
                  <span className="bg-red-500 text-[10px] text-white font-black px-3 py-1.5 uppercase tracking-widest rounded-lg shadow-lg border border-white -rotate-12">Agotado</span>
              </div>
          )}
          {product.originalPrice && (
            <div className="absolute top-3 right-3 bg-brand-accent text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-sans font-semibold text-sm text-brand-primary mb-1">{getTranslatedText(product, 'name')}</h3>
          <p className="text-xs text-brand-muted line-clamp-1 mb-3">{getTranslatedText(product, 'description')}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-brand-primary">RD${product.price.toFixed(2)}</span>
            <button 
              onClick={() => onView && onView(product)}
              className="text-xs font-semibold text-brand-muted hover:text-black transition-colors underline underline-offset-2"
            >
              {t('Ver')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === VARIANT: HORIZONTAL — side-by-side image + info ===
  if (variant === 'horizontal') {
    return (
      <div 
        className="group flex bg-white rounded-2xl overflow-hidden hover-lift border border-gray-100/80 shadow-card cursor-pointer"
        onClick={() => onView && onView(product)}
      >
        <div className="w-1/3 overflow-hidden">
          <img 
            src={product.image} 
            alt={getTranslatedText(product, 'name')}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 p-5 flex flex-col justify-center">
          {product.tags && product.tags.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              {product.tags.map(tag => (
                <span key={tag} className="bg-brand-sage/15 text-brand-sage text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {t(tag)}
                </span>
              ))}
            </div>
          )}
          <h3 className="font-serif font-bold text-lg text-brand-primary mb-1">{getTranslatedText(product, 'name')}</h3>
          <p className="text-xs text-brand-muted line-clamp-2 mb-3">{getTranslatedText(product, 'description')}</p>
          <span className="font-bold text-brand-primary text-lg">RD${product.price.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  // === DEFAULT VARIANT ===
  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover-lift border border-gray-100/80 flex flex-col h-full shadow-card">
      {/* Image */}
      <div 
        className={`relative aspect-[4/5] overflow-hidden ${product.isSoldOut ? 'cursor-not-allowed grayscale opacity-90' : 'cursor-pointer'}`}
        onClick={() => !product.isSoldOut && onView && onView(product)}
      >
        <img 
          src={product.image} 
          alt={getTranslatedText(product, 'name')}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${!product.isSoldOut ? 'group-hover:scale-105' : ''}`}
        />
        {product.isSoldOut && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-20">
                <span className="bg-red-500 text-xs text-white font-black px-4 py-1.5 uppercase tracking-widest rounded-lg shadow-lg border border-white -rotate-12">Agotado</span>
            </div>
        )}
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.tags.map(tag => (
              <span key={tag} className="bg-brand-accent text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {t(tag)}
              </span>
            ))}
          </div>
        )}

        {/* Discount badge */}
        {product.originalPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <h3 className="font-sans font-semibold text-[15px] text-brand-primary leading-tight mb-1">{getTranslatedText(product, 'name')}</h3>
          <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed">{getTranslatedText(product, 'description')}</p>
        </div>
        
        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[11px] text-brand-muted line-through">RD${product.originalPrice.toFixed(2)}</span>
            )}
            <span className="font-bold text-brand-primary text-lg tracking-tight">RD${product.price.toFixed(2)}</span>
          </div>
          
          {product.category === 'custom' && onCustomize && !product.isSoldOut ? (
            <button 
              onClick={() => onCustomize(product)}
              className="flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brand-accent hover:text-brand-primary transition-all duration-200 shadow-sm"
            >
              <SwatchIcon className="w-3.5 h-3.5" />
              {t('Personalizar')}
            </button>
          ) : !product.isSoldOut ? (
            <button 
              onClick={() => onView && onView(product)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-brand-primary/70 rounded-full text-xs font-semibold hover:bg-black hover:text-white transition-all duration-200"
            >
              {t('Ver')}
              <ChevronRightIcon className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-full text-xs font-semibold">
              AGOTADO
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
