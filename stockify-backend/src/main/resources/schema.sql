-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User Logins tracking
CREATE TABLE IF NOT EXISTS user_logins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default test user (Password: password123)
-- Because this is a persistent database, we use INSERT IGNORE to avoid duplicates on restart
INSERT IGNORE INTO users (email, password, full_name, role) VALUES 
('test@example.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07OfSTpG3QHdt.70u.', 'Test User', 'USER');

-- Stocks table
CREATE TABLE IF NOT EXISTS stocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    industry VARCHAR(100),
    current_price DECIMAL(12,2),
    previous_close DECIMAL(12,2),
    day_change DECIMAL(12,2),
    day_change_percent DECIMAL(8,4),
    volume BIGINT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stock fundamental metrics
CREATE TABLE IF NOT EXISTS stock_metrics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_id BIGINT NOT NULL,
    pe_ratio DECIMAL(10,2),
    eps DECIMAL(10,2),
    market_cap DECIMAL(20,2),
    revenue_growth DECIMAL(8,4),
    debt_to_equity DECIMAL(10,4),
    dividend_yield DECIMAL(8,4),
    book_value DECIMAL(12,2),
    roe DECIMAL(8,4),
    fifty_two_week_high DECIMAL(12,2),
    fifty_two_week_low DECIMAL(12,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_stock_metric (stock_id)
);

-- Stock price history
CREATE TABLE IF NOT EXISTS stock_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    stock_id BIGINT NOT NULL,
    date DATE NOT NULL,
    open_price DECIMAL(12,2),
    high_price DECIMAL(12,2),
    low_price DECIMAL(12,2),
    close_price DECIMAL(12,2),
    volume BIGINT,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_stock_date (stock_id, date)
);

-- User portfolio items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    buy_price DECIMAL(12,2) NOT NULL,
    buy_date DATE NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE
);

-- User watchlist
CREATE TABLE IF NOT EXISTS watchlist_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    stock_id BIGINT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (stock_id) REFERENCES stocks(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_stock (user_id, stock_id)
);



