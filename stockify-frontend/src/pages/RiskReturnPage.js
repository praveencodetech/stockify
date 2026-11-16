import React, { useState, useEffect, useMemo } from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mutualFundService } from '../services/mutualFundService';

const RiskReturnPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mutualFundService.getAllSchemes().then(data => {
      setSchemes(data);
      setLoading(false);
    });
  }, []);

  const getCatColor = (cat) => {
    switch (cat) {
      case 'Large Cap': return '#3b82f6';
      case 'Mid Cap': return '#f59e0b';
      case 'Small Cap': return '#ef4444';
      case 'ELSS': return '#10b981';
      case 'Hybrid': return '#8b5cf6';
      default: return '#06b6d4';
    }
  };

  const chartData = useMemo(() => {
    const riskMap = { 'Low': 1, 'Moderate': 2, 'High': 3 };
    // Add some random jitter to risk so dots don't overlap perfectly on X axis
    return schemes.map(s => ({
      ...s,
      riskNumeric: (riskMap[s.riskLevel] || 2) + (Math.random() * 0.4 - 0.2), 
      xLabel: s.riskLevel
    }));
  }, [schemes]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{data.name}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>{data.category}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Expected Return:</span>
            <span style={{ fontWeight: 600, color: 'var(--success)' }}>{data.expectedReturn}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
            <span style={{ fontSize: '0.85rem' }}>Risk Level:</span>
            <span style={{ fontWeight: 600, color: data.riskLevel === 'High' ? 'var(--danger)' : data.riskLevel === 'Low' ? 'var(--success)' : 'var(--warning)' }}>
              {data.riskLevel}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Target size={48} className="text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Target size={32} /> Risk vs Return Analysis
        </h1>
        <p className="text-muted mt-2">Visually compare the potential returns of funds against their inherent risk levels.</p>
      </div>

      <div className="glass-panel p-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={18} className="text-warning" /> Risk-Reward Landscape
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Higher points = Higher returns. Points further to the right = Higher risk.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
            {['Large Cap', 'Mid Cap', 'Small Cap', 'ELSS', 'Hybrid'].map(cat => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: getCatColor(cat), display: 'inline-block' }}></span>
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.1)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="riskNumeric" type="number" domain={[0, 4]} ticks={[1, 2, 3]} 
                tickFormatter={(val) => val === 1 ? 'Low Risk' : val === 2 ? 'Moderate Risk' : val === 3 ? 'High Risk' : ''}
                stroke="var(--text-muted)" />
              <YAxis dataKey="expectedReturn" type="number" name="Return" unit="%" 
                domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-muted)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Scatter name="Funds" data={chartData}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCatColor(entry.category)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RiskReturnPage;
