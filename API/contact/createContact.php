<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    //username that is creating a contact must be added so we can track finding a contact
    $username = $inData["Username"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $email = $inData["Email"];
    $phoneNum = $inData["Phone"];
    $streetAddress = $inData["Address"];
    $city = $inData["City"];
    $state = $inData["State"];
    $zipcode = $inData["Zipcode"];
    $notes = $inData["Notes"];

    try{
		
		// ID is automatically assigned if Auto Increse is set on the DB.
		// username is a foreign key from the users table. This way you can only insert a contact to an user that exists.
        $sql = "INSERT INTO Contacts(Username,FirstName, LastName, Email, Phone, Address,
                                     City, State, Zipcode, Notes)
                              VALUES(?,?,?,?,?,?,
							  ?,?,?,?)";
							  
        $stmt = $db->prepare($sql);
		
        $stmt->bindParam(1, $username , PDO::PARAM_STR, 255);
        $stmt->bindParam(2, $firstName , PDO::PARAM_STR, 255);
        $stmt->bindParam(3, $lastName , PDO::PARAM_STR, 255);
        $stmt->bindParam(4, $email, PDO::PARAM_STR, 255);
        $stmt->bindParam(5, $phoneNum, PDO::PARAM_STR, 255);
        $stmt->bindParam(6, $streetAddress, PDO::PARAM_STR, 255);
        $stmt->bindParam(7, $city, PDO::PARAM_STR, 255);
        $stmt->bindParam(8, $state, PDO::PARAM_STR, 255);
        $stmt->bindParam(9, $zipcode, PDO::PARAM_STR, 255);
        $stmt->bindParam(10, $notes, PDO::PARAM_STR, 255);
		
        $stmt->execute();
        $result = $stmt->rowCount();
    }
    catch(Exception $e){
        // Chenged it, so that it tells you the exact exception.
        throw $e;
    }
    
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