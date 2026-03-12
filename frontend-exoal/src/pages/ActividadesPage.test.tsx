import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActividadesPage from './ActividadesPage';
import { actividadService, sedeService, usuarioService } from '../services/api';

jest.mock('../services/api');

const mockedActividadService = actividadService as jest.Mocked<typeof actividadService>;
const mockedSedeService = sedeService as jest.Mocked<typeof sedeService>;
const mockedUsuarioService = usuarioService as jest.Mocked<typeof usuarioService>;

beforeEach(() => {
  mockedActividadService.getAll.mockResolvedValue({ data: [] } as any);
  mockedSedeService.getAll.mockResolvedValue({ data: [] } as any);
  mockedUsuarioService.getAll.mockResolvedValue({ data: [] } as any);
});

test('renders ActividadesPage without crashing', async () => {
  render(<ActividadesPage />);
  expect(await screen.findByText('Gestión de Actividades')).toBeInTheDocument();
});

test('shows loading state initially', () => {
  mockedActividadService.getAll.mockReturnValue(new Promise(() => {}));
  mockedSedeService.getAll.mockReturnValue(new Promise(() => {}));
  mockedUsuarioService.getAll.mockReturnValue(new Promise(() => {}));
  render(<ActividadesPage />);
  expect(screen.getByText('Cargando actividades...')).toBeInTheDocument();
});

test('shows Nueva Actividad button', async () => {
  render(<ActividadesPage />);
  expect(await screen.findByText('Nueva Actividad')).toBeInTheDocument();
});

test('shows empty state message when no activities', async () => {
  render(<ActividadesPage />);
  expect(await screen.findByText('No hay actividades registradas')).toBeInTheDocument();
});
