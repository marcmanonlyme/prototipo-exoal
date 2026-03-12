import axios from 'axios';
import { Sede, Usuario, Actividad } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const sedeService = {
  getAll: () => api.get<Sede[]>('/sedes'),
  getById: (id: number) => api.get<Sede>(`/sedes/${id}`),
  create: (sede: Omit<Sede, 'idSede'>) => api.post<Sede>('/sedes', sede),
  update: (id: number, sede: Sede) => api.put<Sede>(`/sedes/${id}`, sede),
  delete: (id: number) => api.delete(`/sedes/${id}`),
};

export const usuarioService = {
  getAll: () => api.get<Usuario[]>('/usuarios'),
  getById: (id: number) => api.get<Usuario>(`/usuarios/${id}`),
  create: (usuario: Omit<Usuario, 'idUsuario'>) => api.post<Usuario>('/usuarios', usuario),
  update: (id: number, usuario: Usuario) => api.put<Usuario>(`/usuarios/${id}`, usuario),
  delete: (id: number) => api.delete(`/usuarios/${id}`),
};

export const actividadService = {
  getAll: () => api.get<Actividad[]>('/actividades'),
  getById: (id: number) => api.get<Actividad>(`/actividades/${id}`),
  create: (actividad: Omit<Actividad, 'idActividad'>) => api.post<Actividad>('/actividades', actividad),
  update: (id: number, actividad: Actividad) => api.put<Actividad>(`/actividades/${id}`, actividad),
  delete: (id: number) => api.delete(`/actividades/${id}`),
};