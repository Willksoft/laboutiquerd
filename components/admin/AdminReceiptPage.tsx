import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, FileText, ScrollText, FileType, Edit3 } from 'lucide-react';
import { CartItem, DesignConfig } from '../../types';
import { useVendors } from '../../hooks/useVendors';
import { useBraidStyles } from '../../hooks/useBraidStyles';
import TShirtMockup2D from '../TShirtMockup2D';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from '../Toast';

type PrintFormat = 'ticket' | 'letter';

// Trident SVG icon component
const TridentIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={className} fill="currentColor">
    <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
  </svg>
);

const AdminReceiptPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendors } = useVendors();
  const { styles: braidStyles } = useBraidStyles();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<PrintFormat>('letter');

  const items = location.state?.items as CartItem[] || [];
  const total = location.state?.total as number || 0;
  const backTo = location.state?.backTo as string || '/admin/braids';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!items || items.length === 0) {
    return <Navigate to="/admin/braids" replace />;
  }

  // Merge duplicate items
  const mergedCart = items.reduce((acc: CartItem[], item: CartItem) => {
    const existing = acc.find(i => i.name === item.name && i.price === item.price && i.type === item.type);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
    return acc;
  }, []);

  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('es-DO', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  // Extract client info from items
  const serviceItem = mergedCart.find(i => i.type === 'service' && i.details?.date);
  const productItem = mergedCart.find(i => i.type === 'product' && i.details?.color);
  const infoSource = serviceItem || productItem;
  const details = infoSource?.details;

  const getReadableFontName = (cssFont: string) => {
    if (cssFont.includes('Sheryl')) return 'Sheryl (Cursiva)';
    if (cssFont.includes('Arial')) return 'Arial Bold';
    if (cssFont.includes('Montserrat')) return 'Montserrat';
    if (cssFont.includes('DM Sans')) return 'DM Sans';
    return 'Estándar';
  };

  const getTransformLabel = (transform: string | undefined) => {
    if (transform === 'uppercase') return '(Mayúsculas)';
    if (transform === 'lowercase') return '(Minúsculas)';
    return '';
  };

  const handlePrint = () => { window.print(); };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: format === 'letter' ? 'portrait' : 'portrait', unit: 'mm',
        format: format === 'letter' ? 'letter' : [80, canvas.height * 80 / canvas.width] });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${orderId}.pdf`);
      toast.success('PDF descargado');
    } catch { toast.error('Error al generar PDF'); }
    finally { setIsGenerating(false); }
  };

  const handleDownloadImage = async () => {
    if (!ticketRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(ticketRef.current, { scale: 3, backgroundColor: '#ffffff', useCORS: true });
      const link = document.createElement('a');
      link.download = `${orderId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Imagen descargada');
    } catch { toast.error('Error al generar imagen'); }
    finally { setIsGenerating(false); }
  };

  // ═══ Ticket content (reuses same layout as public TicketPage) ═══
  const ticketContent = (
    <div ref={ticketRef} className={`bg-white text-gray-900 ${format === 'ticket' ? 'w-[320px] text-xs relative overflow-hidden' : 'w-[700px] p-10 text-sm'}`}>
      {format === 'ticket' && (
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary"></div>
      )}

      {/* Header */}
      <div className={`${format === 'ticket' ? 'pt-4 pb-3 px-4' : 'pb-6 border-b-2 border-gray-200 mb-6'} ${format === 'letter' ? 'flex justify-between items-start' : 'text-center'}`}>
        <div className={format === 'letter' ? '' : 'mb-2'}>
          <div className="flex items-center gap-0.5 justify-center lg:justify-start">
            <span className="text-2xl font-bold text-brand-primary tracking-tight" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>Boutique</span>
            <TridentIcon className="w-6 h-6 text-brand-primary" />
          </div>
        </div>
        <div className={format === 'letter' ? 'text-right' : ''}>
          <p className={`${format === 'letter' ? 'text-xs' : 'text-[9px]'} text-brand-primary/70 font-bold uppercase tracking-[0.2em]`}>Comprobante de Orden</p>
          <p className={`${format === 'letter' ? 'text-3xl' : 'text-xl'} font-black text-gray-900 tracking-tight`}>{orderId}</p>
          <p className={`${format === 'letter' ? 'text-sm' : 'text-[10px]'} text-gray-400 mt-1`}>{dateStr}, {timeStr}</p>
        </div>
      </div>

      {format === 'ticket' && <div className="border-t border-dashed border-gray-300 mx-4"></div>}

      <div className={format === 'ticket' ? 'px-4 py-3' : ''}>
        {/* Client Info */}
        {details && (
          <div className={`border-2 border-gray-800 p-3 font-mono text-xs mb-6 ${format === 'letter' ? 'max-w-md' : ''}`}>
            <div className="text-center font-black uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-2 text-sm">
              {details.date ? 'DATOS DE CITA' : 'DATOS DEL CLIENTE'}
            </div>
            <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {details.clientName && (
                  <tr className="border-b border-gray-300">
                    <td className="py-1 font-bold pr-2 w-[40%]">CLIENTE:</td>
                    <td className="py-1 font-bold">{details.clientName}</td>
                  </tr>
                )}
                {details.vendorId && (
                  <tr className="border-b border-gray-300">
                    <td className="py-1 font-bold pr-2">VENDEDOR/A:</td>
                    <td className="py-1">{vendors.find(v => v.id === details.vendorId)?.name || details.vendorId}</td>
                  </tr>
                )}
                {details.room && (
                  <tr className="border-b border-gray-300">
                    <td className="py-1 font-bold pr-2">HABITACIÓN:</td>
                    <td className="py-1">{details.room}</td>
                  </tr>
                )}
                {details.date && (
                  <tr className="border-b border-gray-300">
                    <td className="py-1 font-bold pr-2">FECHA:</td>
                    <td className="py-1">{details.date}</td>
                  </tr>
                )}
                {details.time && (
                  <tr>
                    <td className="py-1 font-bold pr-2">HORA:</td>
                    <td className="py-1">{details.time}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-4">
          <h3 className="font-black uppercase tracking-wider text-sm border-b-2 border-gray-800 pb-1 mb-3">Artículos</h3>
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-1 text-left text-[10px] font-bold uppercase">Cant.</th>
                <th className="py-1 text-left text-[10px] font-bold uppercase">Descripción</th>
                <th className="py-1 text-right text-[10px] font-bold uppercase">Precio</th>
              </tr>
            </thead>
            <tbody>
              {mergedCart.map(item => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-2 font-bold align-top">{item.quantity}</td>
                  <td className="py-2 align-top">
                    <span className="font-bold block">{item.name}</span>
                    {item.details?.size && <span className="text-[10px] text-gray-500">Talla: {item.details.size}</span>}
                    {item.details?.color && <span className="text-[10px] text-gray-500"> · Color: {item.details.color}</span>}
                    {item.details?.logoStyle && <span className="text-[10px] text-gray-500"> · Logo: {item.details.logoStyle === 'dominican' ? 'Dominicano' : 'Clásico'}</span>}
                  </td>
                  <td className="py-2 text-right font-bold align-top whitespace-nowrap">
                    {item.price > 0 ? `RD$${(item.price * item.quantity).toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Image Previews (letter only) */}
        {format === 'letter' && mergedCart.some(i => i.type === 'product' && i.details?.designs) && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {mergedCart.filter(i => i.type === 'product' && i.details?.logoStyle && i.details?.designs).map(item => (
              <div key={`img-${item.id}`} className="flex flex-col items-center">
                <div className="w-[160px] h-[200px] border-2 border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                  <TShirtMockup2D
                    color={item.details!.color === 'Negro' ? '#1a1a1a' : item.details!.color === 'Blanco' ? '#ffffff' : '#374151'}
                    logoStyle={item.details!.logoStyle!}
                    logoColor={item.details!.logoColor || '#DAA520'}
                    designs={item.details!.designs!}
                    view="front"
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[9px] text-gray-400 mt-1 font-bold">{item.name}</p>
              </div>
            ))}
            {mergedCart.filter(i => i.type === 'service').map(item => {
              const braidName = item.name.replace('Reserva: ', '').replace('Trenzas: ', '');
              const braidMatch = braidStyles.find(s => s.name === braidName);
              if (!braidMatch) return null;
              return (
                <div key={`img-${item.id}`} className="flex flex-col items-center">
                  <div className="w-[160px] h-[160px] border-2 border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                    <img src={braidMatch.image} alt={braidMatch.name} className="w-full h-full object-cover"/>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1 font-bold">{item.name}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Zone details */}
        {mergedCart.filter(i => i.type === 'product' && i.details?.designs).map(item => (
          <div key={`zones-${item.id}`} className={`border-2 border-gray-800 p-3 font-mono text-xs mb-4 ${format === 'letter' ? 'break-inside-avoid' : ''}`}>
            <div className="text-center font-black uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-2 text-[10px]">
              ZONAS — {item.name}
            </div>
            {['front', 'back', 'left', 'right'].map(zone => {
              const design = item.details?.designs?.[zone] as DesignConfig | undefined;
              if (!design?.enabled) return null;
              const zoneLabel = zone === 'front' ? 'FRENTE' : zone === 'back' ? 'ESPALDA' : zone === 'left' ? 'MANGA IZQ' : 'MANGA DER';
              return (
                <div key={zone} className="border-b border-gray-300 py-1.5 last:border-0">
                  <span className="font-bold">{zoneLabel}:</span>
                  {design.text && <span className="ml-2">"{design.text}"</span>}
                  <div className="text-gray-500 text-[9px] mt-0.5">
                    {getReadableFontName(design.fontFamily)} · {design.textColorName} {getTransformLabel(design.textTransform)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Total */}
        <div className={`${format === 'ticket' ? 'border-t border-dashed border-gray-400 pt-3 mt-4' : 'border-t-2 border-gray-800 pt-4 mt-6'}`}>
          <div className="flex justify-between items-center">
            <span className="font-black text-sm uppercase tracking-wider">Total</span>
            <span className={`font-black ${format === 'letter' ? 'text-2xl' : 'text-xl'}`}>RD${total.toFixed(2)}</span>
          </div>
        </div>

        {/* QR & footer */}
        <div className="text-center mt-6">
          <div className="bg-white p-2 inline-block border border-gray-200 rounded-xl mb-3 shadow-sm">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000&bgcolor=fff&data=https://wa.me/18095550123?text=Orden%20${orderId}`}
              alt="QR" 
              className={format === 'letter' ? 'w-[100px] h-[100px]' : 'w-[80px] h-[80px]'} 
            />
          </div>
          <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Escanear para verificar</p>
        </div>

        <div className="mt-4 text-gray-400 space-y-1">
          <p className="text-[10px] font-bold">¡Gracias por tu compra!</p>
          <p className="text-[10px]">www.boutiquecreative.com</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* This uses the admin panel's content area, so we structure a sidebar + preview */}
      <div className="flex flex-1 overflow-hidden gap-6">
        
        {/* ═══ LEFT SIDEBAR ═══ */}
        <div className="w-[300px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-5 flex flex-col gap-4">
              {/* Header */}
              <div>
                <h3 className="font-serif font-black tracking-tight text-xl text-brand-primary mb-1">Recibo</h3>
                <p className="text-xs text-gray-500 font-medium">Vista previa del comprobante</p>
              </div>

              {/* Navigation */}
              <button 
                onClick={() => navigate(backTo)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl shadow-sm hover:bg-gray-100 transition-colors font-bold text-sm"
              >
                <ArrowLeft size={15} /> Volver
              </button>

              <div className="border-t border-gray-100"></div>

              {/* Format Selector */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Formato</label>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  <button 
                    onClick={() => setFormat('ticket')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${format === 'ticket' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    <ScrollText size={14} /> Ticket
                  </button>
                  <button 
                    onClick={() => setFormat('letter')}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${format === 'letter' ? 'bg-brand-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    <FileType size={14} /> Carta
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-brand-cream/40 rounded-xl p-4 border border-brand-accent/20">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Resumen</div>
                <div className="space-y-2">
                  {mergedCart.map(item => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <span className="text-gray-700 font-medium">
                        <span className="font-bold text-brand-primary">{item.quantity}×</span> {item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                      </span>
                      <span className="font-bold text-gray-900 ml-2 whitespace-nowrap">
                        {item.price > 0 ? `$${(item.price * item.quantity).toFixed(0)}` : '—'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-brand-accent/30 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-black text-brand-primary text-sm">TOTAL</span>
                  <span className="font-black text-brand-primary text-lg">RD${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-100"></div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Acciones</label>
                <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2.5 bg-brand-primary text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-primary/90 transition-all text-sm shadow-md">
                  <Printer size={18} /> Imprimir
                </button>
                <button onClick={handleDownloadPDF} disabled={isGenerating} className="w-full flex items-center justify-center gap-2.5 bg-white border-2 border-brand-primary text-brand-primary px-5 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm shadow-sm">
                  <FileText size={18} /> {isGenerating ? 'Generando...' : 'Descargar PDF'}
                </button>
                <button onClick={handleDownloadImage} disabled={isGenerating} className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all disabled:opacity-50 text-sm shadow-sm">
                  <Download size={18} /> {isGenerating ? 'Generando...' : 'Guardar Imagen'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: TICKET PREVIEW ═══ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex justify-center py-4">
          <div className="relative">
            <div className="relative shadow-2xl bg-white rounded-lg overflow-hidden">
              {ticketContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReceiptPage;
