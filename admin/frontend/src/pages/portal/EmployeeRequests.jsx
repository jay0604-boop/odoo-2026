import { useState } from "react";
import { PenTool, CheckCircle, Clock, AlertCircle, ArrowRightLeft } from "lucide-react";

const MOCK_REQUESTS = [
  {
    id: "REQ-001",
    type: "Maintenance",
    asset: "MacBook Pro M3",
    tag: "AF-0012",
    issue: "Battery draining very quickly",
    status: "In Progress",
    date: "2026-07-10",
  },
  {
    id: "REQ-002",
    type: "Transfer",
    asset: "Dell Monitor 27\"",
    tag: "AF-0056",
    issue: "Requesting transfer to David Lee",
    status: "Pending",
    date: "2026-07-11",
  }
];

export default function EmployeeRequests() {
  const [requests] = useState(MOCK_REQUESTS);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-sage/20 text-sage-dark";
      case "In Progress":
        return "bg-navy/10 text-navy";
      case "Pending":
      default:
        return "bg-rust/10 text-rust";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle size={14} />;
      case "In Progress":
        return <Clock size={14} />;
      case "Pending":
      default:
        return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight">My Requests</h1>
          <p className="text-navy-light mt-1 text-sm">Track the status of your maintenance tickets and transfer requests.</p>
        </div>
      </header>
      
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden">
        <div className="divide-y divide-cream/50">
          {requests.map((req) => (
            <div key={req.id} className="p-6 hover:bg-white/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-xl mt-1 ${req.type === 'Maintenance' ? 'bg-rust/10 text-rust' : 'bg-navy/10 text-navy'}`}>
                  {req.type === 'Maintenance' ? <PenTool size={20} /> : <ArrowRightLeft size={20} />}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-navy/50">{req.id}</span>
                    <span className="text-navy-light px-1.5 py-0.5 bg-cream rounded text-[10px] uppercase font-bold">{req.type}</span>
                  </div>
                  <h3 className="text-lg font-bold text-charcoal">{req.asset} <span className="text-sm font-normal text-navy-light ml-1">({req.tag})</span></h3>
                  <p className="text-sm text-navy-light mt-1">{req.issue}</p>
                  <p className="text-xs text-navy/40 mt-2">Submitted on {req.date}</p>
                </div>
              </div>

              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyle(req.status)}`}>
                  {getStatusIcon(req.status)}
                  {req.status}
                </div>
                <button className="text-sm font-medium text-navy hover:text-rust transition-colors mt-2 underline-offset-4 hover:underline">
                  View Details
                </button>
              </div>

            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="p-8 text-center text-navy-light">
              You have no active requests.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
