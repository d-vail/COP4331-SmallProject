<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

Auth::authenticate($_GET["Username"], 'getContact');

function getContact() {
    $username = $_GET["Username"];
    $contactid = $_GET["ContactID"];
    $db = new DBConnection();
    $db = $db->getConnection();

    try {
        $sql = "SELECT *
                FROM Contacts
                WHERE Username = :username AND ID = :contactid";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(':contactid', $contactid, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $rowCount = $stmt->rowCount();
    } catch (Exception $e) {
        Response::send(500, [
            "Error" => "Could not fetch contact details. Please try again.",
        ]);
    }

    if ($rowCount == 0) {
        Response::send(404, [
            "Error" => "Contact id ".$contactid." does not exist for user ".$username,
        ]);
    } else {
        Response::send(200, $result);
    }
}
