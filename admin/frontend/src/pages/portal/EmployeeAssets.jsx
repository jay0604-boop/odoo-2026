import { useState } from "react";
import { Laptop, Smartphone, AlertTriangle, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_MY_ASSETS = [
  {
    id: "1",
    tag: "AF-0012",
    name: "MacBook Pro M3",
    category: "Laptop",
    condition: "Good",
    assignedDate: "2025-01-10",
    icon: <Laptop className="w-8 h-8 text-navy" />,
    status: "Active"
  },
  {
    id: "2",
    tag: "AF-0045",
    name: "iPhone 15 Pro",
    category: "Mobile",
    condition: "Fair",
    assignedDate: "2024-08-22",
    icon: <Smartphone className="w-8 h-8 text-navy" />,
    status: "Active"
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function EmployeeAssets() {
  const [assets, setAssets] = useState(MOCK_MY_ASSETS);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight">My Assigned Assets</h1>
          <p className="text-navy-light mt-1 text-sm">Manage the equipment currently allocated to you.</p>
        </div>
      </header>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {assets.map((asset) => (
          <motion.div 
            variants={item}
            key={asset.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-sm hover:shadow-md transition-all p-6 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cream rounded-xl group-hover:scale-105 transition-transform">
                {asset.icon}
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sage/20 text-sage-dark">
                <CheckCircle2 size={12} />
                {asset.status}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold text-navy">{asset.name}</h3>
              <p className="text-sm font-mono text-navy-light mt-1">{asset.tag}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-navy/50 text-xs uppercase tracking-wider mb-1">Condition</p>
                <p className="font-medium text-charcoal">{asset.condition}</p>
              </div>
              <div>
                <p className="text-navy/50 text-xs uppercase tracking-wider mb-1">Assigned</p>
                <p className="font-medium text-charcoal">{asset.assignedDate}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-cream/50">
              <button className="flex-1 flex items-center justify-center gap-2 bg-cream hover:bg-cream/80 text-navy py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                <ArrowLeftRight size={16} />
                Return
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-rust/10 hover:bg-rust/20 text-rust py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                <AlertTriangle size={16} />
                Report Issue
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