-- Insert some sample stock data
INSERT IGNORE INTO stocks (symbol, company_name, sector, industry, current_price, previous_close, day_change, day_change_percent, volume) VALUES
('HDFCBANK.NS', 'HDFC Bank', 'Banking', 'Banks', 1600.86, 1550.27, 50.59, 3.2633, 61922593),
('SBIN.NS', 'State Bank of India', 'Banking', 'Banks', 754.48, 777.09, -22.61, -2.9096, 43809440),
('ICICIBANK.NS', 'ICICI Bank', 'Banking', 'Banks', 2711.79, 2576.94, 134.85, 5.233, 1104869),
('AXISBANK.NS', 'Axis Bank', 'Banking', 'Banks', 4334.34, 4276.94, 57.4, 1.3421, 4245886),
('KOTAKBANK.NS', 'Kotak Mahindra Bank', 'Banking', 'Banks', 2455.65, 2565.57, -109.92, -4.2844, 27572995),
('INDUSINDBK.NS', 'IndusInd Bank', 'Banking', 'Banks', 1410.5, 1375.52, 34.98, 2.543, 67671065),
('PNB.NS', 'Punjab National Bank', 'Banking', 'Banks', 2772.98, 2733.59, 39.39, 1.441, 58140888),
('TCS.NS', 'Tata Consultancy Services', 'IT', 'IT Services', 3830.34, 3989.66, -159.32, -3.9933, 10475778),
('INFY.NS', 'Infosys', 'IT', 'IT Services', 1754.22, 1824.56, -70.34, -3.8552, 34664330),
('WIPRO.NS', 'Wipro', 'IT', 'IT Services', 3959.2, 3783.08, 176.12, 4.6555, 80072566),
('HCLTECH.NS', 'HCL Technologies', 'IT', 'IT Services', 3237.42, 3244.78, -7.36, -0.2268, 53005837),
('TECHM.NS', 'Tech Mahindra', 'IT', 'IT Services', 4733.97, 4885.51, -151.54, -3.1018, 2917796),
('LTIM.NS', 'LTIMindtree', 'IT', 'IT Services', 445.52, 453.97, -8.45, -1.8614, 84879519),
('PERSISTENT.NS', 'Persistent Systems', 'IT', 'IT Services', 2706.98, 2703.51, 3.47, 0.1284, 61410891),
('SUNPHARMA.NS', 'Sun Pharmaceutical', 'Pharma', 'Pharmaceuticals', 1577.76, 1522.85, 54.91, 3.6057, 75657981),
('DRREDDY.NS', 'Dr. Reddy's Laboratories', 'Pharma', 'Pharmaceuticals', 1638.89, 1567.88, 71.01, 4.529, 80860831),
('CIPLA.NS', 'Cipla', 'Pharma', 'Pharmaceuticals', 2509.75, 2388.2, 121.55, 5.0896, 36395958),
('DIVISLAB.NS', 'Divi's Laboratories', 'Pharma', 'Pharmaceuticals', 3894.33, 3946.35, -52.02, -1.3182, 91240491),
('AUROPHARMA.NS', 'Aurobindo Pharma', 'Pharma', 'Pharmaceuticals', 2238.45, 2155.9, 82.55, 3.829, 42741906),
('LUPIN.NS', 'Lupin Limited', 'Pharma', 'Pharmaceuticals', 2110.08, 2009.73, 100.35, 4.9932, 89494386),
('BIOCON.NS', 'Biocon Limited', 'Pharma', 'Pharmaceuticals', 477.81, 480.91, -3.1, -0.6446, 55749274),
('HINDUNILVR.NS', 'Hindustan Unilever', 'FMCG', 'Consumer Goods', 429.93, 410.41, 19.52, 4.7562, 78046387),
('ITC.NS', 'ITC Limited', 'FMCG', 'Consumer Goods', 4877.36, 4734.68, 142.68, 3.0135, 46510992),
('NESTLEIND.NS', 'Nestle India', 'FMCG', 'Consumer Goods', 1800.91, 1732.63, 68.28, 3.9408, 1483561),
('BRITANNIA.NS', 'Britannia Industries', 'FMCG', 'Consumer Goods', 1323.1, 1319.01, 4.09, 0.3101, 85438196),
('DABUR.NS', 'Dabur India', 'FMCG', 'Consumer Goods', 4752.51, 4595.38, 157.13, 3.4193, 87943633),
('GODREJCP.NS', 'Godrej Consumer Products', 'FMCG', 'Consumer Goods', 1982.28, 1974.97, 7.31, 0.3701, 60414554),
('MARICO.NS', 'Marico Limited', 'FMCG', 'Consumer Goods', 920.42, 881.74, 38.68, 4.3868, 2987396),
('MARUTI.NS', 'Maruti Suzuki', 'Automobile', 'Auto Manufacturers', 3379.23, 3410.53, -31.3, -0.9177, 72994361),
('TATAMOTORS.NS', 'Tata Motors', 'Automobile', 'Auto Manufacturers', 356.67, 370.54, -13.87, -3.7432, 24630904),
('M&M.NS', 'Mahindra & Mahindra', 'Automobile', 'Auto Manufacturers', 4226.86, 4365.46, -138.6, -3.1749, 5332398),
('BAJAJ-AUTO.NS', 'Bajaj Auto', 'Automobile', 'Auto Manufacturers', 4245.77, 4446.02, -200.25, -4.504, 41439201),
('HEROMOTOCO.NS', 'Hero MotoCorp', 'Automobile', 'Auto Manufacturers', 2271.35, 2276.97, -5.62, -0.2468, 59929815),
('TVSMOTOR.NS', 'TVS Motor Company', 'Automobile', 'Auto Manufacturers', 3650.7, 3477.77, 172.93, 4.9724, 26697189),
('EICHERMOT.NS', 'Eicher Motors', 'Automobile', 'Auto Manufacturers', 1564.04, 1586.25, -22.21, -1.4002, 27599659),
('RELIANCE.NS', 'Reliance Industries', 'Energy', 'Oil & Gas', 2819.82, 2816.67, 3.15, 0.1118, 90546629),
('ONGC.NS', 'Oil & Natural Gas Corporation', 'Energy', 'Oil & Gas', 1742.43, 1761.37, -18.94, -1.0753, 94355847),
('POWERGRID.NS', 'Power Grid Corporation', 'Energy', 'Oil & Gas', 2198.95, 2201.06, -2.11, -0.0959, 47455456),
('NTPC.NS', 'NTPC Limited', 'Energy', 'Oil & Gas', 4071.79, 4147.28, -75.49, -1.8202, 8456563),
('TATAPOWER.NS', 'Tata Power', 'Energy', 'Oil & Gas', 1028.24, 1024.36, 3.88, 0.3788, 73488739),
('BPCL.NS', 'Bharat Petroleum', 'Energy', 'Oil & Gas', 4146.78, 4127.76, 19.02, 0.4608, 90586033),
('IOC.NS', 'Indian Oil Corporation', 'Energy', 'Oil & Gas', 4344.25, 4503.0, -158.75, -3.5254, 52323512),
('TATASTEEL.NS', 'Tata Steel', 'Metal', 'Steel & Metals', 2208.92, 2122.4, 86.52, 4.0765, 20221764),
('JSWSTEEL.NS', 'JSW Steel', 'Metal', 'Steel & Metals', 432.02, 443.44, -11.42, -2.5753, 39733930),
('HINDALCO.NS', 'Hindalco Industries', 'Metal', 'Steel & Metals', 271.8, 280.31, -8.51, -3.0359, 98915751),
('VEDL.NS', 'Vedanta Limited', 'Metal', 'Steel & Metals', 1738.63, 1761.25, -22.62, -1.2843, 75171665),
('SAIL.NS', 'Steel Authority of India', 'Metal', 'Steel & Metals', 1388.04, 1439.91, -51.87, -3.6023, 35020384),
('JSL.NS', 'Jindal Stainless', 'Metal', 'Steel & Metals', 3941.4, 4090.74, -149.34, -3.6507, 51425075),
('DLF.NS', 'DLF Limited', 'Real Estate', 'Real Estate Developers', 4387.65, 4174.8, 212.85, 5.0984, 82238910),
('GODREJPROP.NS', 'Godrej Properties', 'Real Estate', 'Real Estate Developers', 4864.65, 4762.54, 102.11, 2.144, 54932943),
('OBEROIRLTY.NS', 'Oberoi Realty', 'Real Estate', 'Real Estate Developers', 2425.22, 2524.37, -99.15, -3.9277, 77605605),
('PRESTIGE.NS', 'Prestige Estates', 'Real Estate', 'Real Estate Developers', 3623.66, 3715.04, -91.38, -2.4597, 16548956),
('BRIGADE.NS', 'Brigade Enterprises', 'Real Estate', 'Real Estate Developers', 2272.69, 2339.02, -66.33, -2.8358, 41901844),
('PHOENIXLTD.NS', 'Phoenix Mills', 'Real Estate', 'Real Estate Developers', 2186.5, 2267.75, -81.25, -3.5828, 4114329),
('BHARTIARTL.NS', 'Bharti Airtel', 'Telecom', 'Telecom Services', 3778.93, 3596.63, 182.3, 5.0686, 24067074),
('IDEA.NS', 'Vodafone Idea', 'Telecom', 'Telecom Services', 2591.6, 2484.62, 106.98, 4.3057, 1457624),
('TATACOMM.NS', 'Tata Communications', 'Telecom', 'Telecom Services', 224.28, 225.06, -0.78, -0.3466, 42635023),
('HFCL.NS', 'HFCL Limited', 'Telecom', 'Telecom Services', 3486.38, 3604.06, -117.68, -3.2652, 14774424),
('RAILTEL.NS', 'RailTel Corporation', 'Telecom', 'Telecom Services', 4486.78, 4288.38, 198.4, 4.6265, 52470824),
('INDUSTOWER.NS', 'Indus Towers', 'Telecom', 'Telecom Services', 903.78, 925.54, -21.76, -2.3511, 17250540),
('HAL.NS', 'Hindustan Aeronautics', 'Defense', 'Aerospace & Defense', 3257.95, 3198.72, 59.23, 1.8517, 20865365),
('BEL.NS', 'Bharat Electronics', 'Defense', 'Aerospace & Defense', 2870.22, 2932.66, -62.44, -2.1291, 24272988),
('BDYNAMICS.NS', 'Bharat Dynamics', 'Defense', 'Aerospace & Defense', 3728.59, 3865.9, -137.31, -3.5518, 93477347),
('MAZDOCK.NS', 'Mazagon Dock', 'Defense', 'Aerospace & Defense', 1108.81, 1105.34, 3.47, 0.3139, 23877076),
('COCHINSHIP.NS', 'Cochin Shipyard', 'Defense', 'Aerospace & Defense', 3948.0, 3853.03, 94.97, 2.4648, 16035426),
('PIDILITIND.NS', 'Pidilite Industries', 'Chemicals', 'Specialty Chemicals', 3758.15, 3761.85, -3.7, -0.0984, 12154294),
('TATACHEM.NS', 'Tata Chemicals', 'Chemicals', 'Specialty Chemicals', 2674.76, 2697.72, -22.96, -0.8511, 54321518),
('SRF.NS', 'SRF Limited', 'Chemicals', 'Specialty Chemicals', 4017.89, 3963.72, 54.17, 1.3666, 25573004),
('DEEPAKNTR.NS', 'Deepak Nitrite', 'Chemicals', 'Specialty Chemicals', 1544.45, 1537.79, 6.66, 0.4331, 57580780),
('GUJALKALI.NS', 'Gujarat Alkalies', 'Chemicals', 'Specialty Chemicals', 4109.94, 4084.42, 25.52, 0.6248, 48555810),
('SUZLON.NS', 'Suzlon Energy', 'Renewable Energy', 'Green Energy', 3452.53, 3453.11, -0.58, -0.0168, 21524291),
('IREDA.NS', 'IREDA', 'Renewable Energy', 'Green Energy', 3883.6, 3708.11, 175.49, 4.7326, 21475856),
('ADANIGREEN.NS', 'Adani Green Energy', 'Renewable Energy', 'Green Energy', 901.61, 919.04, -17.43, -1.8965, 30016404),
('BORORENEW.NS', 'Borosil Renewables', 'Renewable Energy', 'Green Energy', 4824.35, 5023.93, -199.58, -3.9726, 32116447),
('INDHOTEL.NS', 'Indian Hotels (Taj)', 'Hospitality', 'Hotels & Resorts', 4626.59, 4822.77, -196.18, -4.0678, 75929477),
('EIHOTEL.NS', 'EIH Limited (Oberoi)', 'Hospitality', 'Hotels & Resorts', 4576.21, 4526.0, 50.21, 1.1094, 6685702),
('LEELAHOTEL.NS', 'HLV Limited (Leela)', 'Hospitality', 'Hotels & Resorts', 3627.93, 3534.59, 93.34, 2.6408, 32132514),
('TAJGVK.NS', 'TAJGVK Hotels', 'Hospitality', 'Hotels & Resorts', 586.5, 565.51, 20.99, 3.7117, 59067925);

-- Insert sample metrics
INSERT IGNORE INTO stock_metrics (stock_id, pe_ratio, eps, market_cap, revenue_growth, debt_to_equity, dividend_yield, book_value, roe, fifty_two_week_high, fifty_two_week_low) VALUES
(1, 67.47, 83.36, 1979684814178, 0.2025, 0.44, 0.025, 252.55, 0.3017, 5246.58, 3746.15),
(2, 68.81, 62.06, 1683404478074, -0.0339, 1.13, 0.0337, 333.11, 0.0591, 2113.75, 1280.57),
(3, 43.13, 36.34, 7264633727617, 0.2986, 2.58, 0.0135, 114.47, 0.3488, 1890.24, 1243.03),
(4, 71.94, 32.94, 253137201803, 0.2449, 2.04, 0.0348, 106.23, 0.112, 4591.52, 2450.69),
(5, 55.3, 57.06, 3968695474566, -0.0007, 0.31, 0.037, 449.62, 0.0641, 1568.65, 986.58),
(6, 28.3, 28.19, 8879538823126, 0.031, 2.64, 0.0035, 246.16, 0.3915, 2233.2, 1389.64),
(7, 34.3, 74.4, 8365097977312, 0.3043, 0.87, 0.0023, 406.67, 0.29, 2204.78, 1511.17),
(8, 31.86, 37.78, 5105994734242, 0.3283, 0.81, 0.0001, 257.68, 0.2488, 4761.01, 2758.23),
(9, 53.37, 26.69, 661108599187, 0.3717, 1.2, 0.0106, 13.66, 0.398, 3221.9, 1735.05),
(10, 12.05, 7.97, 6061470398957, 0.0507, 1.82, 0.0196, 398.35, 0.1828, 4219.38, 3155.06),
(11, 49.34, 6.02, 2479644422814, -0.0525, 1.6, 0.0485, 55.99, 0.3751, 5640.1, 3826.36),
(12, 52.25, 22.35, 6973275961883, 0.4526, 0.27, 0.0313, 251.78, 0.2561, 262.46, 147.46),
(13, 29.77, 44.09, 8087450265839, 0.007, 2.39, 0.0355, 484.94, 0.2457, 2732.83, 1711.13),
(14, 32.59, 12.05, 3146989881401, 0.1023, 1.45, 0.0158, 17.73, 0.1799, 5848.87, 4313.62),
(15, 67.74, 89.56, 6549803378587, -0.0383, 0.11, 0.0287, 470.46, 0.1294, 2200.34, 1474.54),
(16, 79.09, 45.78, 8607796081780, 0.2626, 1.41, 0.048, 237.64, 0.2415, 2002.39, 1169.53),
(17, 56.09, 91.19, 6913344190957, 0.4114, 2.21, 0.0444, 98.57, 0.2495, 3522.89, 2669.78),
(18, 71.28, 29.6, 6567639881453, 0.3076, 0.47, 0.044, 273.47, 0.3824, 3067.9, 1990.77),
(19, 46.99, 49.73, 9092705134813, 0.2255, 0.92, 0.0015, 113.54, 0.3407, 3503.85, 2209.88),
(20, 11.71, 68.74, 4582770670951, 0.1864, 0.42, 0.0059, 253.08, 0.2681, 3663.02, 2347.13),
(21, 35.51, 48.0, 6712866741739, 0.0247, 1.44, 0.0351, 330.3, 0.1619, 1982.6, 1170.48),
(22, 54.86, 4.23, 4316056816413, 0.3252, 1.93, 0.0346, 454.25, 0.2016, 2062.63, 1036.3),
(23, 17.7, 30.82, 1362409711491, 0.2697, 1.24, 0.0104, 412.13, 0.0886, 3152.72, 2655.1),
(24, 43.14, 48.0, 1107015447610, 0.4025, 2.03, 0.0169, 241.66, 0.2222, 4809.11, 3988.98),
(25, 42.18, 63.88, 8806902726607, 0.1296, 0.94, 0.0381, 97.06, 0.3548, 4155.27, 3284.9),
(26, 69.39, 39.62, 6155830749244, 0.4849, 2.54, 0.0164, 246.38, 0.3008, 2499.01, 1301.38),
(27, 55.49, 82.94, 8125106072268, 0.2559, 0.78, 0.0256, 458.31, 0.1454, 3287.12, 2165.18),
(28, 58.85, 25.01, 7527098232759, 0.3731, 1.43, 0.0252, 140.92, 0.1305, 5309.05, 3470.5),
(29, 40.1, 30.62, 2001409645463, 0.3191, 2.2, 0.0196, 27.41, 0.369, 2254.46, 1451.02),
(30, 37.27, 95.09, 9100246729016, -0.0324, 1.34, 0.0111, 169.83, 0.0797, 4510.22, 2434.29),
(31, 30.41, 83.25, 1629427854524, 0.2981, 1.61, 0.0434, 114.24, 0.1874, 5076.86, 4120.77),
(32, 31.02, 53.11, 4376054721752, 0.1895, 1.85, 0.0285, 441.03, 0.361, 3017.34, 2701.77),
(33, 68.83, 78.22, 3012242858686, 0.4974, 0.24, 0.0329, 367.52, 0.2262, 1285.5, 650.79),
(34, 38.18, 32.45, 8014684533644, 0.1797, 2.21, 0.0313, 316.52, 0.247, 4994.33, 3996.11),
(35, 34.83, 31.32, 8191120664424, 0.473, 2.82, 0.0454, 196.36, 0.2491, 5800.33, 3822.95),
(36, 70.53, 68.67, 996295824016, 0.4748, 0.08, 0.039, 158.05, 0.3289, 4706.25, 2531.57),
(37, 72.82, 23.71, 346514267732, 0.1461, 2.61, 0.0457, 23.68, 0.1584, 3659.1, 3180.27),
(38, 72.64, 36.06, 3924340962961, 0.4472, 2.43, 0.0006, 365.55, 0.2672, 4605.71, 3592.01),
(39, 49.81, 98.56, 2031169105162, -0.029, 1.89, 0.0358, 182.07, 0.144, 3709.78, 3084.52),
(40, 21.96, 16.66, 5407518634975, -0.0725, 0.74, 0.0352, 243.45, 0.2998, 4379.22, 2216.68),
(41, 62.84, 13.45, 7161885836099, 0.2003, 1.41, 0.0433, 450.49, 0.2619, 2553.63, 2142.91),
(42, 46.07, 65.5, 2085874677943, 0.3947, 2.37, 0.0172, 192.08, 0.2278, 3528.46, 2478.73),
(43, 65.29, 10.86, 8693584591934, 0.172, 0.93, 0.0464, 288.09, 0.3925, 1808.89, 1115.42),
(44, 61.97, 29.43, 373331875911, 0.1655, 2.13, 0.0166, 192.71, 0.2448, 2589.55, 2203.86),
(45, 25.4, 62.26, 2857622062810, 0.3431, 1.1, 0.0365, 384.45, 0.1445, 5803.79, 2944.86);
