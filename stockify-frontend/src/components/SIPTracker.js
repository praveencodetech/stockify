import React, { useState, useEffect } from 'react';
import { Calendar, IndianRupee, Plus, Trash2, TrendingUp, AlertCircle } from 'lucide-react';

const SIPTracker = () => {
  const [sips, setSips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [fundName, setFundName] = useState('');
  const [amount, setAmount] = useState('');
  const [dateStr, setDateStr] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('stockify_sips');
    if (saved) {
      try {
        setSips(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved SIPs", e);
      }
    }
  }, []);

  // Save to localStorage when updated
  useEffect(() => {
    localStorage.setItem('stockify_sips', JSON.stringify(sips));
  }, [sips]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!fundName || !amount || !dateStr) return;
    
    // dateStr format is usually YYYY-MM
    // For simplicity, we just take the day of the month if they entered a full date, 
    // or just assume standard monthly format. We'll ask for a Day of the Month (1-28).
    const day = parseInt(dateStr, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      alert("Please enter a valid day of the month (1-31)");
      return;
    }

    const newSip = {
      id: Date.now().toString(),
      fundName,
      amount: Number(amount),
      investmentDate: day,
      createdAt: new Date().toISOString()
    };

    setSips([...sips, newSip]);
    setFundName(''); setAmount(''); setDateStr('');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setSips(sips.filter(s => s.id !== id));
  };

  const currentDay = new Date().getDate();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const totalAmount = sips.reduce((acc, curr) => acc + curr.amount, 0);

  // Month progress calculation (e.g. current month out of 12)
  const monthIndex = new Date().getMonth() + 1; 
  const yearProgressPercent = Math.round((monthIndex / 12) * 100);

  return (
    <div className="animate-fade-in" style={{ padding: '0 0.5rem' }}>
      
      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass-panel p-5">
          <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Total Monthly SIPs</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--primary)' }}>
            ₹{totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>Across {sips.length} funds</div>
        </div>
        
        <div className="glass-panel p-5">
          <div className="text-muted mb-1" style={{ fontSize: '0.875rem' }}>Yearly Progress ({new Date().getFullYear()})</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{yearProgressPercent}%</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>completed</span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${yearProgressPercent}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} className="text-primary"/> Active SIPs
        </h3>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}>
          <Plus size={16} /> Add SIP
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="glass-panel p-5 mb-6 animate-slide-up" style={{ border: '1px solid var(--primary)' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>New SIP Details</h4>
          <div className="grid grid-cols-3 gap-4" style={{ alignItems: 'end' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Fund Name</label>
              <input type="text" className="input-control" placeholder="e.g. Parag Parikh Flexi Cap" 
                value={fundName} onChange={e => setFundName(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Monthly Amount (₹)</label>
              <input type="number" className="input-control" placeholder="5000" 
                value={amount} onChange={e => setAmount(e.target.value)} required min="100" />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">SIP Date (1-31)</label>
              <input type="number" className="input-control" placeholder="5" 
                value={dateStr} onChange={e => setDateStr(e.target.value)} required min="1" max="31" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save SIP</button>
          </div>
        </form>
      )}

      {/* SIPs List */}
      <div className="grid grid-cols-1 gap-4">
        {sips.length === 0 ? (
          <div className="glass-panel p-8" style={{ textAlign: 'center', opacity: 0.7 }}>
            <TrendingUp size={40} className="text-muted" style={{ margin: '0 auto 1rem' }} />
            <p>No active SIPs added yet.</p>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>Track your monthly investments here.</p>
          </div>
        ) : (
          sips.map(sip => {
            const isPaid = currentDay >= sip.investmentDate;
            return (
              <div key={sip.id} className="glass-panel p-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{sip.fundName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Amount: <strong style={{ color: 'var(--text-main)' }}>₹{sip.amount.toLocaleString('en-IN')}</strong></span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>Date: <strong>{sip.investmentDate}th</strong> of month</span>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentMonth} Status</div>
                    {isPaid ? (
                      <span className="badge badge-success" style={{ padding: '0.2rem 0.5rem', marginTop: '0.25rem' }}>✓ Paid</span>
                    ) : (
                      <span className="badge badge-warning" style={{ padding: '0.2rem 0.5rem', marginTop: '0.25rem' }}>Pending</span>
                    )}
                  </div>
                  <button onClick={() => handleDelete(sip.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', opacity: 0.7 }} title="Delete SIP">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SIPTracker;
