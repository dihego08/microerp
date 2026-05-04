<?php

namespace MicroErp\Infrastructure\Persistence;

use PDO;
use PDOException;

final class MysqlDatabase
{
    private ?PDO $connection = null;
    private array $config;

    public function __construct(
        string $host = 'localhost',
        string $db = 'u622044135_microerp',
        string $user = 'u622044135_microerp',
        string $pass = '4wNNC>y|eZ',
        string $charset = 'utf8mb4'
    ) {
        $this->config = [
            'host' => $host,
            'db' => $db,
            'user' => $user,
            'pass' => $pass,
            'charset' => $charset
        ];
    }

    public function getConnection(): PDO
    {
        if ($this->connection === null) {
            $dsn = "mysql:host={$this->config['host']};dbname={$this->config['db']};charset={$this->config['charset']}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            try {
                $this->connection = new PDO($dsn, $this->config['user'], $this->config['pass'], $options);
            } catch (PDOException $e) {
                throw new \RuntimeException('Connection failed: ' . $e->getMessage());
            }
        }

        return $this->connection;
    }
}
