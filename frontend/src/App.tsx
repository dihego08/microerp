import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './modules/auth/Login';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './modules/dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProductList } from './modules/products/ProductList';
import { VentasPos } from './modules/ventas/VentasPos';
import { NuevaCompra } from './modules/compras/NuevaCompra';
import { KardexReport } from './modules/kardex/KardexReport';
import { ClienteList } from './modules/clientes/ClienteList';
import { CategoriaList } from './modules/categorias/CategoriaList';
import { MarcaList } from './modules/marcas/MarcaList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            
            <Route path="/productos" element={<ProductList />} />
            <Route path="/categorias" element={<CategoriaList />} />
            <Route path="/marcas" element={<MarcaList />} />
            <Route path="/clientes" element={<ClienteList />} />
            <Route path="/ventas" element={<VentasPos />} />
            <Route path="/compras" element={<NuevaCompra />} />
            <Route path="/kardex" element={<KardexReport />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
