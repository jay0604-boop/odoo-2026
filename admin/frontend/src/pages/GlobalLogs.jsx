import { useState, useEffect } from "react";
import { logsApi } from "../api/logsApi";
import { Info, AlertTriangle, ShieldAlert, CheckCircle2, Calendar } from "lucide-react";

export default function GlobalLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Alerts", "Approvals", "Bookings"];

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      const data = await logsApi.getLogs(activeTab);
      setLogs(data);
      setIsLoading(false);
    };
    fetchLogs();
  }, [activeTab]);

  const getLogIcon = (type, severity) => {
    if (severity === 'warning') return <AlertTriangle size={18} className="text-rust" />;
    if (severity === 'error') return <ShieldAlert size={18} className="text-charcoal" />;
    if (type === 'Approvals') return <CheckCircle2 size={18} className="text-sage" />;
    if (type === 'Bookings') return <Calendar size={18} className="text-navy" />;
    return <Info size={18} className="text-navy/60" />;
  };

  const getLogStyle = (severity) => {
    if (severity === 'warning') return "bg-rust/5 border-rust/20 hover:border-rust/40 border-l-4 border-l-rust";
    if (severity === 'error') return "bg-charcoal/5 border-charcoal/20 hover:border-charcoal/40 border-l-4 border-l-charcoal";
    return "bg-white border-navy/5 hover:border-navy/20 hover:bg-beige/30";
  };

  return (
    <div className="h-full overflow-hidden flex flex-col pb-6 pr-2">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4 pt-2 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Global Logs</h1>
          <p className="text-charcoal/70 mt-1">Immutable system audit trail and activity history.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 shrink-0 bg-cream p-1.5 rounded-lg border border-navy/10 self-start">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-md font-bold text-sm transition-all ${
              activeTab === tab 
                ? "bg-navy text-cream shadow-sm" 
                : "text-charcoal/60 hover:text-navy hover:bg-navy/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-cream rounded-xl border border-navy/10 shadow-sm overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-navy/50 animate-pulse font-medium">
            Fetching timeline logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-charcoal/40 font-medium italic">
            No logs found for this filter.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            {logs.map(log => (
              <div 
                key={log.id} 
                className={`p-4 rounded-lg border transition-colors flex items-center gap-5 shadow-sm ${getLogStyle(log.severity)}`}
              >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-navy/10 flex items-center justify-center shrink-0">
                  {getLogIcon(log.type, log.severity)}
                </div>
                <div className="flex-1">
                  <p className={`text-[15px] font-medium tracking-wide ${log.severity === 'warning' ? 'text-rust font-semibold' : log.severity === 'error' ? 'text-charcoal font-bold' : 'text-charcoal'}`}>
                    {log.message}
                  </p>
                </div>
                <div className="text-xs font-bold text-charcoal/50 bg-white px-3 py-1.5 rounded-md border border-navy/5 shrink-0 whitespace-nowrap shadow-sm">
                  {log.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
