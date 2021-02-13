<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

Auth::authenticate($_GET["Username"], 'deleteContact');

function deleteContact() {
    $db = new DBConnection();
    $db = $db->getConnection();

    //username that is creating a contact must be added so we can track finding a contact
    $username = $_GET["Username"];
    $ID = $_GET["ContactID"];

    try {
        // ID is automatically assigned if Auto Increse is set on the DB.
        // username is a foreign key from the users table. This way you can only insert a contact to an user that exists.
        $sql = "DELETE FROM Contacts WHERE Contacts.ID = $ID AND Contacts.Username = '$username'";

        $stmt = $db->prepare($sql);

        $stmt->execute();
        $rowCount = $stmt->rowCount();
    } catch (Exception $e) {
        Response::send(500, [
            "Error" => "Could not delete contact. Please try again.",
        ]);
    }

    // Check if there were any items deleted.
    if ($rowCount == 0) {
        Response::send(404, [
            "Error" => "Contact id " . $ID . " does not exist for user " . $username . ".",
        ]);
    } else {
        Response::send(204, false);
    }
}