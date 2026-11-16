import React from 'react';

const SentimentGauge = ({ score, label }) => {
  // Score is between -1.0 and 1.0
  // Convert to percentage (0 to 100) for the gauge needle
  const percentage = ((score + 1) / 2) * 100;
  
  // Determine color
  let color = 'var(--warning)';
  let bg = 'var(--warning-bg)';
  if (score > 0.3) { color = 'var(--success)'; bg = 'var(--success-bg)'; }
  else if (score < -0.3) { color = 'var(--danger)'; bg = 'var(--danger-bg)'; }

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: 'relative', width: '200px', height: '100px', overflow: 'hidden' }}>
        {/* Background Arc */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '200px', height: '200px',
          borderRadius: '50%', border: '20px solid rgba(255,255,255,0.05)',
          borderBottomColor: 'transparent', borderRightColor: 'transparent',
          transform: 'rotate(45deg)'
        }}></div>
        
        {/* Colored Segments */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '200px', height: '200px',
          borderRadius: '50%', border: '20px solid transparent',
          borderLeftColor: 'var(--danger)', opacity: 0.6,
          transform: 'rotate(45deg)'
        }}></div>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '200px', height: '200px',
          borderRadius: '50%', border: '20px solid transparent',
          borderTopColor: 'var(--warning)', opacity: 0.6,
          transform: 'rotate(45deg)'
        }}></div>
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '200px', height: '200px',
          borderRadius: '50%', border: '20px solid transparent',
          borderRightColor: 'var(--success)', opacity: 0.6,
          transform: 'rotate(-45deg)' /* Adjusted for correct segment */
        }}></div>

        {/* Needle */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', width: '4px', height: '85px',
          background: 'var(--text-main)', transformOrigin: 'bottom center',
          transform: `translateX(-50%) rotate(${(percentage / 100) * 180 - 90}deg)`,
          transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
          borderRadius: '4px'
        }}>
          {/* Needle Base dot */}
          <div style={{
            position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
            width: '12px', height: '12px', borderRadius: '50%', background: 'white'
          }}></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <h4 style={{ margin: 0, fontSize: '1.25rem', color }}>{label.replace('_', ' ')}</h4>
        <p className="text-muted" style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
          Score: {score > 0 ? '+' : ''}{score}
        </p>
      </div>
    </div>
  );
};

export default SentimentGauge;
