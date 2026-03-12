export interface AuthUser {
  email: string;
  nombre: string;
  role: string;
}

export interface Sede {
  idSede: number;
  nombre: string;
  tipo: string;
  direccion?: string;
  telefono?: string;
  correoContacto?: string;
}

export interface Usuario {
  idUsuario: number;
  nombre: string;
  email: string;
  password?: string;
  tipoUsuario: string;
  estado: string;
  fechaRegistro?: string;
  sede: Sede;
}

export interface Actividad {
  idActividad: number;
  titulo: string;
  descripcion?: string;
  tipo: string;
  fechaInicio: string;
  horaInicio: string;
  horaFin: string;
  ubicacion?: string;
  capacidad?: number;
  asistentesRegistrados?: number;
  estado: string;
  sede: Sede;
  responsable: Usuario;
  fechaCreacion?: string;
}