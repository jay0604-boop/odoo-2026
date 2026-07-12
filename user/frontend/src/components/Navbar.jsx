import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, User, CalendarDays } from 'lucide-react';

/**
 * Top Navbar component.
 * Displays page title depending on pathname, user profile dropdown, and notifications indicator.
 */
export default function Navbar({ user, toggleMobileSidebar, notificationsCount = 3 }) {
  const location = useLocation();

  // Helper to resolve title from path
  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Overview';
      case '/assets': return 'Company Asset Directory';
      case '/bookings': return 'Resource Booking Calendar';
      case '/transfer': return 'Asset Transfer Request';
      case '/maintenance': return 'Submit Maintenance Ticket';
      case '/notifications': return 'System Notifications';
      default: return 'Asset Management System';
    }
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-bold text-white tracking-tight">
          {getPageTitle(location.pathname)}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border-r border-slate-800 pr-6">
          <CalendarDays className="h-4 w-4 text-brand-500" />
          <span>{todayStr}</span>
        </div>

        {/* Notifications Icon with count */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-all">
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
          )}
        </button>

        {/* Profile indicator */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-semibold border border-slate-700">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-semibold text-slate-200 leading-tight">
              {user?.name || 'Loading...'}
            </span>
            <span className="block text-[10px] text-slate-400 font-medium capitalize">
              {user?.department || 'Employee'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
