import { useState, useEffect } from "react";
import { transfersApi } from "../api/transfersApi";
import { AlertTriangle, Check, X, ArrowRight } from "lucide-react";

export default function TransferApprovals() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await transfersApi.getRequests();
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (id, action) => {
    // Optimistic UI update
    setRequests(prev => prev.filter(r => r.id !== id));
    if (action === 'approve') {
      await transfersApi.approveTransfer(id);
    } else {
      await transfersApi.rejectTransfer(id);
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-12 pr-2">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Transfer Approvals</h1>
          <p className="text-charcoal/70 mt-1">Review and authorize asset re-allocation requests.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-navy/50 animate-pulse font-medium">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-cream p-12 text-center rounded-lg border border-navy/10 shadow-sm text-charcoal/60 font-medium">
          No pending transfer requests.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map(req => (
            <div key={req.id} className="bg-cream rounded-lg p-5 border border-navy/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded border border-navy/10">
                    {req.assetTag}
                  </span>
                  <h3 className="text-lg font-bold text-charcoal">{req.assetName}</h3>
                  <span className="text-xs text-charcoal/50 font-medium">{req.dateRequested}</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm font-bold mb-3">
                  <div className="bg-beige/60 px-3 py-2 rounded-md text-charcoal/80 border border-navy/5 flex items-center">
                    <span className="text-charcoal/40 mr-2 text-[10px] uppercase tracking-wider">From</span> {req.from}
                  </div>
                  <ArrowRight size={16} className="text-navy/40" />
                  <div className="bg-beige/60 px-3 py-2 rounded-md text-charcoal/80 border border-navy/5 flex items-center">
                    <span className="text-charcoal/40 mr-2 text-[10px] uppercase tracking-wider">To</span> {req.to}
                  </div>
                </div>
                
                <p className="text-sm text-charcoal/70 mb-3 bg-white p-3 rounded border border-navy/5"><span className="font-bold text-charcoal/90 text-xs uppercase tracking-wider mr-2">Reason:</span> {req.reason}</p>

                {req.hasConflict && (
                  <div className="bg-rust/5 border border-rust/20 text-rust p-3 rounded-md flex items-start gap-2 text-sm font-medium mt-4">
                    <AlertTriangle size={18} className="text-rust shrink-0 mt-0.5" />
                    Direct re-allocation is blocked - requires Asset Manager approval override.
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 md:flex-col shrink-0">
                <button 
                  onClick={() => handleAction(req.id, 'approve')}
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-sage text-white px-6 py-3 rounded-lg font-bold hover:bg-sage/90 shadow-sm transition"
                >
                  <Check size={18} /> Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'reject')}
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-charcoal text-cream px-6 py-3 rounded-lg font-bold hover:bg-charcoal/90 shadow-sm transition"
                >
                  <X size={18} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
