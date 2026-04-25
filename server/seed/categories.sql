-- Fine-ance Category Seed Data
-- These categories are FIXED and cannot be modified by users

USE fineance;

INSERT INTO categories (name, type, color_hex, sort_order) VALUES
-- Gelirler (Income)
('Maaş',           'income',  '#4CAF50', 1),
('Burs',           'income',  '#66BB6A', 2),
('Diğer (Gelir)',  'income',  '#AED581', 3),

-- Giderler (Expense)
('Kira',           'expense', '#EF5350', 1),
('Ulaşım',        'expense', '#AB47BC', 2),
('Market',         'expense', '#FFA726', 3),
('Eğlence',        'expense', '#42A5F5', 4),
('Sipariş',        'expense', '#EC407A', 5),
('Hediye',         'expense', '#26C6DA', 6),
('Diğer (Gider)',  'expense', '#78909C', 7)
ON DUPLICATE KEY UPDATE name = VALUES(name);
