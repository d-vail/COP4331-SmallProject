<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    // Fields sent by the frontend.
    $received_Username = $inData["Username"];
    $ID = $inData["ID"];
	$received_FirstName = $inData["FirstName"];
    $received_LastName = $inData["LastName"];
    $received_Email = $inData["Email"];
    $received_Phone = $inData["Phone"];
    $received_Address = $inData["Address"];
    $received_City = $inData["City"];
    $received_State = $inData["State"];
    $received_ZipCode = $inData["ZipCode"];
    $received_Notes = $inData["Notes"];
	
    // Query the current values of the DB for the contact to be updated.
	// Compare current values with values passed from the front-end.
	// Update the differences.
    try{
		
        $sql_ExtractContact = "SELECT FirstName, lastName, Email, Phone, Address, City, State, ZipCode, Notes 
								FROM contacts 
								WHERE contacts.ID = $ID AND contacts.Username = '$received_Username'";
							  
        $stmt_ExtractContact = $db->prepare($sql_ExtractContact);
		
		$stmt_ExtractContact->execute();
		
        //$stmt->execute();
        //$result = $stmt->rowCount();
		
		// Creates an array with the current fields values, in the DB, for the contact to be updated.
		$contactArr = $stmt_ExtractContact->fetchAll(\PDO::FETCH_ASSOC);
		
		// TO-DO: Maybe add a check to see if there is more than a contact (This should never happen).
		
		// Check the content of the update request from the front-end.
		// If the received fields are empty then keep the current values in the DB.
		// This is achieved by setting the respective variable, to be updated, to the value
		// in the DB.
		if ($received_FirstName == '') {
			$received_FirstName = $contactArr[0]["FirstName"];
		}
		if ($received_LastName == '') {
			$received_LastName = $contactArr[0]["lastName"];
		}
		if ($received_Email == '') {
			$received_Email = $contactArr[0]["Email"];
		}
		if ($received_Phone == '') {
			$received_Phone = $contactArr[0]["Phone"];
		}
		if ($received_Address == '') {
			$received_Address = $contactArr[0]["Address"];
		}
		if ($received_City == '') {
			$received_City = $contactArr[0]["City"];
		}
		if ($received_State == '') {
			$received_State = $contactArr[0]["State"];
		}
		if ($received_ZipCode == '') {
			$received_ZipCode = $contactArr[0]["ZipCode"];
		}
		if ($received_Notes == '') {
			$received_Notes = $contactArr[0]["Notes"];
		}
		
		$sql_UpdateContact = "UPDATE contacts 
								SET FirstName = '$received_FirstName' , lastName = '$received_LastName' , 
								Email = '$received_Email' , Phone = '$received_Phone' , Address = '$received_Address' , 
								City = '$received_City' , State = '$received_State' , ZipCode = '$received_ZipCode' , 
								Notes = '$received_Notes'
								WHERE contacts.ID = $ID AND contacts.Username = '$received_Username'";
							  
        $stmt_UpdateContact = $db->prepare($sql_UpdateContact);
		
		$stmt_UpdateContact->execute();
		
        $result = $stmt_UpdateContact->rowCount();
    }
	
    catch(Exception $e){
        throw $e;
		// TO-DO: handle already exisiting email, when updating a contact. Email is unique.
    }
    
	// Check if there were any items modified.
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