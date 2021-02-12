<?php
require "../../vendor/autoload.php";
use \Firebase\JWT\JWT;

class Auth
{
    /**
     * Convert the given array into a JWT string.
     *
     * @param  array  $payload      An array of user data to be included in the JWT
     * @return string A signed JWT
     */
    public static function getJWT($payload)
    {   
        $date_issued = time();
        $token = [
            "iat"     => $date_issued,
            "exp"     => $date_issued + (getenv('AUTH_EXPIRATION') * 60),
            "payload" => $payload,
        ];

        $jwt = JWT::encode($token, getenv('SECRET_KEY'));

        return $jwt;
    }
}