import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
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

// Route protection wrapper
function AuthGuard({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function Layout() {
  return (
    <div className="flex min-h-screen bg-beige text-charcoal font-sans">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes wrapped in AuthGuard and Layout */}
          <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
