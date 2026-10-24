import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { Shield, Lock, Globe, Mic, MicOff, Users, Bell } from 'lucide-react';
import { VoiceAssistant, speakText } from '../utils/speech.js';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { lang, setLang, t, setIsDecoyUnlocked, latestSSEEvent } = useShield();
  const [isListening, setIsListening] = useState(false);
  const [voiceVoiceObj, setVoiceObj] = useState(null);

  const handleVoiceCommand = (text) => {
    console.log('Voice heard:', text);
    if (text.includes('help') || text.includes('emergency') || text.includes('sos')) {
      setActiveTab('home');
      speakText('Opening Safety Home. Hold button to broadcast SOS.');
    } else if (text.includes('cab') || text.includes('ride') || text.includes('taxi')) {
      setActiveTab('cab_guard');
      speakText('Opening Cab Guard ride monitoring.');
    } else if (text.includes('haven') || text.includes('police') || text.includes('hospital') || text.includes('safe place')) {
      setActiveTab('safe_havens');
      speakText('Showing nearest safe havens.');
    } else if (text.includes('map') || text.includes('report') || text.includes('incident')) {
      setActiveTab('community_map');
      speakText('Opening Community Safety Map.');
    } else if (text.includes('evidence') || text.includes('vault') || text.includes('pack')) {
      setActiveTab('evidence_vault');
      speakText('Opening Evidence Vault.');
    } else if (text.includes('digital') || text.includes('ncii') || text.includes('photo')) {
      setActiveTab('digital_shield');
      speakText('Opening Digital Safety Shield.');
    } else {
      speakText(`Recognized command: ${text}`);
    }
  };

  const toggleMic = () => {
    if (!voiceVoiceObj) {
      const assistant = new VoiceAssistant(handleVoiceCommand);
      setVoiceObj(assistant);
      assistant.start();
      setIsListening(true);
      speakText('Voice assistant listening for safety commands.');
    } else {
      const state = voiceVoiceObj.toggle();
      setIsListening(state);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Logo & Tagline */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/40 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">SHIELD</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono font-bold">v2.0</span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Prevent • Protect • Prove • Warn
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Command Button (Web Speech API) */}
          <button
            onClick={toggleMic}
            title={isListening ? "Listening for speech..." : "Click to use Voice Commands"}
            className={`p-2 rounded-xl border transition flex items-center gap-1.5 text-xs font-medium ${
              isListening
                ? 'bg-red-600/20 border-red-500 text-red-400 animate-pulse'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4 text-rose-400 animate-bounce" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden md:inline">{isListening ? 'Listening' : 'Voice'}</span>
          </button>

          {/* Multilingual Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900 text-white">EN</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी</option>
              <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ</option>
            </select>
          </div>

          {/* Discreet Camouflage Button (Lock to Decoy Calculator) */}
          <button
            onClick={() => setIsDecoyUnlocked(false)}
            title="Discreet Camouflage: Hide app and open Decoy Calculator"
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-rose-300 border border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-medium transition"
          >
            <Lock className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Decoy Mode</span>
          </button>
        </div>
      </div>

      {/* Community Safety Circle Bar */}
      <div className="bg-slate-950/90 border-t border-slate-800/60 px-4 py-1 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-400 font-medium">NITK Surathkal Safe Circle:</span>
            <span className="text-slate-300">148 Active Verified Students & 4 Security Patrols</span>
          </div>
          <span className="hidden md:inline text-slate-500 font-mono text-[10px]">
            Live Sync: Active
          </span>
        </div>
      </div>
    </header>
  );
};
