import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Printer, Download, ChevronDown, ChevronUp, Edit3, Check, LayoutGrid, Calendar, BookOpen } from 'lucide-react';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import { useBraidServices } from '../../hooks/useBraidServices';
import { useReservations } from '../../hooks/useReservations';

/* ══════════════════════════════════════════════════════
   US Letter at screen resolution (96 dpi)
   Portrait  8.5 × 11 in  →  816 × 1056 px
   Landscape 11  × 8.5 in →  1056 × 816 px
══════════════════════════════════════════════════════ */
const PW  = 816;   // portrait  width
const PH  = 1056;  // portrait  height
const LW  = 1056;  // landscape width
const LH  = 816;   // landscape height
const PAD = 48;    // 0.5 in equivalent

const NAVY = '#1a1f4e';
const LOGO = '/logos/boutique-logo.png';

type Template = 'weekly' | 'catalog' | 'schedule';
type DayKey = 'Lunes' | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes' | 'Sabado' | 'Domingo';
const ALL_DAYS: DayKey[] = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

/* ── Convert a URL to a base64 data-URL so it prints across origins ── */
async function toDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { credentials: 'omit', cache: 'force-cache' });
    if (!res.ok) return url;
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror   = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

/* Hook: pre-fetch a list of URLs and return a {url -> dataUrl} cache */
function useImageCache(urls: string[]): Record<string, string> {
  const [cache, setCache] = useState<Record<string, string>>({});
  const key = urls.join('|');
  useEffect(() => {
    if (!urls.length) return;
    let cancelled = false;
    (async () => {
      const pairs = await Promise.all(urls.map(async u => [u, await toDataUrl(u)] as const));
      if (!cancelled) setCache(Object.fromEntries(pairs));
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return cache;
}

/* ── Inline-editable text ─────────────────────────── */
function InlineEdit({ value, onChange, style, multiline, placeholder = 'Escribe aquí...' }: {
  value: string; onChange: (v: string) => void;
  style?: React.CSSProperties; multiline?: boolean; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const commit = () => { onChange(draft); setEditing(false); };
  const base: React.CSSProperties = {
    border: '2px dashed #3b82f6', borderRadius: 4, padding: '2px 4px',
    background: '#eff6ff', outline: 'none', fontFamily: 'inherit',
    fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', boxSizing: 'border-box', ...style,
  };
  if (editing) return multiline
    ? <textarea autoFocus value={draft} rows={2} onChange={e => setDraft(e.target.value)} onBlur={commit} style={{ ...base, resize: 'none', width: '100%' }} />
    : <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} style={{ ...base, width: 'auto' }} />;

  return (
    <span onClick={() => { setDraft(value); setEditing(true); }} title="Click para editar"
      style={{ cursor: 'pointer', borderBottom: '1.5px dashed #93c5fd', display: 'inline', ...style }}>
      {value || <em style={{ color: '#aaa', fontStyle: 'normal', fontSize: '0.85em' }}>{placeholder}</em>}
    </span>
  );
}

/* ── Page shell ───────────────────────────────────── */
function Page({ landscape = false, children }: { landscape?: boolean; children: React.ReactNode }) {
  return (
    <div className="print-page" style={{
      width: landscape ? LW : PW,
      height: landscape ? LH : PH,
      padding: PAD,
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: '#fff',
      fontFamily: 'Arial, Helvetica, sans-serif',
      color: '#222',
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

/* ── Shared doc header ────────────────────────────── */
function DocHeader({ title, month, setMonth }: { title: string; month: string; setMonth: (v: string) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: `4px solid ${NAVY}`, paddingBottom: 8, marginBottom: 14 }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 900, color: NAVY, textTransform: 'uppercase', letterSpacing: 2 }}>{title}</p>
        <p style={{ margin: '4px 0 0', fontSize: 9, color: '#666' }}>
          MES:&nbsp;<InlineEdit value={month} onChange={setMonth} style={{ fontWeight: 700, minWidth: 80 }} placeholder="ej. Abril 2025" />
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <img src={LOGO} alt="Club Med" style={{ height: 44, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
        <span style={{ fontWeight: 900, color: NAVY, fontSize: 11, lineHeight: 1.3 }}>
          Club Med<br /><span style={{ fontWeight: 400 }}>Boutique</span>
        </span>
      </div>
    </div>
  );
}

/* ── Day table ────────────────────────────────────── */
function DayTable({ day, hours }: { day: string; hours: string[] }) {
  const td: React.CSSProperties = { border: '1px solid #bbb', padding: '3px 6px', fontSize: 8.5 };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: NAVY, textTransform: 'uppercase', letterSpacing: 1 }}>{day}</span>
        <div style={{ width: 16, height: 16, border: `2px solid ${NAVY}`, borderRadius: 3, flexShrink: 0 }} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: NAVY, color: '#fff' }}>
            <th style={{ ...td, border: `1px solid ${NAVY}`, width: '28%', textAlign: 'left', fontWeight: 700 }}>HORA</th>
            <th style={{ ...td, border: `1px solid ${NAVY}`, textAlign: 'left', fontWeight: 700 }}>NOMBRE</th>
            <th style={{ ...td, border: `1px solid ${NAVY}`, width: '17%', textAlign: 'left', fontWeight: 700 }}>HAB.</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h, i) => (
            <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f4f4f8' }}>
              <td style={{ ...td, fontWeight: 700, color: NAVY }}>{h}</td>
              <td style={td} /><td style={td} />
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: NAVY }}>
            <td colSpan={3} style={{ ...td, border: `1px solid ${NAVY}`, color: '#fff', fontWeight: 700, fontSize: 8 }}>
              VENDEDORAS:&nbsp;<span style={{ display: 'inline-block', borderBottom: '1px solid #fff', width: 110, marginLeft: 4 }} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPLATE 1 – Weekly Reservation Sheets
   4 days per portrait page (2 × 2 grid)
══════════════════════════════════════════════════════ */
function WeeklyTemplate({ hours, activeDays }: { hours: string[]; activeDays: DayKey[] }) {
  const [month, setMonth] = useState('');
  const [noteEn, setNoteEn] = useState('Note: For customer, please come with hair detangled, washed and dried.');
  const [noteFr, setNoteFr] = useState('Remarque : merci de venir avec les cheveux démêlés, lavés et séchés.');

  const pages: DayKey[][] = [];
  for (let i = 0; i < activeDays.length; i += 4) pages.push(activeDays.slice(i, i + 4));
  if (pages.length === 0) pages.push([]);

  return (
    <>
      {pages.map((pageDays, pi) => (
        <React.Fragment key={pi}>
          <Page>
            <DocHeader title="Reservations for Braidings" month={month} setMonth={setMonth} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {pageDays.map(day => (
                <React.Fragment key={day}><DayTable day={day} hours={hours} /></React.Fragment>
              ))}
            </div>
            {pi === pages.length - 1 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                marginTop: 14, borderTop: '1px solid #ccc', paddingTop: 10 }}>
                <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: NAVY }}>
                  <InlineEdit value={noteEn} onChange={setNoteEn} multiline style={{ fontSize: 8 }} />
                </p>
                <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: NAVY, textAlign: 'right' }}>
                  <InlineEdit value={noteFr} onChange={setNoteFr} multiline style={{ fontSize: 8 }} />
                </p>
              </div>
            ) : null}
            <p style={{ position: 'absolute', bottom: PAD, right: PAD, margin: 0, fontSize: 7.5, color: '#aaa' }}>
              pág. {pi + 1}/{pages.length} — Club Med Boutique
            </p>
          </Page>
        </React.Fragment>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPLATE 2 – Braid Catalog (gallery + prices)
   12 models per page, 4-column grid
