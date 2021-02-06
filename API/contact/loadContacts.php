<?php
    
    include("../class/DBConnection.php");
     
    $username = $_GET["Username"];
    $db = new DBConnection();
    $db = $db->getConnection();

    // Query to Count and return total number of rows
    try
    {
        $sql = "SELECT COUNT(*) AS count
                FROM Contacts
                WHERE Username = :username";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    }
    catch(Exception $e)
    {
        throw $e;
    }
    
    $perPage = 15;
    $totalContacts = (int)$result['count'];
    $totPages = ceil($totalContacts / $perPage);
    
    if($totPages < 1)
    {
        $totPages = 1;
    }

    if(isset($_GET['page']))
    {
        $currPage = $_GET['page'];
    }
    else
    {
        $currPage = 1;
    }

    $offset = ($currPage - 1) * $perPage;
    //echo $offset;
    // handles case where total number of pages is only 1
    if($totPages == 1)
    {
        $next = null;
        $prev = null;
    }
    else if($currPage < $totPages)
    {
        // if current page is 1 then prev is null
        if($currPage == 1)
        {
            $next = "/API/contact/loadContacts?page=". ($currPage + 1); // link and currPage + 1
            $prev = null;
        }
        else
        {
            $next = "/API/contact/loadContacts?page=". ($currPage + 1); 
            $prev ="/API/contact/loadContacts?page=". ($currPage - 1);
        }
    }
    else if($currPage == $totPages)
    {
        $next = null;
        $prev = "/API/contact/loadContacts?page=". ($currPage - 1);
    }
    // Query to select limited amount of contacts to display on a page

    try
    {
        $sql = "SELECT *
                FROM Contacts
                WHERE Username = :username
                LIMIT :perPage
                OFFSET :offset" ;
       
        $stmt = $db->prepare($sql);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, FALSE);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':perPage', $perPage, PDO::PARAM_INT);
        $stmt->execute();
        $result2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    catch(Exception $e)
    {
        throw $e;
    }
    // set up necessary key : value pairs
    $arr = [
        "count" => $totalContacts,
        "pages" => $totPages,
        "current" => $currPage,
        "next" => $next,
        "prev" => $prev,
        "results" => $result2
    ];
   
    $arr = json_encode($arr);
    sendResultInfoAsJson($arr);

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