import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SedesPage from './pages/SedesPage';
import UsuariosPage from './pages/UsuariosPage';
import ActividadesPage from './pages/ActividadesPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
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
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sedes" element={<SedesPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/actividades" element={<ActividadesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Bienvenido al Sistema EXOAL
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Gestión académica integral para instituciones educativas
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