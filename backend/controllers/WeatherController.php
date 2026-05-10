<?php

class WeatherController {
    private WeatherService  $service;
    private HistoricoModel  $historico;

    public function __construct() {
        $this->service   = new WeatherService();
        $this->historico = new HistoricoModel();
    }

    // GET /weather?cidade=Luanda&pais=AO
    public function current(): void {
        $payload = AuthMiddleware::handle();

        $cidade = trim($_GET['cidade'] ?? '');
        $pais   = trim($_GET['pais']   ?? '');

        if (!$cidade) Response::error('Parâmetro "cidade" é obrigatório.', 422);

        try {
            $raw    = $this->service->getCurrentWeather($cidade, $pais ?: null);
            $parsed = $this->service->parse($raw);

            // Persist in history
            $this->historico->create(
                $payload['id'],
                $parsed['cidade'],
                $parsed['temperatura'],
                $parsed['clima']
            );

            Response::success($parsed);
        } catch (RuntimeException $e) {
            $code = $e->getCode() ?: 502;
            Response::error($e->getMessage(), $code);
        }
    }

    // GET /weather/previsao?cidade=Luanda&pais=AO
    public function previsao(): void {
        AuthMiddleware::handle();

        $cidade = trim($_GET['cidade'] ?? '');
        $pais   = trim($_GET['pais']   ?? '');

        if (!$cidade) Response::error('Parâmetro "cidade" é obrigatório.', 422);

        try {
            $data = $this->service->getForecast($cidade, $pais ?: null);
            Response::success($data);
        } catch (RuntimeException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 502);
        }
    }

    // GET /weather/coordenadas?lat=...&lon=...
    public function porCoordenadas(): void {
        AuthMiddleware::handle();

        $lat = $_GET['lat'] ?? '';
        $lon = $_GET['lon'] ?? '';

        if ($lat === '' || $lon === '') {
            Response::error('Parâmetros "lat" e "lon" são obrigatórios.', 422);
        }

        try {
            $raw    = $this->service->getWeatherByCoords((float)$lat, (float)$lon);
            $parsed = $this->service->parse($raw);
            Response::success($parsed);
        } catch (RuntimeException $e) {
            Response::error($e->getMessage(), $e->getCode() ?: 502);
        }
    }

    // GET /weather/historico
    public function historico(): void {
        $payload  = AuthMiddleware::handle();
        $limit    = (int)($_GET['limit'] ?? 50);

        // Admin sees all users' history
        if ($payload['role'] === 'admin') {
            $registos = $this->historico->allGlobal($limit);
        } else {
            $registos = $this->historico->findByUser($payload['id'], $limit);
        }

        Response::success($registos);
    }

    // DELETE /weather/historico
    public function limparHistorico(): void {
        $payload = AuthMiddleware::handle();
        $this->historico->deleteByUser($payload['id']);
        Response::success(null, 'Histórico eliminado com sucesso.');
    }

    // GET /weather/historico/exportar
    public function exportarHistorico(): void {
        $payload  = AuthMiddleware::handle();
        $rows     = $this->historico->allForExport($payload['id']);

        $csvRows = array_map(fn($r) => [
            $r['cidade_consultada'],
            $r['temperatura'],
            $r['clima'],
            $r['data_consulta'],
            $r['utilizador'],
            $r['email'],
        ], $rows);

        Response::csv(
            'historico_consultas_' . date('Ymd_His') . '.csv',
            ['Cidade', 'Temperatura (°C)', 'Clima', 'Data', 'Utilizador', 'Email'],
            $csvRows
        );
    }
}
