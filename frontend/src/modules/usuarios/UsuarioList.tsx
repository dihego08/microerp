import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import { UsuarioForm } from './UsuarioForm';

export const UsuarioList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await api.get('/usuarios');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/usuarios/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] })
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
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

  const filteredUsuarios = usuarios.filter((u: any) => 
    (u.Nombres && u.Nombres.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.Apellidos && u.Apellidos.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (u.Usuario && u.Usuario.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2 text-primary-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 mt-1">Administra los accesos al sistema</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Nuevo Usuario
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o usuario..." 
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
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Nombre Completo</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Celular</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">Cargando usuarios...</td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No se encontraron usuarios.</td>
                </tr>
              ) : (
                filteredUsuarios.map((u: any) => (
                  <tr key={u.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-semibold">{u.Usuario}</td>
                    <td className="px-6 py-4 text-gray-600">{`${u.Nombres || ''} ${u.Apellidos || ''}`}</td>
                    <td className="px-6 py-4 text-gray-600">{u.Correo || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{u.Celular || '-'}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => handleEdit(u.Id)} className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit2 className="h-5 w-5 inline" />
                      </button>
                      <button onClick={() => handleDelete(u.Id)} className="text-red-500 hover:text-red-700 transition-colors">
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
        <UsuarioForm 
          usuarioId={selectedId} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};
