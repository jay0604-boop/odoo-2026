import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import Dashboard from "./pages/Dashboard";
import OrgSetup from "./pages/OrgSetup";
import AssetRegistry from "./pages/AssetRegistry";
import TransferApprovals from "./pages/TransferApprovals";
import MaintenanceKanban from "./pages/MaintenanceKanban";
import AuditCycles from "./pages/AuditCycles";
import AnalyticsReports from "./pages/AnalyticsReports";
import GlobalLogs from "./pages/GlobalLogs";

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="org-setup" element={<OrgSetup />} />
          <Route path="assets" element={<AssetRegistry />} />
          <Route path="allocation-transfer" element={<TransferApprovals />} />
          <Route path="resource-booking" element={<div><h1 className="text-2xl font-semibold">Resource Booking</h1><p className="mt-2 text-charcoal/70">Placeholder for Screen 6</p></div>} />
          <Route path="maintenance" element={<MaintenanceKanban />} />
          <Route path="audits" element={<AuditCycles />} />
          <Route path="reports" element={<AnalyticsReports />} />
          <Route path="logs" element={<GlobalLogs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
