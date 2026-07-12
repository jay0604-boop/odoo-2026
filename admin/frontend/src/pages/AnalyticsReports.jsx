import React from 'react';
import { BarChart3, Download, TrendingUp, AlertTriangle, CalendarDays, Activity, ChevronDown } from 'lucide-react';

// Static Mock Data for rich demonstration
const mockDeptAllocations = [
  { dept: 'Engineering', count: 142, color: 'bg-navy' },
  { dept: 'Facilities', count: 88, color: 'bg-sage' },
  { dept: 'IT Support', count: 35, color: 'bg-charcoal' },
  { dept: 'Human Resources', count: 12, color: 'bg-rust' },
];

const mockHeatmapData = [
  { day: 'Mon', hours: [2, 4, 8, 9, 10, 7, 3, 1] },
  { day: 'Tue', hours: [3, 5, 9, 10, 8, 6, 4, 2] },
  { day: 'Wed', hours: [1, 6, 10, 10, 9, 8, 5, 2] },
  { day: 'Thu', hours: [2, 7, 9, 8, 7, 5, 3, 1] },
  { day: 'Fri', hours: [1, 4, 6, 7, 5, 4, 2, 1] },
];

const mockMaintenanceAlerts = [
  { tag: 'AF-0012', item: 'Dell XPS 15', reason: 'High Breakdown Frequency (4x this year)', severity: 'high' },
  { tag: 'AF-0088', item: 'Ford Transit Van', reason: 'Due for 50k mile service in 14 days', severity: 'medium' },
  { tag: 'AF-0041', item: 'Epson Projector', reason: 'Nearing 5-year retirement limit', severity: 'medium' },
];

export default function AnalyticsReports() {
  const maxAlloc = Math.max(...mockDeptAllocations.map(d => d.count));

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            Analytics & Reports
          </h1>
          <p className="text-charcoal/60 mt-1">Visualize utilization trends, allocation metrics, and maintenance frequencies.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-navy/10 hover:bg-beige/50 text-navy px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <CalendarDays size={18} />
            Last 30 Days <ChevronDown size={16} />
          </button>
          <button className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-beige px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Download size={18} />
            Export PDF Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-6">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-navy/10 text-navy rounded-xl"><Activity size={24} /></div>
            <div>
              <p className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-1">Fleet Utilization</p>
              <h3 className="text-3xl font-bold text-charcoal flex items-baseline gap-2">
                84% <span className="text-sm font-semibold text-sage flex items-center"><TrendingUp size={14} className="mr-0.5"/> +2.4%</span>
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-sage/10 text-sage rounded-xl"><BarChart3 size={24} /></div>
            <div>
              <p className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-1">Most Booked Resource</p>
              <h3 className="text-xl font-bold text-charcoal mt-1">Conference Room B2</h3>
              <p className="text-sm font-medium text-navy/70 mt-1">Booked 42 times this month</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-rust/10 text-rust rounded-xl"><AlertTriangle size={24} /></div>
            <div>
              <p className="text-sm font-bold text-charcoal/50 uppercase tracking-wider mb-1">Idle Assets</p>
              <h3 className="text-3xl font-bold text-charcoal flex items-baseline gap-2">
                12 <span className="text-sm font-medium text-charcoal/50 font-normal ml-1">items inactive > 90 days</span>
              </h3>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Department Allocations (Custom Bar Chart) */}
          <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-navy mb-6">Department-wise Allocation</h3>
            <div className="flex-1 space-y-6">
              {mockDeptAllocations.map((dept, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm font-semibold mb-2 text-charcoal">
                    <span>{dept.dept}</span>
                    <span>{dept.count} Assets</span>
                  </div>
                  <div className="w-full bg-navy/5 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full ${dept.color}`} 
                      style={{ width: `${(dept.count / maxAlloc) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resource Booking Heatmap */}
          <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold text-navy mb-6">Resource Booking Heatmap (Peak Usage)</h3>
            <div className="flex-1 overflow-x-auto">
              <div className="min-w-[400px]">
                {/* Time labels */}
                <div className="flex mb-2 text-xs font-semibold text-charcoal/40 ml-12">
                  {['9A', '10A', '11A', '12P', '1P', '2P', '3P', '4P'].map((time, i) => (
                    <div key={i} className="flex-1 text-center">{time}</div>
                  ))}
                </div>
                {/* Grid */}
                <div className="space-y-2">
                  {mockHeatmapData.map((row, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2">
                      <div className="w-10 text-xs font-bold text-charcoal/60">{row.day}</div>
                      <div className="flex flex-1 gap-1">
                        {row.hours.map((val, cIdx) => {
                          // Determine color intensity based on value (1-10)
                          let bgClass = 'bg-navy/5';
                          if (val > 8) bgClass = 'bg-navy';
                          else if (val > 5) bgClass = 'bg-navy/60';
                          else if (val > 2) bgClass = 'bg-navy/30';
                          
                          return (
                            <div 
                              key={cIdx} 
                              className={`flex-1 h-8 rounded-sm ${bgClass} transition-colors hover:ring-2 hover:ring-sage cursor-crosshair`}
                              title={`${val} bookings`}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impending Actions / Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-navy/10 shadow-sm">
          <h3 className="text-lg font-bold text-navy mb-4">Impending Actions & Maintenance Alerts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMaintenanceAlerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${alert.severity === 'high' ? 'bg-rust/5 border-rust/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-charcoal">{alert.tag}</span>
                  {alert.severity === 'high' 
                    ? <span className="px-2 py-0.5 bg-rust text-white text-xs font-bold rounded-md">Urgent</span>
                    : <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-bold rounded-md">Notice</span>
                  }
                </div>
                <h4 className="font-semibold text-charcoal mb-1">{alert.item}</h4>
                <p className={`text-sm font-medium ${alert.severity === 'high' ? 'text-rust' : 'text-amber-700'}`}>
                  {alert.reason}
                </p>
                <button className={`mt-3 text-sm font-semibold underline ${alert.severity === 'high' ? 'text-rust hover:text-rust/80' : 'text-amber-700 hover:text-amber-900'}`}>
                  View Asset Details
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
