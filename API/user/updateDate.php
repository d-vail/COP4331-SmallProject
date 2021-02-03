<?php
    # Upon a successful log in, call this script to update the date of last logged in
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    $username = $inData["username"];

    try{
        $sql = "UPDATE Users
                SET DateLastLoggedIn = now()
                WHERE username = :username";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->rowCount();
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
    }
    if($result == 0){
        returnWithError("Failed to update the date on the account.");
    }
    
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
    }
    
    function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>