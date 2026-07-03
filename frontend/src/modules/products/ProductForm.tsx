import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Save, Loader2 } from 'lucide-react';

interface ProductFormProps {
  productId: number | null;
  onClose: () => void;
}

export const ProductForm = ({ productId, onClose }: ProductFormProps) => {
  const isEditing = !!productId;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Load product if editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['producto', productId],
    queryFn: async () => {
      const res = await api.get(`/productos/${productId}`);
      return res.data.data;
    },
    enabled: isEditing
  });

  // Load brands for the select
  const { data: brands = [] } = useQuery({
    queryKey: ['marcas'],
    queryFn: async () => {
      const res = await api.get('/marcas');
      return res.data.data;
    }
  });

  // Load categories for the select
  const { data: categories = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: async () => {
      const res = await api.get('/categorias');
      return res.data.data;
    }
  });

  useEffect(() => {
    if (product) {
      const productWithCategorias = {
        ...product,
        categorias: product.categorias?.map((c: any) => c.Id) || []
      };
      reset(productWithCategorias);
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) return api.put(`/productos/${productId}`, data);
      return api.post('/productos', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      onClose();
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-full">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full p-2 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoadingProduct ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <form id="productForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input {...register('Nombre', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código</label>
                  <input {...register('Codigo')} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea {...register('Descripcion')} className="input-field" rows={3}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                  <select {...register('IdMarca', { required: true })} className="input-field bg-white">
                    <option value="">Seleccione una marca...</option>
                    {brands.map((b: any) => (
                      <option key={b.Id} value={b.Id}>{b.Nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
                  <select multiple {...register('categorias')} className="input-field bg-white" style={{ minHeight: '80px' }}>
                    {categories.map((c: any) => (
                      <option key={c.Id} value={c.Id}>{c.Nombre}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Mantén presionado Ctrl (Windows) o Cmd (Mac) para seleccionar varias.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Mínimo</label>
                  <input type="number" step="0.01" {...register('StockMinimo')} className="input-field" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Compra *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                    <input type="number" step="0.01" {...register('PrecioCompra', { required: true })} className="input-field pl-8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio Venta *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                    <input type="number" step="0.01" {...register('PrecioVenta', { required: true })} className="input-field pl-8" />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
          <button type="submit" form="productForm" disabled={mutation.isPending} className="btn-primary flex items-center">
            {mutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
