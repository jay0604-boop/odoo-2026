import { useState, useEffect } from "react";
import { maintenanceApi } from "../api/maintenanceApi";
import { Clock, CheckCircle2, ChevronRight, User, Camera, X } from "lucide-react";

export default function MaintenanceKanban() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Modal State
  const [uploadModal, setUploadModal] = useState({ isOpen: false, requestId: null });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const columns = [
    { id: "Pending", label: "Pending", color: "bg-amber/10 border-amber" },
    { id: "Approved", label: "Approved", color: "bg-navy/10 border-navy" },
    { id: "Technician Assigned", label: "Tech Assigned", color: "bg-navy/20 border-navy" },
    { id: "In Progress", label: "In Progress", color: "bg-navy/30 border-navy" },
    { id: "Resolved", label: "Resolved", color: "bg-sage/10 border-sage" }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "Low": return "bg-sage";
      case "Medium": return "bg-amber";
      case "High": return "bg-rust/80";
      case "Critical": return "bg-rust";
      default: return "bg-slate";
    }
  };

  useEffect(() => {
    fetchData();
    
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await maintenanceApi.getRequests();
    setRequests(data);
    setIsLoading(false);
  };

  const handleStatusChange = async (id, currentStatus) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus);
    if (currentIndex < columns.length - 1) {
      const nextStatus = columns[currentIndex + 1].id;
      // Optimistic UI update
      setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: nextStatus } : r));
      await maintenanceApi.updateStatus(id, nextStatus);
    }
  };

  const handlePhotoSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile || !uploadModal.requestId) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("requestId", uploadModal.requestId);
    formData.append("repairPhoto", photoFile);

    await maintenanceApi.uploadRepairPhoto(formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });

    setIsUploading(false);
    
    // Cleanup
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadModal({ isOpen: false, requestId: null });
  };

  const getNextStatusLabel = (currentStatus) => {
    const currentIndex = columns.findIndex(c => c.id === currentStatus);
    if (currentIndex < columns.length - 1) {
      return columns[currentIndex + 1].label;
    }
    return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-12 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 border-b border-navy/10 pb-4 shrink-0">
        <h1 className="text-3xl font-bold text-navy">Maintenance Board</h1>
        <p className="text-charcoal/70 mt-1">Track and manage structural review requests.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin text-navy/50"><Clock size={32} /></div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colRequests = requests.filter(r => r.status === col.id);
            return (
              <div key={col.id} className="flex-1 min-w-[280px] bg-cream rounded-lg border border-navy/10 flex flex-col h-full shadow-sm">
                <div className={`p-4 border-b-2 font-bold text-navy flex justify-between items-center ${col.color}`}>
                  {col.label}
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-navy/20 text-navy/70">
                    {colRequests.length}
                  </span>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-beige/30">
                  {colRequests.length === 0 ? (
                    <div className="text-center p-4 text-charcoal/40 text-sm italic border border-dashed border-navy/10 rounded bg-cream/50">
                      No tasks
                    </div>
                  ) : (
                    colRequests.map(req => (
                      <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm border border-navy/10 hover:border-navy/30 transition group flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs font-bold text-navy bg-navy/5 px-2 py-1 rounded border border-navy/10">
                            {req.assetTag}
                          </span>
                          <div title={`Priority: ${req.priority}`} className={`w-3 h-3 rounded-full shadow-sm ${getPriorityColor(req.priority)}`} />
                        </div>
                        <h3 className="font-medium text-charcoal mb-1 leading-tight">{req.assetName}</h3>
                        <p className="text-sm text-charcoal/70 line-clamp-2 mb-4 flex-1">{req.issue}</p>
                        
                        <div className="flex items-center gap-1.5 text-xs text-charcoal/60 mb-4 bg-beige/50 p-2 rounded border border-navy/5">
                          <User size={14} className="text-navy/50" /> {req.requester}
                        </div>

                        {col.id !== "Resolved" && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleStatusChange(req.id, req.status)}
                              className="flex-1 flex items-center justify-between px-3 py-2 bg-navy/5 hover:bg-navy text-navy hover:text-cream text-sm font-medium rounded transition"
                            >
                              Move to {getNextStatusLabel(req.status)}
                              <ChevronRight size={16} />
                            </button>
                            {(col.id === "In Progress" || col.id === "Technician Assigned") && (
                              <button 
                                onClick={() => setUploadModal({ isOpen: true, requestId: req.id })}
                                title="Attach Repair Photo"
                                className="px-3 py-2 bg-beige text-charcoal hover:bg-beige/80 text-sm rounded transition border border-navy/10 flex items-center justify-center shrink-0"
                              >
                                <Camera size={16} />
                              </button>
                            )}
                          </div>
                        )}
                        {col.id === "Resolved" && (
                          <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-sage/10 text-sage text-sm font-medium rounded border border-sage/20">
                            <CheckCircle2 size={16} /> Completed
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Photo Upload Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 bg-navy/60 flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-cream w-full max-w-md rounded-xl shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-navy/10 bg-white">
              <h3 className="text-xl font-bold text-navy flex items-center gap-2"><Camera size={20} /> Attach Repair Photo</h3>
              <button 
                onClick={() => {
                  setUploadModal({ isOpen: false, requestId: null });
                  if (photoPreview) URL.revokeObjectURL(photoPreview);
                  setPhotoPreview(null);
                  setPhotoFile(null);
                }} 
                className="text-charcoal/50 hover:text-charcoal p-1"
              ><X size={20}/></button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="p-6">
              <div className="mb-6 border-2 border-dashed border-navy/20 rounded-lg p-6 text-center hover:bg-white transition cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoSelection} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                {photoPreview ? (
                  <div className="relative h-48 w-full rounded overflow-hidden">
                    <img src={photoPreview} alt="Upload Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-charcoal/60">
                    <Camera className="text-navy/40 mb-3 group-hover:text-navy transition" size={32} />
                    <span className="font-medium">Click or drag image here</span>
                    <span className="text-xs mt-1">JPEG, PNG up to 10MB</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setUploadModal({ isOpen: false, requestId: null })}
                  className="px-4 py-2 rounded-md font-medium text-charcoal hover:bg-navy/5 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!photoFile || isUploading}
                  className="px-6 py-2 rounded-md font-bold bg-navy text-white hover:bg-navy/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isUploading ? "Uploading..." : "Upload Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
