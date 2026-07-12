import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight, Filter, Plus, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { mockData } from '../mocks/sharedMockData';

export default function ResourceBooking() {
  const [filter, setFilter] = useState('All');
  const [bookings, setBookings] = useState(mockData.bookings);
  
  // Date State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 12)); // July 12, 2026

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({ resource: '', type: 'Room', requester: '', startTime: '', endTime: '' });

  // Format date for UI
  const formatUIHeaderDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format date for filtering (YYYY-MM-DD)
  const formatFilterDate = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const activeDateString = formatFilterDate(currentDate);

  const filteredBookings = bookings.filter(b => {
    const typeMatch = filter === 'All' ? true : b.type === filter;
    const dateMatch = b.date === activeDateString;
    return typeMatch && dateMatch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-gray-100 text-charcoal/60 border-gray-200';
      case 'Ongoing': return 'bg-navy/10 text-navy border-navy/20';
      case 'Upcoming': return 'bg-sage/10 text-sage border-sage/20';
      case 'Cancelled': return 'bg-rust/10 text-rust border-rust/20';
      default: return 'bg-gray-100 text-charcoal border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircle size={14} className="mr-1" />;
      case 'Ongoing': return <Clock size={14} className="mr-1 animate-pulse" />;
      case 'Upcoming': return <Calendar size={14} className="mr-1" />;
      case 'Cancelled': return <XCircle size={14} className="mr-1" />;
      default: return null;
    }
  };

  const cancelBooking = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
  };

  const handleCreateOverride = (e) => {
    e.preventDefault();
    const newId = Math.max(...bookings.map(b => b.id)) + 1;
    setBookings([
      ...bookings, 
      { 
        id: newId, 
        ...newBooking, 
        date: activeDateString, 
        status: 'Upcoming' 
      }
    ]);
    setIsModalOpen(false);
    setNewBooking({ resource: '', type: 'Room', requester: '', startTime: '', endTime: '' });
  };

  return (
    <div className="h-full flex flex-col space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Resource Booking</h1>
          <p className="text-charcoal/60 mt-1">Manage and resolve conflicts for shared assets and rooms.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-beige px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          New Override Booking
        </button>
      </div>

      {/* Filters and Date Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-navy/5 shadow-sm shrink-0">
        <div className="flex gap-2">
          {['All', 'Room', 'Vehicle', 'Equipment'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-navy text-white shadow-md' 
                  : 'bg-beige/50 text-charcoal/70 hover:bg-beige'
              }`}
            >
              {f}s
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-navy">
          <button onClick={handlePrevDay} className="p-1 hover:bg-beige rounded-md transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2 font-semibold min-w-[140px] justify-center">
            <Calendar size={18} />
            <span>{formatUIHeaderDate(currentDate)}</span>
          </div>
          <button onClick={handleNextDay} className="p-1 hover:bg-beige rounded-md transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Timeline Grid Wrapper (Scrollable area) */}
      <div className="flex-1 bg-white border border-navy/5 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-navy/5 bg-beige/30 flex justify-between items-center shrink-0">
           <h2 className="font-semibold text-navy flex items-center gap-2">
             <Filter size={16} /> Schedule View
           </h2>
           <span className="text-xs text-charcoal/50 font-medium px-2 py-1 bg-white rounded-md border border-navy/5">
             {filteredBookings.length} Active Slots
           </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white border border-navy/10 rounded-xl hover:shadow-md transition-shadow group relative overflow-hidden">
              
              {/* Left Color Indicator based on type */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${booking.type === 'Room' ? 'bg-navy' : booking.type === 'Vehicle' ? 'bg-sage' : 'bg-charcoal/40'}`}></div>

              <div className="pl-3 flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-navy text-lg">{booking.resource}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 mt-2 text-sm text-charcoal/70">
                  <div className="flex items-center gap-1.5">
                    <User size={16} className="text-navy/60" />
                    <span className="font-medium">{booking.requester}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-navy/60" />
                    <span className="font-medium text-navy">{booking.startTime} - {booking.endTime}</span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="mt-4 md:mt-0 flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                {booking.status === 'Upcoming' && (
                  <button onClick={() => cancelBooking(booking.id)} className="px-3 py-1.5 text-sm font-medium text-rust bg-rust/10 hover:bg-rust hover:text-white rounded-lg transition-colors border border-rust/20 flex items-center gap-1">
                    <XCircle size={16} />
                    Revoke
                  </button>
                )}
                <button className="px-3 py-1.5 text-sm font-medium text-navy bg-beige/50 hover:bg-beige rounded-lg transition-colors border border-navy/10">
                  View Details
                </button>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="h-48 flex flex-col items-center justify-center text-charcoal/50">
              <AlertTriangle size={32} className="mb-2 text-charcoal/30" />
              <p>No bookings found for this filter on {formatUIHeaderDate(currentDate)}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Override Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-navy/10 flex justify-between items-center bg-beige/30">
              <h3 className="font-bold text-navy text-lg">New Override Booking</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-charcoal/50 hover:text-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateOverride} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1">Resource Name</label>
                <input 
                  type="text" 
                  required
                  value={newBooking.resource}
                  onChange={(e) => setNewBooking({...newBooking, resource: e.target.value})}
                  className="w-full px-3 py-2 border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                  placeholder="e.g. Executive Boardroom"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1">Resource Type</label>
                <select 
                  value={newBooking.type}
                  onChange={(e) => setNewBooking({...newBooking, type: e.target.value})}
                  className="w-full px-3 py-2 border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy bg-white"
                >
                  <option value="Room">Room</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal/80 mb-1">Assign To (Requester)</label>
                <input 
                  type="text" 
                  required
                  value={newBooking.requester}
                  onChange={(e) => setNewBooking({...newBooking, requester: e.target.value})}
                  className="w-full px-3 py-2 border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                  placeholder="e.g. Admin Override"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={newBooking.startTime}
                    onChange={(e) => setNewBooking({...newBooking, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-charcoal/80 mb-1">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={newBooking.endTime}
                    onChange={(e) => setNewBooking({...newBooking, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-navy/10 rounded-lg outline-none focus:border-navy focus:ring-1 focus:ring-navy" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-charcoal hover:bg-beige rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 font-medium bg-navy text-beige hover:bg-navy/90 rounded-lg transition-colors shadow-sm"
                >
                  Confirm Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
