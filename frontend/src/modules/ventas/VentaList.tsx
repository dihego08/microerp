import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, ShoppingCart } from 'lucide-react';

export const VentaList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: ventas = [], isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: async () => {
      const res = await api.get('/ventas');
      return res.data.data || [];
    }
  });

  const filteredVentas = ventas.filter((v: any) => 
    (v.NumeroVenta && v.NumeroVenta.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-primary-600" />
            Lista de Ventas
          </h1>
          <p className="text-gray-500 mt-1">Historial de ventas realizadas</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por número de venta..." 
              className="input-field pl-10 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Nº Venta</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">Cargando ventas...</td>
                </tr>
              ) : filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">No se encontraron ventas.</td>
                </tr>
              ) : (
                filteredVentas.map((v: any) => (
                  <tr key={v.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-semibold">{v.NumeroVenta || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {v.Fecha ? new Date(v.Fecha).toLocaleString('es-PE') : '-'}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">S/ {Number(v.Total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${v.Estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {v.Estado === 1 ? 'Completada' : 'Anulada'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
