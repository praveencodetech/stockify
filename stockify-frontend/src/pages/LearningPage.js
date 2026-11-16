import React, { useState } from 'react';
import { BookOpen, GraduationCap, Lightbulb, TrendingUp, Shield, ChevronDown, ChevronUp, PieChart, CalendarDays, BarChart2 } from 'lucide-react';

const AccordionItem = ({ title, children, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '1.25rem 1rem',
        background: isOpen ? 'var(--bg-darker)' : 'transparent',
        border: 'none', color: 'var(--text-main)', cursor: 'pointer',
        textAlign: 'left', borderRadius: 'var(--radius-md)', transition: 'background 0.2s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600, fontSize: '1.05rem' }}>
          {icon} {title}
        </div>
        {isOpen ? <ChevronUp size={20} className="text-muted" /> : <ChevronDown size={20} className="text-muted" />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1rem 1.25rem 2.75rem', color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

const LearningPage = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)' }}>
          <GraduationCap size={28} className="text-primary" /> Learning Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Master the basics of mutual funds, SIPs, and investment strategies in simple terms.</p>
      </div>

      <div className="grid grid-cols-1 lg-grid-cols-3 gap-8">
        
        {/* Core Concepts */}
        <div className="lg-col-span-2">
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <BookOpen size={20} className="text-primary" /> Key Concepts Demystified
            </h3>

            <AccordionItem title="What is a Mutual Fund?" icon={<PieChart size={18} className="text-primary" />}>
              <p>Think of a mutual fund as a big basket. Many investors put their money into this basket. Then, a professional manager takes that pooled money and buys a mix of stocks, bonds, or other securities. If the investments make money, everyone shares in the profits.</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Benefit:</strong> You don't need to be an expert to pick individual stocks—the manager does it for you.</p>
            </AccordionItem>

            <AccordionItem title="What is an SIP (Systematic Investment Plan)?" icon={<CalendarDays size={18} className="text-accent" />}>
              <p>SIP is just a method of investing in mutual funds. Instead of putting all your money in at once (Lumpsum), you invest a fixed amount (say ₹1,000) every single month.</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Benefit:</strong> It builds a habit of saving and averages out the market ups and downs (Rupee Cost Averaging).</p>
            </AccordionItem>

            <AccordionItem title="Large Cap, Mid Cap, and Small Cap" icon={<BarChart2 size={18} className="text-success" />}>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: 0 }}>
                <li><strong>Large Cap:</strong> Funds investing in giant, stable companies (like Reliance or TCS). Lower risk, steady returns.</li>
                <li style={{ marginTop: '0.5rem' }}><strong>Mid Cap:</strong> Funds investing in medium-sized, growing companies. Moderate risk, higher potential returns.</li>
                <li style={{ marginTop: '0.5rem' }}><strong>Small Cap:</strong> Funds investing in new, smaller companies. High risk, highest potential returns in the long run.</li>
              </ul>
            </AccordionItem>

            <AccordionItem title="What is an ELSS?" icon={<Shield size={18} className="text-warning" />}>
              <p>ELSS stands for Equity Linked Savings Scheme. It's a special type of mutual fund where you not only grow your wealth via the stock market, but you also get a tax deduction under Section 80C of up to ₹1.5 Lakhs per year. It has a mandatory lock-in period of 3 years.</p>
            </AccordionItem>
          </div>
        </div>

        {/* Quick Tips */}
        <div>
          <div className="glass-panel" style={{ background: 'linear-gradient(145deg, #f0f4ff 0%, #e8eeff 100%)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>
              <Lightbulb size={20} className="text-warning" /> Golden Rules
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>1. Start Early</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>The power of compounding means time in the market is vastly more important than timing the market.</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem' }}>2. Be Consistent</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Don't stop your SIPs when the market falls. That's actually when you buy units at a cheaper price!</div>
              </div>

              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '0.25rem' }}>3. Diversify</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Never put 100% of your money into one fund or one high-risk category. Mix Large and Mid caps.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;
