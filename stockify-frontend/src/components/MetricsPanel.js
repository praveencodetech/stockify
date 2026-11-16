import React from 'react';
import { HelpCircle } from 'lucide-react';

const MetricCard = ({ title, value, prefix = '', suffix = '', explanation }) => {
  return (
    <div className="p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', transition: 'all 0.2s' }}>
      <p className="text-muted mb-2" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
      <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        {value === null || value === undefined ? 'N/A' : `${prefix}${value}${suffix}`}
      </p>
      
      {explanation && (
        <div className="flex items-start gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <HelpCircle size={16} className="text-primary mt-1" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dark)', margin: 0, lineHeight: 1.5 }}>
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};

const MetricsPanel = ({ stock }) => {
  if (!stock) return null;

  const formatMarketCap = (value) => {
    if (!value) return null;
    if (value >= 1e12) return (value / 1e12).toFixed(2) + 'T';
    if (value >= 1e9) return (value / 1e9).toFixed(2) + 'B';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + 'M';
    return value.toString();
  };

  return (
    <div className="glass-panel p-6">
      <h3 className="mb-6">Fundamental Analysis for Beginners</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="P/E Ratio" 
          value={stock.peRatio} 
          explanation={stock.peRatioExplanation} 
        />
        
        <MetricCard 
          title="Earnings Per Share" 
          value={stock.eps} 
          prefix="₹"
          explanation={stock.epsExplanation} 
        />
        
        <MetricCard 
          title="Market Cap" 
          value={formatMarketCap(stock.marketCap)} 
          prefix="₹"
          explanation={stock.marketCapExplanation} 
        />
        
        <MetricCard 
          title="Revenue Growth" 
          value={stock.revenueGrowth ? (stock.revenueGrowth * 100).toFixed(1) : null} 
          suffix="%"
          explanation={stock.revenueGrowthExplanation} 
        />
        
        <MetricCard 
          title="Debt to Equity" 
          value={stock.debtToEquity} 
          explanation={stock.debtToEquityExplanation} 
        />
        
        <MetricCard 
          title="Dividend Yield" 
          value={stock.dividendYield ? (stock.dividendYield * 100).toFixed(2) : null} 
          suffix="%"
          explanation="How much a company pays out in dividends each year relative to its stock price. A bonus for holding the stock!" 
        />
        
        <MetricCard 
          title="Return on Equity" 
          value={stock.roe ? (stock.roe * 100).toFixed(1) : null} 
          suffix="%"
          explanation="Measures a corporation's profitability by revealing how much profit a company generates with the money shareholders have invested." 
        />
        
        <MetricCard 
          title="52 Week Range" 
          value={`${stock.fiftyTwoWeekLow} - ₹${stock.fiftyTwoWeekHigh}`} 
          prefix="₹"
          explanation="The highest and lowest price the stock has traded at during the past year. Useful for seeing where the current price sits." 
        />
      </div>
    </div>
  );
};

export default MetricsPanel;
