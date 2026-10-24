import React, { useState, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { MapComponent } from '../components/MapComponent.jsx';
import { demoCabRoute } from '../utils/demoRouteData.js';
import { 
  Radio, 
  ShieldAlert, 
  Car, 
  PhoneCall, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  ExternalLink,
  Users,
  Bell
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const TrustedContactLivePage = () => {
  const { latestSSEEvent } = useShield();

  // Contact Persona
  const contactName = "Aaditi Sharma (Sister / Lead Contact)";
  const protectedUserName = "Priya S.";

  // Alert State
  const [activeAlert, setActiveAlert] = useState({
    type: 'CAB_GUARD_ACTIVE',
    severity: 'ELEVATED',
    message: 'Priya S. started monitored ride in Swift Dzire (KA 19 MD 4829). Live link shared.',
    timestamp: new Date().toLocaleTimeString(),
    plate: 'KA 19 MD 4829',
    driver: 'Ramesh K.',
    corridor_m: 300
  });

  const [currentGPS, setCurrentGPS] = useState(demoCabRoute.start);
  const [distanceM, setDistanceM] = useState(0);
  const [isDeviated, setIsDeviated] = useState(false);

  // Process incoming SSE events from Primary Device
  useEffect(() => {
    if (!latestSSEEvent) return;

    if (latestSSEEvent.type === 'EMERGENCY_ALERT') {
      const data = latestSSEEvent.data;
      setActiveAlert({
        type: data.type || 'CRITICAL_EMERGENCY',
        severity: 'CRITICAL',
        message: data.message || `URGENT ALERT from ${data.user_name || protectedUserName}: Safety escalation triggered!`,
        timestamp: new Date().toLocaleTimeString(),
        plate: data.plate || 'KA 19 MD 4829',
        driver: data.driver || 'Ramesh K.',
        location: data.location
      });

      if (data.location) {
        setCurrentGPS(data.location);
      }

      speakText('Attention Aaditi: Emergency safety alert received from Priya.');
    } else if (latestSSEEvent.type === 'RIDE_GPS_UPDATE') {
      const data = latestSSEEvent.data;
      setCurrentGPS({ lat: data.lat, lng: data.lng });
      setDistanceM(data.distance_from_corridor_m || 0);
      setIsDeviated(data.is_deviated);

      if (data.is_deviated) {
        setActiveAlert(prev => ({
          ...prev,
          type: 'CORRIDOR_BREACH',
          severity: 'CRITICAL',
          message: `CORRIDOR BREACH: Cab diverted ${data.distance_from_corridor_m}m away from authorized route!`
        }));
      }
    }
  }, [latestSSEEvent]);

  // Demo shortcut triggers for live evaluator presentation
  const simulateReceiveDuressAlert = () => {
    setActiveAlert({
      type: 'SILENT_DURESS_ALARM',
      severity: 'CRITICAL_SILENT',
      message: 'SILENT DURESS TRIGGERED: Priya entered emergency duress PIN in disguised calculator. Immediate assistance requested without alarming aggressor!',
      timestamp: new Date().toLocaleTimeString(),
      location: { lat: 13.0108, lng: 74.7938, name: 'NITK Campus Gate' }
    });
    speakText('Silent duress emergency alert received on contact device.');
  };

  const simulateReceiveDeviationAlert = () => {
    setIsDeviated(true);
    setDistanceM(620);
    setCurrentGPS({ lat: 12.9970, lng: 74.7810 });
    setActiveAlert({
      type: 'CAB_GUARD_DEVIATION_ALERT',
      severity: 'CRITICAL',
      message: 'CAB GUARD ALERT: Cab KA 19 MD 4829 breached 300m safety corridor. User response prompt timed out!',
      timestamp: new Date().toLocaleTimeString(),
      plate: 'KA 19 MD 4829',
      driver: 'Ramesh K.'
    });
    speakText('Critical: Route deviation escalation received on contact device.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Demo Scene 5 & 6 • Second-Device Live Link
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            Trusted Contact Companion Portal (Device #2 View)
          </h2>
          <p className="text-xs text-slate-300">
            Logged in as: <strong className="text-white">{contactName}</strong> • Monitoring safety status of: <strong className="text-rose-400">{protectedUserName}</strong>
          </p>
        </div>

        {/* Quick Demo Simulator Buttons for Judges */}
        <div className="flex gap-2">
          <button
            onClick={simulateReceiveDeviationAlert}
            className="text-[11px] bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-500/40 px-2.5 py-1.5 rounded-lg font-bold transition"
          >
            Trigger Deviation Alert
          </button>
          <button
            onClick={simulateReceiveDuressAlert}
            className="text-[11px] bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-500/40 px-2.5 py-1.5 rounded-lg font-bold transition"
          >
            Trigger Duress Alert
          </button>
        </div>
      </div>

      {/* Emergency Flash Card */}
      {activeAlert && (
        <div className={`p-5 rounded-3xl border-2 shadow-2xl transition-all ${
          activeAlert.severity === 'CRITICAL' || activeAlert.severity === 'CRITICAL_SILENT'
            ? 'bg-red-950/90 border-red-500 text-white animate-emergency-pulse'
            : 'bg-slate-900 border-slate-700 text-slate-100'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                    {activeAlert.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                    {activeAlert.timestamp}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{activeAlert.message}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="tel:112"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition"
              >
                <PhoneCall className="w-4 h-4" /> Call 112 (Police)
              </a>
              <a
                href="tel:+919876543210"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Call {protectedUserName}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cab & Location Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cab Info Card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-800 pb-2">
              Vehicle & Ride Session
            </span>

            <div>
              <span className="text-[10px] text-slate-400 block">Number Plate:</span>
              <span className="font-mono text-base font-bold text-white bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 block mt-0.5">
                {activeAlert.plate || 'KA 19 MD 4829'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Driver:</span>
                <span className="text-white font-semibold">{activeAlert.driver || 'Ramesh K.'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Model:</span>
                <span className="text-white font-semibold">Swift Dzire</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-400 text-[11px] block">Corridor Safety Status:</span>
              <span className={`text-xs font-bold block mt-0.5 ${isDeviated ? 'text-red-400' : 'text-emerald-400'}`}>
                {isDeviated ? `BREACH DETECTED (${distanceM}m off-corridor)` : `Safe on Corridor (${distanceM}m)`}
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <strong className="text-slate-200 block">Realtime SSE Integration:</strong>
            <p>
              When Priya enters her duress PIN in the disguised calculator or when the cab diverts off-route, this companion portal wakes up instantly without polling.
            </p>
          </div>
        </div>

        {/* Live GPS Map */}
        <div className="lg:col-span-2">
          <div className="h-[440px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <MapComponent
              center={[currentGPS.lat, currentGPS.lng]}
              zoom={13}
              cabRoute={{
                polyline: demoCabRoute.polyline,
                plate: activeAlert.plate
              }}
              currentCabPos={{
                lat: currentGPS.lat,
                lng: currentGPS.lng,
                distance_m: distanceM,
                is_deviated: isDeviated
              }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

