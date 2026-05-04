import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Boxes, Building2, CheckCircle2, FileText, ShoppingCart, Users, Package } from 'lucide-react';
import { api } from './lib/api';
import './styles/app.css';

// Import Pages
import { Products } from './pages/Products';
import { Kardex } from './pages/Kardex';
import { Quotes } from './pages/Quotes';
import { Suppliers } from './pages/Suppliers';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { Customers } from './pages/Customers';

function App() {
  const [tab, setTab] = useState('productos');
  const [inventory, setInventory] = useState(null);
  const [quotes, setQuotes] = useState(null);
  const [purchases, setPurchases] = useState(null);
  const [customers, setCustomers] = useState(null);
  const [message, setMessage] = useState('Datos listos para evidencias comerciales.');

  async function loadAll() {
    const [inventoryData, quotesData, purchasesData, customersData] = await Promise.all([
      api('/api/inventory'),
      api('/api/quotes'),
      api('/api/purchases'),
      api('/api/customers'),
    ]);
    setInventory(inventoryData);
    setQuotes(quotesData);
    setPurchases(purchasesData);
    setCustomers(customersData);
  }

  useEffect(() => {
    loadAll().catch(() => setMessage('No se pudo conectar con la API PHP. Verifica que el backend este en localhost:8080.'));
  }, []);

  async function registerDocument(type, responsible, notes, items) {
    await api('/api/inventory/documents', {
      method: 'POST',
      body: JSON.stringify({ type, responsible, notes, items }),
    });
    await loadAll();
    setMessage(`Documento de ${type} registrado exitosamente.`);
  }

  async function createQuote(customerId, items, paymentTerms, validityDays, notes) {
    await api('/api/quotes', {
      method: 'POST',
      body: JSON.stringify({ customerId, items, paymentTerms, validityDays, notes }),
    });
    await loadAll();
    setMessage('Cotizacion creada exitosamente.');
  }

  async function convertQuote(id) {
    await api(`/api/quotes/${id}/convert`, { method: 'POST' });
    await loadAll();
    setMessage('Cotizacion convertida a pedido automaticamente.');
  }

  async function receiveOrder(id) {
    await api(`/api/purchases/${id}/receive`, { method: 'POST' });
    await loadAll();
    setMessage('Orden recibida: documento de almacén creado y Kardex actualizado.');
  }

  async function createOrder(supplierId, promisedDate, items) {
    await api('/api/purchases', {
      method: 'POST',
      body: JSON.stringify({ supplierId, promisedDate, items }),
    });
    await loadAll();
    setMessage('Orden de compra emitida exitosamente.');
  }

  async function createProduct(payload) {
    await api('/api/products', { method: 'POST', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Producto registrado correctamente.');
  }

  async function updateProduct(id, payload) {
    await api(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Producto actualizado.');
  }

  async function deleteProduct(id) {
    try {
      await api(`/api/products/${id}`, { method: 'DELETE' });
      await loadAll();
      setMessage('Producto eliminado.');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  }

  async function createCustomer(payload) {
    await api('/api/customers', { method: 'POST', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Cliente registrado correctamente.');
  }

  async function updateCustomer(id, payload) {
    await api(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Cliente actualizado.');
  }

  async function deleteCustomer(id) {
    try {
      await api(`/api/customers/${id}`, { method: 'DELETE' });
      await loadAll();
      setMessage('Cliente eliminado.');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  }

  async function createSupplier(payload) {
    await api('/api/suppliers', { method: 'POST', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Proveedor registrado correctamente.');
  }

  async function updateSupplier(id, payload) {
    await api(`/api/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    await loadAll();
    setMessage('Proveedor actualizado.');
  }

  async function deleteSupplier(id) {
    try {
      await api(`/api/suppliers/${id}`, { method: 'DELETE' });
      await loadAll();
      setMessage('Proveedor eliminado.');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  }

  const tabs = [
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'kardex', label: 'Kardex y Stock', icon: Boxes },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText },
    { id: 'proveedores', label: 'Proveedores', icon: Building2 },
    { id: 'compras', label: 'Órdenes de Compra', icon: ShoppingCart },
    { id: 'clientes', label: 'Clientes', icon: Users },
  ];

  return (
    <main className="flex h-screen bg-surface font-sans">
      <aside className="w-64 bg-brand text-white flex flex-col shadow-lg z-10 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Building2 size={28} className="text-accent" />
          <div>
            <strong className="block text-lg font-bold leading-tight">MicroERP</strong>
            <span className="text-[0.65rem] text-white/60 uppercase tracking-widest">Gestion comercial</span>
          </div>
        </div>
        <nav className="p-4 flex flex-col gap-1">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${tab === item.id ? 'bg-accent text-white shadow-md' : 'text-white/60 hover:bg-white/10 hover:text-white'}`} 
                key={item.id} 
                onClick={() => setTab(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white px-8 py-5 flex justify-between items-center shadow-sm border-b border-borderC z-0">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-widest mb-1 block">Producto SaaS para mypes</span>
            <h1 className="text-2xl font-bold text-textMain tracking-tight">Control operativo en tiempo real</h1>
          </div>
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 shadow-sm">
            <CheckCircle2 size={18} /> {message}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {!inventory || !quotes || !purchases || !customers ? (
            <div className="flex items-center justify-center h-full text-textLight font-medium">Cargando panel...</div>
          ) : (
            <div className="max-w-7xl mx-auto w-full">
              {tab === 'productos' && <Products inventory={inventory} onCreateProduct={createProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />}
              {tab === 'kardex' && <Kardex inventory={inventory} onMove={registerDocument} />}
              {tab === 'cotizaciones' && <Quotes quotes={quotes} onConvert={convertQuote} onCreate={createQuote} />}
              {tab === 'proveedores' && <Suppliers purchases={purchases} onCreateSupplier={createSupplier} onUpdateSupplier={updateSupplier} onDeleteSupplier={deleteSupplier} />}
              {tab === 'compras' && <PurchaseOrders purchases={purchases} onReceive={receiveOrder} onCreateOrder={createOrder} />}
              {tab === 'clientes' && <Customers customers={customers} onCreateCustomer={createCustomer} onUpdateCustomer={updateCustomer} onDeleteCustomer={deleteCustomer} />}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
