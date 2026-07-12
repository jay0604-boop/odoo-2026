import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CheckCircle, 
  Laptop, 
  Monitor, 
  Armchair, 
  CalendarDays, 
  Clock, 
  ArrowRight,
  RefreshCw,
  Wrench
} from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const dashboardApi = {
  /**
   * Fetch recent alert notifications.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/dashboard/alerts
   */
  fetchAlerts: async () => {
    return [
      { id: 'a1', type: 'warning', message: 'Asset return for "Dell Monitor 24" is overdue by 2 days.' },
      { id: 'a2', type: 'success', message: 'Transfer request for "Apple MacBook Pro" was approved by IT Administration.' },
    ];
  },

  /**
   * Fetch assets assigned to the logged-in user.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/assets/assigned
   */
  fetchAssignedAssets: async () => {
    return [
      { id: 'as-1', name: 'Apple MacBook Pro 16"', serial: 'C02F84HCMD6M', category: 'Electronics', returnDate: '2026-12-31', iconName: 'laptop' },
      { id: 'as-2', name: 'Dell 27" 4K Monitor', serial: 'CN-0M482X-7444', category: 'Electronics', returnDate: '2026-08-15', iconName: 'monitor' },
      { id: 'as-3', name: 'Ergonomic Mesh Chair', serial: 'CH-ERG-88910', category: 'Furniture', returnDate: '2027-03-01', iconName: 'chair' },
    ];
  },

  /**
   * Fetch active resource bookings.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/bookings/active
   */
  fetchActiveBookings: async () => {
    return [
      { id: 'bk-1', resourceName: 'Conference Room Alpha', date: '2026-07-15', timeSlot: '14:00 - 15:30', type: 'Room' },
      { id: 'bk-2', resourceName: 'Tesla Model 3 (Fleet-03)', date: '2026-07-18', timeSlot: '09:00 - 18:00', type: 'Vehicle' },
    ];
  }
};

/* ==========================================================================
   DASHBOARD SCREEN COMPONENT
   ========================================================================== */

export default function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [alertsData, assetsData, bookingsData] = await Promise.all([
          dashboardApi.fetchAlerts(),
          dashboardApi.fetchAssignedAssets(),
          dashboardApi.fetchActiveBookings()
        ]);
        setAlerts(alertsData);
        setAssets(assetsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Icon mapping helper
  const getAssetIcon = (iconName) => {
    switch (iconName) {
      case 'laptop': return <Laptop className="h-6 w-6 text-brand-400" />;
      case 'monitor': return <Monitor className="h-6 w-6 text-emerald-400" />;
      default: return <Armchair className="h-6 w-6 text-amber-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-slate-400 text-sm">Synchronizing your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Alerts Banner Section */}
      {alerts.length > 0 && (
        <section className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border flex items-start gap-3.5 text-sm transition-all ${
                alert.type === 'warning'
                  ? 'bg-rose-500/5 border-rose-500/10 text-rose-300'
                  : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-300'
              }`}
            >
              {alert.type === 'warning' ? (
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-medium">{alert.message}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Grid Layout for Assets & Bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Personal Assigned Assets Card Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Your Assigned Assets</h3>
              <p className="text-xs text-slate-400">Inventory currently registered under your name.</p>
            </div>
            <button 
              onClick={() => navigate('/assets')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 group"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                      {getAssetIcon(asset.iconName)}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100 mb-1">{asset.name}</h4>
                  <div className="space-y-1 text-xs text-slate-400 font-medium">
                    <p>Serial: <span className="font-mono text-slate-300">{asset.serial}</span></p>
                    <p>Expected Return: <span className="text-slate-300">{asset.returnDate}</span></p>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6 border-t border-slate-800/80 pt-4">
                  <button 
                    onClick={() => navigate(`/transfer?asset=${asset.id}`)}
                    className="flex-1 py-1.5 px-3 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Transfer</span>
                  </button>
                  <button 
                    onClick={() => navigate(`/maintenance?asset=${asset.id}`)}
                    className="flex-1 py-1.5 px-3 bg-slate-950 border border-slate-800 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Bookings Sidebar Card */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Active Bookings</h3>
              <p className="text-xs text-slate-400">Upcoming vehicle or room reservations.</p>
            </div>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 group"
            >
              <span>Book Resource</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            {bookings.length > 0 ? (
              <div className="divide-y divide-slate-800/80">
                {bookings.map((booking, index) => (
                  <div key={booking.id} className={`pb-4 ${index > 0 ? 'pt-4' : ''} flex gap-4`}>
                    <div className="h-10 w-10 shrink-0 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg flex items-center justify-center">
                      <CalendarDays className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{booking.resourceName}</h4>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">{booking.type} Booking</p>
                      
                      <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-medium">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CalendarDays className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No upcoming bookings scheduled.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
