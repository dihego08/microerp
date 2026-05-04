# ERP ligero para micro y pequenas empresas

Aplicacion web modular para controlar inventario, cotizaciones, compras, proveedores y clientes.

## Stack

- Backend: PHP 8+, API JSON, arquitectura limpia.
- Frontend: React + Vite.
- Persistencia inicial: JSON local en `backend/storage/database.json`.

## Ejecutar en desarrollo

Backend:

```powershell
cd backend
php -S localhost:8080 -t public
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

El frontend usa `http://localhost:8080` como API por defecto. Puedes cambiarlo con `VITE_API_URL`.

## Modulos incluidos

- Inventarios: movimientos de entrada/salida, kardex, alertas de stock, trazabilidad por lote y valorizacion.
- Cotizaciones: creacion, estado, conversion a pedido/factura y reporte comercial.
- Compras y proveedores: ficha de proveedor, ordenes de compra, recepcion y cumplimiento.
- Clientes: vista 360, historial de compras, segmentacion comercial.

## Siguiente evolucion recomendada

1. Reemplazar JSON por MySQL o PostgreSQL.
2. Agregar autenticacion, roles y permisos.
3. Implementar generacion real de PDF/Excel desde backend.
4. Agregar pruebas unitarias de casos de uso y pruebas E2E de flujos principales.
