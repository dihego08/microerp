import React, { useState } from 'react';
import { Building2, Pencil, Trash2 } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';

export function Suppliers({ purchases, onCreateSupplier, onUpdateSupplier, onDeleteSupplier }) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [suppForm, setSuppForm] = useState({ name: '', contact: '', email: '', paymentTerms: '', phone: '' });

  function openModal(supp = null) {
    if (supp) {
      setEditingId(supp.id);
      setSuppForm({ ...supp });
    } else {
      setEditingId(null);
      setSuppForm({ name: '', contact: '', email: '', paymentTerms: '', phone: '' });
    }
    setShowModal(true);
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft flex flex-col">
        <PanelTitle icon={Building2} title="Ficha de proveedor" action={<button className="btn-secondary" onClick={() => openModal()}>Nuevo</button>} />
        <div className="flex flex-col mt-2">
          {purchases.suppliers.map((supplier) => (
            <div className="flex items-center justify-between py-3 border-b border-borderC/50 last:border-0" key={supplier.id}>
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between">
                  <strong className="text-textMain">{supplier.name}</strong>
                  <span className="text-sm font-medium">{supplier.contact}</span>
                </div>
                <small className="text-textLight text-xs mt-1">{supplier.paymentTerms} - {supplier.phone}</small>
              </div>
              <div className="flex gap-1 ml-4">
                <button className="icon-btn" onClick={() => openModal(supplier)}><Pencil size={14}/></button>
                <button className="icon-btn danger" onClick={() => { if(window.confirm('¿Eliminar proveedor?')) onDeleteSupplier(supplier.id); }}><Trash2 size={14}/></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-brand/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-brand text-white p-5 flex justify-between items-center">
              <h2 className="font-semibold text-lg">{editingId ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm font-medium" onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input className="form-input" placeholder="Razón Social" value={suppForm.name} onChange={e => setSuppForm({...suppForm, name: e.target.value})} />
              <input className="form-input" placeholder="Contacto" value={suppForm.contact} onChange={e => setSuppForm({...suppForm, contact: e.target.value})} />
              <input className="form-input" placeholder="Términos de pago" value={suppForm.paymentTerms} onChange={e => setSuppForm({...suppForm, paymentTerms: e.target.value})} />
              <button className="btn-primary w-full mt-2" onClick={() => { editingId ? onUpdateSupplier(editingId, suppForm) : onCreateSupplier(suppForm); setShowModal(false); }}>Guardar Proveedor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
