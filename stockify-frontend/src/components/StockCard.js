import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

const StockCard = ({ stock }) => {
  const navigate = useNavigate();
  const isPositive = stock.dayChange >= 0;

  const handleSectorClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/search?q=${encodeURIComponent(stock.sector)}`);
  };

  return (
    <Link to={`/stock/${encodeURIComponent(stock.symbol)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'translateY(-4px)';
             e.currentTarget.style.boxShadow = `0 10px 25px -5px ${isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`;
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'translateY(0)';
             e.currentTarget.style.boxShadow = 'var(--shadow-card)';
           }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{stock.symbol}</h3>
            <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '150px' }}>
              {stock.companyName}
            </p>
          </div>
          <div 
            className="badge hover-glow" 
            onClick={handleSectorClick}
            style={{ background: 'rgba(255, 255, 255, 0.05)', cursor: 'pointer', zIndex: 2 }}
          >
            {stock.sector || 'Data'}
          </div>
        </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Current Price</p>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              ₹{stock.currentPrice?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem', color: isPositive ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{isPositive ? '+' : ''}{stock.dayChangePercent?.toFixed(2)}%</span>
            </div>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.125rem' }}>
              {isPositive ? '+' : ''}₹{stock.dayChange?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} Today
            </p>
          </div>
        </div>
        
        {/* Simple visual indicator at bottom */}
        <div style={{ marginTop: '1rem', height: '4px', width: '100%', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.05)', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            width: `${Math.min(100, Math.max(0, 50 + (stock.dayChangePercent || 0) * 10))}%`, 
            background: isPositive ? 'var(--success)' : 'var(--danger)',
            transition: 'width 1s ease-out'
          }}></div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
