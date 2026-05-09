<?php

class CidadeFavoritaModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function findByUser(int $utilizadorId): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM cidades_favoritas WHERE utilizador_id = ? ORDER BY adicionada_em DESC'
        );
        $stmt->execute([$utilizadorId]);
        return $stmt->fetchAll();
    }

    public function findById(int $id, int $utilizadorId): ?array {
        $stmt = $this->db->prepare(
            'SELECT * FROM cidades_favoritas WHERE id = ? AND utilizador_id = ?'
        );
        $stmt->execute([$id, $utilizadorId]);
        return $stmt->fetch() ?: null;
    }

    public function exists(int $utilizadorId, string $nomeCidade, string $pais): bool {
        $stmt = $this->db->prepare(
            'SELECT id FROM cidades_favoritas WHERE utilizador_id = ? AND nome_cidade = ? AND pais = ?'
        );
        $stmt->execute([$utilizadorId, $nomeCidade, $pais]);
        return (bool) $stmt->fetch();
    }

    public function create(int $utilizadorId, string $nomeCidade, string $pais): int {
        $stmt = $this->db->prepare(
            'INSERT INTO cidades_favoritas (utilizador_id, nome_cidade, pais, adicionada_em) VALUES (?, ?, ?, NOW())'
        );
        $stmt->execute([$utilizadorId, $nomeCidade, $pais]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, int $utilizadorId, string $nomeCidade, string $pais): bool {
        $stmt = $this->db->prepare(
            'UPDATE cidades_favoritas SET nome_cidade = ?, pais = ? WHERE id = ? AND utilizador_id = ?'
        );
        $stmt->execute([$nomeCidade, $pais, $id, $utilizadorId]);
        return $stmt->rowCount() > 0;
    }

    public function delete(int $id, int $utilizadorId): bool {
        $stmt = $this->db->prepare(
            'DELETE FROM cidades_favoritas WHERE id = ? AND utilizador_id = ?'
        );
        $stmt->execute([$id, $utilizadorId]);
        return $stmt->rowCount() > 0;
    }

    public function allForExport(int $utilizadorId): array {
        $stmt = $this->db->prepare(
            'SELECT cf.nome_cidade, cf.pais, cf.adicionada_em, u.nome AS utilizador, u.email
             FROM cidades_favoritas cf
             JOIN utilizadores u ON u.id = cf.utilizador_id
             WHERE cf.utilizador_id = ?
             ORDER BY cf.adicionada_em DESC'
        );
        $stmt->execute([$utilizadorId]);
        return $stmt->fetchAll();
    }
}
