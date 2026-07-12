import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeLayout from "./components/EmployeeLayout";

// Admin Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OrgSetup from "./pages/OrgSetup";
import AssetRegistry from "./pages/AssetRegistry";
import TransferApprovals from "./pages/TransferApprovals";
import MaintenanceKanban from "./pages/MaintenanceKanban";
import AuditCycles from "./pages/AuditCycles";
import AnalyticsReports from "./pages/AnalyticsReports";
import GlobalLogs from "./pages/GlobalLogs";
import ResourceBooking from "./pages/ResourceBooking";

// Portal Pages
import EmployeeDashboard from "./pages/portal/EmployeeDashboard";
import EmployeeAssets from "./pages/portal/EmployeeAssets";
import EmployeeBookings from "./pages/portal/EmployeeBookings";
import EmployeeRequests from "./pages/portal/EmployeeRequests";

// Route protection wrapper
function AuthGuard({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-beige text-charcoal font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

// Extracted routes wrapper to use useLocation
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<Dashboard />} />
          <Route path="org-setup" element={<OrgSetup />} />
          <Route path="assets" element={<AssetRegistry />} />
          <Route path="allocation-transfer" element={<TransferApprovals />} />
          <Route path="resource-booking" element={<ResourceBooking />} />
          <Route path="maintenance" element={<MaintenanceKanban />} />
          <Route path="audits" element={<AuditCycles />} />
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="logs" element={<GlobalLogs />} />
        </Route>

        {/* Protected Employee Portal Routes */}
        <Route path="/portal" element={<AuthGuard><EmployeeLayout /></AuthGuard>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path="assets" element={<EmployeeAssets />} />
          <Route path="bookings" element={<EmployeeBookings />} />
          <Route path="requests" element={<EmployeeRequests />} />
        </Route>
        
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
