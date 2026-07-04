<?php

// VentaController
$ventaCtrl = "<?php\n\nnamespace App\Http\Controllers;\n\nuse App\Services\VentaService;\nuse Illuminate\Http\Request;\n\nclass VentaController extends Controller\n{\n    protected \$service;\n\n    public function __construct(VentaService \$service)\n    {\n        \$this->service = \$service;\n    }\n\n    public function store(Request \$request)\n    {\n        try {\n            \$item = \$this->service->create(\$request->all());\n            return \$this->success(\$item, 'Venta registrada correctamente', 201);\n        } catch (\\Exception \$e) {\n            return \$this->error(\$e->getMessage(), 400);\n        }\n    }\n}\n";

file_put_contents(__DIR__ . '/backend/app/Http/Controllers/VentaController.php', $ventaCtrl);

// CompraController
$compraCtrl = "<?php\n\nnamespace App\Http\Controllers;\n\nuse App\Services\CompraService;\nuse Illuminate\Http\Request;\n\nclass CompraController extends Controller\n{\n    protected \$service;\n\n    public function __construct(CompraService \$service)\n    {\n        \$this->service = \$service;\n    }\n\n    public function store(Request \$request)\n    {\n        try {\n            \$item = \$this->service->create(\$request->all());\n            return \$this->success(\$item, 'Compra registrada correctamente', 201);\n        } catch (\\Exception \$e) {\n            return \$this->error(\$e->getMessage(), 400);\n        }\n    }\n}\n";

file_put_contents(__DIR__ . '/backend/app/Http/Controllers/CompraController.php', $compraCtrl);

// KardexController
$kardexCtrl = "<?php\n\nnamespace App\Http\Controllers;\n\nuse App\Models\Kardex;\nuse Illuminate\Http\Request;\n\nclass KardexController extends Controller\n{\n    public function index(Request \$request)\n    {\n        \$query = Kardex::query();\n        if (\$request->has('producto_id')) {\n            \$query->where('IdProducto', \$request->producto_id);\n        }\n        return \$this->success(\$query->orderBy('Fecha', 'desc')->get());\n    }\n}\n";

file_put_contents(__DIR__ . '/backend/app/Http/Controllers/KardexController.php', $kardexCtrl);

echo "Controladores generados.\n";
