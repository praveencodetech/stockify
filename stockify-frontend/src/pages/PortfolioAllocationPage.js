import React, { useState, useEffect, useMemo } from 'react';
import { PieChart as PieChartIcon, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mutualFundService } from '../services/mutualFundService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

const PortfolioAllocationPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService.getAllSchemes().then(data => {
      setSchemes(data);
      setLoading(false);
    });
  }, []);

  const allocation = useMemo(() => {
    if (!schemes.length) return [];
    const catMap = {};
    schemes.forEach(s => {
      catMap[s.category] = (catMap[s.category] || 0) + 1;
    });
    const total = schemes.length;
    return Object.entries(catMap).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
      count
    }));
  }, [schemes]);

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <PieChartIcon size={48} className="text-primary" style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <PieChartIcon size={32} /> Portfolio Allocation
        </h1>
        <p className="text-muted mt-2">Visualize how your mutual fund universe is distributed across categories.</p>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="glass-panel p-6" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem', alignSelf: 'flex-start' }}>📊 Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie data={allocation} cx="50%" cy="50%" innerRadius={80} outerRadius={140}
                paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value}%)`}>
                {allocation.map((entry, idx) => (
                  <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-main)' }}
                formatter={(value) => [`${value}%`, 'Allocation']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown List */}
        <div className="glass-panel p-6">
          <h3 style={{ marginBottom: '1.5rem' }}>📋 Category Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {allocation.map((cat, idx) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.15)', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${COLORS[idx % COLORS.length]}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1rem' }}>{cat.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>{cat.count} fund{cat.count > 1 ? 's' : ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: COLORS[idx % COLORS.length] }}>{cat.value}%</div>
                </div>
                {/* Mini bar */}
                <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.value}%`, height: '100%', background: COLORS[idx % COLORS.length], borderRadius: '3px' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel p-4 mt-6" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <Info size={18} className="text-primary" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                <strong>Tip:</strong> A well-diversified portfolio typically has 40-50% in Large Cap, 20-30% in Mid Cap, and the rest in Small Cap/ELSS. Adjust based on your risk appetite.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) {
          .lg-grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default PortfolioAllocationPage;
