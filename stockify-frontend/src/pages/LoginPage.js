import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, UserPlus, Lock, Mail, User } from 'lucide-react';

const LoginPage = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let success = false;
    if (isRegister) {
      success = await register(formData.fullName, formData.email, formData.password);
    } else {
      success = await login(formData.email, formData.password);
    }

    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="glass-panel animate-slide-up" style={{
      width: '100%',
      maxWidth: '420px',
      padding: '2.5rem',
      position: 'relative',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '56px', height: '56px',
          borderRadius: '16px',
          background: 'var(--primary-glow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem'
        }}>
          <TrendingUp size={28} className="text-primary" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
          {isRegister ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {isRegister ? 'Start your investment journey with Stockify.' : 'Sign in to access your portfolio.'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="input-group">
            <label className="input-label" htmlFor="fullName">Full Name</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <User size={18} />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="input-control"
                style={{ width: '100%', paddingLeft: '2.75rem' }}
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required={isRegister}
              />
            </div>
          </div>
        )}

        <div className="input-group">
          <label className="input-label" htmlFor="email">Email Address</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <Mail size={18} />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              className="input-control"
              style={{ width: '100%', paddingLeft: '2.75rem' }}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-group" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className="input-label" htmlFor="password">Password</label>
            {!isRegister && (
              <Link to="#" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Forgot password?</Link>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>
              <Lock size={18} />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              className="input-control"
              style={{ width: '100%', paddingLeft: '2.75rem' }}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (
            <>
              {isRegister ? <UserPlus size={18} /> : <TrendingUp size={18} />}
              {isRegister ? 'Create Account' : 'Sign In'}
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        {isRegister ? (
          <p>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Log in</Link>
          </p>
        ) : (
          <p>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
