const fs = require('fs');
let c = fs.readFileSync('App.tsx', 'utf8');

const GALLERY_BTN = `
          {/* Gallery CTA */}
          <div className="text-center py-10 border-t border-black/5">
            <p className="text-sm text-gray-500 mb-4">{t('¿Quieres ver todos nuestros modelos antes de reservar?')}</p>
            <button
              onClick={() => navigate('/braids/gallery')}
              className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-brand-primary/90 transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl text-sm"
            >
              📸 {t('Ver Galería Completa de Modelos')}
            </button>
          </div>`;

// Find the closing </section> of renderBraidsSection
// It's the section that contains "renderBraidsSection" which starts at line 265
// The closing </section> is the first one after the info grid
const marker = `       </section>\n     );\n  };\n\n  const renderBisuteriaSection`;
const replacement = GALLERY_BTN + `\n       </section>\n     );\n  };\n\n  const renderBisuteriaSection`;

if (c.includes(marker)) {
  c = c.replace(marker, replacement);
  fs.writeFileSync('App.tsx', c, 'utf8');
  console.log('Gallery CTA button inserted OK');
} else {
  // Try alternate
  const alt = `        </section>\n      );\n  };\n\n  const renderBisuteriaSection`;
  if (c.includes(alt)) {
    c = c.replace(alt, GALLERY_BTN + `\n        </section>\n      );\n  };\n\n  const renderBisuteriaSection`);
    fs.writeFileSync('App.tsx', c, 'utf8');
    console.log('Gallery CTA button inserted OK (alt)');
  } else {
    // Search by searching for the section.  Print context around Diseño Especial
    const idx = c.indexOf('Diseño Especial');
    console.log('Context:', JSON.stringify(c.substring(idx, idx + 400)));
  }
}
