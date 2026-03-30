import { useState, useEffect } from 'react';
import ProductSidebar from './ProductSidebar';
import { Product } from '../types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import SEO from './SEO';

interface ProductPageLayoutProps {
  title: string;
  subtitle?: string;
  products: Product[];
  t: (key: string) => string;
  onViewProduct: (product: Product) => void;
  accentColor?: string;
}

export default function ProductPageLayout({ 
  title, subtitle, products, t, onViewProduct, accentColor = '#d4af37' 
}: ProductPageLayoutProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
    <div className="pt-8 pb-16">
      <SEO title={title} description={subtitle} url={`/${title.toLowerCase()}`} />
      
      {/* Page Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">{title}</h1>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>

      {/* Content: Sidebar + Grid */}
      <div className="container mx-auto px-4 flex gap-8">
        {/* Sidebar */}
        <ProductSidebar 
          products={products} 
          onFilter={setFilteredProducts} 
          t={t} 
        />

        {/* Product Grid */}
        <div className="flex-1">
          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {filteredProducts.length === products.length 
                ? `${products.length} ${t('productos')}` 
                : `${filteredProducts.length} de ${products.length} ${t('productos')}`
              }
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-400 text-lg">{t('No se encontraron productos con estos filtros.')}</p>
              <button 
                onClick={() => setFilteredProducts(products)}
                className="mt-4 text-brand-primary font-medium text-sm hover:underline"
              >
                {t('Limpiar filtros')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => onViewProduct(p)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img 
                      src={p.image} 
                      alt={t(p.name)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    {p.tags && p.tags[0] && (
                      <div 
                        className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                        style={{ backgroundColor: accentColor, color: accentColor === '#d4af37' ? '#000' : '#fff' }}
                      >
                        {t(p.tags[0])}
                      </div>
                    )}
                    {p.originalPrice && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute bottom-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <ArrowRightIcon className="w-4 h-4 text-brand-primary" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-brand-primary transition-colors">{t(p.name)}</h3>
                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{t(p.description)}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-primary">RD${p.price.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                      {p.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">RD${p.originalPrice.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
