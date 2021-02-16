<?php
require "../class/DBConnection.php";
require "../class/Response.php";
require "../class/Auth.php";

Auth::authenticate($_GET["Username"], 'searchContacts');

function searchContacts()
{
    $username = $_GET["Username"];
    $name = $_GET["Name"];

    $db = new DBConnection();
    $db = $db->getConnection();

    // Query to Count and return total number of rows
    try
    {
        $sql = "SELECT COUNT(*) AS count
                FROM Contacts
                WHERE Username = :username AND CONCAT(FirstName, ' ',LastName) LIKE CONCAT('%', :name, '%')";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR, 255);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR, 255);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        throw $e;
    }

    $perPage = 15;
    $totalContacts = (int) $result['count'];
    $totPages = ceil($totalContacts / $perPage);

    if ($totPages < 1) {
        $totPages = 1;
    }

    if (isset($_GET['Page'])) {
        $currPage = $_GET['Page'];
    } else {
        $currPage = 1;
    }

    $offset = ($currPage - 1) * $perPage;

    // handles case where total number of pages is only 1
    if ($totPages == 1) {
        $next = null;
        $prev = null;
    } else if ($currPage < $totPages) {
        // if current page is 1 then prev is null
        if ($currPage == 1) {
            $next = "/api/contact/searchContact.php?Username=" . $username . "&Name=" . $name . "&Page=" . ($currPage + 1); // link and currPage + 1
            $prev = null;
        } else {
            $next = "/api/contact/searchContact.php?Username=" . $username . "&Name=" . $name . "&Page=" . ($currPage + 1);
            $prev = "/api/contact/searchContact.php?Username=" . $username . "&Name=" . $name . "&Page=" . ($currPage - 1);
        }
    } else if ($currPage == $totPages) {
        $next = null;
        $prev = "/api/contact/searchContact.php?Username=" . $username . "&Name=" . $name . "&Page=" . ($currPage - 1);
    }

    // Query to select limited amount of contacts to display on a page
    try
    {
        $sql = "SELECT *
                FROM Contacts
                WHERE Username = :username AND CONCAT(FirstName, ' ',LastName) LIKE CONCAT('%', :name, '%')
                LIMIT :perPage
                OFFSET :offset";

        $stmt = $db->prepare($sql);
        $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':perPage', $perPage, PDO::PARAM_INT);
        $stmt->execute();
        $result2 = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (Exception $e) {
        Response::send(500, [
            "Error" => "Could not search contact details. Please try again.",
        ]);
    }

    // set up necessary key : value pairs
    $arr = [
        "count" => $totalContacts,
        "pages" => $totPages,
        "current" => $currPage,
        "next" => $next,
        "prev" => $prev,
        "results" => $result2,
    ];

    Response::send(200, $arr);
}