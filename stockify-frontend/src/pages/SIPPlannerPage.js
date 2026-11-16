import React, { useState, useEffect } from 'react';
import { Calculator, Target, TrendingUp, Lightbulb } from 'lucide-react';
import { mutualFundService } from '../services/mutualFundService';

const SIPPlannerPage = () => {
  // ── Calculator Mode ──
  const [mode, setMode] = useState('sip'); // 'sip' | 'lumpsum' | 'goal'
  const [amount, setAmount] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  // ── Goal Mode ──
  const [goalAmount, setGoalAmount] = useState(1000000);
  const [goalYears, setGoalYears] = useState(5);
  const [goalRate, setGoalRate] = useState(12);

  // ── Results ──
  const [invested, setInvested] = useState(0);
  const [returns, setReturns] = useState(0);
  const [total, setTotal] = useState(0);
  const [requiredSip, setRequiredSip] = useState(0);

  // ── Recommendation ──
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    mutualFundService.getAllSchemes().then(setSchemes);
  }, []);

  // ── SIP / Lumpsum Calculation ──
  useEffect(() => {
    const P = Number(amount) || 0;
    const r = Number(rate) || 0;
    const t = Number(years) || 0;
    if (P > 0 && r > 0 && t > 0) {
      if (mode === 'sip') {
        const n = t * 12;
        const i = (r / 100) / 12;
        const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        setInvested(Math.round(P * n));
        setReturns(Math.round(M - P * n));
        setTotal(Math.round(M));
      } else if (mode === 'lumpsum') {
        const M = P * Math.pow(1 + r / 100, t);
        setInvested(P);
        setReturns(Math.round(M - P));
        setTotal(Math.round(M));
      }
    }
  }, [amount, rate, years, mode]);

  // ── Goal Calculation ──
  useEffect(() => {
    const target = Number(goalAmount) || 0;
    const r = Number(goalRate) || 0;
    const t = Number(goalYears) || 0;
    if (target > 0 && r > 0 && t > 0) {
      const n = t * 12;
      const i = (r / 100) / 12;
      const sip = target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
      setRequiredSip(Math.round(sip));
    }
  }, [goalAmount, goalRate, goalYears]);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const getSuggestedCategory = (duration) => {
    if (duration >= 7) return ['Small Cap', 'Mid Cap'];
    if (duration >= 3) return ['Large Cap', 'ELSS', 'Index'];
    return ['Hybrid', 'Debt', 'Liquid'];
  };

  const goalSuggestions = getSuggestedCategory(goalYears);
  const suggestedFunds = schemes.filter(s => goalSuggestions.includes(s.category)).slice(0, 3);

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calculator size={32} /> SIP Planner
        </h1>
        <p className="text-muted mt-2">Calculate returns, plan your investments, and set financial goals.</p>
      </div>

      {/* Mode Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { key: 'sip', icon: <TrendingUp size={16} />, label: 'SIP Calculator' },
          { key: 'lumpsum', icon: <Calculator size={16} />, label: 'Lumpsum Calculator' },
          { key: 'goal', icon: <Target size={16} />, label: 'Goal Planner' }
        ].map(({ key, icon, label }) => (
          <button key={key} onClick={() => setMode(key)}
            className={mode === key ? 'btn btn-primary' : 'btn btn-outline'}
            style={{ gap: '0.4rem' }}>
            {icon} {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* ── SIP / Lumpsum Calculator ── */}
        {(mode === 'sip' || mode === 'lumpsum') && (
          <>
            <div className="glass-panel p-6">
              <h3 style={{ marginBottom: '1.5rem' }}>
                {mode === 'sip' ? '💰 Monthly SIP Calculator' : '💎 Lumpsum Calculator'}
              </h3>

              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {mode === 'sip' ? 'Monthly Amount' : 'Investment Amount'}
                  <span className="text-primary">{fmt(amount)}</span>
                </label>
                <input type="range" min="500" max={mode === 'sip' ? '100000' : '5000000'} step="500"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                <input type="number" className="input-control" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>

              <div className="input-group mt-4">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Expected Return (p.a.) <span style={{ color: 'var(--accent)' }}>{rate}%</span>
                </label>
                <input type="range" min="1" max="30" step="0.5" value={rate} onChange={e => setRate(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
              </div>

              <div className="input-group mt-4">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Duration <span>{years} Yrs</span>
                </label>
                <input type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Results Panel */}
            <div className="glass-panel p-6">
              <h3 style={{ marginBottom: '1.5rem' }}>📊 Projected Results</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="text-muted">Invested Amount</span>
                  <span style={{ fontWeight: 600 }}>{fmt(invested)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="text-muted">Estimated Returns</span>
                  <span className="text-success" style={{ fontWeight: 600 }}>{fmt(returns)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '2px dashed var(--border-light)' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Value</span>
                  <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)' }}>{fmt(total)}</span>
                </div>
              </div>

              {/* Visual Bar */}
              <div style={{ marginTop: '1rem' }}>
                <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Investment vs Returns</div>
                <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '32px' }}>
                  <div style={{ width: `${total > 0 ? (invested / total) * 100 : 50}%`, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                    Invested
                  </div>
                  <div style={{ flex: 1, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600 }}>
                    Returns
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Goal-Based Planner ── */}
        {mode === 'goal' && (
          <>
            <div className="glass-panel p-6">
              <h3 style={{ marginBottom: '1.5rem' }}>🎯 Goal-Based SIP Planner</h3>
              <p className="text-muted mb-6" style={{ fontSize: '0.875rem' }}>
                Tell us your financial goal and we'll calculate the monthly SIP required.
              </p>

              <div className="input-group">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Target Amount <span className="text-primary">{fmt(goalAmount)}</span>
                </label>
                <input type="range" min="50000" max="10000000" step="50000" value={goalAmount} onChange={e => setGoalAmount(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                <input type="number" className="input-control" value={goalAmount} onChange={e => setGoalAmount(e.target.value)} />
              </div>

              <div className="input-group mt-4">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Time to Achieve <span>{goalYears} Yrs</span>
                </label>
                <input type="range" min="1" max="30" step="1" value={goalYears} onChange={e => setGoalYears(e.target.value)}
                  style={{ width: '100%', cursor: 'pointer' }} />
              </div>

              <div className="input-group mt-4">
                <label className="input-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  Expected Return (p.a.) <span style={{ color: 'var(--accent)' }}>{goalRate}%</span>
                </label>
                <input type="range" min="4" max="25" step="0.5" value={goalRate} onChange={e => setGoalRate(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
              </div>
            </div>

            {/* Goal Results */}
            <div className="glass-panel p-6">
              <h3 style={{ marginBottom: '1.5rem' }}>📋 Your Plan</h3>

              <div style={{ textAlign: 'center', padding: '2rem 0', marginBottom: '1.5rem' }}>
                <div className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Required Monthly SIP</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{fmt(requiredSip)}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>per month for {goalYears} years</div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="text-muted">Total You'll Invest</span>
                  <span style={{ fontWeight: 500 }}>{fmt(requiredSip * goalYears * 12)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="text-muted">Expected Returns</span>
                  <span className="text-success" style={{ fontWeight: 500 }}>{fmt(goalAmount - (requiredSip * goalYears * 12))}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px dashed var(--border-light)' }}>
                  <span style={{ fontWeight: 600 }}>Target Amount</span>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>{fmt(goalAmount)}</span>
                </div>
              </div>

              {/* Suggested Funds */}
              {suggestedFunds.length > 0 && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <Lightbulb size={16} className="text-warning" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Suggested fund categories: {goalSuggestions.join(', ')}</span>
                  </div>
                  {suggestedFunds.map(f => (
                    <div key={f.id} style={{ padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 500 }}>{f.name}</span>
                      <span className="text-muted" style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>({f.category})</span>
                      <span className="text-success" style={{ fontSize: '0.75rem', marginLeft: '0.5rem', fontWeight: 600 }}>+{f.expectedReturn}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SIPPlannerPage;
