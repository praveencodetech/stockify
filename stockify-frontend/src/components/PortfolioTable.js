import React from 'react';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioTable = ({ items, onRemove }) => {
  if (!items || items.length === 0) {
    return (
      <div className="glass-panel p-8 text-center" style={{ borderStyle: 'dashed' }}>
        <p className="text-muted mb-4">Your portfolio is empty.</p>
        <p>Start tracking your investments by adding stocks to your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <th className="p-4 font-semibold text-muted text-sm">Asset</th>
            <th className="p-4 font-semibold text-muted text-sm text-right">Qty</th>
            <th className="p-4 font-semibold text-muted text-sm text-right">Avg Cost</th>
            <th className="p-4 font-semibold text-muted text-sm text-right">Current Price</th>
            <th className="p-4 font-semibold text-muted text-sm text-right">Total Value</th>
            <th className="p-4 font-semibold text-muted text-sm text-right">Total Return</th>
            <th className="p-4 font-semibold text-muted text-sm text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const currentPrice = item.stock?.currentPrice || 0;
            const invested = item.buyPrice * item.quantity;
            const currentValue = currentPrice * item.quantity;
            const pnl = currentValue - invested;
            const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
            const isPositive = pnl >= 0;

            return (
              <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {item.stock?.symbol?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600 }}>{item.stock?.symbol}</p>
                      <p className="text-muted" style={{ margin: 0, fontSize: '0.75rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.stock?.companyName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right font-medium">{item.quantity}</td>
                <td className="p-4 text-right">₹{item.buyPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-4 text-right">₹{currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-4 text-right font-semibold">₹{currentValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="p-4 text-right">
                  <div style={{ color: isPositive ? 'var(--success)' : 'var(--danger)', fontWeight: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span className="flex items-center gap-1">
                      {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      ₹{Math.abs(pnl).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </span>
                    <span style={{ fontSize: '0.75rem' }}>
                      {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="btn btn-outline"
                    style={{ padding: '0.375rem', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;
