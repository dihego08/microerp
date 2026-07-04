import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface VentaDetailModalProps {
  ventaId: number | null;
  onClose: () => void;
}

export const VentaDetailModal = ({ ventaId, onClose }: VentaDetailModalProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ventaId) {
      setLoading(true);
      api.get(`/ventas/${ventaId}`).then(res => {
        setData(res.data.data);
      }).finally(() => setLoading(false));
    }
  }, [ventaId]);

  if (!ventaId) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Detalle de Venta</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary-500" /></div>
          ) : data ? (
             <div className="space-y-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Nº Venta</p>
                   <p className="font-bold text-gray-900">{data.NumeroVenta}</p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Fecha</p>
                   <p className="font-semibold text-gray-900">
                     {data.Fecha ? new Date(data.Fecha).toLocaleString('es-PE') : '-'}
                   </p>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Estado</p>
                   <span className={`inline-flex mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${data.Estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                     {data.Estado === 1 ? 'Completada' : 'Anulada'}
                   </span>
                 </div>
                 <div>
                   <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                   <p className="font-bold text-primary-600 text-lg">S/ {Number(data.Total).toFixed(2)}</p>
                 </div>
               </div>
               
               <div>
                 <h3 className="text-lg font-bold mb-4 text-gray-800">Productos</h3>
                 <div className="border border-gray-100 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50 text-gray-600">
                       <tr>
                         <th className="px-4 py-3 font-semibold">Producto</th>
                         <th className="px-4 py-3 font-semibold text-center">Cant.</th>
                         <th className="px-4 py-3 font-semibold text-right">P. Unit</th>
                         <th className="px-4 py-3 font-semibold text-right">Subtotal</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {data.detalles?.map((d: any) => (
                         <tr key={d.Id} className="hover:bg-gray-50/50">
                           <td className="px-4 py-3 font-medium text-gray-900">{d.producto?.Nombre || '-'}</td>
                           <td className="px-4 py-3 text-center text-gray-600">{d.Cantidad}</td>
                           <td className="px-4 py-3 text-right text-gray-600">S/ {Number(d.PrecioUnitario).toFixed(2)}</td>
                           <td className="px-4 py-3 text-right font-semibold text-gray-900">S/ {Number(d.Total).toFixed(2)}</td>
                         </tr>
                       ))}
                     </tbody>
                     <tfoot className="bg-gray-50/50">
                       <tr>
                         <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-600">Subtotal:</td>
                         <td className="px-4 py-3 text-right font-bold text-gray-900">S/ {Number(data.Subtotal || 0).toFixed(2)}</td>
                       </tr>
                       <tr>
                         <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-600">IGV (18%):</td>
                         <td className="px-4 py-3 text-right font-bold text-gray-900">S/ {Number(data.IGV || 0).toFixed(2)}</td>
                       </tr>
                       <tr>
                         <td colSpan={3} className="px-4 py-3 text-right font-bold text-gray-900 text-base">Total:</td>
                         <td className="px-4 py-3 text-right font-bold text-primary-600 text-base">S/ {Number(data.Total || 0).toFixed(2)}</td>
                       </tr>
                     </tfoot>
                   </table>
                 </div>
               </div>
             </div>
          ) : (
            <p className="text-center py-10 text-gray-500">No se encontró la información.</p>
          )}
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
