<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

$headers = apache_request_headers();
$inData = getRequestInfo();
$username = $inData["Username"];

if (isset($headers['Authorization'])) {
    $authHeader = explode(" ", $headers['Authorization']);
    $jwt = count($authHeader) < 2 ? $authHeader[0] : $authHeader[1];
    $jwtPayload = Auth::decodeJWT($jwt);

    if (!$jwtPayload) {
        Response::send(401, [
            "Error" => "This request requires user authentication.",
        ]);
    } elseif ($jwtPayload['payload']->Username != $username) {
        Response::send(403, [
            "Error" => "This user is not authorized to perform this operation.",
        ]);
    } else {
        createContact($inData);
    }
} else {
    Response::send(401, [
        "Error" => "This request requires user authentication.",
    ]);
}

function createContact($inData)
{
    $db = new DBConnection();
    $db = $db->getConnection();

    //username that is creating a contact must be added so we can track finding a contact
    $username = $inData["Username"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $emailaddress = $inData["Email"];
    $phoneNum = $inData["Phone"];
    $streetAddress = $inData["Address"];
    $city = $inData["City"];
    $state = $inData["State"];
    $zipcode = $inData["ZipCode"];
    $notes = $inData["Notes"];
    $imageUrl = $inData["ImageURL"];

    try {
        $sql = "INSERT INTO Contacts(Username,FirstName, LastName, Email, Phone, Address, City, State, ZipCode, Notes, ImageURL)
                    VALUES(:Username, :FirstName, :LastName, :Email, :Phone, :Address, :City, :State, :ZipCode, :Notes, :ImageURL)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':Username', $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(':FirstName', $firstName, PDO::PARAM_STR, 255);
        $stmt->bindParam(':LastName', $lastName, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Email', $emailaddress, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Phone', $phoneNum, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Address', $streetAddress, PDO::PARAM_STR, 255);
        $stmt->bindParam(':City', $city, PDO::PARAM_STR, 255);
        $stmt->bindParam(':State', $state, PDO::PARAM_STR, 255);
        $stmt->bindParam(':ZipCode', $zipcode, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Notes', $notes, PDO::PARAM_STR, 255);
        $stmt->bindParam(':ImageURL', $notes, PDO::PARAM_STR, 255);

        // Executes the query.
        if ($stmt->execute()) {
            Response::send(200, [
                "Message" => $firstName . " " . $lastName . " added as a new contact.",
            ]);
        } else {
            Response::send(500, [
                "Error" => "Failed to create contact.",
            ]);
        }
    } catch (Exception $e) {
        $mysqlError = $e->errorInfo[1];
        $mysqlErrorMsg = $e->errorInfo[2];

        switch ($mysqlError) {
            case 1048:
                // Required value missing.
                $matches = [];
                preg_match('/.+\'(.+)\'.+/', $mysqlErrorMsg, $matches);

                Response::send(400, [
                    "Error" => $matches[1] . " is required.",
                ]);

                break;
            case 1452:
                // Foreign key constraint failed.
                Response::send(400, [
                    "Error" => "User " . $username . " does not exist.",
                ]);
                break;
            default:
                Response::send(500, [
                    "Error" => "Failed to create contact.",
                ]);
                break;
        }
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}
