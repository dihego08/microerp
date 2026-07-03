import React from 'react';
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
  <div className="card p-6 flex items-center group hover:shadow-lg transition-all duration-300">
    <div className={`p-4 rounded-xl mr-4 ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      {trend && (
        <p className="text-sm mt-1">
          <span className="text-green-500 font-medium">{trend}</span>
          <span className="text-gray-400 ml-1">vs mes anterior</span>
        </p>
      )}
    </div>
  </div>
);

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Bienvenido al sistema POS. Aquí tienes un resumen.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Ventas de Hoy" 
          value="S/ 2,450.00" 
          icon={DollarSign} 
          trend="+15%" 
          colorClass="bg-blue-500 shadow-blue-500/30"
        />
        <StatCard 
          title="Órdenes" 
          value="45" 
          icon={ShoppingBag} 
          trend="+5%" 
          colorClass="bg-emerald-500 shadow-emerald-500/30"
        />
        <StatCard 
          title="Nuevos Clientes" 
          value="12" 
          icon={Users} 
          trend="+2%" 
          colorClass="bg-orange-500 shadow-orange-500/30"
        />
        <StatCard 
          title="Crecimiento" 
          value="24%" 
          icon={TrendingUp} 
          trend="+4%" 
          colorClass="bg-purple-500 shadow-purple-500/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Gráfico de Ventas (Demo)</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-400">Aquí irá el gráfico (ej: Recharts o Chart.js)</p>
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Productos con Bajo Stock</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-white rounded flex items-center justify-center shadow-sm">
                    <Package className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">Producto {i}</p>
                    <p className="text-xs text-red-600 font-medium">Stock: 2 unidades</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700">Abastecer</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Necesario importar Package para la tarjeta de bajo stock
import { Package } from 'lucide-react';
