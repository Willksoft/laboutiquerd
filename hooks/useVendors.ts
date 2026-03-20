import { useState } from 'react';
import { Vendor } from '../types';

const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Ana Sánchez', role: 'Vendedor' },
  { id: 'v2', name: 'María Gómez', role: 'Vendedor' },
  { id: 'v3', name: 'Laura Martinez', role: 'Gerente' },
  { id: 'v4', name: 'Carlos Díaz', role: 'Vendedor' },
  { id: 'v5', name: 'Elena Rodríguez', role: 'Vendedor' }
];

export const useVendors = () => {
    // Para simplificar, lo mantendremos en state, pero usualmente esto viene del backend
    const [vendors] = useState<Vendor[]>(MOCK_VENDORS);
    return { vendors };
};
