import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Box, ArrowRightLeft, CalendarClock, PenTool, ClipboardCheck, BarChart2, Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Organization Setup", path: "/org-setup", icon: <Users size={18} /> },
    { name: "Assets", path: "/assets", icon: <Box size={18} /> },
    { name: "Allocation & Transfer", path: "/allocation-transfer", icon: <ArrowRightLeft size={18} /> },
    { name: "Resource Booking", path: "/resource-booking", icon: <CalendarClock size={18} /> },
    { name: "Maintenance", path: "/maintenance", icon: <PenTool size={18} /> },
    { name: "Audit", path: "/audits", icon: <ClipboardCheck size={18} /> },
    { name: "Reports", path: "/reports", icon: <BarChart2 size={18} /> },
    { name: "Notifications & Logs", path: "/logs", icon: <Bell size={18} /> },
  ];

  return (
    <aside className="w-64 bg-navy text-cream flex flex-col h-full min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">AssetFlow</h2>
        <p className="text-sm opacity-80 mt-1">Admin Console</p>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive ? "bg-cream/10 text-white font-medium" : "text-cream/70 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-cream/10 text-sm flex flex-col gap-3">
        <span className="text-cream/50">Logged in as Admin</span>
        <Link 
          to="/portal" 
          className="flex items-center justify-center gap-2 bg-cream/10 hover:bg-cream/20 text-cream py-2 px-3 rounded transition-colors"
        >
          View Employee Portal
        </Link>
        <button 
          onClick={signOut}
          className="flex items-center justify-center gap-2 text-rust hover:text-rust-dark hover:bg-rust/10 py-2 px-3 rounded transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
