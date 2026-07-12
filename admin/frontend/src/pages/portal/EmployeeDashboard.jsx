import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function EmployeeDashboard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <header>
        <h1 className="text-3xl font-bold text-navy">Welcome back!</h1>
        <p className="text-navy-light mt-1">Here is a summary of your assigned assets and upcoming bookings.</p>
      </header>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-navy">2</div>
          <div className="text-sm font-medium text-sage-dark uppercase tracking-wider mt-1">Active Assets</div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-navy">1</div>
          <div className="text-sm font-medium text-sage-dark uppercase tracking-wider mt-1">Upcoming Booking</div>
        </motion.div>
        
        <motion.div variants={item} className="bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center h-32">
          <div className="text-4xl font-bold text-rust">0</div>
          <div className="text-sm font-medium text-rust uppercase tracking-wider mt-1">Pending Requests</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
