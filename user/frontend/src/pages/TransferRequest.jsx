import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

/* ==========================================================================
   BACKEND INTEGRATION LAYER (For Member 1)
   ========================================================================== */

const transferApi = {
  /**
   * Submit an asset transfer request.
   * // TODO: Member 1 - Connect your endpoint here: POST /api/v1/assets/transfer
   */
  submitTransfer: async (transferPayload) => {
    // Simulating API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('Submitting transfer payload to backend:', transferPayload);

    if (transferPayload.assetId && transferPayload.justification.length >= 10) {
      return {
        success: true,
        requestId: 'tr-' + Math.floor(Math.random() * 10000),
        message: 'Transfer request submitted successfully. Waiting for current owner approval.'
      };
    }
    throw new Error('Please provide a detailed justification (at least 10 characters).');
  }
};

/* ==========================================================================
   TRANSFER REQUEST FORM COMPONENT
   ========================================================================== */

export default function TransferRequest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Prefilled query parameters
  const assetId = searchParams.get('asset') || '';
  const assetName = searchParams.get('name') || '';
  const currentOwner = searchParams.get('owner') || '';

  // Form states
  const [selectedAssetId, setSelectedAssetId] = useState(assetId);
  const [selectedAssetName, setSelectedAssetName] = useState(assetName);
  const [currentHolder, setCurrentHolder] = useState(currentOwner);
  const [justification, setJustification] = useState('');
  const [urgency, setUrgency] = useState('Medium'); // Low, Medium, High

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // If accessed directly without params, fallback values
  useEffect(() => {
    if (!assetId) {
      // TODO: Member 1 - Fetch assigned assets or show autocomplete search here
      setSelectedAssetId('ast-102');
      setSelectedAssetName('Dell UltraSharp 32" Monitor');
      setCurrentHolder('Jane Doe');
    }
  }, [assetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);
    setIsLoading(true);

    if (justification.trim().length < 10) {
      setErrorMsg('Please write a detailed justification (minimum 10 characters).');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        assetId: selectedAssetId,
        assetName: selectedAssetName,
        currentHolder: currentHolder,
        justification: justification,
        urgency: urgency,
        requestedAt: new Date().toISOString()
      };

      const res = await transferApi.submitTransfer(payload);
      if (res.success) {
        setIsSuccess(true);
        setJustification('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit transfer request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Back button link */}
      <button 
        onClick={() => navigate('/assets')}
        className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Asset Directory</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800 pb-5">
          <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 p-2.5 rounded-lg">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Request Asset Transfer</h3>
            <p className="text-xs text-slate-400">Initiate a transfer request from another employee to you.</p>
          </div>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <div>
              <h4 className="text-sm font-bold text-slate-100">Transfer Request Dispatched</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Your request has been filed. The current holder ({currentHolder}) and IT administrators have been notified to review and approve the transfer.
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
                onClick={() => navigate('/assets')}
                className="py-2 px-4 bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white rounded-lg transition-all"
              >
                Asset Directory
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Error message */}
            {errorMsg && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Asset Details (Read-only) */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Asset Information</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">Asset Name</span>
                  <span className="text-xs font-bold text-slate-200">{selectedAssetName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">Serial / ID</span>
                  <span className="text-xs font-mono text-slate-300">{selectedAssetId}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">Current Holder</span>
                  <span className="text-xs font-bold text-slate-200">{currentHolder || 'System'}</span>
                </div>
              </div>
            </div>

            {/* Justification Text Area */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Transfer Justification
              </label>
              <textarea
                required
                rows={4}
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder="Explain why you require this asset (e.g., 'Moving to Room 5B next week, Dell monitor needed for dual setup...')"
                className="block w-full p-4 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs resize-none"
              />
            </div>

            {/* Urgency Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 px-3 border rounded-lg text-xs font-semibold transition-all ${
                      urgency === level
                        ? level === 'High'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-sm'
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

            {/* Submit Button */}
            <div className="border-t border-slate-800/80 pt-5 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="py-2.5 px-5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md hover:shadow-brand-500/10 transition-all text-xs flex items-center gap-1.5"
              >
                {isLoading ? (
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
                    <span>Submit Transfer Request</span>
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
