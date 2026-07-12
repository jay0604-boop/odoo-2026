import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Calendar, 
  ArrowLeftRight, 
  Wrench, 
  Bell, 
  LogOut,
  Shield
} from 'lucide-react';

/**
 * Sidebar component for standard Employee Portal navigation.
 * Uses lucide-react icons and NavLink active state classes.
 */
export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Asset Directory', path: '/assets', icon: Package },
    { name: 'Booking Calendar', path: '/bookings', icon: Calendar },
    { name: 'Transfer Asset', path: '/transfer', icon: ArrowLeftRight },
    { name: 'Maintenance Ticket', path: '/maintenance', icon: Wrench },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">Odoo AMS</h1>
            <span className="text-xs text-slate-400 font-medium">User Portal</span>
          </div>
        </div>

        {/* User Brief Profile */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-semibold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : 'E'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{user.role || 'employee'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Action Area */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
