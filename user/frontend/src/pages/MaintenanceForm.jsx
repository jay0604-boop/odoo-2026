import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Wrench, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const maintenanceApi = {
  /**
   * Fetch assets assigned to the user to prefill the selection dropdown.
   * // TODO: Member 1 - Connect your endpoint here: GET /api/v1/assets/assigned
   */
  fetchAssignedAssets: async () => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 400));
    return [
      { id: 'as-1', name: 'Apple MacBook Pro 16"', serial: 'C02F84HCMD6M' },
      { id: 'as-2', name: 'Dell 27" 4K Monitor', serial: 'CN-0M482X-7444' },
      { id: 'as-3', name: 'Ergonomic Mesh Chair', serial: 'CH-ERG-88910' },
    ];
  },

  /**
   * Submit maintenance ticket.
   * // TODO: Member 1 - Connect your endpoint here: POST /api/v1/audits/maintenance
   */
  createTicket: async (ticketPayload) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('Sending maintenance ticket payload to backend:', ticketPayload);

    if (ticketPayload.assetId && ticketPayload.description.length >= 10) {
      return {
        success: true,
        ticketId: 'tkt-' + Math.floor(Math.random() * 10000),
        message: 'Maintenance ticket created successfully. A technician has been assigned.'
      };
    }
    throw new Error('Please provide a detailed description (at least 10 characters).');
  }
};

/* ==========================================================================
   MAINTENANCE FORM COMPONENT
   ========================================================================== */

export default function MaintenanceForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Prefilled query parameters
  const preselectedAssetId = searchParams.get('asset') || '';

  // Form states
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(preselectedAssetId);
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('Medium'); // Low, Medium, High, Critical
  
  // Status states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Load user's assigned assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        const data = await maintenanceApi.fetchAssignedAssets();
        setAssets(data);
        if (!selectedAssetId && data.length > 0) {
          setSelectedAssetId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load assigned assets:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);
    setIsSubmitting(true);

    if (!selectedAssetId) {
      setErrorMsg('Please select an asset to report.');
      setIsSubmitting(false);
      return;
    }

    if (description.trim().length < 10) {
      setErrorMsg('Please write a detailed description of the issue (minimum 10 characters).');
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedAsset = assets.find(a => a.id === selectedAssetId);
      const payload = {
        assetId: selectedAssetId,
        assetName: selectedAsset ? selectedAsset.name : 'Unknown Asset',
        description: description,
        urgency: urgency,
        submittedAt: new Date().toISOString()
      };

      const res = await maintenanceApi.createTicket(payload);
      if (res.success) {
        setIsSuccess(true);
        setDescription('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit maintenance ticket.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Back link */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
        
        {/* Form Header */}
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-5">
          <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 p-2.5 rounded-lg">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Report Broken Asset</h3>
            <p className="text-xs text-slate-400">File a repair or maintenance ticket for your assigned hardware/furniture.</p>
          </div>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-slate-100">Ticket Filed Successfully</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Your maintenance ticket has been registered. The IT Support team has been dispatched, and you will receive progress notifications.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button 
                onClick={() => navigate('/dashboard')}
                className="py-2 px-4 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 rounded-lg transition-all"
              >
                Go to Dashboard
              </button>
              <button 
                onClick={() => setIsSuccess(false)}
                className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white rounded-lg transition-all"
              >
                File Another Ticket
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error alerts */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Asset Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Damaged Asset
              </label>
              {isLoading ? (
                <div className="h-10 bg-slate-950 border border-slate-850 rounded-lg animate-pulse" />
              ) : (
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-xs"
                >
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.name} ({asset.serial})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Issue Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Describe the Issue
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what is broken, when it started, and symptoms (e.g. 'Laptop screen flickers aggressively and displays pink vertical stripes. Started this morning after sleep state...')"
                className="block w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs resize-none"
              />
            </div>

            {/* Urgency selectors */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Urgency level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold transition-all ${
                      urgency === level
                        ? level === 'Critical'
                          ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-sm'
                          : level === 'High'
                          ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 shadow-sm'
                          : level === 'Medium'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
                          : 'bg-brand-500/10 border-brand-500/30 text-brand-400 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Form footer actions */}
            <div className="border-t border-slate-800/80 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="py-2.5 px-5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md hover:shadow-brand-500/10 transition-all text-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Create Ticket</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}
      </div>

    </div>
  );
}
