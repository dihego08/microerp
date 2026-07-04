import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Save } from 'lucide-react';

interface UsuarioFormProps {
  usuarioId: number | null;
  onClose: () => void;
}

export const UsuarioForm = ({ usuarioId, onClose }: UsuarioFormProps) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    Nombres: '',
    Apellidos: '',
    Correo: '',
    Celular: '',
    Usuario: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuarioId) {
      setLoading(true);
      api.get(`/usuarios/${usuarioId}`).then((res) => {
        const data = res.data.data;
        setFormData({
          Nombres: data.Nombres || '',
          Apellidos: data.Apellidos || '',
          Correo: data.Correo || '',
          Celular: data.Celular || '',
          Usuario: data.Usuario || '',
          password: '',
        });
      }).catch(() => {
        setError('Error al cargar el usuario');
      }).finally(() => setLoading(false));
    }
  }, [usuarioId]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload: any = { ...data };
      if (!payload.password) {
        delete payload.password;
      }
      
      if (usuarioId) {
        return api.put(`/usuarios/${usuarioId}`, payload);
      } else {
        return api.post('/usuarios', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Ocurrió un error al guardar');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioId && !formData.password) {
      setError('La contraseña es obligatoria para nuevos usuarios');
      return;
    }
    setError('');
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">
            {usuarioId ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nombres *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.Nombres}
                onChange={(e) => setFormData({ ...formData, Nombres: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Apellidos *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.Apellidos}
                onChange={(e) => setFormData({ ...formData, Apellidos: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Correo *</label>
              <input
                type="email"
                required
                className="input-field"
                value={formData.Correo}
                onChange={(e) => setFormData({ ...formData, Correo: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Celular</label>
              <input
                type="text"
                className="input-field"
                value={formData.Celular}
                onChange={(e) => setFormData({ ...formData, Celular: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Usuario (Login) *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.Usuario}
                onChange={(e) => setFormData({ ...formData, Usuario: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Contraseña {usuarioId ? '(Opcional)' : '*'}
              </label>
              <input
                type="password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={usuarioId ? 'Dejar en blanco para no cambiar' : ''}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending || loading}
              className="btn-primary px-6"
            >
              {saveMutation.isPending ? 'Guardando...' : (
                <>
                  <Save className="h-5 w-5 mr-2 inline" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
