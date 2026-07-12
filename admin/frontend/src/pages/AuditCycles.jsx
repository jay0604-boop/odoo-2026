import React, { useState } from 'react';
import { ClipboardCheck, Search, Plus, Calendar, User, ChevronLeft, CheckCircle2, AlertTriangle, AlertOctagon, Lock } from 'lucide-react';
import { mockData } from '../mocks/sharedMockData';

export default function AuditCycles() {
  const [cycles, setCycles] = useState(mockData.auditCycles);
  const [findings, setFindings] = useState(mockData.auditFindings);
  const [selectedCycle, setSelectedCycle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle viewing a cycle
  const activeFindings = selectedCycle 
    ? findings.filter(f => f.cycleId === selectedCycle.id && f.assetTag.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Override an asset status in the detail view
  const handleUpdateFinding = (findingId, newStatus) => {
    setFindings(findings.map(f => f.id === findingId ? { ...f, status: newStatus } : f));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Verified': return 'bg-sage/10 text-sage border-sage/20';
      case 'Missing': return 'bg-rust/10 text-rust border-rust/20';
      case 'Damaged': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pending': return 'bg-gray-100 text-charcoal/50 border-gray-200';
      default: return 'bg-gray-100 text-charcoal border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Verified': return <CheckCircle2 size={16} className="text-sage" />;
      case 'Missing': return <AlertOctagon size={16} className="text-rust" />;
      case 'Damaged': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'Pending': return <div className="w-4 h-4 rounded-full border-2 border-dashed border-charcoal/30"></div>;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <div className="flex items-center gap-3">
            {selectedCycle && (
              <button 
                onClick={() => setSelectedCycle(null)}
                className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-navy/10 text-charcoal/50 hover:text-navy"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            <h1 className="text-3xl font-bold text-navy">
              {selectedCycle ? selectedCycle.title : 'Asset Audits'}
            </h1>
          </div>
          <p className="text-charcoal/60 mt-1 ml-1">
            {selectedCycle ? `Scope: ${selectedCycle.scope} • Deadline: ${selectedCycle.endDate}` : 'Enforce compliance by scheduling and reviewing physical asset checks.'}
          </p>
        </div>
        
        {!selectedCycle && (
          <button className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-beige px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Plus size={18} />
            New Audit Cycle
          </button>
        )}
        
        {selectedCycle && selectedCycle.status === 'Ongoing' && (
          <button className="flex items-center gap-2 bg-rust hover:bg-rust/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            <Lock size={18} />
            Close & Lock Cycle
          </button>
        )}
      </div>

      {/* Main View: List of Cycles */}
      {!selectedCycle && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pb-6">
          {cycles.map(cycle => {
            const percentComplete = Math.round((cycle.verifiedCount / cycle.totalAssets) * 100);
            return (
              <div 
                key={cycle.id} 
                className="bg-white border border-navy/10 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col group relative overflow-hidden"
                onClick={() => setSelectedCycle(cycle)}
              >
                {/* Status Ribbon */}
                <div className={`absolute top-0 right-0 px-4 py-1.5 text-xs font-bold rounded-bl-xl ${cycle.status === 'Closed' ? 'bg-charcoal/10 text-charcoal/60' : 'bg-sage/10 text-sage'}`}>
                  {cycle.status}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${cycle.status === 'Closed' ? 'bg-charcoal/5' : 'bg-navy/5'}`}>
                    <ClipboardCheck size={24} className={cycle.status === 'Closed' ? 'text-charcoal/40' : 'text-navy'} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-charcoal group-hover:text-navy transition-colors">{cycle.title}</h3>
                    <p className="text-sm font-medium text-charcoal/50">Scope: {cycle.scope}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm text-charcoal/70">
                    <Calendar size={16} className="text-navy/40" />
                    <span>{cycle.startDate} to {cycle.endDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-charcoal/70">
                    <User size={16} className="text-navy/40" />
                    <span>{cycle.auditors.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-navy/5">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-charcoal/60">Progress</span>
                    <span className="text-navy">{cycle.verifiedCount} / {cycle.totalAssets} Checked</span>
                  </div>
                  <div className="w-full bg-navy/5 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full ${cycle.status === 'Closed' ? 'bg-charcoal/30' : 'bg-sage'}`} 
                      style={{ width: `${percentComplete}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail View: Discrepancy Report & Checks */}
      {selectedCycle && (
        <div className="flex-1 bg-white border border-navy/5 rounded-xl shadow-sm flex flex-col overflow-hidden">
          
          <div className="p-4 border-b border-navy/5 bg-beige/30 flex justify-between items-center shrink-0">
             <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
               <input 
                 type="text" 
                 placeholder="Search by Asset Tag..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-white border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm"
               />
             </div>
             <div className="flex gap-2">
                <span className="text-xs font-semibold px-3 py-1.5 bg-sage/10 text-sage rounded-md flex items-center gap-1">
                   <CheckCircle2 size={14}/> Verified: {activeFindings.filter(f=>f.status==='Verified').length}
                </span>
                <span className="text-xs font-semibold px-3 py-1.5 bg-rust/10 text-rust rounded-md flex items-center gap-1">
                   <AlertOctagon size={14}/> Missing: {activeFindings.filter(f=>f.status==='Missing').length}
                </span>
             </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 border-b border-navy/10 z-10 text-xs uppercase text-charcoal/50 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Asset Tag</th>
                  <th className="px-6 py-4">Asset Name</th>
                  <th className="px-6 py-4">Expected Location</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  {selectedCycle.status === 'Ongoing' && <th className="px-6 py-4 text-right">Admin Override</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {activeFindings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-beige/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-navy">{finding.assetTag}</td>
                    <td className="px-6 py-4 font-medium text-charcoal/80">{finding.assetName}</td>
                    <td className="px-6 py-4 text-sm text-charcoal/60">{finding.expectedLocation}</td>
                    <td className="px-6 py-4">
                      <div className={`mx-auto w-fit inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(finding.status)}`}>
                        <span className="mr-1.5">{getStatusIcon(finding.status)}</span>
                        {finding.status}
                      </div>
                    </td>
                    
                    {selectedCycle.status === 'Ongoing' && (
                      <td className="px-6 py-4 text-right space-x-2">
                        {finding.status !== 'Verified' && (
                          <button onClick={() => handleUpdateFinding(finding.id, 'Verified')} className="px-3 py-1 text-xs font-bold text-sage bg-sage/10 hover:bg-sage hover:text-white rounded transition-colors">
                            Verify
                          </button>
                        )}
                        {finding.status !== 'Missing' && (
                          <button onClick={() => handleUpdateFinding(finding.id, 'Missing')} className="px-3 py-1 text-xs font-bold text-rust bg-rust/10 hover:bg-rust hover:text-white rounded transition-colors">
                            Mark Missing
                          </button>
                        )}
                        {finding.status !== 'Damaged' && (
                          <button onClick={() => handleUpdateFinding(finding.id, 'Damaged')} className="px-3 py-1 text-xs font-bold text-amber-600 bg-amber-100 hover:bg-amber-500 hover:text-white rounded transition-colors">
                            Flag Damaged
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {activeFindings.length === 0 && (
              <div className="h-32 flex items-center justify-center text-charcoal/40 font-medium">
                No assets found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
