<?php
class DBConnection{
// edit these fields if needed

// Modified it for port #.
private $servername = "localhost:8080";

private $username = "root";
private $password = "";

// Modified it for DB name.
private $db = "contact_registry";
private $con;

    public function __construct(){
        try{
            $this->con = new PDO("mysql:host=$this->servername;dbname=$this->db", $this->username, $this->password);
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e){
            echo "Connection failed: " . $e->getMessage();
        }
    }
    public function getConnection(){
        return $this->con;
    }
}
?>