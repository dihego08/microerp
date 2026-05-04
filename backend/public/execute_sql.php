<?php
$sql = file_get_contents(__DIR__ . '/../../database.sql');
try {
    $pdo = new PDO('mysql:host=127.0.0.1;dbname=microerp;charset=utf8mb4', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $pdo->exec($sql);
    echo "Database created successfully!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
