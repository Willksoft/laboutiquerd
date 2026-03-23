import React from 'react';
import { useTranslation } from 'react-i18next';

const BRANDS = [
  { 
    name: '45', 
    fontClass: 'font-bold tracking-widest text-[#4A3D2A]'
  },
  { 
    name: 'Collection Club Med', 
    fontClass: 'font-serif font-bold tracking-widest text-brand-primary'
  },
  { 
    name: 'Quiksilver', 
    fontClass: 'font-sans font-black tracking-tighter text-red-600'
  },
  { 
    name: 'Billabong', 
    fontClass: 'font-sans font-bold italic tracking-wide text-gray-800'
  },
  { 
    name: 'Vilebrequin', 
    fontClass: 'font-sans font-black uppercase tracking-wide text-blue-900'
  },
  { 
    name: 'Sundek', 
    fontClass: 'font-sans font-bold text-orange-500 uppercase'
  },
  { 
    name: 'Banana Moon', 
    fontClass: 'font-cursive text-2xl md:text-3xl text-pink-500'
  },
  { 
    name: 'Havaianas', 
    fontClass: 'font-sans font-black text-yellow-500 tracking-wider'
  },
  { 
    name: 'Livia', 
    fontClass: 'font-serif italic font-bold text-gray-700'
  },
  { 
    name: 'Carbon', 
    fontClass: 'font-mono font-bold uppercase tracking-tighter text-gray-900'
  },
  { 
    name: 'Happy & So', 
    fontClass: 'font-handwriting text-xl font-bold text-purple-900'
  },
  { 
    name: 'Gold & Silver', 
    fontClass: 'font-serif font-bold text-yellow-600'
  },
  { 
    name: 'Kreoli Bijoux', 
    fontClass: 'font-sans font-light tracking-[0.2em] uppercase text-gray-800'
  },
  { 
    name: 'Cacatoès', 
    fontClass: 'font-sans font-black uppercase text-green-600'
  },
  { 
    name: 'Hipanema', 
    fontClass: 'font-serif font-bold text-red-500 tracking-wider'
  }
];

const Brands: React.FC = () => {
  const { t } = useTranslation();
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
                  {BRANDS.map((brand, idx) => (
                    <div key={`${brand.name}-1-${idx}`} className="flex items-center justify-center transition-all duration-300 cursor-pointer min-w-[100px]">
                        <span className={`text-xl md:text-2xl whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity ${brand.fontClass}`}>
                          {brand.name}
                        </span>
                    </div>
                  ))}
              </div>
              
              {/* Conjunto Duplicado para el bucle infinito */}
              <div className="flex items-center gap-16 px-8 shrink-0">
                  {BRANDS.map((brand, idx) => (
                    <div key={`${brand.name}-2-${idx}`} className="flex items-center justify-center transition-all duration-300 cursor-pointer min-w-[100px]">
                        <span className={`text-xl md:text-2xl whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity ${brand.fontClass}`}>
                          {brand.name}
                        </span>
                    </div>
                  ))}
              </div>
          </div>
      </div>
    </section>
  );
};

export default Brands;