-- ============================================
-- CRIAÇÃO DA BASE DE DADOS
-- ============================================

CREATE DATABASE IF NOT EXISTS sistema_previsao_tempo;
USE sistema_previsao_tempo;

-- ============================================
-- TABELA: utilizadores
-- ============================================

CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    nome VARCHAR(100) NOT NULL,
    
    email VARCHAR(150) NOT NULL UNIQUE,
    
    senha VARCHAR(255) NOT NULL,
    
    role ENUM('admin', 'utilizador') DEFAULT 'utilizador',
    
    token_recuperacao VARCHAR(255) DEFAULT NULL,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABELA: cidades_favoritas
-- ============================================

CREATE TABLE cidades_favoritas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    utilizador_id INT NOT NULL,
    
    nome_cidade VARCHAR(100) NOT NULL,
    
    pais VARCHAR(100) NOT NULL,
    
    adicionada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cidade_utilizador
        FOREIGN KEY (utilizador_id)
        REFERENCES utilizadores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- TABELA: historico_consultas
-- ============================================

CREATE TABLE historico_consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    utilizador_id INT NOT NULL,
    
    cidade_consultada VARCHAR(100) NOT NULL,
    
    temperatura DECIMAL(5,2),
    
    clima VARCHAR(100),
    
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_historico_utilizador
        FOREIGN KEY (utilizador_id)
        REFERENCES utilizadores(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- ============================================
-- DADOS DE TESTE (SEEDS)
-- ============================================

-- UTILIZADORES

INSERT INTO utilizadores (
    nome,
    email,
    senha,
    role,
    token_recuperacao
)
VALUES
(
    'Administrador',
    'admin@tempo.com',
    '123456',
    'admin',
    NULL
),
(
    'Joao Silva',
    'joao@gmail.com',
    '123456',
    'utilizador',
    'TOKEN123'
),
(
    'Maria Costa',
    'maria@gmail.com',
    '123456',
    'utilizador',
    NULL
);

-- CIDADES FAVORITAS

INSERT INTO cidades_favoritas (
    utilizador_id,
    nome_cidade,
    pais
)
VALUES
(2, 'Luanda', 'Angola'),
(2, 'Lisboa', 'Portugal'),
(3, 'Rio de Janeiro', 'Brasil');

-- HISTÓRICO DE CONSULTAS

INSERT INTO historico_consultas (
    utilizador_id,
    cidade_consultada,
    temperatura,
    clima
)
VALUES
(2, 'Luanda', 28.50, 'Ensolarado'),
(2, 'Lisboa', 19.00, 'Nublado'),
(3, 'Rio de Janeiro', 31.20, 'Quente'),
(3, 'Benguela', 26.00, 'Parcialmente nublado');

-- ============================================
-- OPERAÇÕES CRUD BÁSICAS
-- ============================================

-- ============================================
-- CRUD: UTILIZADORES
-- ============================================

-- CREATE
INSERT INTO utilizadores (
    nome,
    email,
    senha,
    role
)
VALUES (
    'Carlos Mendes',
    'carlos@gmail.com',
    '123456',
    'utilizador'
);

-- READ
SELECT * FROM utilizadores;

-- UPDATE
UPDATE utilizadores
SET nome = 'Carlos Manuel Mendes'
WHERE id = 4;

-- DELETE
DELETE FROM utilizadores
WHERE id = 4;

-- ============================================
-- CRUD: CIDADES FAVORITAS
-- ============================================

-- CREATE
INSERT INTO cidades_favoritas (
    utilizador_id,
    nome_cidade,
    pais
)
VALUES (
    2,
    'Paris',
    'França'
);

-- READ
SELECT * FROM cidades_favoritas;

-- UPDATE
UPDATE cidades_favoritas
SET nome_cidade = 'Porto'
WHERE id = 2;

-- DELETE
DELETE FROM cidades_favoritas
WHERE id = 2;

-- ============================================
-- CRUD: HISTORICO CONSULTAS
-- ============================================

-- CREATE
INSERT INTO historico_consultas (
    utilizador_id,
    cidade_consultada,
    temperatura,
    clima
)
VALUES (
    2,
    'Dubai',
    40.00,
    'Muito quente'
);

-- READ
SELECT * FROM historico_consultas;

-- UPDATE
UPDATE historico_consultas
SET temperatura = 38.50
WHERE id = 1;

-- DELETE
DELETE FROM historico_consultas
WHERE id = 1;

-- ============================================
-- CONSULTAS COM JOIN
-- ============================================

-- LISTAR UTILIZADORES E SUAS CIDADES FAVORITAS

SELECT
    u.nome,
    u.email,
    c.nome_cidade,
    c.pais
FROM utilizadores u
INNER JOIN cidades_favoritas c
ON u.id = c.utilizador_id;

-- LISTAR HISTÓRICO DE CONSULTAS

SELECT
    u.nome,
    h.cidade_consultada,
    h.temperatura,
    h.clima,
    h.data_consulta
FROM utilizadores u
INNER JOIN historico_consultas h
ON u.id = h.utilizador_id;