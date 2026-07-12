import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <aside style={{ width: "250px", backgroundColor: "#1E3A5F", color: "#FFFDF7", padding: "1rem" }}>
        <h2 style={{ color: "#FFFDF7" }}>AssetFlow Admin</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2rem" }}>
          <Link to="/" style={{ color: "#FFFDF7", textDecoration: "none" }}>Dashboard</Link>
          <Link to="/org-setup" style={{ color: "#FFFDF7", textDecoration: "none" }}>Organization Setup</Link>
          <Link to="/assets" style={{ color: "#FFFDF7", textDecoration: "none" }}>Assets</Link>
          <Link to="/allocation-transfer" style={{ color: "#FFFDF7", textDecoration: "none" }}>Allocation & Transfer</Link>
          <Link to="/resource-booking" style={{ color: "#FFFDF7", textDecoration: "none" }}>Resource Booking</Link>
          <Link to="/maintenance" style={{ color: "#FFFDF7", textDecoration: "none" }}>Maintenance</Link>
          <Link to="/audits" style={{ color: "#FFFDF7", textDecoration: "none" }}>Audit</Link>
          <Link to="/reports" style={{ color: "#FFFDF7", textDecoration: "none" }}>Reports</Link>
          <Link to="/logs" style={{ color: "#FFFDF7", textDecoration: "none" }}>Notifications & Logs</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, backgroundColor: "#F2ECE1", padding: "2rem", color: "#2B2B2B" }}>
        <Outlet />
      </main>
    </div>
  );
}
