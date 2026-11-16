import React from 'react';
import { TrendingUp } from 'lucide-react';

/**
 * AuthLayout - Used ONLY for login and register pages.
 * No sidebar, no navbar, no dashboard components.
 * Full-screen centered card layout.
 */
const AuthLayout = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      background: 'var(--bg-darker)',
      padding: '1.5rem',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Minimal brand mark at top */}
      <div style={{
        position: 'absolute',
        top: '1.5rem',
        left: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <TrendingUp size={22} color="var(--primary)" />
        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>Stockify</span>
      </div>

      {/* Subtle background glow - single, contained radial */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 65%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Page content (login/register card) */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {children}
      </div>

      {/* Footer text */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        © 2024 Stockify AI. Smart investing for everyone.
      </div>
    </div>
  );
};

export default AuthLayout;
