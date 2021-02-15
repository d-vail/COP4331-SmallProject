<?php

require "../../vendor/autoload.php";
require __DIR__ . "/../config.php";

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
            "iat" => $date_issued,
            "exp" => $date_issued + (AUTH_EXPIRATION * 60),
            "payload" => $payload,
        ];

        $jwt = JWT::encode($token, SECRET_KEY);
        return $jwt;
    }

    /**
     * Decodes a JWT string.
     *
     * @param string $jwt       The JWT
     * @return array|boolean    The JWT's payload as an associative array or false if the JWT was
     *                          invalid
     */
    public static function decodeJWT($jwt)
    {
        try {
            $decoded = JWT::decode($jwt, SECRET_KEY, array('HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Authenticate the user before allowing the given action to be performed.
     * 
     * @param string   $user    The username of the user who wants access to the endpoint
     * @param function $action  The function to be executed if user is authorized
     */
    public static function authenticate($user, $action)
    {
        $headers = array_change_key_case(apache_request_headers(), CASE_LOWER);

        if (isset($headers['authorization'])) {
            $authHeader = explode(" ", $headers['authorization']);
            $jwt = count($authHeader) < 2 ? $authHeader[0] : $authHeader[1];
            $jwtPayload = Auth::decodeJWT($jwt);

            if (!$jwtPayload) {
                Response::send(401, [
                    "Error" => "This request requires user authentication.",
                ]);
            } elseif ($jwtPayload['payload']->Username != $user) {
                Response::send(403, [
                    "Error" => "This user is not authorized to perform this operation.",
                ]);
            } else {
                $action();
            }
        } else {
            Response::send(401, [
                "Error" => "This request requires user authentication.",
            ]);
        }
    }
}
