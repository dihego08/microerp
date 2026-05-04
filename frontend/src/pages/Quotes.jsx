import React, { useState } from 'react';
import { CheckCircle2, FileText, Plus, Search, Trash2 } from 'lucide-react';
import { PanelTitle } from '../components/PanelTitle';
import { money } from '../lib/utils';

export function Quotes({ quotes, onConvert, onCreate }) {
  const [header, setHeader] = useState({ 
    customerId: quotes.customers[0]?.id || '', 
    paymentTerms: 'Credito 15 dias', 
    validityDays: 15, 
    notes: '' 
  });
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ productId: quotes.products[0]?.id || '', quantity: 1 });

  function addItem() {
    if (!currentItem.productId) return;
    const product = quotes.products.find(p => p.id === Number(currentItem.productId));
    if (!product) return;
    
    const existingIndex = items.findIndex(i => i.productId === product.id);
    if (existingIndex >= 0) {
      const newItems = [...items];
      newItems[existingIndex].quantity += Number(currentItem.quantity);
      setItems(newItems);
    } else {
      setItems([...items, { 
        productId: product.id, 
        name: product.name, 
        unitPrice: product.salePrice,
        quantity: Number(currentItem.quantity) 
      }]);
    }
    setCurrentItem({ ...currentItem, quantity: 1 });
  }

  function removeItem(index) {
    setItems(items.filter((_, i) => i !== index));
  }

  function handleSave() {
    if (items.length === 0) return alert('Debes agregar al menos un producto a la cotización.');
    onCreate(header.customerId, items, header.paymentTerms, header.validityDays, header.notes);
    setItems([]);
    setHeader({ ...header, notes: '' });
  }

  const cartTotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={Search} title="Nueva Cotización Comercial" />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Cliente</label>
            <select className="form-input" value={header.customerId} onChange={(e) => setHeader({ ...header, customerId: Number(e.target.value) })}>
              {quotes.customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Condiciones de Pago</label>
            <input className="form-input" placeholder="Ej. Contado..." value={header.paymentTerms} onChange={(e) => setHeader({ ...header, paymentTerms: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Días de Validez</label>
            <input className="form-input" type="number" min="1" value={header.validityDays} onChange={(e) => setHeader({ ...header, validityDays: Number(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-textLight uppercase mb-1">Notas al cliente</label>
            <input className="form-input" placeholder="Ej. Incluye envío..." value={header.notes} onChange={(e) => setHeader({ ...header, notes: e.target.value })} />
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
          <label className="block text-xs font-semibold text-textLight uppercase mb-2">Agregar Productos</label>
          <div className="flex gap-3 items-center">
            <select className="form-input w-auto flex-1" value={currentItem.productId} onChange={(e) => setCurrentItem({ ...currentItem, productId: Number(e.target.value) })}>
              {quotes.products.map(p => <option key={p.id} value={p.id}>{p.name} - {money.format(p.salePrice)}</option>)}
            </select>
            <input className="form-input w-24" type="number" min="1" value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} />
            <button className="btn-secondary flex items-center gap-2" onClick={addItem}><Plus size={16} /> Agregar Fila</button>
          </div>
        </div>

        {items.length > 0 && (
          <table className="w-full text-left text-sm border-collapse mb-6 bg-white border border-borderC rounded-lg overflow-hidden">
            <thead className="bg-slate-50"><tr><th className="p-3 text-textLight font-medium border-b border-borderC">Producto</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Cantidad</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">P. Unitario</th><th className="p-3 text-textLight font-medium border-b border-borderC text-right">Subtotal</th><th className="p-3 text-textLight font-medium border-b border-borderC w-10"></th></tr></thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-borderC/50 last:border-0">
                  <td className="p-3 font-medium text-textMain">{item.name}</td>
                  <td className="p-3 text-right font-bold">{item.quantity}</td>
                  <td className="p-3 text-right">{money.format(item.unitPrice)}</td>
                  <td className="p-3 text-right font-semibold text-brand">{money.format(item.quantity * item.unitPrice)}</td>
                  <td className="p-3 text-center"><button className="icon-btn danger" onClick={() => removeItem(index)}><Trash2 size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-between items-center border-t border-borderC pt-4 mt-2">
          <div className="text-xl font-bold text-accent">Total Cotización: {money.format(cartTotal)}</div>
          <button className="px-6 py-2 bg-brand hover:bg-blue-900 text-white rounded-lg font-bold transition" onClick={handleSave}>
            Generar Cotización
          </button>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2">
        <PanelTitle icon={FileText} title="Seguimiento y conversión" />
        <table className="w-full text-left text-sm border-collapse mt-2">
          <thead><tr><th className="pb-3 text-textLight font-medium border-b border-borderC">Código</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Cliente</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Condiciones</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Estado</th><th className="pb-3 text-textLight font-medium border-b border-borderC text-right">Total</th><th className="pb-3 text-textLight font-medium border-b border-borderC">Documento</th><th className="pb-3 text-textLight font-medium border-b border-borderC"></th></tr></thead>
          <tbody>
            {quotes.quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 border-b border-borderC/50 font-medium">{quote.code}</td>
                <td className="py-3 border-b border-borderC/50">
                  <span className="block">{quote.customer}</span>
                  <span className="text-xs text-textLight block">Válido: {quote.validityDays} días</span>
                </td>
                <td className="py-3 border-b border-borderC/50 text-xs">{quote.paymentTerms}</td>
                <td className="py-3 border-b border-borderC/50"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold uppercase tracking-wider">{quote.status}</span></td>
                <td className="py-3 border-b border-borderC/50 font-semibold text-right">{money.format(quote.total)}</td>
                <td className="py-3 border-b border-borderC/50 text-textLight">{quote.convertedDocument || 'Sin convertir'}</td>
                <td className="py-3 border-b border-borderC/50 text-right"><button className="btn-secondary py-1.5 px-3" onClick={() => onConvert(quote.id)}>Convertir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="bg-white p-6 rounded-xl border border-borderC shadow-soft lg:col-span-2 flex flex-col justify-center">
        <PanelTitle icon={CheckCircle2} title="Reporte mensual" />
        <div className="flex flex-col mt-4">
          <div className="flex items-end gap-2 mb-2">
            <strong className="text-4xl font-bold text-textMain leading-none">{quotes.monthlyClosed.closedQuotes}</strong>
            <span className="text-sm text-textLight font-medium mb-1">Cotizaciones cerradas</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, quotes.monthlyClosed.closedQuotes * 45)}%` }} />
          </div>
          <div className="text-2xl font-bold text-green-600">{money.format(quotes.monthlyClosed.closedAmount)}</div>
        </div>
      </section>
    </div>
  );
}
