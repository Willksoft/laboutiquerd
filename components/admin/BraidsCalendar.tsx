import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Minus, X, Save, Edit2, Trash2, Clock, Calendar as CalendarIcon, Ticket, List, Filter, Search, User, DoorOpen, AlertTriangle } from 'lucide-react';
import { useReservations, STANDARD_HOURS } from '../../hooks/useReservations';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useBraidServices } from '../../hooks/useBraidServices';
import { useVendors } from '../../hooks/useVendors';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { Reservation, ReservationStatus, BraidService } from '../../types';
import CustomSelect from '../ui/CustomSelect';
import { useConfirm } from '../../hooks/useConfirm';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    'Pendiente': { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Confirmada': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    'Completada': { bg: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
    'Cancelada': { bg: 'bg-red-50 border-red-200', text: 'text-red-700', dot: 'bg-red-500' },
    'No Show': { bg: 'bg-gray-100 border-gray-300', text: 'text-gray-600', dot: 'bg-gray-500' },
};

type ViewMode = 'calendar' | 'list';

const BraidsCalendar: React.FC = () => {
  const { reservations, addReservation, updateReservation, deleteReservation, updateReservationStatus, blockedTimes, addBlockedTime, removeBlockedTime, blockedDaysOfWeek, toggleBlockedDayOfWeek, blockedStandardHours, toggleBlockedStandardHour, customHours, addCustomHour, removeCustomHour } = useReservations();

  const { styles } = useBraidStyles();
  const { services } = useBraidServices();
  const { vendors } = useVendors();
  const { showConfirm, showAlert, ConfirmDialog } = useConfirm();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date().setHours(0,0,0,0)));

  const navigate = useNavigate();
  const [editingRes, setEditingRes] = useState<Reservation | null>(null);
  const [deletingResId, setDeletingResId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [listSearch, setListSearch] = useState('');
  const [listStatusFilter, setListStatusFilter] = useState('all');
  
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockType, setBlockType] = useState<'hora' | 'dia'>('hora');
  const [blockTimeValue, setBlockTimeValue] = useState('10:00');
  const [newHourInput, setNewHourInput] = useState('08:00');


  // Lock body scroll when any modal is open
  useBodyScrollLock(!!editingRes || !!deletingResId || showBlockModal);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
      setSelectedDate(new Date(year, month, day, 0, 0, 0, 0));
      setIsFormOpen(false);
  };

  // Helper para comparar si un Reservation date coincide
  const isSameDate = (isoDateStr: string, dateObj: Date) => {
      if (!isoDateStr) return false;
      const [y, m, d] = isoDateStr.split('T')[0].split('-');
      return parseInt(y) === dateObj.getFullYear() && 
             parseInt(m) - 1 === dateObj.getMonth() && 
             parseInt(d) === dateObj.getDate();
  };

  const selectedDateStr = selectedDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const selectedDateIso = selectedDate.toISOString().split('T')[0];

  const dailyReservations = useMemo(() => {
      return reservations.filter(r => isSameDate(r.date, selectedDate)).sort((a,b) => a.time.localeCompare(b.time));
  }, [reservations, selectedDate]);

  const dailyBlocks = useMemo(() => {
      return blockedTimes.filter(b => b.date === selectedDateIso || !b.date);
  }, [blockedTimes, selectedDateIso]);

  // All reservations for list view
  const filteredReservations = useMemo(() => {
      let list = [...reservations].sort((a,b) => b.date.localeCompare(a.date) || a.time.localeCompare(b.time));
      if (listSearch) {
          const q = listSearch.toLowerCase();
          list = list.filter(r => r.clientName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || (r.room || '').toLowerCase().includes(q));
      }
      if (listStatusFilter !== 'all') {
          list = list.filter(r => r.status === listStatusFilter);
      }
      return list;
  }, [reservations, listSearch, listStatusFilter]);

  // Generators for Calendar
  const getDayEvents = (day: number) => {
      const dayDate = new Date(year, month, day);
      return reservations.filter(r => isSameDate(r.date, dayDate)).length;
  };

  const isDayBlocked = (day: number) => {
      const dayDate = new Date(year, month, day);
      return blockedDaysOfWeek.includes(dayDate.getDay());
  };

  const handleNewReservation = () => {
      setEditingRes({
          id: `BKG-${Math.floor(Math.random() * 10000)}`,
          clientName: '',
          room: '',
          date: selectedDateIso,
          time: '10:00',
          modelId: '',
          modelName: '',
          servicesDetails: [],
          total: 0,
          status: 'Pendiente'
      } as unknown as Reservation);
      setIsFormOpen(true);
  };

  const handleEdit = (res: Reservation) => {
      setEditingRes({...res});
      setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
      setDeletingResId(id);
  };

  const confirmDelete = () => {
      if (deletingResId) {
          deleteReservation(deletingResId);
          setIsFormOpen(false);
          setDeletingResId(null);
      }
  };

  const saveReservation = async () => {
      if (!editingRes) return;

      // ═══════ VALIDATION ═══════
      if (!editingRes.clientName.trim()) {
          showAlert('El nombre del cliente es requerido.');
          return;
      }
      if (!editingRes.modelId) {
          showAlert('Debes seleccionar un modelo/estilo.');
          return;
      }
      if (!editingRes.servicesDetails || editingRes.servicesDetails.length === 0) {
          showAlert('Debes agregar al menos un servicio.');
          return;
      }
      // Check past date
      const resDate = new Date(editingRes.date + 'T' + editingRes.time);
      if (resDate < new Date()) {
          showAlert('No se pueden crear citas en el pasado.');
          return;
      }
      // Check blocked day
      const resDay = new Date(editingRes.date).getDay();
      if (blockedDaysOfWeek.includes(resDay)) {
          showAlert('Este día está bloqueado. No se pueden crear citas.');
          return;
      }
      // Check blocked hour
      if (blockedStandardHours.includes(editingRes.time)) {
          showAlert(`La hora ${editingRes.time} está bloqueada.`);
          return;
      }
      // Check conflict with existing reservations (same date+time)
      const conflict = reservations.find(r =>
          r.id !== editingRes.id &&
          r.date === editingRes.date &&
          r.time === editingRes.time &&
          r.status !== 'Cancelada' &&
          r.status !== 'Completada'
      );
      if (conflict) {
          if (!(await showConfirm(`Ya existe una cita a las ${editingRes.time} con ${conflict.clientName}. ¿Deseas continuar de todos modos?`))) {
              return;
          }
      }

      if (reservations.some(r => r.id === editingRes.id)) {
          updateReservation(editingRes);
      } else {
          addReservation(editingRes);
      }
      setIsFormOpen(false);
  };

  const addServiceQty = (srv: BraidService) => {
      if (!editingRes) return;
      let newServices = [...editingRes.servicesDetails];
      const idx = newServices.findIndex(s => s.id === srv.id);
      if (idx >= 0) {
          newServices[idx] = { ...newServices[idx], quantity: (newServices[idx].quantity || 1) + 1 };
      } else {
          newServices.push({ ...srv, quantity: 1 });
      }
      const newTotal = newServices.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);
      setEditingRes({...editingRes, servicesDetails: newServices, total: newTotal});
  };

  const removeServiceQty = (srvId: string) => {
      if (!editingRes) return;
      let newServices = [...editingRes.servicesDetails];
      const idx = newServices.findIndex(s => s.id === srvId);
      if (idx >= 0) {
          const q = (newServices[idx].quantity || 1) - 1;
          if (q <= 0) {
              newServices.splice(idx, 1);
          } else {
              newServices[idx] = { ...newServices[idx], quantity: q };
          }
      }
      const newTotal = newServices.reduce((sum, s) => sum + s.price * (s.quantity || 1), 0);
      setEditingRes({...editingRes, servicesDetails: newServices, total: newTotal});
  };

  const getVendorName = (id?: string) => {
      if (!id) return '-';
      const v = vendors.find(v => v.id === id);
      return v ? v.name : id;
  };

  const navigateToReceipt = (r: Reservation) => {
      navigate('/admin/receipt', { state: {
          items: [{
              id: r.id,
              name: `Reserva: ${r.modelName}`,
              price: r.total,
              quantity: 1,
              type: 'service',
              details: { clientName: r.clientName, room: r.room, date: r.date, time: r.time, vendorId: r.vendorId }
          }],
          total: r.total,
          backTo: '/admin/braids'
      }});
  };

  // Stats
  const todayCount = reservations.filter(r => isSameDate(r.date, new Date(new Date().setHours(0,0,0,0)))).length;
  const pendingCount = reservations.filter(r => r.status === 'Pendiente').length;
  const confirmedCount = reservations.filter(r => r.status === 'Confirmada').length;

  return (
    <>
    <ConfirmDialog />
    {/* Stats Row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hoy</p>
            <p className="text-2xl font-black text-brand-primary mt-1">{todayCount}</p>
            <p className="text-[10px] text-gray-400">citas programadas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pendientes</p>
            <p className="text-2xl font-black text-yellow-600 mt-1">{pendingCount}</p>
            <p className="text-[10px] text-gray-400">por confirmar</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Confirmadas</p>
            <p className="text-2xl font-black text-blue-600 mt-1">{confirmedCount}</p>
            <p className="text-[10px] text-gray-400">listas</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
            <p className="text-2xl font-black text-gray-800 mt-1">{reservations.length}</p>
            <p className="text-[10px] text-gray-400">todas las reservas</p>
        </div>
    </div>

    {/* View Toggle + Nueva Cita */}
    <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setViewMode('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'calendar' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                <CalendarIcon size={16}/> Calendario
            </button>
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}>
                <List size={16}/> Lista Completa
            </button>
        </div>
        <button 
            onClick={handleNewReservation}
            className="bg-brand-primary text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors shadow-sm whitespace-nowrap"
        >
            <Plus size={18}/> Nueva Cita
        </button>
    </div>

    {viewMode === 'calendar' ? (
    <div className="flex flex-col xl:flex-row gap-6">
       {/* Sección de Calendario - GRANDE */}
       <div className="w-full xl:w-3/5 flex flex-col gap-4">
           
           <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
               {/* Controls */}
               <div className="flex justify-between items-center mb-8">
                   <h3 className="font-serif font-bold text-2xl md:text-3xl text-gray-800 tracking-tight">
                       {MONTHS[month]} {year}
                   </h3>
                   <div className="flex gap-2">
                       <button onClick={prevMonth} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ChevronLeft size={22}/></button>
                       <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date(new Date().setHours(0,0,0,0))); }} className="px-4 py-1.5 text-sm font-bold bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full transition-colors shadow-sm">Hoy</button>
                       <button onClick={nextMonth} className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"><ChevronRight size={22}/></button>
                   </div>
               </div>

               {/* Weekdays */}
               <div className="grid grid-cols-7 gap-2 mb-3">
                   {DAYS.map(d => (
                       <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider py-2">{d}</div>
                   ))}
               </div>

               {/* Days - Bigger cells */}
               <div className="grid grid-cols-7 gap-2">
                   {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                       <div key={`empty-${i}`} className="min-h-[70px] md:min-h-[85px]"></div>
                   ))}
                   
                   {Array.from({ length: daysInMonth }).map((_, i) => {
                       const day = i + 1;
                       const eventsCount = getDayEvents(day);
                       const blocked = isDayBlocked(day);
                       const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
                       const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

                       return (
                           <button 
                               key={day}
                               onClick={() => handleDayClick(day)}
                               className={`min-h-[70px] md:min-h-[85px] border-2 rounded-xl flex flex-col items-center justify-start pt-2 relative transition-all ${
                                   isSelected ? 'bg-brand-primary text-white font-bold border-brand-primary shadow-lg shadow-brand-primary/20 scale-[1.02]' : 
                                   blocked ? 'bg-red-50/50 border-red-100 text-red-300 cursor-not-allowed' :
                                   isToday ? 'bg-brand-accent/20 border-brand-accent/40 font-bold' : 
                                   'bg-white border-gray-100 hover:border-brand-accent/50 hover:bg-gray-50/50'
                               }`}
                           >
                               <span className={`text-base md:text-lg font-bold ${isSelected ? 'text-white' : isToday ? 'text-brand-primary' : blocked ? 'text-red-300' : 'text-gray-700'}`}>{day}</span>
                               {blocked && <span className="text-[8px] text-red-400 uppercase font-bold mt-0.5">Cerrado</span>}
                               {eventsCount > 0 && (
                                   <div className={`mt-auto mb-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                       isSelected ? 'bg-white/20 text-white' : 'bg-brand-primary/10 text-brand-primary'
                                   }`}>
                                       <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-brand-accent' : 'bg-brand-primary'}`}></div>
                                       {eventsCount}
                                   </div>
                               )}
                           </button>
                       )
                   })}
               </div>
           </div>

           {/* Config Panel */}
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Clock size={18} className="text-brand-accent"/> Configuración de Disponibilidad
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-100 p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Días Desactivados</p>
                      <div className="flex flex-wrap gap-2">
                          {DAYS.map((d, index) => {
                              const isBlocked = blockedDaysOfWeek.includes(index);
                              return (
                                  <button
                                      key={d}
                                      onClick={() => toggleBlockedDayOfWeek(index)}
                                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${isBlocked ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'}`}
                                  >
                                      {d}
                                  </button>
                              );
                          })}
                      </div>
                  </div>

                  <div className="border border-gray-100 p-4 rounded-xl">
                      <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Horas Disponibles</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                          {customHours.map((h) => {
                              const isBlocked = blockedStandardHours.includes(h.val);
                              return (
                                  <div key={h.val} className="flex items-center gap-0.5">
                                      <button
                                          onClick={() => toggleBlockedStandardHour(h.val)}
                                          title={isBlocked ? 'Click para desbloquear' : 'Click para bloquear'}
                                          className={`px-2.5 py-1 text-[11px] font-bold rounded-l-lg transition-colors ${
                                              isBlocked
                                                  ? 'bg-red-500 text-white shadow-sm'
                                                  : 'bg-gray-100 text-gray-600 hover:bg-brand-accent/20 hover:text-brand-primary'
                                          }`}
                                      >
                                          {h.label}
                                      </button>
                                      <button
                                          onClick={() => removeCustomHour(h.val)}
                                          title="Eliminar esta hora"
                                          className="px-1.5 py-1 text-[10px] rounded-r-lg bg-gray-200 text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
                                      >
                                          <X size={10}/>
                                      </button>
                                  </div>
                              );
                          })}
                          {customHours.length === 0 && (
                              <p className="text-xs text-gray-400 italic">Sin horas configuradas</p>
                          )}
                      </div>
                      {/* Add new hour */}
                      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                          <input
                              type="time"
                              value={newHourInput}
                              onChange={e => setNewHourInput(e.target.value)}
                              className="flex-1 text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-brand-accent outline-none"
                          />
                          <button
                              onClick={() => { addCustomHour(newHourInput); }}
                              className="bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-brand-accent hover:text-brand-primary transition-colors whitespace-nowrap"
                          >
                              + Agregar
                          </button>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-2">Rojo = bloqueada globalmente. X = eliminar hora.</p>
                  </div>

              </div>

              <div className="flex justify-between items-center mt-2">
                  <p className="text-[10px] text-gray-400">Bloqueos extras para fechas específicas:</p>
                  <button 
                     onClick={() => setShowBlockModal(true)}
                     className="text-xs bg-red-50 text-red-600 font-bold px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-500 hover:text-white transition-colors"
                  >
                     + Bloquear Fecha/Hora
                  </button>
              </div>
              {dailyBlocks.length > 0 && (
                  <div className="space-y-2">
                      {dailyBlocks.map((b, i) => (
                         <div key={b.id || i} className="text-sm bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                 <AlertTriangle size={14}/>
                                 <span className="font-bold">{b.type === 'date' ? 'Día Completo' : b.time}</span>
                                 <span className="text-red-400 text-xs">{b.reason}</span>
                             </div>
                             <button onClick={() => removeBlockedTime(b.id)} className="text-red-400 hover:text-red-600 p-1"><X size={14}/></button>
                         </div>
                      ))}
                  </div>
              )}
           </div>
       </div>

       {/* Sección de Citas del día */}
       <div className="w-full xl:w-2/5 flex flex-col gap-6">
           
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col min-h-[500px]">
                   <div className="flex justify-between items-center mb-6">
                       <div>
                           <h3 className="font-bold text-xl text-gray-800 capitalize">{selectedDateStr}</h3>
                           <p className="text-sm text-gray-500">{dailyReservations.length} Cita{dailyReservations.length !== 1 && 's'} pautadas</p>
                       </div>
                       <button 
                           onClick={handleNewReservation}
                           className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors shadow-sm"
                           title="Añadir Cita"
                       >
                           <Plus size={20} />
                       </button>
                   </div>

                   <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
                       {dailyReservations.map(r => {
                           const sc = STATUS_COLORS[r.status] || STATUS_COLORS['Pendiente'];
                           return (
                           <div key={r.id} className="p-4 rounded-xl border border-gray-100 hover:border-brand-accent/50 transition-colors bg-gray-50/50 group">
                               <div className="flex justify-between items-start mb-2">
                                   <div>
                                       <div className="font-black text-lg text-brand-primary flex items-center gap-2">{r.time} <span className="text-[10px] font-normal text-gray-400 font-mono">{r.id}</span></div>
                                       <div className="font-bold text-gray-800 flex items-center gap-1.5"><User size={12}/> {r.clientName}</div>
                                       {r.room && <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><DoorOpen size={11}/> Hab: {r.room}</div>}
                                       {r.vendorId && <div className="text-[10px] text-brand-accent font-bold mt-1">Vendedor: {getVendorName(r.vendorId)}</div>}
                                   </div>
                                   <div className="flex flex-col items-end gap-2">
                                       <CustomSelect 
                                           value={r.status} 
                                           onChange={(val) => updateReservationStatus(r.id, val as ReservationStatus)}
                                           options={[
                                               { value: 'Pendiente', label: 'Pendiente', colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-200', dotColor: 'bg-yellow-500' },
                                               { value: 'Confirmada', label: 'Confirmada', colorClass: 'bg-blue-50 text-blue-600 border-blue-200', dotColor: 'bg-blue-500' },
                                               { value: 'Completada', label: 'Completada', colorClass: 'bg-green-50 text-green-600 border-green-200', dotColor: 'bg-green-500' },
                                               { value: 'Cancelada', label: 'Cancelada', colorClass: 'bg-red-50 text-red-600 border-red-200', dotColor: 'bg-red-500' },
                                               { value: 'No Show', label: 'No Show', colorClass: 'bg-gray-100 text-gray-600 border-gray-300', dotColor: 'bg-gray-500' }
                                           ]}
                                       />
                                       <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <button onClick={() => navigateToReceipt(r)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-primary transition-colors" title="Ver Recibo"><Ticket size={14}/></button>
                                           <button onClick={() => handleEdit(r)} className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors" title="Editar"><Edit2 size={14}/></button>
                                           <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14}/></button>
                                       </div>
                                   </div>
                               </div>
                               <div className="mt-3 pt-3 border-t border-gray-200/50">
                                   <div className="text-xs text-gray-600 font-bold mb-1">Servicios:</div>
                                   {r.servicesDetails.map(s => (
                                       <div key={s.id} className="text-xs text-gray-500 flex justify-between">
                                          <span>• {s.name}{(s.quantity || 1) > 1 ? ` x${s.quantity}` : ''}</span>
                                          <span>${(s.price * (s.quantity || 1)).toFixed(2)}</span>
                                       </div>
                                   ))}
                                   <div className="mt-2 text-right font-black text-brand-primary">Total: ${r.total.toFixed(2)}</div>
                               </div>
                           </div>
                       )})}
                       {dailyReservations.length === 0 && (
                           <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
                               <CalendarIcon size={48} className="mb-3 opacity-15"/>
                               <p className="font-bold text-sm">Sin citas este día</p>
                               <p className="text-xs text-gray-300 mt-1">Haz clic en "+ Nueva Cita" para agregar una</p>
                           </div>
                       )}
                   </div>
               </div>

       </div>
    </div>
    ) : (
    /* =================== LIST VIEW =================== */
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input 
                  type="text" 
                  placeholder="Buscar por cliente, ID, habitación..." 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm"
                  value={listSearch}
                  onChange={e => setListSearch(e.target.value)}
                />
            </div>
            <CustomSelect 
                value={listStatusFilter}
                onChange={setListStatusFilter}
                options={[
                    { value: 'all', label: 'Todos los estados' },
                    { value: 'Pendiente', label: 'Pendientes', dotColor: 'bg-yellow-500' },
                    { value: 'Confirmada', label: 'Confirmadas', dotColor: 'bg-blue-500' },
                    { value: 'Completada', label: 'Completadas', dotColor: 'bg-green-500' },
                    { value: 'Cancelada', label: 'Canceladas', dotColor: 'bg-red-500' },
                    { value: 'No Show', label: 'No Show', dotColor: 'bg-gray-500' },
                ]}
                className="w-full sm:w-48"
            />
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                   <tr>
                     <th className="p-4">ID</th>
                     <th className="p-4">Fecha / Hora</th>
                     <th className="p-4">Cliente</th>
                     <th className="p-4">Habitación</th>
                     <th className="p-4">Vendedor</th>
                     <th className="p-4">Total</th>
                     <th className="p-4">Estado</th>
                     <th className="p-4 text-center">Acciones</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-sm">
                   {filteredReservations.map(r => {
                       const sc = STATUS_COLORS[r.status] || STATUS_COLORS['Pendiente'];
                       return (
                       <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                           <td className="p-4 font-mono text-xs text-gray-400">{r.id}</td>
                           <td className="p-4">
                               <div className="font-bold text-gray-800">{r.date}</div>
                               <div className="text-xs text-brand-primary font-bold">{r.time}</div>
                           </td>
                           <td className="p-4 font-bold text-gray-800">{r.clientName}</td>
                           <td className="p-4 text-gray-600">{r.room || '-'}</td>
                           <td className="p-4 text-xs text-brand-accent font-bold">{getVendorName(r.vendorId)}</td>
                           <td className="p-4 font-black text-brand-primary">${r.total.toFixed(2)}</td>
                           <td className="p-4">
                               <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.text}`}>
                                   <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                                   {r.status}
                               </span>
                           </td>
                           <td className="p-4 text-center">
                               <div className="flex items-center justify-center gap-1">
                                   <button onClick={() => navigateToReceipt(r)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-brand-primary transition-colors" title="Ver Recibo"><Ticket size={14}/></button>
                                   <button onClick={() => { setSelectedDate(new Date(r.date + 'T00:00:00')); handleEdit(r); setViewMode('calendar'); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-primary/10 hover:text-brand-primary transition-colors" title="Editar"><Edit2 size={14}/></button>
                                   <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={14}/></button>
                               </div>
                           </td>
                       </tr>
                   )})}
                   {filteredReservations.length === 0 && (
                       <tr>
                           <td colSpan={8} className="p-12 text-center text-gray-400 font-bold">No se encontraron reservas.</td>
                       </tr>
                   )}
               </tbody>
            </table>
        </div>
    </div>
    )}


    
    {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-2xl relative animate-scale-in">
                <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Bloquear Espacio Extra</h3>
                    <button onClick={() => setShowBlockModal(false)} className="p-2 bg-white text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Bloquear Tipo</label>
                        <CustomSelect 
                            value={blockType}
                            onChange={val => setBlockType(val as 'hora' | 'dia')}
                            options={[
                                { value: 'hora', label: 'Hora Específica' },
                                { value: 'dia', label: 'Día Completo' }
                            ]}
                        />
                    </div>
                    {blockType === 'hora' && (
                       <div>
                           <label className="block text-sm font-bold text-gray-700 mb-2">Hora a Bloquear</label>
                           <input 
                              type="time" 
                              value={blockTimeValue}
                              onChange={e => setBlockTimeValue(e.target.value)}
                              className="w-full border-2 border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none font-bold"
                           />
                       </div>
                    )}
                    <button 
                        onClick={() => {
                            if (blockType === 'dia') {
                                addBlockedTime({ id: `blk-${Date.now()}`, type: 'date', date: selectedDateIso, reason: 'Día Cerrado Manualmente' });
                            } else {
                                if (!blockTimeValue) return;
                                addBlockedTime({ id: `blk-${Date.now()}`, type: 'time', date: selectedDateIso, time: blockTimeValue, reason: 'Hora Bloqueada Manualmente' });
                            }
                            setShowBlockModal(false);
                        }}
                        className="w-full mt-2 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Confirmar Bloqueo
                    </button>
                </div>
            </div>
        </div>
    )}

    {deletingResId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden shadow-2xl relative animate-scale-in">
                <div className="p-6 text-center">
                    <Trash2 size={40} className="mx-auto text-red-500 mb-4 opacity-80" />
                    <h3 className="font-bold text-lg text-gray-800 mb-2">¿Eliminar Reserva?</h3>
                    <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
                    <div className="flex gap-4">
                        <button onClick={() => setDeletingResId(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancelar</button>
                        <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30">Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    )}
    {/* ════════════════ ADVANCED RESERVATION MODAL ════════════════ */}
    {isFormOpen && editingRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl relative animate-scale-in">
                {/* Modal Header */}
                <div className="bg-brand-primary text-white p-6 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">
                            {reservations.some(r => r.id === editingRes.id) ? 'Editar Cita' : 'Nueva Cita'}
                        </h3>
                        <p className="text-white/60 text-sm mt-0.5">ID: {editingRes.id}</p>
                    </div>
                    <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={22}/></button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

                    {/* ── Estilo de Trenza ── */}
                    <div>
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">Estilo de Trenza *</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                            {styles.map(style => {
                                const isSelected = editingRes.modelId === style.id;
                                return (
                                    <div 
                                        key={style.id}
                                        onClick={() => setEditingRes({...editingRes, modelId: style.id, modelName: style.name})}
                                        className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group
                                            ${isSelected 
                                                ? 'border-brand-primary ring-2 ring-brand-accent shadow-lg scale-[1.02]' 
                                                : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="aspect-square bg-gray-100">
                                            <img src={style.image} alt={style.name} className="w-full h-full object-cover"/>
                                        </div>
                                        <div className={`p-2 text-center ${isSelected ? 'bg-brand-primary text-white' : 'bg-white text-gray-700'}`}>
                                            <p className="text-[10px] font-bold truncate">{style.name}</p>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Info del Cliente ── */}
                    <div className="border-t border-gray-100 pt-5">
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">Información del Cliente</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-1">Vendedor/a *</label>
                                <CustomSelect 
                                    value={editingRes.vendorId || ''} 
                                    onChange={val => setEditingRes({...editingRes, vendorId: val})}
                                    options={[
                                        { value: '', label: 'Seleccionar...' },
                                        ...vendors.map(v => ({ value: v.id, label: `${v.name} (${v.role})` }))
                                    ]}
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-1">Nombre del Cliente *</label>
                                <input type="text" placeholder="Nombre completo" value={editingRes.clientName} onChange={e => setEditingRes({...editingRes, clientName: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent bg-gray-50 text-sm"/>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-1">Habitación / Ref. *</label>
                                <input type="text" placeholder="Ej: 204-A" value={editingRes.room || ''} onChange={e => setEditingRes({...editingRes, room: e.target.value})} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent bg-gray-50 text-sm"/>
                            </div>
                        </div>
                    </div>

                    {/* ── Fecha, Hora, Estado ── */}
                    <div className="border-t border-gray-100 pt-5">
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">Programación</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-1">Fecha *</label>
                                <input type="date" value={editingRes.date} min={new Date().toISOString().split('T')[0]} onChange={e => {
                                    const d = new Date(e.target.value + 'T00:00:00');
                                    if (blockedDaysOfWeek.includes(d.getDay())) {
                                        return; // day is blocked
                                    }
                                    setEditingRes({...editingRes, date: e.target.value});
                                }} className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent bg-gray-50 text-sm"/>
                                {editingRes.date && blockedDaysOfWeek.includes(new Date(editingRes.date + 'T00:00:00').getDay()) && (
                                    <p className="text-[10px] text-red-500 font-bold mt-1 flex items-center gap-1"><AlertTriangle size={10}/> Este día está bloqueado</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-gray-400 mb-1">Estado</label>
                                <CustomSelect
                                    value={editingRes.status}
                                    onChange={val => setEditingRes({...editingRes, status: val as ReservationStatus})}
                                    options={[
                                        { value: 'Pendiente', label: 'Pendiente', colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-200', dotColor: 'bg-yellow-500' },
                                        { value: 'Confirmada', label: 'Confirmada', colorClass: 'bg-blue-50 text-blue-600 border-blue-200', dotColor: 'bg-blue-500' },
                                        { value: 'Completada', label: 'Completada', colorClass: 'bg-green-50 text-green-600 border-green-200', dotColor: 'bg-green-500' },
                                        { value: 'Cancelada', label: 'Cancelada', colorClass: 'bg-red-50 text-red-600 border-red-200', dotColor: 'bg-red-500' },
                                        { value: 'No Show', label: 'No Show', colorClass: 'bg-gray-100 text-gray-600 border-gray-300', dotColor: 'bg-gray-500' }
                                    ]}
                                />
                            </div>
                        </div>
                        {/* Hora - Visual grid synced with public view */}
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 mb-2">Hora * <span className="text-gray-300 font-normal">(Sincronizado con vista pública)</span></label>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {customHours.map(h => {
                                    const isBlocked = blockedStandardHours.includes(h.val);
                                    const isSel = editingRes.time === h.val;
                                    return (
                                        <button
                                            key={h.val}
                                            type="button"
                                            disabled={isBlocked}
                                            onClick={() => setEditingRes({...editingRes, time: h.val})}
                                            className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2
                                                ${isBlocked 
                                                    ? 'bg-red-50 border-red-200 text-red-300 line-through cursor-not-allowed' 
                                                    : isSel 
                                                        ? 'bg-brand-primary border-brand-primary text-white shadow-md scale-105' 
                                                        : 'border-gray-200 text-gray-600 hover:border-brand-accent hover:bg-brand-cream/30 cursor-pointer'}`}
                                        >
                                            {h.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* ── Servicios (con cantidad) ── */}
                    <div className="border-t border-gray-100 pt-5">
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-wider">Servicios <span className="text-gray-300 font-normal">(Haz clic en + para agregar, múltiples veces para cantidad)</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                            {services.map(srv => {
                                const detail = editingRes.servicesDetails.find(s => s.id === srv.id);
                                const qty = detail?.quantity || 0;
                                const isSelected = qty > 0;
                                return (
                                    <div 
                                        key={srv.id} 
                                        className={`p-3.5 rounded-xl border-2 flex items-center justify-between transition-all
                                            ${isSelected 
                                                ? 'bg-brand-primary/5 border-brand-primary text-brand-primary shadow-sm' 
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                                    >
                                        <div className="flex-1 min-w-0 mr-2">
                                            <span className="font-bold text-sm block truncate">{srv.name}</span>
                                            <span className="text-xs text-gray-400">${srv.price.toFixed(2)} c/u</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <button type="button" onClick={() => removeServiceQty(srv.id)} disabled={!isSelected} className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${isSelected ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
                                                <Minus size={14}/>
                                            </button>
                                            <span className={`w-8 text-center font-black text-sm ${isSelected ? 'text-brand-primary' : 'text-gray-300'}`}>{qty}</span>
                                            <button type="button" onClick={() => addServiceQty(srv)} className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors border border-brand-primary/20">
                                                <Plus size={14}/>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-gray-100 p-6 bg-gray-50 flex items-center justify-between flex-shrink-0">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                        <p className="text-2xl font-black text-brand-primary">${editingRes.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors">
                            Cancelar
                        </button>
                        <button 
                            onClick={saveReservation} 
                            disabled={!editingRes.clientName || !editingRes.modelId}
                            className="px-8 py-3 bg-brand-primary text-white font-black rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2 shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18}/> Guardar Cita
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}
  </>
  );
};

export default BraidsCalendar;
