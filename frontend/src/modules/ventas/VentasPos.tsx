import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, ShoppingCart, Plus, Minus, Trash2, CheckCircle, Loader2 } from 'lucide-react';

const API_ORIGIN = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');

export const VentasPos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [selectedTipoDocumentoId, setSelectedTipoDocumentoId] = useState<number | ''>('');
  const [selectedFormaPagoId, setSelectedFormaPagoId] = useState<number | ''>('');

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get('/productos');
      return res.data.data;
    }
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const res = await api.get('/clientes');
      return res.data.data;
    }
  });

  const { data: tiposDocumento = [] } = useQuery({
    queryKey: ['tipos-documento'],
    queryFn: async () => {
      const res = await api.get('/tipos-documento');
      return res.data.data;
    }
  });

  const { data: formasPago = [] } = useQuery({
    queryKey: ['formas-pago'],
    queryFn: async () => {
      const res = await api.get('/formas-pago');
      return res.data.data;
    }
  });

  const filteredProducts = products.filter((p: any) => 
    p.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.Codigo && p.Codigo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (product: any) => {
    const stockDisponible = Number(product.StockActual);
    setCart((prev) => {
      const existing = prev.find((item) => item.IdProducto === product.Id);
      if (existing) {
        if (existing.Cantidad + 1 > stockDisponible) {
          alert(`Stock insuficiente. Disponible: ${stockDisponible}`);
          return prev;
        }
        return prev.map((item) =>
          item.IdProducto === product.Id
            ? { ...item, Cantidad: item.Cantidad + 1, Total: (item.Cantidad + 1) * item.PrecioUnitario }
            : item
        );
      }
      if (stockDisponible < 1) {
        alert('Producto sin stock disponible');
        return prev;
      }
      return [...prev, {
        IdProducto: product.Id,
        Nombre: product.Nombre,
        PrecioUnitario: Number(product.PrecioVenta),
        Cantidad: 1,
        Total: Number(product.PrecioVenta)
      }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.IdProducto === productId) {
        const product = products.find((p: any) => p.Id === productId);
        const stockDisponible = product ? Number(product.StockActual) : Infinity;
        const newQty = Math.min(Math.max(1, item.Cantidad + delta), stockDisponible);
        return { ...item, Cantidad: newQty, Total: newQty * item.PrecioUnitario };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.IdProducto !== productId));
  };

  const { subtotal, igv, total } = useMemo(() => {
    const sum = cart.reduce((acc, item) => acc + item.Total, 0);
    const calculatedSubtotal = sum / 1.18;
    const calculatedIgv = sum - calculatedSubtotal;
    return {
      subtotal: calculatedSubtotal,
      igv: calculatedIgv,
      total: sum
    };
  }, [cart]);

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/ventas', data),
    onSuccess: () => {
      alert('¡Venta registrada con éxito!');
      setCart([]);
      setSelectedClientId('');
      setSelectedTipoDocumentoId('');
      setSelectedFormaPagoId('');
    },
    onError: (error: any) => {
      alert('Error al registrar venta: ' + (error.response?.data?.message || error.message));
    }
  });

  const handleCheckout = () => {
    if (!selectedClientId) {
      alert('Seleccione un cliente');
      return;
    }
    if (!selectedTipoDocumentoId) {
      alert('Seleccione el tipo de documento');
      return;
    }
    if (!selectedFormaPagoId) {
      alert('Seleccione la forma de pago');
      return;
    }
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    mutation.mutate({
      IdCliente: selectedClientId,
      IdTipoDocumento: selectedTipoDocumentoId,
      IdFormaPago: selectedFormaPagoId,
      Subtotal: subtotal,
      IGV: igv,
      Total: total,
      Detalles: cart
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Panel Izquierdo: Catálogo */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar productos por nombre o código..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((p: any) => (
                <div 
                  key={p.Id} 
                  onClick={() => addToCart(p)}
                  className="card p-4 cursor-pointer hover:border-primary-500 hover:shadow-md hover:ring-1 hover:ring-primary-500 transition-all group"
                >
                  <div className="aspect-square bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    {p.imagen ? (
                      <img src={`${API_ORIGIN}/uploads/productos/${p.imagen}`} alt={p.Nombre} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ShoppingCart className="h-8 w-8 text-gray-300 group-hover:text-primary-400 transition-colors" />
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.Nombre}</h4>
                  <p className={`text-xs mt-1 ${Number(p.StockActual) <= 0 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                    Stock: {p.StockActual}
                  </p>
                  <p className="text-lg font-bold text-primary-600 mt-2">S/ {Number(p.PrecioVenta).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Panel Derecho: Carrito de Compras */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-primary-600 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center text-lg">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Nueva Venta
          </h2>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
            {cart.length} items
          </span>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <select
              className="input-field bg-white"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(Number(e.target.value))}
            >
              <option value="">Seleccione un cliente...</option>
              {clients.map((c: any) => (
                <option key={c.Id} value={c.Id}>{c.Nombres} {c.Apellidos}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
              <select
                className="input-field bg-white"
                value={selectedTipoDocumentoId}
                onChange={(e) => setSelectedTipoDocumentoId(Number(e.target.value))}
              >
                <option value="">Seleccione...</option>
                {tiposDocumento.map((t: any) => (
                  <option key={t.Id} value={t.Id}>{t.Nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pago</label>
              <select
                className="input-field bg-white"
                value={selectedFormaPagoId}
                onChange={(e) => setSelectedFormaPagoId(Number(e.target.value))}
              >
                <option value="">Seleccione...</option>
                {formasPago.map((f: any) => (
                  <option key={f.Id} value={f.Id}>{f.Nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="h-12 w-12 mb-2 opacity-50" />
              <p>Agrega productos a la venta</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.IdProducto} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-gray-900">{item.Nombre}</h4>
                  <p className="text-xs text-primary-600 font-bold mt-1">S/ {item.PrecioUnitario.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button onClick={() => updateQuantity(item.IdProducto, -1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.Cantidad}</span>
                    <button onClick={() => updateQuantity(item.IdProducto, 1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(item.IdProducto)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>IGV (18%)</span>
              <span>S/ {igv.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedClientId || !selectedTipoDocumentoId || !selectedFormaPagoId || mutation.isPending}
            className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <Loader2 className="h-6 w-6 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-6 w-6 mr-2" />
            )}
            Procesar Pago
          </button>
        </div>
      </div>
    </div>
  );
};
