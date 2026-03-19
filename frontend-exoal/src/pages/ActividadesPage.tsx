import React, { useState, useEffect } from 'react';
import { actividadService, sedeService, ActividadFilter } from '../services/api';
import { Actividad, Sede } from '../types';
import ErrorBanner from '../components/ErrorBanner';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const ActividadesPage: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingActividad, setEditingActividad] = useState<Actividad | null>(null);
  const [filterSede, setFilterSede] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [filterDesde, setFilterDesde] = useState('');
  const [filterHasta, setFilterHasta] = useState('');
  const [filterTitulo, setFilterTitulo] = useState('');
  const [debouncedTitulo, setDebouncedTitulo] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isAdmin } = useAuth();

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActividad(null);
  };

  // Load sedes on mount
  useEffect(() => {
    sedeService.getAll()
      .then((res) => {
        setSedes(res.data);
      })
      .catch((err) => {
        setError('Error al cargar sedes');
        console.error('Error loading sedes:', err);
      });
  }, []);

  // Debounce the title input to avoid a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTitulo(filterTitulo), 500);
    return () => clearTimeout(timer);
  }, [filterTitulo]);

  // Reload actividades when any filter changes or after a mutation
  useEffect(() => {
    const params: ActividadFilter = {
      titulo: debouncedTitulo || undefined,
      tipo: filterTipo || undefined,
      sedeId: filterSede ? Number(filterSede) : undefined,
      desde: filterDesde || undefined,
      hasta: filterHasta || undefined,
      estado: filterEstado || undefined,
    };
    setLoading(true);
    actividadService
      .getAll(params)
      .then((res) => {
        setActividades(res.data);
        setError(null);
      })
      .catch((err) => {
        setError('Error al cargar las actividades');
        console.error('Error loading actividades:', err);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitulo, filterTipo, filterSede, filterDesde, filterHasta, filterEstado, refreshTrigger]);

  const clearFilters = () => {
    setFilterSede('');
    setFilterTipo('');
    setFilterEstado('');
    setFilterDesde('');
    setFilterHasta('');
    setFilterTitulo('');
    setDebouncedTitulo('');
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

    const capacidadStr = formData.get('capacidad') as string;
    const actividadData = {
      titulo: formData.get('titulo') as string,
      descripcion: (formData.get('descripcion') as string) || undefined,
      tipo: formData.get('tipo') as string,
      fechaInicio: formData.get('fechaInicio') as string,
      horaInicio: formData.get('horaInicio') as string,
      horaFin: formData.get('horaFin') as string,
      ubicacion: (formData.get('ubicacion') as string) || undefined,
      capacidad: capacidadStr ? Number(capacidadStr) : undefined,
      estado: formData.get('estado') as string,
      sede,
    };

    try {
      if (editingActividad) {
        await actividadService.update(editingActividad.idActividad, {
          ...editingActividad,
          ...actividadData,
        });
      } else {
        await actividadService.create(actividadData);
      }
      setRefreshTrigger((n) => n + 1);
      handleCloseForm();
    } catch (err) {
      setError('Error al guardar la actividad');
      console.error('Error saving actividad:', err);
    }
  };

  const handleEdit = (actividad: Actividad) => {
    setEditingActividad(actividad);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      try {
        await actividadService.delete(id);
        setRefreshTrigger((n) => n + 1);
      } catch (err) {
        setError('Error al eliminar la actividad');
        console.error('Error deleting actividad:', err);
      }
    }
  };

  const estadoBadgeClass = (estado: string) => {
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-800';
      case 'en_curso': return 'bg-yellow-100 text-yellow-800';
      case 'finalizada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Cargando actividades..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
        {isAdmin() && (
          <button
            onClick={() => {
              setEditingActividad(null);
              setShowForm(!showForm);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancelar' : 'Nueva Actividad'}
          </button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filterTitulo}
              onChange={(e) => setFilterTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Sede</label>
            <select
              value={filterSede}
              onChange={(e) => setFilterSede(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las sedes</option>
              {sedes.map((s) => (
                <option key={s.idSede} value={s.idSede}>{s.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los tipos</option>
              <option value="cultural">Cultural</option>
              <option value="academica">Académica</option>
              <option value="extraacademica">Extraacadémica</option>
              <option value="administrativa">Administrativa</option>
              <option value="economica">Económica</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="programada">Programada</option>
              <option value="en_curso">En curso</option>
              <option value="finalizada">Finalizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              value={filterDesde}
              onChange={(e) => setFilterDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              value={filterHasta}
              onChange={(e) => setFilterHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {actividades.length} resultado{actividades.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingActividad ? 'Editar Actividad' : 'Nueva Actividad'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  name="titulo"
                  required
                  defaultValue={editingActividad?.titulo || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={2}
                  defaultValue={editingActividad?.descripcion || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="tipo"
                  required
                  defaultValue={editingActividad?.tipo || 'academica'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cultural">Cultural</option>
                  <option value="academica">Académica</option>
                  <option value="extraacademica">Extraacadémica</option>
                  <option value="administrativa">Administrativa</option>
                  <option value="economica">Económica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  required
                  defaultValue={editingActividad?.estado || 'programada'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="programada">Programada</option>
                  <option value="en_curso">En curso</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  required
                  defaultValue={editingActividad?.fechaInicio || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  name="horaInicio"
                  required
                  defaultValue={editingActividad?.horaInicio || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin
                </label>
                <input
                  type="time"
                  name="horaFin"
                  required
                  defaultValue={editingActividad?.horaFin || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  name="ubicacion"
                  defaultValue={editingActividad?.ubicacion || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  min="1"
                  defaultValue={editingActividad?.capacidad ?? ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sede
                </label>
                <select
                  name="sedeId"
                  required
                  defaultValue={editingActividad?.sede?.idSede || ''}
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
                {editingActividad ? 'Actualizar' : 'Crear'}
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
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
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
            {actividades.map((actividad) => (
              <tr key={actividad.idActividad}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {actividad.titulo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {actividad.tipo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {actividad.fechaInicio}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {actividad.horaInicio} – {actividad.horaFin}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoBadgeClass(actividad.estado)}`}>
                    {actividad.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {actividad.sede?.nombre || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isAdmin() && (
                    <>
                      <button
                        onClick={() => handleEdit(actividad)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(actividad.idActividad)}
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
        {actividades.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            {filterTitulo || filterSede || filterTipo || filterDesde || filterHasta || filterEstado
              ? 'No se encontraron actividades con los filtros aplicados'
              : 'No hay actividades registradas'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActividadesPage;