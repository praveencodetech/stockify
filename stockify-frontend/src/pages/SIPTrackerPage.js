import React from 'react';
import { CalendarDays } from 'lucide-react';
import SIPTracker from '../components/SIPTracker';

const SIPTrackerPage = () => {
  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="mb-8 mt-4">
        <h1 className="gradient-text" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarDays size={32} /> SIP Tracker
        </h1>
        <p className="text-muted mt-2">Track your monthly SIP investments, monitor progress, and stay on schedule.</p>
      </div>

      <SIPTracker />
    </div>
  );
};

export default SIPTrackerPage;
