DROP DATABASE IF EXISTS microerp;
CREATE DATABASE microerp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE microerp;

CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    paymentTerms VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    minStock INT NOT NULL DEFAULT 0,
    unitCost DECIMAL(10,2) NOT NULL,
    salePrice DECIMAL(10,2) NOT NULL,
    batch VARCHAR(100) NOT NULL,
    supplierId INT NOT NULL,
    warehouseLocation VARCHAR(50) NOT NULL,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
);

CREATE TABLE inventory_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    type ENUM('entrada', 'salida') NOT NULL,
    date DATE NOT NULL,
    responsible VARCHAR(100) NOT NULL,
    notes TEXT NULL
);

CREATE TABLE movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    documentId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    batch VARCHAR(100) NOT NULL,
    supplierId INT NOT NULL,
    FOREIGN KEY (documentId) REFERENCES inventory_documents(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id),
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
);

CREATE TABLE purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    supplierId INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    promisedDate DATE NOT NULL,
    receivedDate DATE NULL,
    FOREIGN KEY (supplierId) REFERENCES suppliers(id)
);

CREATE TABLE purchase_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    purchaseOrderId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    unitCost DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (purchaseOrderId) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    creditLimit DECIMAL(10,2) NOT NULL,
    creditUsed DECIMAL(10,2) NOT NULL DEFAULT 0,
    lastPurchaseDate DATE NOT NULL
);

CREATE TABLE quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    customerId INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    validityDays INT NOT NULL DEFAULT 15,
    notes TEXT NULL,
    paymentTerms VARCHAR(100) NULL,
    sentByEmail BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATE NOT NULL,
    convertedDocument VARCHAR(50) NULL,
    FOREIGN KEY (customerId) REFERENCES customers(id)
);

CREATE TABLE quote_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quoteId INT NOT NULL,
    productId INT NOT NULL,
    quantity INT NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (quoteId) REFERENCES quotes(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id)
);

CREATE TABLE sales_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    document VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (customerId) REFERENCES customers(id)
);

-- INSERTS (Seed Data)
INSERT INTO suppliers (id, name, contact, email, paymentTerms, phone) VALUES
(1, 'Quimicos Andinos SAC', 'Mariela Soto', 'ventas@quimicosandinos.test', 'Credito 30 dias', '+51 987 111 222'),
(2, 'Bioseguridad Total', 'Jorge Rivas', 'contacto@bioseguridad.test', 'Contado', '+51 987 333 444'),
(3, 'Ferreteria Mayorista Norte', 'Lucia Pena', 'oc@mayoristanorte.test', 'Credito 15 dias', '+51 987 555 666');

INSERT INTO products (id, sku, name, stock, minStock, unitCost, salePrice, batch, supplierId, warehouseLocation) VALUES
(1, 'LIM-001', 'Detergente industrial 5L', 18, 12, 24.50, 39.90, 'LT-2026-041', 1, 'A-01-03'),
(2, 'SEG-014', 'Guantes de nitrilo caja x100', 6, 15, 18.20, 31.00, 'LT-2026-022', 2, 'B-02-01'),
(3, 'FER-120', 'Tornillo galvanizado 1/2', 450, 200, 0.18, 0.35, 'LT-2026-010', 3, 'C-04-02');

INSERT INTO inventory_documents (id, code, type, date, responsible, notes) VALUES
(1, 'ENT-001', 'entrada', '2026-04-26', 'Almacenero Principal', 'Recepcion inicial de OC-001'),
(2, 'SAL-001', 'salida', '2026-04-28', 'Despacho', 'Venta urgente FV-001');

INSERT INTO movements (id, documentId, productId, quantity, batch, supplierId) VALUES
(1, 1, 1, 20, 'LT-2026-041', 1),
(2, 2, 2, 9, 'LT-2026-022', 2);

INSERT INTO purchase_orders (id, code, supplierId, status, promisedDate, receivedDate) VALUES
(1, 'OC-001', 1, 'Recibido', '2026-04-25', '2026-04-26'),
(2, 'OC-002', 2, 'Pendiente', '2026-05-03', NULL);

INSERT INTO purchase_order_items (purchaseOrderId, productId, quantity, unitCost) VALUES
(1, 1, 20, 24.50),
(2, 2, 40, 18.20);

INSERT INTO customers (id, name, category, address, creditLimit, creditUsed, lastPurchaseDate) VALUES
(1, 'Minimarket El Sol', 'Oro', 'Av. Los Jardines 240, Lima', 5000.00, 1650.00, '2026-04-18'),
(2, 'Servicios Integrales Pardo', 'Plata', 'Jr. Comercio 181, Callao', 2500.00, 400.00, '2026-03-12');

INSERT INTO quotes (id, code, customerId, status, validityDays, notes, paymentTerms, sentByEmail, createdAt, convertedDocument) VALUES
(1, 'COT-001', 1, 'Aceptada', 15, 'Entrega programada para viernes', 'Credito 15 dias', 1, '2026-04-20', 'PED-001'),
(2, 'COT-002', 2, 'Enviada por correo', 30, 'Incluye instalacion gratis', 'Contado', 1, '2026-04-24', NULL);

INSERT INTO quote_items (quoteId, productId, quantity, unitPrice) VALUES
(1, 1, 5, 39.90),
(1, 2, 3, 31.00),
(2, 3, 200, 0.35);

INSERT INTO sales_history (id, customerId, document, date, total) VALUES
(1, 1, 'FV-001', '2026-04-18', 980.50),
(2, 1, 'FV-002', '2026-04-25', 292.50),
(3, 2, 'FV-003', '2026-03-12', 410.00);
