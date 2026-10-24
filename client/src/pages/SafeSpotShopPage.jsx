import React, { useState, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { 
  Store, 
  Radio, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  AlertCircle, 
  Volume2, 
  Sparkles,
  Coffee
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const SafeSpotShopPage = () => {
  const { latestSSEEvent } = useShield();
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 'SIG-DEMO-01',
      anonymous_token: 'USER-TOKEN-8492',
      spot_name: 'CCD Surathkal Express (Safe Spot #01)',
      status: 'assistance_requested',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  ]);

  // Listen for realtime safe spot signals
  useEffect(() => {
    if (!latestSSEEvent) return;

    if (latestSSEEvent.type === 'SAFE_SPOT_ASSISTANCE_REQUEST') {
      const signal = latestSSEEvent.data;
      setActiveRequests(prev => [signal, ...prev]);
      speakText('Attention Staff: Customer at premises has requested discreet assistance.');
    }
  }, [latestSSEEvent]);

  const handleSimulateIncomingSignal = () => {
    const token = `USER-TOKEN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq = {
      id: `SIG-${Date.now()}`,
      anonymous_token: token,
      spot_name: 'CCD Surathkal Express (Safe Spot #01)',
      status: 'assistance_requested',
      created_at: new Date().toISOString()
    };
    setActiveRequests(prev => [newReq, ...prev]);
    speakText('Customer assistance requested. Token generated.');
  };

  const handleResolveSignal = (id) => {
    setActiveRequests(prev => prev.filter(r => r.id !== id));
    speakText('Assistance completed.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Section 7.21 & Demo Scene 10 • Partner Safe Spot Terminal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-400" />
            Safe Spot Shopkeeper Front Desk Dashboard
          </h2>
          <p className="text-xs text-slate-300">
            Location: <strong className="text-white">Cafe Coffee Day Express • NH-66 Commercial Edge, Surathkal</strong>
          </p>
        </div>

        <button
          onClick={handleSimulateIncomingSignal}
          className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-bold shadow-md shadow-amber-950"
        >
          <Radio className="w-3.5 h-3.5 animate-ping" />
          <span>Simulate Incoming Signal</span>
        </button>
      </div>

      {/* Zero Leakage Safeguard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-white">Zero Personal Data Exposure Protocol:</strong> Shop employees receive only an ephemeral token and an assistance notification. No names, contact numbers, or photos are ever displayed. Staff follow standard safety protocol: invite customer to safe staff seating area or quietly contact Surathkal Police outpost.
        </div>
      </div>

      {/* Active Assistance Requests List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Active Assistance Signals ({activeRequests.length})</span>
          <span className="text-[10px] text-amber-400 font-mono">Realtime Receiver: Active</span>
        </h3>

        {activeRequests.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No active emergency signals. All past requests resolved.
          </div>
        ) : (
          activeRequests.map(req => (
            <div
              key={req.id}
              className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl space-y-4 animate-emergency-pulse"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500 flex items-center justify-center shrink-0">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        Discreet Assistance Requested
                      </span>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {req.anonymous_token}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">
                      A woman in your store or immediate entrance tapped the Safe Spot silent signal.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleResolveSignal(req.id)}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                  >
                    Mark Assisted / Safe
                  </button>
                  <a
                    href="tel:112"
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition shadow"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Call 112
                  </a>
                </div>
              </div>

              {/* Standard Protocol Checklist for Staff */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1 text-slate-300">
                <span className="font-bold text-amber-300 text-[11px] block mb-1">Recommended Staff Protocol:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    1. Calmly approach entrance or counter area.
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    2. Offer seating near bright staff counter.
                  </div>
                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                    3. Call Surathkal police outpost if suspicious loiterers seen.
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
