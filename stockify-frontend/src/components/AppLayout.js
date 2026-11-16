import React from 'react';
import Navbar from './Navbar';
import ChatBot from './ChatBot';
import { useAuth } from '../context/AuthContext';

/**
 * AppLayout - Used ONLY for authenticated dashboard pages.
 * Navbar acts as the root Flexbox container, holding the Sidebar 
 * and wrapping children in the Main Content column.
 */
const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <>
      {/* Navbar builds the Flexbox layout (Sidebar + Topbar + Content area) */}
      <Navbar>
        {children}
      </Navbar>

      {/* Floating AI chatbot assistant */}
      {user && <ChatBot />}
    </>
  );
};

export default AppLayout;
