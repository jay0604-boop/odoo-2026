import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const bookingApi = {
  /**
   * Fetch current bookings for a specific resource on a given date.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/bookings?resourceId={id}&date={date}
   */
  fetchResourceBookings: async (resourceId, dateStr) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock scheduled slot indices (0 = 09:00-10:00, 1 = 10:00-11:00, etc.)
    const mockBookings = {
      'res-room-berlin': [1, 4, 5], // 10:00, 13:00, 14:00 blocked
      'res-tesla': [0, 1, 2, 7, 8], // 09:00, 10:00, 11:00, 16:00, 17:00 blocked
      'res-room-tokyo': [3],        // 12:00 blocked
    };

    return mockBookings[resourceId] || [];
  },

  /**
   * Submit a booking reservation.
   * // TODO: Member 1 - Connect your endpoint here: POST /api/v1/bookings
   */
  createBooking: async (bookingPayload) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('Sending booking creation payload to backend:', bookingPayload);

    if (bookingPayload.resourceId && bookingPayload.date && bookingPayload.slotIndex !== undefined) {
      return {
        success: true,
        bookingId: 'bk-' + Math.floor(Math.random() * 100000),
        message: 'Resource slot reserved successfully.'
      };
    }
    throw new Error('Could not reserve slot. Please try again.');
  }
};

/* ==========================================================================
   BOOKING CALENDAR SCHEDULER COMPONENT
   ========================================================================== */

export default function BookingCalendar() {
  const [searchParams] = useSearchParams();

  // Resources list
  const resources = [
    { id: 'res-room-berlin', name: 'Conference Room Berlin (3F)', category: 'Meeting Rooms' },
    { id: 'res-room-tokyo', name: 'Conference Room Tokyo (5F)', category: 'Meeting Rooms' },
    { id: 'res-tesla', name: 'Tesla Model Y (Fleet-08)', category: 'Vehicles' },
  ];

  // Initialize states
  const preselectedId = searchParams.get('resource') || resources[0].id;
  const [selectedResourceId, setSelectedResourceId] = useState(preselectedId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedSlots, setBlockedSlots] = useState([]); // indices of reserved hours
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null); // index user clicks to book
  
  // Modal/Form states
  const [bookingPurpose, setBookingPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  // Hour Blocks definition (09:00 to 18:00)
  const timeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:30',
    '15:30 - 16:30',
    '16:30 - 17:30',
    '17:30 - 18:30'
  ];

  const dateStr = currentDate.toISOString().split('T')[0];

  // Fetch blocked timeslots for resource on date change
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setIsLoading(true);
        setSelectedSlotIndex(null);
        setAlertMsg({ type: '', text: '' });
        const blocked = await bookingApi.fetchResourceBookings(selectedResourceId, dateStr);
        setBlockedSlots(blocked);
      } catch (err) {
        console.error('Error loading schedule:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSchedule();
  }, [selectedResourceId, dateStr]);

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleSlotClick = (index) => {
    if (blockedSlots.includes(index)) return; // blocked slot
    setSelectedSlotIndex(index);
    setAlertMsg({ type: '', text: '' });
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (selectedSlotIndex === null) return;
    if (!bookingPurpose.trim()) {
      setAlertMsg({ type: 'error', text: 'Please fill in the booking purpose.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        resourceId: selectedResourceId,
        resourceName: resources.find(r => r.id === selectedResourceId)?.name,
        date: dateStr,
        slotIndex: selectedSlotIndex,
        timeSlot: timeSlots[selectedSlotIndex],
        purpose: bookingPurpose,
        bookedAt: new Date().toISOString()
      };

      const res = await bookingApi.createBooking(payload);
      if (res.success) {
        setBlockedSlots([...blockedSlots, selectedSlotIndex]);
        setAlertMsg({ type: 'success', text: `Slot reserved successfully! Booking ID: ${res.bookingId}` });
        setSelectedSlotIndex(null);
        setBookingPurpose('');
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: err.message || 'Booking failed. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div>
        <h3 className="text-xl font-bold text-white tracking-tight">Resource Scheduler</h3>
        <p className="text-sm text-slate-400">Reserve company conference rooms or vehicles hourly.</p>
      </div>

      {/* Scheduler Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Resource selection & Date Control */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            
            {/* Resource Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Resource
              </label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
              >
                {resources.map((res) => (
                  <option key={res.id} value={res.id}>
                    {res.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Navigator */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Date
              </label>
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={handlePrevDay}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-bold text-slate-200">{dateStr}</span>
                <button
                  onClick={handleNextDay}
                  className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-md transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Info Status Legend */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Legend</h4>
            <div className="space-y-2 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 bg-slate-950 border border-slate-800 rounded" />
                <span>Available Slot (Click to Reserve)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded" />
                <span>Blocked / Already Booked</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-3 w-3 bg-brand-500/10 border border-brand-500/30 rounded" />
                <span>Your Selected Slot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Hourly Scheduler Grid */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Action alerts */}
          {alertMsg.text && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
              alertMsg.type === 'success'
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/5 border-rose-500/10 text-rose-400'
            }`}>
              {alertMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
              <span>{alertMsg.text}</span>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-24 bg-slate-900 border border-slate-800 rounded-xl">
              <svg className="animate-spin h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              
              {/* Daily Schedule Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-500" />
                  <span className="text-xs font-bold text-slate-200">Daily Timeline Calendar</span>
                </div>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-semibold uppercase tracking-wider">
                  {resources.find(r => r.id === selectedResourceId)?.category}
                </span>
              </div>

              {/* Slots List */}
              <div className="divide-y divide-slate-800/60 p-4 space-y-2">
                {timeSlots.map((slot, index) => {
                  const isBlocked = blockedSlots.includes(index);
                  const isSelected = selectedSlotIndex === index;

                  return (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`flex items-center justify-between p-3.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                        isBlocked
                          ? 'bg-rose-500/5 border-rose-500/10 text-rose-400/80 cursor-not-allowed'
                          : isSelected
                          ? 'bg-brand-500/10 border-brand-500/40 text-brand-400'
                          : 'bg-slate-950/60 border-slate-850 text-slate-300 hover:border-slate-700 hover:bg-slate-800/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className={`h-4 w-4 ${isBlocked ? 'text-rose-500' : isSelected ? 'text-brand-400' : 'text-slate-500'}`} />
                        <span>{slot}</span>
                      </div>
                      
                      <div>
                        {isBlocked ? (
                          <span className="text-[10px] bg-rose-500/15 border border-rose-500/25 px-2 py-0.5 rounded text-rose-400">
                            Booked
                          </span>
                        ) : isSelected ? (
                          <span className="text-[10px] bg-brand-500/20 border border-brand-500/40 px-2 py-0.5 rounded text-brand-400">
                            Selected
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 group-hover:text-slate-400 font-normal">
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Collapsible Form for Selected Slot */}
          {selectedSlotIndex !== null && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-in slide-in-from-bottom duration-250">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck className="h-4.5 w-4.5 text-brand-500" />
                <h4 className="text-xs font-bold text-slate-200">
                  Confirm Reservation for {timeSlots[selectedSlotIndex]}
                </h4>
              </div>

              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Purpose of Booking
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingPurpose}
                    onChange={(e) => setBookingPurpose(e.target.value)}
                    placeholder="e.g. Weekly Engineering Sync, Client Demo Drive..."
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSlotIndex(null)}
                    className="py-1.5 px-3 bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-1.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-[11px] disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isSubmitting ? 'Reserving...' : 'Book Selected Slot'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
