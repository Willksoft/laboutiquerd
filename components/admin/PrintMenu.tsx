import React, { useState, useRef } from 'react';
import { Printer, ChevronDown, ChevronUp, Edit3, Check, X, LayoutGrid, Calendar, BookOpen } from 'lucide-react';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useBraidServices } from '../../hooks/useBraidServices';
import { useReservations } from '../../hooks/useReservations';

/* ─── Types ──────────────────────────────────────────── */
type Template = 'weekly' | 'catalog' | 'schedule';
type DayKey = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';

const DAYS: DayKey[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const LOGO_URL = '/logos/boutique-logo.png'; // adjust if path differs

/* ─── Helper ─────────────────────────────────────────── */
function InlineEdit({ value, onChange, className = '', multiline = false }: {
  value: string; onChange: (v: string) => void; className?: string; multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return multiline ? (
      <textarea
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        className={`border border-brand-accent rounded px-1 resize-none w-full print:hidden ${className}`}
        rows={2}
      />
    ) : (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        className={`border border-brand-accent rounded px-1 w-full print:hidden ${className}`}
      />
    );
  }

  return (
    <span
      className={`cursor-pointer hover:bg-yellow-50 rounded px-0.5 group inline-flex items-center gap-1 ${className}`}
      title="Click para editar"
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {value || <span className="text-gray-300 italic text-xs">Escribe aquí...</span>}
      <Edit3 size={10} className="text-gray-300 group-hover:text-brand-accent opacity-0 group-hover:opacity-100 print:hidden flex-shrink-0" />
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 1 – Weekly Reservation Sheet
═══════════════════════════════════════════════════════ */
function WeeklyTemplate({ hours, activeDays }: { hours: string[]; activeDays: DayKey[] }) {
  const [month, setMonth] = useState('');
  const [notes, setNotes] = useState('Note: For customer, please come with hair detangled, washed and dried.');
  const [noteFr, setNoteFr] = useState('Remarque : Pour le client, merci de venir avec les cheveux démêlés, lavés et séchés');

  // 2-column day grid
  const pairs: [DayKey, DayKey | null][] = [];
  for (let i = 0; i < activeDays.length; i += 2) {
    pairs.push([activeDays[i], activeDays[i + 1] ?? null]);
  }

  return (
    <div className="print-page font-sans bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '14mm', boxSizing: 'border-box', fontSize: '10pt' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-4 border-[#1a1f4e]">
        <div>
          <p className="text-[9pt] font-bold text-[#1a1f4e] uppercase tracking-widest mb-1">Reservations for Braidings</p>
          <p className="text-[8pt] text-gray-500">MES: <InlineEdit value={month} onChange={setMonth} className="text-[8pt] font-bold inline-block min-w-[80px]"/></p>
        </div>
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Club Med Boutique" className="h-12 object-contain" onError={e => (e.currentTarget.style.display='none')}/>
          <span className="font-black text-[#1a1f4e] text-sm leading-tight">Club Med<br/><em className="font-normal not-italic">Boutique</em></span>
        </div>
      </div>

      {/* Day grids */}
      {pairs.map(([dayA, dayB], pi) => (
        <div key={pi} className="grid grid-cols-2 gap-4 mb-5">
          {[dayA, dayB].map((day, di) => day ? (
            <div key={di}>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-[14pt] font-black text-[#1a1f4e] uppercase tracking-wide">{day}</h3>
                <div className="w-5 h-5 border-2 border-[#1a1f4e] rounded-sm flex-shrink-0" />
              </div>
              <table className="w-full border-collapse text-[8pt]">
                <thead>
                  <tr className="bg-[#1a1f4e] text-white">
                    <th className="border border-[#1a1f4e] px-2 py-1 text-left font-bold w-[22%]">HORA</th>
                    <th className="border border-[#1a1f4e] px-2 py-1 text-left font-bold">NOMBRE</th>
                    <th className="border border-[#1a1f4e] px-2 py-1 text-left font-bold w-[14%]">HAB.</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.map((h, hi) => (
                    <tr key={hi} className={hi % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-2 py-2 font-bold text-[#1a1f4e]">{h}</td>
                      <td className="border border-gray-300 px-2 py-2"></td>
                      <td className="border border-gray-300 px-2 py-2"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#1a1f4e]">
                    <td colSpan={3} className="px-2 py-1 text-white font-bold text-[7pt]">
                      VENDEDORAS: <span className="inline-block border-b border-white w-32 ml-1"></span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : <div key={di} />)}
        </div>
      ))}

      {/* Footer notes */}
      <div className="grid grid-cols-2 gap-6 mt-4 pt-3 border-t border-gray-300">
        <p className="text-[8pt] font-bold text-[#1a1f4e]"><InlineEdit value={notes} onChange={setNotes} multiline /></p>
        <p className="text-[8pt] font-bold text-[#1a1f4e] text-right"><InlineEdit value={noteFr} onChange={setNoteFr} multiline /></p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 2 – Braid Catalog (with gallery)
═══════════════════════════════════════════════════════ */
function CatalogTemplate() {
  const { styles } = useBraidStyles();
  const { services } = useBraidServices();
  const visible = styles.filter(s => s.isVisible !== false);
  const [title, setTitle] = useState('Catálogo de Trenzas');
  const [subtitle, setSubtitle] = useState('Club Med Boutique — Reservaciones disponibles martes a domingo');

  return (
    <div className="print-page font-sans bg-white" style={{ width: '210mm', minHeight: '297mm', padding: '12mm', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="flex items-start justify-between pb-3 mb-5 border-b-4 border-[#1a1f4e]">
        <div>
          <h1 className="text-[20pt] font-black text-[#1a1f4e] uppercase leading-tight">
            <InlineEdit value={title} onChange={setTitle} className="text-[20pt]" />
          </h1>
          <p className="text-[9pt] text-gray-500 mt-1">
            <InlineEdit value={subtitle} onChange={setSubtitle} className="text-[9pt]" />
          </p>
        </div>
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Club Med" className="h-14 object-contain" onError={e => (e.currentTarget.style.display='none')}/>
          <span className="font-black text-[#1a1f4e] text-[10pt] leading-tight">Club Med<br/><em className="font-normal not-italic">Boutique</em></span>
        </div>
      </div>

      {/* Gallery grid – 4 per row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {visible.map((s) => (
          <div key={s.id} className="flex flex-col border border-gray-200 rounded overflow-hidden">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
              <img src={s.image} alt={s.name} className="w-full h-full object-cover" loading="lazy"/>
            </div>
            <div className="p-1.5 bg-[#1a1f4e]">
              <p className="text-[7.5pt] font-bold text-white text-center leading-tight truncate">{s.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Services table */}
      <div className="border-t-2 border-[#1a1f4e] pt-3">
        <h2 className="text-[11pt] font-black text-[#1a1f4e] uppercase mb-2">Precios de Servicios</h2>
        <table className="w-full text-[8pt] border-collapse">
          <thead>
            <tr className="bg-[#1a1f4e] text-white">
              <th className="px-3 py-1.5 text-left font-bold">Servicio</th>
              <th className="px-3 py-1.5 text-right font-bold w-20">Precio RD$</th>
            </tr>
          </thead>
          <tbody>
            {services.filter(s => s.isVisible !== false).map((srv, i) => (
              <tr key={srv.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-1.5 border-b border-gray-200 font-medium">{srv.name}</td>
                <td className="px-3 py-1.5 border-b border-gray-200 text-right font-black text-[#1a1f4e]">{srv.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[7pt] text-gray-400 mt-4 text-center">Precios sujetos a cambio sin previo aviso • Club Med Boutique</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 3 – Full Schedule (all 7 days, compact)
═══════════════════════════════════════════════════════ */
function ScheduleTemplate({ hours }: { hours: string[] }) {
  const [month, setMonth] = useState('');
  const [staff, setStaff] = useState('');

  return (
    <div className="print-page font-sans bg-white" style={{ width: '297mm', minHeight: '210mm', padding: '12mm', boxSizing: 'border-box', fontSize: '9pt' }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b-4 border-[#1a1f4e]">
        <div>
          <h1 className="text-[13pt] font-black text-[#1a1f4e] uppercase">Agenda de Reservaciones</h1>
          <div className="flex gap-6 text-[8pt] text-gray-600 mt-0.5">
            <span>Mes: <InlineEdit value={month} onChange={setMonth} className="font-bold min-w-[60px] text-[8pt]"/></span>
            <span>Trenzadora: <InlineEdit value={staff} onChange={setStaff} className="font-bold min-w-[80px] text-[8pt]"/></span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} alt="Club Med" className="h-10 object-contain" onError={e => (e.currentTarget.style.display='none')}/>
          <span className="font-black text-[#1a1f4e] text-[9pt] leading-tight">Club Med<br/><em className="font-normal not-italic">Boutique</em></span>
        </div>
      </div>

      {/* 7-column schedule grid */}
      <table className="w-full border-collapse text-[8pt]">
        <thead>
          <tr>
            <th className="bg-[#1a1f4e] text-white px-2 py-1.5 border border-[#1a1f4e] font-bold text-left w-[9%]">HORA</th>
            {DAYS.map(d => (
              <th key={d} className="bg-[#1a1f4e] text-white px-1 py-1.5 border border-[#1a1f4e] font-bold text-center">
                {d.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((h, hi) => (
            <tr key={hi} className={hi % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}>
              <td className="border border-gray-300 px-2 py-2.5 font-black text-[#1a1f4e] whitespace-nowrap">{h}</td>
              {DAYS.map(d => (
                <td key={d} className="border border-gray-300 px-1 py-2.5 min-w-[40px]"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-3 text-[7.5pt] text-gray-500">
        <span>Firma Admin: <span className="inline-block border-b border-gray-400 w-36 ml-1"></span></span>
        <span>Firma Trenzadora: <span className="inline-block border-b border-gray-400 w-36 ml-1"></span></span>
        <p>Club Med Boutique — Reservaciones para Trenzas</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main PrintMenu Component
═══════════════════════════════════════════════════════ */
const PrintMenu: React.FC = () => {
  const { customHours } = useReservations();
  const printRef = useRef<HTMLDivElement>(null);

  const [template, setTemplate] = useState<Template>('weekly');
  const [activeDays, setActiveDays] = useState<DayKey[]>(['Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']);
  const [showSettings, setShowSettings] = useState(true);

  const hours = customHours.length > 0
    ? customHours.map(h => h.label)
    : ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','5:00 PM','6:00 PM'];

  const toggleDay = (day: DayKey) => {
    setActiveDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a,b) => DAYS.indexOf(a)-DAYS.indexOf(b)));
  };

  const handlePrint = () => {
    const isLandscape = template === 'schedule';
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #print-portal { display: block !important; position: fixed; top:0;left:0;width:100%;height:100%; }
        @page { size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'}; margin: 0; }
        .print\\:hidden { display: none !important; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      }
    `;
    document.head.appendChild(style);

    const portal = document.createElement('div');
    portal.id = 'print-portal';
    portal.style.display = 'none';
    portal.innerHTML = printRef.current?.innerHTML || '';
    document.body.appendChild(portal);

    window.print();

    setTimeout(() => {
      document.head.removeChild(style);
      document.body.removeChild(portal);
    }, 1000);
  };

  const templates = [
    { id: 'weekly' as Template, label: 'Hoja Semanal', icon: <Calendar size={16}/>, desc: 'Días seleccionados, horas para anotar a mano' },
    { id: 'catalog' as Template, label: 'Catálogo Galería', icon: <BookOpen size={16}/>, desc: 'Fotos de modelos + tabla de precios' },
    { id: 'schedule' as Template, label: 'Agenda Completa', icon: <LayoutGrid size={16}/>, desc: '7 días × todas las horas (horizontal)' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
            <Printer size={18} className="text-brand-accent"/> Menu Imprimible
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              {showSettings ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} Opciones
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#1a1f4e] text-white font-bold px-5 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2 text-sm shadow-sm"
            >
              <Printer size={16}/> Imprimir
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* Template picker */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Plantilla</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {templates.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTemplate(t.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      template === t.id
                        ? 'border-[#1a1f4e] bg-[#1a1f4e]/5'
                        : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <span className={template === t.id ? 'text-[#1a1f4e]' : 'text-gray-400'}>{t.icon}</span>
                    <div>
                      <p className={`text-xs font-black ${template === t.id ? 'text-[#1a1f4e]' : 'text-gray-700'}`}>{t.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{t.desc}</p>
                    </div>
                    {template === t.id && <Check size={14} className="ml-auto text-[#1a1f4e] flex-shrink-0 mt-0.5"/>}
                  </button>
                ))}
              </div>
            </div>

            {/* Day picker (only for weekly/schedule) */}
            {template !== 'catalog' && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Días a incluir</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border-2 ${
                        activeDays.includes(day)
                          ? 'bg-[#1a1f4e] text-white border-[#1a1f4e]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hours preview */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Horas en el documento <span className="font-normal text-gray-400">(se toman de la configuración)</span></p>
              <div className="flex flex-wrap gap-1.5">
                {hours.map(h => (
                  <span key={h} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-lg">{h}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview hint */}
      <p className="text-xs text-gray-400 text-center">
        Puedes hacer click en cualquier texto del documento para editarlo antes de imprimir.
      </p>

      {/* Document preview */}
      <div ref={printRef} className="overflow-auto rounded-2xl border border-gray-200 shadow-lg bg-gray-100 p-6 flex justify-center">
        <div className="shadow-2xl">
          {template === 'weekly' && <WeeklyTemplate hours={hours} activeDays={activeDays} />}
          {template === 'catalog' && <CatalogTemplate />}
          {template === 'schedule' && <ScheduleTemplate hours={hours} />}
        </div>
      </div>
    </div>
  );
};

export default PrintMenu;
