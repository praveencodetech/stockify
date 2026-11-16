import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { stockService } from '../services/stockService';
import PriceChart from '../components/PriceChart';
import MetricsPanel from '../components/MetricsPanel';
import AIRecommendation from '../components/AIRecommendation';
import SentimentGauge from '../components/SentimentGauge';
import { toast } from 'react-toastify';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Activity, RefreshCw } from 'lucide-react';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  // Add to portfolio modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addQty, setAddQty] = useState(1);
  const [addPrice, setAddPrice] = useState(0);

  useEffect(() => {
    const fetchStockData = async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        // Fetch core stock info and history concurrently
        const [stockRes, historyRes] = await Promise.all([
          stockService.getStock(symbol),
          stockService.getHistory(symbol)
        ]);
        
        setStock(stockRes.data);
        setHistory(historyRes.data);
        setAddPrice(stockRes.data.currentPrice);
        
        // Fetch AI data concurrently but separately from core data
        // so UI can render earlier if AI takes longer
        Promise.all([
          stockService.getPrediction(symbol),
          stockService.getSentiment(symbol)
        ]).then(([predRes, sentRes]) => {
          setPrediction(predRes.data);
          setSentiment(sentRes.data);
        }).catch(err => {
          console.error("Error fetching AI data:", err);
        });
        
      } catch (error) {
        console.error("Error fetching stock:", error);
        toast.error(`Could not find stock data for ${symbol}`);
        navigate('/dashboard');
      } finally {
        if (showLoading) setLoading(false);
      }
    };

    if (symbol) {
      fetchStockData();
      
      // Live updates polling
      const poll = setInterval(() => {
        fetchStockData(false);
      }, 60000);
      
      return () => clearInterval(poll);
    }
  }, [symbol, navigate]);

  const handleAddToPortfolio = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await stockService.addToPortfolio({
        symbol,
        quantity: parseInt(addQty),
        buyPrice: parseFloat(addPrice),
        buyDate: new Date().toISOString().split('T')[0]
      });
      
      toast.success(`Added ${addQty} shares of ${symbol} to portfolio`);
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add to portfolio");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="flex flex-col items-center gap-4 text-primary">
          <RefreshCw size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-muted font-medium">Analyzing {symbol}...</p>
        </div>
      </div>
    );
  }

  if (!stock) return null;

  const isPositive = stock.dayChange >= 0;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-muted hover:text-main mb-6 bg-transparent border-none cursor-pointer transition-colors"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
              {stock.symbol.charAt(0)}
            </div>
            <div>
              <h1 className="m-0" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {stock.symbol}
                <Link 
                  to={`/search?q=${encodeURIComponent(stock.sector)}`} 
                  className="badge hover-glow" 
                  style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.875rem', fontWeight: 500, verticalAlign: 'middle', textDecoration: 'none', cursor: 'pointer' }}
                >
                  {stock.sector}
                </Link>
              </h1>
              <p className="text-muted m-0 text-lg">{stock.companyName}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end w-full lg:w-auto">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
            <span style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>
              ₹{stock.currentPrice?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </span>
            <div className={`flex items-center gap-1 font-bold ${isPositive ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.25rem' }}>
              {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {isPositive ? '+' : ''}{stock.dayChange?.toFixed(2)} ({stock.dayChangePercent?.toFixed(2)}%)
            </div>
          </div>
          <p className="text-muted mt-2 mb-4 text-sm">Market Open • As of {new Date(stock.lastUpdated).toLocaleTimeString()}</p>
          
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary w-full lg:w-auto">
            <Plus size={18} /> Add to Portfolio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart Section - Takes up 2 columns */}
        <div className="glass-panel p-6 lg:col-span-2">
          <h3 className="mb-6 flex items-center gap-2">
            <Activity className="text-primary" /> Price History
          </h3>
          <PriceChart data={history} isPositive={isPositive} height={350} showVolumes={true} />
        </div>

        {/* AI Sentiment & Quick Stats - Takes up 1 column */}
        <div className="grid grid-cols-1 gap-6 lg:col-span-1">
          <div className="glass-panel p-6 flex flex-col items-center justify-center">
            <h3 className="mb-6 w-full text-center">News Sentiment</h3>
            {sentiment ? (
              <SentimentGauge score={sentiment.overallSentiment} label={sentiment.sentimentLabel} />
            ) : (
              <div className="flex flex-col items-center gap-2 p-8 opacity-50">
                <RefreshCw className="animate-spin" />
                <span>Analyzing news...</span>
              </div>
            )}
          </div>
          
          <div className="glass-panel p-6">
            <h3 className="mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted text-sm">Previous Close</span>
                <span className="font-semibold">₹{stock.previousClose?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted text-sm">Volume</span>
                <span className="font-semibold">{(stock.volume / 1000000).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between items-center pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-muted text-sm">Day Range</span>
                <span className="font-semibold">
                  ₹{history.length > 0 ? history[history.length-1].lowPrice?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'} - 
                  ₹{history.length > 0 ? history[history.length-1].highPrice?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted text-sm">52 Week Range</span>
                <span className="font-semibold">₹{stock.metrics?.fiftyTwoWeekLow?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} - ₹{stock.metrics?.fiftyTwoWeekHigh?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <div className="mb-8">
        {prediction ? (
          <AIRecommendation prediction={prediction} />
        ) : (
          <div className="glass-panel p-8 flex justify-center items-center">
            <div className="flex items-center gap-3 text-primary">
              <RefreshCw className="animate-spin" />
              <span>Generating AI prediction and reasoning...</span>
            </div>
          </div>
        )}
      </div>

      {/* Fundamental Analysis Section */}
      <MetricsPanel stock={stock} />

      {/* Add to Portfolio Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-panel p-6 max-w-md w-full animate-slide-up mx-4">
            <h2 className="mb-4">Add {symbol} to Portfolio</h2>
            <form onSubmit={handleAddToPortfolio}>
              <div className="input-group">
                <label className="input-label" htmlFor="qty">Quantity (Shares)</label>
                <input 
                  type="number" 
                  id="qty" 
                  min="1" 
                  step="1" 
                  className="input-control" 
                  value={addQty} 
                  onChange={e => setAddQty(e.target.value)} 
                  required 
                />
              </div>
              <div className="input-group mb-6">
                <label className="input-label" htmlFor="price">Average Cost (₹)</label>
                <input 
                  type="number" 
                  id="price" 
                  min="0.01" 
                  step="0.01" 
                  className="input-control" 
                  value={addPrice} 
                  onChange={e => setAddPrice(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="p-4 mb-6" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-muted">Total Cost:</span>
                  <span className="font-bold text-lg">₹{(parseFloat(addQty || 0) * parseFloat(addPrice || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline" disabled={isAdding}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetailPage;
