import React, { useState, useEffect } from 'react';
import { stockService } from '../services/stockService';
import PortfolioTable from '../components/PortfolioTable';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { PieChart as PieChartIcon, Activity, RefreshCw } from 'lucide-react';

const PortfolioPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await stockService.getPortfolioSummary();
      setSummary(res.data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this stock from your portfolio?")) {
      try {
        await stockService.removeFromPortfolio(id);
        // Refresh portfolio data
        await fetchPortfolio();
      } catch (error) {
        console.error("Error removing item:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <div className="flex flex-col items-center gap-4 text-primary">
          <RefreshCw size={32} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-muted font-medium">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  const pnlIsPositive = summary?.totalPnL >= 0;
  
  // Prepare data for allocation chart
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#64748b'];
  const allocationData = summary?.items?.map(item => ({
    name: item.stock.symbol,
    value: item.stock.currentPrice * item.quantity
  })).sort((a, b) => b.value - a.value) || [];

  return (
    <div className="container animate-fade-in pb-12">
      <h1 className="mb-2">Your Portfolio</h1>
      <p className="text-muted mb-8 text-lg">Track and manage your investments.</p>

      {summary && summary.totalItems > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Stats - 3 columns */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass-panel p-6">
                <p className="text-muted mb-2 font-medium">Total Current Value</p>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                  ₹{summary.totalCurrentValue.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>
              
              <div className="glass-panel p-6">
                <p className="text-muted mb-2 font-medium">Total Invested (Cost Basis)</p>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, opacity: 0.9, marginTop: '0.5rem' }}>
                  ₹{summary.totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
              </div>
              
              <div className="glass-panel p-6" style={{ 
                borderLeft: `4px solid ${pnlIsPositive ? 'var(--success)' : 'var(--danger)'}`,
                background: pnlIsPositive ? 'linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(30, 41, 59, 0.7))' 
                                          : 'linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(30, 41, 59, 0.7))'
              }}>
                <p className="text-muted mb-2 font-medium">Total Return (All Time)</p>
                <div style={{ color: pnlIsPositive ? 'var(--success)' : 'var(--danger)', fontSize: '1.75rem', fontWeight: 800 }}>
                  {pnlIsPositive ? '+' : ''}₹{Math.abs(summary.totalPnL).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
                <div style={{ color: pnlIsPositive ? 'var(--success)' : 'var(--danger)', fontSize: '1rem', fontWeight: 600, opacity: 0.9 }}>
                  {pnlIsPositive ? '+' : ''}{summary.pnlPercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Allocation Chart - 1 column */}
            <div className="glass-panel p-4 flex flex-col items-center justify-center lg:col-span-1 border-dashed">
              <h4 className="w-full text-center text-sm text-muted mb-2">Asset Allocation</h4>
              <div style={{ width: '100%', height: '150px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value) => `₹${value.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} 
                      contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <h3 className="mb-4 flex items-center gap-2">
            <Activity className="text-primary" /> Holdings
          </h3>
          <PortfolioTable items={summary.items} onRemove={handleRemove} />
        </>
      ) : (
        <div className="glass-panel p-12 text-center" style={{ borderStyle: 'dashed' }}>
          <PieChartIcon size={64} className="text-primary mx-auto mb-6 opacity-50" />
          <h2 className="mb-4">Your portfolio is a blank canvas</h2>
          <p className="text-muted max-w-lg mx-auto mb-8 text-lg">
            Start building your wealth by searching for companies you love and adding them to your portfolio to track their performance.
          </p>
          <div className="flex justify-center">
            {/* The Link looks like a button */}
            <a href="/dashboard" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Explore Stocks
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
