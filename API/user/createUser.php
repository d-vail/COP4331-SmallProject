<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    $username = $inData["username"];
    $password = $inData["password"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];

    try{
		// Change users to match the name of your table.
       
	    // Sets the INSERT sql statament.
		// ID is automatically assigned, if auto increment is selected.
		// DateFirstOn gets current date.
		$sql = "INSERT INTO `Users`(firstName, lastName, username, password, DateFirstOn)
        VALUES(?,?,?,?,now())";
		
		// Prepares the format of the query using the sql statment.
        $stmt = $db->prepare($sql);
		
		// Binds each variable to the query.
		$stmt->bindParam(1, $firstName, PDO::PARAM_STR, 255);
		$stmt->bindParam(2, $lastName, PDO::PARAM_STR, 255);
        $stmt->bindParam(3, $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(4, $password, PDO::PARAM_STR, 255);
		
		// Executes the query.
        $stmt->execute();
		
		// Counts the number of rows after insertion.
        $result = $stmt->rowCount();
    }
    catch(Exception $e){
		
		// Chenged it, so that it tells you the exact exception.
        throw $e;
    }
    if($result == 0){
        returnWithError("Failed to create an account.");
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