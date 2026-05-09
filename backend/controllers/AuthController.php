<?php

class AuthController {
    private UtilizadorModel $model;

    public function __construct() {
        $this->model = new UtilizadorModel();
    }

    // POST /auth/register
    public function register(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        $nome  = trim($data['nome']  ?? '');
        $email = trim($data['email'] ?? '');
        $senha = $data['senha'] ?? '';

        if (!$nome || !$email || !$senha) {
            Response::error('Campos nome, email e senha são obrigatórios.', 422);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Email inválido.', 422);
        }
        if (strlen($senha) < 6) {
            Response::error('A senha deve ter pelo menos 6 caracteres.', 422);
        }
        if ($this->model->emailExists($email)) {
            Response::error('Email já registado.', 409);
        }

        $id   = $this->model->create($nome, $email, $senha);
        $user = $this->model->findById($id);
        $token = JWT::encode(['id' => $id, 'email' => $email, 'role' => 'utilizador']);

        Response::success(['utilizador' => $user, 'token' => $token], 'Conta criada com sucesso.', 201);
    }

    // POST /auth/login
    public function login(): void {
        $data = json_decode(file_get_contents('php://input'), true);

        $email = trim($data['email'] ?? '');
        $senha = $data['senha'] ?? '';

        if (!$email || !$senha) {
            Response::error('Email e senha são obrigatórios.', 422);
        }

        $user = $this->model->findByEmail($email);
        if (!$user || !password_verify($senha, $user['senha'])) {
            Response::error('Credenciais inválidas.', 401);
        }

        $token = JWT::encode(['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);

        unset($user['senha'], $user['token_recuperacao']);
        Response::success(['utilizador' => $user, 'token' => $token], 'Login efectuado com sucesso.');
    }

    // POST /auth/logout
    public function logout(): void {
        // JWT is stateless; the client must discard the token.
        Response::success(null, 'Sessão terminada com sucesso.');
    }

    // GET /auth/me
    public function me(): void {
        $payload = AuthMiddleware::handle();
        $user    = $this->model->findById($payload['id']);
        if (!$user) Response::error('Utilizador não encontrado.', 404);
        Response::success($user);
    }

    // POST /auth/recuperar-senha
    public function recuperarSenha(): void {
        $data  = json_decode(file_get_contents('php://input'), true);
        $email = trim($data['email'] ?? '');

        if (!$email) Response::error('Email é obrigatório.', 422);

        $user = $this->model->findByEmail($email);
        if (!$user) {
            // Do not reveal whether the email exists
            Response::success(null, 'Se o email existir, receberá instruções de recuperação.');
        }

        $token = bin2hex(random_bytes(32));
        $this->model->setTokenRecuperacao($user['id'], $token);

        // In production, send this token by email. Here we return it for testing.
        Response::success(['token_recuperacao' => $token], 'Token de recuperação gerado.');
    }

    // POST /auth/redefinir-senha
    public function redefinirSenha(): void {
        $data      = json_decode(file_get_contents('php://input'), true);
        $token     = $data['token'] ?? '';
        $novaSenha = $data['nova_senha'] ?? '';

        if (!$token || !$novaSenha) {
            Response::error('Token e nova_senha são obrigatórios.', 422);
        }
        if (strlen($novaSenha) < 6) {
            Response::error('A senha deve ter pelo menos 6 caracteres.', 422);
        }

        $user = $this->model->findByToken($token);
        if (!$user) Response::error('Token inválido ou expirado.', 400);

        $this->model->updateSenha($user['id'], $novaSenha);
        Response::success(null, 'Senha redefinida com sucesso.');
    }
}
