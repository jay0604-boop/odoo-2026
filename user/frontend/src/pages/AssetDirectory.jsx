import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertCircle, RefreshCw, CalendarCheck, CheckCircle2 } from 'lucide-react';
import TransferRequestModal from '../components/TransferRequestModal';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const directoryApi = {
  /**
   * Retrieve company asset registry.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/inventory/assets
   */
  fetchDirectory: async () => {
    // Simulating API Latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    return [
      { id: 'ast-101', name: 'MacBook Pro 14" (M3)', category: 'Electronics', serial: 'C02H412VD6M1', status: 'Available', owner: null, tags: ['Laptop', 'Apple', 'IT'] },
      { id: 'ast-102', name: 'Dell UltraSharp 32" Monitor', category: 'Electronics', serial: 'CN-0M918Y-7890', status: 'Blocked', owner: 'Jane Doe', tags: ['Monitor', 'Dell', 'IT'] },
      { id: 'ast-103', name: 'Tesla Model Y (Fleet-08)', category: 'Vehicles', serial: '5YJYGVDE4LF1122', status: 'Available', owner: null, tags: ['Electric', 'Car', 'Logistics'] },
      { id: 'ast-104', name: 'Meeting Room Berlin (3F)', category: 'Meeting Rooms', serial: 'ROOM-BER-3F', status: 'Available', owner: null, tags: ['Space', 'HQ', 'Berlin'] },
      { id: 'ast-105', name: 'Meeting Room Tokyo (5F)', category: 'Meeting Rooms', serial: 'ROOM-TOK-5F', status: 'Blocked', owner: 'John Smith', tags: ['Space', 'HQ', 'Tokyo'] },
      { id: 'ast-106', name: 'Ergonomic Desk Pro', category: 'Furniture', serial: 'DK-PRO-4458', status: 'Available', owner: null, tags: ['Desk', 'Office', 'HQ'] },
    ];
  }
};

/* ==========================================================================
   ASSET DIRECTORY COMPONENT
   ========================================================================== */

export default function AssetDirectory() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssetForTransfer, setSelectedAssetForTransfer] = useState(null);
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    const loadDirectory = async () => {
      try {
        setIsLoading(true);
        const data = await directoryApi.fetchDirectory();
        setAssets(data);
        setFilteredAssets(data);
      } catch (error) {
        console.error('Error loading asset directory:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDirectory();
  }, []);

  // Handle local searching/filtering logic
  useEffect(() => {
    let result = assets;

    // Filter by text search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (asset) =>
          asset.name.toLowerCase().includes(q) ||
          asset.serial.toLowerCase().includes(q) ||
          asset.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter((asset) => asset.category === selectedCategory);
    }

    // Filter by Status
    if (selectedStatus !== 'All') {
      result = result.filter((asset) => asset.status === selectedStatus);
    }

    setFilteredAssets(result);
  }, [searchQuery, selectedCategory, selectedStatus, assets]);

  const handleAction = (asset) => {
    if (asset.status === 'Available') {
      if (asset.category === 'Meeting Rooms' || asset.category === 'Vehicles') {
        navigate(`/bookings?resource=${asset.id}`);
      } else {
        alert(`Booking requested for ${asset.name}. Allocation request created.`);
      }
    } else {
      // Trigger modal directly
      setSelectedAssetForTransfer(asset);
      setIsModalOpen(true);
    }
  };

  const handleTransferSuccess = (message) => {
    setSuccessBanner(message);
    setTimeout(() => setSuccessBanner(''), 5000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Asset Directory</h3>
          <p className="text-sm text-slate-400">Search and check status of rooms, electronics, and vehicles.</p>
        </div>
      </div>

      {/* Success alert banner */}
      {successBanner && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by name, serial, or tag..."
            className="block w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Meeting Rooms">Meeting Rooms</option>
              <option value="Furniture">Furniture</option>
            </select>
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <svg className="animate-spin h-7 w-7 text-brand-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/50">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Asset Name</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Serial Number</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Availability</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Owner</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-sm font-bold text-slate-200 block">{asset.name}</span>
                        <div className="flex gap-1.5 mt-1.5">
                          {asset.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="text-[9px] font-semibold bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-300">{asset.category}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{asset.serial}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                        asset.status === 'Available'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          asset.status === 'Available' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} />
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      {asset.owner ? (
                        <span className="text-slate-300">{asset.owner}</span>
                      ) : (
                        <span className="text-slate-600 font-normal">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAction(asset)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          asset.status === 'Available'
                            ? 'bg-brand-600 border-brand-500 hover:bg-brand-500 text-white'
                            : 'bg-slate-950 border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-400 hover:text-rose-300'
                        }`}
                      >
                        {asset.status === 'Available' ? (
                          <>
                            <CalendarCheck className="h-3.5 w-3.5" />
                            <span>Book / Claim</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Request Transfer</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <AlertCircle className="h-8 w-8 text-slate-500 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-200">No assets found</h4>
          <p className="text-xs text-slate-400 mt-1">Try tweaking your search keywords or filters.</p>
        </div>
      )}

      {/* Transfer Modal Injection */}
      <TransferRequestModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssetForTransfer(null);
        }}
        asset={selectedAssetForTransfer}
        onSuccess={handleTransferSuccess}
      />
    </div>
  );
}
