import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <div className="relative mb-8">
          <span className="text-[180px] md:text-[220px] font-black text-gray-100 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-24 h-24 text-brand-accent opacity-30" fill="currentColor">
              <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-serif font-bold text-brand-primary mb-3">
          {t('Página no encontrada')}
        </h1>
        <p className="text-gray-500 mb-10 text-sm leading-relaxed max-w-sm mx-auto">
          {t('Lo sentimos, la página que buscas no existe o fue movida. Puedes volver al inicio o explorar nuestros productos.')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-brand-accent font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20"
          >
            <Home size={18} /> {t('Ir al Inicio')}
          </button>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 px-6 py-3 bg-white text-brand-primary font-bold rounded-xl border-2 border-brand-primary/20 hover:border-brand-primary/40 transition-all"
          >
            <ShoppingBag size={18} /> {t('Ver Productos')}
          </button>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 text-gray-500 font-medium hover:text-brand-primary transition-colors"
          >
            <ArrowLeft size={18} /> {t('Volver')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
