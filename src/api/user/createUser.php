<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

$inData = getRequestInfo();
$db = new DBConnection();
$db = $db->getConnection();

$username = $inData["Username"];
$password = $inData["Password"] == null ? null : password_hash($inData["Password"], PASSWORD_DEFAULT);
$email = $inData["Email"];

try {
    // Change users to match the name of your table.

    // Sets the INSERT sql statament.
    // ID is automatically assigned, if auto increment is selected.
    // DateFirstOn gets current date.
    $sql = "INSERT INTO `Users`(Username, Password, Email, DateCreated) VALUES(?,?,?,now())";

    // Prepares the format of the query using the sql statment.
    $stmt = $db->prepare($sql);

    // Binds each variable to the query.
    $stmt->bindParam(1, $username, PDO::PARAM_STR, 255);
    $stmt->bindParam(2, $password, PDO::PARAM_STR, 255);
    $stmt->bindParam(3, $email, PDO::PARAM_STR, 255);

    // Executes the query.
    if ($stmt->execute()) {
        Response::send(200, [
            "Username" => $username,
            "JWT" => Auth::getJWT([
                "Username" => $username,
            ]),
        ]);
    } else {
        Response::send(500, [
            "Error" => "Failed to create an account.",
        ]);
    }
} catch (Exception $e) {
    $mysqlError = $e->errorInfo[1];
    $mysqlErrorMsg = $e->errorInfo[2];

    switch ($mysqlError) {
        case 1062:
            // Unique constraint violated.
            $matches = [];
            preg_match('/(.+)\'(.+)\'.+\'(.+)\.(.+)\'/', $mysqlErrorMsg, $matches);

            Response::send(409, [
                "Error" => $matches[4] . " is already taken.",
            ]);

            break;
        case 1048:
            // Required value missing.
            $matches = [];
            preg_match('/.+\'(.+)\'.+/', $mysqlErrorMsg, $matches);

            Response::send(400, [
                "Error" => $matches[1] . " is required.",
            ]);

            break;
        default:
            Response::send(500, [
                "Error" => "Failed to create an account.",
            ]);
            break;
    }
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}
