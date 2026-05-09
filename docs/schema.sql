-- ─────────────────────────────────────────────────────────────────────────────
-- Schema: weather_app
-- ─────────────────────────────────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS weather_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE weather_app;

-- Utilizadores
CREATE TABLE IF NOT EXISTS utilizadores (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome               VARCHAR(100)  NOT NULL,
    email              VARCHAR(150)  NOT NULL UNIQUE,
    senha              VARCHAR(255)  NOT NULL,
    role               ENUM('admin','utilizador') NOT NULL DEFAULT 'utilizador',
    token_recuperacao  VARCHAR(100)  NULL,
    criado_em          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Cidades Favoritas
CREATE TABLE IF NOT EXISTS cidades_favoritas (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilizador_id  INT UNSIGNED NOT NULL,
    nome_cidade    VARCHAR(100) NOT NULL,
    pais           VARCHAR(5)   NOT NULL,
    adicionada_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_city (utilizador_id, nome_cidade, pais)
) ENGINE=InnoDB;

-- Histórico de Consultas
CREATE TABLE IF NOT EXISTS historico_consultas (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    utilizador_id    INT UNSIGNED NOT NULL,
    cidade_consultada VARCHAR(100) NOT NULL,
    temperatura      DECIMAL(5,2) NOT NULL,
    clima            VARCHAR(100) NOT NULL,
    data_consulta    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilizador_id) REFERENCES utilizadores(id) ON DELETE CASCADE,
    INDEX idx_user_date (utilizador_id, data_consulta)
) ENGINE=InnoDB;

-- Admin seed (password: admin123)
INSERT IGNORE INTO utilizadores (nome, email, senha, role)
VALUES ('Administrador', 'admin@weatherapp.com',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
