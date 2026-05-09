<?php

class CidadesFavoritasController {
    private CidadeFavoritaModel $model;

    public function __construct() {
        $this->model = new CidadeFavoritaModel();
    }

    // GET /cidades-favoritas
    public function index(): void {
        $payload  = AuthMiddleware::handle();
        $cidades  = $this->model->findByUser($payload['id']);
        Response::success($cidades);
    }

    // GET /cidades-favoritas/{id}
    public function show(int $id): void {
        $payload = AuthMiddleware::handle();
        $cidade  = $this->model->findById($id, $payload['id']);
        if (!$cidade) Response::error('Cidade não encontrada.', 404);
        Response::success($cidade);
    }

    // POST /cidades-favoritas
    public function store(): void {
        $payload = AuthMiddleware::handle();
        $data    = json_decode(file_get_contents('php://input'), true);

        $nomeCidade = trim($data['nome_cidade'] ?? '');
        $pais       = trim($data['pais'] ?? '');

        if (!$nomeCidade || !$pais) {
            Response::error('nome_cidade e pais são obrigatórios.', 422);
        }

        if ($this->model->exists($payload['id'], $nomeCidade, $pais)) {
            Response::error('Cidade já adicionada aos favoritos.', 409);
        }

        $id     = $this->model->create($payload['id'], $nomeCidade, $pais);
        $cidade = $this->model->findById($id, $payload['id']);
        Response::success($cidade, 'Cidade adicionada aos favoritos.', 201);
    }

    // PUT /cidades-favoritas/{id}
    public function update(int $id): void {
        $payload = AuthMiddleware::handle();
        $data    = json_decode(file_get_contents('php://input'), true);

        $nomeCidade = trim($data['nome_cidade'] ?? '');
        $pais       = trim($data['pais'] ?? '');

        if (!$nomeCidade || !$pais) {
            Response::error('nome_cidade e pais são obrigatórios.', 422);
        }

        $updated = $this->model->update($id, $payload['id'], $nomeCidade, $pais);
        if (!$updated) Response::error('Cidade não encontrada ou sem permissão.', 404);

        $cidade = $this->model->findById($id, $payload['id']);
        Response::success($cidade, 'Cidade actualizada com sucesso.');
    }

    // DELETE /cidades-favoritas/{id}
    public function destroy(int $id): void {
        $payload = AuthMiddleware::handle();
        $deleted = $this->model->delete($id, $payload['id']);
        if (!$deleted) Response::error('Cidade não encontrada ou sem permissão.', 404);
        Response::success(null, 'Cidade removida dos favoritos.');
    }

    // GET /cidades-favoritas/exportar
    public function exportar(): void {
        $payload = AuthMiddleware::handle();
        $rows    = $this->model->allForExport($payload['id']);

        $csvRows = array_map(fn($r) => [
            $r['nome_cidade'],
            $r['pais'],
            $r['adicionada_em'],
            $r['utilizador'],
            $r['email'],
        ], $rows);

        Response::csv(
            'cidades_favoritas_' . date('Ymd_His') . '.csv',
            ['Cidade', 'País', 'Adicionada Em', 'Utilizador', 'Email'],
            $csvRows
        );
    }
}
