<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    //username that is creating a contact must be added so we can track finding a contact
    $username = $inData["Username"];
    $ID = $inData["ID"];

    try{
		
		// ID is automatically assigned if Auto Increse is set on the DB.
		// username is a foreign key from the users table. This way you can only insert a contact to an user that exists.
        $sql = "DELETE FROM contacts WHERE contacts.ID = $ID AND contacts.Username = '$username'";
							  
        $stmt = $db->prepare($sql);
		
        $stmt->execute();
        $result = $stmt->rowCount();
    }
    catch(Exception $e){
        // Chenged it, so that it tells you the exact exception.
        throw $e;
    }
    
	// Check if there were any items deleted.
    if($result == 0){
        returnWithError("Failed to delete a contact.");
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