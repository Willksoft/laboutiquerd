import React from 'react';
import { useTranslation } from 'react-i18next';
import { useBrands } from '../hooks/useBrands';

const Brands: React.FC = () => {
  const { t } = useTranslation();
  const { brands } = useBrands();
  
  const visibleBrands = brands.filter(b => b.isVisible !== false);

  if (visibleBrands.length === 0) return null;

  return (
    <section className="py-16 bg-white border-y border-gray-100 mt-12 mb-8 overflow-hidden">
      {/* Estilos para la animación de scroll infinito */}
      <style>{`
        .animate-marquee {
          display: flex;
          width: fit-content;
          animation: marquee 40s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Pausar animación al pasar el mouse */
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container mx-auto px-4 mb-10">
        <div className="text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{t('Nuestras Marcas')}</span>
            <h3 className="text-2xl font-serif font-bold text-brand-primary mt-2">{t('Colecciones Exclusivas')}</h3>
        </div>
      </div>
      
      {/* Contenedor de la Marquesina */}
      <div className="w-full overflow-hidden mask-linear-fade">
          <div className="animate-marquee">
              {/* Conjunto Original */}
              <div className="flex items-center gap-16 px-8 shrink-0">
                  {visibleBrands.map((brand, idx) => (
                    <div key={`${brand.name}-1-${idx}`} className="flex items-center justify-center transition-all duration-300 cursor-pointer min-w-[100px]">
                        {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                            <img src={brand.logo} alt={brand.name} className="h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" />
                        ) : (
                            <span className={`text-xl md:text-2xl whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity ${brand.logo || 'font-bold text-gray-800'}`}>
                              {brand.name}
                            </span>
                        )}
                    </div>
                  ))}
              </div>
              
              {/* Conjunto Duplicado para el bucle infinito */}
              <div className="flex items-center gap-16 px-8 shrink-0">
                  {visibleBrands.map((brand, idx) => (
                    <div key={`${brand.name}-2-${idx}`} className="flex items-center justify-center transition-all duration-300 cursor-pointer min-w-[100px]">
                        {brand.logo && (brand.logo.startsWith('http') || brand.logo.startsWith('/')) ? (
                            <img src={brand.logo} alt={brand.name} className="h-12 object-contain opacity-60 hover:opacity-100 transition-opacity" />
                        ) : (
                            <span className={`text-xl md:text-2xl whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity ${brand.logo || 'font-bold text-gray-800'}`}>
                              {brand.name}
                            </span>
                        )}
                    </div>
                  ))}
              </div>
          </div>
      </div>
    </section>
  );
};

export default Brands;