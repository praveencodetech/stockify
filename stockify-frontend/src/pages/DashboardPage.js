import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { stockService } from '../services/stockService';
import { mutualFundService } from '../services/mutualFundService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, Wallet, CheckCircle, TrendingDown, Star, ChevronRight } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [topFunds, setTopFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sipTotal, setSipTotal] = useState(0);
  const [portfolioSummary, setPortfolioSummary] = useState({ totalInvested: 820000, totalPnL: 185500 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mockFunds = [
          { id: 'f1', name: 'Axis Bluechip Fund', category: 'Large Cap', expectedReturn: 15.2, riskLevel: 'Moderate', rating: 5, tag: 'Top Fund' },
          { id: 'f2', name: 'SBI Small Cap Fund', category: 'Small Cap', expectedReturn: 28.4, riskLevel: 'High', rating: 4, tag: 'High Growth' },
          { id: 'f3', name: 'Mirae Tax Saver', category: 'ELSS', expectedReturn: 18.1, riskLevel: 'Moderate', rating: 5, tag: 'Tax Saving' },
        ];
        
        try {
          const fundsRes = await mutualFundService.getAllSchemes();
          if (fundsRes && fundsRes.length > 0) {
            setTopFunds(fundsRes.filter(s => s.isTopFund).slice(0, 3));
          } else {
            setTopFunds(mockFunds);
          }
        } catch {
          setTopFunds(mockFunds);
        }

        try {
          const saved = JSON.parse(localStorage.getItem('stockify_sips') || '[]');
          setSipTotal(saved.reduce((acc, s) => acc + (s.amount || 0), 0) || 20000);
        } catch (e) {
          setSipTotal(20000);
        }

        try {
          const portfolioRes = await stockService.getPortfolioSummary();
          if(portfolioRes?.data?.totalInvested) {
             setPortfolioSummary(portfolioRes.data);
          }
        } catch (e) { }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  const sentimentData = [
    { name: 'Bullish', value: 60, color: '#10b981' },
    { name: 'Bearish', value: 25, color: '#ef4444' },
    { name: 'Neutral', value: 15, color: '#94a3b8' }
  ];

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="text-primary" style={{ fontWeight: 600 }}>Loading dashboard analytics...</div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      
      {/* Page Header - Refined */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Investment Overview</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Monitor your portfolio performance and market trends.</p>
      </div>

      {/* Summary Cards Row - STRICT grid-cols-4 */}
      <div className="grid grid-cols-4 mb-8">
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <Wallet size={16} className="text-primary" /> Total Invested
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{fmt(portfolioSummary.totalInvested)}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>↑ 12% from last month</div>
        </div>
        
        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <TrendingUp size={16} className="text-accent" /> Monthly SIP
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{fmt(sipTotal)}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>4 active mandates</div>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <CheckCircle size={16} className="text-success" /> Total Returns
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>+{fmt(portfolioSummary.totalPnL)}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>+4.2% overall</div>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            <Calendar size={16} className="text-warning" /> Next Installment
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>May 25</div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto-debit active</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-[1fr_320px] gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Top Funds Section */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Featured Mutual Funds</h2>
              <Link to="/mutual-funds" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
                View Explorer <ChevronRight size={14}/>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {topFunds.map((fund, idx) => (
                <div key={fund.id || idx} style={{ 
                  background: 'var(--bg-darker)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '160px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.25rem 0.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '4px', display: 'inline-block', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
                      {fund.category}
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{fund.name}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>3Y Returns</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>+{fund.expectedReturn}%</div>
                    </div>
                    <div style={{ padding: '0.4rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '50%' }}>
                      <Star size={14} fill="currentColor" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Portfolio Table */}
          <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Performance Watchlist</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-darker)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>Scheme Name</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>Returns</th>
                    <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontWeight: 600 }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, name: 'Parag Parikh Flexi Cap', cat: 'Flexi Cap', ret: '18.5%', rat: 5, color: 'var(--primary)' },
                    { id: 2, name: 'Quant Small Cap Fund', cat: 'Small Cap', ret: '32.1%', rat: 4, color: 'var(--warning)' },
                    { id: 3, name: 'HDFC ELSS Tax Saver', cat: 'ELSS', ret: '16.8%', rat: 4, color: 'var(--success)' },
                  ].map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{item.name}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.5rem', background: 'var(--bg-darker)', borderRadius: '4px', color: 'var(--text-muted)' }}>{item.cat}</span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--success)', textAlign: 'right' }}>+{item.ret}</td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                        <div style={{ color: '#f59e0b', fontSize: '0.75rem' }}>{'★'.repeat(item.rat)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Market Sentiment</h3>
            <div style={{ position: 'relative', height: '160px', marginBottom: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>60%</div>
                <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bullish</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {sentimentData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 500 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '2px', background: d.color }}></span> {d.name}
                   </div>
                   <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{d.value}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Latest Insights</h3>
            <div className="flex flex-col gap-5">
              {[
                { title: 'Market Hits Record', desc: 'Nifty touches 23k mark.', color: 'var(--primary)', icon: <TrendingUp size={14}/> },
                { title: 'Inflation Cools', desc: 'RBI holds rates steady.', color: 'var(--success)', icon: <TrendingDown size={14}/> },
                { title: 'New NFO Launch', desc: 'SBI Automotive fund opens.', color: 'var(--warning)', icon: <Star size={14}/> }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem' }}>
                   <div style={{ width: '32px', height: '32px', flexShrink: 0, background: 'var(--bg-darker)', color: item.color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                   </div>
                   <div>
                     <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
