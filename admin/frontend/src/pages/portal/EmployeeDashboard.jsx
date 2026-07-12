export default function EmployeeDashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-navy">Welcome back!</h1>
        <p className="text-navy-light mt-1">Here is a summary of your assigned assets and upcoming bookings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards Stub */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-navy">2</div>
          <div className="text-sm font-medium text-sage-dark uppercase tracking-wider mt-1">Active Assets</div>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-navy">1</div>
          <div className="text-sm font-medium text-sage-dark uppercase tracking-wider mt-1">Upcoming Booking</div>
        </div>
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-rust">0</div>
          <div className="text-sm font-medium text-rust uppercase tracking-wider mt-1">Pending Requests</div>
        </div>
      </div>
    </div>
  );
}
