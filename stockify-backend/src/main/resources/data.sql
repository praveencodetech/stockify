-- 1. Insert or Update Stocks
-- We use INSERT IGNORE to add new ones, and then UPDATE to ensure sectors match the user's requirement
INSERT IGNORE INTO stocks (symbol, company_name, sector, current_price, day_change, day_change_percent) VALUES
('ULTRACEMCO.NS', 'UltraTech Cement', 'Cement', 9000.00, 50.00, 0.50),
('ACC.NS', 'ACC Ltd', 'Cement', 2200.00, 10.00, 0.40),
('TITAN.NS', 'Titan Company', 'Consumer Durables', 3200.00, -10.00, -0.30),
('VGUARD.NS', 'V-Guard Industries', 'Consumer Durables', 300.00, 5.00, 1.20),
('HDFCBANK.NS', 'HDFC Bank', 'Finance', 1500.00, 20.00, 1.20),
('ICICIBANK.NS', 'ICICI Bank', 'Finance', 950.00, 15.00, 1.50),
('WELSPUNIND.NS', 'Welspun India', 'Textiles', 150.00, 2.00, 1.30),
('TRIDENT.NS', 'Trident Ltd', 'Textiles', 35.00, 1.00, 2.00),
('DMART.NS', 'Avenue Supermarts', 'Retail', 4000.00, -15.00, -0.40),
('TRENT.NS', 'Trent Ltd', 'Retail', 3800.00, 25.00, 0.80),
('TATASTEEL.NS', 'Tata Steel', 'Metal', 140.00, 1.00, 0.70),
('JSWSTEEL.NS', 'JSW Steel', 'Metal', 800.00, 10.00, 1.30);

-- Update sectors for existing stocks to match the new requirement
UPDATE stocks SET sector = 'Finance' WHERE symbol IN ('HDFCBANK.NS', 'ICICIBANK.NS');
UPDATE stocks SET sector = 'Metal' WHERE symbol IN ('TATASTEEL.NS', 'JSWSTEEL.NS');

-- 2. Insert or Update Fundamental Metrics
-- Metrics are in a separate table as per the project schema
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 35, 250 FROM stocks WHERE symbol = 'ULTRACEMCO.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 28, 80 FROM stocks WHERE symbol = 'ACC.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 80, 40 FROM stocks WHERE symbol = 'TITAN.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 45, 8 FROM stocks WHERE symbol = 'VGUARD.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 22, 60 FROM stocks WHERE symbol = 'HDFCBANK.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 20, 45 FROM stocks WHERE symbol = 'ICICIBANK.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 15, 10 FROM stocks WHERE symbol = 'WELSPUNIND.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 18, 2 FROM stocks WHERE symbol = 'TRIDENT.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 100, 40 FROM stocks WHERE symbol = 'DMART.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 90, 35 FROM stocks WHERE symbol = 'TRENT.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 12, 12 FROM stocks WHERE symbol = 'TATASTEEL.NS';
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps)
SELECT id, 16, 50 FROM stocks WHERE symbol = 'JSWSTEEL.NS';
