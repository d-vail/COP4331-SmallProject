<?php

require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

$headers = apache_request_headers();
$username = $_GET["Username"];

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
        getContact($username);
    }
} else {
    Response::send(401, [
        "Error" => "This request requires user authentication.",
    ]);
}

function getContact($username) {
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
