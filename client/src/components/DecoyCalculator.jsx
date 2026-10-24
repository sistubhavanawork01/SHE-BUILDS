import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { ShieldAlert, Lock, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export const DecoyCalculator = () => {
  const { testPin, setIsDecoyUnlocked } = useShield();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [pinBuffer, setPinBuffer] = useState('');
  const [showDemoGuide, setShowDemoGuide] = useState(true);
  const [duressNotice, setDuressNotice] = useState(false);

  const handleDigit = (digit) => {
    // Append to calculator display
    if (display === '0') {
      setDisplay(String(digit));
    } else {
      setDisplay(prev => prev + digit);
    }

    // Accumulate digits into secret PIN buffer
    const nextBuffer = (pinBuffer + digit).slice(-4);
    setPinBuffer(nextBuffer);

    // If 4 digits entered, evaluate PIN
    if (nextBuffer.length === 4) {
      testPin(nextBuffer).then(res => {
        if (res.mode === 'NORMAL_SHIELD') {
          // Unlocks SHIELD interface
        } else if (res.mode === 'DURESS_TRIGGERED') {
          // Duress PIN entered: Pretend it's just a normal calculation reset!
          setDuressNotice(true);
          setTimeout(() => setDuressNotice(false), 4000);
          setDisplay('0');
          setEquation('');
          setPinBuffer('');
        }
      });
    }
  };

  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
    setPinBuffer('');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPinBuffer('');
  };

  const handleEquals = () => {
    try {
      if (!equation) return;
      const fullExpr = equation + display;
      // Safe sanitized arithmetic evaluation
      const sanitized = fullExpr.replace(/[^0-9+\-*/.]/g, '');
      // eslint-disable-next-line no-eval
      const result = Function(`'use strict'; return (${sanitized})`)();
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
    setPinBuffer('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      {/* Demo Guide Box for Hackathon Judges */}
      {showDemoGuide && (
        <div className="w-full max-w-sm mb-4 bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Section 7.18 Decoy & Duress PIN Demo
            </span>
            <button 
              onClick={() => setShowDemoGuide(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            In an unsafe or coercive situation, this appears as an ordinary calculator.
          </p>
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-mono font-semibold block">PIN: 1234</span>
              <span className="text-slate-400 text-[11px]">Normal PIN: Unlocks SHIELD</span>
            </div>
            <div className="bg-slate-950/70 p-2 rounded-lg border border-rose-900/40">
              <span className="text-rose-400 font-mono font-semibold block">PIN: 9999</span>
              <span className="text-slate-400 text-[11px]">Duress PIN: Silent alarm + stays decoy</span>
            </div>
          </div>
        </div>
      )}

      {/* Secret duress indication (for demo reassurance only) */}
      {duressNotice && (
        <div className="w-full max-w-sm mb-3 bg-red-950/80 border border-red-500/50 rounded-lg p-2.5 text-xs text-red-200 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span><strong>Duress Activated:</strong> Silent alert broadcast to contacts with location. Screen remains as calculator.</span>
        </div>
      )}

      {/* Calculator Hardware Shell */}
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl">
        {/* LCD Display */}
        <div className="bg-slate-950 rounded-2xl p-4 mb-4 text-right border border-slate-800/80 shadow-inner">
          <div className="text-slate-500 text-xs h-4 font-mono">{equation}</div>
          <div className="text-white text-3xl font-mono tracking-tight font-medium overflow-hidden text-ellipsis">
            {display}
          </div>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5 font-medium">
          <button onClick={handleClear} className="bg-slate-800 hover:bg-slate-700 text-rose-400 p-4 rounded-2xl text-lg font-semibold active:scale-95 transition">
            AC
          </button>
          <button onClick={() => setDisplay(String(-parseFloat(display) || 0))} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-2xl text-lg active:scale-95 transition">
            +/-
          </button>
          <button onClick={() => setDisplay(String((parseFloat(display) || 0) / 100))} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-4 rounded-2xl text-lg active:scale-95 transition">
            %
          </button>
          <button onClick={() => handleOperator('/')} className="bg-amber-600/80 hover:bg-amber-500 text-white p-4 rounded-2xl text-xl font-bold active:scale-95 transition">
            ÷
          </button>

          <button onClick={() => handleDigit(7)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">7</button>
          <button onClick={() => handleDigit(8)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">8</button>
          <button onClick={() => handleDigit(9)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">9</button>
          <button onClick={() => handleOperator('*')} className="bg-amber-600/80 hover:bg-amber-500 text-white p-4 rounded-2xl text-xl font-bold active:scale-95 transition">×</button>

          <button onClick={() => handleDigit(4)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">4</button>
          <button onClick={() => handleDigit(5)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">5</button>
          <button onClick={() => handleDigit(6)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">6</button>
          <button onClick={() => handleOperator('-')} className="bg-amber-600/80 hover:bg-amber-500 text-white p-4 rounded-2xl text-xl font-bold active:scale-95 transition">−</button>

          <button onClick={() => handleDigit(1)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">1</button>
          <button onClick={() => handleDigit(2)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">2</button>
          <button onClick={() => handleDigit(3)} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">3</button>
          <button onClick={() => handleOperator('+')} className="bg-amber-600/80 hover:bg-amber-500 text-white p-4 rounded-2xl text-xl font-bold active:scale-95 transition">+</button>

          <button onClick={() => handleDigit(0)} className="col-span-2 bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl text-left pl-6 active:scale-95 transition">
            0
          </button>
          <button onClick={() => { if (!display.includes('.')) setDisplay(display + '.'); }} className="bg-slate-800/90 hover:bg-slate-700 text-white p-4 rounded-2xl text-xl active:scale-95 transition">
            .
          </button>
          <button onClick={handleEquals} className="bg-rose-600 hover:bg-rose-500 text-white p-4 rounded-2xl text-xl font-bold active:scale-95 transition">
            =
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => setIsDecoyUnlocked(true)}
          className="text-xs text-slate-500 hover:text-slate-400 flex items-center gap-1.5 mx-auto"
        >
          <Lock className="w-3.5 h-3.5" /> Skip Decoy & Open Safety Dashboard
        </button>
      </div>
    </div>
  );
};

