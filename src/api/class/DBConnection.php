<?php
class DBConnection
{
    private $con = null;

    public function __construct()
    {
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $username = getenv('DB_USERNAME');
        $password = getenv('DB_PASSWORD');
        $db = getenv('DB_NAME');

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
