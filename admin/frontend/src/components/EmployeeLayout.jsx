import { Link, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Box, CalendarClock, PenTool, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function EmployeeLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Overview", path: "/portal", icon: <LayoutDashboard size={18} />, exact: true },
    { name: "My Assets", path: "/portal/assets", icon: <Box size={18} /> },
    { name: "Bookings", path: "/portal/bookings", icon: <CalendarClock size={18} /> },
    { name: "Requests", path: "/portal/requests", icon: <PenTool size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-beige font-sans flex flex-col text-charcoal">
      {/* Top Navigation Bar */}
      <header className="bg-navy text-cream shadow-md z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold tracking-tight">AssetFlow</span>
                <span className="ml-2 text-xs bg-cream/10 px-2 py-1 rounded text-cream/80">Employee Portal</span>
              </div>
              
              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const isActive = item.exact 
                    ? location.pathname === item.path
                    : location.pathname.startsWith(item.path);
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-4 py-2 mt-1 rounded-t-lg text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-beige text-navy border-t-2 border-rust" 
                          : "text-cream/70 hover:bg-cream/5 hover:text-cream border-t-2 border-transparent"
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side Profile / Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-cream/80 bg-navy-light px-3 py-1.5 rounded-full border border-cream/10">
                <User size={16} />
                <span>{user?.email || "employee@company.com"}</span>
              </div>
              <button 
                onClick={signOut}
                className="p-2 text-cream/70 hover:text-rust transition-colors rounded-full hover:bg-cream/5"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav (simplified) */}
      <div className="md:hidden bg-navy-light border-t border-cream/10 flex justify-around p-2">
         {navItems.map((item) => {
            const isActive = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-lg flex flex-col items-center text-xs ${
                  isActive ? "text-cream bg-white/10" : "text-cream/60"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.name}</span>
              </Link>
            );
          })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
