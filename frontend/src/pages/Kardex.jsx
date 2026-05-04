import React, { useState } from 'react';
import { AlertTriangle, Boxes, Search, Plus, Trash2, FileText } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';

export function Kardex({ inventory, onMove }) {
  const [header, setHeader] = useState({ type: 'entrada', responsible: '', notes: '' });
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: inventory.products[0]?.id || '', quantity: 1 });

  function addItem() {
    if (!currentItem.productId) return;
    const product = inventory.products.find(p => p.id === Number(currentItem.productId));
    if (!product) return;
    
    // Check if already in list, if so add quantity
    const existingIndex = items.findIndex(i => i.productId === product.id);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += Number(currentItem.quantity);
      setItems(newItems);
    } else {
      setItems([...items, { productId: product.id, name: product.name, quantity: Number(currentItem.quantity) }]);
    }
    setCurrentItem({ ...currentItem, quantity: 1 });
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (items.length === 0) return alert('Debes agregar al menos un producto al documento.');
    onMove(header.type, header.responsible, header.notes, items);
    // Reset form after saving
    setItems([]);
    setHeader({ ...header, notes: '' });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={FileText} title="Nueva Guía de Almacén (Entrada / Salida)" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Tipo de Operación</label>
            <select className="form-input" value={header.type} onChange={(e) => setHeader({ ...header, type: e.target.value })}>
              <option value="entrada">Entrada a Almacén</option>
              <option value="salida">Salida / Despacho</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Responsable</label>
            <input className="form-input" placeholder="Nombre de quien autoriza..." value={header.responsible} onChange={(e) => setHeader({ ...header, responsible: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Motivo / Notas</label>
            <input className="form-input" placeholder="Referencia de OC o Factura..." value={header.notes} onChange={(e) => setHeader({ ...header, notes: e.target.value })} />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
          <label className="block text-xs font-semibold text-textLight uppercase mb-2">Agregar Productos al Detalle</label>
          <div className="flex gap-3 items-center">
            <select className="form-input w-auto flex-1" value={currentItem.productId} onChange={(e) => setCurrentItem({ ...currentItem, productId: Number(e.target.value) })}>
              {inventory.products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>)}
            </select>
            <input className="form-input w-24" type="number" min="1" value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} />
            <button className="btn-secondary flex items-center gap-2" onClick={addItem}><Plus size={16} /> Agregar Fila</button>
          </div>
        </div>

        {items.length > 0 && (
          <table className="w-full text-left text-sm border-collapse mb-6 bg-white border border-borderC rounded-lg overflow-hidden">
            <thead className="bg-slate-50"><tr><th className="p-3 text-textLight font-medium border-b border-borderC">Producto</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Cantidad</th><th className="p-3 text-textLight font-medium border-b border-borderC w-10"></th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-borderC/50 last:border-0">
                  <td className="p-3 font-medium text-textMain">{item.name}</td>
                  <td className="p-3 text-right font-bold">{item.quantity}</td>
                  <td className="p-3 text-center"><button className="icon-btn danger" onClick={() => removeItem(index)}><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-end">
          <button className={`px-6 py-2 rounded-lg font-bold text-white transition ${header.type === 'entrada' ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-500 hover:bg-orange-600'}`} onClick={handleSave}>
            Procesar {header.type === 'entrada' ? 'Ingreso' : 'Salida'} de {items.length} ítems
          </button>
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={Boxes} title="Historial de Movimientos (Kardex)" />
        <table className="w-full text-left text-sm border-collapse">
          <thead><tr><th className="pb-3 text-textLight font-medium border-b border-borderC">Fecha</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Documento</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Tipo</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Producto</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Cantidad</th></tr></thead>
          <tbody>
            {inventory.movements.map((movement) => {
              const product = inventory.products.find((item) => item.id === movement.productId);
              return <tr key={movement.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 border-b border-borderC/50 text-textMain">{movement.date}</td>
                <td className="py-3 border-b border-borderC/50 text-textMain font-mono text-xs">{movement.code}</td>
                <td className="py-3 border-b border-borderC/50 text-textMain"><span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${movement.type === 'entrada' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{movement.type}</span></td>
                <td className="py-3 border-b border-borderC/50 text-textMain">{product?.name}</td>
                <td className="py-3 border-b border-borderC/50 text-textMain text-right font-bold">{movement.quantity}</td>
              </tr>;
            })}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-xl border border-red-200 shadow-soft bg-red-50/30">
        <PanelTitle icon={AlertTriangle} title="Alertas de stock" />
        <div className="flex flex-col gap-3 mt-2">
          {inventory.lowStock.map((product) => (
            <div className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-lg shadow-sm" key={product.id}>
              <strong className="text-red-700">{product.name}</strong>
              <span className="text-sm text-red-600 font-medium">{product.stock} disponibles / minimo {product.minStock}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft">
        <PanelTitle icon={Search} title="Trazabilidad por lote" />
        <div className="flex flex-col mt-2">
          {inventory.traceability.map((row) => (
            <div className="py-3 border-b border-borderC/50 last:border-0" key={row.sku}>
              <div className="flex items-center justify-between mb-1">
                <strong className="text-textMain">{row.batch}</strong>
                <span className="text-sm text-textMain font-medium">{row.product}</span>
              </div>
              <small className="text-textLight text-xs block">{row.supplier} · Ubicacion {row.warehouseLocation}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
