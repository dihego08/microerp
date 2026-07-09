import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';

interface ProductFormProps {
  productId: number | null;
  onClose: () => void;
}

const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

export const ProductForm = ({ productId, onClose }: ProductFormProps) => {
  const isEditing = !!productId;
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const selectedCategorias: number[] = watch('categorias') || [];
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { onChange: onImagenChange, ...imagenRegister } = register('imagen');

  const toggleCategoria = (id: number) => {
    const next = selectedCategorias.includes(id)
      ? selectedCategorias.filter((c) => c !== id)
      : [...selectedCategorias, id];
    setValue('categorias', next);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onImagenChange(e);
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

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
      if (product.imagen) {
        setPreviewUrl(`${API_ORIGIN}/uploads/productos/${product.imagen}`);
      }
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      if (isEditing) {
        formData.append('_method', 'PUT');
        return api.post(`/productos/${productId}`, formData, config);
      }
      return api.post('/productos', formData, config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      onClose();
    }
  });

  const onSubmit = (data: any) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'imagen') {
        const file = (value as FileList)?.[0];
        if (file) formData.append('imagen', file);
        return;
      }
      if (key === 'categorias') {
        ((value as number[]) || []).forEach((catId) => formData.append('categorias[]', String(catId)));
        return;
      }
      formData.append(key, (value as string) ?? '');
    });
    mutation.mutate(formData);
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                  <input {...register('CodigoBarras')} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea {...register('Descripcion')} className="input-field" rows={3}></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-gray-300" />
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Upload className="h-4 w-4" />
                      Seleccionar imagen
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        {...imagenRegister}
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG o WEBP. Máximo 2 MB.</p>
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
                  <div className="border border-gray-300 rounded-lg bg-white p-2 max-h-40 overflow-y-auto grid grid-cols-2 gap-1">
                    {categories.map((c: any) => {
                      const checked = selectedCategorias.includes(c.Id);
                      return (
                        <label
                          key={c.Id}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                            checked ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategoria(c.Id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          {c.Nombre}
                        </label>
                      );
                    })}
                  </div>
                  {selectedCategorias.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedCategorias.map((id) => {
                        const cat = categories.find((c: any) => c.Id === id);
                        if (!cat) return null;
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1 bg-primary-100 text-primary-700 text-xs font-medium pl-2 pr-1 py-1 rounded-full"
                          >
                            {cat.Nombre}
                            <button
                              type="button"
                              onClick={() => toggleCategoria(id)}
                              className="hover:text-primary-900 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Selecciona una o varias categorías.</p>
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
