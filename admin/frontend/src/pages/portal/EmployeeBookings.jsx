import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Plus, ChevronRight } from "lucide-react";

const MOCK_RESOURCES = [
  {
    id: "r1",
    name: "Conference Room A1",
    category: "Meeting Room",
    capacity: 12,
    location: "Building 1, Floor 2",
    available: true,
  },
  {
    id: "r2",
    name: "Ford Transit Van",
    category: "Vehicle",
    capacity: 2,
    location: "Garage A",
    available: false,
    nextAvailable: "Today at 4:00 PM"
  }
];

export default function EmployeeBookings() {
  const [resources] = useState(MOCK_RESOURCES);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight">Resource Booking</h1>
          <p className="text-navy-light mt-1 text-sm">Reserve meeting rooms, vehicles, and shared equipment.</p>
        </div>
        <button className="flex items-center gap-2 bg-rust hover:bg-rust-dark text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
          <Plus size={18} />
          New Booking
        </button>
      </header>
      
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-cream/50 bg-white/40">
          <h2 className="text-lg font-bold text-navy flex items-center gap-2">
            <Calendar className="text-rust" size={20} />
            Available Resources
          </h2>
        </div>
        
        <div className="divide-y divide-cream/50">
          {resources.map((resource) => (
            <div key={resource.id} className="p-6 hover:bg-white/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-charcoal">{resource.name}</h3>
                  {resource.available ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sage/20 text-sage-dark">
                      Available Now
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rust/10 text-rust">
                      In Use
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-navy-light mt-2">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {resource.location}</span>
                  <span className="flex items-center gap-1.5"><Users size={14} /> Capacity: {resource.capacity}</span>
                  {!resource.available && (
                    <span className="flex items-center gap-1.5 text-rust"><Clock size={14} /> Free: {resource.nextAvailable}</span>
                  )}
                </div>
              </div>

              <div>
                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  resource.available 
                    ? "bg-navy hover:bg-navy-light text-cream shadow-sm" 
                    : "bg-cream text-navy-light hover:bg-cream-dark"
                }`}>
                  {resource.available ? "Book Slot" : "Join Waitlist"}
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
