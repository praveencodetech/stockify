import React, { useState, useEffect } from 'react';
import { PieChart, Search, Info, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { mutualFundService } from '../services/mutualFundService';
import FundExplainModal from '../components/FundExplainModal';

const SchemeCard = ({ scheme, onExplain }) => {
  const [expanded, setExpanded] = useState(false);
  const riskBadge = { 'High': 'badge-danger', 'Moderate': 'badge-warning', 'Low': 'badge-success' };

  return (
    <div className="glass-panel p-5 animate-slide-up" style={{ transition: 'all 0.25s', border: '1px solid var(--border)' }}>
      <div className="flex justify-between" style={{ alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h4 style={{ fontSize: '1.1rem', lineHeight: 1.3, marginBottom: '0.2rem', color: 'var(--text-main)' }}>{scheme.name}</h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>🎯 {scheme.bestFor || 'Wealth Creation'}</span>
        </div>
        <span className={`badge ${riskBadge[scheme.riskLevel] || 'badge-primary'}`} style={{ whiteSpace: 'nowrap', fontSize: '0.7rem' }}>{scheme.riskLevel}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{scheme.category}</span>
        <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
          {'⭐'.repeat(scheme.rating)} ({scheme.rating}/5)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2" style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)' }}>
        {Object.entries(scheme.returns || { '1Y': scheme.expectedReturn }).map(([period, val]) => (
          <div key={period} style={{ textAlign: 'center' }}>
            <div className="text-muted" style={{ fontSize: '0.65rem' }}>{period} Ret</div>
            <div className="text-success" style={{ fontWeight: 700, fontSize: '0.9rem' }}>+{val}%</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setExpanded(!expanded)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide Details' : 'View Benefits & Risks'}
        </button>
        {expanded && (
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--bg-darker)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>✅ Benefits</div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {scheme.benefits?.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--danger)', marginBottom: '0.25rem' }}>⚠️ Risks</div>
              <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
                {scheme.risks?.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

      <button className="btn btn-outline" style={{ width: '100%', fontSize: '0.85rem' }} onClick={() => onExplain(scheme)}>
        <Sparkles size={14} className="text-accent" /> Explain this Fund
      </button>
    </div>
  );
};

const MutualFundsPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [explainingScheme, setExplainingScheme] = useState(null);

  const categories = ['All', 'Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Hybrid', 'Debt', 'Index', 'Liquid'];

  useEffect(() => {
    mutualFundService.getAllSchemes().then(data => {
      setSchemes(data);
      setLoading(false);
    });
  }, []);

  const filteredSchemes = schemes
    .filter(s => activeTab === 'All' || s.category === activeTab)
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <PieChart size={48} className="text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PieChart size={32} /> Mutual Fund Schemes
        </h1>
        <p className="text-muted mt-2">Explore and filter the best performing Indian mutual funds.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 mb-8 flex flex-col md-flex-row gap-4 justify-between items-center">
        <div style={{ position: 'relative', flex: 1, width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-control"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search for a fund..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="tab-group" style={{ margin: 0, border: 'none', padding: 0, overflowX: 'auto', maxWidth: '100%' }}>
          {categories.map(cat => (
            <button key={cat} className={`tab-item ${activeTab === cat ? 'active' : ''}`} style={{ fontSize: '0.85rem' }} onClick={() => setActiveTab(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-3">
        {filteredSchemes.map(scheme => (
          <SchemeCard key={scheme.id} scheme={scheme} onExplain={setExplainingScheme} />
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="glass-panel p-12 text-center">
          <Info size={48} className="text-muted mx-auto mb-4" />
          <p className="text-muted">No funds found matching your search.</p>
        </div>
      )}

      {explainingScheme && <FundExplainModal scheme={explainingScheme} onClose={() => setExplainingScheme(null)} />}


    </div>
  );
};

export default MutualFundsPage;
