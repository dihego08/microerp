import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, ArrowRightLeft, Eye } from 'lucide-react';
import { CompraDetailModal } from './CompraDetailModal';

export const CompraList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompraId, setSelectedCompraId] = useState<number | null>(null);

  const { data: compras = [], isLoading } = useQuery({
    queryKey: ['compras'],
    queryFn: async () => {
      const res = await api.get('/compras');
      return res.data.data || [];
    }
  });

  const filteredCompras = compras.filter((c: any) => 
    (c.NumeroDocumento && c.NumeroDocumento.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ArrowRightLeft className="h-6 w-6 mr-2 text-primary-600" />
            Lista de Compras
          </h1>
          <p className="text-gray-500 mt-1">Historial de compras registradas</p>
        </div>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por número de documento..." 
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
                <th className="px-6 py-4">Nº Documento</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Observación</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">Cargando compras...</td>
                </tr>
              ) : filteredCompras.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No se encontraron compras.</td>
                </tr>
              ) : (
                filteredCompras.map((c: any) => (
                  <tr key={c.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-semibold">{c.NumeroDocumento || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {c.Fecha ? new Date(c.Fecha).toLocaleString('es-PE') : '-'}
                    </td>
                    <td className="px-6 py-4 text-green-600 font-semibold">S/ {Number(c.Total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">{c.Observacion || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.Estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.Estado === 1 ? 'Completada' : 'Anulada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => setSelectedCompraId(c.Id)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Ver Detalle">
                        <Eye className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCompraId && (
        <CompraDetailModal 
          compraId={selectedCompraId} 
          onClose={() => setSelectedCompraId(null)} 
        />
      )}
    </div>
  );
};
