<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();
    $db = new DBConnection();
    $db = $db->getConnection();

    $username = $inData["username"];
    $password = $inData["password"];
    try
    {
        $sql = "SELECT ID, firstName, lastName
                FROM Users
                WHERE username = :username
                AND password = :password";
				
        // Removed this.
		$stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(':password', $password, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    catch(Exception $e)
    {
        die("Error occurred while executing query.");
    }
    if(!(empty($result))){
        $result = json_encode($result);
        sendResultInfoAsJson($result);
    }
    else{

        returnWithError("Failed to login. Please enter your username and password again.");
    }
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }
        
    function returnWithError($err)
    {
        $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>