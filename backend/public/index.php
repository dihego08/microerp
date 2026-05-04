<?php

use MicroErp\Application\CommercialService;
use MicroErp\Application\CustomerService;
use MicroErp\Application\InventoryService;
use MicroErp\Application\PurchaseService;
use MicroErp\Infrastructure\Persistence\MysqlDatabase;

require __DIR__ . '/../src/Infrastructure/Autoload.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input') ?: '{}', true) ?: [];

try {
    $database = new MysqlDatabase();

    $response = match (true) {
        $method === 'GET' && $path === '/api/health' => ['status' => 'ok', 'service' => 'microerp'],
        $method === 'POST' && $path === '/api/products' => (new InventoryService($database))->createProduct($body),
        $method === 'PUT' && preg_match('#^/api/products/(\d+)$#', $path, $m) => (new InventoryService($database))->updateProduct((int)$m[1], $body),
        $method === 'DELETE' && preg_match('#^/api/products/(\d+)$#', $path, $m) => (new InventoryService($database))->deleteProduct((int)$m[1]),
        $method === 'POST' && $path === '/api/customers' => (new CustomerService($database))->createCustomer($body),
        $method === 'PUT' && preg_match('#^/api/customers/(\d+)$#', $path, $m) => (new CustomerService($database))->updateCustomer((int)$m[1], $body),
        $method === 'DELETE' && preg_match('#^/api/customers/(\d+)$#', $path, $m) => (new CustomerService($database))->deleteCustomer((int)$m[1]),
        $method === 'POST' && $path === '/api/suppliers' => (new PurchaseService($database))->createSupplier($body),
        $method === 'PUT' && preg_match('#^/api/suppliers/(\d+)$#', $path, $m) => (new PurchaseService($database))->updateSupplier((int)$m[1], $body),
        $method === 'DELETE' && preg_match('#^/api/suppliers/(\d+)$#', $path, $m) => (new PurchaseService($database))->deleteSupplier((int)$m[1]),
        $method === 'GET' && $path === '/api/inventory' => (new InventoryService($database))->dashboard(),
        $method === 'POST' && $path === '/api/inventory/documents' => (new InventoryService($database))->registerDocument($body),
        $method === 'GET' && $path === '/api/quotes' => (new CommercialService($database))->quotes(),
        $method === 'POST' && $path === '/api/quotes' => (new CommercialService($database))->createQuote($body),
        $method === 'POST' && preg_match('#^/api/quotes/(\d+)/convert$#', $path, $matches) === 1 => (new CommercialService($database))->convertQuote((int) $matches[1]),
        $method === 'GET' && $path === '/api/purchases' => (new PurchaseService($database))->overview(),
        $method === 'POST' && $path === '/api/purchases' => (new PurchaseService($database))->createPurchaseOrder($body),
        $method === 'POST' && preg_match('#^/api/purchases/(\d+)/receive$#', $path, $matches) === 1 => (new PurchaseService($database))->receive((int) $matches[1]),
        $method === 'GET' && $path === '/api/customers' => (new CustomerService($database))->overview(),
        default => notFound(),
    };

    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode(['error' => $exception->getMessage()], JSON_UNESCAPED_UNICODE);
}

function notFound(): array
{
    http_response_code(404);
    return ['error' => 'Ruta no encontrada'];
}
