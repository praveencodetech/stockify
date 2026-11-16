import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const PriceChart = ({ data, isPositive = true, height = 300, showVolumes = false }) => {
  const [timeRange, setTimeRange] = useState('1M'); // 1W, 1M, 3M
  
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel flex items-center justify-center text-muted" style={{ height: `${height}px` }}>
        No chart data available
      </div>
    );
  }

  // Filter data based on selected time range
  let filteredData = [...data];
  if (timeRange === '1W') filteredData = data.slice(-5);
  else if (timeRange === '1M') filteredData = data.slice(-21);
  else if (timeRange === '3M') filteredData = data.slice(-63);

  // Determine colors based on trend
  const colorPrimary = isPositive ? '#10b981' : '#ef4444'; // success or danger
  const colorFill = isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  // Calculate min and max for Y axis to make chart look better
  const prices = filteredData.map(d => d.closePrice);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  // Format date for tooltip
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel" style={{ padding: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{formatDate(label)}</p>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1.125rem', color: colorPrimary }}>
            ${payload[0].value.toFixed(2)}
          </p>
          {showVolumes && payload[1] && (
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Vol: {(payload[1].value / 1000000).toFixed(2)}M
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Time Range Selector */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
        {['1W', '1M', '3M', 'ALL'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              background: timeRange === range ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              color: timeRange === range ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {range}
          </button>
        ))}
      </div>

      <div style={{ height: `${height}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colorPrimary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(val) => {
                const d = new Date(val);
                return `${d.getMonth()+1}/${d.getDate()}`;
              }}
              stroke="rgba(255,255,255,0.2)" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              minTickGap={30}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tickFormatter={(val) => `$${val.toFixed(0)}`}
              stroke="rgba(255,255,255,0.2)" 
              tick={{fill: '#94a3b8', fontSize: 12}}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="closePrice" 
              stroke={colorPrimary} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              animationDuration={1500}
            />
            {showVolumes && (
              <Bar dataKey="volume" yAxisId="right" fill="rgba(255,255,255,0.1)" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
