<?php

class UserController {
    private UtilizadorModel $model;

    public function __construct() {
        $this->model = new UtilizadorModel();
    }

    // GET /auth/users  — Admin only
    public function index(): void {
        AuthMiddleware::requireAdmin();
        $users = $this->model->all();
        Response::success($users);
    }

    // GET /auth/users/{id}  — Admin only
    public function show(int $id): void {
        AuthMiddleware::requireAdmin();
        $user = $this->model->findById($id);
        if (!$user) Response::error('Utilizador não encontrado.', 404);
        Response::success($user);
    }

    // DELETE /auth/users/{id}  — Admin only
    public function destroy(int $id): void {
        $payload = AuthMiddleware::requireAdmin();
        if ($payload['id'] === $id) {
            Response::error('Não pode eliminar a própria conta.', 400);
        }
        $stmt = Database::getInstance()->prepare('DELETE FROM utilizadores WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) Response::error('Utilizador não encontrado.', 404);
        Response::success(null, 'Utilizador eliminado.');
    }

    // PUT /auth/users/{id}/role  — Admin only
    public function updateRole(int $id): void {
        AuthMiddleware::requireAdmin();
        $data = json_decode(file_get_contents('php://input'), true);
        $role = $data['role'] ?? '';
        if (!in_array($role, ['admin', 'utilizador'])) {
            Response::error('Role inválido. Use "admin" ou "utilizador".', 422);
        }
        $stmt = Database::getInstance()->prepare('UPDATE utilizadores SET role = ? WHERE id = ?');
        $stmt->execute([$role, $id]);
        if ($stmt->rowCount() === 0) Response::error('Utilizador não encontrado.', 404);
        Response::success(null, "Role actualizado para {$role}.");
    }
}
