import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Store, 
  LayoutDashboard, 
  Package, 
  Tags, 
  Users, 
  ShoppingCart, 
  ArrowRightLeft, 
  LogOut,
  Menu,
  ClipboardList,
  X
} from 'lucide-react';
import { useAuth } from '../store/useAuth';
import api from '../services/api';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/productos', icon: Package, label: 'Productos' },
  { path: '/categorias', icon: Tags, label: 'Categorías' },
  { path: '/marcas', icon: Tags, label: 'Marcas' },
  { path: '/clientes', icon: Users, label: 'Clientes' },
  { path: '/ventas', icon: ShoppingCart, label: 'Ventas' },
  { path: '/compras', icon: ArrowRightLeft, label: 'Compras' },
  { path: '/kardex', icon: ClipboardList, label: 'Kardex' },
];

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Ignorar errores de red en logout
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-sidebar text-white transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-2xl
      `}>
        <div className="h-16 flex items-center px-6 bg-gray-900/50">
          <Store className="h-8 w-8 text-primary-500 mr-3" />
          <span className="text-xl font-bold tracking-wider">POS Web</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'}
                `}
              >
                <Icon className={`h-5 w-5 mr-3 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-gray-900/30">
          <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {user?.Usuario?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.Nombres} {user?.Apellidos}</p>
              <p className="text-xs text-gray-400 truncate">Administrador</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center px-4 sm:px-6 z-10">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center">
            {/* Opciones extras del navbar podrían ir aquí */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
