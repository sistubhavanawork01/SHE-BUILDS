import React, { useState, useRef, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { AlertOctagon, PhoneCall, Check, Shield } from 'lucide-react';

export const HoldToSOS = () => {
  const { t, triggerSOS, activeEmergency, cancelEmergency } = useShield();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const HOLD_DURATION = 2500; // 2.5 seconds hold required

  const startHold = (e) => {
    e.preventDefault();
    if (activeEmergency) return;

    setHolding(true);
    startTimeRef.current = Date.now();

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setProgress(pct);

      if (elapsed >= HOLD_DURATION) {
        clearInterval(timerRef.current);
        setHolding(false);
        setProgress(100);
        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200, 100, 400]);
        }
        triggerSOS();
      }
    }, 40);
  };

  const endHold = () => {
    if (progress < 100) {
      clearInterval(timerRef.current);
      setHolding(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const circumference = 2 * Math.PI * 90; // for r=90 circle
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (activeEmergency) {
    return (
      <div className="w-full bg-gradient-to-br from-red-950 via-rose-950 to-slate-900 border-2 border-red-500 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden animate-pulse">
        <div className="inline-flex p-3 bg-red-600/30 rounded-full mb-3 text-red-400">
          <AlertOctagon className="w-8 h-8 animate-spin" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-wide uppercase">
          {t.sos_active || "EMERGENCY SOS ACTIVE"}
        </h3>
        <p className="text-xs text-rose-200 mt-1">
          {t.sos_triggered || "Coordinates & Alert dispatched to Trusted Contacts, Safety Circle & 112"}
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg transition active:scale-95 text-sm"
          >
            <PhoneCall className="w-4 h-4" /> {t.call_112 || "Call 112 Emergency"}
          </a>
          <button
            onClick={cancelEmergency}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 px-6 rounded-2xl transition active:scale-95 text-sm"
          >
            I Am Safe Now (Cancel Alert)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="relative flex items-center justify-center">
        {/* SVG Progress Ring */}
        <svg className="w-56 h-56 -rotate-90 transform" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-rose-500 transition-all duration-75"
          />
        </svg>

        {/* Hold Button */}
        <button
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          className={`absolute w-44 h-44 rounded-full flex flex-col items-center justify-center text-center shadow-2xl transition-all select-none cursor-pointer ${
            holding
              ? 'bg-rose-700 scale-95 shadow-red-500/50'
              : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:from-rose-600 hover:to-red-400 animate-emergency-pulse shadow-rose-900/60'
          }`}
          style={{ touchAction: 'none' }}
        >
          <AlertOctagon className={`w-10 h-10 text-white mb-1 transition-transform ${holding ? 'scale-125' : ''}`} />
          <span className="text-white font-extrabold text-base tracking-wider uppercase">
            {holding ? `${Math.round(progress)}%` : 'HOLD SOS'}
          </span>
          <span className="text-[11px] text-rose-100/90 font-medium tracking-tight">
            {holding ? 'KEEP HOLDING' : 'HOLD FOR 2.5s'}
          </span>
        </button>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        {holding ? t.release_cancel : 'Hold for 2.5 seconds to trigger multi-channel escalation'}
      </p>
    </div>
  );
};
