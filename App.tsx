import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  TicketIcon, 
  SwatchIcon, 
  ScissorsIcon, 
  SparklesIcon as GemIcon, 
  GiftIcon, 
  ArrowRightIcon,
  QrCodeIcon, 
  PencilSquareIcon,
  CheckIcon,
  ArrowLeftIcon,
  StarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ReceiptPercentIcon,
  EyeIcon,
  SunIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Customizer from './components/Customizer';
import UniversalCustomizer from './components/UniversalCustomizer';
import BraidsBooking from './components/BraidsBooking';
import ModelGallery from './components/ModelGallery'; 
import TicketPage from './components/TicketPage'; 
import Brands from './components/Brands'; 
import CheckoutPage from './components/CheckoutPage';
import CartPage from './components/CartPage';
import OrderTracking from './components/OrderTracking';
import ProductPageLayout from './components/ProductPageLayout';
import { ToastContainer } from './components/Toast';

import AdminLayout from './components/admin/AdminLayout';
import AdminGuard from './components/admin/AdminGuard';
import AdminLogin from './components/admin/AdminLogin';
import Dashboard from './components/admin/Dashboard';
import CustomizerAdmin from './components/admin/CustomizerAdmin';
import BraidsAdmin from './components/admin/BraidsAdmin';
import AdminProducts from './components/admin/Products';
import AdminSettings from './components/admin/Settings';
import AdminReceiptPage from './components/admin/AdminReceiptPage';
import BrandsAdmin from './components/admin/BrandsAdmin';
import SliderAdmin from './components/admin/SliderAdmin';
import SiteContentAdmin from './components/admin/SiteContentAdmin';
import AdminTracking from './components/admin/AdminTracking';
import NotFound from './components/NotFound';

import { useProducts } from './hooks/useProducts';
import { useSiteContent } from './hooks/useSiteContent';
import { Product, CartItem, Category, LogoStyle, TShirtPreset } from './types';

