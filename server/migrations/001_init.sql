-- Fine-ance Database Initialization
-- Run this migration to create the base schema

CREATE DATABASE IF NOT EXISTS fineance
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fineance;

-- ============================================
-- TABLE: categories (FIXED — seeded at setup)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL UNIQUE,
    type       ENUM('income', 'expense') NOT NULL,
    color_hex  CHAR(7)       NOT NULL,
    sort_order SMALLINT      NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLE: transactions
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id   INT UNSIGNED   NOT NULL,
    amount        DECIMAL(12,2)  NOT NULL,
    description   VARCHAR(255)   DEFAULT NULL,
    entry_date    DATE           NOT NULL,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_entry_date (entry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
