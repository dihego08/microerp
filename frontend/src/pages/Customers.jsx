import React, { useState } from 'react';
import { Eye, FileText, Pencil, Trash2, Users, AlertTriangle } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';
import { money } from '../lib/utils';

export function Customers({ customers, onCreateCustomer, onUpdateCustomer, onDeleteCustomer }) {
  const [view360, setView360] = useState(null); // Cliente seleccionado para ver el historial
  const [editingCustomer, setEditingCustomer] = useState(null); // Cliente para el CRUD
  const [showFormModal, setShowFormModal] = useState(false);
  const [custForm, setCustForm] = useState({ name: '', category: 'Plata', address: '', creditLimit: 0 });

  function openFormModal(cust = null) {
    if (cust) {
      setEditingCustomer(cust.id);
      setCustForm({ ...cust });
    } else {
      setEditingCustomer(null);
      setCustForm({ name: '', category: 'Plata', address: '', creditLimit: 0 });
    }
    setShowFormModal(true);
  }

  // Comprobar inactividad
  const isInactive = (customerId) => {
    return customers.segments.inactive30Days.some(c => c.id === customerId);
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft flex flex-col">
        <PanelTitle icon={Users} title="Directorio de Clientes" action={<button className="btn-primary" onClick={() => openFormModal()}>Nuevo Cliente</button>} />
        
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr>
                <th className="pb-3 text-textLight font-medium border-b border-borderC">Cliente</th>
                <th className="pb-3 text-textLight font-medium border-b border-borderC">Categoría</th>
                <th className="pb-3 text-textLight font-medium border-b border-borderC">Última Compra</th>
                <th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Crédito Disp.</th>
                <th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.customers.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 border-b border-borderC/50">
                    <strong className="block text-textMain">{c.name}</strong>
                    <span className="text-xs text-textLight">{c.address}</span>
                  </td>
                  <td className="py-3 border-b border-borderC/50">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                      c.category === 'Oro' ? 'bg-yellow-100 text-yellow-800' :
                      c.category === 'Plata' ? 'bg-slate-200 text-slate-700' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 border-b border-borderC/50">
                    <div className="flex items-center gap-2">
                      <span>{c.lastPurchaseDate}</span>
                      {isInactive(c.id) && (
                        <span className="text-red-500 flex items-center gap-1 text-xs font-semibold" title="Inactivo por más de 30 días">
                          <AlertTriangle size={14} /> Riesgo
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 border-b border-borderC/50 text-right">
                    <strong className="block text-accent">{money.format(c.availableCredit)}</strong>
                    <span className="text-xs text-textLight">Límite: {money.format(c.creditLimit)}</span>
                  </td>
                  <td className="py-3 border-b border-borderC/50 text-right">
                    <div className="flex justify-end gap-1">
                      <button className="icon-btn text-brand" title="Vista 360" onClick={() => setView360(c)}><Eye size={16}/></button>
                      <button className="icon-btn" title="Editar" onClick={() => openFormModal(c)}><Pencil size={16}/></button>
                      <button className="icon-btn danger" title="Eliminar" onClick={() => { if(window.confirm('¿Eliminar cliente?')) onDeleteCustomer(c.id); }}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL: VISTA 360 DEL CLIENTE */}
      {view360 && (
        <div className="fixed inset-0 bg-brand/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setView360(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-brand text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Users size={24} className="text-accent" />
                <h2 className="font-semibold text-lg">Vista 360: {view360.name}</h2>
              </div>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm font-medium" onClick={() => setView360(null)}>Cerrar</button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div>
                  <span className="text-textLight text-xs block uppercase mb-1">Dirección Registrada</span>
                  <strong className="text-textMain">{view360.address}</strong>
                </div>
                <div className="text-right">
                  <span className="text-textLight text-xs block uppercase mb-1">Crédito Disponible</span>
                  <strong className="text-2xl text-accent block leading-none">{money.format(view360.availableCredit)}</strong>
                  <span className="text-xs text-textLight">de un límite de {money.format(view360.creditLimit)}</span>
                </div>
              </div>

              <PanelTitle icon={FileText} title="Historial de Compras (Facturación)" />
              <div className="mt-4 max-h-60 overflow-y-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="pb-2 text-textLight font-medium border-b border-borderC">Documento</th>
                      <th className="pb-2 text-textLight font-medium border-b border-borderC">Fecha</th>
                      <th className="pb-2 text-textLight font-medium border-b border-borderC text-right">Total Facturado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {view360.purchaseHistory?.length > 0 ? view360.purchaseHistory.map((sale) => (
                      <tr key={sale.document} className="border-b border-borderC/30 last:border-0">
                        <td className="py-2 font-medium">{sale.document}</td>
                        <td className="py-2 text-textLight">{sale.date}</td>
                        <td className="py-2 text-right font-bold text-brand">{money.format(sale.total)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-textLight italic">No hay historial de compras registrado.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORMULARIO CRUD */}
      {showFormModal && (
        <div className="fixed inset-0 bg-brand/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowFormModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-brand text-white p-5 flex justify-between items-center">
              <h2 className="font-semibold text-lg">{editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition text-sm font-medium" onClick={() => setShowFormModal(false)}>Cerrar</button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <input className="form-input" placeholder="Nombre (Razón Social)" value={custForm.name} onChange={e => setCustForm({...custForm, name: e.target.value})} />
              <select className="form-input" value={custForm.category} onChange={e => setCustForm({...custForm, category: e.target.value})}>
                <option value="Oro">Cliente Oro (VIP)</option>
                <option value="Plata">Cliente Plata</option>
                <option value="Bronce">Cliente Bronce</option>
              </select>
              <input className="form-input" placeholder="Dirección Fiscal" value={custForm.address} onChange={e => setCustForm({...custForm, address: e.target.value})} />
              <input className="form-input" type="number" placeholder="Límite de Crédito (S/)" value={custForm.creditLimit} onChange={e => setCustForm({...custForm, creditLimit: e.target.value})} />
              <button className="btn-primary w-full mt-2" onClick={() => { editingCustomer ? onUpdateCustomer(editingCustomer, custForm) : onCreateCustomer(custForm); setShowFormModal(false); }}>Guardar Cliente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
