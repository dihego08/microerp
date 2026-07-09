import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { ProductForm } from './ProductForm';

const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

export const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get('/productos');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/productos/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] })
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedId(null);
    setIsFormOpen(true);
  };

  const filteredProducts = products.filter((p: any) => 
    p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.Codigo && p.Codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.CodigoBarras && p.CodigoBarras.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="h-6 w-6 mr-2 text-primary-600" />
            Catálogo de Productos
          </h1>
          <p className="text-gray-500 mt-1">Administra tu inventario y precios</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o código..." 
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
                <th className="px-6 py-4">Imagen</th>
                <th className="px-6 py-4">Código</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Precio Venta</th>
                <th className="px-6 py-4">Stock Actual</th>
                <th className="px-6 py-4">Stock Mínimo</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">Cargando productos...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">No se encontraron productos.</td>
                </tr>
              ) : (
                filteredProducts.map((p: any) => (
                  <tr key={p.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {p.imagen ? (
                        <img src={`${API_ORIGIN}/uploads/productos/${p.imagen}`} alt={p.Nombre} className="h-10 w-10 rounded-md object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{p.Codigo || '-'}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{p.Nombre}</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">S/ {Number(p.PrecioVenta).toFixed(2)}</td>
                    <td className={`px-6 py-4 font-semibold ${Number(p.StockActual) <= Number(p.StockMinimo) ? 'text-red-500' : 'text-gray-700'}`}>
                      {p.StockActual}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.StockMinimo}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(p.Id)} className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit2 className="h-5 w-5 inline" />
                      </button>
                      <button onClick={() => handleDelete(p.Id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-5 w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm 
          productId={selectedId} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};
