import React, { useState } from 'react';
import { CheckCircle2, ShoppingCart, Plus, Trash2, FileText } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';
import { money } from '../lib/utils';

export function PurchaseOrders({ purchases, onReceive, onCreateOrder }) {
  const [viewDoc, setViewDoc] = useState(null);
  
  // Create Order state
  const [header, setHeader] = useState({ supplierId: purchases.suppliers[0]?.id || '', promisedDate: new Date().toISOString().split('T')[0] });
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: '', quantity: 1, unitCost: 0 });

  function addItem() {
    if (!currentItem.productId) return;
    const existingIndex = items.findIndex(i => i.productId === currentItem.productId);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += Number(currentItem.quantity);
      setItems(newItems);
    } else {
      setItems([...items, { 
        productId: currentItem.productId, 
        quantity: Number(currentItem.quantity),
        unitCost: Number(currentItem.unitCost)
      }]);
    }
    setCurrentItem({ productId: '', quantity: 1, unitCost: 0 });
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (items.length === 0) return alert('Debes agregar al menos un producto a la orden de compra.');
    onCreateOrder(header.supplierId, header.promisedDate, items);
    setItems([]);
  }

  const cartTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Nuevo Carrito de Compras */}
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={FileText} title="Emitir Nueva Orden de Compra" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Proveedor</label>
            <select className="form-input" value={header.supplierId} onChange={(e) => setHeader({ ...header, supplierId: Number(e.target.value) })}>
              {purchases.suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Fecha Esperada de Entrega</label>
            <input className="form-input" type="date" value={header.promisedDate} onChange={(e) => setHeader({ ...header, promisedDate: e.target.value })} />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
          <label className="block text-xs font-semibold text-textLight uppercase mb-2">Agregar Productos</label>
          <div className="flex gap-3 items-center">
            <input className="form-input w-auto flex-1" type="number" placeholder="ID Producto (ej. 1)" value={currentItem.productId} onChange={(e) => setCurrentItem({ ...currentItem, productId: Number(e.target.value) })} />
            <input className="form-input w-24" type="number" min="1" placeholder="Cant." value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} />
            <input className="form-input w-32" type="number" step="0.01" min="0" placeholder="Costo Unit." value={currentItem.unitCost} onChange={(e) => setCurrentItem({ ...currentItem, unitCost: Number(e.target.value) })} />
            <button className="btn-secondary flex items-center gap-2" onClick={addItem}><Plus size={16} /> Agregar Fila</button>
          </div>
        </div>

        {items.length > 0 && (
          <table className="w-full text-left text-sm border-collapse mb-6 bg-white border border-borderC rounded-lg overflow-hidden">
            <thead className="bg-slate-50"><tr><th className="p-3 text-textLight font-medium border-b border-borderC">ID Producto</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Cantidad</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Costo Unit.</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Subtotal</th><th className="p-3 text-textLight font-medium border-b border-borderC w-10"></th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-borderC/50 last:border-0">
                  <td className="p-3 font-medium text-textMain">Prod ID: {item.productId}</td>
                  <td className="p-3 text-right font-bold">{item.quantity}</td>
                  <td className="p-3 text-right">{money.format(item.unitCost)}</td>
                  <td className="p-3 text-right font-semibold text-brand">{money.format(item.quantity * item.unitCost)}</td>
                  <td className="p-3 text-center"><button className="icon-btn danger" onClick={() => removeItem(index)}><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center border-t border-borderC pt-4 mt-2">
          <div className="text-xl font-bold text-accent">Total OC: {money.format(cartTotal)}</div>
          <button className="px-6 py-2 bg-brand hover:bg-blue-900 text-white rounded-lg font-bold transition" onClick={handleSave}>
            Emitir Orden
          </button>
        </div>
      </section>

      {/* Historial de Órdenes */}
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={ShoppingCart} title="Ordenes de compra emitidas" />
        <table className="w-full text-left text-sm border-collapse mt-2">
          <thead><tr><th className="pb-3 text-textLight font-medium border-b border-borderC">OC</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Proveedor</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Estado</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Prometida</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Total</th><th className="pb-3 text-textLight font-medium border-b border-borderC"></th></tr></thead>
          <tbody>
            {purchases.purchaseOrders.map((order) => <tr key={order.id} className="hover:bg-slate-50 transition-colors"><td className="py-3 border-b border-borderC/50 font-medium">{order.code}</td><td className="py-3 border-b border-borderC/50">{order.supplier}</td><td className="py-3 border-b border-borderC/50"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-wider">{order.status}</span></td><td className="py-3 border-b border-borderC/50">{order.promisedDate}</td><td className="py-3 border-b border-borderC/50 font-semibold text-right">{money.format(order.total)}</td><td className="py-3 border-b border-borderC/50 text-right"><div className="flex justify-end gap-2"><button className="btn-secondary py-1.5 px-3" onClick={() => setViewDoc(order)}>Ver Doc</button>{order.status !== 'Recibido' && <button className="btn-primary py-1.5 px-3" onClick={() => onReceive(order.id)}>Recibir</button>}</div></td></tr>)}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={CheckCircle2} title="Cumplimiento de entregas" />
        <table className="w-full text-left text-sm border-collapse mt-2">
          <thead><tr><th className="pb-3 text-textLight font-medium border-b border-borderC">OC</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Proveedor</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Prometida</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Real</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Dias tarde</th></tr></thead>
          <tbody>
            {purchases.compliance.map((row) => <tr key={row.code} className="hover:bg-slate-50 transition-colors"><td className="py-3 border-b border-borderC/50 font-medium">{row.code}</td><td className="py-3 border-b border-borderC/50">{row.supplier}</td><td className="py-3 border-b border-borderC/50">{row.promisedDate}</td><td className="py-3 border-b border-borderC/50">{row.receivedDate}</td><td className="py-3 border-b border-borderC/50">{row.daysLate ?? '-'}</td></tr>)}
          </tbody>
        </table>
      </section>

      {viewDoc && (
        <div className="fixed inset-0 bg-brand/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setViewDoc(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-brand text-white p-5 flex justify-between items-center">
              <h2 className="font-semibold text-lg">Orden de Compra {viewDoc.code}</h2>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm font-medium" onClick={() => setViewDoc(null)}>Cerrar</button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div><span className="text-textLight text-xs block uppercase">Proveedor</span><strong className="text-textMain">{viewDoc.supplier}</strong></div>
                <div className="text-right"><span className="text-textLight text-xs block uppercase">Fecha Prometida</span><strong className="text-textMain">{viewDoc.promisedDate}</strong></div>
              </div>
              <table className="w-full text-left text-sm border-collapse">
                <thead><tr><th className="pb-2 text-textLight border-b border-borderC">ID Prod</th><th className="pb-2 text-textLight border-b border-borderC text-right">Cantidad</th><th className="pb-2 text-textLight border-b border-borderC text-right">Costo Unitario</th><th className="pb-2 text-textLight border-b border-borderC text-right">Subtotal</th></tr></thead>
                <tbody>
                  {viewDoc.items.map((item, i) => (
                    <tr key={i} className="border-b border-borderC/30 last:border-0">
                      <td className="py-2">{item.productId}</td>
                      <td className="py-2 text-right">{item.quantity}</td>
                      <td className="py-2 text-right">{money.format(item.unitCost)}</td>
                      <td className="py-2 text-right font-medium">{money.format(item.quantity * item.unitCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 pt-4 border-t border-borderC flex justify-end text-xl font-bold text-brand">Total: {money.format(viewDoc.total)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
