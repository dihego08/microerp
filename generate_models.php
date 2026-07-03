<?php

$models = [
    'Categoria' => ['Nombre', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'Marca' => ['Nombre', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'Producto' => ['Codigo', 'CodigoBarras', 'Nombre', 'Descripcion', 'IdMarca', 'PrecioCompra', 'PrecioVenta', 'StockMinimo', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'Cliente' => ['TipoDocumento', 'NumeroDocumento', 'Nombre', 'Direccion', 'Telefono', 'Correo', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'CompraCabecera' => ['Fecha', 'NumeroDocumento', 'Total', 'Observacion', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'CompraDetalle' => ['IdCompraCabecera', 'IdProducto', 'Cantidad', 'PrecioUnitario', 'Total', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'VentaCabecera' => ['NumeroVenta', 'Fecha', 'IdCliente', 'IdUsuario', 'IdTipoDocumento', 'IdFormaPago', 'Subtotal', 'IGV', 'Total', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'VentaDetalle' => ['IdVentaCabecera', 'IdProducto', 'Cantidad', 'PrecioUnitario', 'Total', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'Kardex' => ['IdProducto', 'Fecha', 'IdTipoMovimiento', 'Cantidad', 'CostoUnitario', 'StockAnterior', 'StockActual', 'Referencia', 'Observacion', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'TipoMovimiento' => ['Nombre', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'TipoDocumento' => ['Nombre', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
    'FormaPago' => ['Nombre', 'FechaCreacion', 'UsuarioCreacion', 'FechaModificacion', 'UsuarioModificacion', 'Estado'],
];

foreach ($models as $name => $fillable) {
    $fillableStr = implode("',\n        '", $fillable);
    
    $content = "<?php\n\nnamespace App\Models;\n\nuse Illuminate\Database\Eloquent\Model;\n\nclass {$name} extends Model\n{\n    protected \$table = '{$name}';\n    protected \$primaryKey = 'Id';\n    public \$timestamps = false;\n\n    protected \$fillable = [\n        '{$fillableStr}'\n    ];\n}\n";

    file_put_contents(__DIR__ . "/backend/app/Models/{$name}.php", $content);
}

echo "Modelos generados correctamente.\n";
