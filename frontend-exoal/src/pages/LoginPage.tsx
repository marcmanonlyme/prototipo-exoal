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
      navigate('/sedes');
    } catch {
      setError('Credenciales inválidas. Verifique su correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">EXOAL</h1>
        <p className="text-gray-500 mb-6 text-sm">Sistema de Gestión de Actividades Académicas</p>

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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="mt-6 p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700">Usuarios de demostración:</p>
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
            <span className="ml-2 bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-medium">
              docente — solo lectura
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
