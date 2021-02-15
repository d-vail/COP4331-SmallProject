<?php

require __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__, '../.env');
$dotenv->load();

define('DB_HOST', $_ENV['DB_HOST']);

define('DB_PORT', $_ENV['DB_PORT']);

define('DB_NAME', $_ENV['DB_NAME']);

define('DB_USERNAME', $_ENV['DB_USERNAME']);

define('DB_PASSWORD', $_ENV['DB_PASSWORD']);

define('SECRET_KEY', $_ENV['SECRET_KEY']);

define('AUTH_EXPIRATION', $_ENV['AUTH_EXPIRATION']);

define('SPACES_KEY', $_ENV['SPACES_KEY']);

define('SPACES_SECRET', $_ENV['SPACES_SECRET']);
