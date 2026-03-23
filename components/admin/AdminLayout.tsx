import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Scissors, Box, PackagePlus, Settings, LogOut, Menu, X, User, Palette, Search, Tag, Globe, ImageIcon, FolderOpen, Layers } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { i18n, t } = useTranslation();

  const changeLang = (lang: 'es' | 'en' | 'fr') => i18n.changeLanguage(lang);
  const currentLang = i18n.language as 'es' | 'en' | 'fr';

  const menuItems = [
    { name: t('Dashboard'), icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { name: t('Customizer'), icon: <Palette size={20} />, path: '/admin/customizer' },
    { name: t('Estudio Trenzas'), icon: <Scissors size={20} />, path: '/admin/braids' },
    { name: t('Catálogo Boutique'), icon: <Box size={20} />, path: '/admin/products' },
    { name: t('Marcas'), icon: <Tag size={20} />, path: '/admin/brands' },
    { name: t('Categorías'), icon: <FolderOpen size={20} />, path: '/admin/categories' },
    { name: t('Servicios Menú'), icon: <Layers size={20} />, path: '/admin/services' },
    { name: t('Slider Público'), icon: <ImageIcon size={20} />, path: '/admin/slider' },
    { name: t('Contenido Web'), icon: <Globe size={20} />, path: '/admin/site-content' },
    { name: t('Rastreador'), icon: <Search size={20} />, path: '/admin/tracking' },
    { name: t('Configuración'), icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:shadow-none lg:border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
          <div className="font-serif font-black text-2xl text-brand-primary tracking-tight">CM | ADMIN</div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold shadow-inner text-lg">
            {user?.name?.[0] || 'A'}
          </div>
          <div>
            <p className="font-bold text-gray-800 leading-tight">{user?.name || t('Administrador')}</p>
            <p className="text-xs text-brand-accent font-semibold">{user?.role || t('Admin')}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {menuItems.map((item) => (
             <NavLink 
               key={item.path} 
               to={item.path}
               onClick={() => setSidebarOpen(false)}
               className={({ isActive }) => 
                 `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                   isActive 
                   ? 'bg-brand-primary text-brand-accent shadow-md shadow-brand-primary/20 scale-100 border border-brand-primary/10' 
                   : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                 }`
               }
             >
               <span className="flex-shrink-0">{item.icon}</span>
               {item.name}
             </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={async () => {
              await logout();
              navigate('/');
            }} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
             <LogOut size={20} /> {t('Cerrar Sesión')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 shadow-sm z-30 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="font-serif font-bold text-xl text-gray-800 hidden sm:block">{t('Panel de Control')}</h1>
          </div>

          <div className="flex items-center gap-3">
             {/* Language Switcher */}
             <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
               {(['es','en','fr'] as const).map(lang => (
                 <button
                   key={lang}
                   onClick={() => changeLang(lang)}
                   title={lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                   className={`px-2.5 py-1 rounded-lg text-sm font-black transition-all ${
                     currentLang === lang
                       ? 'bg-white shadow text-brand-primary'
                       : 'text-gray-400 hover:text-gray-700'
                   }`}
                 >
                   {lang === 'es' ? '🇪🇸' : lang === 'en' ? '🇺🇸' : '🇫🇷'}
                 </button>
               ))}
             </div>

             <div className="bg-brand-accent/20 text-brand-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
               {user?.role || 'Admin'}
             </div>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
