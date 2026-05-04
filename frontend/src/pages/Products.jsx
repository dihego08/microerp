import React, { useState } from 'react';
import { Download, Pencil, Trash2 } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';
import { money, exportCsv } from '../lib/utils';

export function Products({ inventory, onCreateProduct, onUpdateProduct, onDeleteProduct }) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [prodForm, setProdForm] = useState({ sku: '', name: '', stock: 0, minStock: 0, unitCost: 0, salePrice: 0, supplierId: 1 });

  function openModal(prod = null) {
    if (prod) {
      setEditingId(prod.id);
      setProdForm({ ...prod });
    } else {
      setEditingId(null);
      setProdForm({ sku: '', name: '', stock: 0, minStock: 0, unitCost: 0, salePrice: 0, supplierId: 1 });
    }
    setShowModal(true);
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft">
        <PanelTitle 
          icon={Download} 
          title="Catálogo y Valorización" 
          action={
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => exportCsv('valorizacion.csv', inventory.valuation.rows)}>Exportar Excel</button>
              <button className="btn-primary" onClick={() => openModal()}>Nuevo Producto</button>
            </div>
          } 
        />
        <table className="w-full text-left text-sm border-collapse mt-2">
          <thead><tr><th className="pb-3 text-textLight font-medium border-b border-borderC">SKU</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Producto</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Existencias</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Costo unitario</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Total</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Acciones</th></tr></thead>
          <tbody>
            {inventory.valuation.rows.map((row) => <tr key={row.id} className="hover:bg-slate-50 transition-colors"><td className="py-3 border-b border-borderC/50 font-mono text-textLight">{row.sku}</td><td className="py-3 border-b border-borderC/50 font-medium">{row.name}</td><td className="py-3 border-b border-borderC/50 text-right">{row.stock}</td><td className="py-3 border-b border-borderC/50 text-right">{money.format(row.unitCost)}</td><td className="py-3 border-b border-borderC/50 font-bold text-textMain text-right">{money.format(row.totalCost)}</td><td className="py-3 border-b border-borderC/50 text-right"><div className="flex justify-end gap-1"><button className="icon-btn" onClick={() => openModal(row)}><Pencil size={14}/></button><button className="icon-btn danger" onClick={() => { if(window.confirm('¿Eliminar producto?')) onDeleteProduct(row.id); }}><Trash2 size={14}/></button></div></td></tr>)}
          </tbody>
        </table>
        <div className="mt-6 pt-4 border-t border-borderC flex justify-end text-xl font-bold text-accent">Total actual: {money.format(inventory.valuation.total)}</div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-brand/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-brand text-white p-5 flex justify-between items-center">
              <h2 className="font-semibold text-lg">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm font-medium" onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input className="form-input" placeholder="SKU" value={prodForm.sku} onChange={e => setProdForm({...prodForm, sku: e.target.value})} />
              <input className="form-input" placeholder="Nombre" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
              <input className="form-input" type="number" placeholder="Costo Unitario" value={prodForm.unitCost} onChange={e => setProdForm({...prodForm, unitCost: e.target.value})} />
              <input className="form-input" type="number" placeholder="Precio Venta" value={prodForm.salePrice} onChange={e => setProdForm({...prodForm, salePrice: e.target.value})} />
              <button className="btn-primary w-full mt-2" onClick={() => { editingId ? onUpdateProduct(editingId, prodForm) : onCreateProduct(prodForm); setShowModal(false); }}>Guardar Producto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
