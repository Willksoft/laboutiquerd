import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Sparkles, Plus, Minus, Ticket, Trash2, Scissors, Info, Image as ImageIcon, CheckCircle, ZoomIn, X, User, DoorOpen } from 'lucide-react';
import { CartItem } from '../types';
import TicketReceipt from './TicketReceipt';
import { toast } from './Toast';
import { useTranslation } from 'react-i18next';
import { useBraidStyles } from '../hooks/useBraidStyles';
import { useBraidServices } from '../hooks/useBraidServices';
import { useReservations, STANDARD_HOURS } from '../hooks/useReservations';
import { useVendors } from '../hooks/useVendors';
import { useSiteContent } from '../hooks/useSiteContent';
import CustomSelect from './ui/CustomSelect';

interface BraidsBookingProps {
  onGenerateTicket: (items: CartItem[]) => void;
}

const BraidsBooking: React.FC<BraidsBookingProps> = ({ onGenerateTicket }) => {
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [room, setRoom] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Local cart for building the reservation
  const [reservationCart, setReservationCart] = useState<CartItem[]>([]);

  const { t, i18n } = useTranslation();
  const { styles: allModels } = useBraidStyles();
  const { services: allServices } = useBraidServices();
  const { vendors } = useVendors();

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

  const visibleModels = useMemo(() => allModels.filter(m => m.isVisible !== false), [allModels]);
  const visibleServices = useMemo(() => allServices.filter(s => s.isVisible !== false), [allServices]);

  const currentModelName = useMemo(() => {
     return visibleModels.find(m => m.id === selectedModel)?.name || '';
  }, [selectedModel, visibleModels]);

  const currentModelData = useMemo(() => {
     return visibleModels.find(m => m.id === selectedModel);
  }, [selectedModel, visibleModels]);

  const handleAddService = (service: {id: string, name: string, price: number}) => {
      if (!selectedModel) {
          toast.info("¡Por favor! Primero selecciona una imagen de trenza arriba para saber qué estilo base deseas.");
          // scroll to models or just return
          return;
      }

      const cartId = `${selectedModel}-${service.id}`;

      setReservationCart(prev => {
          const existing = prev.find(i => i.id === cartId);
          if (existing) {
              return prev.map(i => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
          }
          return [...prev, {
              id: cartId,
              name: `Reserva: ${currentModelName} - ${service.name}`,
              price: service.price,
              quantity: 1,
              type: 'service',
              details: { braidType: service.id, customName: currentModelName }
          }];
      });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
      setReservationCart(prev => prev.map(i => {
          if (i.id === id) {
              const newQ = i.quantity + delta;
              if (newQ <= 0) return null;
              return { ...i, quantity: newQ };
          }
          return i;
      }).filter(Boolean) as CartItem[]);
  };

  const getDiscountData = () => {
       const hairQuantity = reservationCart.filter(i => !i.id.includes('acc')).reduce((acc, i) => acc + i.quantity, 0);
       let discountPercent = 0;
       if (hairQuantity >= 26) discountPercent = 0.15;
       else if (hairQuantity >= 16) discountPercent = 0.10;
       else if (hairQuantity >= 10) discountPercent = 0.05;
       return { hairQuantity, discountPercent };
  }

  const { discountPercent, hairQuantity } = getDiscountData();

  const { reservations, blockedDaysOfWeek, blockedStandardHours } = useReservations();
  const { getValue } = useSiteContent();
  
  const holidays = useMemo(() => {
     try { return JSON.parse(getValue('holidays')) || []; } catch { return []; }
  }, [getValue]);

  const businessHours = useMemo(() => {
     try { return JSON.parse(getValue('business_hours')) || { start: '09:00', end: '18:00' }; } catch { return { start: '09:00', end: '18:00' }; }
  }, [getValue]);

  // Generate available hours bounded by business_hours
  const availableHours = useMemo(() => {
      const startH = parseInt(businessHours.start.split(':')[0]);
      const startM = parseInt(businessHours.start.split(':')[1]);
      const endH = parseInt(businessHours.end.split(':')[0]);
      const endM = parseInt(businessHours.end.split(':')[1]);
      
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      return STANDARD_HOURS.filter(time => {
          // '09:00 AM' -> 9 * 60 = 540 | '02:30 PM' -> 14.5 * 60
          const [timePart, period] = time.val.split(' ');
          let [h, m] = timePart.split(':').map(Number);
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
          const currentMinutes = h * 60 + m;
          return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
      });
  }, [businessHours]);

  // Hours already reserved for the selected date
  const reservedHoursForDate = useMemo(() => {
      if (!selectedDate) return new Set<string>();
      return new Set(
          reservations
              .filter(r => r.date === selectedDate && r.status !== 'Cancelada')
              .map(r => r.time)
      );
  }, [reservations, selectedDate]);

  const upcomingDates = useMemo(() => {
      const dates = [];
      const cur = new Date();
      // Generar próximos 21 días saltando los días bloqueados
      while (dates.length < 21) {
         // format local properly without TZ offset issues
         const localCur = new Date(cur.getTime() - cur.getTimezoneOffset() * 60000);
         const dateString = localCur.toISOString().split('T')[0];
         
         if (!blockedDaysOfWeek.includes(cur.getDay()) && !holidays.includes(dateString)) { 
            dates.push(new Date(cur));
         }
         cur.setDate(cur.getDate() + 1);
      }
      return dates;
  }, [blockedDaysOfWeek, holidays]);

  const formatDateLabel = (d: Date) => {
      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return { 
          dayName: days[d.getDay()], 
          dayNum: d.getDate(), 
          monthName: months[d.getMonth()],
          full: d.toISOString().split('T')[0]
      };
  };

  const currentTotal = useMemo(() => {
      return reservationCart.reduce((total, item) => {
          if (!item.id.includes('acc') && discountPercent > 0) {
               return total + (item.price * item.quantity * (1 - discountPercent));
          }
          return total + (item.price * item.quantity);
      }, 0);
  }, [reservationCart, discountPercent]);

  const handleGenerateTicket = () => {
      if (!selectedModel) {
          toast.error("Debes elegir un modelo de trenza como base.");
          return;
      }
      if (!clientName.trim() || !room.trim()) {
          toast.error('Por favor, ingresa tu Nombre, Habitación y selecciona un Vendedor.');
          return;
      }
      if (!selectedDate || !selectedTime) {
          toast.error('Por favor, selecciona una fecha y hora para tu cita.');
          return;
      }

      // Automatically inject the Model Reference with ALL the date and client details!
      // This prevents the receipt from printing the date 10 times for every small accessory.
      const baseModelItem: CartItem = {
          id: `booking-${Date.now()}-modelRef`,
          name: `Estilo Base: ${currentModelName.replace('Modelo ', '')}`,
          price: 0,
          quantity: 1,
          type: 'service',
          details: { 
              braidType: selectedModel, 
              date: selectedDate, 
              time: selectedTime,
              clientName,
              room,
              vendorId
          }
      };

      const finalItems = reservationCart.map(i => ({
          ...i,
          id: `booking-${Date.now()}-${i.id}`,
          price: !i.id.includes('acc') && discountPercent > 0 ? i.price * (1 - discountPercent) : i.price,
          details: { ...i.details, date: selectedDate, time: selectedTime, clientName, room, vendorId }
          // NOTE: Intentionally removed date/time details here so it doesn't print on the receipt for accessories
      }));
      onGenerateTicket([baseModelItem, ...finalItems]);
  };

  const previewItems = useMemo(() => {
      const liveItems = [...reservationCart];
      if (selectedModel) {
          liveItems.unshift({
             id: 'preview-base',
             name: `Estilo Base: ${currentModelName.replace('Modelo ', '')}`,
             price: 0,
             quantity: 1,
             type: 'service',
             details: { 
                 braidType: selectedModel, 
                 date: selectedDate || 'Por definir', 
                 time: selectedTime || 'Por definir', 
                 clientName: clientName || '-', 
                 room: room || '-' 
             }
          });
      }
      return liveItems.map(i => ({...i, price: !i.id.includes('acc') && discountPercent > 0 ? i.price * (1 - discountPercent) : i.price}));
  }, [reservationCart, selectedModel, currentModelName, discountPercent, selectedDate, selectedTime, clientName, room]);

  return (
    <div className="bg-white flex flex-col h-full w-full mx-auto relative border-t border-gray-100">


      <div className="p-6 md:p-12 lg:p-16 xl:max-w-[1920px] mx-auto flex-grow flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
        
        {/* Left Side: Services & Builder */}
        <div className="flex-1 space-y-12">
            
            <div className="mb-4">
               <h3 className="text-2xl md:text-3xl font-serif font-black text-brand-primary tracking-tight mb-1 flex items-center gap-2">
                  <Sparkles className="text-brand-accent" size={24} /> {t('bookYourAppointment', 'Reserva tu Cita')}
               </h3>
               <p className="text-gray-500 text-sm max-w-xl">
                  {t('followStepsPackages', 'Sigue los pasos para armar tu paquete: registra tus datos, elige un estilo y agrega accesorios.')}
               </p>
            </div>

            {/* ════ Step 1: Registro y Fecha (FIJO al top) ════ */}
            <div className="pb-4 sticky top-0 z-30 bg-white pt-2 -mt-2 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)]">
              <h3 className="flex items-center gap-3 text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-100 pb-3">
                 <span className="bg-brand-accent text-brand-primary shadow-xl animate-pulse scale-110 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all">1</span>
                 {t('registrationAndDate', 'Registro y Fecha')}
              </h3>

              <div className="grid grid-cols-1 gap-5 bg-brand-cream/30 p-5 md:p-6 rounded-2xl border-2 border-brand-accent/20 border-dashed">
                {/* Campos de Cliente - compacto */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                   <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5"><User size={14} className="text-brand-accent"/> {t('yourName', 'Tu Nombre')}</label>
                      <input 
                         type="text" 
                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm shadow-sm font-bold text-brand-primary placeholder:font-normal placeholder:text-gray-400"
                         placeholder="Ej: Laura G."
                         value={clientName}
                         onChange={(e) => setClientName(e.target.value)}
                         maxLength={100}
                         autoComplete="name"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5"><DoorOpen size={14} className="text-brand-accent"/> {t('roomNumber', 'Habitación #')}</label>
                      <input 
                         type="text" 
                         className="w-full p-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm shadow-sm font-bold text-brand-primary placeholder:font-normal placeholder:text-gray-400"
                         placeholder="Ej: 402"
                         value={room}
                         onChange={(e) => setRoom(e.target.value)}
                         maxLength={20}
                      />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5"><User size={14} className="text-brand-accent"/> {t('seller', 'Vendedor/a')} *</label>
                       <CustomSelect 
                           value={vendorId}
                           onChange={setVendorId}
                           variant="input"
                           options={[
                               { label: t('selectSeller', 'Seleccionar Vendedor...'), value: '' },
                               ...vendors.map(v => ({ label: `${v.name} (${v.role})`, value: v.id }))
                           ]}
                           className="w-full"
                       />
                   </div>
                </div>

                {/* Fecha - compacto */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Calendar size={14} className="text-brand-accent"/> {t('sessionDay', 'Día de tu Sesión')}</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar snap-x">
                      {upcomingDates.map((dateObj, i) => {
                          const dateInfo = formatDateLabel(dateObj);
                          const isSelected = selectedDate === dateInfo.full;
                          return (
                              <div 
                                  key={i}
                                  onClick={() => setSelectedDate(dateInfo.full)}
                                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border-2 min-w-[65px] cursor-pointer snap-start transition-all
                                      ${isSelected 
                                          ? 'border-brand-accent bg-brand-primary text-brand-accent shadow-lg transform scale-105' 
                                          : 'border-white bg-white hover:border-brand-accent/30 text-gray-400 hover:text-gray-800'}`}
                              >
                                  <span className="text-[10px] uppercase font-bold tracking-wider">{dateInfo.dayName}</span>
                                  <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-gray-800'}`}>{dateInfo.dayNum}</span>
                                  <span className="text-[9px] font-bold uppercase">{dateInfo.monthName}</span>
                              </div>
                          )
                      })}
                  </div>
                </div>

                {/* Hora - compacto */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5"><Clock size={14} className="text-brand-accent"/> {t('arrivalTime', 'Hora de Llegada')}</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {availableHours.map((time) => {
                          const isBlocked = blockedStandardHours.includes(time.val);
                          const isReserved = reservedHoursForDate.has(time.val);
                          const isUnavailable = isBlocked || isReserved;
                          const isSelected = selectedTime === time.val;
                          return (
                              <button
                                 key={time.val}
                                 disabled={isUnavailable}
                                 onClick={() => setSelectedTime(time.val)}
                                 className={`p-2.5 rounded-xl border-2 font-bold transition-all text-sm relative
                                    ${isUnavailable
                                        ? 'border-red-200 bg-red-50 text-red-300 cursor-not-allowed'
                                        : isSelected 
                                            ? 'border-brand-accent bg-brand-primary text-brand-accent shadow-md transform scale-105' 
                                            : 'border-white bg-white text-gray-700 hover:border-brand-accent/30 hover:bg-brand-cream/50'}`}
                              >
                                 <span className={isReserved ? 'line-through' : ''}>{time.label}</span>
                                 {isReserved && (
                                     <span className="block text-[9px] text-red-400 font-bold mt-0.5 leading-none">{t('reserved', 'Reservada')}</span>
                                 )}
                              </button>
                          );
                      })}
                  </div>
                  {selectedDate && reservedHoursForDate.size > 0 && (
                      <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                          <Info size={10}/> {t('reservedHoursNote', 'Las horas tachadas ya están reservadas para este día.')}
                      </p>
                  )}
                </div>
              </div>
            </div>

            {/* ════ Step 2: Estilos de Trenzas (Pictures) ════ */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-3">
                 <span className={`${!selectedModel ? 'bg-brand-accent text-brand-primary shadow-xl animate-pulse scale-110' : 'bg-gray-200 text-gray-500 shadow-inner'} w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-all`}>2</span>
                 {t('referenceImages', 'Imágenes de Referencia (Elige el modelo)')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                {visibleModels.map((model) => (
                  <div 
                    key={model.id}
                    className={`flex flex-col rounded-2xl border-2 transition-all group relative overflow-hidden p-2 bg-white ${selectedModel === model.id ? 'border-brand-accent ring-2 ring-brand-accent/50 bg-brand-cream/30' : 'border-gray-100'} ${model.isSoldOut ? 'opacity-80 grayscale cursor-not-allowed' : 'hover:border-brand-accent/50 hover:shadow-2xl cursor-pointer'}`}
                  >
                    <div 
                        className="aspect-square overflow-hidden rounded-lg bg-gray-200 relative"
                        onClick={() => { if (!model.isSoldOut) setSelectedModel(selectedModel === model.id ? null : model.id) }}
                    >
                        <img src={model.image} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        
                        {model.isSoldOut && (
                             <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">
                                    Agotado
                                </span>
                             </div>
                        )}

                        {selectedModel === model.id && (
                           <div className="absolute inset-0 bg-brand-accent/20 flex items-center justify-center pointer-events-none z-20">
                              <div className="bg-brand-primary text-white rounded-full p-2 shadow-xl transform scale-110"><CheckCircle size={24}/></div>
                           </div>
                        )}
                        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded font-black text-xs text-brand-primary shadow-sm leading-none z-20">
                            {getTranslatedText(model, 'name').replace('Modelo ', '')}
                        </div>
                    </div>
                    {/* Botón de ampliar independiente de seleccionar */}
                    <button 
                         onClick={(e) => { e.stopPropagation(); setLightboxImage(model.image); }}
                         className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-brand-accent hover:text-white z-20"
                         title="Ver más grande"
                    >
                        <ZoomIn size={18} />
                    </button>
                    {model.description && (
                        <p className="text-xs text-gray-500 mt-2 px-1 text-center font-medium line-clamp-2">{getTranslatedText(model, 'description')}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ════ Step 3: Catálogo y Accesorios ════ */}
            <div className={`transition-opacity duration-300 ${!selectedModel ? 'opacity-40 grayscale pointer-events-none blur-[1px]' : ''}`}>
              <h3 className="flex items-center gap-3 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b-2 border-gray-100 pb-3">
                 <span className="bg-gray-200 text-gray-500 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-inner flex-shrink-0">3</span>
                 {t('catalogAndAccessories', 'Catálogo y Accesorios')} <span className="text-gray-400 capitalize font-normal text-xs ml-auto hidden sm:block">{t('addPackagesToTicket', 'Agrega paquetes a tu ticket')}</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {visibleServices.map((serv) => (
                  <div 
                    key={serv.id}
                    onClick={() => { if (!serv.isSoldOut) handleAddService(serv) }}
                    className={`flex justify-between items-center p-5 md:p-6 rounded-2xl border-2 border-gray-100 group bg-white ${serv.isSoldOut ? 'opacity-70 grayscale cursor-not-allowed' : 'hover:border-brand-accent hover:shadow-xl transition-all cursor-pointer'}`}
                  >
                    <div>
                        <h4 className="font-bold text-sm md:text-base text-gray-800 leading-tight mb-1">{getTranslatedText(serv, 'name')}</h4>
                        {serv.description && <p className="text-xs text-gray-500 mb-2">{getTranslatedText(serv, 'description')}</p>}
                        <span className="font-black text-brand-primary text-base md:text-lg">
                            {serv.isSoldOut ? <span className="text-red-500 text-sm">AGOTADO</span> : `RD$${serv.price.toFixed(2)}`}
                        </span>
                    </div>
                    {!serv.isSoldOut && (
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-accent group-hover:text-brand-primary transition-colors border border-gray-200 flex-shrink-0 shadow-sm group-hover:scale-110">
                            <Plus size={20} />
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Side: Reservation Ticket Overview */}
        <div className="w-full lg:w-[400px] xl:w-[450px] flex flex-col flex-shrink-0 sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar overflow-x-hidden gap-4">

            {/* ── Gallery Banner ── */}
            {visibleModels.length > 0 && (
              <div
                className="relative rounded-[2rem] overflow-hidden h-48 cursor-pointer group flex-shrink-0"
                onClick={() => navigate('/braids/gallery')}
              >
                {/* rotating background images */}
                <img
                  src={visibleModels[0].image}
                  alt="gallery"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* small thumbnails strip */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {visibleModels.slice(1, 4).map(m => (
                    <div key={m.id} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/40 shadow-md">
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-white/70 text-[11px] font-bold uppercase tracking-widest mb-1">{t('galleryCatalog', 'Catálogo de Estilos')}</p>
                  <p className="text-white font-bold text-lg leading-tight">{t('galleryBannerTitle', 'Explora todos nuestros modelos de trenzas')}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 bg-brand-accent text-brand-primary text-xs font-black px-3 py-1.5 rounded-full group-hover:bg-yellow-300 transition-colors">
                    <ImageIcon size={12} />
                    {t('galleryBannerCta', 'Ver Galería Completa')}
                  </span>
                </div>
              </div>
            )}

            <div className="bg-brand-primary text-white rounded-[2rem] p-8 md:p-10 flex flex-col shadow-2xl relative overflow-hidden">

                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex justify-between items-center mb-4 relative">
                    <h3 className="font-serif font-bold text-3xl flex items-center gap-3">
                        <Scissors className="text-brand-accent h-8 w-8" />
                        {t('yourSession', 'Tu Sesión')}
                    </h3>
                    <div className="bg-white/10 px-4 py-1.5 rounded-full text-sm font-bold">
                        {reservationCart.reduce((total, i) => total + i.quantity, 0) + (selectedModel ? 1 : 0)} {t('items', 'items')}
                    </div>
                </div>

                {/* Live client info */}
                {(clientName || room || vendorId || selectedDate || selectedTime) && (
                    <div className="bg-white/5 rounded-xl p-3 mb-4 border border-white/10 space-y-1.5 text-xs">
                        {clientName && (
                            <div className="flex items-center gap-2 text-white/80">
                                <User size={12} className="text-brand-accent flex-shrink-0"/>
                                <span className="font-bold truncate">{clientName}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {room && (
                                <div className="flex items-center gap-1.5 text-white/60">
                                    <DoorOpen size={11} className="text-brand-accent/70"/>
                                    <span>Hab. {room}</span>
                                </div>
                            )}
                            {vendorId && (
                                <div className="flex items-center gap-1.5 text-white/60">
                                    <User size={11} className="text-brand-accent/70"/>
                                    <span>{vendors.find(v => v.id === vendorId)?.name || '-'}</span>
                                </div>
                            )}
                            {selectedDate && (
                                <div className="flex items-center gap-1.5 text-white/60">
                                    <Calendar size={11} className="text-brand-accent/70"/>
                                    <span>{selectedDate}</span>
                                </div>
                            )}
                            {selectedTime && (
                                <div className="flex items-center gap-1.5 text-white/60">
                                    <Clock size={11} className="text-brand-accent/70"/>
                                    <span>{selectedTime}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-grow space-y-4 overflow-y-auto min-h-[250px] mb-8 custom-scrollbar pr-3 relative">
                    {(!selectedModel && reservationCart.length === 0) ? (
                        <div className="flex flex-col items-center justify-center p-10 text-center text-white/40 h-full border-2 border-dashed border-white/10 rounded-2xl">
                            <Ticket size={48} className="mb-4 opacity-50" />
                            <p className="text-lg font-bold mb-2">{t('noServicesYet', 'Aún no hay servicios')}</p>
                            <p className="text-sm mt-2 text-white/40">{t('selectGuideImage', 'Selecciona tu imagen guía e incorpora opciones del menú principal.')}</p>
                        </div>
                    ) : (
                        <>
                            {currentModelData && (
                                <div className="bg-brand-accent/10 backdrop-blur-md p-4 rounded-2xl border-2 border-brand-accent/50 relative mb-4 flex gap-4 items-center">
                                    <img src={currentModelData.image} alt={currentModelData.name} className="w-12 h-12 rounded-lg object-cover shadow-md" />
                                    <div>
                                       <p className="font-bold text-sm leading-tight text-brand-accent mb-1">{currentModelData.name.replace('Modelo ', t('baseStyle', 'Estilo Base: '))}</p>
                                       <p className="text-xs font-medium text-white/70">{t('selectedStep1', 'Seleccionado (Paso 1)')}</p>
                                    </div>
                                    <div className="ml-auto text-white/50"><ImageIcon size={20}/></div>
                                </div>
                            )}

                            {reservationCart.map((item, idx) => (
                                <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/5 relative group hover:bg-white/20 transition-colors">
                                    <p className="font-bold text-base leading-tight mr-8 mb-3 text-brand-accent">{item.name.replace(`Reserva: ${currentModelName} - `, '')}</p>
                                    
                                    <div className="flex justify-between items-end mt-3">
                                        <div className="flex items-center gap-4 bg-white/10 rounded-xl p-1.5">
                                            <button onClick={() => handleUpdateQuantity(item.id, -1)} className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"><Minus size={14}/></button>
                                            <span className="font-bold text-sm w-4 text-center select-none">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, 1)} className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors"><Plus size={14}/></button>
                                        </div>
                                        <p className="font-black text-lg">RD${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.id, -item.quantity)} // Removes it
                                      className="absolute top-3 right-3 text-white/30 hover:text-red-400 p-1.5 transition-colors"
                                      title={t('delete', 'Eliminar')}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Discount Banner */}
                {discountPercent > 0 && (
                    <div className="bg-green-500/20 border border-green-500/30 text-green-100 p-3 rounded-xl mb-6 text-xs text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-[5px] h-full bg-green-500"></div>
                        {t('discountMessagePrefix', '¡Llevas')} {hairQuantity} {t('discountMessageTrenzas', 'trenzas!')} {t('discountMessageSuffix', 'Tienes un')} <span className="font-black text-green-400 text-sm">-{discountPercent * 100}%</span> {t('discountMessageDiscount', 'de descuento.')}
                    </div>
                )}

                <div className="border-t border-white/20 pt-6 mt-auto relative">
                    <div className="flex justify-between items-end font-bold mb-6">
                        <span className="text-white/70 uppercase tracking-widest text-xs">{t('finalPrice', 'Precio Final')}</span>
                        <span className="text-3xl lg:text-3xl text-brand-accent font-black tracking-tighter">RD${currentTotal.toFixed(2)}</span>
                    </div>

                    <button 
                        onClick={handleGenerateTicket}
                        disabled={reservationCart.length === 0 || !clientName.trim() || !room.trim() || !selectedDate || !selectedTime}
                        className="w-full bg-brand-accent text-brand-primary py-4 rounded-2xl font-black hover:bg-yellow-400 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(251,191,36,0.6)] text-sm md:text-base uppercase tracking-wider relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                        <Ticket size={20} />
                        {t('generateTicket', 'Generar Ticket')}
                    </button>
                    <p className="text-[10px] text-center text-white/40 mt-3">{t('subjectToValidation', 'Sujeto a validación del peluquero en el estudio.')}</p>
                </div>
            </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxImage(null)}
        >
            <button 
                onClick={() => setLightboxImage(null)}
                className="absolute top-6 right-6 text-white hover:text-brand-accent transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
            >
                <X size={32} />
            </button>
            <img 
                src={lightboxImage} 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl animate-scale-in"
                alt="Vista ampliada"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}
    </div>
  );
};

export default BraidsBooking;
