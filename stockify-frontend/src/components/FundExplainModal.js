import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { mutualFundService } from '../services/mutualFundService';

const FundExplainModal = ({ scheme, onClose }) => {
  const [explanation, setExplanation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (scheme) {
      setLoading(true);
      // Simulate API call to get AI explanation
      mutualFundService.generateExplanation(scheme).then(data => {
        setExplanation(data);
        setLoading(false);
      });
    }
  }, [scheme]);

  if (!scheme) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(5px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-slide-up" style={{
        width: '100%', maxWidth: '500px',
        border: '1px solid var(--accent)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1.25rem', borderBottom: '1px solid var(--border)',
          background: 'rgba(139, 92, 246, 0.1)'
        }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '1.1rem' }}>
            <Sparkles size={18} className="text-accent" /> AI Explanation
          </h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem'
          }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Fund Name</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{scheme.name}</div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--accent)' }}>
              <Loader2 size={32} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '1rem' }} />
              <div style={{ fontSize: '0.875rem' }}>Analyzing fund data...</div>
            </div>
          ) : (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <p style={{ margin: '0 0 0.75rem 0', fontWeight: 500, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Here is a simple breakdown:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {explanation.map((point, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border)', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it, thanks!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default FundExplainModal;
