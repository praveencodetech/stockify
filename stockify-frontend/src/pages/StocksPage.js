import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stockService } from '../services/stockService';
import { TrendingUp, TrendingDown, RefreshCw, Search, BarChart2, ChevronDown, Layers } from 'lucide-react';

// Sector icon colors for visual distinction
const sectorColors = {
  IT: '#3b82f6',
  Banking: '#8b5cf6',
  FMCG: '#f59e0b',
  Pharma: '#10b981',
  Automobile: '#ef4444',
  Energy: '#f97316',
  Infrastructure: '#6366f1',
  Telecom: '#06b6d4',
};

const StocksPage = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [activeSector, setActiveSector] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [stocksRes, sectorsRes] = await Promise.all([
          stockService.searchStocks(''),
          stockService.getSectors(),
        ]);
        setStocks(stocksRes.data || []);
        setSectors(sectorsRes.data || []);
      } catch (err) {
        console.error('Failed to load stocks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter stocks by search term
  const searchFiltered = stocks.filter(s =>
    s.symbol?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.companyName?.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.sector?.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Filter by active sector
  const sectorFiltered = activeSector === 'All'
    ? searchFiltered
    : searchFiltered.filter(s => s.sector === activeSector);

  // Group stocks by sector for the sector-wise view
  const groupedBySector = {};
  sectorFiltered.forEach(s => {
    if (!groupedBySector[s.sector]) groupedBySector[s.sector] = [];
    groupedBySector[s.sector].push(s);
  });

  // Sort sector keys to match the canonical sector order
  const sectorOrder = ['IT', 'Banking', 'FMCG', 'Pharma', 'Automobile', 'Energy', 'Infrastructure', 'Telecom'];
  const orderedSectors = sectorOrder.filter(s => groupedBySector[s]);

  return (
    <div className="container animate-fade-in">

      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <BarChart2 size={26} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
            Indian Stocks
          </h1>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-darker)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            {stocks.length} stocks
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
          Browse stocks sector-wise. Click any stock to view detailed analysis, charts, and AI insights.
        </p>
      </div>

      {/* Controls Row: Search + Sector Chips */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>

        {/* Search Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Filter by name, symbol or sector..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: '0.9rem', color: 'var(--text-main)', width: '100%',
            }}
          />
          {searchFilter && (
            <button
              onClick={() => setSearchFilter('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem', padding: '0 0.25rem' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Sector Filter Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <Layers size={14} style={{ color: 'var(--text-muted)', marginRight: '0.25rem' }} />

          <button
            onClick={() => setActiveSector('All')}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '20px',
              border: activeSector === 'All' ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: activeSector === 'All' ? 'var(--primary-glow)' : 'transparent',
              color: activeSector === 'All' ? 'var(--primary)' : 'var(--text-dark)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All Sectors
          </button>

          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setActiveSector(activeSector === sector ? 'All' : sector)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '20px',
                border: activeSector === sector ? `2px solid ${sectorColors[sector] || 'var(--primary)'}` : '1px solid var(--border)',
                background: activeSector === sector ? `${sectorColors[sector]}15` : 'transparent',
                color: activeSector === sector ? (sectorColors[sector] || 'var(--primary)') : 'var(--text-dark)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '5rem', color: 'var(--primary)' }}>
          <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Loading stocks...</span>
        </div>
      )}

      {/* Sector-wise Stock Sections */}
      {!loading && orderedSectors.map(sector => (
        <div key={sector} style={{ marginBottom: '2rem' }}>

          {/* Sector Heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '3px',
              background: sectorColors[sector] || 'var(--primary)',
            }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {sector}
            </h2>
            <span style={{
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)',
              background: 'var(--bg-darker)', padding: '0.15rem 0.5rem',
              borderRadius: '10px', border: '1px solid var(--border)',
            }}>
              {groupedBySector[sector].length} stocks
            </span>
          </div>

          {/* Sector Stock Table */}
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>

            {/* Header Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr',
              padding: '0.75rem 1.5rem',
              background: 'var(--bg-darker)',
              borderBottom: '1px solid var(--border)',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              <span>Company</span>
              <span>Symbol</span>
              <span style={{ textAlign: 'right' }}>Price</span>
              <span style={{ textAlign: 'right' }}>Change</span>
            </div>

            {/* Stock Rows */}
            {groupedBySector[sector].map((stock, idx) => {
              const isPositive = (stock.dayChange ?? 0) >= 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => navigate(`/stock/${encodeURIComponent(stock.symbol)}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr',
                    padding: '0.875rem 1.5rem',
                    borderBottom: idx < groupedBySector[sector].length - 1 ? '1px solid var(--border-light)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-darker)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Company Name */}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    {stock.companyName}
                  </span>

                  {/* Symbol */}
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: sectorColors[sector] || 'var(--primary)' }}>
                    {stock.symbol}
                  </span>

                  {/* Price */}
                  <span style={{ textAlign: 'right', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    ₹{stock.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>

                  {/* Change */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                      gap: '0.25rem', fontWeight: 600, fontSize: '0.85rem',
                      color: isPositive ? 'var(--success)' : 'var(--danger)',
                    }}>
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{isPositive ? '+' : ''}{stock.dayChangePercent?.toFixed(2)}%</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {isPositive ? '+' : ''}₹{stock.dayChange?.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {!loading && orderedSectors.length === 0 && (
        <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <BarChart2 size={40} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
          <p style={{ fontWeight: 600 }}>No stocks match your filter.</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Try a different name, symbol, or sector.</p>
        </div>
      )}

      {/* Footer Summary */}
      {!loading && orderedSectors.length > 0 && (
        <div style={{
          textAlign: 'center', padding: '1rem',
          fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500,
        }}>
          Showing <strong style={{ color: 'var(--text-main)' }}>{sectorFiltered.length}</strong> stocks
          across <strong style={{ color: 'var(--text-main)' }}>{orderedSectors.length}</strong> sectors
        </div>
      )}
    </div>
  );
};

export default StocksPage;
