import api from './api';

const mockStocks = [
  // ── IT Sector ──
  { id: 1, symbol: 'TCS.NS', companyName: 'Tata Consultancy Services', currentPrice: 4120.30, dayChange: 34.82, dayChangePercent: 0.85, volume: 2000000, sector: 'IT' },
  { id: 2, symbol: 'INFY.NS', companyName: 'Infosys', currentPrice: 1680.75, dayChange: 34.60, dayChangePercent: 2.10, volume: 4500000, sector: 'IT' },
  { id: 3, symbol: 'WIPRO.NS', companyName: 'Wipro Ltd', currentPrice: 485.30, dayChange: 5.85, dayChangePercent: 1.22, volume: 3200000, sector: 'IT' },
  { id: 4, symbol: 'HCLTECH.NS', companyName: 'HCL Technologies', currentPrice: 1520.45, dayChange: -12.30, dayChangePercent: -0.80, volume: 1800000, sector: 'IT' },
  { id: 5, symbol: 'TECHM.NS', companyName: 'Tech Mahindra', currentPrice: 1340.60, dayChange: 18.90, dayChangePercent: 1.43, volume: 1400000, sector: 'IT' },
  { id: 6, symbol: 'LTIM.NS', companyName: 'LTIMindtree', currentPrice: 5680.20, dayChange: 45.60, dayChangePercent: 0.81, volume: 800000, sector: 'IT' },
  { id: 7, symbol: 'PERSISTENT.NS', companyName: 'Persistent Systems', currentPrice: 5240.80, dayChange: 78.50, dayChangePercent: 1.52, volume: 450000, sector: 'IT' },

  // ── Banking Sector ──
  { id: 8, symbol: 'HDFCBANK.NS', companyName: 'HDFC Bank', currentPrice: 1640.20, dayChange: -7.38, dayChangePercent: -0.45, volume: 8000000, sector: 'Banking' },
  { id: 9, symbol: 'ICICIBANK.NS', companyName: 'ICICI Bank', currentPrice: 1080.60, dayChange: 12.28, dayChangePercent: 1.15, volume: 7000000, sector: 'Banking' },
  { id: 10, symbol: 'SBIN.NS', companyName: 'State Bank of India', currentPrice: 760.30, dayChange: 4.18, dayChangePercent: 0.55, volume: 8500000, sector: 'Banking' },
  { id: 11, symbol: 'KOTAKBANK.NS', companyName: 'Kotak Mahindra Bank', currentPrice: 1780.50, dayChange: 22.40, dayChangePercent: 1.27, volume: 3500000, sector: 'Banking' },
  { id: 12, symbol: 'AXISBANK.NS', companyName: 'Axis Bank', currentPrice: 1120.75, dayChange: -8.50, dayChangePercent: -0.75, volume: 5200000, sector: 'Banking' },
  { id: 13, symbol: 'INDUSINDBK.NS', companyName: 'IndusInd Bank', currentPrice: 1460.30, dayChange: 32.10, dayChangePercent: 2.25, volume: 2800000, sector: 'Banking' },
  { id: 14, symbol: 'PNB.NS', companyName: 'Punjab National Bank', currentPrice: 98.45, dayChange: 1.20, dayChangePercent: 1.23, volume: 12000000, sector: 'Banking' },

  // ── FMCG Sector ──
  { id: 15, symbol: 'ITC.NS', companyName: 'ITC Limited', currentPrice: 420.50, dayChange: -0.84, dayChangePercent: -0.20, volume: 9000000, sector: 'FMCG' },
  { id: 16, symbol: 'HINDUNILVR.NS', companyName: 'Hindustan Unilever', currentPrice: 2540.80, dayChange: -18.20, dayChangePercent: -0.71, volume: 1600000, sector: 'FMCG' },
  { id: 17, symbol: 'NESTLEIND.NS', companyName: 'Nestle India', currentPrice: 2480.60, dayChange: 12.40, dayChangePercent: 0.50, volume: 400000, sector: 'FMCG' },
  { id: 18, symbol: 'BRITANNIA.NS', companyName: 'Britannia Industries', currentPrice: 5120.30, dayChange: 35.80, dayChangePercent: 0.70, volume: 350000, sector: 'FMCG' },
  { id: 19, symbol: 'DABUR.NS', companyName: 'Dabur India', currentPrice: 560.20, dayChange: 4.50, dayChangePercent: 0.81, volume: 1200000, sector: 'FMCG' },
  { id: 20, symbol: 'MARICO.NS', companyName: 'Marico Ltd', currentPrice: 580.90, dayChange: -2.10, dayChangePercent: -0.36, volume: 1100000, sector: 'FMCG' },

  // ── Pharma Sector ──
  { id: 21, symbol: 'SUNPHARMA.NS', companyName: 'Sun Pharmaceutical', currentPrice: 1420.50, dayChange: 18.30, dayChangePercent: 1.30, volume: 2200000, sector: 'Pharma' },
  { id: 22, symbol: 'DRREDDY.NS', companyName: "Dr. Reddy's Labs", currentPrice: 5840.70, dayChange: -42.50, dayChangePercent: -0.72, volume: 600000, sector: 'Pharma' },
  { id: 23, symbol: 'CIPLA.NS', companyName: 'Cipla Ltd', currentPrice: 1280.40, dayChange: 15.60, dayChangePercent: 1.23, volume: 1500000, sector: 'Pharma' },
  { id: 24, symbol: 'DIVISLAB.NS', companyName: "Divi's Laboratories", currentPrice: 3760.80, dayChange: 28.90, dayChangePercent: 0.77, volume: 500000, sector: 'Pharma' },
  { id: 25, symbol: 'APOLLOHOSP.NS', companyName: 'Apollo Hospitals', currentPrice: 6120.40, dayChange: 52.30, dayChangePercent: 0.86, volume: 380000, sector: 'Pharma' },

  // ── Automobile Sector ──
  { id: 26, symbol: 'TATAMOTORS.NS', companyName: 'Tata Motors', currentPrice: 1045.20, dayChange: 34.76, dayChangePercent: 3.45, volume: 6000000, sector: 'Automobile' },
  { id: 27, symbol: 'MARUTI.NS', companyName: 'Maruti Suzuki India', currentPrice: 11240.50, dayChange: 125.80, dayChangePercent: 1.13, volume: 700000, sector: 'Automobile' },
  { id: 28, symbol: 'M&M.NS', companyName: 'Mahindra & Mahindra', currentPrice: 2680.30, dayChange: -15.40, dayChangePercent: -0.57, volume: 2400000, sector: 'Automobile' },
  { id: 29, symbol: 'BAJAJ-AUTO.NS', companyName: 'Bajaj Auto', currentPrice: 8950.60, dayChange: 68.20, dayChangePercent: 0.77, volume: 450000, sector: 'Automobile' },
  { id: 30, symbol: 'EICHERMOT.NS', companyName: 'Eicher Motors', currentPrice: 4520.80, dayChange: 42.30, dayChangePercent: 0.94, volume: 550000, sector: 'Automobile' },
  { id: 31, symbol: 'HEROMOTOCO.NS', companyName: 'Hero MotoCorp', currentPrice: 4380.40, dayChange: -22.60, dayChangePercent: -0.51, volume: 620000, sector: 'Automobile' },

  // ── Energy Sector ──
  { id: 32, symbol: 'RELIANCE.NS', companyName: 'Reliance Industries', currentPrice: 2950.45, dayChange: 36.45, dayChangePercent: 1.25, volume: 5000000, sector: 'Energy' },
  { id: 33, symbol: 'ONGC.NS', companyName: 'Oil & Natural Gas Corp', currentPrice: 265.80, dayChange: 3.40, dayChangePercent: 1.30, volume: 7200000, sector: 'Energy' },
  { id: 34, symbol: 'NTPC.NS', companyName: 'NTPC Ltd', currentPrice: 348.60, dayChange: 5.20, dayChangePercent: 1.51, volume: 6800000, sector: 'Energy' },
  { id: 35, symbol: 'POWERGRID.NS', companyName: 'Power Grid Corp', currentPrice: 280.40, dayChange: -1.80, dayChangePercent: -0.64, volume: 4500000, sector: 'Energy' },
  { id: 36, symbol: 'ADANIGREEN.NS', companyName: 'Adani Green Energy', currentPrice: 1820.50, dayChange: 45.20, dayChangePercent: 2.55, volume: 1800000, sector: 'Energy' },
  { id: 37, symbol: 'TATAPOWER.NS', companyName: 'Tata Power Co', currentPrice: 420.30, dayChange: 8.60, dayChangePercent: 2.09, volume: 5400000, sector: 'Energy' },

  // ── Infrastructure Sector ──
  { id: 38, symbol: 'LT.NS', companyName: 'Larsen & Toubro', currentPrice: 3840.10, dayChange: 69.12, dayChangePercent: 1.80, volume: 1500000, sector: 'Infrastructure' },
  { id: 39, symbol: 'ULTRACEMCO.NS', companyName: 'UltraTech Cement', currentPrice: 9820.40, dayChange: 82.30, dayChangePercent: 0.85, volume: 320000, sector: 'Infrastructure' },
  { id: 40, symbol: 'ADANIENT.NS', companyName: 'Adani Enterprises', currentPrice: 3150.70, dayChange: -28.40, dayChangePercent: -0.89, volume: 2100000, sector: 'Infrastructure' },

  // ── Telecom Sector ──
  { id: 41, symbol: 'BHARTIARTL.NS', companyName: 'Bharti Airtel', currentPrice: 1210.90, dayChange: 27.25, dayChangePercent: 2.30, volume: 3000000, sector: 'Telecom' },
  { id: 42, symbol: 'IDEA.NS', companyName: 'Vodafone Idea', currentPrice: 14.25, dayChange: 0.45, dayChangePercent: 3.26, volume: 25000000, sector: 'Telecom' },
];

