import { useState, useEffect } from "react";
import { analyticsApi } from "../api/analyticsApi";
import { Download, TrendingUp, AlertCircle, Clock, ShieldAlert } from "lucide-react";

export default function AnalyticsReports() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const res = await analyticsApi.getDashboardData();
      setData(res);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="h-full flex items-center justify-center text-navy/50 animate-pulse font-medium">Generating reports...</div>;

  const maxUtil = Math.max(...data.utilization.map(d => d.high + d.idle));
  const maxMaint = Math.max(...data.maintenanceFreq.map(d => d.count));

  return (
    <div className="h-full overflow-y-auto pb-12 pr-2 flex flex-col">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Analytics & Reports</h1>
          <p className="text-charcoal/70 mt-1">Executive metrics for asset utilization and operational health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 shrink-0">
        {/* Component A: Utilization */}
        <div className="bg-cream rounded-xl p-6 border border-navy/10 shadow-sm">
          <h2 className="text-lg font-bold text-navy mb-6 flex items-center gap-2"><TrendingUp size={20} /> Utilization by Department</h2>
          <div className="flex h-48 items-end gap-6 justify-center">
            {data.utilization.map((dept, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 max-w-[80px]">
                <div className="w-full bg-beige/50 rounded-t-md h-full flex flex-col justify-end overflow-hidden group">
                  <div 
                    className="w-full bg-sage/40 hover:bg-sage/60 transition-colors relative" 
                    style={{ height: `${(dept.idle / maxUtil) * 100}%` }}
                    title={`Idle: ${dept.idle}`}
                  />
                  <div 
                    className="w-full bg-navy/80 hover:bg-navy transition-colors relative" 
                    style={{ height: `${(dept.high / maxUtil) * 100}%` }}
                    title={`High Use: ${dept.high}`}
                  />
                </div>
                <div className="text-xs font-bold text-charcoal/70 text-center truncate w-full">{dept.department}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-navy/80 rounded-sm"></div> High Use</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-sage/40 rounded-sm"></div> Idle</div>
          </div>
        </div>

        {/* Component B: Maintenance Frequency */}
        <div className="bg-cream rounded-xl p-6 border border-navy/10 shadow-sm">
          <h2 className="text-lg font-bold text-navy mb-6 flex items-center gap-2"><AlertCircle size={20} /> Maintenance Frequency</h2>
          <div className="flex h-48 items-end gap-3 justify-between px-4">
            {data.maintenanceFreq.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-beige/30 rounded-t-md h-full flex flex-col justify-end group">
                  <div 
                    className="w-full bg-amber/80 rounded-t-md group-hover:bg-amber transition-colors flex items-start justify-center pt-2"
                    style={{ height: `${(item.count / maxMaint) * 100}%` }}
                  >
                    <span className="text-[10px] font-bold text-amber-900 opacity-0 group-hover:opacity-100 transition">{item.count}</span>
                  </div>
                </div>
                <div className="text-xs font-bold text-charcoal/70 text-center">{item.month}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 shrink-0">
        <div className="bg-white rounded-xl p-6 border border-navy/10 shadow-sm">
          <h3 className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-4">Most Used Assets</h3>
          <ul className="space-y-4">
            {data.mostUsed.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-bold text-charcoal">
                <div className="w-2 h-2 rounded-full bg-sage"></div> 
                {a.name} 
                <span className="text-[10px] text-charcoal/40 font-mono ml-auto bg-beige px-1.5 py-0.5 rounded">{a.tag}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-navy/10 shadow-sm">
          <h3 className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-4 flex items-center gap-1.5"><Clock size={16}/> Idle Assets</h3>
          <ul className="space-y-4">
            {data.idle.map((a, i) => (
              <li key={i} className="flex items-center gap-2 text-sm font-bold text-charcoal flex-wrap">
                <span className="truncate">{a.name}</span>
                <span className="text-[10px] text-rust bg-rust/10 px-2 py-0.5 rounded font-bold ml-auto uppercase tracking-wider">{a.days} days</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-6 border border-navy/10 shadow-sm">
          <h3 className="text-xs font-bold text-charcoal/50 uppercase tracking-widest mb-4 flex items-center gap-1.5"><ShieldAlert size={16}/> Needs Attention</h3>
          <ul className="space-y-4">
            {data.nearingRetirement.map((a, i) => (
              <li key={i} className="text-sm font-bold text-charcoal border-b border-navy/5 pb-2 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1.5">
                  <span>{a.name}</span>
                  <span className="text-[10px] bg-beige text-charcoal/40 font-mono px-1.5 py-0.5 rounded">{a.tag}</span>
                </div>
                <div className="text-[10px] text-amber-600 bg-amber/10 px-2 py-0.5 rounded uppercase tracking-wider inline-block">{a.reason}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-6 shrink-0 flex justify-end">
        <button className="flex items-center gap-2 bg-navy text-cream px-8 py-3.5 rounded-lg font-bold hover:bg-navy/90 transition shadow-md">
          Export Report <Download size={18} />
        </button>
      </div>
    </div>
  );
}
