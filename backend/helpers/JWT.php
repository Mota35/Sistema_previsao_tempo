<?php

class JWT {
    private static string $secret = 'YOUR_JWT_SECRET_KEY_CHANGE_IN_PRODUCTION';
    private static int    $expiry  = 86400; // 24 hours

    public static function encode(array $payload): string {
        $header    = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload['iat'] = time();
        $payload['exp'] = time() + self::$expiry;
        $payload   = base64url_encode(json_encode($payload));
        $signature = base64url_encode(
            hash_hmac('sha256', "$header.$payload", self::$secret, true)
        );
        return "$header.$payload.$signature";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $signature] = $parts;

        $expectedSig = base64url_encode(
            hash_hmac('sha256', "$header.$payload", self::$secret, true)
        );
        if (!hash_equals($expectedSig, $signature)) return null;

        $data = json_decode(base64url_decode($payload), true);
        if (!$data || $data['exp'] < time()) return null;

        return $data;
    }
}

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}
