import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { HoldToSOS } from '../components/HoldToSOS.jsx';
import { 
  Car, 
  ShieldCheck, 
  Map, 
  FileText, 
  Lock, 
  Smartphone, 
  Eye, 
  Clock, 
  PhoneCall, 
  Users, 
  ExternalLink,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  Radio,
  UserCheck,
  Navigation
  ,Headphones
} from 'lucide-react';

export const SafetyHomePage = ({ setActiveTab }) => {
  const { t, setFakeCallOpen, patterns, safeJourney, setSafeJourney, safetyCircle } = useShield();
  const [journeyDest, setJourneyDest] = useState('Central Metro Transit Hub');
  const [journeyMins, setJourneyMins] = useState(20);

  const confirmArrival = () => {
    setSafeJourney(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Universal Before / During / After Innovation Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                {t.before_during_after}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" /> {t.all_women_empowered}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1.5">
              {t.tagline}
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5 leading-relaxed">
              {t.subtagline}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('contact_view')}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-medium"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{t.contact_companion}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emerging Pattern Warning Alert (FR-10) */}
      {patterns.length > 0 && (
        <div 
          onClick={() => setActiveTab('community_map')}
          className="bg-amber-950/50 border border-amber-500/40 hover:border-amber-400 rounded-2xl p-4 cursor-pointer transition shadow-lg flex items-start gap-3.5 group"
        >
          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 mt-0.5 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {patterns[0].concern_level.replace('_', ' ')}
              </span>
              <span className="text-xs text-amber-300/80 group-hover:translate-x-1 transition flex items-center gap-1">
                {t.safety_map} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-0.5">{patterns[0].title}</h4>
            <p className="text-xs text-amber-200/90 mt-1">
              {patterns[0].area_name} • {patterns[0].recommendation}
            </p>
          </div>
        </div>
      )}

      {/* P0 Headline: Hold To SOS */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-sm text-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
          {t.hold_sos}
        </h3>
        <HoldToSOS />
      </div>

      {/* Safe Journey Status Bar if active */}
      {safeJourney && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {t.safe_journey}
              </span>
              <p className="text-xs text-slate-200">Destination: {safeJourney.destination}</p>
            </div>
          </div>
          <button
            onClick={confirmArrival}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
          >
            I Have Arrived Safely
          </button>
        </div>
      )}

      {/* Feature Grid: Before, During, After */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
          <span>{t.tagline}</span>
          <span className="text-[11px] text-rose-400 font-semibold">{safetyCircle.name}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          
          {/* Cab Guard */}
          <div 
            onClick={() => setActiveTab('cab_guard')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                During • P1-A
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-cyan-400 transition">
              {t.cab_guard}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              License plate OCR, 300m safety corridor monitor, offline replay simulator & auto-escalation.
            </p>
          </div>

          {/* Safe Havens & Spots */}
          <div 
            onClick={() => setActiveTab('safe_havens')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                Before • P1-B
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition">
              {t.safe_havens}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Nearest 24x7 police, hospitals & verified partner shops with anonymous QR silent signals.
            </p>
          </div>

          {/* Time-Aware Community Map */}
          <div 
            onClick={() => setActiveTab('community_map')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                <Map className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                Before • P0/P1-B
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
              {t.safety_map}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Privacy-filtered area concerns, hour slider (morning, evening, night) & pattern clusters.
            </p>
          </div>

          {/* Court-Ready Evidence Pack */}
          <div 
            onClick={() => setActiveTab('evidence_vault')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
                After • P1-A
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition">
              {t.evidence_vault}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              SHA-256 hash chaining, Section 63 BSA 2023 certificate info & AI legal complaint draft.
            </p>
          </div>

          {/* NCII & Digital Safety Shield */}
          <div 
            onClick={() => setActiveTab('digital_shield')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                Digital • P1-B
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition">
              {t.digital_shield}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              On-device perceptual dHash (zero image upload), breach checker & fake profile kit.
            </p>
          </div>

          {/* AI Fake Call */}
          <div 
            onClick={() => setFakeCallOpen(true)}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <PhoneCall className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                Discreet • P2
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition">
              {t.fake_call}
            </h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Realistic incoming call with synthesizer ringtone & voice dialogue to exit safely.
            </p>
          </div>

          {/* Safe Routing */}
          <div
            onClick={() => setActiveTab('safe_routing')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                <Navigation className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                Before • P1
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-amber-400 transition">{t.safe_routing}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Choose a brighter, populated route and report broken streetlights with ambient lux evidence.
            </p>
          </div>

          {/* Bio-Telemetry & WhisperMesh */}
          <div
            onClick={() => setActiveTab('bio_telemetry')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">
                During • P0
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-rose-400 transition">{t.bio_telemetry}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Smartwatch distress triggers, in-pocket gestures, and offline BLE relay when cellular service fails.
            </p>
          </div>

          {/* Tracker Hunter */}
          <div
            onClick={() => setActiveTab('tracker_hunter')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                <Radio className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                Digital • P1
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-purple-400 transition">{t.tracker_hunter}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Detect persistent AirTag, Tile, and SmartTag beacons across multiple travel waypoints.
            </p>
          </div>

          {/* Guardian Angel Earbud Companion */}
          <div
            onClick={() => setActiveTab('guardian_angel')}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-4.5 cursor-pointer transition shadow-lg group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full">
                During • P1
              </span>
            </div>
            <h4 className="font-bold text-white text-sm group-hover:text-sky-400 transition">Guardian Angel Earbud Mode</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Private route guidance and an optional natural-sounding spoken codeword for silent SOS.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Navigation Portal Links */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-2 text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-2">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Quick Access Portals:
        </span>
        <button
          onClick={() => setActiveTab('report')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          + {t.report_incident}
        </button>
        <button
          onClick={() => setActiveTab('verify_evidence')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          🔍 {t.verify_evidence}
        </button>
        <button
          onClick={() => setActiveTab('account_profile')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          ⚙️ {t.account_profile}
        </button>
        <button
          onClick={() => setActiveTab('institution_dashboard')}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          🏛️ {t.moderator_dash}
        </button>
      </div>

    </div>
  );
};
