import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SedesPage from './pages/SedesPage';
import UsuariosPage from './pages/UsuariosPage';
import ActividadesPage from './pages/ActividadesPage';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeClass = (role: string) =>
    role === 'administrador'
      ? 'bg-yellow-300 text-yellow-900'
      : 'bg-blue-100 text-blue-900';

  return (
    <div className="min-h-screen bg-slate-50">
      {user && (
        <nav className="bg-blue-900 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-yellow-400 rounded-full" />
                <Link to="/" className="text-lg font-bold tracking-wide">
                  EXOAL
                </Link>
                <span className="text-blue-300 text-sm font-normal hidden md:inline">
                  Sistema de Actividades Académicas
                </span>
              </div>
              <div className="flex space-x-1 items-center">
                <Link to="/sedes" className="hover:bg-blue-800 px-3 py-2 rounded text-sm font-medium">
                  Sedes
                </Link>
                {isAdmin() && (
                  <Link to="/usuarios" className="hover:bg-blue-800 px-3 py-2 rounded text-sm font-medium">
                    Usuarios
                  </Link>
                )}
                <Link to="/actividades" className="hover:bg-blue-800 px-3 py-2 rounded text-sm font-medium">
                  Actividades
                </Link>
                <span className="border-l border-blue-700 pl-4 ml-2 flex items-center gap-2 text-sm">
                  {user.nombre}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 border border-blue-600 hover:bg-blue-800 px-3 py-1.5 rounded text-sm transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto py-6 px-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/sedes" element={<PrivateRoute><SedesPage /></PrivateRoute>} />
          <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />
          <Route path="/actividades" element={<PrivateRoute><ActividadesPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
  const { user, isAdmin } = useAuth();
  return (
    <div className="text-center">
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-blue-900 mb-1">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-gray-500">
          <span className="capitalize font-medium text-blue-700">{user?.role}</span>
          {' — '}{isAdmin()
            ? 'Acceso completo: puede crear, editar y eliminar registros.'
            : 'Acceso de solo lectura. Puede consultar sedes, usuarios y actividades.'}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-800">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">Sedes</h2>
          <p className="text-gray-500 text-sm">Administra las sedes académicas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-600">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">Usuarios</h2>
          <p className="text-gray-500 text-sm">Gestiona estudiantes, docentes y administradores</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-t-4 border-t-blue-700">
          <h2 className="text-lg font-semibold text-blue-900 mb-1">Actividades</h2>
          <p className="text-gray-500 text-sm">Organiza eventos y actividades académicas</p>
        </div>
      </div>
    </div>
  );
}

export default App;