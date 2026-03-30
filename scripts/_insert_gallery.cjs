const fs = require('fs');
let c = fs.readFileSync('components/admin/Products.tsx', 'utf8');

const GALLERY_JSX = [
'',
'                      {/* Gallery */}',
'                      <div className="md:col-span-2">',
'                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">',
'                          <Image size={15} className="text-brand-accent"/>',
'                          {t(\'Galería de Fotos\')}',
'                          <span className="text-xs font-normal text-gray-400">({(editingProduct.gallery?.length || 0)}/8)</span>',
'                        </label>',
'                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">',
'                          {(editingProduct.gallery || []).map((url, idx) => (',
'                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">',
'                              <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover"/>',
'                              <button type="button"',
'                                onClick={() => {',
'                                  const g = [...(editingProduct.gallery || [])];',
'                                  g.splice(idx, 1);',
'                                  setEditingProduct({...editingProduct, gallery: g});',
'                                }}',
'                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"',
'                              >',
'                                <X size={12}/>',
'                              </button>',
'                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">#{idx+1}</div>',
'                            </div>',
'                          ))}',
'                          {(editingProduct.gallery?.length || 0) < 8 && (',
'                            <div className="aspect-square">',
'                              <ImageUploader',
'                                currentUrl=""',
'                                onImageChange={(url) => {',
'                                  if (!url) return;',
'                                  const g = [...(editingProduct.gallery || []), url];',
'                                  setEditingProduct({...editingProduct, gallery: g});',
'                                }}',
'                                compact={true}',
'                              />',
'                            </div>',
'                          )}',
'                        </div>',
'                        <p className="text-xs text-gray-400 mt-2">{t(\'Añade hasta 8 fotos adicionales para la galería del producto.\')}</p>',
'                      </div>',
].join('\r\n');

// Find the line with "Precio Real" and insert gallery before it
const priceIdx = c.indexOf("Precio Real (RD$)");
if (priceIdx === -1) { console.log('Cannot find Precio Real'); process.exit(1); }

// Find the start of the <div> containing Precio Real (go back to find the previous blank line)
const beforeSlice = c.substring(0, priceIdx);
const lastCRLF = beforeSlice.lastIndexOf('\r\n\r\n');
if (lastCRLF === -1) { console.log('Cannot find CRLF split'); process.exit(1); }

const insertPoint = lastCRLF + 2; // after the first \r\n

c = c.substring(0, insertPoint) + GALLERY_JSX + '\r\n\r\n' + c.substring(insertPoint);
fs.writeFileSync('components/admin/Products.tsx', c, 'utf8');
console.log('Gallery section inserted OK');
