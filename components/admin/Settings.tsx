import React, { useState, useEffect, useCallback } from 'react';
import {
  Settings as SettingsIcon, Save, Users, Plus, Trash2, Edit2, X, Check,
  Store, Phone, MessageCircle, Globe, Image, AlignLeft, Palette, Bell,
  Instagram, Facebook, Twitter, Youtube, Linkedin, MapPin, Mail, Link,
  ShieldCheck, Info, Lock, KeyRound, MonitorSmartphone, Smartphone,
  EyeOff, Eye, LogOut, Shield, AlertTriangle, RefreshCw
} from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import { useSiteContent } from '../../hooks/useSiteContent';
import { account } from '../../lib/appwrite';
import { Vendor } from '../../types';
import CustomSelect from '../ui/CustomSelect';
import ImageUploader from './ImageUploader';
import { useConfirm } from '../../hooks/useConfirm';
import { toast } from '../Toast';
import { useTranslation } from 'react-i18next';

// ─── Reusable Input Row ──────────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ─── Section Card ────────────────────────────────────────────────────────────
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
}> = ({ title, icon, children, onSave, saving }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest">
        <span className="text-brand-accent">{icon}</span> {title}
      </h4>
      {onSave && (
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-brand-primary text-brand-accent font-bold px-4 py-1.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
        >
          <Save size={14} /> Guardar
        </button>
      )}
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('store');
  const { vendors, addVendor, deleteVendor, updateVendor } = useVendors();
  const { getValue, updateValue, updateMultiple } = useSiteContent();
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorRole, setNewVendorRole] = useState<'Vendedor' | 'Gerente' | 'Admin'>('Vendedor');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { t } = useTranslation();

  // ── Store Info ─────────────────────────────────────────────────────────────
  const [store, setStore] = useState({
    store_name: getValue('store_name'),
    contact_email: getValue('contact_email'),
    contact_phone: getValue('contact_phone'),
    contact_address: getValue('contact_address'),
    store_logo: getValue('store_logo'),
    footer_text: getValue('footer_text'),
  });

  // ── WhatsApp / Contacto ────────────────────────────────────────────────────
  const [wa, setWa] = useState({
    whatsapp_number: getValue('whatsapp_number'),
    whatsapp_message: getValue('whatsapp_message'),
  });

  // ── Textos Hero / CTA ─────────────────────────────────────────────────────
  const [hero, setHero] = useState({
    hero_title: getValue('hero_title'),
    hero_subtitle: getValue('hero_subtitle'),
    hero_cta: getValue('hero_cta'),
    about_title: getValue('about_title'),
    about_text: getValue('about_text'),
  });

  // ── Redes Sociales ─────────────────────────────────────────────────────────
  const [social, setSocial] = useState({
    social_instagram: getValue('social_instagram'),
    social_facebook: getValue('social_facebook'),
    social_twitter: getValue('social_twitter'),
    social_youtube: getValue('social_youtube'),
    social_tiktok: getValue('social_tiktok'),
  });

  // Keep local state in sync with Appwrite changes
  useEffect(() => {
    setStore({
      store_name: getValue('store_name'),
      contact_email: getValue('contact_email'),
      contact_phone: getValue('contact_phone'),
      contact_address: getValue('contact_address'),
      store_logo: getValue('store_logo'),
      footer_text: getValue('footer_text'),
    });
    setWa({ whatsapp_number: getValue('whatsapp_number'), whatsapp_message: getValue('whatsapp_message') });
    setHero({
      hero_title: getValue('hero_title'), hero_subtitle: getValue('hero_subtitle'),
      hero_cta: getValue('hero_cta'), about_title: getValue('about_title'), about_text: getValue('about_text'),
    });
    setSocial({
      social_instagram: getValue('social_instagram'), social_facebook: getValue('social_facebook'),
      social_twitter: getValue('social_twitter'), social_youtube: getValue('social_youtube'),
      social_tiktok: getValue('social_tiktok'),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSection = async (data: Record<string, string>, label: string) => {
    await updateMultiple(data);
    toast.success(`${label} guardado correctamente.`);
  };

  // ── Vendors helpers ────────────────────────────────────────────────────────
  const handleAddVendor = () => {
    if (!newVendorName.trim()) return;
    addVendor({ name: newVendorName.trim(), role: newVendorRole });
    setNewVendorName('');
    setNewVendorRole('Vendedor');
  };
  const handleUpdateVendor = () => {
    if (!editingVendor || !editingVendor.name.trim()) return;
    updateVendor(editingVendor);
    setEditingVendor(null);
  };

  // ── Sidebar Tabs ───────────────────────────────────────────────────────────
  // ── Security State ──────────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwVisible, setPwVisible] = useState({ current: false, next: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [nameForm, setNameForm] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try { const res = await account.listSessions(); setSessions(res.sessions); }
    catch { setSessions([]); }
    finally { setSessionsLoading(false); }
  }, []);

  useEffect(() => { if (activeTab === 'security') loadSessions(); }, [activeTab, loadSessions]);

  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.next) { toast.error('Completa todos los campos.'); return; }
    if (pwForm.next !== pwForm.confirm) { toast.error('Las contraseñas no coinciden.'); return; }
    if (pwForm.next.length < 8) { toast.error('Mínimo 8 caracteres.'); return; }
    setPwLoading(true);
    try {
      await account.updatePassword(pwForm.next, pwForm.current);
      toast.success('Contraseña actualizada correctamente.');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err: any) { toast.error(err.message || 'Error al cambiar la contraseña.'); }
    finally { setPwLoading(false); }
  };

  const handleChangeEmail = async () => {
    if (!emailForm.newEmail || !emailForm.password) { toast.error('Completa todos los campos.'); return; }
    setEmailLoading(true);
    try {
      await account.updateEmail(emailForm.newEmail, emailForm.password);
      toast.success('Email actualizado. Verifica tu nuevo correo.');
      setEmailForm({ newEmail: '', password: '' });
    } catch (err: any) { toast.error(err.message || 'Error al cambiar el email.'); }
    finally { setEmailLoading(false); }
  };

  const handleChangeName = async () => {
    if (!nameForm.trim()) return;
    setNameLoading(true);
    try { await account.updateName(nameForm.trim()); toast.success('Nombre actualizado.'); }
    catch (err: any) { toast.error(err.message || 'Error.'); }
    finally { setNameLoading(false); }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try { await account.deleteSession(sessionId); await loadSessions(); toast.success('Sesión cerrada.'); }
    catch { toast.error('Error al cerrar la sesión.'); }
  };

  const handleDeleteAllSessions = async () => {
    if (!(await showConfirm('¿Cerrar todas las demás sesiones activas?'))) return;
    try { await account.deleteSessions(); await loadSessions(); toast.success('Sesiones cerradas.'); }
    catch { toast.error('Error.'); }
  };

  // ── Sidebar Tabs────────────────────────────────────────────────────────────
  const tabs = [
    { id: 'store',    label: 'Tienda',        icon: <Store size={17}/> },
    { id: 'contact',  label: 'Contacto',       icon: <Phone size={17}/> },
    { id: 'hero',     label: 'Textos & Hero',  icon: <AlignLeft size={17}/> },
    { id: 'social',   label: 'Redes Sociales', icon: <Globe size={17}/> },
    { id: 'security', label: 'Seguridad',      icon: <Shield size={17}/> },
    { id: 'vendors',  label: 'Vendedores',     icon: <Users size={17}/> },
  ];

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm bg-white";
  const ta  = `${inp} h-24 resize-none`;

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row">

        {/* ── Sidebar ── */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0">
          <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
            <SettingsIcon size={20} className="text-brand-accent"/> Configuración
          </h3>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-white shadow-sm border border-gray-200 text-brand-primary'
                  : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800 border border-transparent'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}

          {/* Info block */}
          <div className="mt-auto pt-6">
            <div className="bg-brand-accent/10 rounded-xl p-4 text-xs text-brand-primary/80 flex gap-2">
              <Info size={14} className="shrink-0 mt-0.5"/>
              <span>Los cambios se guardan en la base de datos y se reflejan en tiempo real en la tienda.</span>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-white">
          <div className="max-w-3xl">

            {/* ═══ TIENDA ═══════════════════════════════════════════════════ */}
            {activeTab === 'store' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Información de la Tienda</h2>
                  <p className="text-sm text-gray-500 mt-1">Datos generales que aparecen en toda la aplicación.</p>
                </div>

                <Section
                  title="Identidad"
                  icon={<Palette size={16}/>}
                  onSave={() => saveSection(store, 'Identidad')}
                >
                  <Field label="Nombre de la Tienda">
                    <input className={inp} value={store.store_name} onChange={e => setStore({...store, store_name: e.target.value})}/>
                  </Field>
                  <Field label="Texto del Footer">
                    <input className={inp} value={store.footer_text} onChange={e => setStore({...store, footer_text: e.target.value})}/>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Logo de la Tienda" hint="Se muestra en el header y en documentos.">
                      <ImageUploader
                        currentUrl={store.store_logo}
                        onImageChange={url => setStore({...store, store_logo: url})}
                      />
                    </Field>
                  </div>
                </Section>

                <Section
                  title="Notificaciones"
                  icon={<Bell size={16}/>}
                >
                  <Field label="Email de notificaciones" hint="Recibe alertas de pedidos y reservas.">
                    <input className={inp} type="email" value={store.contact_email} onChange={e => setStore({...store, contact_email: e.target.value})} placeholder="admin@tutienda.com"/>
                  </Field>
                  <div className="flex items-end">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 w-full">
                      <strong>Próximamente:</strong> Notificaciones push, resumen diario de ventas y alertas de stock bajo.
                    </div>
                  </div>
                </Section>

                <Section
                  title="Apariencia"
                  icon={<Palette size={16}/>}
                >
                  <div className="md:col-span-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <strong className="text-gray-700">🎨 Temas & Colores</strong>
                    <p className="mt-1">Personalización avanzada de colores y fuentes — próximamente disponible en esta sección.</p>
                  </div>
                </Section>
              </div>
            )}

            {/* ═══ CONTACTO ══════════════════════════════════════════════════ */}
            {activeTab === 'contact' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Contacto & WhatsApp</h2>
                  <p className="text-sm text-gray-500 mt-1">Información de contacto visible en la tienda y en el footer.</p>
                </div>

                <Section
                  title="Datos de Contacto"
                  icon={<Phone size={16}/>}
                  onSave={() => saveSection(store, 'Contacto')}
                >
                  <Field label="Teléfono" hint="Con código de país, ej: +1 809 555 1234">
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input className={`${inp} pl-9`} value={store.contact_phone} onChange={e => setStore({...store, contact_phone: e.target.value})} placeholder="+1 809 555 1234"/>
                    </div>
                  </Field>
                  <Field label="Correo Electrónico">
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input className={`${inp} pl-9`} type="email" value={store.contact_email} onChange={e => setStore({...store, contact_email: e.target.value})} placeholder="info@tienda.com"/>
                    </div>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Dirección / Ubicación">
                      <div className="relative">
                        <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input className={`${inp} pl-9`} value={store.contact_address} onChange={e => setStore({...store, contact_address: e.target.value})} placeholder="Punta Cana, República Dominicana"/>
                      </div>
                    </Field>
                  </div>
                </Section>

                <Section
                  title="WhatsApp"
                  icon={<MessageCircle size={16}/>}
                  onSave={() => saveSection(wa, 'WhatsApp')}
                >
                  <Field label="Número de WhatsApp" hint="Solo números, sin espacios ni guiones. Ej: 18095551234">
                    <div className="relative">
                      <MessageCircle size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500"/>
                      <input className={`${inp} pl-9`} value={wa.whatsapp_number} onChange={e => setWa({...wa, whatsapp_number: e.target.value})} placeholder="18095551234"/>
                    </div>
                  </Field>
                  <Field label="Mensaje predeterminado" hint="Texto que aparece al abrir el chat de WhatsApp.">
                    <input className={inp} value={wa.whatsapp_message} onChange={e => setWa({...wa, whatsapp_message: e.target.value})} placeholder="Hola, me interesa un producto..."/>
                  </Field>
                  {wa.whatsapp_number && (
                    <div className="md:col-span-2">
                      <a
                        href={`https://wa.me/${wa.whatsapp_number}?text=${encodeURIComponent(wa.whatsapp_message)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                      >
                        <MessageCircle size={16}/> Probar enlace de WhatsApp
                      </a>
                    </div>
                  )}
                </Section>
              </div>
            )}

            {/* ═══ TEXTOS HERO ═══════════════════════════════════════════════ */}
            {activeTab === 'hero' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Textos & Secciones</h2>
                  <p className="text-sm text-gray-500 mt-1">Edita los textos que aparecen en la página principal.</p>
                </div>

                <Section
                  title="Hero Principal"
                  icon={<Image size={16}/>}
                  onSave={() => saveSection(hero, 'Hero')}
                >
                  <Field label="Título Principal (H1)">
                    <input className={inp} value={hero.hero_title} onChange={e => setHero({...hero, hero_title: e.target.value})}/>
                  </Field>
                  <Field label="Subtítulo">
                    <input className={inp} value={hero.hero_subtitle} onChange={e => setHero({...hero, hero_subtitle: e.target.value})}/>
                  </Field>
                  <Field label="Texto del botón CTA">
                    <input className={inp} value={hero.hero_cta} onChange={e => setHero({...hero, hero_cta: e.target.value})} placeholder="Explorar Tienda"/>
                  </Field>
                </Section>

                <Section
                  title="Sección Acerca De"
                  icon={<AlignLeft size={16}/>}
                  onSave={() => saveSection(hero, 'Acerca De')}
                >
                  <Field label="Título">
                    <input className={inp} value={hero.about_title} onChange={e => setHero({...hero, about_title: e.target.value})}/>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Descripción">
                      <textarea className={ta} value={hero.about_text} onChange={e => setHero({...hero, about_text: e.target.value})}/>
                    </Field>
                  </div>
                </Section>
              </div>
            )}

            {/* ═══ REDES SOCIALES ══════════════════════════════════════════ */}
            {activeTab === 'social' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Redes Sociales</h2>
                  <p className="text-sm text-gray-500 mt-1">URLs de tus perfiles. Déjalos en blanco para ocultarlos.</p>
                </div>

                <Section
                  title="Perfiles Sociales"
                  icon={<Globe size={16}/>}
                  onSave={() => saveSection(social, 'Redes Sociales')}
                >
                  {[
                    { key: 'social_instagram', label: 'Instagram', icon: <Instagram size={14}/>, ph: 'https://instagram.com/tutienda' },
                    { key: 'social_facebook',  label: 'Facebook',  icon: <Facebook size={14}/>,  ph: 'https://facebook.com/tutienda' },
                    { key: 'social_twitter',   label: 'X / Twitter', icon: <Twitter size={14}/>, ph: 'https://x.com/tutienda' },
                    { key: 'social_youtube',   label: 'YouTube',   icon: <Youtube size={14}/>,   ph: 'https://youtube.com/@tutienda' },
                    { key: 'social_tiktok',    label: 'TikTok',    icon: <Link size={14}/>,      ph: 'https://tiktok.com/@tutienda' },
                  ].map(({ key, label, icon, ph }) => (
                    <Field key={key} label={label}>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
                        <input
                          className={`${inp} pl-9`}
                          value={social[key as keyof typeof social]}
                          onChange={e => setSocial({...social, [key]: e.target.value})}
                          placeholder={ph}
                          type="url"
                        />
                      </div>
                    </Field>
                  ))}
                  <div className="md:col-span-2 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
                    <strong>Nota:</strong> Los íconos de redes sociales se mostrarán en el footer de la tienda cuando se complete la integración del footer dinámico.
                  </div>
                </Section>
              </div>
            )}


            {/* ═══ SEGURIDAD ══════════════════════════════════════════════════ */}
            {activeTab === 'security' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">Seguridad & Acceso</h2>
                  <p className="text-sm text-gray-500 mt-1">Gestiona tu contraseña, email y sesiones activas en tiempo real.</p>
                </div>

                {/* Change Password */}
                <Section title="Cambiar Contraseña" icon={<KeyRound size={16}/>} onSave={handleChangePassword} saving={pwLoading}>
                  {(['current','next','confirm'] as const).map((field) => {
                    const labels = { current: 'Contraseña actual', next: 'Nueva contraseña', confirm: 'Confirmar nueva contraseña' };
                    const hints  = { current: '', next: 'Mínimo 8 caracteres.', confirm: '' };
                    return (
                      <div key={field} className="md:col-span-2">
                        <Field label={labels[field]} hint={hints[field]}>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                            <input
                              className={`${inp} pl-9 pr-10`}
                              type={pwVisible[field] ? 'text' : 'password'}
                              value={pwForm[field]}
                              onChange={e => setPwForm({...pwForm, [field]: e.target.value})}
                              placeholder={labels[field]}
                              autoComplete={field === 'current' ? 'current-password' : 'new-password'}
                            />
                            <button type="button"
                              onClick={() => setPwVisible(v => ({...v, [field]: !v[field]}))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {pwVisible[field] ? <EyeOff size={14}/> : <Eye size={14}/>}
                            </button>
                          </div>
                        </Field>
                      </div>
                    );
                  })}
                </Section>

                {/* Change Email */}
                <Section title="Cambiar Email de Acceso" icon={<Mail size={16}/>} onSave={handleChangeEmail} saving={emailLoading}>
                  <Field label="Nuevo email">
                    <input className={inp} type="email" value={emailForm.newEmail}
                      onChange={e => setEmailForm({...emailForm, newEmail: e.target.value})}
                      placeholder="nuevo@correo.com"/>
                  </Field>
                  <Field label="Contraseña actual (confirmación)">
                    <div className="relative">
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input className={`${inp} pl-9`} type="password" value={emailForm.password}
                        onChange={e => setEmailForm({...emailForm, password: e.target.value})}
                        placeholder="Tu contraseña actual"/>
                    </div>
                  </Field>
                </Section>

                {/* Change Name */}
                <Section title="Nombre de Perfil" icon={<Users size={16}/>} onSave={handleChangeName} saving={nameLoading}>
                  <div className="md:col-span-2">
                    <Field label="Nombre visible en el panel">
                      <input className={inp} value={nameForm}
                        onChange={e => setNameForm(e.target.value)}
                        placeholder="Tu nombre o alias"/>
                    </Field>
                  </div>
                </Section>

                {/* Active Sessions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                      <span className="text-brand-accent"><MonitorSmartphone size={16}/></span> Sesiones Activas
                    </h4>
                    <div className="flex gap-2">
                      <button onClick={loadSessions} title="Actualizar" className="p-1.5 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors">
                        <RefreshCw size={14} className={sessionsLoading ? 'animate-spin' : ''}/>
                      </button>
                      {sessions.length > 1 && (
                        <button onClick={handleDeleteAllSessions}
                          className="text-red-500 hover:bg-red-50 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 border border-red-100 transition-colors">
                          <LogOut size={12}/> Cerrar todas
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {sessionsLoading ? (
                      <div className="p-8 text-center text-gray-400">
                        <RefreshCw size={24} className="animate-spin mx-auto mb-2"/>
                        <p className="text-sm">Cargando sesiones...</p>
                      </div>
                    ) : sessions.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        <Shield size={28} className="mx-auto mb-2 opacity-30"/>
                        <p className="text-sm font-bold">No hay sesiones registradas</p>
                      </div>
                    ) : sessions.map((s) => {
                      const isCurrent = s.current;
                      const isMobile  = (s.deviceName || '').toLowerCase().includes('mobile') || s.clientType === 'mobile';
                      const date = new Date(s.$createdAt);
                      return (
                        <div key={s.$id} className={`flex items-center justify-between px-6 py-4 transition-colors ${isCurrent ? 'bg-green-50/50' : 'hover:bg-gray-50/50'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${isCurrent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {isMobile ? <Smartphone size={20}/> : <MonitorSmartphone size={20}/>}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                {s.clientName || s.deviceName || 'Navegador desconocido'}
                                {isCurrent && <span className="bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">ACTUAL</span>}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {[s.ip, s.countryName, date.toLocaleString('es-DO')].filter(Boolean).join(' · ')}
                              </p>
                              {s.osName && <p className="text-xs text-gray-400">{s.osName} {s.osVersion} — {s.clientName} {s.clientVersion}</p>}
                            </div>
                          </div>
                          {!isCurrent && (
                            <button onClick={() => handleDeleteSession(s.$id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Cerrar sesión">
                              <LogOut size={16}/>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
                  <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5"/>
                  <div className="text-sm text-amber-800">
                    <p className="font-bold mb-1">Buenas prácticas de seguridad</p>
                    <ul className="space-y-1 text-xs list-disc list-inside">
                      <li>Usa una contraseña de al menos 12 caracteres con símbolos y números.</li>
                      <li>No compartas tus credenciales, ni por WhatsApp.</li>
                      <li>Cierra sesión desde dispositivos que ya no uses.</li>
                      <li>Si sospechas acceso no autorizado, cambia tu contraseña inmediatamente.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ VENDEDORES ════════════════════════════════════════════════ */}

            {activeTab === 'vendors' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-gray-800">{t('Gestión de Vendedores')}</h2>
                  <p className="text-sm text-gray-500 mt-1">{t('Agrega vendedores por nombre. Se usarán para identificar quién realizó cada venta o reserva.')}</p>
                </div>

                {/* Add Form */}
                <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 mb-6">
                  <h5 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Plus size={16} className="text-brand-accent" /> {t('Agregar Vendedor')}
                  </h5>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text" value={newVendorName}
                      onChange={e => setNewVendorName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddVendor()}
                      placeholder={t('Nombre del vendedor...')}
                      maxLength={100}
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm"
                    />
                    <CustomSelect
                      value={newVendorRole}
                      onChange={val => setNewVendorRole(val as 'Vendedor' | 'Gerente' | 'Admin')}
                      options={[
                        { label: t('Vendedor'), value: 'Vendedor' },
                        { label: t('Gerente'), value: 'Gerente' },
                        { label: 'Admin', value: 'Admin' },
                      ]}
                      variant="input"
                    />
                    <button
                      onClick={handleAddVendor}
                      disabled={!newVendorName.trim()}
                      className="bg-brand-primary text-brand-accent font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus size={16} /> {t('Agregar')}
                    </button>
                  </div>
                </div>

                {/* Role Legend */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { role: 'Admin', color: 'bg-purple-100 text-purple-700', desc: 'Acceso total' },
                    { role: 'Gerente', color: 'bg-amber-100 text-amber-700', desc: 'Gestión de pedidos' },
                    { role: 'Vendedor', color: 'bg-brand-accent/20 text-brand-primary', desc: 'Punto de venta' },
                  ].map(r => (
                    <span key={r.role} className={`${r.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5`}>
                      <ShieldCheck size={11}/> {r.role} — {r.desc}
                    </span>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                      <tr>
                        <th className="p-4">{t('Nombre')}</th>
                        <th className="p-4">{t('Rol')}</th>
                        <th className="p-4 text-center w-32">{t('Acciones')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {vendors.map(vendor => (
                        <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-4">
                            {editingVendor?.id === vendor.id ? (
                              <input
                                type="text" value={editingVendor.name}
                                onChange={e => setEditingVendor({...editingVendor, name: e.target.value})}
                                onKeyDown={e => e.key === 'Enter' && handleUpdateVendor()}
                                maxLength={100}
                                className="border border-brand-accent rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm w-full"
                                autoFocus
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                  {vendor.name[0]?.toUpperCase()}
                                </div>
                                <span className="font-bold text-gray-800">{vendor.name}</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4">
                            {editingVendor?.id === vendor.id ? (
                              <CustomSelect
                                value={editingVendor.role}
                                onChange={val => setEditingVendor({...editingVendor, role: val as 'Vendedor' | 'Gerente' | 'Admin'})}
                                options={[
                                  { label: t('Vendedor'), value: 'Vendedor' },
                                  { label: t('Gerente'), value: 'Gerente' },
                                  { label: 'Admin', value: 'Admin' },
                                ]}
                                variant="input"
                              />
                            ) : (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                vendor.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                vendor.role === 'Gerente' ? 'bg-amber-100 text-amber-700' :
                                'bg-brand-accent/20 text-brand-primary'
                              }`}>
                                {vendor.role}
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {editingVendor?.id === vendor.id ? (
                              <div className="flex justify-center gap-1">
                                <button onClick={handleUpdateVendor} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={16}/></button>
                                <button onClick={() => setEditingVendor(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><X size={16}/></button>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-1">
                                <button onClick={() => setEditingVendor({...vendor})} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15}/></button>
                                <button onClick={async () => { if (await showConfirm(`¿Eliminar a ${vendor.name}?`)) deleteVendor(vendor.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {vendors.length === 0 && (
                        <tr>
                          <td colSpan={3} className="p-8 text-center text-gray-400">
                            <Users size={32} className="mx-auto mb-2 opacity-30"/>
                            <p className="font-bold">{t('No hay vendedores registrados')}</p>
                            <p className="text-xs mt-1">{t('Agrega vendedores arriba para asignarlos a ventas y reservas.')}</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
