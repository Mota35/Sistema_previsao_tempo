<?php
declare(strict_types=1);

// ─── CORS ────────────────────────────────────────────────────────────────────
header('Access-Control-Allow-Origin: http://localhost:4200'); // Angular dev
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── AUTOLOAD ────────────────────────────────────────────────────────────────
$autoload = [
    __DIR__ . '/config/database.php',
    __DIR__ . '/helpers/JWT.php',
    __DIR__ . '/helpers/Response.php',
    __DIR__ . '/middleware/AuthMiddleware.php',
    __DIR__ . '/models/UtilizadorModel.php',
    __DIR__ . '/models/CidadeFavoritaModel.php',
    __DIR__ . '/models/HistoricoModel.php',
    __DIR__ . '/services/WeatherService.php',
    __DIR__ . '/controllers/AuthController.php',
    __DIR__ . '/controllers/CidadesFavoritasController.php',
    __DIR__ . '/controllers/WeatherController.php',
];
foreach ($autoload as $file) require_once $file;

// ─── ROUTER ──────────────────────────────────────────────────────────────────
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri    = rtrim($uri, '/');

// Strip base prefix if running in a sub-folder, e.g. /backend
// $uri = preg_replace('#^/backend#', '', $uri);

function matchRoute(string $pattern, string $uri, array &$params): bool {
    $regex = preg_replace('#\{(\w+)\}#', '([^/]+)', $pattern);
    if (preg_match("#^{$regex}$#", $uri, $matches)) {
        array_shift($matches);
        $params = $matches;
        return true;
    }
    return false;
}

$params = [];

try {
    // ── AUTH ─────────────────────────────────────────────────────────────────
    if ($method === 'POST' && $uri === '/auth/register') {
        (new AuthController)->register();

    } elseif ($method === 'POST' && $uri === '/auth/login') {
        (new AuthController)->login();

    } elseif ($method === 'POST' && $uri === '/auth/logout') {
        (new AuthController)->logout();

    } elseif ($method === 'GET' && $uri === '/auth/me') {
        (new AuthController)->me();

    } elseif ($method === 'POST' && $uri === '/auth/recuperar-senha') {
        (new AuthController)->recuperarSenha();

    } elseif ($method === 'POST' && $uri === '/auth/redefinir-senha') {
        (new AuthController)->redefinirSenha();

    // ── CIDADES FAVORITAS ─────────────────────────────────────────────────────
    } elseif ($method === 'GET' && $uri === '/cidades-favoritas/exportar') {
        (new CidadesFavoritasController)->exportar();

    } elseif ($method === 'GET' && $uri === '/cidades-favoritas') {
        (new CidadesFavoritasController)->index();

    } elseif ($method === 'POST' && $uri === '/cidades-favoritas') {
        (new CidadesFavoritasController)->store();

    } elseif ($method === 'GET' && matchRoute('/cidades-favoritas/{id}', $uri, $params)) {
        (new CidadesFavoritasController)->show((int)$params[0]);

    } elseif ($method === 'PUT' && matchRoute('/cidades-favoritas/{id}', $uri, $params)) {
        (new CidadesFavoritasController)->update((int)$params[0]);

    } elseif ($method === 'DELETE' && matchRoute('/cidades-favoritas/{id}', $uri, $params)) {
        (new CidadesFavoritasController)->destroy((int)$params[0]);

    // ── WEATHER ───────────────────────────────────────────────────────────────
    } elseif ($method === 'GET' && $uri === '/weather') {
        (new WeatherController)->current();

    } elseif ($method === 'GET' && $uri === '/weather/previsao') {
        (new WeatherController)->previsao();

    } elseif ($method === 'GET' && $uri === '/weather/coordenadas') {
        (new WeatherController)->porCoordenadas();

    } elseif ($method === 'GET' && $uri === '/weather/historico/exportar') {
        (new WeatherController)->exportarHistorico();

    } elseif ($method === 'GET' && $uri === '/weather/historico') {
        (new WeatherController)->historico();

    } elseif ($method === 'DELETE' && $uri === '/weather/historico') {
        (new WeatherController)->limparHistorico();

    // ── 404 ──────────────────────────────────────────────────────────────────
    } else {
        Response::error("Rota não encontrada: {$method} {$uri}", 404);
    }

} catch (PDOException $e) {
    Response::error('Erro de base de dados: ' . $e->getMessage(), 500);
} catch (Throwable $e) {
    Response::error('Erro interno: ' . $e->getMessage(), 500);
}
