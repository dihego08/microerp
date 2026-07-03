const fs = require('fs');
const path = require('path');

const entities = [
  { name: 'Cliente', plural: 'Clientes', icon: 'Users', endpoint: 'clientes', fields: [
    { name: 'Nombres', label: 'Nombres', type: 'text', required: true },
    { name: 'Apellidos', label: 'Apellidos', type: 'text', required: true },
    { name: 'IdTipoDocumento', label: 'Tipo Documento', type: 'number', required: true, default: 1 },
    { name: 'NumeroDocumento', label: 'N° Documento', type: 'text', required: true },
    { name: 'Direccion', label: 'Dirección', type: 'text', required: false },
    { name: 'Celular', label: 'Celular', type: 'text', required: false }
  ]},
  { name: 'Categoria', plural: 'Categorias', icon: 'Tags', endpoint: 'categorias', fields: [
    { name: 'Nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'Descripcion', label: 'Descripción', type: 'textarea', required: false }
  ]},
  { name: 'Marca', plural: 'Marcas', icon: 'Tags', endpoint: 'marcas', fields: [
    { name: 'Nombre', label: 'Nombre', type: 'text', required: true }
  ]}
];

entities.forEach(entity => {
  const dir = path.join(__dirname, 'frontend/src/modules', entity.endpoint);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // --- List Component ---
  const listCode = `import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { Plus, Search, Edit2, Trash2, ${entity.icon} } from 'lucide-react';
import { ${entity.name}Form } from './${entity.name}Form';

export const ${entity.name}List = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['${entity.endpoint}'],
    queryFn: async () => {
      const res = await api.get('/${entity.endpoint}');
      return res.data.data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(\`/${entity.endpoint}/\${id}\`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['${entity.endpoint}'] })
  });

  const handleDelete = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
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

  const filteredItems = items.filter((p: any) => {
    const term = searchTerm.toLowerCase();
    return ${entity.name === 'Cliente' ? 'p.Nombres.toLowerCase().includes(term) || p.Apellidos.toLowerCase().includes(term) || p.NumeroDocumento?.includes(term)' : 'p.Nombre.toLowerCase().includes(term)'};
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <${entity.icon} className="h-6 w-6 mr-2 text-primary-600" />
            Catálogo de ${entity.plural}
          </h1>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center">
          <Plus className="h-5 w-5 mr-1" />
          Nuevo
        </button>
      </div>

      <div className="card">
        <div className="p-4 border-b border-gray-100 flex items-center bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
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
                ${entity.name === 'Cliente' 
                  ? '<th className="px-6 py-4">Documento</th><th className="px-6 py-4">Nombres</th><th className="px-6 py-4">Apellidos</th>'
                  : '<th className="px-6 py-4">Nombre</th>'
                }
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">Cargando...</td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">No se encontraron registros.</td>
                </tr>
              ) : (
                filteredItems.map((p: any) => (
                  <tr key={p.Id} className="hover:bg-gray-50 transition-colors">
                    ${entity.name === 'Cliente' 
                      ? '<td className="px-6 py-4">{p.NumeroDocumento}</td><td className="px-6 py-4">{p.Nombres}</td><td className="px-6 py-4">{p.Apellidos}</td>'
                      : '<td className="px-6 py-4 font-semibold text-gray-900">{p.Nombre}</td>'
                    }
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
        <${entity.name}Form 
          itemId={selectedId} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};
`;
  fs.writeFileSync(path.join(dir, `${entity.name}List.tsx`), listCode);

  // --- Form Component ---
  let formInputs = entity.fields.map(f => {
    if (f.type === 'textarea') {
      return `
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">${f.label}${f.required ? ' *' : ''}</label>
                  <textarea {...register('${f.name}', { required: ${f.required} })} className="input-field" rows={3}></textarea>
                </div>`;
    }
    return `
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">${f.label}${f.required ? ' *' : ''}</label>
                  <input type="${f.type === 'number' ? 'number' : 'text'}" {...register('${f.name}', { required: ${f.required} })} className="input-field" />
                </div>`;
  }).join('');

  const formCode = `import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Save, Loader2 } from 'lucide-react';

export const ${entity.name}Form = ({ itemId, onClose }: { itemId: number | null, onClose: () => void }) => {
  const isEditing = !!itemId;
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: item, isLoading } = useQuery({
    queryKey: ['${entity.endpoint}', itemId],
    queryFn: async () => {
      const res = await api.get(\`/${entity.endpoint}/\${itemId}\`);
      return res.data.data;
    },
    enabled: isEditing
  });

  useEffect(() => {
    if (item) reset(item);
  }, [item, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // parse numbers
      ${entity.fields.filter(f => f.type === 'number').map(f => `if(data.${f.name}) data.${f.name} = Number(data.${f.name});`).join('\n      ')}
      if (isEditing) return api.put(\`/${entity.endpoint}/\${itemId}\`, data);
      
      // defaults
      ${entity.fields.filter(f => f.default).map(f => `data.${f.name} = data.${f.name} || ${f.default};`).join('\n      ')}
      return api.post('/${entity.endpoint}', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${entity.endpoint}'] });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar' : 'Nuevo'} ${entity.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <form id="crudForm" onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${formInputs}
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" form="crudForm" disabled={mutation.isPending} className="btn-primary flex items-center">
            {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
`;
  fs.writeFileSync(path.join(dir, `${entity.name}Form.tsx`), formCode);
});

console.log('CRUDs generados.');
