<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    // Fields sent by the frontend.
    $received_Username = $inData["Username"];
	
	// Delete if we will not use.
	//$userID = $inData["userID"];
	
    // Selects all contacts for the username.
    try{
		
        $sql_ExtractContact = "SELECT FirstName, lastName, Email, Phone, Address, City, State, ZipCode, Notes 
								FROM contacts 
								WHERE contacts.Username = '$received_Username'";
							  
        $stmt_ExtractContact = $db->prepare($sql_ExtractContact);
		
		$stmt_ExtractContact->execute();
		
		// Checks if any 
		$result = $stmt_ExtractContact->rowCount();
		
		// Creates a 2D array for all contacts for the user requested.
		$contactArr = $stmt_ExtractContact->fetchAll(\PDO::FETCH_ASSOC);
		
		$arrSize = count($contactArr);
		
		// TO-DO: Edit the code below so that you assign each array value to a json package.
		// More than likely use a for loop? 
		
		$firstName = $contactArr[0]["FirstName"];
		$lastName = $contactArr[0]["lastName"];
		$email = $contactArr[0]["Email"];
		$phone = $contactArr[0]["Phone"];
		$address = $contactArr[0]["Address"];
		$city = $contactArr[0]["City"];
		$state = $contactArr[0]["State"];
		$zipCode = $contactArr[0]["ZipCode"];
		$notes = $contactArr[0]["Notes"];
    }
	
    catch(Exception $e){
        // Chenged it, so that it tells you the exact exception.
        throw $e;
    }
    
	// Check if there were any items were modified.
    if($result == 0){
        returnWithError("Failed to create a contact.");
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