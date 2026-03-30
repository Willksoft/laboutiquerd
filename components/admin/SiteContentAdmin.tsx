import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle, Layout, MessageCircle, Phone, MapPin, Mail, Scissors, Palette, Type, Image as ImageIcon } from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';
import ImageUploader from './ImageUploader';
import { useTranslation } from 'react-i18next';

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  fields: FieldConfig[];
}

interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'image';
  placeholder?: string;
  maxLength?: number;
}

const SECTIONS: SectionConfig[] = [
  {
    id: 'hero',
    title: 'Hero / Banner Principal',
    icon: <Layout size={18} />,
    fields: [
      { key: 'hero_title', label: 'Título Principal', type: 'text', placeholder: 'LA BOUTIQUE', maxLength: 100 },
      { key: 'hero_subtitle', label: 'Subtítulo Principal', type: 'text', placeholder: 'Tu Tienda de Regalos...', maxLength: 200 },
      { key: 'hero_cta', label: 'Texto Botón Principal', type: 'text', placeholder: 'Explorar Tienda', maxLength: 50 },
      { key: 'store_name', label: 'Nombre de la Tienda', type: 'text', placeholder: 'Boutique', maxLength: 100 },
      { key: 'store_logo', label: 'URL Logo Tienda', type: 'url', placeholder: 'https://...', maxLength: 500 },
    ]
  },
  {
    id: 'about',
    title: 'Sección "Acerca de"',
    icon: <Type size={18} />,
    fields: [
      { key: 'about_title', label: 'Título', type: 'text', placeholder: 'Tu Tienda de Confianza', maxLength: 100 },
      { key: 'about_text', label: 'Texto descriptivo', type: 'textarea', placeholder: 'Somos una boutique premium...', maxLength: 1000 },
    ]
  },
  {
    id: 'braids',
    title: 'Sección Trenzas',
    icon: <Scissors size={18} />,
    fields: [
      { key: 'braids_title', label: 'Título', type: 'text', placeholder: 'Estudio de Trenzas', maxLength: 100 },
      { key: 'braids_subtitle', label: 'Subtítulo', type: 'text', placeholder: 'Reserva tu cita...', maxLength: 200 },
    ]
  },
  {
    id: 'custom',
    title: 'Sección Personalizados',
    icon: <Palette size={18} />,
    fields: [
      { key: 'custom_title', label: 'Título', type: 'text', placeholder: 'Personaliza tu Camiseta', maxLength: 100 },
      { key: 'custom_subtitle', label: 'Subtítulo', type: 'text', placeholder: 'Diseña tu propia camiseta...', maxLength: 200 },
    ]
  },
  {
    id: 'services_menu',
    title: 'Imágenes Mega Menú Servicios',
    icon: <ImageIcon size={18} />,
    fields: [
      { key: 'service_img_braids',    label: 'Imagen — Estudio de Trenzas',       type: 'image' },
      { key: 'service_img_bisuteria', label: 'Imagen — Bisutería & Accesorios',   type: 'image' },
      { key: 'service_img_custom',    label: 'Imagen — Personalizados',            type: 'image' },
    ]
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp y Contacto',
    icon: <MessageCircle size={18} />,
    fields: [
      { key: 'whatsapp_number', label: 'Número de WhatsApp', type: 'text', placeholder: '18091234567', maxLength: 20 },
      { key: 'whatsapp_message', label: 'Mensaje Predefinido (WhatsApp)', type: 'text', placeholder: 'Hola, me interesa...', maxLength: 200 },
      { key: 'contact_email', label: 'Correo Electrónico', type: 'text', placeholder: 'info@laboutiquerd.com', maxLength: 100 },
      { key: 'contact_phone', label: 'Teléfono de Contacto', type: 'text', placeholder: '+1 (809) 123-4567', maxLength: 30 },
      { key: 'contact_address', label: 'Dirección Física', type: 'text', placeholder: 'Punta Cana...', maxLength: 200 },
      { key: 'footer_text', label: 'Texto del footer', type: 'text', placeholder: '© Boutique...', maxLength: 200 },
    ]
  },
  {
    id: 'social',
    title: 'Redes Sociales',
    icon: <Globe size={18} />,
    fields: [
      { key: 'social_instagram', label: 'Instagram', type: 'url', placeholder: 'https://instagram.com/tutienda' },
      { key: 'social_facebook',  label: 'Facebook',  type: 'url', placeholder: 'https://facebook.com/tutienda' },
      { key: 'social_tiktok',    label: 'TikTok',    type: 'url', placeholder: 'https://tiktok.com/@tutienda' },
      { key: 'social_youtube',   label: 'YouTube',   type: 'url', placeholder: 'https://youtube.com/@tutienda' },
      { key: 'social_twitter',   label: 'X / Twitter', type: 'url', placeholder: 'https://x.com/tutienda' },
    ]
  },
];

const SiteContentAdmin: React.FC = () => {
  const { content, updateMultiple, loading } = useSiteContent();
  const [localContent, setLocalContent] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { t } = useTranslation();

  // Sync local state when content loads
  useEffect(() => {
    setLocalContent({ ...content });
  }, [content]);

  const handleChange = (key: string, value: string) => {
    setLocalContent(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    // Only save fields that changed
    const changes: Record<string, string> = {};
    for (const [key, value] of Object.entries(localContent)) {
      if (value !== content[key]) {
        changes[key] = value;
      }
    }
    if (Object.keys(changes).length > 0) {
      await updateMultiple(changes);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];
  const hasChanges = Object.entries(localContent).some(([key, value]) => value !== content[key]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row">
      {/* Sections Sidebar */}
      <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
        <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
          <Globe size={20} className="text-brand-accent" /> {t('Contenido Web')}
        </h3>

        {SECTIONS.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${
              activeSection === section.id
                ? 'bg-white shadow-sm border border-gray-200 text-brand-primary'
                : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800 border border-transparent'
            }`}
          >
            {section.icon} {section.title}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-8 bg-white flex flex-col overflow-y-auto custom-scrollbar">
        <div className="flex-1 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                {currentSection.icon} {currentSection.title}
              </h4>
              <p className="text-sm text-gray-500 mt-1">{t('Edita los textos e imágenes de esta sección. Los cambios se reflejarán en la web pública.')}</p>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={saving || !hasChanges}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                saved
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : hasChanges
                    ? 'bg-brand-primary text-white hover:bg-brand-accent hover:text-brand-primary shadow-md'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saved ? <><CheckCircle size={18} /> {t('Guardado')}</> : saving ? t('Guardando...') : <><Save size={18} /> {t('Guardar')}</>}
            </button>
          </div>

          <div className="space-y-6">
            {currentSection.fields.map(field => (
              <div key={field.key} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={localContent[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={localContent[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-32 text-sm"
                  />
                )}

                {field.type === 'url' && (
                  <input
                    type="url"
                    value={localContent[field.key] || ''}
                    onChange={e => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder || 'https://...'}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm font-mono"
                  />
                )}

                {field.type === 'image' && (
                  <ImageUploader
                    currentUrl={localContent[field.key] || ''}
                    onImageChange={(url) => handleChange(field.key, url)}
                  />
                )}

                {field.maxLength && (
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {(localContent[field.key] || '').length} / {field.maxLength}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteContentAdmin;
