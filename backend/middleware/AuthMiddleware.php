<?php

class AuthMiddleware {
    public static function handle(): array {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            Response::error('Token de autorização não fornecido.', 401);
        }

        $token = substr($authHeader, 7);
        $payload = JWT::decode($token);

        if (!$payload) {
            Response::error('Token inválido ou expirado.', 401);
        }

        return $payload;
    }

    public static function requireAdmin(): array {
        $payload = self::handle();
        if ($payload['role'] !== 'admin') {
            Response::error('Acesso negado. Requer privilégios de administrador.', 403);
        }
        return $payload;
    }
}
