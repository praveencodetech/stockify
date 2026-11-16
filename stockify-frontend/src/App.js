import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './components/AuthLayout';
import AppLayout from './components/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SearchResultsPage from './pages/SearchResultsPage';
import StockDetailPage from './pages/StockDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import NewsPage from './pages/NewsPage';
import MutualFundsPage from './pages/MutualFundsPage';
import SIPPlannerPage from './pages/SIPPlannerPage';
import SIPTrackerPage from './pages/SIPTrackerPage';
import ComparisonPage from './pages/ComparisonPage';
import WhatIfSimulatorPage from './pages/WhatIfSimulatorPage';
import PortfolioAllocationPage from './pages/PortfolioAllocationPage';
import RiskReturnPage from './pages/RiskReturnPage';
import TaxSavingPage from './pages/TaxSavingPage';
import LearningPage from './pages/LearningPage';
import StocksPage from './pages/StocksPage';

const AppContent = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--primary)', fontWeight: 600 }}>
        Loading...
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // NOT AUTHENTICATED → AuthLayout (no sidebar, no navbar)
  // ────────────────────────────────────────────────
  if (!user) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage isRegister={false} />} />
          <Route path="/register" element={<LoginPage isRegister={true} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    );
  }

  // ────────────────────────────────────────────────
  // AUTHENTICATED → AppLayout (sidebar + topbar + main content)
  // ────────────────────────────────────────────────
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/register" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><StocksPage /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><SearchResultsPage /></ProtectedRoute>} />
        <Route path="/stock/:symbol" element={<ProtectedRoute><StockDetailPage /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
        <Route path="/mutual-funds" element={<ProtectedRoute><MutualFundsPage /></ProtectedRoute>} />
        <Route path="/sip-planner" element={<ProtectedRoute><SIPPlannerPage /></ProtectedRoute>} />
        <Route path="/sip-tracker" element={<ProtectedRoute><SIPTrackerPage /></ProtectedRoute>} />
        <Route path="/compare-funds" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
        <Route path="/what-if-simulator" element={<ProtectedRoute><WhatIfSimulatorPage /></ProtectedRoute>} />
        <Route path="/portfolio-allocation" element={<ProtectedRoute><PortfolioAllocationPage /></ProtectedRoute>} />
        <Route path="/risk-return" element={<ProtectedRoute><RiskReturnPage /></ProtectedRoute>} />
        <Route path="/tax-saving" element={<ProtectedRoute><TaxSavingPage /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><LearningPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer
          position="bottom-right"
          theme="light"
          toastStyle={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            color: 'var(--text-main)',
            boxShadow: 'var(--shadow-card)'
          }}
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
