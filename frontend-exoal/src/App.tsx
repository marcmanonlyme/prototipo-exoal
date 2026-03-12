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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleBadgeClass = (role: string) =>
    role === 'administrador'
      ? 'bg-yellow-200 text-yellow-800'
      : 'bg-blue-200 text-blue-800';

  return (
    <div className="min-h-screen bg-gray-100">
      {user && (
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold">
                  EXOAL - Sistema Académico
                </Link>
              </div>
              <div className="flex space-x-4 items-center">
                <Link to="/sedes" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Sedes
                </Link>
                <Link to="/usuarios" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Usuarios
                </Link>
                <Link to="/actividades" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Actividades
                </Link>
                <span className="border-l border-blue-400 pl-4 flex items-center gap-2 text-sm">
                  {user.nombre}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded text-sm"
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage() {
  const { user, isAdmin } = useAuth();
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Bienvenido al Sistema EXOAL
      </h1>
      <p className="text-xl text-gray-600 mb-1">
        {user?.nombre} — <span className="capitalize font-medium">{user?.role}</span>
      </p>
      <p className="text-gray-500 mb-8">
        {isAdmin()
          ? 'Acceso completo: puede crear, editar y eliminar registros.'
          : 'Acceso de solo lectura. Puede consultar sedes, usuarios y actividades.'}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-2">Sedes</h2>
          <p className="text-gray-600">Administra las sedes académicas</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-green-600 mb-2">Usuarios</h2>
          <p className="text-gray-600">Gestiona estudiantes, docentes y administradores</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">Actividades</h2>
          <p className="text-gray-600">Organiza eventos y actividades académicas</p>
        </div>
      </div>
    </div>
  );
}

export default App;