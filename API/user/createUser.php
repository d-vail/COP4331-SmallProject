<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

	$firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $username = $inData["Username"];
    $password = $inData["Password"];

    try{
		// Change users to match the name of your table.
       
	    // Sets the INSERT sql statament.
		// ID is automatically assigned, if auto increment is selected.
		// DateFirstOn gets current date.
		$sql = "INSERT INTO `Users`(FirstName, LastName, Username, Password, DateCreated)
        VALUES('$firstName','$lastName','$username','$password',now())";
		
		// Prepares the format of the query using the sql statment.
        $stmt = $db->prepare($sql);
		
		// Executes the query.
        $stmt->execute();
		
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