══════════════════════════════════════════════════════ */
/* 3 cols × 3 rows = 9 models per page, images 210 px tall */
const CATALOG_PER_PAGE = 9;
const CATALOG_IMG_H    = 210;

function CatalogTemplate() {
  const { styles } = useBraidStyles();
  const { services } = useBraidServices();
  const visible = styles.filter(s => s.isVisible !== false);
  const [title, setTitle] = useState('Catálogo de Trenzas');
  const [subtitle, setSubtitle] = useState('Club Med Boutique — Reservaciones martes a domingo');


  const modelPages: typeof visible[] = [];
  for (let i = 0; i < Math.max(visible.length, 1); i += CATALOG_PER_PAGE) {
    modelPages.push(visible.slice(i, i + CATALOG_PER_PAGE));
  }

  const td: React.CSSProperties = { border: '1px solid #ddd', padding: '4px 8px', fontSize: 8.5 };

  return (
    <>
      {modelPages.map((pageModels, pi) => (
        <React.Fragment key={pi}>
          <Page>
            {pi === 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                borderBottom: `4px solid ${NAVY}`, paddingBottom: 8, marginBottom: 12 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: NAVY, textTransform: 'uppercase' }}>
                    <InlineEdit value={title} onChange={setTitle} />
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: 9, color: '#888' }}>
                    <InlineEdit value={subtitle} onChange={setSubtitle} />
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={LOGO} alt="Club Med" style={{ height: 48, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
                  <span style={{ fontWeight: 900, color: NAVY, fontSize: 11, lineHeight: 1.3 }}>
                    Club Med<br /><span style={{ fontWeight: 400 }}>Boutique</span>
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ borderBottom: `2px solid ${NAVY}`, paddingBottom: 6, marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: NAVY }}>Catálogo — pág. {pi + 1}</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {pageModels.map(s => (
                <div key={s.id} style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
                  <div style={{ height: CATALOG_IMG_H, backgroundColor: '#f0f0f0', overflow: 'hidden' }}>
                    <img
                      src={s.image}
                      alt={s.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ backgroundColor: NAVY, padding: '5px 8px' }}>
                    <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: '#fff', textAlign: 'center',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</p>
                  </div>
                </div>
              ))}
            </div>


            {pi === modelPages.length - 1 && services.length > 0 && (
              <div style={{ marginTop: 14, borderTop: `2px solid ${NAVY}`, paddingTop: 10 }}>
                <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 900, color: NAVY, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Precios de Servicios
                </p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 8.5 }}>
                  <thead>
                    <tr style={{ backgroundColor: NAVY, color: '#fff' }}>
                      <th style={{ ...td, border: `1px solid ${NAVY}`, textAlign: 'left', fontWeight: 700 }}>Servicio</th>
                      <th style={{ ...td, border: `1px solid ${NAVY}`, textAlign: 'right', fontWeight: 700, width: 80 }}>RD$</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.filter(s => s.isVisible !== false).map((srv, i) => (
                      <tr key={srv.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#f4f4f8' }}>
                        <td style={td}>{srv.name}</td>
                        <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: NAVY }}>{srv.price.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ margin: '8px 0 0', fontSize: 7.5, color: '#aaa', textAlign: 'center' }}>
                  Precios sujetos a cambio • Club Med Boutique
                </p>
              </div>
            )}
          </Page>
        </React.Fragment>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════
   TEMPLATE 3 – Full Schedule (landscape)
