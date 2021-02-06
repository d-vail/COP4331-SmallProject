<?php
    include("../class/DBConnection.php");
    
    $inData = getRequestInfo();
    
    $username = $inData["Username"];
    $name = $inData["name"];
    
    $db = new DBConnection();
    $db = $db->getConnection();

    try
    {
        $sql = "SELECT *
                FROM Contacts
                WHERE Username = :username AND CONCAT(FirstName, ' ',LastName) LIKE %$name%";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

    }
    catch(Exception $e)
    {
        throw $e;
    }

    if(!(empty($result)))
    {
        $result = json_encode($result);
        sendResultInfoAsJson($result);
    }
    else
    {
        returnWithError("No results found.");
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