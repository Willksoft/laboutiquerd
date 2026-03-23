import React, { useRef, useState } from 'react';
import { X, Printer, Download, FileText, QrCode, FileType, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem, DesignConfig } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from './Toast';
import { useVendors } from '../hooks/useVendors';
import TShirtMockup2D from './TShirtMockup2D';
import { useBraidStyles } from '../hooks/useBraidStyles';
import { useSiteContent } from '../hooks/useSiteContent';

interface TicketReceiptProps {
  cart: CartItem[];
  total: number;
  onClose?: () => void;
  inline?: boolean;
}

type PrintFormat = 'ticket' | 'letter';

// Trident SVG icon component
const TridentIcon: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className={className} fill="currentColor">
    <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
  </svg>
);

const TicketReceipt: React.FC<TicketReceiptProps> = ({ cart, total, onClose, inline = false }) => {
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<PrintFormat>('ticket');
  const { vendors } = useVendors();
  const { styles: braidStyles } = useBraidStyles();
  const { content } = useSiteContent();

  const handleClose = () => {
      if (onClose) {
          onClose();
      } else {
          navigate(-1);
      }
  };

  // Helper to translate font CSS to readable name
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

  const getLogoColorName = (hex: string) => {
    const map: Record<string, string> = {
      '#DAA520': 'Dorado',
      '#FFFFFF': 'Blanco',
      '#1a1a2e': 'Negro',
      '#DC2626': 'Rojo',
      '#2563EB': 'Azul',
      '#16A34A': 'Verde',
      '#C0C0C0': 'Plata',
      '#EC4899': 'Rosa',
      '#EA580C': 'Naranja',
    };
    return map[hex] || hex;
  };

  const handlePrint = () => {
    try {
        window.print();
    } catch (e) {
        toast.error("Tu navegador bloqueó la impresión. Por favor usa 'Descargar PDF'.");
    }
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsGenerating(true);
    try {
      const clone = ticketRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = ticketRef.current.scrollWidth + 'px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3, 
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });
      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png');
      const isTicket = format === 'ticket';
      
      if (isTicket) {
         const ticketWidthMM = 80;
         const margin = 3;
         const printableWidth = ticketWidthMM - (margin * 2);
         const aspectRatio = canvas.height / canvas.width;
         const printableHeight = printableWidth * aspectRatio;
         const totalHeight = printableHeight + (margin * 2);

         const pdf = new jsPDF({
             orientation: 'portrait',
             unit: 'mm',
             format: [ticketWidthMM, totalHeight]
         });
         pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, printableHeight);
         pdf.save(`Ticket-${Date.now()}.pdf`);
      } else {
         const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
         const pageWidth = pdf.internal.pageSize.getWidth();
         const pageHeight = pdf.internal.pageSize.getHeight();
         const margin = 10;
         const printableWidth = pageWidth - (margin * 2);
         const aspectRatio = canvas.height / canvas.width;
         const imgHeight = printableWidth * aspectRatio;

         if (imgHeight <= pageHeight - (margin * 2)) {
             pdf.addImage(imgData, 'PNG', margin, margin, printableWidth, imgHeight);
         } else {
             const pageContentHeight = pageHeight - (margin * 2);
             const totalPages = Math.ceil(imgHeight / pageContentHeight);
             for (let page = 0; page < totalPages; page++) {
                 if (page > 0) pdf.addPage();
                 const sourceY = (page * pageContentHeight / imgHeight) * canvas.height;
                 const sourceH = Math.min((pageContentHeight / imgHeight) * canvas.height, canvas.height - sourceY);
                 const pageCanvas = document.createElement('canvas');
                 pageCanvas.width = canvas.width;
                 pageCanvas.height = sourceH;
                 const ctx = pageCanvas.getContext('2d');
                 if (ctx) {
                     ctx.fillStyle = '#ffffff';
                     ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
                     ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceH, 0, 0, canvas.width, sourceH);
                 }
                 const pageImgData = pageCanvas.toDataURL('image/png');
                 const sliceHeight = (sourceH / canvas.height) * imgHeight;
                 pdf.addImage(pageImgData, 'PNG', margin, margin, printableWidth, sliceHeight);
             }
         }
         pdf.save(`Orden-Carta-${Date.now()}.pdf`);
      }
      
      toast.success('PDF descargado correctamente.');
    } catch (err) {
      console.error("Error generating PDF", err);
      toast.error("Hubo un error generando el PDF. Intenta con Guardar Imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!ticketRef.current) return;
    setIsGenerating(true);
    try {
      const clone = ticketRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = ticketRef.current.scrollWidth + 'px';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        width: clone.scrollWidth,
        height: clone.scrollHeight,
      });
      document.body.removeChild(clone);
      
      const image = canvas.toDataURL('image/jpeg', 0.95);
      const link = document.createElement('a');
      link.href = image;
      const safeStoreName = (content.store_name || 'Boutique').replace(/\s+/g, '');
      link.download = `Recibo-${safeStoreName}-${Date.now()}.jpg`;
      link.click();
      toast.success('Imagen descargada correctamente.');
    } catch (err) {
      console.error("Error generating ticket image", err);
      toast.error("Hubo un error generando la imagen.");
    } finally {
      setIsGenerating(false);
    }
  };

  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString('es-DO', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  // Merge duplicate items by name (e.g. multiple "Estilo Base: 01" entries)
  const mergedCart = cart.reduce<CartItem[]>((acc, item) => {
      const existing = acc.find(a => a.name === item.name && a.price === item.price);
      if (existing) {
          existing.quantity += item.quantity;
      } else {
          acc.push({ ...item });
      }
      return acc;
  }, []);

  // Estilos dinámicos según formato
  const containerClass = format === 'ticket' 
      ? "max-w-[350px] mx-auto p-6" 
      : "w-[816px] mx-auto p-12 min-h-[1056px]";

  const gridClass = format === 'ticket'
      ? "flex flex-col gap-6"
      : "grid grid-cols-2 gap-8";

  const ticketContent = (
          <div 
            id="ticket-print-area" 
            ref={ticketRef}
            className={`bg-white shadow-lg transition-all duration-300 border-t-8 border-brand-accent relative origin-top ${containerClass} ${inline ? 'w-full !max-w-none rounded-2xl' : ''}`}
            style={{ fontFamily: "'Inter', monospace" }} 
          >
            {/* Ticket Header */}
            <div className={`text-center mb-6 md:mb-8 border-b-2 border-dashed border-gray-200 pb-4 md:pb-6 ${format === 'letter' ? 'flex justify-between items-center text-left border-b-4 border-double' : ''}`}>
               <div className={format === 'letter' ? 'flex items-center gap-0.5' : 'flex justify-center mb-3 text-brand-primary items-center gap-0'}>
                    <span className={`font-bold tracking-tight ${format === 'ticket' ? 'text-2xl' : 'text-4xl'}`} style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>{content.store_name || 'Boutique'}</span>
                    <TridentIcon className={format === 'ticket' ? 'w-8 h-8' : 'w-10 h-10'} />
               </div>

               <div className={format === 'letter' ? 'text-right' : ''}>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Comprobante de Orden</p>
                    <h2 className={`${format === 'letter' ? 'text-4xl' : 'text-3xl'} font-black text-gray-800 my-1 tracking-tight`}>{orderId}</h2>
                    <p className="text-sm text-gray-500 font-medium">{date}</p>
               </div>
            </div>

            {/* Client/Appointment Info - ONCE */}
            {(() => {
                const serviceItem = mergedCart.find(i => i.type === 'service' && i.details?.date);
                const productItem = mergedCart.find(i => i.type === 'product' && i.details?.color);
                const infoSource = serviceItem || productItem;
                const details = infoSource?.details;
                
                if (!details) return null;

                return (
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
                                        <td className="py-1 font-black">{details.time}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            })()}

            {/* Compact Items List */}
            <div className="mb-6">
                <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 border-b border-gray-200 pb-1">
                    ARTÍCULOS
                </div>
                <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                        <tr className="border-b-2 border-gray-800 text-xs font-black uppercase text-gray-600">
                            <td className="py-1.5 pr-2">Cant.</td>
                            <td className="py-1.5">Descripción</td>
                            <td className="py-1.5 text-right pl-2">Precio</td>
                        </tr>
                    </thead>
                    <tbody>
                        {mergedCart.map((item, index) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-2 pr-2 text-sm font-bold align-top">{item.quantity}</td>
                                <td className="py-2 text-sm align-top">
                                    <span className="font-bold text-gray-900">{item.name}</span>
                                    {item.type === 'product' && item.details?.color && (
                                        <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                                            {item.details.size && <span>Talla: {item.details.size} · </span>}
                                            <span>Color: {item.details.color}</span>
                                            {item.details.logoStyle && <span> · Logo: {item.details.logoStyle === 'dominican' ? 'Dominicano' : 'Clásico'}</span>}
                                            {item.details.logoColor && <span> ({getLogoColorName(item.details.logoColor)})</span>}
                                            {item.details.customName && <div>Ref: {item.details.customName}</div>}
                                        </div>
                                    )}
                                </td>
                                <td className="py-2 text-right pl-2 text-sm font-bold align-top whitespace-nowrap">
                                    {item.price > 0 ? `RD$${(item.price * item.quantity).toFixed(2)}` : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Image Previews (letter format only) */}
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

            {/* Product Zone Details (only if there are custom products) */}
            {mergedCart.filter(i => i.type === 'product' && i.details?.designs).map(item => (
                <div key={`zones-${item.id}`} className={`border-2 border-gray-800 p-3 font-mono text-xs mb-4 ${format === 'letter' ? 'break-inside-avoid' : ''}`}>
                    <div className="text-center font-black uppercase tracking-widest border-b-2 border-gray-800 pb-1 mb-2 text-[10px]">
                        ZONAS — {item.name}
                    </div>
                    {['front', 'back', 'left', 'right'].map(zone => {
                        const design = item.details?.designs?.[zone] as DesignConfig | undefined;
                        if (!design?.enabled) return null;
                        const label = zone === 'front' ? 'FRENTE' : zone === 'back' ? 'ESPALDA' : zone === 'left' ? 'M.IZQ' : 'M.DER';
                        return (
                            <div key={zone} className="border-b border-dashed border-gray-300 py-1">
                                <div className="flex justify-between">
                                    <span className="font-bold">{label}:</span>
                                    <span className="font-bold">● ACTIVA</span>
                                </div>
                                {design.text && (
                                    <div className="pl-2 mt-0.5 text-[10px] text-gray-600">
                                        "{design.text}" · {getReadableFontName(design.fontFamily)} · {design.textColorName || design.textColor}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {item.details?.deliveryDate && (
                        <div className="mt-2 border-t-2 border-gray-800 pt-1 text-center font-black">
                            ENTREGA: {item.details.deliveryDate}
                        </div>
                    )}
                </div>
            ))}

            {/* Note for braids */}
            {mergedCart.some(i => i.type === 'service' && i.details?.date) && (
                <div className="text-center text-[9px] text-gray-500 font-bold uppercase mb-4 bg-gray-50 py-2 rounded border border-gray-200">
                    Por favor, ven con el cabello desenredado, lavado y seco.
                </div>
            )}

            {/* Totals */}
            <div className={`border-t-2 border-dashed border-gray-200 pt-6 mb-8 ${format === 'letter' ? 'flex justify-end' : ''}`}>
              <div className={format === 'letter' ? 'w-1/2' : 'w-full'}>
                  <div className="flex justify-between items-center text-2xl font-black text-brand-primary">
                    <span>TOTAL</span>
                    <span>RD${total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-center text-gray-400 mt-2">Impuestos incluidos</p>
              </div>
            </div>

            {/* Footer / QR */}
            <div className={`text-center ${format === 'letter' ? 'flex flex-row-reverse items-center justify-between border-t pt-8 mt-12' : ''}`}>
              <div className="text-center">
                  <div className="bg-white p-2 inline-block border border-gray-200 rounded-xl mb-3 shadow-sm">
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=000&bgcolor=fff&data=https://wa.me/${content.whatsapp_number || '18091234567'}?text=Hola,%20adjunto%20mi%20ticket%20de%20orden%20#${orderId}`}
                        alt="QR Ticket Code" 
                        className={format === 'letter' ? 'w-[120px] h-[120px]' : 'w-[90px] h-[90px]'} 
                     />
                  </div>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Escanear para verificar</p>
              </div>
              
              <div className={`${format === 'letter' ? 'text-left' : 'mt-6'} text-gray-400 space-y-1`}>
                  <p className="text-[10px] font-bold">¡Gracias por tu compra!</p>
                  <p className="text-[10px]">{content.contact_address || 'Punta Cana, RD'}</p>
                  {format === 'letter' && (
                      <div className="mt-4 text-[9px] max-w-sm">
                          Condiciones: No se aceptan devoluciones en artículos personalizados. 
                          Las citas deben cancelarse con 24h de antelación.
                      </div>
                  )}
              </div>
            </div>
            
            {/* Cut Line Visual (Only for Ticket) */}
            {format === 'ticket' && (
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none opacity-20">
                    <svg className="w-full h-4 text-brand-primary fill-current transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                    </svg>
                </div>
            )}
          </div>
  );

  if (inline) {
     return (
        <div className="w-full mt-4 transform scale-90 origin-top pointer-events-none fade-in">
           {ticketContent}
        </div>
     );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Actions (No Print) */}
        <div className="p-4 bg-brand-primary text-white flex justify-between items-center no-print">
           <div className="flex items-center gap-4">
               <h3 className="font-serif font-bold text-lg hidden md:block">Vista Previa Ticket</h3>
               
               {/* Format Toggle */}
               <div className="flex bg-white/10 p-1 rounded-lg">
                   <button 
                     onClick={() => setFormat('ticket')}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${format === 'ticket' ? 'bg-brand-accent text-brand-primary shadow' : 'text-gray-300 hover:text-white'}`}
                   >
                       <ScrollText size={16} /> Ticket
                   </button>
                   <button 
                     onClick={() => setFormat('letter')}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-colors ${format === 'letter' ? 'bg-brand-accent text-brand-primary shadow' : 'text-gray-300 hover:text-white'}`}
                   >
                       <FileType size={16} /> Carta (8.5x11)
                   </button>
               </div>
           </div>
           
           <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
             <X size={20} />
           </button>
        </div>

        {/* Scrollable Area */}
        <div className="flex-grow overflow-y-auto bg-gray-100 p-4 md:p-8 custom-scrollbar flex justify-center">
             {ticketContent}
        </div>

        {/* Footer Actions (No Print) */}
        <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-3 gap-2 no-print z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <button 
             onClick={handlePrint}
             className="flex flex-col items-center justify-center gap-1 bg-gray-50 text-brand-primary py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors text-xs"
             title="Imprimir usando el diálogo del sistema"
           >
             <Printer size={20} />
             Imprimir
           </button>
           <button 
             onClick={handleDownloadPDF}
             disabled={isGenerating}
             className="flex flex-col items-center justify-center gap-1 bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-brand-accent hover:text-brand-primary transition-colors disabled:opacity-50 text-xs"
             title="Descargar como archivo PDF"
           >
             <FileText size={20} />
             {isGenerating ? '...' : `Guardar PDF (${format === 'ticket' ? 'T' : 'C'})`}
           </button>
           <button 
             onClick={handleDownloadImage}
             disabled={isGenerating}
             className="flex flex-col items-center justify-center gap-1 bg-gray-50 text-brand-primary py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 text-xs"
             title="Descargar como imagen JPEG"
           >
             <Download size={20} />
             {isGenerating ? '...' : 'Guardar IMG'}
           </button>
        </div>
      </div>

      {/* Helper Color Array to recreate preview */}
      <div className="hidden">
      </div>
    </div>
  );
};

// Redefining basic needed colors map locally for the receipt preview to work without props drilling everything
const COLORS = [
  { name: 'Blanco', value: '#ffffff' },
  { name: 'Negro', value: '#1a1a1a' },
  { name: 'Carbón', value: '#374151' },
  { name: 'Gris', value: '#9ca3af' },
  { name: 'Gris Claro', value: '#e5e7eb' },
  { name: 'Gris Oscuro', value: '#374151' },
  { name: 'Arena', value: '#d6d3d1' },
  { name: 'Azul Marino', value: '#1e3a8a' },
  { name: 'Azul Oscuro', value: '#172554' },
  { name: 'Azul Royal', value: '#2563eb' },
  { name: 'Celeste', value: '#7dd3fc' },
  { name: 'Azul Cielo', value: '#bae6fd' },
  { name: 'Turquesa', value: '#06b6d4' },
  { name: 'Turquesa Oscuro', value: '#0e7490' },
  { name: 'Menta', value: '#6ee7b7' },
  { name: 'Oliva', value: '#556b2f' },
  { name: 'Vino', value: '#7f1d1d' },
  { name: 'Rojo', value: '#ef4444' },
  { name: 'Coral', value: '#fb7185' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Lila', value: '#d8b4fe' },
  { name: 'Naranja', value: '#f97316' },
  { name: 'Amarillo', value: '#facc15' },
  { name: 'Mostaza', value: '#eab308' },
  { name: 'Verde Neón', value: '#a3e635' },
  { name: 'Verde', value: '#16a34a' },
];

export default TicketReceipt;