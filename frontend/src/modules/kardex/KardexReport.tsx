import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { ClipboardList, Filter } from 'lucide-react';

export const KardexReport = () => {
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');

  const { data: products = [] } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get('/productos');
      return res.data.data;
    }
  });

  const { data: kardex = [], isLoading } = useQuery({
    queryKey: ['kardex', selectedProductId],
    queryFn: async () => {
      const url = selectedProductId ? `/kardex?producto_id=${selectedProductId}` : '/kardex';
      const res = await api.get(url);
      return res.data.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="h-6 w-6 mr-2 text-indigo-600" />
            Kardex de Inventario
          </h1>
          <p className="text-gray-500 mt-1">Historial de movimientos, entradas y salidas</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center bg-gray-50/50">
          <div className="flex items-center text-gray-600 font-medium">
            <Filter className="h-5 w-5 mr-2" /> Filtrar por:
          </div>
          <select 
            className="input-field bg-white max-w-md"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value ? Number(e.target.value) : '')}
          >
            <option value="">Todos los productos</option>
            {products.map((p: any) => (
              <option key={p.Id} value={p.Id}>{p.Codigo} - {p.Nombre}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Movimiento</th>
                <th className="px-6 py-4">Cantidad</th>
                <th className="px-6 py-4">Costo Unit.</th>
                <th className="px-6 py-4">Stock Resultante</th>
                <th className="px-6 py-4">Referencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">Cargando movimientos...</td>
                </tr>
              ) : kardex.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">No hay movimientos registrados.</td>
                </tr>
              ) : (
                kardex.map((k: any) => (
                  <tr key={k.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{new Date(k.Fecha).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {products.find((p: any) => p.Id === k.IdProducto)?.Nombre || 'Desconocido'}
                    </td>
                    <td className="px-6 py-4">
                      {k.IdTipoMovimiento === 1 ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">ENTRADA</span>
                      ) : k.IdTipoMovimiento === 2 ? (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold">SALIDA</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-bold">AJUSTE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold">{k.Cantidad}</td>
                    <td className="px-6 py-4 text-gray-600">S/ {Number(k.CostoUnitario).toFixed(2)}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{k.StockActual}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{k.Referencia}</td>
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
