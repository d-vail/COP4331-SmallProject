<?php
require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

Auth::authenticate($_GET["Username"], 'searchContacts');

function searchContacts()
{
    $username = $_GET["Username"];
    $name = $_GET["Name"];

    $db = new DBConnection();
    $db = $db->getConnection();

    try
    {
        $sql = "SELECT *
                FROM Contacts
                WHERE Username = :username AND CONCAT(FirstName, ' ',LastName) LIKE CONCAT('%', :name, '%')";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $rowCount = $stmt->rowCount();

    } catch (Exception $e) {
        Response::send(500, [
            "Error" => "Could not fetch contact details. Please try again.",
        ]);
    }

    if ($rowCount == 0) {
        Response::send(200, [
            "results" => [],
        ]);
    } else {
        Response::send(200, [
            "results" => $result,
        ]);
    }
}