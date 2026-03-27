import React, { useRef, useState, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Printer, Download, ChevronDown, ChevronUp, Edit3,
  Check, LayoutGrid, Calendar, BookOpen,
} from 'lucide-react';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useBraidServices } from '../../hooks/useBraidServices';
import { useReservations } from '../../hooks/useReservations';

/* ─── Types ──────────────────────────────────────────── */
type Template = 'weekly' | 'catalog' | 'schedule';
type DayKey = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
const ALL_DAYS: DayKey[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

/* ─── US Letter dimensions (in) → px at 96dpi ────────── */
/* We use inline styles with "in" units so the browser     */
/* and html2pdf both interpret them correctly.             */
const LETTER_W = '8.5in';
const LETTER_H = '11in';
const LETTER_W_LAND = '11in';
const LETTER_H_LAND = '8.5in';
const PAGE_PAD = '0.5in';

/* ─── Logo ──────────────────────────────────────────── */
const LOGO_URL = '/logos/boutique-logo.png';

/* ─── Inline-editable field ──────────────────────────── */
function InlineEdit({
  value, onChange, className = '', multiline = false, placeholder = 'Escribe aquí...',
}: {
  value: string; onChange: (v: string) => void;
  className?: string; multiline?: boolean; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => { onChange(draft); setEditing(false); };

  if (editing) {
    return multiline
      ? <textarea autoFocus value={draft} rows={2}
          onChange={e => setDraft(e.target.value)} onBlur={commit}
          className={`border border-blue-400 rounded px-1 resize-none w-full bg-blue-50 print:hidden ${className}`} />
      : <input autoFocus value={draft}
          onChange={e => setDraft(e.target.value)} onBlur={commit}
          className={`border border-blue-400 rounded px-1 bg-blue-50 print:hidden ${className}`} />;
  }

  return (
    <span onClick={() => { setDraft(value); setEditing(true); }}
      title="Click para editar"
      className={`cursor-pointer hover:bg-yellow-50 hover:outline hover:outline-1 hover:outline-dashed hover:outline-yellow-400 rounded px-0.5 inline-flex items-center gap-1 group ${className}`}>
      {value || <span className="text-gray-300 italic text-xs">{placeholder}</span>}
      <Edit3 size={9} className="text-yellow-400 opacity-0 group-hover:opacity-100 print:hidden flex-shrink-0" />
    </span>
  );
}

/* ─── Page shell (US Letter) ─────────────────────────── */
function LetterPage({ landscape = false, children }: { landscape?: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      width: landscape ? LETTER_W_LAND : LETTER_W,
      minHeight: landscape ? LETTER_H_LAND : LETTER_H,
      padding: PAGE_PAD,
      boxSizing: 'border-box',
      backgroundColor: '#fff',
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      pageBreakAfter: 'always',
      position: 'relative',
    }}>
      {children}
    </div>
  );
}

/* ─── Shared header ──────────────────────────────────── */
function DocHeader({ title, month, onMonthChange }: { title: string; month: string; onMonthChange: (v: string) => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '4px solid #1a1f4e', paddingBottom: '8px', marginBottom: '14px',
    }}>
      <div>
        <p style={{ fontSize: '10pt', fontWeight: 900, color: '#1a1f4e', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          {title}
        </p>
        <p style={{ fontSize: '8pt', color: '#555', margin: '3px 0 0' }}>
          MES: <InlineEdit value={month} onChange={onMonthChange} className="font-bold text-[8pt] min-w-[70px]" placeholder="ej. Marzo 2025" />
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={LOGO_URL} alt="Club Med Boutique" style={{ height: '44px', objectFit: 'contain' }}
          onError={e => (e.currentTarget.style.display = 'none')} />
        <span style={{ fontWeight: 900, color: '#1a1f4e', fontSize: '10pt', lineHeight: 1.2 }}>
          Club Med<br /><em style={{ fontStyle: 'normal', fontWeight: 400 }}>Boutique</em>
        </span>
      </div>
    </div>
  );
}

