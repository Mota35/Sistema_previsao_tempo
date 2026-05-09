<?php

class UtilizadorModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByEmail(string $email): ?array {
        $stmt = $this->db->prepare('SELECT * FROM utilizadores WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare('SELECT id, nome, email, role, criado_em FROM utilizadores WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function create(string $nome, string $email, string $senha, string $role = 'utilizador'): int {
        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare(
            'INSERT INTO utilizadores (nome, email, senha, role, criado_em) VALUES (?, ?, ?, ?, NOW())'
        );
        $stmt->execute([$nome, $email, $hash, $role]);
        return (int) $this->db->lastInsertId();
    }

    public function emailExists(string $email): bool {
        $stmt = $this->db->prepare('SELECT id FROM utilizadores WHERE email = ?');
        $stmt->execute([$email]);
        return (bool) $stmt->fetch();
    }

    public function setTokenRecuperacao(int $id, string $token): void {
        $stmt = $this->db->prepare('UPDATE utilizadores SET token_recuperacao = ? WHERE id = ?');
        $stmt->execute([$token, $id]);
    }

    public function findByToken(string $token): ?array {
        $stmt = $this->db->prepare('SELECT * FROM utilizadores WHERE token_recuperacao = ?');
        $stmt->execute([$token]);
        return $stmt->fetch() ?: null;
    }

    public function updateSenha(int $id, string $novaSenha): void {
        $hash = password_hash($novaSenha, PASSWORD_BCRYPT);
        $stmt = $this->db->prepare(
            'UPDATE utilizadores SET senha = ?, token_recuperacao = NULL WHERE id = ?'
        );
        $stmt->execute([$hash, $id]);
    }

    public function all(): array {
        return $this->db->query(
            'SELECT id, nome, email, role, criado_em FROM utilizadores ORDER BY criado_em DESC'
        )->fetchAll();
    }
}