const mockSectors = ['IT', 'Banking', 'FMCG', 'Pharma', 'Automobile', 'Energy', 'Infrastructure', 'Telecom'];

const mockPortfolio = {
  totalItems: 3,
  totalCurrentValue: 125400.50,
  totalInvested: 110000.00,
  totalPnL: 15400.50,
  pnlPercent: 14.00
};

export const stockService = {
  // Fetch all stocks from backend, fallback to mock data
  getAllStocks: async () => {
    try {
      const res = await api.get('/stocks');
      console.log('[StockService] Stocks fetched from backend:', res.data?.length);
      if (res.data && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('[StockService] Backend /stocks failed, using mock data:', err.message);
    }
    return { data: mockStocks };
  },

  searchStocks: async (query) => {
    try {
      const res = await api.get('/stocks');
      console.log('[StockService] Stocks fetched from backend:', res.data?.length);
      if (res.data && res.data.length > 0) {
        if (query) {
          const q = query.toLowerCase();
          const filtered = res.data.filter(s =>
            s.symbol?.toLowerCase().includes(q) ||
            s.companyName?.toLowerCase().includes(q) ||
            s.sector?.toLowerCase().includes(q)
          );
          return { data: filtered };
        }
        return res;
      }
    } catch (err) {
      console.warn('[StockService] Backend /stocks failed, using mock data:', err.message);
    }
    if (query) {
      const q = query.toLowerCase();
      return { data: mockStocks.filter(s =>
        s.symbol?.toLowerCase().includes(q) ||
        s.companyName?.toLowerCase().includes(q) ||
        s.sector?.toLowerCase().includes(q)
      )};
    }
    return { data: mockStocks };
  },
  
  getSectors: async () => {
    try {
      const res = await api.get('/stocks/sectors');
      console.log('[StockService] Sectors fetched from backend:', res.data?.length);
      if (res.data && res.data.length > 0) {
        return res;
      }
    } catch (err) {
      console.warn('[StockService] Backend /stocks/sectors failed, using mock data:', err.message);
    }
    return { data: mockSectors };
  },
  
  getPortfolioSummary: async () => {
    try {
      const res = await api.get('/portfolio/summary');
      if (res.data) return res;
    } catch (err) {
      console.warn('[StockService] Portfolio summary failed, using mock data');
    }
    return { data: mockPortfolio };
  },

  // Stock data
  getStock: async (symbol) => {
    try {
      const res = await api.get(`/stocks/${encodeURIComponent(symbol)}`);
      if (res.data) return res;
    } catch (err) {
      console.warn('[StockService] Backend /stocks/:symbol failed, using mock data');
    }
    const mockStock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
    return { data: { ...mockStock, metrics: { peRatio: 25.4, eps: 120.5, marketCap: 1500000000, fiftyTwoWeekHigh: mockStock.currentPrice * 1.2, fiftyTwoWeekLow: mockStock.currentPrice * 0.8, revenueGrowth: 0.15, profitMargin: 0.22, roe: 0.18, debtToEquity: 0.4 } } };
  },
  
  getHistory: async (symbol, days = 90) => {
    try {
      const res = await api.get(`/stocks/${encodeURIComponent(symbol)}/history?days=${days}`);
      if (res.data && res.data.length > 0) return res;
    } catch (err) {
      console.warn('[StockService] Backend history failed, using mock data');
    }
    const mockStock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
    const history = [];
    let price = mockStock.currentPrice * 0.8;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      price = price * (1 + (Math.random() - 0.48) * 0.05); // slightly upward trend
      history.push({
        date: date.toISOString().split('T')[0],
        closePrice: price,
        highPrice: price * 1.02,
        lowPrice: price * 0.98,
        volume: Math.floor(Math.random() * 5000000) + 1000000
      });
    }
    return { data: history };
  },
  
  // AI Integration
  getPrediction: async (symbol) => {
    try {
      const res = await api.get(`/ai/predict/${encodeURIComponent(symbol)}`);
      if (res.data) return res;
    } catch (err) {
      console.warn('[StockService] Backend /ai/predict failed, using mock data');
    }
    const mockStock = mockStocks.find(s => s.symbol === symbol) || mockStocks[0];
    return {
      data: {
        symbol: symbol,
        recommendation: "BUY",
        confidence: 0.85,
        predictedPrice: mockStock.currentPrice * 1.08,
        currentPrice: mockStock.currentPrice,
        priceChangePercent: 8.0,
        reasoning: "Strong technical indicators and positive market sentiment suggest an upward trend.",
        riskLevel: "MEDIUM",
        timeframe: "MEDIUM_TERM"
      }
    };
  },
  
  getSentiment: async (symbol) => {
    try {
      const res = await api.get(`/ai/sentiment/${encodeURIComponent(symbol)}`);
      if (res.data && res.data.articles && res.data.articles.length > 0) return res;
    } catch (err) {
      console.warn('[StockService] Backend /ai/sentiment failed, using mock data');
    }
    return {
      data: {
        symbol: symbol,
        overallSentiment: 0.65,
        sentimentLabel: "POSITIVE",
        totalArticles: 3,
        articles: [
          {
            title: `${symbol} Reports Strong Quarterly Earnings`,
            source: "Financial Times",
            url: "#",
            sentiment: 0.8,
            sentimentLabel: "VERY_POSITIVE",
            publishedAt: new Date().toISOString()
          },
          {
            title: `Analysts Upgrade ${symbol} Stock Rating`,
            source: "Bloomberg",
            url: "#",
            sentiment: 0.6,
            sentimentLabel: "POSITIVE",
            publishedAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            title: `Market Volatility Impacts ${symbol} Share Price`,
            source: "Reuters",
            url: "#",
            sentiment: -0.2,
            sentimentLabel: "NEGATIVE",
            publishedAt: new Date(Date.now() - 172800000).toISOString()
          }
        ]
      }
    };
  },
  
  // Portfolio
  getPortfolio: () => api.get('/portfolio'),
  addToPortfolio: (data) => api.post('/portfolio', data),
  removeFromPortfolio: (id) => api.delete(`/portfolio/${id}`)
};
