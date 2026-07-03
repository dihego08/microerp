import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Save, Loader2 } from 'lucide-react';

export const CategoriaForm = ({ itemId, onClose }: { itemId: number | null, onClose: () => void }) => {
  const isEditing = !!itemId;
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const { data: item, isLoading } = useQuery({
    queryKey: ['categorias', itemId],
    queryFn: async () => {
      const res = await api.get(`/categorias/${itemId}`);
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
      
      if (isEditing) return api.put(`/categorias/${itemId}`, data);
      
      // defaults
      
      return api.post('/categorias', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar' : 'Nuevo'} Categoria
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input type="text" {...register('Nombre', { required: true })} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea {...register('Descripcion', { required: false })} className="input-field" rows={3}></textarea>
                </div>
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
