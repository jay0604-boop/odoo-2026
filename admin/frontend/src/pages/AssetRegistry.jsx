import { useState, useEffect } from "react";
import { DataService } from "../lib/dataService";
import { Plus, X, Search, Filter, Image as ImageIcon } from "lucide-react";

export default function AssetRegistry() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "All",
    status: "All",
    department: "All",
    location: "All"
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category_id: "",
    serialNumber: "",
    cost: "",
    condition: "New",
    location: "",
    isBookable: false
  });

  // Image Upload State
  const [assetImage, setAssetImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Reference data for dropdowns
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
    
    // Cleanup the object URL to prevent memory leaks on unmount or when image changes
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [assetData, cats, depts] = await Promise.all([
        DataService.getAssets(),
        DataService.getCategories(),
        DataService.getDepartments()
      ]);
      setAssets(assetData);
      if (cats.length > 0) {
        setCategories(cats);
        setNewAsset(prev => ({ ...prev, category_id: cats[0].id }));
      }
      setDepartments(depts);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAssetImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Generate a temporary mock tag (in production, use a DB trigger)
    const tagCounter = Math.floor(Math.random() * 10000);
    const newTag = `AF-${String(tagCounter).padStart(4, '0')}`;
    
    const assetData = {
      asset_tag: newTag,
      name: newAsset.name,
      category_id: newAsset.category_id,
      serial_number: newAsset.serialNumber,
      acquisition_cost: newAsset.cost ? parseFloat(newAsset.cost) : null,
      condition: newAsset.condition,
      location: newAsset.location,
      status: "Available"
    };

    try {
      await DataService.createAsset(assetData);
      setIsDrawerOpen(false);
      
      // Reset form
      setNewAsset({
        name: "",
        category_id: categories[0]?.id || "",
        serialNumber: "",
        cost: "",
        condition: "New",
        location: "",
        isBookable: false
      });
      setAssetImage(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      
      fetchData();
    } catch (error) {
      console.error("Error creating asset:", error);
      alert("Failed to create asset.");
    }
  };

  const StatusBadge = ({ status }) => {
    let style = "bg-slate/10 text-slate border-slate/20"; // Disabled / Retired / Disposed
    if (status === "Available") style = "bg-sage/10 text-sage border-sage/20";
    if (status === "Allocated") style = "bg-navy/10 text-navy border-navy/20";
    if (status === "Under Maintenance") style = "bg-amber/10 text-amber border-amber/20";
    if (status === "Lost") style = "bg-rust/10 text-rust border-rust/20";
    
    return <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style}`}>{status}</span>;
  };

  const uniqueLocations = [...new Set(assets.map(a => a.location).filter(Boolean))];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "All" || asset.category === filters.category;
    const matchesStatus = filters.status === "All" || asset.status === filters.status;
    const matchesLocation = filters.location === "All" || asset.location === filters.location;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col pb-6 pr-2">
      <div className="flex justify-between items-end mb-6 border-b border-navy/10 pb-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy">Asset Registry</h1>
          <p className="text-charcoal/70 mt-1">Central directory and lifecycle tracking.</p>
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-navy text-cream px-5 py-2.5 rounded-md font-medium hover:bg-navy/90 transition shadow-sm"
        >
          <Plus size={18} /> Register Asset
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-cream p-4 rounded-lg shadow-sm border border-navy/10 mb-6 flex flex-wrap gap-4 items-center shrink-0">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
          <input 
            type="text" 
            placeholder="Search by Asset Tag or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-navy/20 rounded-md bg-white text-sm focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy/50 transition-shadow"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Filter className="text-navy" size={18} />
          
          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="p-2 border border-navy/20 rounded-md bg-white text-sm focus:border-navy focus:outline-none min-w-[140px]"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>

          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="p-2 border border-navy/20 rounded-md bg-white text-sm focus:border-navy focus:outline-none min-w-[140px]"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Lost">Lost</option>
          </select>

          <select 
            value={filters.location} 
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="p-2 border border-navy/20 rounded-md bg-white text-sm focus:border-navy focus:outline-none min-w-[140px]"
          >
            <option value="All">All Locations</option>
            {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Grid Table */}
      <div className="bg-cream rounded-xl shadow-sm border border-navy/10 flex-1 overflow-hidden flex flex-col mb-2">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-charcoal/50 animate-pulse font-medium">Loading assets...</div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-16">
            <div className="text-center bg-beige/30 border border-dashed border-navy/20 p-8 rounded-lg w-full max-w-md">
              <h3 className="text-navy font-bold mb-1">No Assets Found</h3>
              <p className="text-charcoal/50 text-sm">No assets match your current search or filter criteria.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse relative">
              <thead className="sticky top-0 bg-beige border-b border-navy/10 z-10 shadow-sm">
                <tr className="text-charcoal/70 text-sm">
                  <th className="p-4 font-medium w-20">Photo</th>
                  <th className="p-4 font-medium">Asset Tag</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Location</th>
                  <th className="p-4 font-medium">Current Holder</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {filteredAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-beige/30 transition cursor-pointer">
                    <td className="p-4">
                      {asset.photo_url ? (
                        <img 
                          src={asset.photo_url.startsWith('http') ? asset.photo_url : `http://localhost:8000${asset.photo_url}`} 
                          alt={asset.name} 
                          className="w-12 h-12 object-cover rounded border border-navy/20 bg-beige/50" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded border border-navy/10 bg-beige/30 flex items-center justify-center text-charcoal/30">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1.5 rounded border border-navy/10">
                        {asset.tag}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-charcoal">{asset.name}</td>
                    <td className="p-4 text-charcoal/80 text-sm font-medium">{asset.category}</td>
                    <td className="p-4 text-charcoal/70 text-sm">{asset.location}</td>
                    <td className="p-4 text-charcoal/70 text-sm">{asset.holder}</td>
                    <td className="p-4"><StatusBadge status={asset.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Register Side Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-navy/60 flex justify-end z-50 animate-in fade-in">
          <div className="w-full max-w-md bg-cream h-full shadow-2xl p-6 overflow-y-auto border-l border-navy/10 animate-in slide-in-from-right-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-navy">Register Asset</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-charcoal/50 hover:text-charcoal transition p-1 bg-navy/5 rounded hover:bg-navy/10"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Asset Name</label>
                <input required value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="e.g. Dell XPS 15" />
              </div>

              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Category</label>
                <select required value={newAsset.category_id} onChange={e => setNewAsset({...newAsset, category_id: e.target.value})} className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Serial Number</label>
                <input required value={newAsset.serialNumber} onChange={e => setNewAsset({...newAsset, serialNumber: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="e.g. SN-88492001" />
              </div>

              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Acquisition Cost (USD)</label>
                <input required value={newAsset.cost} onChange={e => setNewAsset({...newAsset, cost: e.target.value})} type="number" step="0.01" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="0.00" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">Condition</label>
                  <select required value={newAsset.condition} onChange={e => setNewAsset({...newAsset, condition: e.target.value})} className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition">
                    <option value="New">New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal mb-1">Initial Location</label>
                  <input required value={newAsset.location} onChange={e => setNewAsset({...newAsset, location: e.target.value})} type="text" className="w-full p-2.5 border border-navy/20 rounded-md bg-white outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 transition" placeholder="e.g. Storage A" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Asset Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-navy/30 rounded-lg cursor-pointer hover:bg-navy/5 hover:border-navy transition group">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="text-navy/50 group-hover:text-navy mb-2" size={24} />
                      <span className="text-sm text-charcoal/70 group-hover:text-charcoal font-medium">Click to attach photo</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-navy/20 shadow-sm shrink-0 relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          setAssetImage(null);
                          URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 bg-white/80 p-0.5 rounded-full text-rust hover:bg-white hover:text-rust transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 pb-2 bg-beige/50 p-3 rounded border border-navy/5 mt-2">
                <input 
                  type="checkbox" 
                  id="isBookable"
                  checked={newAsset.isBookable} 
                  onChange={e => setNewAsset({...newAsset, isBookable: e.target.checked})}
                  className="w-4 h-4 mt-0.5 text-navy rounded border-navy/30 focus:ring-navy cursor-pointer accent-navy"
                />
                <label htmlFor="isBookable" className="text-sm font-bold text-navy cursor-pointer flex flex-col">
                  <span>Shared / Bookable Resource</span>
                  <span className="text-xs text-charcoal/60 font-medium mt-0.5 leading-snug">Checking this allows time-slot reservations on the booking calendar.</span>
                </label>
              </div>

              <div className="pt-6 border-t border-navy/10 mt-6">
                <button type="submit" className="w-full bg-navy text-cream py-3.5 rounded-lg font-bold hover:bg-navy/90 transition shadow-md flex items-center justify-center gap-2">
                  <Plus size={18} /> Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
