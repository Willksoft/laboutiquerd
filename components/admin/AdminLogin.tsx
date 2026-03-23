import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-brand-primary to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, white 2%, transparent 0%)', backgroundSize: '50px 50px' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-3">
            <span className="text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'HappinessBeta', Georgia, serif" }}>Boutique</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" className="w-10 h-10 text-brand-accent" fill="currentColor">
              <path d="m19.96 18.88-2.05 2.05 2.04 2.05L22 20.93l-2.04-2.05Zm1.41-15.15c-.15-.59-1.47.23-4.3 2.79 1.12 1.25 1.69.53 2.6.2.72 1.38 1 7.6-3.72 9.46a1255.68 1255.68 0 0 0 .17-13.06.22.22 0 0 0-.26-.11c-1.31.17-3.63 2.47-5.41 4.4.98 1.61 2.22.17 3.21-.24 0 .27-.24 4.89-.13 9.59-4.88.36-4.1-9.57-3.81-10.85.12-1.01-3.14 1.24-4.76 2.74.51.92 1.23.73 2.12.39-.32 4.46 2.82 8.5 6.48 8.42.12 4.59.6 9.05 1.94 9.36.17.05.32-4.65.42-9.87 8.8-2.72 5.44-13.22 5.44-13.22"/>
            </svg>
          </div>
          <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Panel de Administración</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-brand-primary" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Iniciar Sesión</h2>
              <p className="text-xs text-gray-400">Acceso restringido al personal autorizado</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                  placeholder="correo@boutique.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl border border-red-100" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3.5 bg-brand-primary text-brand-accent font-bold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} /> Acceder al Panel
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to store */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-white/40 text-sm hover:text-brand-accent transition-colors font-medium"
          >
            ← Volver a la Tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
