import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, ArrowRightLeft, CalendarCheck, Wrench, ShieldCheck, AlertTriangle, FileText, ChevronDown } from 'lucide-react';
import { mockData } from '../mocks/sharedMockData';

export default function GlobalLogs() {
  const [logs] = useState(mockData.activityLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Allocation', 'Alert', 'Audit', 'Maintenance', 'Security', 'Booking'];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.actor.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || log.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getLogIcon = (category) => {
    switch(category) {
      case 'Allocation': return <ArrowRightLeft size={18} className="text-navy" />;
      case 'Alert': return <AlertTriangle size={18} className="text-rust" />;
      case 'Audit': return <FileText size={18} className="text-sage" />;
      case 'Maintenance': return <Wrench size={18} className="text-amber-600" />;
      case 'Security': return <ShieldCheck size={18} className="text-blue-600" />;
      case 'Booking': return <CalendarCheck size={18} className="text-teal-600" />;
      default: return <ShieldAlert size={18} className="text-charcoal" />;
    }
  };

  const getLogColor = (category) => {
    switch(category) {
      case 'Allocation': return 'bg-navy/10 border-navy/20';
      case 'Alert': return 'bg-rust/10 border-rust/20';
      case 'Audit': return 'bg-sage/10 border-sage/20';
      case 'Maintenance': return 'bg-amber-100 border-amber-200';
      case 'Security': return 'bg-blue-100 border-blue-200';
      case 'Booking': return 'bg-teal-100 border-teal-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: 'numeric', minute: '2-digit', hour12: true 
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
            Global Activity Logs
          </h1>
          <p className="text-charcoal/60 mt-1">Immutable audit trail of all system actions, assignments, and alerts.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
          <input 
            type="text" 
            placeholder="Search logs by user, action, or asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy text-sm shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter size={18} className="text-charcoal/50 mr-1" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === cat 
                  ? 'bg-navy text-white shadow-sm' 
                  : 'bg-white border border-navy/10 text-charcoal/60 hover:text-navy hover:border-navy/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Log Timeline */}
      <div className="flex-1 bg-white border border-navy/5 rounded-xl shadow-sm overflow-hidden flex flex-col p-6">
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-navy/10 before:to-transparent">
            
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                {/* Timeline Icon Marker */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${getLogColor(log.category)}`}>
                  {getLogIcon(log.category)}
                </div>
                
                {/* Card */}
                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-navy uppercase tracking-wider">{log.category}</span>
                    <span className="text-xs font-medium text-charcoal/40">{formatDate(log.timestamp)}</span>
                  </div>
                  <h4 className="font-bold text-charcoal text-base mb-1">{log.action}</h4>
                  <div className="text-sm text-charcoal/70 font-medium">
                    <span className="text-navy">{log.actor}</span> on <span className="font-mono bg-beige/50 px-1 py-0.5 rounded text-charcoal">{log.entity}</span>
                  </div>
                </div>

              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="relative z-10 flex flex-col items-center justify-center h-32 bg-white rounded-xl border border-dashed border-navy/20">
                <ShieldAlert size={24} className="text-charcoal/30 mb-2" />
                <p className="text-sm font-medium text-charcoal/50">No logs found matching your criteria.</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
