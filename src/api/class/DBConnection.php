<?php

require __DIR__ . "/../config.php";

class DBConnection
{
    private $con = null;

    public function __construct()
    {
        $host = DB_HOST;
        $port = DB_PORT;
        $username = DB_USERNAME;
        $password = DB_PASSWORD;
        $db = DB_NAME;

        try {
            $this->con = new PDO("mysql:host=$host;port=$port;dbname=$db", $username, $password);
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo "Connection failed: " . $e->getMessage();
        }
    }

    public function getConnection()
    {
        return $this->con;
    }
}
