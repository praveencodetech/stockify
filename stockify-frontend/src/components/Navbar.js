import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, TrendingUp, LogOut, User, Menu, X, LayoutDashboard, Briefcase, Activity, Target, Layers, BookOpen, AlertTriangle, ShieldCheck, Wallet, ChevronLeft, ChevronRight, Calculator, PieChart, LineChart, Target as TargetIcon, Bell, BarChart2 } from 'lucide-react';

const Navbar = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const navGroups = [
    {
      title: 'Overview',
      links: [
        { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { to: '/stocks', label: 'Stocks', icon: <BarChart2 size={18} /> },
        { to: '/portfolio', label: 'Portfolio', icon: <Briefcase size={18} /> },
        { to: '/news', label: 'Market News', icon: <Activity size={18} /> },
      ]
    },
    {
      title: 'Mutual Funds',
      links: [
        { to: '/mutual-funds', label: 'Explore', icon: <PieChart size={18} /> },
        { to: '/compare-funds', label: 'Comparator', icon: <LineChart size={18} /> },
        { to: '/tax-saving', label: 'Tax Saving', icon: <ShieldCheck size={18} /> },
      ]
    },
    {
      title: 'Planning',
      links: [
        { to: '/sip-planner', label: 'SIP Planner', icon: <Calculator size={18} /> },
        { to: '/sip-tracker', label: 'Tracker', icon: <Wallet size={18} /> },
        { to: '/what-if-simulator', label: 'What-If', icon: <TargetIcon size={18} /> },
      ]
    },
    {
      title: 'Support',
      links: [
        { to: '/learning', label: 'Learn', icon: <BookOpen size={18} /> },
      ]
    }
  ];

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border)', background: '#ffffff', height: 'var(--topbar-height)', display: 'flex', alignItems: 'center' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={28} className="text-primary" />
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.025em' }} className="text-primary">Stockify</span>
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          </div>
        </nav>
        <main className="main-content" style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>
    );
  }

  // Use hard pixel values — NOT CSS variable refs (avoids circular self-reference when injecting into :root)
  const sidebarWidth = isSidebarCollapsed ? '72px' : '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      
      {/* Desktop Persistent Sidebar (Flex Item) */}
      <aside className="desktop-sidebar" style={{
        width: sidebarWidth, 
        transition: 'width 0.3s ease',
        background: '#ffffff', 
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 60
      }}>
        {/* Sidebar Header */}
        <div style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', padding: isSidebarCollapsed ? '0' : '0 1.5rem', borderBottom: '1px solid var(--border)' }}>
          {!isSidebarCollapsed && (
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <TrendingUp size={24} className="text-primary" />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Stockify</span>
            </Link>
          )}
          {isSidebarCollapsed && <TrendingUp size={24} className="text-primary" />}
        </div>

        {/* Sidebar Nav Links */}
        <div style={{ padding: '1.5rem 0', flex: 1, overflowY: 'auto' }}>
          {navGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              {!isSidebarCollapsed && (
                <div style={{ padding: '0 1.5rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  {group.title}
                </div>
              )}
              {group.links.map(link => (
                <Link key={link.to} to={link.to} title={isSidebarCollapsed ? link.label : ''} style={{
                  display: 'flex', alignItems: 'center', gap: isSidebarCollapsed ? '0' : '0.875rem',
                  justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                  padding: '0.75rem 1.5rem',
                  color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-dark)',
                  background: location.pathname === link.to ? 'var(--primary-glow)' : 'transparent',
                  borderRight: location.pathname === link.to ? '3px solid var(--primary)' : 'none',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: location.pathname === link.to ? 600 : 500,
                  transition: 'all 0.2s ease',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {link.icon}
                  </span>
                  {!isSidebarCollapsed && <span>{link.label}</span>}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} style={{ width: '100%', background: 'var(--bg-darker)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Top Header (Sticky inside Flex Column) */}
        <nav style={{ 
          position: 'sticky', top: 0, zIndex: 50, 
          height: 'var(--topbar-height)', background: '#ffffff', 
          borderBottom: '1px solid var(--border)',
          padding: '0 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Welcome Back, {user.fullName?.split(' ')[0] || 'Investor'} 👋
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <form onSubmit={handleSearch} style={{ position: 'relative' }}>
               <input type="text" placeholder="Search funds..." 
                 style={{ padding: '0.5rem 2.5rem 0.5rem 1rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border)', background: 'var(--bg-darker)', width: '240px', fontSize: '0.85rem' }}
                 value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
               <Search size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </form>
            
            <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, background: 'var(--danger)', borderRadius: '50%', border: '2px solid #fff' }}></span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.85rem' }}>
                {(user.fullName || 'U')[0].toUpperCase()}
              </div>
            </div>
            
            <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
              <LogOut size={18} />
            </button>

            <button className="md-hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-main)' }}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Dashboard Content injected here */}
        <main className="main-content" style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>

      {/* Hide Sidebar tightly on mobile using pure CSS */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .md-hidden { display: block !important; }
        }
      `}</style>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', top: 'var(--topbar-height)', left: 0, right: 0, bottom: 0, zIndex: 1000, background: '#ffffff', overflowY: 'auto', padding: '1.5rem' }}>
            {navGroups.map((group, idx) => (
              <div key={idx} style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                  {group.title}
                </div>
                {group.links.map(link => (
                  <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0', color: location.pathname === link.to ? 'var(--primary)' : 'var(--text-main)', borderBottom: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 500 }}>
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