function App() {
  const { products: allProducts } = useProducts();
  const PRODUCTS = allProducts.filter(p => p.isVisible !== false);
  const ALL_PRODUCTS = allProducts;

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { content } = useSiteContent();
  const currentView = location.pathname.substring(1) || 'home';


  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Customization State
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  
  // Gift Card Modal State
  const [selectedGiftCard, setSelectedGiftCard] = useState<Product | null>(null);

  // Lock body scroll when gift card modal is open
  useEffect(() => {
    if (selectedGiftCard) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [selectedGiftCard]);

  // New State variables for Preset handling
  const [selectedModelStyle, setSelectedModelStyle] = useState<LogoStyle>('classic');
  const [selectedPresetColor, setSelectedPresetColor] = useState<{name: string, value: string} | undefined>(undefined);
  const [selectedLogoColor, setSelectedLogoColor] = useState<string | undefined>(undefined);
  
  const [editingItem, setEditingItem] = useState<CartItem | undefined>(undefined);
  const [guestName, setGuestName] = useState<string>('');
  const [guestRoom, setGuestRoom] = useState<string>('');

  // -- Handlers --
  
  const handleAddItem = (item: CartItem, finish: boolean = true) => {
    // Use flushSync to ensure cart state is updated BEFORE navigation
    // Otherwise CheckoutPage renders with empty cart and redirects to /custom
    flushSync(() => {
      setCart(prev => {
        const existingIndex = prev.findIndex(i => i.id === item.id);
        if (existingIndex >= 0) {
          const newCart = [...prev];
          newCart[existingIndex] = item;
          return newCart;
        }
        return [...prev, item];
      });
    });

    if (finish) {
      if (editingItem && editingItem.id === item.id) {
         setEditingItem(undefined);
      }
      navigate('/checkout');
      setTimeout(() => setCustomizingProduct(null), 50);
    }
  };

  const handleCustomizeStart = (product: Product) => {
     setEditingItem(undefined);
     setCustomizingProduct(product);
     
     if (product.id === 'p2') {
        navigate('/model-gallery');
     } else {
        navigate('/universal-designer');
     }
  };

  const handleViewProduct = (product: Product) => {
     // If it's a custom product, go to customizer. If not, open read-only modal.
     if (product.category === 'custom') {
        handleCustomizeStart(product);
     } else {
        setViewingProduct(product);
     }
  };

  const handlePresetSelect = (preset: TShirtPreset, name?: string, room?: string) => {
      setSelectedModelStyle(preset.logoStyle);
      setSelectedPresetColor({ name: preset.baseColorName, value: preset.baseColorValue });
      setSelectedLogoColor(preset.defaultLogoColor);
      if (name) setGuestName(name);
      if (room) setGuestRoom(room);
      navigate('/designer');
  };

  const handleEditItem = (item: CartItem) => {
    const productId = item.id.split('-')[0];
    const originalProduct = PRODUCTS.find(p => p.id === productId);
    
    if (originalProduct) {
      setEditingItem(item);
      setCustomizingProduct(originalProduct);
      


      if (productId === 'p2') {
          if (item.details?.logoStyle) {
              setSelectedModelStyle(item.details.logoStyle);
          }
          if (item.details?.logoColor) {
             setSelectedLogoColor(item.details.logoColor);
          } else {
             setSelectedLogoColor(undefined);
          }
          navigate('/designer');
      } else {
          navigate('/universal-designer');
      }
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
  };


  // -- Render Helpers --

  const renderCategorySection = (category: Category, title: string, icon: React.ReactNode) => {
    const categoryProducts = PRODUCTS.filter(p => p.category === category);
    if (categoryProducts.length === 0) return null;
    
    return (
      <section className="py-12 px-4 container mx-auto">
        <div className="flex items-center gap-3 mb-8">
           <div className="p-2.5 bg-brand-accent/10 rounded-xl text-brand-accent">{icon}</div>
           <h2 className="text-3xl font-serif font-bold text-brand-primary tracking-tight">{title}</h2>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${categoryProducts.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
          {categoryProducts.map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onCustomize={handleCustomizeStart}
              onView={handleViewProduct}
            />
          ))}
        </div>
      </section>
    );
  };

  const renderPersonalCareSection = () => {
    const pcProducts = PRODUCTS.filter(p => p.category === 'personal-care');
    return (
      <section className="py-24 bg-brand-sage/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,184,179,0.15),transparent_70%)]"></div>
        <div className="container mx-auto px-4 relative z-10">
           <div className="max-w-2xl mx-auto text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-sage shadow-card mb-5">
                 <SparklesIcon className="w-4 h-4" /> {t('Bienestar Global')}
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary tracking-tight">{t('Cuidado Personal')}</h2>
              <p className="text-brand-muted mt-3 text-lg leading-relaxed">{t('Esenciales de higiene y belleza disponibles en todas nuestras boutiques.')}</p>
              <div className="divider-accent mt-6 mx-auto"></div>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 pt-4">
              {pcProducts.slice(0, 4).map((p, idx) => (
                 <div 
                    key={p.id} 
                    onClick={() => handleViewProduct(p)}
                    className="cursor-pointer group relative"
                 >
                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 relative border border-brand-sage/20 shadow-lg bg-gray-50 mx-auto w-full max-w-[320px]">
                       <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                       <div className="absolute inset-0 bg-brand-sage/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center px-4">
                       <h3 className="font-serif font-bold text-xl text-brand-primary mb-1 line-clamp-1">{t(p.name)}</h3>
                       <p className="text-brand-sage font-bold">RD${p.price.toFixed(2)}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>
    );
  };

  const renderBraidsSection = () => {
     return (
       <section className="min-h-[calc(100vh-80px)] bg-brand-cream py-8 md:py-12 flex flex-col justify-center">
          <div className="container mx-auto px-4 max-w-5xl mb-10">
             <div className="text-center">
                <span className="badge badge-gold px-4 py-1.5 mb-3 inline-block">
                   {t('Servicio Exclusivo')}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-brand-primary tracking-tight">{t(content.braids_title || 'Estudio de Trenzas')}</h1>
                <p className="max-w-xl mx-auto text-lg text-gray-600">{t('Expertas en estilos caribeños y protección capilar. Elige tu estilo y reserva hoy mismo.')}</p>
             </div>
          </div>

          {/* Focus on Booking Widget - Truly Full screen edge-to-edge */}
          <div className="w-full bg-white relative mb-12 border-y border-black/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)]">
              <div className="mx-auto w-full max-w-[1920px]">
                 <BraidsBooking onGenerateTicket={(items) => {
                     // First add them to global cart state
                     items.forEach(i => handleAddItem(i, false));
                     
                     // Generate expected total manually for immediate sync to route
                     const newCartItems = [...cart, ...items];
                     const newTotal = newCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                     
                     navigate('/ticket', { state: { cart: newCartItems, total: newTotal } });
                 }} />
             </div>
          </div>

          <div className="container mx-auto px-4 max-w-5xl">
             {/* Compact Info Row */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 items-center">
                   <div className="text-brand-accent bg-brand-accent/10 p-2 rounded-full"><ClockIcon className="w-5 h-5" /></div>
                   <div>
                      <h4 className="font-bold text-sm text-brand-primary">{t('Atención Puntual')}</h4>
                      <p className="text-xs text-gray-500">{t('Respetamos tu tiempo.')}</p>
                   </div>
                </div>
                <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 items-center">
                   <div className="text-brand-accent bg-brand-accent/10 p-2 rounded-full"><StarIcon className="w-5 h-5" /></div>
                   <div>
                      <h4 className="font-bold text-sm text-brand-primary">{t('Estilistas Expertas')}</h4>
                      <p className="text-xs text-gray-500">{t('Años de experiencia.')}</p>
                   </div>
                </div>
                <div 
                   onClick={() => window.open(`https://wa.me/${content.whatsapp_number || '18091234567'}`, '_blank')}
                   className="flex gap-3 p-4 bg-black text-white rounded-xl shadow-sm border border-gray-100 items-center cursor-pointer hover:bg-black/80 transition-colors"
                >
                   <div className="text-brand-accent bg-brand-accent/20 p-2 rounded-full"><HeartIcon className="w-5 h-5" /></div>
                   <div>
                      <h4 className="font-bold text-sm text-brand-accent">{t('¿Diseño Especial?')}</h4>
                      <p className="text-xs text-white/70">{t('Escríbenos por WhatsApp')}</p>
                   </div>
                </div>
             </div>
          </div>
       </section>
     );
  };

  const renderBisuteriaSection = () => {
     const bisuteria = PRODUCTS.filter(p => p.category === 'bisuteria');

     return (
       <section className="bg-brand-background min-h-screen">
          <div className="container mx-auto px-4 py-12">
             
             {/* Header */}
             <div className="text-center mb-16">
                <span className="section-label justify-center">
                   <GemIcon className="w-4 h-4" /> {t('Hecho a Mano')}
                </span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary tracking-tight">{t('Bisutería & Accesorios')}</h1>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                   {t('Detalles inspirados en la naturaleza. Complementa tu look con piezas únicas de materiales orgánicos y vibrantes.')}
                </p>
             </div>

             {/* Highlight Section */}
             <div className="glass-card p-8 mb-16 flex flex-col md:flex-row items-center gap-8 shadow-glass">
                <div className="flex-1">
                   <h3 className="text-2xl font-bold text-brand-primary mb-2">{t('Perfectos para tus Trenzas')}</h3>
                   <p className="text-gray-600 mb-6">
                      Descubre nuestra colección de "Beads & Cuffs" diseñados específicamente para decorar peinados trenzados. Resistentes al agua y al sol.
                   </p>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-white px-3 py-1.5 rounded-full shadow-card">
                         <CheckIcon className="w-3.5 h-3.5" /> {t('No se oxidan')}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-brand-primary bg-white px-3 py-1.5 rounded-full shadow-card">
                         <CheckIcon className="w-3.5 h-3.5" /> {t('Hipoalergénicos')}
                      </div>
                   </div>
                </div>
                <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden shadow-lg relative group">
                   <img src="https://images.unsplash.com/photo-1620464645224-4f2747d7c679?auto=format&fit=crop&q=80&w=600" alt="Braids Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <span className="text-white font-bold">{t('Colección Gold & Wood')}</span>
                   </div>
                </div>
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bisuteria.map(p => (
                   <ProductCard 
                      key={p.id} 
                      product={p} 
                      onView={handleViewProduct}
                   />
                ))}
             </div>
          </div>
       </section>
     );
  };

  const renderToysSection = () => {
    const toys = PRODUCTS.filter(p => p.category === 'toys').slice(0, 4);
    return (
      <section className="bg-[#f0f9ff] py-24 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
         <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                  <GiftIcon className="w-5 h-5" /> {t('Para los Pequeños')}
               </span>
               <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary tracking-tight">{t('Juguetes & Diversión')}</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                {toys.map((p, idx) => (
                   <div 
                      key={p.id} 
                      onClick={() => handleViewProduct(p)}
                      className={`bg-white rounded-[2rem] p-4 shadow-xl hover:-translate-y-4 transition-transform duration-500 cursor-pointer border border-blue-50 group ${
                         idx % 2 === 1 ? 'lg:translate-y-12' : ''
                      }`}
                   >
                       <div className="aspect-square rounded-[1.5rem] overflow-hidden mb-5 relative bg-blue-50/50">
                           <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover group-hover:scale-110 group-hover:-rotate-2 transition-all duration-500" />
                       </div>
                       <h3 className="font-bold text-lg text-brand-primary text-center mb-2 px-2 leading-tight">{t(p.name)}</h3>
                       <div className="text-center mt-4">
                          <span className="text-blue-500 font-black text-xl bg-blue-50 px-4 py-1.5 rounded-full inline-block">RD${p.price.toFixed(2)}</span>
                       </div>
                   </div>
                ))}
            </div>
         </div>
      </section>
    );
  };

  const renderJewelrySection = () => {
    const jewelry = PRODUCTS.filter(p => p.category === 'jewelry').slice(0, 5);
    if (jewelry.length === 0) return null;

    return (
      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                 <span className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-[0.2em] mb-4">
                    <GemIcon className="w-4 h-4" /> {t('Alta Calidad')}
                 </span>
                 <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">{t('Joyería & Larimar')}</h2>
              </div>
              <p className="max-w-md text-gray-400 font-light">{t('Piezas exclusivas de Larimar, Ámbar y Plata 925. Disponibles en Boutique Principal y Miches.')}</p>
           </div>
           
           {/* Bento Grid */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
              {jewelry.map((p, idx) => (
                 <div 
                    key={p.id} 
                    onClick={() => handleViewProduct(p)}
                    className={`group relative overflow-hidden cursor-pointer rounded-2xl ${
                       idx === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                    }`}
                 >
                    <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                    {p.tags && p.tags[0] && (
                      <div className="absolute top-4 left-4 bg-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {t(p.tags[0])}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-[#d4af37] w-10 h-10 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRightIcon className="w-5 h-5" />
                    </div>
                    <div className="absolute bottom-5 left-5 right-5">
                       <h3 className={`font-serif mb-1 text-white leading-tight ${idx === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{t(p.name)}</h3>
                       <div className="w-8 h-0.5 bg-[#d4af37] mb-2 transition-all duration-500 group-hover:w-16" />
                       <div className="flex justify-between items-center">
                          <span className="text-[#d4af37] font-semibold tracking-wider">RD${p.price.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                          {p.originalPrice && (
                            <span className="text-gray-500 line-through text-sm">RD${p.originalPrice.toLocaleString('en', { minimumFractionDigits: 2 })}</span>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>

           {/* CTA */}
           <div className="text-center mt-12">
              <button 
                onClick={() => navigate('/jewelry')}
                className="inline-flex items-center gap-2 bg-[#d4af37] text-black px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#c4a030] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {t('Ver Colección Completa')}
                <ArrowRightIcon className="w-4 h-4" />
              </button>
           </div>
        </div>
      </section>
    );
  };

  const renderQuickCategories = () => {
    let categories = [];
    try {
       categories = JSON.parse(content.home_quick_categories || '[]');
    } catch {
       categories = [];
    }

    // Default fallback if empty
    if (categories.length === 0) {
      categories = [
        { id: 'custom', label: 'Personalizados', icon: 'SwatchIcon' },
        { id: 'braids', label: 'Estudio de Trenzas', icon: 'ScissorsIcon' },
        { id: 'toys', label: 'Juguetes', icon: 'HeartIcon' },
        { id: 'boutiques', label: 'Boutiques', icon: 'BuildingStorefrontIcon' },
        { id: 'jewelry', label: 'Joyería Fina', icon: 'GemIcon' },
        { id: 'gift-cards', label: 'Gift Cards', icon: 'GiftIcon' }
      ];
    }

    const iconMap: Record<string, React.ReactNode> = {
      SwatchIcon: <SwatchIcon className="w-6 h-6" />,
      ScissorsIcon: <ScissorsIcon className="w-6 h-6" />,
      HeartIcon: <HeartIcon className="w-6 h-6" />,
      BuildingStorefrontIcon: <BuildingStorefrontIcon className="w-6 h-6" />,
      GemIcon: <GemIcon className="w-6 h-6" />,
      GiftIcon: <GiftIcon className="w-5 h-5" />,
      ShoppingBagIcon: <ShoppingBagIcon className="w-6 h-6" />,
      StarIcon: <StarIcon className="w-6 h-6" />,
      TagIcon: <TicketIcon className="w-6 h-6" />
    };

    return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 px-4 container mx-auto mt-12 mb-4 relative z-20">
      {categories.map((cat: any) => (
        <button
          key={cat.id}
          onClick={() => navigate('/' + cat.id)}
          className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-2 hover:bg-black hover:text-white transition-all duration-300 relative overflow-hidden group h-28 md:h-36 flex flex-col items-center justify-center px-4 border border-gray-100/50 text-center"
        >
          <div className="mb-3 p-3 bg-gray-100 rounded-xl group-hover:bg-brand-accent transition-colors">
             {iconMap[cat.icon] || <ShoppingBagIcon className="w-6 h-6" />}
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
             <span className="font-display font-semibold text-black text-sm md:text-base tracking-tight leading-tight group-hover:text-white transition-colors">
               {t(cat.label)}
             </span>
             <span className="text-[10px] text-white/80 uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
               {t('Explorar')}
             </span>
          </div>
        </button>
      ))}
    </div>
    );
  };

  const renderWeeklyOffers = () => {
    const discountedProducts = PRODUCTS.filter(p => p.originalPrice).slice(0, 5);
    if(discountedProducts.length === 0) return null;
    
    return (
      <section className="py-24 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-orange-200/40 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-40 -left-20 w-[30rem] h-[30rem] bg-red-200/40 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 w-full max-w-[1920px]">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 max-w-7xl mx-auto">
              <div>
                 <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <ReceiptPercentIcon className="w-4 h-4" /> {t('Ofertas Especiales')}
                 </span>
                 <h2 className="text-4xl md:text-6xl font-serif font-bold text-red-950 tracking-tight">{t('Ofertas Semanales')}</h2>
              </div>
              <button onClick={() => navigate('/offers')} className="flex items-center gap-2 font-bold text-red-600 hover:text-red-800 transition-colors uppercase tracking-widest text-sm">
                 {t('Ver todo')} <ArrowRightIcon className="w-5 h-5" />
              </button>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {discountedProducts.map(p => (
                 <div key={p.id} onClick={() => handleViewProduct(p)} className="relative group cursor-pointer bg-white rounded-3xl p-3 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 w-full max-w-[320px] mx-auto">
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white w-16 h-16 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transform rotate-12 group-hover:scale-110 transition-transform z-20">
                       <span className="text-[10px] leading-tight border-b border-white/30 pb-0.5 mb-0.5">{t('DTO')}</span>
                       <span className="text-sm leading-none">-{Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100)}%</span>
                    </div>
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden relative mb-4 bg-gray-50">
                       <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                       <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                       <div className="absolute bottom-4 left-0 w-full px-4 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <span className="bg-white/95 text-red-600 font-bold px-6 py-2 rounded-full text-sm inline-block shadow-lg">{t('Ver Oferta')}</span>
                       </div>
                    </div>
                    <div className="px-3 pb-2 text-center">
                       <h3 className="font-serif font-bold text-xl text-gray-900 mb-1 leading-tight line-clamp-1">{t(p.name)}</h3>
                       <div className="flex flex-wrap items-center justify-center gap-2">
                          <span className="text-gray-400 line-through text-sm">RD${p.originalPrice?.toFixed(2)}</span>
                          <span className="text-red-600 font-black text-xl tracking-tighter">RD${p.price.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </section>
    );
  };

  const renderBoutiquePC = () => {
      const products = PRODUCTS.filter(p => p.category === 'boutique-pc').slice(0, 4);
      return (
          <section className="py-20 bg-white relative overflow-hidden">
              {/* Watermark trident */}
              <div className="absolute left-8 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-[400px] h-[400px]" fill="currentColor">
                  <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
                </svg>
              </div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center mb-14">
                      <h2 className="text-4xl md:text-5xl font-serif font-bold text-black tracking-tight">{t('Nuestras Boutiques')}</h2>
                      <p className="text-gray-500 mt-3 text-lg">{t('Explora nuestras colecciones exclusivas por destino.')}</p>
                      <div className="w-16 h-1 bg-brand-accent mx-auto mt-6 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-5 lg:h-[600px]">
                      {products.map((p, idx) => (
                          <div 
                            key={p.id} 
                            onClick={() => handleViewProduct(p)}
                            className={`relative rounded-3xl overflow-hidden cursor-pointer group ${
                                idx === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2 h-[400px] lg:h-full' : 
                                idx === 3 ? 'md:col-span-2 lg:col-span-2 lg:row-span-1 h-[280px] lg:h-full' : 
                                'md:col-span-1 lg:col-span-1 lg:row-span-1 h-[280px] lg:h-full'
                            }`}
                          >
                            <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            {p.tags && p.tags[0] && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-black text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 bg-brand-accent rounded-full"></span>
                                  {t(p.tags[0])}
                                </span>
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                              <h3 className="text-white font-serif font-bold text-xl mb-1">{t(p.name)}</h3>
                              <p className="text-white/70 text-sm hidden sm:block">{t(p.description)}</p>
                            </div>
                            <div className="absolute bottom-5 right-5 w-10 h-10 bg-brand-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              <ArrowRightIcon className="w-5 h-5 text-black" />
                            </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      );
  };

  const renderBoutiqueMiches = () => {
      const products = PRODUCTS.filter(p => p.category === 'boutique-miches').slice(0, 4);
      return (
          <section className="py-24 bg-[#EAE5DF] relative">
              <div className="container mx-auto px-4">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4 border-b border-[#D1C9BE] pb-10">
                      <div className="md:w-1/2">
                          <div className="inline-flex items-center gap-2 bg-[#D1C9BE] text-[#5C5346] px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                              <BuildingStorefrontIcon className="w-4 h-4" /> {t('Miches')}
                          </div>
                          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#3A332A] tracking-tight leading-none mb-4">{t('Estilo Boho & Local')}</h2>
                      </div>
                      <p className="md:w-1/3 text-[#5C5346] text-lg font-light md:pl-6">{t('Descubre piezas artesanales de colores tierra con el encanto natural de Miches.')}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 lg:h-[600px]">
                      {products.map((p, idx) => (
                          <div 
                             key={p.id} 
                             onClick={() => handleViewProduct(p)}
                             className={`group cursor-pointer rounded-2xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-500 bg-white ${
                                idx === 0 ? 'md:col-span-2 lg:col-span-2 lg:row-span-2 h-[400px] lg:h-full' : 
                                idx === 3 ? 'md:col-span-2 lg:col-span-2 lg:row-span-1 h-[250px] lg:h-full' : 
                                'md:col-span-1 lg:col-span-1 lg:row-span-1 h-[250px] lg:h-full'
                             }`}
                          >
                             <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter group-hover:contrast-110" />
                             <div className="absolute inset-0 bg-[#3A332A]/20 group-hover:bg-transparent transition-colors duration-500"></div>
                             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                <div>
                                   <div className="bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg inline-block rounded-xl">
                                      <h3 className="font-serif font-bold text-[#3A332A] text-xl leading-tight mb-1">{t(p.name)}</h3>
                                      <p className="text-[#5C5346] font-bold text-sm">RD${p.price.toFixed(2)}</p>
                                   </div>
                                </div>
                                <div className="bg-[#3A332A] text-white w-12 h-12 flex items-center justify-center rounded-xl transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                   <ArrowRightIcon className="w-5 h-5" />
                                </div>
                             </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      );
  };

  const renderBoutiquePlaya = () => {
      const products = PRODUCTS.filter(p => p.category === 'boutique-beach').slice(0, 4);
      return (
          <section className="py-24 bg-gradient-to-b from-sky-50 to-white relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center mb-16">
                      <div className="w-16 h-1 bg-sky-400 mx-auto mb-6"></div>
                      <h2 className="text-4xl md:text-6xl font-serif font-bold text-sky-950 tracking-tight">{t('Boutique Playa')}</h2>
                      <p className="text-sky-700/80 mt-4 text-xl font-light">{t('Esenciales para el sol y el mar')}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                      {products.map((p, idx) => (
                          <div 
                             key={p.id} 
                             onClick={() => handleViewProduct(p)}
                             className={`group cursor-pointer relative ${
                                idx % 2 !== 0 ? 'md:mt-16' : ''
                             }`}
                          >
                             <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-lg group-hover:shadow-sky-200/50 transition-all duration-500 bg-sky-100">
                                <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-sky-900/10 group-hover:bg-transparent transition-colors"></div>
                                <div className="absolute top-4 right-4 bg-white/90 w-10 h-10 rounded-full flex items-center justify-center text-sky-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                   <HeartIcon className="w-5 h-5" />
                                </div>
                             </div>
                             <div className="pt-6 text-center">
                                <h3 className="font-bold text-lg text-sky-950 px-2 line-clamp-1">{t(p.name)}</h3>
                                <div className="w-8 h-0.5 bg-sky-300 mx-auto my-2 group-hover:w-full transition-all duration-300"></div>
                                <span className="text-sky-600 font-bold block">RD${p.price.toFixed(2)}</span>
                             </div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      );
  };

  const renderGiftCardsBanner = () => {
    const giftCards = PRODUCTS.filter(p => p.category === 'gift-card');
    
    // Helper to get card style
    const getCardStyle = (id: string) => {
        const styles: Record<string, { bg: string, text: string, accent: string, labelColor: string }> = {
            'gc-decouverte': { bg: 'bg-[#a3c6c0]', text: 'text-[#1e2643]', accent: 'text-[#fbbf24]', labelColor: 'text-[#1e2643]' },
            'gc-essentielle': { bg: 'bg-[#9da9e8]', text: 'text-[#1e2643]', accent: 'text-[#fbbf24]', labelColor: 'text-[#1e2643]' },
            'gc-premium': { bg: 'bg-[#0f1535]', text: 'text-white', accent: 'text-[#fbbf24]', labelColor: 'text-white' },
            'gc-prestige': { bg: 'bg-[#000000]', text: 'text-white', accent: 'text-[#fbbf24]', labelColor: 'text-white' },
        };
        return styles[id] || styles['gc-premium'];
    };

    return (
      <section className="py-24 bg-brand-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent_60%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-brand-accent via-brand-accent/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
           
           <div className="flex flex-col items-center justify-center mb-16 text-center">
               <div className="inline-flex items-center gap-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-brand-primary border border-black/10 mb-5">
                  <GiftIcon className="w-4 h-4" /> {t('Regala Momentos')}
               </div>
               <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-primary mb-6 tracking-tight">
                  {t('Gift Cards Exclusivas')}
               </h2>
               <p className="text-brand-primary/60 max-w-xl">{t('Selecciona una tarjeta para ver sus detalles y condiciones de uso.')}</p>
           </div>
           
           {/* Visual Banner of the 4 Cards */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {giftCards.map(p => {
                 const style = getCardStyle(p.id);
                 
                 return (
                    <div 
                        key={p.id}
                        onClick={() => setSelectedGiftCard(p)}
                        className={`${style.bg} rounded-2xl aspect-[1.58/1] shadow-2xl relative overflow-hidden group transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 border border-white/10 cursor-pointer`}
                    >
                        {/* Shimmer/Gloss Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`font-bold text-sm ${style.text} flex items-center gap-1`}>
                                        Club Med <span className="font-serif italic font-light">Ψ</span>
                                    </span>
                                </div>
                                <span className={`font-bold text-2xl ${style.text}`}>
                                    RD${p.price.toLocaleString()}
                                </span>
                            </div>
                            
                            <div className="text-center relative">
                                <h3 className={`font-serif text-5xl ${style.text} tracking-tight leading-none`}>
                                    Gift
                                </h3>
                                <h3 className={`font-cursive text-5xl ${style.accent} -mt-2 ml-8 transform -rotate-2`}>
                                    Card
                                </h3>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className={`font-handwriting text-3xl ${style.labelColor}`}>
                                        {t(p.name)}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className={`text-[10px] uppercase font-bold ${style.text} border-b border-current`}>Ver Detalles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </section>
    );
  };

  const renderCraftsSection = () => {
      const crafts = PRODUCTS.filter(p => p.category === 'crafts').slice(0, 4);
      return (
        <section className="py-24 bg-[#FAF7F2]">
          <div className="container mx-auto px-4">
             <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b border-[#E8E1D5] pb-10">
                <div className="text-center md:text-left mb-6 md:mb-0">
                   <span className="text-orange-700 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2 mb-3">
                      <SunIcon className="w-4 h-4" /> {t('Cultura Viva')}
                   </span>
                   <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#4A3D2A] tracking-tight">{t('Artesanía Dominicana')}</h2>
                </div>
                <button onClick={() => navigate('/boutiques')} className="bg-[#4A3D2A] text-white px-8 py-3 rounded-none font-bold tracking-widest uppercase text-sm hover:bg-orange-700 transition-colors">
                   {t('Descubrir Todo')}
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-rows-2 gap-3 lg:h-[500px]">
                {crafts.map((p, idx) => (
                   <div 
                      key={p.id} 
                      onClick={() => handleViewProduct(p)}
                      className={`group relative cursor-pointer overflow-hidden bg-white shadow-sm ${
                         idx === 0 ? 'md:col-span-2 md:row-span-2 h-[400px] lg:h-full' : 
                         idx === 1 ? 'md:col-span-2 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-full' :
                         idx === 2 ? 'md:col-span-1 lg:col-span-1 lg:row-span-1 h-[240px] lg:h-full' :
                         'md:col-span-1 lg:col-span-2 lg:row-span-1 h-[240px] lg:h-full block md:hidden lg:block'
                      }`}
                   >
                      <img src={p.image} alt={t(p.name)} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 border-[10px] border-transparent group-hover:border-white/20 transition-all duration-300 pointer-events-none z-10"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                      <div className="absolute bottom-5 left-5 right-5 text-white">
                         <h3 className="font-serif font-bold text-xl mb-1">{t(p.name)}</h3>
                         <p className="text-orange-300 font-bold text-sm bg-black/50 inline-block px-3 py-1 rounded backdrop-blur-sm">RD${p.price.toFixed(2)}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </section>
      );
  };

  // Helper function to render the visual card inside the modal (reduces code duplication)
  const renderVisualGiftCard = (p: Product) => {
      const styles: Record<string, { bg: string, text: string, accent: string, labelColor: string }> = {
            'gc-decouverte': { bg: 'bg-[#a3c6c0]', text: 'text-[#1e2643]', accent: 'text-[#fbbf24]', labelColor: 'text-[#1e2643]' },
            'gc-essentielle': { bg: 'bg-[#9da9e8]', text: 'text-[#1e2643]', accent: 'text-[#fbbf24]', labelColor: 'text-[#1e2643]' },
            'gc-premium': { bg: 'bg-[#0f1535]', text: 'text-white', accent: 'text-[#fbbf24]', labelColor: 'text-white' },
            'gc-prestige': { bg: 'bg-[#000000]', text: 'text-white', accent: 'text-[#fbbf24]', labelColor: 'text-white' },
      };
      const style = styles[p.id] || styles['gc-premium'];

      return (
        <div className={`${style.bg} rounded-2xl aspect-[1.58/1] shadow-xl relative overflow-hidden w-full max-w-md mx-auto border border-white/10`}>
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`font-bold text-sm ${style.text} flex items-center gap-1`}>
                            Club Med <span className="font-serif italic font-light">Ψ</span>
                        </span>
                    </div>
                    <span className={`font-bold text-2xl ${style.text}`}>
                        RD${p.price.toLocaleString()}
                    </span>
                </div>
                <div className="text-center relative">
                    <h3 className={`font-serif text-5xl ${style.text} tracking-tight leading-none`}>Gift</h3>
                    <h3 className={`font-cursive text-5xl ${style.accent} -mt-2 ml-8 transform -rotate-2`}>Card</h3>
                </div>
                <div className="flex justify-between items-end">
                    <span className={`font-handwriting text-3xl ${style.labelColor}`}>{t(p.name)}</span>
                    <GiftIcon className="w-6 h-6" />
                </div>
            </div>
        </div>
      );
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isAdmin ? 'bg-gray-50' : 'bg-brand-background'} text-brand-text`}>
      <ToastContainer />
      {!isAdmin && currentView !== 'login' && (
        <Header 
         cartCount={cart.length} 
         onOpenCart={() => navigate('/cart')} 
         onOpenTracking={() => setIsTrackingOpen(true)} 
         currentView={currentView} 
        />
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              {renderQuickCategories()}
              <Brands />
              {renderWeeklyOffers()}
              {renderBoutiquePC()}
              {renderBoutiqueMiches()}
              {renderBoutiquePlaya()}
              <section className="py-20 bg-white">
                  <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 group cursor-pointer" onClick={() => navigate('/braids')}>
                          <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800" alt="Braids" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <h3 className="text-4xl font-serif font-bold text-white border-b-2 border-brand-accent pb-2">{t(content.braids_title || 'Estudio de Trenzas')}</h3>
                          </div>
                      </div>
                      <div>
                          <span className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-2 block">{t('Servicio Profesional')}</span>
                          <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">{t(content.braids_subtitle || 'Arte en tu Cabello')}</h2>
                          <p className="text-gray-600 mb-6">
                              Nuestras estilistas expertas te esperan para transformar tu look con trenzas caribeñas auténticas. Reserva tu cita online.
                          </p>
                          <button onClick={() => navigate('/braids')} className="text-brand-primary font-bold border-b-2 border-brand-primary hover:text-brand-accent hover:border-brand-accent transition-colors pb-1">
                              Ver Estilos y Reservar
                          </button>
                      </div>
                  </div>
              </section>
              {renderJewelrySection()}
              {renderToysSection()}
              {renderGiftCardsBanner()}
              {renderPersonalCareSection()}
              {renderCraftsSection()}

              {/* Yellow CTA Section */}
              <section className="py-24 bg-brand-accent relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                  <div className="absolute top-8 left-16 w-32 h-32 border-2 border-brand-primary/20 rounded-full"></div>
                  <div className="absolute bottom-12 right-24 w-48 h-48 border-2 border-brand-primary/10 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/3 w-20 h-20 border-2 border-brand-primary/15 rounded-full"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-primary tracking-tight mb-6 leading-tight">
                      {t(content.custom_title || 'Personaliza tu Estilo')}
                    </h2>
                    <p className="text-brand-primary/70 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
                      {t(content.custom_subtitle || 'Diseña tus propias piezas. T-shirts, gorras, mochilas y más con tu toque personal.')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => navigate('/custom')}
                        className="inline-flex items-center gap-2 bg-brand-primary text-white px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:bg-brand-secondary hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        {t('Empezar a Crear')}
                      </button>
                      <button 
                        onClick={() => navigate('/offers')}
                        className="inline-flex items-center gap-2 border-2 border-brand-primary/30 text-brand-primary px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:bg-brand-primary/10"
                      >
                        {t('Ver Colección')}
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          } />

          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/boutiques" element={
            <div className="pt-8">
              {renderBoutiquePC()}
              {renderBoutiqueMiches()}
              {renderBoutiquePlaya()}
            </div>
          } />

          <Route path="/personal-care" element={
            <ProductPageLayout
              title={t('Cuidado Personal')}
              subtitle={t('Bienestar y belleza natural para ti.')}
              products={PRODUCTS.filter(p => p.category === 'personal-care')}
              t={t}
              onViewProduct={handleViewProduct}
            />
          } />

          <Route path="/braids" element={renderBraidsSection()} />
          <Route path="/bisuteria" element={renderBisuteriaSection()} />
          
          <Route path="/toys" element={
            <ProductPageLayout
              title={t('Juguetes')}
              subtitle={t('Diversión para toda la familia.')}
              products={PRODUCTS.filter(p => p.category === 'toys')}
              t={t}
              onViewProduct={handleViewProduct}
            />
          } />

          <Route path="/jewelry" element={
            <ProductPageLayout
              title={t('Alta Joyería')}
              subtitle={t('Larimar, Ámbar y Plata 925.')}
              products={PRODUCTS.filter(p => p.category === 'jewelry')}
              t={t}
              onViewProduct={handleViewProduct}
              accentColor="#d4af37"
            />
          } />

          <Route path="/gift-cards" element={
            <div className="pt-8">
               {renderGiftCardsBanner()}
            </div>
          } />

          <Route path="/custom" element={
            <div className="pt-8">
               <div className="container mx-auto px-4 mb-8">
                 <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">Personalizados</h1>
                 <p className="text-gray-600">Crea productos únicos. Elige un producto para comenzar.</p>
               </div>
               {renderCategorySection('custom', 'Catálogo de Personalización', <SwatchIcon className="w-5 h-5" />)}
            </div>
          } />

          <Route path="/model-gallery" element={
            <ModelGallery 
               onBack={() => navigate('/custom')}
               onSelect={handlePresetSelect}
            />
          } />

          <Route path="/designer" element={
            customizingProduct ? (
              <Customizer 
                 product={customizingProduct}
                 initialItem={editingItem}
                 initialLogoStyle={selectedModelStyle}
                 initialColor={selectedPresetColor}
                 initialLogoColor={selectedLogoColor}
                 initialGuestName={guestName}
                 initialGuestRoom={guestRoom}
                 onBack={() => navigate('/model-gallery')}
                 onAddToCart={handleAddItem}
              />
            ) : <Navigate to="/custom" replace />
          } />

          <Route path="/universal-designer" element={
            customizingProduct ? (
              <UniversalCustomizer 
                 product={customizingProduct}
                 initialItem={editingItem}
                 onBack={() => navigate('/custom')}
                 onAddToCart={handleAddItem}
              />
            ) : <Navigate to="/custom" replace />
          } />

          <Route path="/offers" element={
            <ProductPageLayout
              title={t('Ofertas Especiales')}
              subtitle={t('Productos con descuento en todas las categorías.')}
              products={PRODUCTS.filter(p => p.originalPrice && p.originalPrice > p.price)}
              t={t}
              onViewProduct={handleViewProduct}
              accentColor="#dc2626"
            />
          } />

          <Route path="/products" element={
            <ProductPageLayout
              title={t('Todos los Productos')}
              subtitle={t('Explora nuestro catálogo completo.')}
              products={PRODUCTS.filter(p => !['gift-card', 'custom'].includes(p.category))}
              t={t}
              onViewProduct={handleViewProduct}
            />
          } />

          <Route path="/shop" element={<Navigate to="/products" replace />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/cart" element={
            <CartPage 
              cart={cart}
              onRemoveItem={removeFromCart}
              onEditItem={handleEditItem}
              onUpdateQuantity={updateQuantity}
            />
          } />
          <Route path="/checkout" element={
            <CheckoutPage 
              cart={cart}
              onRemoveItem={removeFromCart}
              onEditItem={handleEditItem}
              onUpdateQuantity={updateQuantity}
            />
          } />

          {/* ═══════════════ ADMIN ROUTES ═══════════════ */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customizer" element={<CustomizerAdmin />} />
            <Route path="braids" element={<BraidsAdmin />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="brands" element={<BrandsAdmin />} />
            <Route path="slider" element={<SliderAdmin />} />
            <Route path="site-content" element={<SiteContentAdmin />} />
            <Route path="tracking" element={<AdminTracking />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="receipt" element={<AdminReceiptPage />} />
          </Route>

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

      {!isAdmin && currentView !== 'designer' && currentView !== 'universal-designer' && currentView !== 'ticket' && currentView !== 'checkout' && currentView !== 'login' && <Footer />}

      {/* GIFT CARD DETAILS MODAL (New) */}
      {selectedGiftCard && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
                <button 
                  onClick={() => setSelectedGiftCard(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-black/10 rounded-full transition-colors md:text-gray-500 text-white"
                >
                   <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Left Side: The Visual Card */}
                <div className="w-full md:w-1/2 bg-gray-100 p-8 flex flex-col items-center justify-center relative">
                    {renderVisualGiftCard(selectedGiftCard)}
                    <p className="mt-4 text-xs text-gray-500 text-center font-medium uppercase tracking-wide">
                        {t('Imagen Referencial')}
                    </p>
                </div>

                {/* Right Side: Details & T&C */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                    <h2 className="text-3xl font-serif font-bold text-brand-primary mb-2">
                        Gift Card {selectedGiftCard.name}
                    </h2>
                    <p className="text-2xl font-bold text-brand-accent mb-6">
                        RD${selectedGiftCard.price.toLocaleString()}
                    </p>
                    
                    <div className="space-y-6 flex-grow">
                        <div>
                            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <InformationCircleIcon className="w-4 h-4" /> {t('Descripción')}
                            </h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {t(selectedGiftCard.description)} {t('El regalo ideal para que tus seres queridos elijan exactamente lo que desean en nuestras exclusivas boutiques.')}
                            </p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                            <h4 className="font-bold text-sm text-red-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-6 h-6" /> {t('Términos y Condiciones')}
                            </h4>
                            <ul className="text-xs text-red-700 space-y-2 list-disc list-inside">
                                <li>{t('Válida exclusivamente en Boutiques Club Med Michès Playa Esmeralda y Punta Cana.')}</li>
                                <li>{t('No reembolsable ni canjeable por efectivo.')}</li>
                                <li>{t('Debe presentarse la tarjeta física original al momento de la compra.')}</li>
                                <li>{t('Vigencia de 1 año a partir de la fecha de compra.')}</li>
                                <li>{t('No aplica para servicios externos o excursiones.')}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-400">
                            {t('Disponibles para compra en la recepción de la Boutique.')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL (READ ONLY) */}
      {viewingProduct && (
        <ProductModal 
           product={viewingProduct}
           onClose={() => setViewingProduct(null)}
        />
      )}

      {/* Order Tracking Modal */}
      {isTrackingOpen && (
        <OrderTracking onClose={() => setIsTrackingOpen(false)} />
      )}
    </div>
  );
}

export default App;
