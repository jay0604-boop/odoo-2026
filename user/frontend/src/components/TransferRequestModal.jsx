import React, { useState } from 'react';
import { X, Send, AlertCircle, RefreshCw } from 'lucide-react';

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
   TRANSFER REQUEST MODAL COMPONENT
   ========================================================================== */

export default function TransferRequestModal({ isOpen, onClose, asset, onSuccess }) {
  const [justification, setJustification] = useState('');
  const [urgency, setUrgency] = useState('Medium'); // Low, Medium, High
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (justification.trim().length < 10) {
      setErrorMsg('Please write a detailed justification (minimum 10 characters).');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        assetId: asset.id,
        assetName: asset.name,
        currentHolder: asset.owner || 'System',
        justification: justification,
        urgency: urgency,
        requestedAt: new Date().toISOString()
      };

      const res = await transferApi.submitTransfer(payload);
      if (res.success) {
        setJustification('');
        onSuccess(res.message);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit transfer request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-500/10 border border-brand-500/20 text-brand-400 p-2 rounded-lg">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Request Asset Transfer</h3>
              <p className="text-[11px] text-slate-400">Initiate ownership transfer of assigned inventory.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-450 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Selected Asset Details Box */}
        <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 mb-4 text-xs font-semibold">
          <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500">Asset Information</span>
          <div className="grid grid-cols-2 gap-2 text-slate-350">
            <div>
              <span className="block text-[9px] text-slate-500 uppercase">Asset Name</span>
              <span className="text-slate-200">{asset.name}</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 uppercase">Serial / ID</span>
              <span className="font-mono text-slate-300">{asset.serial || asset.id}</span>
            </div>
            <div className="col-span-2 pt-1 border-t border-slate-800/60 mt-1">
              <span className="block text-[9px] text-slate-500 uppercase">Current Holder</span>
              <span className="text-slate-200">{asset.owner || 'System'}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Transfer Justification
            </label>
            <textarea
              required
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why you require this asset (e.g. 'Laptop upgrade needed for development build, current model lacks sufficient RAM...')"
              className="block w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setUrgency(level)}
                  className={`py-1.5 px-2 border rounded-lg text-xs font-semibold transition-all ${
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

          <div className="border-t border-slate-800/80 pt-4 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3.5 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="py-1.5 px-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-md hover:shadow-brand-500/10 transition-all text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
