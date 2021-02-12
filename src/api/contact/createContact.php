<?php
    include("../class/DBConnection.php");

    $inData = getRequestInfo();

    $db = new DBConnection();
    $db = $db->getConnection();

    //username that is creating a contact must be added so we can track finding a contact
    $username = $inData["Username"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $emailaddress = $inData["Email"];
    $phoneNum = $inData["Phone"];
    $streetAddress = $inData["Address"];
    $city = $inData["City"];
    $state = $inData["State"];
    $zipcode = $inData["ZipCode"];
    $notes = $inData["Notes"];

    try{
        $sql = "INSERT INTO Contacts(Username,FirstName, LastName, Email, Phone, Address
                                     City, State, ZipCode, Notes)
                              VALUES(:Username, :FirstName, :LastName, :Email, :Phone, :Address
                                    :City, :State, :ZipCode, :Notes)";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':Username', $username , PDO::PARAM_STR, 255);
        $stmt->bindParam(':FirstName', $firstName , PDO::PARAM_STR, 255);
        $stmt->bindParam(':LastName', $lastName , PDO::PARAM_STR, 255);
        $stmt->bindParam(':Email', $Email, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Phone', $phoneNum, PDO::PARAM_STR, 255);
        $stmt->bindParam(':streetAddress', $streetAddress, PDO::PARAM_STR, 255);
        $stmt->bindParam(':City', $city, PDO::PARAM_STR, 255);
        $stmt->bindParam(':State', $state, PDO::PARAM_STR, 255);
        $stmt->bindParam(':ZipCode', $zipcode, PDO::PARAM_STR, 255);
        $stmt->bindParam(':Notes', $notes, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->rowCount();
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
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