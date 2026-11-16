import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const AIRecommendation = ({ prediction }) => {
  if (!prediction) return null;

  const { recommendation, confidence, reasoning, riskLevel, predictedPrice, currentPrice } = prediction;
  
  // Styling based on recommendation
  const getRecStyles = () => {
    switch (recommendation) {
      case 'BUY':
        return { color: 'var(--success)', bg: 'var(--success-bg)', icon: <TrendingUp size={24} /> };
      case 'SELL':
        return { color: 'var(--danger)', bg: 'var(--danger-bg)', icon: <TrendingDown size={24} /> };
      default:
        return { color: 'var(--warning)', bg: 'var(--warning-bg)', icon: <Minus size={24} /> };
    }
  };

  const getRiskStyles = () => {
    switch (riskLevel) {
      case 'LOW':
        return { color: 'var(--success)', icon: <ShieldCheck size={18} /> };
      case 'HIGH':
        return { color: 'var(--danger)', icon: <ShieldAlert size={18} /> };
      default:
        return { color: 'var(--warning)', icon: <AlertTriangle size={18} /> };
    }
  };

  const recStyle = getRecStyles();
  const riskStyle = getRiskStyles();

  return (
    <div className="glass-panel p-6 animate-slide-up" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px',
        background: recStyle.color, opacity: 0.1, filter: 'blur(50px)', borderRadius: '50%', zIndex: 0
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="flex items-center gap-2 m-0">
            <span className="gradient-text">AI Analysis</span>
          </h3>
          <div className="badge" style={{ background: recStyle.bg, color: recStyle.color, border: `1px solid ${recStyle.color}40`, padding: '0.5rem 1rem', fontSize: '1rem', gap: '0.5rem' }}>
            {recStyle.icon} {recommendation}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>AI Confidence Level</p>
            <div className="flex items-center gap-4">
              <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>{(confidence * 100).toFixed(0)}%</span>
              <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${confidence * 100}%`, height: '100%', background: recStyle.color, transition: 'width 1s ease-out' }}></div>
              </div>
            </div>
          </div>

          <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)' }}>
            <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>Risk Assessment</p>
            <div className="flex items-center gap-2" style={{ color: riskStyle.color, fontWeight: 600, fontSize: '1.125rem' }}>
              {riskStyle.icon} {riskLevel} RISK
            </div>
          </div>
        </div>

        {predictedPrice && currentPrice && (
          <div className="mb-6 p-4" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-muted m-0" style={{ fontSize: '0.875rem' }}>Current Price</p>
                <p className="m-0" style={{ fontSize: '1.25rem', fontWeight: 600 }}>${currentPrice.toFixed(2)}</p>
              </div>
              <div>...</div>
              <div style={{ textAlign: 'right' }}>
                <p className="text-muted m-0" style={{ fontSize: '0.875rem' }}>AI Medium-Term Target</p>
                <p className="m-0" style={{ fontSize: '1.25rem', fontWeight: 600, color: recStyle.color }}>
                  ${predictedPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>AI Reasoning</h4>
          <div className="p-4" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${recStyle.color}` }}>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-dark)' }}>
              {reasoning}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendation;
