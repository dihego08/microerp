import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { Search, Plus, Minus, Trash2, CheckCircle, Loader2, ArrowRightLeft } from 'lucide-react';

export const NuevaCompra = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [observacion, setObservacion] = useState('');

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['productos'],
    queryFn: async () => {
      const res = await api.get('/productos');
      return res.data.data;
    }
  });

  const filteredProducts = products.filter((p: any) => 
    p.Nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.IdProducto === product.Id);
      if (existing) {
        return prev.map((item) => 
          item.IdProducto === product.Id 
            ? { ...item, Cantidad: item.Cantidad + 1, Total: (item.Cantidad + 1) * item.PrecioUnitario }
            : item
        );
      }
      return [...prev, {
        IdProducto: product.Id,
        Nombre: product.Nombre,
        PrecioUnitario: Number(product.PrecioCompra), // Precio de Compra
        Cantidad: 1,
        Total: Number(product.PrecioCompra)
      }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => prev.map(item => {
      if (item.IdProducto === productId) {
        const newQty = Math.max(1, item.Cantidad + delta);
        return { ...item, Cantidad: newQty, Total: newQty * item.PrecioUnitario };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.IdProducto !== productId));
  };

  const total = useMemo(() => cart.reduce((acc, item) => acc + item.Total, 0), [cart]);

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/compras', data),
    onSuccess: () => {
      alert('¡Compra (Abastecimiento) registrada con éxito!');
      setCart([]);
      setObservacion('');
    },
    onError: (error: any) => {
      alert('Error al registrar compra: ' + (error.response?.data?.message || error.message));
    }
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('El carrito de compras está vacío');
      return;
    }

    mutation.mutate({
      NumeroDocumento: 'COMP-' + Date.now(),
      Total: total,
      Observacion: observacion,
      Detalles: cart
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar productos para abastecer..." 
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
                  className="card p-4 cursor-pointer hover:border-blue-500 hover:shadow-md hover:ring-1 hover:ring-blue-500 transition-all group"
                >
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2">{p.Nombre}</h4>
                  <p className="text-gray-500 text-xs mt-1">Stock Actual: {p.StockMinimo} (Referencial)</p>
                  <p className="text-sm font-bold text-blue-600 mt-2">Costo: S/ {Number(p.PrecioCompra).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-900 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center text-lg">
            <ArrowRightLeft className="h-5 w-5 mr-2" />
            Ingreso de Mercadería
          </h2>
        </div>

        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">Observación (Opcional)</label>
          <input 
            type="text"
            className="input-field bg-white text-sm"
            placeholder="Factura de proveedor, guía..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
          {cart.map((item) => (
            <div key={item.IdProducto} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm text-gray-900 leading-tight">{item.Nombre}</h4>
                <button onClick={() => removeFromCart(item.IdProducto)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                  <button onClick={() => updateQuantity(item.IdProducto, -1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-l-lg transition-colors">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.Cantidad}</span>
                  <button onClick={() => updateQuantity(item.IdProducto, 1)} className="p-1 hover:bg-gray-200 text-gray-600 rounded-r-lg transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="font-bold text-gray-900">S/ {item.Total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex justify-between text-xl font-bold text-gray-900 mb-4">
            <span>Costo Total</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || mutation.isPending}
            className="w-full py-4 text-lg font-bold text-white bg-gray-900 hover:bg-black rounded-xl shadow-md transition-all flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? <Loader2 className="h-6 w-6 mr-2 animate-spin" /> : <CheckCircle className="h-6 w-6 mr-2" />}
            Confirmar Ingreso
          </button>
        </div>
      </div>
    </div>
  );
};
