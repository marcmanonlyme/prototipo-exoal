import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsuariosPage from './UsuariosPage';
import { usuarioService, sedeService } from '../services/api';

jest.mock('../services/api');

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'admin@demo.edu', nombre: 'Admin Demo', role: 'administrador' },
    token: 'mock-token',
    isAdmin: () => true,
    logout: jest.fn(),
  }),
}));

const mockedUsuarioService = usuarioService as jest.Mocked<typeof usuarioService>;
const mockedSedeService = sedeService as jest.Mocked<typeof sedeService>;

beforeEach(() => {
  mockedUsuarioService.getAll.mockResolvedValue({ data: [] } as any);
  mockedSedeService.getAll.mockResolvedValue({ data: [] } as any);
});

test('renders UsuariosPage without crashing', async () => {
  render(<UsuariosPage />);
  expect(await screen.findByText('Gestión de Usuarios')).toBeInTheDocument();
});

test('shows loading state initially', () => {
  mockedUsuarioService.getAll.mockReturnValue(new Promise(() => {}));
  mockedSedeService.getAll.mockReturnValue(new Promise(() => {}));
  render(<UsuariosPage />);
  expect(screen.getByText('Cargando usuarios...')).toBeInTheDocument();
});

test('shows Nuevo Usuario button', async () => {
  render(<UsuariosPage />);
  expect(await screen.findByText('Nuevo Usuario')).toBeInTheDocument();
});

test('shows empty state message when no users', async () => {
  render(<UsuariosPage />);
  expect(await screen.findByText('No hay usuarios registrados')).toBeInTheDocument();
});
