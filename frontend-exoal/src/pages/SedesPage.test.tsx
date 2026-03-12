import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SedesPage from './SedesPage';
import { sedeService } from '../services/api';

jest.mock('../services/api');

const mockedSedeService = sedeService as jest.Mocked<typeof sedeService>;

beforeEach(() => {
  mockedSedeService.getAll.mockResolvedValue({ data: [] } as any);
});

test('renders SedesPage without crashing', async () => {
  render(<SedesPage />);
  expect(await screen.findByText('Gestión de Sedes')).toBeInTheDocument();
});

test('shows loading state initially', () => {
  mockedSedeService.getAll.mockReturnValue(new Promise(() => {}));
  render(<SedesPage />);
  expect(screen.getByText('Cargando sedes...')).toBeInTheDocument();
});

test('shows Nueva Sede button', async () => {
  render(<SedesPage />);
  expect(await screen.findByText('Nueva Sede')).toBeInTheDocument();
});