══════════════════════════════════════════════════════ */
function ScheduleTemplate({ hours, activeDays }: { hours: string[]; activeDays: DayKey[] }) {
  const [month, setMonth] = useState('');
  const [staff, setStaff] = useState('');
  const td: React.CSSProperties = { border: '1px solid #bbb', padding: '4px 5px', fontSize: 8 };
  const strDays = activeDays as string[];

  return (
    <Page landscape>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `4px solid ${NAVY}`, paddingBottom: 6, marginBottom: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 13, fontWeight: 900, color: NAVY, textTransform: 'uppercase' }}>Agenda de Reservaciones</h1>
          <div style={{ display: 'flex', gap: 24, fontSize: 8.5, color: '#555', marginTop: 3 }}>
            <span>Mes:&nbsp;<InlineEdit value={month} onChange={setMonth} style={{ fontWeight: 700, minWidth: 70 }} /></span>
            <span>Trenzadora:&nbsp;<InlineEdit value={staff} onChange={setStaff} style={{ fontWeight: 700, minWidth: 90 }} /></span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={LOGO} alt="Club Med" style={{ height: 36, objectFit: 'contain' }} onError={e => (e.currentTarget.style.display = 'none')} />
          <span style={{ fontWeight: 900, color: NAVY, fontSize: 10, lineHeight: 1.3 }}>
            Club Med<br /><span style={{ fontWeight: 400 }}>Boutique</span>
          </span>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '9%' }} />
          {strDays.map((_, i) => <col key={i} />)}
        </colgroup>
        <thead>
          <tr>
            <th style={{ ...td, border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: '#fff', textAlign: 'left', fontWeight: 700 }}>HORA</th>
            {strDays.map(d => (
              <th key={d} style={{ ...td, border: `1px solid ${NAVY}`, backgroundColor: NAVY, color: '#fff', textAlign: 'center', fontWeight: 700 }}>
                {d.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((h, hi) => (
            <tr key={hi} style={{ backgroundColor: hi % 2 === 0 ? '#fff' : '#eef0f8' }}>
              <td style={{ ...td, fontWeight: 700, color: NAVY, whiteSpace: 'nowrap' }}>{h}</td>
              {strDays.map(d => <td key={d} style={{ ...td, height: 26 }} />)}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 8, color: '#888' }}>
        <span>Firma Admin:&nbsp;<span style={{ display: 'inline-block', borderBottom: '1px solid #aaa', width: 120, marginLeft: 4 }} /></span>
        <span>Firma Trenzadora:&nbsp;<span style={{ display: 'inline-block', borderBottom: '1px solid #aaa', width: 120, marginLeft: 4 }} /></span>
        <em>Club Med Boutique — Reservaciones para Trenzas</em>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN – PrintMenu
══════════════════════════════════════════════════════ */
const PrintMenu: React.FC = () => {
  const { customHours } = useReservations();
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [template,   setTemplate]   = useState<Template>('weekly');
  const [activeDays, setActiveDays] = useState<DayKey[]>(['Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']);
  const [showOpts,   setShowOpts]   = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [scale,      setScale]      = useState(0.75);

  const hours = customHours.length > 0
    ? customHours.map(h => h.label)
    : ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];

  const isLandscape = template === 'schedule';
  const docW = isLandscape ? LW : PW;
  const docH = isLandscape ? LH : PH;

  /* Auto-scale preview to fit available wrapper width */
  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current) return;
      const avail = wrapperRef.current.clientWidth - 48;
      setScale(Math.min(0.95, avail / docW));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [docW]);

  /* ── react-to-print ── */
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'Club-Med-Boutique-Trenzas',
    pageStyle: `
      @page { size: ${isLandscape ? 'letter landscape' : 'letter portrait'}; margin: 0; }
      @media print {
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { margin: 0; padding: 0; background: white; }
        .print-page {
          page-break-after: always;
          break-after: page;
          box-shadow: none !important;
          width: ${docW}px !important;
          height: ${docH}px !important;
        }
        .print-page:last-child { page-break-after: avoid; break-after: auto; }
        [title="Click para editar"] { border-bottom: none !important; cursor: default !important; }
      }
    `,
    /* Wait for all img tags to be replaced with preloaded base64 srcs */
    onBeforePrint: async () => {
      if (!contentRef.current) return;
      const imgs = Array.from(contentRef.current.querySelectorAll('img')) as HTMLImageElement[];
      await Promise.all(imgs.map(async img => {
        const src = img.getAttribute('src') || '';
        if (!src || src.startsWith('data:')) return;
        const dataUrl = await toDataUrl(src);
        img.src = dataUrl;
      }));
    },
  });


  /* ── PDF via jsPDF + html2canvas ── */
  const handleDownloadPdf = useCallback(async () => {
    if (!contentRef.current) return;
    setPdfLoading(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const pageEls = Array.from(contentRef.current.querySelectorAll('.print-page')) as HTMLElement[];
      if (pageEls.length === 0) { setPdfLoading(false); return; }

      const orientation = isLandscape ? 'landscape' : 'portrait';
      const pdf = new jsPDF({ orientation, unit: 'px', format: [docW, docH] });

      for (let i = 0; i < pageEls.length; i++) {
        const el = pageEls[i];
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });

        const img = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) pdf.addPage([docW, docH], orientation);
        pdf.addImage(img, 'JPEG', 0, 0, docW, docH);
      }

      pdf.save(`Club-Med-Boutique-${template}.pdf`);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setPdfLoading(false);
    }
  }, [template, isLandscape, docW, docH]);

  const toggleDay = (day: DayKey) =>
    setActiveDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort((a, b) => ALL_DAYS.indexOf(a) - ALL_DAYS.indexOf(b))
    );

  const templates = [
    { id: 'weekly'  as Template, label: 'Hoja Semanal',     icon: <Calendar size={15} />,   desc: '4 días por página, para anotar citas a mano' },
    { id: 'catalog' as Template, label: 'Catálogo Galería',  icon: <BookOpen size={15} />,   desc: 'Fotos de modelos + precios (multi-página)' },
    { id: 'schedule' as Template, label: 'Agenda Completa', icon: <LayoutGrid size={15} />,  desc: 'Todos los días × horas — horizontal' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Controls bar ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-black text-gray-800 text-base flex items-center gap-2">
            <Printer size={17} className="text-brand-accent" /> Menú Imprimible
          </h3>
          <div className="flex gap-2">
            <button onClick={() => setShowOpts(s => !s)}
              className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              {showOpts ? <ChevronUp size={13} /> : <ChevronDown size={13} />} Opciones
            </button>
            <button onClick={() => handlePrint()}
              className="bg-[#1a1f4e] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#2d3572] transition-colors flex items-center gap-2 text-sm shadow-sm">
              <Printer size={15} /> Imprimir
            </button>
            <button onClick={handleDownloadPdf} disabled={pdfLoading}
              className="bg-brand-accent text-brand-primary font-bold px-4 py-2 rounded-xl hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-2 text-sm shadow-sm disabled:opacity-60">
              <Download size={15} /> {pdfLoading ? 'Generando...' : 'PDF'}
            </button>
          </div>
        </div>

        {showOpts && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
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

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Horas configuradas</p>
              <div className="flex flex-wrap gap-1.5">
                {hours.map(h => <span key={h} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-bold rounded-md">{h}</span>)}
              </div>
            </div>

            <p className="text-[10px] text-gray-400 italic leading-relaxed">
              Click en texto <span className="underline decoration-dashed decoration-blue-300">subrayado punteado</span> para editarlo antes de imprimir.
              Tamaño: <strong>8.5 × 11 in (Carta{isLandscape ? ' horizontal' : ''})</strong>.
              El contenido se divide automáticamente en páginas adicionales.
            </p>
          </div>
        )}
      </div>

      {/* ── Document preview ── */}
      <div ref={wrapperRef}
        className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-gray-300 py-8 px-4"
        style={{ minHeight: 480 }}>
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: docW,
          /* Compensate container height so it doesn't leave huge blank gap */
          marginBottom: `calc(${docH * (scale - 1)}px)`,
        }}>
          {/* contentRef — this is what both react-to-print and html2canvas capture */}
          <div ref={contentRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {template === 'weekly'   && <WeeklyTemplate   hours={hours} activeDays={activeDays} />}
            {template === 'catalog'  && <CatalogTemplate />}
            {template === 'schedule' && <ScheduleTemplate hours={hours} activeDays={activeDays} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintMenu;
