<?php

$entities = [
    'Producto' => 'Productos',
    'Usuario' => 'Usuarios',
];

foreach ($entities as $model => $plural) {
    // Service
    $service = "<?php\n\nnamespace App\Services;\n\nuse App\Models\\{$model};\nuse Carbon\Carbon;\nuse Illuminate\Support\Facades\Auth;\nuse Illuminate\Support\Facades\Hash;\n\nclass {$model}Service\n{\n    public function getAll()\n    {\n        return {$model}::where('Estado', 1)->get();\n    }\n\n    public function getById(\$id)\n    {\n        return {$model}::find(\$id);\n    }\n\n    public function create(array \$data)\n    {\n        if (isset(\$data['password'])) { \$data['PasswordHash'] = Hash::make(\$data['password']); }\n        \$data['FechaCreacion'] = Carbon::now();\n        \$data['UsuarioCreacion'] = Auth::id() ?? 1;\n        \$data['Estado'] = 1;\n        return {$model}::create(\$data);\n    }\n\n    public function update(\$id, array \$data)\n    {\n        \$item = {$model}::find(\$id);\n        if (\$item) {\n            if (isset(\$data['password'])) { \$data['PasswordHash'] = Hash::make(\$data['password']); }\n            \$data['FechaModificacion'] = Carbon::now();\n            \$data['UsuarioModificacion'] = Auth::id() ?? 1;\n            \$item->update(\$data);\n        }\n        return \$item;\n    }\n\n    public function delete(\$id)\n    {\n        \$item = {$model}::find(\$id);\n        if (\$item) {\n            \$item->Estado = 0;\n            \$item->FechaModificacion = Carbon::now();\n            \$item->UsuarioModificacion = Auth::id() ?? 1;\n            \$item->save();\n        }\n        return \$item;\n    }\n}\n";
    file_put_contents(__DIR__ . "/backend/app/Services/{$model}Service.php", $service);

    // Controller
    $controllerName = "{$model}Controller";
    $controllerContent = "<?php\n\nnamespace App\Http\Controllers;\n\nuse App\Services\\{$model}Service;\nuse Illuminate\Http\Request;\n\nclass {$controllerName} extends Controller\n{\n    protected \$service;\n\n    public function __construct({$model}Service \$service)\n    {\n        \$this->service = \$service;\n    }\n\n    public function index()\n    {\n        return \$this->success(\$this->service->getAll());\n    }\n\n    public function show(\$id)\n    {\n        \$item = \$this->service->getById(\$id);\n        if (!\$item) return \$this->error('No encontrado', 404);\n        return \$this->success(\$item);\n    }\n\n    public function store(Request \$request)\n    {\n        \$item = \$this->service->create(\$request->all());\n        return \$this->success(\$item, 'Creado correctamente', 201);\n    }\n\n    public function update(Request \$request, \$id)\n    {\n        \$item = \$this->service->update(\$id, \$request->all());\n        if (!\$item) return \$this->error('No encontrado', 404);\n        return \$this->success(\$item, 'Actualizado correctamente');\n    }\n\n    public function destroy(\$id)\n    {\n        \$item = \$this->service->delete(\$id);\n        if (!\$item) return \$this->error('No encontrado', 404);\n        return \$this->success(null, 'Eliminado correctamente');\n    }\n}\n";
    file_put_contents(__DIR__ . "/backend/app/Http/Controllers/{$controllerName}.php", $controllerContent);
}

echo "API productos/usuarios generada.\n";