/* ─── Day table ──────────────────────────────────────── */
function DayTable({ day, hours }: { day: string; hours: string[] }) {
  const NAVY = '#1a1f4e';
  const tdBase: React.CSSProperties = { border: '1px solid #ccc', padding: '3px 6px', fontSize: '8pt' };

  return (
    <div style={{ breakInside: 'avoid' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '13pt', fontWeight: 900, color: NAVY, textTransform: 'uppercase', letterSpacing: '1px' }}>{day}</span>
        <div style={{ width: '18px', height: '18px', border: `2px solid ${NAVY}`, borderRadius: '3px', flexShrink: 0 }} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt' }}>
        <thead>
          <tr style={{ backgroundColor: NAVY, color: '#fff' }}>
            <th style={{ ...tdBase, border: `1px solid ${NAVY}`, width: '26%', textAlign: 'left', fontWeight: 700 }}>HORA</th>
            <th style={{ ...tdBase, border: `1px solid ${NAVY}`, textAlign: 'left', fontWeight: 700 }}>NOMBRE</th>
            <th style={{ ...tdBase, border: `1px solid ${NAVY}`, width: '16%', textAlign: 'left', fontWeight: 700 }}>HAB.</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f5f5f8' }}>
              <td style={{ ...tdBase, fontWeight: 700, color: NAVY }}>{h}</td>
              <td style={tdBase}></td>
              <td style={tdBase}></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: NAVY }}>
            <td colSpan={3} style={{ ...tdBase, border: `1px solid ${NAVY}`, color: '#fff', fontWeight: 700, fontSize: '7.5pt' }}>
              VENDEDORAS: <span style={{ display: 'inline-block', borderBottom: '1px solid #fff', width: '120px', marginLeft: '4px' }}></span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 1 – Weekly (US Letter, portrait)
   2-col grid of days
