<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

$inData = getRequestInfo();
$db = new DBConnection();
$db = $db->getConnection();

$username = $inData["Username"];
$password = $inData["Password"];

try {
    $sql = "SELECT *
                FROM Users
                WHERE Username = :username";
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $rowCount = $stmt->rowCount();
} catch (Exception $e) {
    Response::send(500, [
        "Error" => "Failed to login. Please enter your username and password again.",
    ]);
}

if ($rowCount == 0 || !password_verify($password, $result["Password"])) {
    Response::send(404, [
        "Error" => "Invalid username and/or password.",
    ]);
} else {
    Response::send(200, [
        "Username" => $username,
        "JWT" => Auth::getJWT([
            "Username" => $username,
        ]),
    ]);
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}