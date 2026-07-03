<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsuarioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('Usuario')->insert([
            'Nombres' => 'Admin',
            'Apellidos' => 'System',
            'Correo' => 'admin@pos.com',
            'Celular' => '999999999',
            'Usuario' => 'admin',
            'PasswordHash' => Hash::make('admin123'),
            'FechaCreacion' => Carbon::now(),
            'UsuarioCreacion' => 1,
            'Estado' => 1
        ]);
    }
}