═══════════════════════════════════════════════════════ */
function WeeklyTemplate({ hours, activeDays }: { hours: string[]; activeDays: DayKey[] }) {
  const [month, setMonth] = useState('');
  const [noteEn, setNoteEn] = useState('Note: For customer, please come with hair detangled, washed and dried.');
  const [noteFr, setNoteFr] = useState('Remarque : Pour le client, merci de venir avec les cheveux démêlés, lavés et séchés');

  const pairs: [DayKey, DayKey | null][] = [];
  for (let i = 0; i < activeDays.length; i += 2) pairs.push([activeDays[i], activeDays[i + 1] ?? null]);

  return (
    <LetterPage>
      <DocHeader title="Reservations for Braidings" month={month} onMonthChange={setMonth} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {pairs.map(([a, b], pi) => (
          <React.Fragment key={pi}>
            <DayTable day={a} hours={hours} />
            {b ? <DayTable day={b} hours={hours} /> : <div />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px', borderTop: '1px solid #ccc', paddingTop: '8px' }}>
        <p style={{ fontSize: '8pt', fontWeight: 700, color: '#1a1f4e', margin: 0 }}>
          <InlineEdit value={noteEn} onChange={setNoteEn} multiline className="text-[8pt]" />
        </p>
        <p style={{ fontSize: '8pt', fontWeight: 700, color: '#1a1f4e', margin: 0, textAlign: 'right' }}>
          <InlineEdit value={noteFr} onChange={setNoteFr} multiline className="text-[8pt]" />
        </p>
      </div>
    </LetterPage>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 2 – Braid Catalog + Price List
   Multi-page if many models
═══════════════════════════════════════════════════════ */
function CatalogTemplate() {
  const { styles } = useBraidStyles();
  const { services } = useBraidServices();
  const visible = styles.filter(s => s.isVisible !== false);
  const [title, setTitle] = useState('Catálogo de Trenzas');
  const [subtitle, setSubtitle] = useState('Club Med Boutique — Reservaciones disponibles martes a domingo');
  const [month, setMonth] = useState('');

  const NAVY = '#1a1f4e';

  // Split models into pages of 12 (3×4 grid)
  const perPage = 12;
  const pages: typeof visible[] = [];
  for (let i = 0; i < visible.length; i += perPage) pages.push(visible.slice(i, i + perPage));

  return (
    <>
      {/* Page 1+: Gallery */}
      {pages.map((pageModels, pi) => (
        <React.Fragment key={pi}>
        <LetterPage>
          {pi === 0 && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: `4px solid ${NAVY}`, paddingBottom: '8px', marginBottom: '12px' }}>
              <div>
                <h1 style={{ fontSize: '18pt', fontWeight: 900, color: NAVY, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
                  <InlineEdit value={title} onChange={setTitle} className="text-[18pt]" />
                </h1>
                <p style={{ fontSize: '8pt', color: '#777', margin: '4px 0 0' }}>
                  <InlineEdit value={subtitle} onChange={setSubtitle} className="text-[8pt]" />
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={LOGO_URL} alt="Club Med" style={{ height: '48px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display='none')} />
                <span style={{ fontWeight: 900, color: NAVY, fontSize: '10pt', lineHeight: 1.2 }}>Club Med<br /><em style={{ fontWeight: 400, fontStyle: 'normal' }}>Boutique</em></span>
              </div>
            </div>
          )}
          {pi > 0 && (
            <div style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: '6px', marginBottom: '12px' }}>
              <p style={{ fontSize: '8pt', fontWeight: 700, color: NAVY, margin: 0 }}>Catálogo de Trenzas — página {pi + 1}</p>
            </div>
          )}

          {/* 3×4 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {pageModels.map(s => (
              <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', breakInside: 'avoid' }}>
                <div style={{ aspectRatio: '3/4', backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                  <img src={s.image} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ backgroundColor: NAVY, padding: '4px 6px' }}>
                  <p style={{ fontSize: '7pt', fontWeight: 700, color: '#fff', margin: 0, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Last page: add prices */}
          {pi === pages.length - 1 && (
            <div style={{ marginTop: '16px', borderTop: `2px solid ${NAVY}`, paddingTop: '10px' }}>
              <p style={{ fontSize: '9pt', fontWeight: 900, color: NAVY, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Precios de Servicios</p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '8pt' }}>
                <thead>
                  <tr style={{ backgroundColor: NAVY, color: '#fff' }}>
                    <th style={{ padding: '4px 8px', textAlign: 'left', fontWeight: 700 }}>Servicio</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 700, width: '80px' }}>RD$</th>
                  </tr>
                </thead>
                <tbody>
                  {services.filter(s => s.isVisible !== false).map((srv, i) => (
                    <tr key={srv.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f5f5f8' }}>
                      <td style={{ padding: '3.5px 8px', borderBottom: '1px solid #eee' }}>{srv.name}</td>
                      <td style={{ padding: '3.5px 8px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 700, color: NAVY }}>{srv.price.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ fontSize: '7pt', color: '#aaa', marginTop: '8px', textAlign: 'center' }}>Precios sujetos a cambio • Club Med Boutique</p>
            </div>
          )}
        </LetterPage>
        </React.Fragment>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Template 3 – Full 7-day schedule (US Letter landscape)
═══════════════════════════════════════════════════════ */
function ScheduleTemplate({ hours, activeDays }: { hours: string[]; activeDays: DayKey[] }) {
  const [month, setMonth] = useState('');
  const [staff, setStaff] = useState('');
  const NAVY = '#1a1f4e';
  const tdBase: React.CSSProperties = { border: '1px solid #ccc', padding: '3.5px 4px', fontSize: '7.5pt' };

  return (
    <LetterPage landscape>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `4px solid ${NAVY}`, paddingBottom: '6px', marginBottom: '12px' }}>
        <div>
          <h1 style={{ fontSize: '12pt', fontWeight: 900, color: NAVY, textTransform: 'uppercase', margin: 0 }}>Agenda de Reservaciones</h1>
          <div style={{ display: 'flex', gap: '24px', fontSize: '8pt', color: '#555', marginTop: '3px' }}>
            <span>Mes: <InlineEdit value={month} onChange={setMonth} className="font-bold text-[8pt] min-w-[60px]" /></span>
            <span>Trenzadora: <InlineEdit value={staff} onChange={setStaff} className="font-bold text-[8pt] min-w-[80px]" /></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={LOGO_URL} alt="Club Med" style={{ height: '38px', objectFit: 'contain' }} onError={e => (e.currentTarget.style.display='none')} />
          <span style={{ fontWeight: 900, color: NAVY, fontSize: '9pt', lineHeight: 1.2 }}>Club Med<br /><em style={{ fontWeight: 400, fontStyle: 'normal' }}>Boutique</em></span>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...tdBase, border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: '#fff', width: '8%', textAlign: 'left', fontWeight: 700, fontSize: '7.5pt' }}>HORA</th>
            {(activeDays as string[]).map(d => (
              <th key={d} style={{ ...tdBase, border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: '#fff', textAlign: 'center', fontWeight: 700, fontSize: '7pt' }}>
                {d.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((h, hi) => (
            <tr key={hi} style={{ backgroundColor: hi % 2 === 0 ? '#fff' : '#f0f2f8' }}>
              <td style={{ ...tdBase, fontWeight: 700, color: NAVY, whiteSpace: 'nowrap' }}>{h}</td>
              {(activeDays as string[]).map(d => <td key={d} style={{ ...tdBase, minWidth: '60px' }} />)}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '7.5pt', color: '#888' }}>
        <span>Firma Admin: <span style={{ display: 'inline-block', borderBottom: '1px solid #aaa', width: '130px', marginLeft: '4px' }}></span></span>
        <span>Firma Trenzadora: <span style={{ display: 'inline-block', borderBottom: '1px solid #aaa', width: '130px', marginLeft: '4px' }}></span></span>
        <span style={{ fontStyle: 'italic' }}>Club Med Boutique — Reservaciones para Trenzas</span>
      </div>
    </LetterPage>
  );
}

/* ═══════════════════════════════════════════════════════
   Main PrintMenu
═══════════════════════════════════════════════════════ */
const PrintMenu: React.FC = () => {
  const { customHours } = useReservations();
  const contentRef = useRef<HTMLDivElement>(null);

  const [template, setTemplate] = useState<Template>('weekly');
  const [activeDays, setActiveDays] = useState<DayKey[]>(['Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']);
  const [showSettings, setShowSettings] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const hours = customHours.length > 0
    ? customHours.map(h => h.label)
    : ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  const isLandscape = template === 'schedule';

  /* ─ react-to-print ─ */
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'Club-Med-Boutique-Trenzas',
    pageStyle: `
      @page {
        size: ${isLandscape ? '11in 8.5in' : '8.5in 11in'};
        margin: 0;
      }
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        .no-print { display: none !important; }
      }
    `,
  });

  /* ─ PDF via html2pdf ─ */
  const handleDownloadPdf = useCallback(async () => {
    if (!contentRef.current) return;
    setPdfLoading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: 0,
          filename: `Club-Med-Boutique-${template}.pdf`,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
          },
          jsPDF: {
            unit: 'in',
            format: [8.5, 11],
            orientation: isLandscape ? 'landscape' : 'portrait',
          },
        })
        .from(contentRef.current)
        .save();
    } catch (e) {
      console.error('PDF error:', e);
    } finally {
      setPdfLoading(false);
    }
  }, [template, isLandscape]);

  const toggleDay = (day: DayKey) => {
    setActiveDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b))
    );
  };

  const templates = [
    { id: 'weekly' as Template, label: 'Hoja Semanal', icon: <Calendar size={15} />, desc: 'Días seleccionados para anotar citas a mano' },
    { id: 'catalog' as Template, label: 'Catálogo Galería', icon: <BookOpen size={15} />, desc: 'Fotos + tabla de precios (multi-página)' },
    { id: 'schedule' as Template, label: 'Agenda Completa', icon: <LayoutGrid size={15} />, desc: '7 días × horas (horizontal / landscape)' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
            <Printer size={17} className="text-brand-accent" /> Menú Imprimible
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors no-print"
            >
              {showSettings ? <ChevronUp size={13} /> : <ChevronDown size={13} />} Opciones
            </button>
            <button
              onClick={() => handlePrint()}
              className="bg-[#1a1f4e] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#2d3572] transition-colors flex items-center gap-2 text-sm shadow-sm no-print"
            >
              <Printer size={15} /> Imprimir
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="bg-brand-accent text-brand-primary font-bold px-4 py-2 rounded-xl hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-2 text-sm shadow-sm disabled:opacity-60 no-print"
            >
              <Download size={15} /> {pdfLoading ? 'Generando...' : 'PDF'}
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="space-y-4 border-t border-gray-100 pt-4 no-print">
            {/* Template picker */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Plantilla</p>
              <div className="grid grid-cols-3 gap-2">
                {templates.map(t => (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${template === t.id ? 'border-[#1a1f4e] bg-[#1a1f4e]/5' : 'border-gray-100 hover:border-gray-300'}`}>
                    <span className={`mt-0.5 ${template === t.id ? 'text-[#1a1f4e]' : 'text-gray-400'}`}>{t.icon}</span>
                    <div className="flex-1">
                      <p className={`text-xs font-black ${template === t.id ? 'text-[#1a1f4e]' : 'text-gray-700'}`}>{t.label}</p>
                      <p className="text-[10px] text-gray-400 leading-tight mt-0.5">{t.desc}</p>
                    </div>
                    {template === t.id && <Check size={13} className="text-[#1a1f4e] flex-shrink-0 mt-0.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Day selector */}
            {template !== 'catalog' && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Días a incluir</p>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DAYS.map(day => (
                    <button key={day} onClick={() => toggleDay(day)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors border-2 ${activeDays.includes(day) ? 'bg-[#1a1f4e] text-white border-[#1a1f4e]' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}>
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Hours preview */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                Horas en el documento <span className="font-normal">(desde configuración)</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {hours.map(h => (
                  <span key={h} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md">{h}</span>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 italic">
              Click en cualquier texto del documento para editarlo antes de imprimir o descargar.
              Tamaño: <strong>8.5 × 11 in (Carta)</strong>{template === 'schedule' ? ' — horizontal' : ''}.
            </p>
          </div>
        )}
      </div>

      {/* Document preview */}
      <div className="overflow-auto rounded-2xl border border-gray-200 shadow-lg bg-gray-200 p-8 flex justify-center">
        <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'center' }}>
          {template === 'weekly' && <WeeklyTemplate hours={hours} activeDays={activeDays} />}
          {template === 'catalog' && <CatalogTemplate />}
          {template === 'schedule' && <ScheduleTemplate hours={hours} activeDays={activeDays} />}
        </div>
      </div>
    </div>
  );
};

export default PrintMenu;
