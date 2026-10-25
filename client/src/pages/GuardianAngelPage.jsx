import React, { useEffect, useRef, useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { Headphones, Mic, MicOff, Navigation, ShieldAlert, Volume2, Wifi } from 'lucide-react';
import { VoiceAssistant, speakText } from '../utils/speech.js';

const DEFAULT_CODEWORD = 'did you call uncle ramesh';

export const GuardianAngelPage = () => {
  const { user, triggerSOS } = useShield();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [codeword, setCodeword] = useState(DEFAULT_CODEWORD);
  const [lastGuidance, setLastGuidance] = useState('');
  const [triggered, setTriggered] = useState(false);
  const assistantRef = useRef(null);
  const triggerTimeoutRef = useRef(null);

  const giveGuidance = (message) => {
    setLastGuidance(message);
    speakText(message);
  };

  const handleVoiceInput = (text) => {
    const normalizedText = text.trim().toLowerCase();
    const normalizedCodeword = codeword.trim().toLowerCase();
    if (normalizedCodeword && normalizedText.includes(normalizedCodeword)) {
      setTriggered(true);
      triggerSOS();
      speakText('Your silent codeword was recognized. SHIELD has sent an emergency alert.');
      triggerTimeoutRef.current = setTimeout(() => setTriggered(false), 5000);
    }
  };

  const toggleListening = () => {
    if (!assistantRef.current) {
      const assistant = new VoiceAssistant(handleVoiceInput);
      assistantRef.current = assistant;
      assistant.start();
      setIsListening(Boolean(assistant.recognition));
      if (!assistant.recognition) {
        giveGuidance('Voice listening is not supported in this browser. You can still use Guardian Angel audio guidance.');
      }
      return;
    }

    setIsListening(assistantRef.current.toggle());
  };

  const toggleMode = () => {
    const nextActive = !isActive;
    setIsActive(nextActive);
    if (nextActive) {
      giveGuidance(`I'm keeping watch with you, ${user?.name?.split(' ')[0] || 'friend'}. The road ahead is well-lit for the next 200 meters; take the right turn past the pharmacy.`);
    } else {
      setLastGuidance('');
      speakText('Guardian Angel mode paused.');
    }
  };

  useEffect(() => () => {
    assistantRef.current?.stop();
    clearTimeout(triggerTimeoutRef.current);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-0.5 rounded-full">
          Idea 4 • Audio Safety Companion
        </span>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <Headphones className="w-6 h-6 text-sky-400" />
          Guardian Angel Earbud Mode
        </h2>
        <p className="text-xs text-slate-300">
          Quiet, hands-free route reassurance with an optional innocent-sounding codeword for silent SOS escalation.
        </p>
      </div>

      <div className={`rounded-3xl border-2 p-6 shadow-xl transition ${isActive ? 'bg-sky-950/40 border-sky-500' : 'bg-slate-900 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Earbud companion connection</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> Bluetooth audio route available
              </p>
            </div>
          </div>
          <button
            onClick={toggleMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${isActive ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
          >
            {isActive ? 'Pause Guardian Angel' : 'Start Guardian Angel'}
          </button>
        </div>

        {isActive && (
          <div className="mt-5 bg-slate-950 border border-sky-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-2 text-xs text-sky-100">
              <Volume2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{lastGuidance || 'Audio guidance is ready. Route updates will be spoken privately through your earbuds.'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="bg-slate-900 rounded-xl p-2.5 text-slate-300"><strong className="text-emerald-400 block">96% lit</strong>Next corridor safety score</div>
              <div className="bg-slate-900 rounded-xl p-2.5 text-slate-300"><strong className="text-amber-300 block">200 m</strong>Guidance horizon</div>
              <div className="bg-slate-900 rounded-xl p-2.5 text-slate-300"><strong className="text-cyan-300 block">Pharmacy</strong>Next verified safe spot</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="font-bold text-white text-sm">Silent codeword listening</h3>
            <p className="text-[11px] text-slate-400">Say the phrase naturally; never say “SOS” or “emergency”.</p>
          </div>
        </div>

        <label className="block text-xs text-slate-300">
          Your private codeword phrase
          <input
            value={codeword}
            onChange={(event) => setCodeword(event.target.value)}
            className="mt-1.5 w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-sky-500"
            aria-label="Private Guardian Angel codeword"
          />
        </label>

        <button
          onClick={toggleListening}
          className={`w-full py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${isListening ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          {isListening ? 'Stop codeword listening' : 'Enable codeword listening'}
        </button>

        {triggered && (
          <div className="bg-red-950/80 border border-red-500 rounded-xl p-3 text-xs text-red-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            Silent SOS dispatched to trusted contacts and Police 112.
          </div>
        )}
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <Navigation className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>Audio guidance is a convenience layer, not a replacement for emergency services. In immediate danger, call 112 when it is safe to do so.</span>
      </div>
    </div>
  );
};
