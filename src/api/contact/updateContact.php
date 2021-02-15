<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

$inData = getRequestInfo();
Auth::authenticate($inData["Username"], 'updateContact');

function updateContact()
{
    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    // Fields sent by the frontend.
    $received_Username = $inData["Username"];
    $ID = $inData["ID"];
    $received_FirstName = $inData["FirstName"];
    $received_LastName = $inData["LastName"];
    $received_Email = $inData["Email"];
    $received_Phone = $inData["Phone"];
    $received_Address = $inData["Address"];
    $received_City = $inData["City"];
    $received_State = $inData["State"];
    $received_ZipCode = $inData["ZipCode"];
    $received_Notes = $inData["Notes"];
    $received_ImageURL = $inData["ImageURL"];

    // Query the current values of the DB for the contact to be updated.
    // Compare current values with values passed from the front-end.
    // Update the differences.
    try {

        $sql_ExtractContact = "SELECT FirstName, LastName, Email, Phone, Address, City, State, ZipCode, Notes
								FROM Contacts
								WHERE Contacts.ID = $ID AND Contacts.Username = '$received_Username'";

        $stmt_ExtractContact = $db->prepare($sql_ExtractContact);

        $stmt_ExtractContact->execute();
        $extractedRowCount = $stmt_ExtractContact->rowCount();

        //$stmt->execute();
        //$result = $stmt->rowCount();

        // Creates an array with the current fields values, in the DB, for the contact to be updated.
        $contactArr = $stmt_ExtractContact->fetchAll(\PDO::FETCH_ASSOC);

        // TO-DO: Maybe add a check to see if there is more than a contact (This should never happen).

        // Check the content of the update request from the front-end.
        // If the received fields are empty then keep the current values in the DB.
        // This is achieved by setting the respective variable, to be updated, to the value
        // in the DB.
        if ($received_FirstName == '') {
            $received_FirstName = $contactArr[0]["FirstName"];
        }
        if ($received_LastName == '') {
            $received_LastName = $contactArr[0]["lastName"];
        }
        if ($received_Email == '') {
            $received_Email = $contactArr[0]["Email"];
        }
        if ($received_Phone == '') {
            $received_Phone = $contactArr[0]["Phone"];
        }
        if ($received_Address == '') {
            $received_Address = $contactArr[0]["Address"];
        }
        if ($received_City == '') {
            $received_City = $contactArr[0]["City"];
        }
        if ($received_State == '') {
            $received_State = $contactArr[0]["State"];
        }
        if ($received_ZipCode == '') {
            $received_ZipCode = $contactArr[0]["ZipCode"];
        }
        if ($received_Notes == '') {
            $received_Notes = $contactArr[0]["Notes"];
        }

        $sql_UpdateContact = "UPDATE Contacts
								SET FirstName = '$received_FirstName' , lastName = '$received_LastName' ,
								Email = '$received_Email' , Phone = '$received_Phone' , Address = '$received_Address' ,
								City = '$received_City' , State = '$received_State' , ZipCode = '$received_ZipCode' ,
								Notes = '$received_Notes', ImageURL = '$received_ImageURL'
								WHERE Contacts.ID = $ID AND Contacts.Username = '$received_Username'";

        $stmt_UpdateContact = $db->prepare($sql_UpdateContact);

        $stmt_UpdateContact->execute();
        $updatedRowCount = $stmt_UpdateContact->rowCount();

        // Check if there were any items were modified.
        if ($extractedRowCount == 0) {
            Response::send(404, [
                "Error" => "Contact id " . $ID . " does not exist for user " . $received_Username . ".",
            ]);
        } else {
            Response::send(200, [
                "ID" => $ID,
                "Username" => $received_Username,
                "FirstName" => $received_FirstName,
                "LastName" => $received_LastName,
                "Email" => $received_Email,
                "Phone" => $received_Phone,
                "Address" => $received_Address,
                "City" => $received_City,
                "State" => $received_State,
                "ZipCode" => $received_ZipCode,
                "Notes" => $received_Notes,
                "ImageURL" => $received_ImageURL,
            ]);
        }

    } catch (Exception $e) {
        Response::send(500, [
            "Error" => "Failed to update contact.",
        ]);
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}
