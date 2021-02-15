<?php

require "../../vendor/autoload.php";
require "../class/Response.php";
require "../class/Auth.php";
require __DIR__ . "/../config.php";

use Aws\S3\S3Client;

$inData = getRequestInfo();
Auth::authenticate($inData["Username"], 'uploadImage');

function uploadImage()
{
    $inData = getRequestInfo();

    // Configure client to access Spaces.
    $client = new Aws\S3\S3Client([
        'version' => 'latest',
        'region' => 'us-east-1',
        'endpoint' => 'https://nyc3.digitaloceanspaces.com',
        'credentials' => [
            'key' => SPACES_KEY,
            'secret' => SPACES_SECRET,
        ],
    ]);

    // Upload a file to Spaces
    $result = $client->putObject([
        'Bucket' => 'contaq-spaces',
        'Key' => date('YmdHis').'-'.$inData["Filename"],
        'SourceFile' => $inData["URL"],
        'ACL' => 'public-read',
    ]);

    // Get the URL the object can be downloaded from
    Response::send(200, [
        "SpacesURL" => $result['ObjectURL'],
    ]);
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}
