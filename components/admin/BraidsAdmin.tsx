import React, { useState } from 'react';
import { Scissors, Calendar, List, Search, Plus, Filter, Edit2, Trash2, X, Save, EyeOff, CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useBraidServices } from '../../hooks/useBraidServices';
import { useReservations } from '../../hooks/useReservations';
import { BraidModel, BraidService, ReservationStatus, BlockedTime } from '../../types';
import BraidsCalendar from './BraidsCalendar';
import ImageUploader from './ImageUploader';
import { useConfirm } from '../../hooks/useConfirm';
import { useSiteContent } from '../../hooks/useSiteContent';
import { toast } from '../Toast';
import { useTranslation } from 'react-i18next';

const BraidsAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');

  const { styles, addStyle, updateStyle, deleteStyle } = useBraidStyles();
  const { services, addService, updateService, deleteService } = useBraidServices();
  const { reservations, updateReservationStatus, blockedTimes, addBlockedTime, removeBlockedTime } = useReservations();
  const { getValue, updateValue } = useSiteContent();

  const [editingStyle, setEditingStyle] = useState<BraidModel | null>(null);
  const [editingService, setEditingService] = useState<BraidService | null>(null);
  
  // Settings State
  const [businessHours, setBusinessHours] = useState(() => {
    try {
      return JSON.parse(getValue('business_hours')) || { start: '09:00', end: '18:00' };
    } catch {
      return { start: '09:00', end: '18:00' };
    }
  });
  
  const [holidays, setHolidays] = useState<string[]>(() => {
    try {
      return JSON.parse(getValue('holidays')) || [];
    } catch {
      return [];
    }
  });
  const [newHoliday, setNewHoliday] = useState('');
  // Blocked specific hours
  const [blockedDateInput, setBlockedDateInput] = useState('');
  const [blockedHourInput, setBlockedHourInput] = useState('10:00');

  const { showConfirm, ConfirmDialog } = useConfirm();
  const { t } = useTranslation();

  // ─── 12h helpers ─────────────────────────────────────────────────────
  const to12h = (time: string) => {
    if (!time) return '';
    const [hStr, mStr] = time.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    if (h === 0) h = 12;
    else if (h > 12) h -= 12;
    return `${h}:${m} ${period}`;
  };

  // Generate a list of HH:MM values every 30 min from 7 AM to 9 PM for the selects
  const HOUR_OPTIONS: { label: string; value: string }[] = [];
  for (let h = 7; h <= 21; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const value = `${hh}:${mm}`;
      HOUR_OPTIONS.push({ value, label: to12h(value) });
    }
  }

  const handleCreateNew = () => {
      if (activeTab === 'styles') {
          setEditingStyle({
              id: `m${Date.now()}`,
              name: 'Nuevo Estilo',
              image: '',
              isVisible: true,
              isSoldOut: false
          });
      } else if (activeTab === 'services') {
          setEditingService({
              id: `s${Date.now()}`,
              name: 'Nuevo Servicio',
              price: 100,
              isVisible: true,
              isSoldOut: false
          });
      }
  };

  const handleSaveStyle = () => {
      if (!editingStyle) return;
      if (styles.some(s => s.id === editingStyle.id)) updateStyle(editingStyle);
      else addStyle(editingStyle);
      setEditingStyle(null);
  };

  const handleSaveService = () => {
      if (!editingService) return;
      if (services.some(s => s.id === editingService.id)) updateService(editingService);
      else addService(editingService);
      setEditingService(null);
  };

  const handleSaveSettings = async () => {
      const confirmed = await showConfirm(
        '¿Guardar los cambios de horario comercial? Esto afectará inmediatamente los horarios disponibles para nuevas reservas.',
        { confirmLabel: 'Sí, guardar', title: 'Confirmar Cambios de Horario' }
      );
      if (!confirmed) return;
      await updateValue('business_hours', JSON.stringify(businessHours));
      await updateValue('holidays', JSON.stringify(holidays));
      toast.success('Configuración guardada exitosamente.');
  };

  const handleAddHoliday = async () => {
      if (!newHoliday) return;
      if (holidays.includes(newHoliday)) {
          toast.error('Este día ya está bloqueado.');
          return;
      }
      const formatted = new Date(newHoliday + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const confirmed = await showConfirm(
        `¿Bloquear el día ${formatted}? Los clientes no podrán reservar citas para esa fecha.`,
        { confirmLabel: 'Sí, bloquear', title: 'Confirmar Bloqueo de Día', danger: true }
      );
      if (!confirmed) return;
      setHolidays([...holidays, newHoliday]);
      setNewHoliday('');
      toast.success(`Día ${newHoliday} bloqueado. Recuerda guardar la configuración.`);
  };

  const handleRemoveHoliday = async (date: string) => {
      const formatted = new Date(date + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const confirmed = await showConfirm(
        `¿Desbloquear el día ${formatted}? Los clientes podrán reservar citas para esa fecha nuevamente.`,
        { confirmLabel: 'Sí, desbloquear', title: 'Confirmar Desbloqueo de Día' }
      );
      if (!confirmed) return;
      setHolidays(holidays.filter(h => h !== date));
      toast.success(`Día ${date} desbloqueado. Recuerda guardar la configuración.`);
  };

  const handleAddBlockedHour = async () => {
      if (!blockedDateInput || !blockedHourInput) {
          toast.error('Selecciona una fecha y una hora para bloquear.');
          return;
      }
      const formatted = new Date(blockedDateInput + 'T12:00:00').toLocaleDateString('es-DO', { weekday: 'long', month: 'long', day: 'numeric' });
      const confirmed = await showConfirm(
        `¿Bloquear ${to12h(blockedHourInput)} del ${formatted}? Ningún cliente podrá reservar esa hora específica.`,
        { confirmLabel: 'Sí, bloquear hora', title: 'Confirmar Bloqueo de Hora', danger: true }
      );
      if (!confirmed) return;
      addBlockedTime({ id: `bt-${Date.now()}`, type: 'time', date: blockedDateInput, time: blockedHourInput, reason: 'Bloqueado por admin' });
      setBlockedDateInput('');
      setBlockedHourInput('10:00');
      toast.success(`Hora ${to12h(blockedHourInput)} bloqueada para el ${blockedDateInput}.`);
  };

  const handleRemoveBlockedTime = async (bt: BlockedTime) => {
      const confirmed = await showConfirm(
        `¿Desbloquear ${to12h(bt.time || '')} del ${bt.date}? Los clientes podrán reservar nuevamente esa hora.`,
        { confirmLabel: 'Sí, desbloquear', title: 'Confirmar Desbloqueo de Hora' }
      );
      if (!confirmed) return;
      removeBlockedTime(bt.id);
      toast.success(`Hora ${to12h(bt.time || '')} del ${bt.date} desbloqueada.`);
  };

  const activeReservations = activeTab === 'reservations';

  return (
    <>
    <ConfirmDialog />
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row relative">
       {/* Sidebar */}
       <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0">
           <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
               <Scissors size={20} className="text-brand-accent"/> {t('Trenzas')}
           </h3>

           {[
              { id: 'reservations', label: t('Calendario y Citas'), icon: <Calendar size={18}/> },
              { id: 'styles', label: t('Estilos (Imágenes)'), icon: <List size={18}/> },
              { id: 'services', label: t('Servicios y Precios'), icon: <Scissors size={18}/> },
              { id: 'settings', label: t('Horarios y Agenda'), icon: <Clock size={18}/> },
           ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEditingStyle(null); setEditingService(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${
                      activeTab === tab.id 
                      ? 'bg-white shadow-sm border border-gray-200 text-brand-primary' 
                      : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800 border border-transparent'
                  }`}
               >
                   {tab.icon} {tab.label}
               </button>
           ))}
       </div>

       {/* Área Principal */}
       <div className="flex-1 overflow-hidden flex flex-col relative">
           
           {/* Vista de Edición Estilos (Imágenes) */}
           {editingStyle && activeTab === 'styles' && (
               <div className="flex-1 bg-gray-50/20 p-6 overflow-y-auto w-full">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-black text-gray-800">
                          {styles.some(s => s.id === editingStyle.id) ? t('Editar Estilo') : t('Agregar Estilo')}
                       </h2>
                       <button onClick={() => setEditingStyle(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"><X size={20} /></button>
                   </div>
                   
                   <div className="flex flex-col lg:flex-row gap-6">
                       <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
                           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-100 pb-2">{t('Vista Previa')}</h3>
                           <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative shadow-sm border border-gray-200">
                               <img src={editingStyle.image} alt="preview" className={`w-full h-full object-cover ${editingStyle.isSoldOut ? 'grayscale opacity-70' : ''}`}/>
                               {editingStyle.isSoldOut && (
                                   <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center pointer-events-none">
                                      <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">{t('Agotado')}</span>
                                   </div>
                               )}
                               {editingStyle.isVisible === false && (
                                   <div className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-lg shadow-xl"><EyeOff size={16}/></div>
                               )}
                           </div>
                           <h4 className="font-bold text-gray-800 mt-4 text-center">{editingStyle.name}</h4>
                       </div>
                       
                       <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm h-fit">
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre')}</label>
                               <input type="text" value={editingStyle.name} onChange={e => setEditingStyle({...editingStyle, name: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">{t('URL Imagen')}</label>
                               <input type="text" value={editingStyle.image} onChange={e => setEditingStyle({...editingStyle, image: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm text-gray-500"/>
                           </div>
                           <div className="md:col-span-2">
                               <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción')}</label>
                               <textarea value={editingStyle.description || ''} onChange={e => setEditingStyle({...editingStyle, description: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-20"></textarea>
                           </div>

                           <div className="md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                               <label className="flex items-start gap-3 cursor-pointer">
                                   <input type="checkbox" checked={editingStyle.isVisible !== false} onChange={e => setEditingStyle({...editingStyle, isVisible: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"/>
                                   <div><span className="block font-bold text-gray-800">{t('Visible en Tienda')}</span><span className="block text-xs text-gray-500 mt-0.5">{t('Ocultar de la galería.')}</span></div>
                               </label>
                               <label className="flex items-start gap-3 cursor-pointer">
                                   <input type="checkbox" checked={editingStyle.isSoldOut || false} onChange={e => setEditingStyle({...editingStyle, isSoldOut: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500"/>
                                   <div><span className="block font-bold text-red-600">{t('Marcado como Agotado')}</span><span className="block text-xs text-red-400 mt-0.5">{t('Visible pero sin clics.')}</span></div>
                               </label>
                           </div>

                           <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                               <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">{t('Traductor Global')}</h4>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">{t('Nombre (Inglés)')}</label>
                                       <input type="text" value={editingStyle.nameEn || ''} onChange={e => setEditingStyle({...editingStyle, nameEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">{t('Descripción (Inglés)')}</label>
                                       <input type="text" value={editingStyle.descEn || ''} onChange={e => setEditingStyle({...editingStyle, descEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">{t('Nombre (Francés)')}</label>
                                       <input type="text" value={editingStyle.nameFr || ''} onChange={e => setEditingStyle({...editingStyle, nameFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">{t('Descripción (Francés)')}</label>
                                       <input type="text" value={editingStyle.descFr || ''} onChange={e => setEditingStyle({...editingStyle, descFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                               </div>
                           </div>

                           <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                               <button onClick={handleSaveStyle} className="bg-brand-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"><Save size={18} /> {t('Guardar')}</button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* Vista de Edición Servicios */}
           {editingService && activeTab === 'services' && (
               <div className="flex-1 bg-gray-50/20 p-6 overflow-y-auto w-full">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-black text-gray-800">
                          {services.some(s => s.id === editingService.id) ? t('Editar Servicio') : t('Agregar Servicio')}
                       </h2>
                       <button onClick={() => setEditingService(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full"><X size={20} /></button>
                   </div>
                   
                   <div className="bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm max-w-4xl mx-auto">
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre del Servicio')}</label>
                           <input type="text" value={editingService.name} onChange={e => setEditingService({...editingService, name: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                       </div>
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">{t('Precio (RD$)')}</label>
                           <input type="number" value={editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                       </div>
                       <div className="md:col-span-2">
                           <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción')}</label>
                           <textarea value={editingService.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-20"></textarea>
                       </div>

                       <div className="md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                           <label className="flex items-start gap-3 cursor-pointer">
                               <input type="checkbox" checked={editingService.isVisible !== false} onChange={e => setEditingService({...editingService, isVisible: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"/>
                               <div><span className="block font-bold text-gray-800">{t('Visible en Tienda')}</span></div>
                           </label>
                           <label className="flex items-start gap-3 cursor-pointer">
                               <input type="checkbox" checked={editingService.isSoldOut || false} onChange={e => setEditingService({...editingService, isSoldOut: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500"/>
                               <div><span className="block font-bold text-red-600">{t('Marcado como Agotado')}</span></div>
                           </label>
                       </div>

                       <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                           <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">Traductor Global</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1">Nombre (Inglés)</label>
                                   <input type="text" value={editingService.nameEn || ''} onChange={e => setEditingService({...editingService, nameEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1">Descripción (Inglés)</label>
                                   <input type="text" value={editingService.descEn || ''} onChange={e => setEditingService({...editingService, descEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1">Nombre (Francés)</label>
                                   <input type="text" value={editingService.nameFr || ''} onChange={e => setEditingService({...editingService, nameFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                               </div>
                               <div>
                                   <label className="block text-xs font-bold text-gray-500 mb-1">Descripción (Francés)</label>
                                   <input type="text" value={editingService.descFr || ''} onChange={e => setEditingService({...editingService, descFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                               </div>
                           </div>
                       </div>

                       <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                           <button onClick={handleSaveService} className="bg-brand-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"><Save size={18} /> Guardar</button>
                       </div>
                   </div>
               </div>
           )}

           {/* Listados de Grillas */}
           {!editingStyle && !editingService && (
             <>
               <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                     <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        {activeTab === 'reservations' ? 'Citas Activas' : activeTab === 'styles' ? 'Galería de Trenzas' : activeTab === 'services' ? 'Catálogo de Servicios' : 'Configuración de Agenda'}
                     </h2>
                     <p className="text-sm text-gray-500 font-medium">Todo el flujo de trabajo del Estudio de Trenzas.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                         <input 
                           type="text" 
                           placeholder="Buscar..." 
                           className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm bg-gray-50"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     {activeTab !== 'reservations' && activeTab !== 'settings' && (
                         <button onClick={handleCreateNew} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap border-2 border-transparent hover:border-brand-primary hover:bg-brand-cream hover:text-brand-primary transition-all">
                            + Agregar
                         </button>
                     )}
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/20">
                   
                   {activeTab === 'reservations' && (
                       <BraidsCalendar />
                   )}

                   {activeTab === 'styles' && (
                       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                           {styles.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((style) => (
                               <div key={style.id} className={`bg-white rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all relative group flex flex-col ${style.isVisible === false ? 'border-dashed border-gray-300 opacity-60' : 'border-gray-200'}`}>
                                   <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                                       <img src={style.image} alt={style.name} className={`w-full h-full object-cover ${style.isSoldOut ? 'grayscale opacity-70' : ''}`} />
                                       
                                       {style.isVisible === false && (
                                           <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white p-1.5 rounded-lg shadow-sm" title="Oculto para el público"><EyeOff size={14}/></div>
                                       )}
                                       {style.isSoldOut && (
                                           <div className="absolute inset-0 bg-white/40 flex items-center justify-center pointer-events-none">
                                              <span className="bg-red-500 text-[10px] text-white font-black px-2 py-1 uppercase tracking-widest rounded-md shadow-lg border border-white -rotate-12">{t('Agotado')}</span>
                                           </div>
                                       )}
                                   </div>
                                   <div className="p-3 bg-white flex-1 flex flex-col">
                                       <p className="text-xs font-bold text-gray-800 truncate mb-1">{style.name}</p>
                                       <div className="mt-auto flex items-center justify-between">
                                          <p className="text-[10px] text-gray-400 truncate">ID: {style.id}</p>
                                           <button onClick={() => setEditingStyle(style)} className="text-[10px] font-bold text-brand-accent hover:underline">{t('Editar')}</button>
                                       </div>
                                   </div>
                                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm">
                                       <button 
                                           onClick={async () => {
                                               if (await showConfirm(`¿Estás seguro de eliminar el estilo "${style.name}"?`)) {
                                                   deleteStyle(style.id);
                                               }
                                           }} 
                                           className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded p-1 transition-colors"
                                       >
                                           <Trash2 size={14} />
                                       </button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}

                   {activeTab === 'services' && (
                       <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                           <table className="w-full text-left border-collapse">
                               <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest sticky top-0">
                                   <tr>
                                       <td className="p-4">{t('ID / Estado')}</td>
                                        <td className="p-4 w-1/2">{t('Servicio / Descripción')}</td>
                                        <td className="p-4">{t('Precio (RD$)')}</td>
                                        <td className="p-4 text-center">{t('Gestión')}</td>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100 text-sm">
                                   {services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(srv => (
                                       <tr key={srv.id} className={`hover:bg-gray-50/50 transition-colors ${srv.isVisible === false ? 'bg-gray-50 opacity-60' : ''}`}>
                                           <td className="p-4">
                                               <span className="font-mono text-gray-400 text-xs block mb-1">{srv.id}</span>
                                               <div className="flex gap-1">
                                                  {srv.isVisible === false && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><EyeOff size={10}/> {t('Oculto')}</span>}
                                                  {srv.isSoldOut && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{t('Agotado')}</span>}
                                               </div>
                                           </td>
                                           <td className="p-4">
                                               <p className="font-bold text-gray-800">{srv.name}</p>
                                               <p className="text-xs text-gray-500 mt-1 line-clamp-2">{srv.description}</p>
                                               {srv.nameEn && <p className="text-[10px] text-brand-accent font-bold mt-1">EN: {srv.nameEn}</p>}
                                           </td>
                                           <td className="p-4 font-black text-brand-primary break-keep whitespace-nowrap">
                                               ${srv.price.toFixed(2)}
                                           </td>
                                           <td className="p-4 text-center space-x-2 whitespace-nowrap">
                                              <button onClick={() => setEditingService(srv)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                                              <button 
                                                  onClick={async () => {
                                                      if (await showConfirm(`¿Estás seguro de eliminar el servicio "${srv.name}"?`)) {
                                                          deleteService(srv.id);
                                                      }
                                                  }} 
                                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                              >
                                                  <Trash2 size={16} />
                                              </button>
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   )}

                   {activeTab === 'settings' && (
                       <div className="max-w-2xl">
                           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6">
                               <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><Clock size={20} className="text-brand-accent" /> {t('Horario Comercial')}</h3>
                               <div className="grid grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-sm font-bold text-gray-700 mb-1">{t('Hora de Apertura')}</label>
                                       <select value={businessHours.start} onChange={e => setBusinessHours({...businessHours, start: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none bg-white">
                                           {HOUR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                       </select>
                                   </div>
                                   <div>
                                       <label className="block text-sm font-bold text-gray-700 mb-1">{t('Hora de Cierre')}</label>
                                       <select value={businessHours.end} onChange={e => setBusinessHours({...businessHours, end: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none bg-white">
                                           {HOUR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                       </select>
                                   </div>
                               </div>
                               <p className="text-xs text-gray-500 mt-3 font-medium">{t('Las horas disponibles para reservar se generarán automáticamente dentro de este rango.')}</p>
                           </div>

                           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                               <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"><Calendar size={20} className="text-brand-accent" /> {t('Días Feriados / No Laborables')}</h3>
                               <div className="flex gap-2 mb-4">
                                   <input type="date" value={newHoliday} onChange={e => setNewHoliday(e.target.value)} className="flex-1 border border-gray-200 p-2 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"/>
                                   <button 
                                      onClick={handleAddHoliday}
                                      className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                                   >
                                       <Ban size={16}/> {t('Bloquear Día')}
                                   </button>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                   {holidays.length === 0 && <span className="text-sm text-gray-400 italic">{t('No hay días bloqueados.')}</span>}
                                   {holidays.map(date => (
                                       <span key={date} className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                                           {date}
                                           <button onClick={() => handleRemoveHoliday(date)} className="hover:bg-red-200 p-0.5 rounded text-red-800 transition-colors" title="Desbloquear este día"><X size={14} /></button>
                                       </span>
                                   ))}
                               </div>
                            </div>

                            {/* Bloqueo de Horas Específicas */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mt-6">
                                <h3 className="font-bold text-lg text-gray-800 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <Clock size={20} className="text-orange-500" /> {t('Bloquear Horas Específicas')}
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">{t('Bloquea una hora concreta en un día concreto (ej. las 2:00 PM del lunes por una reunión).')}</p>
                                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                    <input
                                        type="date" value={blockedDateInput}
                                        onChange={e => setBlockedDateInput(e.target.value)}
                                        className="flex-1 border border-gray-200 p-2 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                                    />
                                    <select
                                        value={blockedHourInput}
                                        onChange={e => setBlockedHourInput(e.target.value)}
                                        className="border border-gray-200 p-2 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm bg-white"
                                    >
                                        {HOUR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                    </select>
                                    <button
                                        onClick={handleAddBlockedHour}
                                        className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 rounded-xl font-bold transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        <Ban size={16}/> {t('Bloquear Hora')}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {blockedTimes.length === 0 && <span className="text-sm text-gray-400 italic">{t('No hay horas bloqueadas específicas.')}</span>}
                                    {blockedTimes.map(bt => (
                                        <span key={bt.id} className="bg-orange-50 text-orange-700 border border-orange-100 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2">
                                            <Clock size={12}/> {bt.date} @ {to12h(bt.time || '')}
                                            {bt.reason && <span className="text-orange-400 text-xs font-normal">({bt.reason})</span>}
                                            <button onClick={() => handleRemoveBlockedTime(bt)} className="hover:bg-orange-200 p-0.5 rounded text-orange-900 transition-colors" title="Desbloquear"><X size={14} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                           <div className="mt-6 flex justify-end">
                               <button onClick={handleSaveSettings} className="bg-brand-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2 shadow-sm">
                                   <Save size={18} /> {t('Guardar Configuración')}
                               </button>
                           </div>
                       </div>
                   )}
               </div>
             </>
           )}
       </div>
    </div>
    </>
  );
};

export default BraidsAdmin;
