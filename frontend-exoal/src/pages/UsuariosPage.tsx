import React, { useState, useEffect } from 'react';
import { usuarioService, sedeService } from '../services/api';
import { Usuario, Sede } from '../types';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const { isAdmin } = useAuth();

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUsuario(null);
  };

  const estadoBadgeClass = (estado: string) => {
    if (estado === 'activo') return 'bg-green-100 text-green-800';
    if (estado === 'inactivo') return 'bg-gray-100 text-gray-800';
    return 'bg-red-100 text-red-800';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usuariosRes, sedesRes] = await Promise.all([
        usuarioService.getAll(),
        sedeService.getAll(),
      ]);
      setUsuarios(usuariosRes.data);
      setSedes(sedesRes.data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const sedeId = Number(formData.get('sedeId'));
    const sede = sedes.find((s) => s.idSede === sedeId);
    if (!sede) {
      setError('Sede no válida');
      return;
    }

    const password = formData.get('password') as string;
    const base = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      tipoUsuario: formData.get('tipoUsuario') as string,
      estado: formData.get('estado') as string,
      sede,
    };
    const usuarioData = password ? { ...base, password } : base;

    try {
      if (editingUsuario) {
        await usuarioService.update(editingUsuario.idUsuario, {
          ...editingUsuario,
          ...usuarioData,
        });
      } else {
        await usuarioService.create(usuarioData);
      }
      await loadData();
      handleCloseForm();
    } catch (err) {
      setError('Error al guardar el usuario');
      console.error('Error saving usuario:', err);
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await usuarioService.delete(id);
        await loadData();
      } catch (err) {
        setError('Error al eliminar el usuario');
        console.error('Error deleting usuario:', err);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando usuarios..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        {isAdmin() && (
          <button
            onClick={() => {
              setEditingUsuario(null);
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : 'Nuevo Usuario'}
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  defaultValue={editingUsuario?.nombre || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  defaultValue={editingUsuario?.email || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña {editingUsuario && <span className="text-gray-400 font-normal">(dejar vacío para no cambiar)</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!editingUsuario}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario
                </label>
                <select
                  name="tipoUsuario"
                  required
                  defaultValue={editingUsuario?.tipoUsuario || 'estudiante'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="docente">Docente</option>
                  <option value="administrador">Administrador</option>
                  <option value="visitante">Visitante</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  required
                  defaultValue={editingUsuario?.estado || 'activo'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="bloqueado">Bloqueado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sede
                </label>
                <select
                  name="sedeId"
                  required
                  defaultValue={editingUsuario?.sede?.idSede || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar sede...</option>
                  {sedes.map((sede) => (
                    <option key={sede.idSede} value={sede.idSede}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingUsuario ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sede
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map((usuario) => (
              <tr key={usuario.idUsuario}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {usuario.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {usuario.tipoUsuario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoBadgeClass(usuario.estado)}`}
                  >
                    {usuario.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {usuario.sede?.nombre || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isAdmin() && (
                    <>
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.idUsuario)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {usuarios.length === 0 && (
          <div className="text-center py-8 text-gray-500">No hay usuarios registrados</div>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;