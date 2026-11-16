import React, { useState, useMemo } from 'react';
import { Sliders, IndianRupee, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const WhatIfSimulatorPage = () => {
  const [monthly, setMonthly] = useState(5000);
  const [duration, setDuration] = useState(10);
  const [rate, setRate] = useState(12);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const results = useMemo(() => {
    const P = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const n = Number(duration) * 12;
    if (P <= 0 || r <= 0 || n <= 0) return { invested: 0, returns: 0, total: 0, yearlyData: [] };

    const total = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;

    // Yearly breakdown
    const yearlyData = [];
    for (let y = 1; y <= duration; y++) {
      const m = y * 12;
      const val = P * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
      yearlyData.push({
        year: `Yr ${y}`,
        invested: Math.round(P * m),
        returns: Math.round(val - P * m),
        total: Math.round(val)
      });
    }

    return { invested: Math.round(invested), returns: Math.round(total - invested), total: Math.round(total), yearlyData };
  }, [monthly, duration, rate]);

  const investedPct = results.total > 0 ? ((results.invested / results.total) * 100).toFixed(0) : 50;

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sliders size={32} /> What-If Simulator
        </h1>
        <p className="text-muted mt-2">Drag the sliders and watch your wealth grow in real time.</p>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2 gap-8">
        {/* Controls */}
        <div className="glass-panel p-6">
          <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} className="text-primary" /> Adjust Parameters
          </h3>

          {/* Monthly Investment */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                <IndianRupee size={14} className="text-primary" /> Monthly Investment
              </label>
              <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{fmt(monthly)}</span>
            </div>
            <input type="range" min="500" max="100000" step="500" value={monthly}
              onChange={e => setMonthly(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>₹500</span><span>₹1,00,000</span>
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                <Clock size={14} className="text-accent" /> Duration
              </label>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.1rem' }}>{duration} years</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1 yr</span><span>30 yrs</span>
            </div>
          </div>

          {/* Rate */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
                <TrendingUp size={14} className="text-success" /> Expected Return
              </label>
              <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem' }}>{rate}%</span>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={rate}
              onChange={e => setRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--success)', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>1%</span><span>30%</span>
            </div>
          </div>

          {/* Invested vs Returns Bar */}
          <div style={{ marginTop: '1rem' }}>
            <div className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Invested vs Returns</div>
            <div style={{ display: 'flex', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '28px' }}>
              <div style={{ width: `${investedPct}%`, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, transition: 'width 0.3s' }}>
                Invested
              </div>
              <div style={{ flex: 1, background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 600, transition: 'width 0.3s' }}>
                Returns
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-panel p-4" style={{ textAlign: 'center' }}>
              <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Invested</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary)' }}>{fmt(results.invested)}</div>
            </div>
            <div className="glass-panel p-4" style={{ textAlign: 'center' }}>
              <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Est. Returns</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>{fmt(results.returns)}</div>
            </div>
            <div className="glass-panel p-4" style={{ textAlign: 'center', border: '1px solid var(--primary)' }}>
              <div className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>Total Value</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{fmt(results.total)}</div>
            </div>
          </div>

          {/* Yearly Chart */}
          <div className="glass-panel p-5">
            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart2 size={16} className="text-accent" /> Year-by-Year Growth
            </h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.yearlyData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="invested" stackId="a" fill="var(--primary)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="returns" stackId="a" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--primary)', display: 'inline-block' }}></span> Invested
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)', display: 'inline-block' }}></span> Returns
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default WhatIfSimulatorPage;
