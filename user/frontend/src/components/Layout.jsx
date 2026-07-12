import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Main Layout component wrapper.
 * Checks for authentication state. If authenticated, renders Sidebar, Navbar and subroutes (Outlet).
 * If not authenticated, redirects to /login.
 */
export default function Layout({ user, onLogout }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // If user state is missing, redirect to Login
  // TODO: Member 1 - Enhance auth guard with token validation / refresh checks.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="flex bg-slate-950 min-h-screen text-slate-100 font-sans">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar user={user} onLogout={onLogout} />
      </div>

      {/* Mobile Sidebar (Drawer overlay) */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          {/* Sidebar container */}
          <div className="relative z-10 w-64 flex-col bg-slate-900 h-full shadow-2xl animate-in slide-in-from-left duration-250">
            <Sidebar user={user} onLogout={onLogout} />
          </div>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar user={user} toggleMobileSidebar={toggleMobileSidebar} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
