<?php
class Response
{
    /**
     * Send a new HTTP response.
     *
     * @param  int    $status
     * @param  array  $content
     * @return void
     */
    public static function send($status, $content)
    {
        http_response_code($status);
        header('Content-Type: application/json');
        
        if ($content)
            echo json_encode($content);
    }
}
