import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { 
  CheckCircle2, 
  Briefcase, 
  Wrench, 
  CalendarClock, 
  ArrowRightLeft, 
  RotateCcw,
  AlertOctagon,
  Bell
} from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [overdueItems, setOverdueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [kpiData, overdueData] = await Promise.all([
        dashboardApi.getKpis(),
        dashboardApi.getOverdueReturns()
      ]);
      setKpis(kpiData);
      setOverdueItems(overdueData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const kpiCards = [
    { label: "Available", value: kpis?.available || 0, icon: CheckCircle2, color: "text-sage" },
    { label: "Allocated", value: kpis?.allocated || 0, icon: Briefcase, color: "text-navy" },
    { label: "Maintenance", value: kpis?.maintenance || 0, icon: Wrench, color: "text-amber" },
    { label: "Active Bookings", value: kpis?.activeBookings || 0, icon: CalendarClock, color: "text-navy" },
    { label: "Pending Transfers", value: kpis?.pendingTransfers || 0, icon: ArrowRightLeft, color: "text-navy" },
    { label: "Upcoming Returns", value: kpis?.upcomingReturns || 0, icon: RotateCcw, color: "text-navy" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-7xl mx-auto pb-12"
    >
      <div className="flex justify-between items-end mb-8 border-b border-navy/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-navy">Command Center</h1>
          <p className="text-charcoal/70 mt-1">High-level overview of asset operations and critical alerts.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-navy/50 animate-pulse font-medium">
          Loading metrics...
        </div>
      ) : (
        <>
          {/* KPI Blocks Row */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
          >
            {kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div variants={itemVariants} key={idx} className="bg-cream rounded-xl p-5 border border-navy/10 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <Icon className={`${card.color} opacity-80`} size={24} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-navy mb-1">{card.value}</div>
                    <div className="text-xs font-bold text-charcoal/70 uppercase tracking-widest leading-tight">{card.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Overdue Returns Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <AlertOctagon className="text-rust" size={24} />
              <h2 className="text-2xl font-bold text-navy">Overdue Returns</h2>
            </div>
            
            {overdueItems.length === 0 ? (
              <div className="bg-cream p-8 rounded-lg border border-navy/10 text-center text-charcoal/60">
                No overdue returns at this time. All assets are accounted for!
              </div>
            ) : (
              <div className="grid gap-4">
                {overdueItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-navy/10 border-l-[6px] border-l-rust p-5 flex items-center justify-between hover:shadow-md hover:border-navy/20 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-rust/5 border border-rust/10 rounded-lg flex items-center justify-center flex-col shrink-0">
                        <span className="text-rust font-bold text-xl">{item.daysOverdue}</span>
                        <span className="text-rust/80 text-[10px] uppercase font-bold tracking-wider">Days</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-xs font-bold text-rust bg-rust/10 px-2 py-1 rounded border border-rust/10">
                            {item.tag}
                          </span>
                          <h3 className="text-lg font-bold text-charcoal">{item.name}</h3>
                        </div>
                        <div className="text-sm text-charcoal/70 flex gap-4 mt-1.5">
                          <span>Expected: <span className="font-semibold text-charcoal">{item.expectedReturn}</span></span>
                          <span className="text-charcoal/30">|</span>
                          <span>Holder: <span className="font-semibold text-charcoal">{item.holder}</span> ({item.department})</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-rust/10 text-rust hover:bg-rust hover:text-white rounded-md font-bold transition shadow-sm border border-rust/20 hover:border-rust">
                      <Bell size={16} /> Send Reminder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
