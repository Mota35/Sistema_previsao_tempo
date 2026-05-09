<?php

class HistoricoModel {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create(int $utilizadorId, string $cidade, float $temperatura, string $clima): int {
        $stmt = $this->db->prepare(
            'INSERT INTO historico_consultas (utilizador_id, cidade_consultada, temperatura, clima, data_consulta)
             VALUES (?, ?, ?, ?, NOW())'
        );
        $stmt->execute([$utilizadorId, $cidade, $temperatura, $clima]);
        return (int) $this->db->lastInsertId();
    }

    public function findByUser(int $utilizadorId, int $limit = 50): array {
        $stmt = $this->db->prepare(
            'SELECT * FROM historico_consultas WHERE utilizador_id = ? ORDER BY data_consulta DESC LIMIT ?'
        );
        $stmt->execute([$utilizadorId, $limit]);
        return $stmt->fetchAll();
    }

    public function deleteByUser(int $utilizadorId): void {
        $stmt = $this->db->prepare('DELETE FROM historico_consultas WHERE utilizador_id = ?');
        $stmt->execute([$utilizadorId]);
    }

    public function allForExport(int $utilizadorId): array {
        $stmt = $this->db->prepare(
            'SELECT h.cidade_consultada, h.temperatura, h.clima, h.data_consulta,
                    u.nome AS utilizador, u.email
             FROM historico_consultas h
             JOIN utilizadores u ON u.id = h.utilizador_id
             WHERE h.utilizador_id = ?
             ORDER BY h.data_consulta DESC'
        );
        $stmt->execute([$utilizadorId]);
        return $stmt->fetchAll();
    }
}
