import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token: authToken, ...userInfo } = (await authService.login(email, password)).data;
      login(authToken, userInfo);
      navigate('/actividades');
    } catch {
      setError('Credenciales inválidas. Verifique su correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header institucional */}
        <div className="bg-blue-900 px-8 py-7 text-center">
          <p className="text-blue-300 text-xs font-medium uppercase tracking-widest mb-1">Sistema de Gestión</p>
          <h1 className="text-3xl font-bold text-white tracking-wide">EXOAL</h1>
          <p className="text-blue-200 text-sm mt-1">Actividades Académicas</p>
        </div>
        {/* Barra dorada de acento */}
        <div className="h-1 bg-yellow-400" />

        {/* Formulario */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario@ejemplo.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-2.5 px-4 rounded-md hover:bg-blue-900 disabled:opacity-50 font-semibold transition-colors"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-gray-600 space-y-1">
            <p className="font-semibold text-blue-900">Usuarios de demostración:</p>
            <p>
              <span className="font-mono">admin@demo.edu</span> /{' '}
              <span className="font-mono">Admin1234</span>
              <span className="ml-2 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs font-medium">
                administrador
              </span>
            </p>
            <p>
              <span className="font-mono">docente@demo.edu</span> /{' '}
              <span className="font-mono">Docente123</span>
              <span className="ml-2 bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded text-xs font-medium">
                docente — solo lectura
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
