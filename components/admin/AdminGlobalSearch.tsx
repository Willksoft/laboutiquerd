import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, Calendar, User, Scissors, Tag, Box, ShoppingBag, Settings, ArrowRight } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useReservations } from '../../hooks/useReservations';
import { useProducts } from '../../hooks/useProducts';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'order' | 'reservation' | 'product' | 'braid' | 'page';
  icon: React.ReactNode;
  path: string;
}

const ADMIN_PAGES = [
  { name: 'Dashboard', path: '/admin/dashboard', keywords: ['inicio', 'resumen', 'dashboard', 'main'] },
  { name: 'Customizer / Órdenes', path: '/admin/customizer', keywords: ['ordenes', 'pedidos', 'camisetas', 'diseño', 'customizer'] },
  { name: 'Estudio de Trenzas', path: '/admin/braids', keywords: ['trenzas', 'braids', 'calendari', 'citas', 'reservas', 'modelos'] },
  { name: 'Catálogo Boutique', path: '/admin/products', keywords: ['productos', 'catalogo', 'tienda', 'boutique'] },
  { name: 'Marcas', path: '/admin/brands', keywords: ['marcas', 'brands', 'logos'] },
  { name: 'Categorías', path: '/admin/categories', keywords: ['categorias', 'categories'] },
  { name: 'Servicios Menú', path: '/admin/services', keywords: ['servicios', 'menu', 'services'] },
  { name: 'Slider Público', path: '/admin/slider', keywords: ['slider', 'banner', 'carousel', 'imagenes'] },
  { name: 'Contenido Web', path: '/admin/site-content', keywords: ['contenido', 'web', 'site', 'textos', 'hero'] },
  { name: 'Rastreador', path: '/admin/tracking', keywords: ['rastreador', 'tracking', 'seguimiento'] },
  { name: 'Configuración', path: '/admin/settings', keywords: ['configuracion', 'settings', 'ajustes', 'redes', 'social', 'whatsapp'] },
];

const AdminGlobalSearch: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { products } = useProducts();
  const { styles: braidStyles } = useBraidStyles();

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const normalize = (str: string) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const results = useMemo((): SearchResult[] => {
    if (!query || query.length < 2) return [];
    const q = normalize(query);
    const items: SearchResult[] = [];

    // Search pages
    ADMIN_PAGES.forEach(page => {
      const match = normalize(page.name).includes(q) || page.keywords.some(k => k.includes(q));
      if (match) {
        items.push({
          id: `page-${page.path}`,
          title: page.name,
          subtitle: t('Ir a módulo'),
          type: 'page',
          icon: <Settings size={14} className="text-gray-400" />,
          path: page.path,
        });
      }
    });

    // Search orders (by client name, id, room)
    orders.forEach(order => {
      const match = normalize(order.clientName).includes(q) ||
        normalize(order.id).includes(q) ||
        (order.room && normalize(order.room).includes(q));
      if (match) {
        items.push({
          id: `order-${order.id}`,
          title: order.clientName,
          subtitle: `${t('Orden')} • ${order.status} • RD$${order.total.toFixed(2)}`,
          type: 'order',
          icon: <ShoppingBag size={14} className="text-brand-accent" />,
          path: '/admin/customizer',
        });
      }
    });

    // Search reservations
    reservations.forEach(res => {
      const match = normalize(res.clientName).includes(q) ||
        normalize(res.modelName).includes(q) ||
        (res.room && normalize(res.room).includes(q));
      if (match) {
        items.push({
          id: `res-${res.id}`,
          title: res.clientName,
          subtitle: `${t('Cita')} • ${res.date} ${res.time} • ${res.modelName}`,
          type: 'reservation',
          icon: <Calendar size={14} className="text-blue-500" />,
          path: '/admin/braids',
        });
      }
    });

    // Search products
    products.forEach(product => {
      const match = normalize(product.name).includes(q) ||
        normalize(product.description || '').includes(q);
      if (match) {
        items.push({
          id: `product-${product.id}`,
          title: product.name,
          subtitle: `${t('Producto')} • RD$${product.price.toFixed(2)}`,
          type: 'product',
          icon: <Box size={14} className="text-emerald-500" />,
          path: '/admin/products',
        });
      }
    });

    // Search braid styles
    braidStyles.forEach(style => {
      const match = normalize(style.name).includes(q) ||
        normalize(style.description || '').includes(q);
      if (match) {
        items.push({
          id: `braid-${style.id}`,
          title: style.name,
          subtitle: `${t('Modelo de Trenza')} • ${style.category || 'Damas'}`,
          type: 'braid',
          icon: <Scissors size={14} className="text-purple-500" />,
          path: '/admin/braids',
        });
      }
    });

    return items.slice(0, 15); // Limit results
  }, [query, orders, reservations, products, braidStyles, t]);

  const goTo = useCallback((path: string) => {
    setOpen(false);
    setQuery('');
    navigate(path);
  }, [navigate]);

  return (
    <>
      {/* Search Trigger */}
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-400 transition-colors border border-transparent hover:border-gray-300"
      >
        <Search size={16} />
        <span className="hidden md:inline">{t('Buscar...')}</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white rounded text-[10px] font-bold text-gray-400 border border-gray-200 shadow-sm">
          Ctrl+K
        </kbd>
      </button>

      {/* Search Modal Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]">
          <div
            ref={containerRef}
            className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in-50 zoom-in-95"
            style={{ animation: 'fadeIn 0.15s ease-out' }}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search size={20} className="text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('Buscar órdenes, citas, productos, módulos...')}
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
                autoComplete="off"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => { setOpen(false); setQuery(''); }}
                className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded border border-gray-200"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
              {query.length < 2 ? (
                <div className="p-8 text-center text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">{t('Escribe al menos 2 caracteres')}</p>
                  <p className="text-xs mt-1">{t('Busca por nombre de cliente, producto, modelo de trenza o módulo')}</p>
                </div>
              ) : results.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <X size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-bold">{t('Sin resultados para')} "{query}"</p>
                </div>
              ) : (
                <div className="p-2">
                  {results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-accent/10">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400 truncate">{item.subtitle}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-accent transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
              <span>{results.length} {t('resultados')}</span>
              <span className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-bold">↑↓</kbd> {t('navegar')}
                <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200 font-bold">Enter</kbd> {t('abrir')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGlobalSearch;
