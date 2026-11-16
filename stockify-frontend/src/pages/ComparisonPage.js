import React, { useState, useEffect } from 'react';
import { Scale, Plus, X, Star } from 'lucide-react';
import { mutualFundService } from '../services/mutualFundService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ComparisonPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [selected, setSelected] = useState([]); // max 3
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService.getAllSchemes().then(data => {
      setSchemes(data);
      setLoading(false);
    });
  }, []);

  const addFund = (scheme) => {
    if (selected.length >= 3) return;
    if (selected.find(s => s.id === scheme.id)) return;
    setSelected([...selected, scheme]);
  };

  const removeFund = (id) => {
    setSelected(selected.filter(s => s.id !== id));
  };

  // Generate 5-year growth data for selected funds (simulated)
  const generateGrowthData = () => {
    if (selected.length === 0) return [];
    const data = [];
    for (let y = 0; y <= 5; y++) {
      const point = { year: `Year ${y}` };
      selected.forEach(s => {
        // Compound growth from ₹10,000 invested
        point[s.name] = Math.round(10000 * Math.pow(1 + s.expectedReturn / 100, y));
      });
      data.push(point);
    }
    return data;
  };

  const growthData = generateGrowthData();
  const colors = ['#3b82f6', '#10b981', '#f59e0b'];
  const riskColor = { 'High': 'var(--danger)', 'Moderate': 'var(--warning)', 'Low': 'var(--success)' };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Scale size={48} className="text-primary" />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Scale size={32} /> Compare Funds
        </h1>
        <p className="text-muted mt-2">Select up to 3 funds and compare their returns, risk, and growth side by side.</p>
      </div>

      {/* Fund Selector */}
      <div className="glass-panel p-5 mb-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Select Funds to Compare ({selected.length}/3)</h3>
          {selected.length > 0 && (
            <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setSelected([])}>Clear All</button>
          )}
        </div>

        {/* Selected Chips */}
        {selected.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {selected.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', background: colors[i] + '22', border: `1px solid ${colors[i]}`, borderRadius: '20px', fontSize: '0.85rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i] }}></div>
                {s.name}
                <button onClick={() => removeFund(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, marginLeft: '0.25rem' }}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Fund List */}
        <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.5rem' }}>
          {schemes.map(scheme => {
            const isSelected = selected.find(s => s.id === scheme.id);
            return (
              <button key={scheme.id} onClick={() => isSelected ? removeFund(scheme.id) : addFund(scheme)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.6rem 0.75rem', background: isSelected ? 'rgba(59,130,246,0.08)' : 'var(--bg-darker)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)', cursor: selected.length >= 3 && !isSelected ? 'not-allowed' : 'pointer',
                  opacity: selected.length >= 3 && !isSelected ? 0.5 : 1, textAlign: 'left',
                  color: 'var(--text-main)', width: '100%', fontSize: '0.85rem'
                }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{scheme.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.7rem' }}>{scheme.category} · {scheme.riskLevel}</div>
                </div>
                {isSelected ? <X size={16} className="text-primary" /> : <Plus size={16} className="text-muted" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Results */}
      {selected.length >= 2 && (
        <div className="animate-fade-in">
          {/* Comparison Table */}
          <div className="glass-panel p-5 mb-6">
            <h3 style={{ marginBottom: '1.25rem' }}>📊 Side-by-Side Comparison</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)' }}>Metric</th>
                    {selected.map((s, i) => (
                      <th key={s.id} style={{ textAlign: 'center', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: colors[i] }}></div>
                          <span style={{ fontWeight: 600 }}>{s.name.split(' ').slice(0, 3).join(' ')}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Category', key: 'category' },
                    { label: 'Risk Level', key: 'riskLevel', render: (v) => <span style={{ color: riskColor[v], fontWeight: 600 }}>{v}</span> },
                    { label: '1Y Return', key: 'r1y', render: (_, s) => <span className="text-success" style={{ fontWeight: 600 }}>+{s.returns?.['1Y'] || s.expectedReturn}%</span> },
                    { label: '3Y Return', key: 'r3y', render: (_, s) => <span className="text-success" style={{ fontWeight: 600 }}>+{s.returns?.['3Y'] || '—'}%</span> },
                    { label: '5Y Return', key: 'r5y', render: (_, s) => <span className="text-success" style={{ fontWeight: 600 }}>+{s.returns?.['5Y'] || '—'}%</span> },
                    { label: 'Min. Investment', key: 'minSipAmount', render: (v) => `₹${v}/mo` },
                    { label: 'Rating', key: 'rating', render: (v) => <span>{'⭐'.repeat(v)} ({v}/5)</span> },
                    { label: 'Best For', key: 'bestFor' },
                  ].map(row => (
                    <tr key={row.label} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{row.label}</td>
                      {selected.map(s => (
                        <td key={s.id} style={{ padding: '0.75rem', textAlign: 'center' }}>
                          {row.render ? row.render(s[row.key], s) : s[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Growth Chart */}
          <div className="glass-panel p-5">
            <h3 style={{ marginBottom: '1.25rem' }}>📈 5-Year Growth Projection (₹10,000 invested)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-main)' }}
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                />
                <Legend />
                {selected.map((s, i) => (
                  <Line key={s.id} type="monotone" dataKey={s.name} stroke={colors[i]} strokeWidth={2} dot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {selected.length < 2 && (
        <div className="glass-panel p-12" style={{ textAlign: 'center', opacity: 0.6 }}>
          <Scale size={48} className="text-muted" style={{ margin: '0 auto 1rem' }} />
          <p>Select at least 2 funds above to see the comparison.</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
