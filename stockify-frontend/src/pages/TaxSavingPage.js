import React, { useState, useEffect } from 'react';
import { ShieldCheck, Calculator, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { mutualFundService } from '../services/mutualFundService';
import { Link } from 'react-router-dom';

const TaxSavingPage = () => {
  const [elssFunds, setElssFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [existing80C, setExisting80C] = useState(50000);

  useEffect(() => {
    mutualFundService.getAllSchemes().then(data => {
      setElssFunds(data.filter(s => s.category === 'ELSS'));
      setLoading(false);
    });
  }, []);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  // Simple old regime tax calculation estimate to show tax savings
  // (Actual logic would be more complex, we use a fixed 30% slab for simplicity if income > 10L)
  const calculateTaxSavings = () => {
    const max80C = 150000;
    const availableSpace = Math.max(0, max80C - existing80C);
    let taxSlabRate = 0;
    if (annualIncome > 1000000) taxSlabRate = 0.30;
    else if (annualIncome > 500000) taxSlabRate = 0.20;
    else if (annualIncome > 250000) taxSlabRate = 0.05;

    // Add 4% cess
    const actualTaxSaved = availableSpace * taxSlabRate * 1.04;
    return { availableSpace, actualTaxSaved };
  };

  const { availableSpace, actualTaxSaved } = calculateTaxSavings();

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={32} /> Tax Saving (ELSS) Dashboard
        </h1>
        <p className="text-muted mt-2">Invest in Equity Linked Savings Schemes to save tax under Section 80C.</p>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2 gap-8 mb-8">
        {/* Tax Calculator */}
        <div className="glass-panel p-6">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <Calculator size={18} className="text-success" /> Section 80C Tax Calculator
          </h3>
          
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Your Annual Income <span className="text-primary">{fmt(annualIncome)}</span>
            </label>
            <input type="range" min="300000" max="5000000" step="100000" value={annualIncome}
              onChange={e => setAnnualIncome(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
          </div>

          <div className="input-group mt-6">
            <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Existing 80C Investments (PF, LIC, etc.) <span className="text-accent">{fmt(existing80C)}</span>
            </label>
            <input type="range" min="0" max="150000" step="5000" value={existing80C}
              onChange={e => setExisting80C(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
          </div>

          <div style={{ marginTop: '2.5rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'center' }}>
            <div className="text-muted" style={{ marginBottom: '0.5rem' }}>You should invest this amount in ELSS:</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', marginBottom: '0.5rem' }}>{fmt(availableSpace)}</div>
            <div style={{ fontSize: '0.9rem' }}>
              By doing this, you can save up to <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{fmt(actualTaxSaved)}</span> in taxes.
            </div>
          </div>
        </div>

        {/* Benefits Info */}
        <div className="glass-panel p-6" style={{ background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Why invest in ELSS?</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(16,185,129,0.15)', borderRadius: '50%', color: 'var(--success)' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Dual Benefit</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>Creates long-term wealth through equity markets while saving your annual tax.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(59,130,246,0.15)', borderRadius: '50%', color: 'var(--primary)' }}>
                <Clock size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Lowest Lock-in Period</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>Compared to PPF (15 yrs) or FD (5 yrs), ELSS has the shortest lock-in period of just 3 years.</p>
              </div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(139,92,246,0.15)', borderRadius: '50%', color: 'var(--accent)' }}>
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>Higher Returns</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>Historically, equity-oriented tax savers have outperformed traditional fixed income tax-saving instruments.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="glass-panel p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Top Rated ELSS Funds</h3>
          <Link to="/mutual-funds" className="text-primary hover-underline" style={{ fontSize: '0.85rem', fontWeight: 600 }}>See All Funds →</Link>
        </div>
        
        <div className="grid grid-cols-1 md-grid-cols-3 gap-6">
          {loading ? (
            <div className="text-muted" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>Loading funds...</div>
          ) : (
            elssFunds.map(fund => (
              <div key={fund.id} style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{fund.name}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>
                  Rating: <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(fund.rating)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expected Return</span>
                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>+{fund.expectedReturn}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .lg-grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 768px) {
          .md-grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default TaxSavingPage;
