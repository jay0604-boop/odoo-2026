import { useState, useEffect } from "react";
import { auditsApi } from "../api/auditsApi";
import { FileWarning, CheckCircle, XCircle, AlertTriangle, Lock, Download } from "lucide-react";

export default function AuditCycles() {
  const [cycle, setCycle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const active = await auditsApi.getActiveCycle();
    setCycle(active);
    setIsLoading(false);
  };

  const handleToggleState = async (assetId, state) => {
    if (!cycle || cycle.status === "Closed") return;
    
    setCycle(prev => ({
      ...prev,
      assetsToAudit: prev.assetsToAudit.map(item => 
        item.assetId === assetId ? { ...item, verificationState: state } : item
      )
    }));
    
    await auditsApi.updateVerificationState(cycle.id, assetId, state);
  };

  const handleCloseCycle = async () => {
    if (confirm("Are you sure you want to lock this cycle? Discrepancy reports will be generated and asset statuses will be updated automatically.")) {
      setIsClosing(true);
      await auditsApi.closeCycle(cycle.id, cycle.assetsToAudit);
      await fetchData();
      setIsClosing(false);
    }
  };

  if (isLoading) return <div className="flex-1 flex justify-center items-center h-[50vh]"><div className="animate-spin text-navy/50"><Lock size={32} /></div></div>;

  if (!cycle) return (
    <div className="max-w-6xl mx-auto p-12 bg-cream rounded-lg border border-navy/10 text-center mt-8">
      <h2 className="text-xl font-medium text-navy mb-2">No Active Audits</h2>
      <p className="text-charcoal/70">Create a new audit cycle to begin structural verification.</p>
    </div>
  );

  const discrepanciesCount = cycle.assetsToAudit.filter(a => a.verificationState === "Missing" || a.verificationState === "Damaged").length;
  const isLocked = cycle.status === "Closed";

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Audit Cycles</h1>
          <p className="text-charcoal/70 mt-1">Structural verification and discrepancy tracking.</p>
        </div>
      </div>

      {/* Top Status Highlight Bar */}
      <div className={`mb-6 p-6 rounded-lg border flex items-center justify-between shadow-sm transition-colors ${isLocked ? 'bg-slate/10 border-slate/20 text-slate' : 'bg-navy border-navy text-cream'}`}>
        <div>
          <div className="text-xs font-bold opacity-70 mb-1 tracking-widest uppercase">{isLocked ? "Locked Cycle" : "Active Window"}</div>
          <h2 className="text-2xl font-bold">{cycle.name} &mdash; {cycle.dateRange}</h2>
          <div className="text-sm mt-1.5 opacity-90 flex items-center gap-2">
            <span>Auditors: {cycle.auditors}</span>
          </div>
        </div>
        {isLocked && <div className="px-4 py-2 bg-charcoal text-cream rounded-md font-bold flex items-center gap-2"><Lock size={18}/> AUDIT CLOSED</div>}
      </div>

      {/* Yellow Alert Banner for Discrepancies */}
      {discrepanciesCount > 0 && (
        <div className="mb-6 p-4 bg-amber/10 border border-amber/30 rounded-lg flex items-start gap-3 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
          <FileWarning className="text-amber mt-0.5" size={24} />
          <div>
            <h3 className="font-bold text-amber-900 text-lg">{discrepanciesCount} assets flagged</h3>
            <p className="text-amber-800/80 mt-0.5 font-medium">Discrepancy report {isLocked ? "was generated automatically." : "will be generated automatically upon closing this cycle."}</p>
          </div>
        </div>
      )}

      {/* Tracking Grid */}
      <div className="bg-cream rounded-lg shadow-sm border border-navy/10 overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-beige border-b border-navy/10 text-charcoal/70 text-sm">
              <th className="p-4 font-medium w-2/5">Asset</th>
              <th className="p-4 font-medium w-1/4">Expected Location</th>
              <th className="p-4 font-medium">Verification Actions</th>
            </tr>
          </thead>
          <tbody>
            {cycle.assetsToAudit.map((item) => (
              <tr key={item.assetId} className={`border-b border-navy/5 last:border-0 transition-colors ${isLocked ? "bg-beige/30" : "hover:bg-beige/30"}`}>
                <td className="p-4">
                  <div className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded inline-block mb-1.5 border border-navy/10">
                    {item.assetDetails?.tag}
                  </div>
                  <div className="font-semibold text-charcoal">{item.assetDetails?.name}</div>
                  <div className="text-sm text-charcoal/60 mt-0.5">{item.assetDetails?.category} &bull; Holder: {item.assetDetails?.holder}</div>
                </td>
                <td className="p-4 text-charcoal/80 font-medium text-sm">
                  {item.assetDetails?.location}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      disabled={isLocked}
                      onClick={() => handleToggleState(item.assetId, "Verified")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                        item.verificationState === "Verified" 
                          ? "bg-sage text-white shadow-sm ring-2 ring-sage/50" 
                          : "bg-sage/10 text-sage hover:bg-sage/20 border border-sage/20"
                      } ${isLocked && item.verificationState !== "Verified" ? "opacity-30 grayscale" : ""}`}
                    >
                      <CheckCircle size={16} /> Verified
                    </button>
                    
                    <button 
                      disabled={isLocked}
                      onClick={() => handleToggleState(item.assetId, "Missing")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                        item.verificationState === "Missing" 
                          ? "bg-rust text-white shadow-sm ring-2 ring-rust/50" 
                          : "bg-rust/10 text-rust hover:bg-rust/20 border border-rust/20"
                      } ${isLocked && item.verificationState !== "Missing" ? "opacity-30 grayscale" : ""}`}
                    >
                      <XCircle size={16} /> Missing
                    </button>
                    
                    <button 
                      disabled={isLocked}
                      onClick={() => handleToggleState(item.assetId, "Damaged")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-bold transition-all ${
                        item.verificationState === "Damaged" 
                          ? "bg-charcoal text-cream shadow-sm ring-2 ring-charcoal/50" 
                          : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20 border border-charcoal/20"
                      } ${isLocked && item.verificationState !== "Damaged" ? "opacity-30 grayscale" : ""}`}
                    >
                      <AlertTriangle size={16} /> Damaged
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Footer */}
      {!isLocked ? (
        <div className="flex justify-end mt-8">
          <button 
            disabled={isClosing}
            onClick={handleCloseCycle}
            className="flex items-center gap-2 bg-navy text-cream px-8 py-3.5 rounded-lg font-bold hover:bg-navy/90 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isClosing ? "Locking Cycle..." : "Close Audit Cycle"} <Lock size={18} />
          </button>
        </div>
      ) : (
        <div className="flex justify-end mt-8">
          <button className="flex items-center gap-2 bg-sage text-white px-8 py-3.5 rounded-lg font-bold hover:bg-sage/90 transition shadow-md">
            Download Discrepancy Report <Download size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
