import React, { useState, useEffect, useRef } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { 
  Heart, 
  Activity, 
  Watch, 
  Radio, 
  WifiOff, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Sparkles,
  Zap
} from 'lucide-react';
import { speakText } from '../utils/speech.js';
import { getNativeCapabilities, relayNativeBlePacket, startNativeTelemetry } from '../utils/nativeBridge.js';

export const BioTelemetryPage = () => {
  const { triggerSOS } = useShield();

  // Smartwatch state
  const [isWatchConnected, setIsWatchConnected] = useState(true);
  const [nativeStatus, setNativeStatus] = useState('Browser simulation');
  const [heartRate, setHeartRate] = useState(74);
  const [isSpikeDetected, setIsSpikeDetected] = useState(false);
  const [spikeCountdown, setSpikeCountdown] = useState(10);
  const countdownTimerRef = useRef(null);

  // WhisperMesh state
  const [cellularBars, setCellularBars] = useState(0); // 0 bars = offline
  const [meshActive, setMeshActive] = useState(true);
  const [meshHopStep, setMeshHopStep] = useState(0);
  const [isHopping, setIsHopping] = useState(false);

  // In-pocket motion gesture
  const [knockCount, setKnockCount] = useState(0);
  const [knockTriggered, setKnockTriggered] = useState(false);
  const meshTimeoutsRef = useRef([]);

  useEffect(() => {
    const capabilities = getNativeCapabilities();
    if (!capabilities.smartwatch) return;
    setNativeStatus('Android smartwatch bridge connected');
    startNativeTelemetry({ heart_rate: true, disconnect_alert: true })
      .then((result) => {
        if (result.status === 'CONNECTED') setIsWatchConnected(true);
      })
      .catch((error) => setNativeStatus(`Native telemetry error: ${error.message}`));
  }, []);

  // Simulate normal heart rate fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSpikeDetected) {
        setHeartRate(prev => Math.floor(72 + Math.random() * 6));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isSpikeDetected]);

  useEffect(() => () => {
    clearInterval(countdownTimerRef.current);
    meshTimeoutsRef.current.forEach(clearTimeout);
  }, []);

  // Simulate Sudden Heart Rate Spike (Physical Ambush)
  const handleSimulateHeartSpike = () => {
    if (isSpikeDetected) return;
    setIsSpikeDetected(true);
    setHeartRate(164);
    setSpikeCountdown(10);
    speakText('Bio-telemetry alert: Sudden heart rate surge to 164 BPM detected. Starting 10 second safety countdown.');

    let count = 10;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      setSpikeCountdown(count);
      if (count <= 0) {
        clearInterval(countdownTimerRef.current);
        triggerSOS();
        speakText('Bio-telemetry distress confirmed. Dispatched emergency alert to contacts and police.');
      }
    }, 1000);
  };

  const handleCancelSpike = () => {
    setIsSpikeDetected(false);
    setHeartRate(75);
    clearInterval(countdownTimerRef.current);
    speakText('Bio-telemetry alarm canceled by user.');
  };

  // Simulate Watch Forced Disconnect / Yank (Dead-Woman's Switch)
  const handleSimulateWatchYank = () => {
    setIsWatchConnected(false);
    triggerSOS();
    speakText('Critical: Smartwatch forcibly disconnected from wrist! Dead-woman switch activated. Emergency alert dispatched.');
  };

  // Simulate In-Pocket 3-Tap Knock Gesture
  const handleSimulateKnock = () => {
    const next = knockCount + 1;
    setKnockCount(next);
    if (next >= 3) {
      setKnockTriggered(true);
      triggerSOS();
      speakText('In-pocket gesture recognized: Triple knock. Silent duress beacon dispatched.');
      setTimeout(() => {
        setKnockCount(0);
        setKnockTriggered(false);
      }, 4000);
    }
  };

  // Simulate WhisperMesh Offline BLE Packet Relay
  const handleSimulateMeshRelay = () => {
    meshTimeoutsRef.current.forEach(clearTimeout);
    setIsHopping(true);
    setMeshHopStep(1);
    speakText('Zero cellular coverage. Initiating WhisperMesh Bluetooth Low Energy packet relay.');
    relayNativeBlePacket({
      alert_type: 'distress',
      timestamp: new Date().toISOString(),
      last_gps: { lat: 13.0108, lng: 74.7938 }
    }).then((result) => {
      if (result.status === 'RELAYED') speakText('Native BLE mesh relay acknowledged by the Android bridge.');
    }).catch((error) => console.warn('Native BLE relay unavailable:', error));

    meshTimeoutsRef.current = [
      setTimeout(() => setMeshHopStep(2), 1200),
      setTimeout(() => setMeshHopStep(3), 2400),
      setTimeout(() => {
        setMeshHopStep(4);
        setIsHopping(false);
        speakText('WhisperMesh packet successfully routed through peer node to Police 112 gateway.');
      }, 3600)
    ];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
            Idea 1 & 2 • Wearable Biometrics & Offline WhisperMesh
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-400" />
          Smartwatch Dead-Woman's Switch & WhisperMesh Network
        </h2>
        <p className="text-xs text-slate-300">
          Protection when your hands are pinned, your phone is snatched, or cellular connectivity drops to zero.
        </p>
      </div>

      {/* Section 1: Smartwatch Bio-Telemetry & Sudden Spike Detection */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Paired Smartwatch (Web Bluetooth API)</span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {isWatchConnected ? `● ${nativeStatus}` : '○ DISCONNECTED'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateHeartSpike}
              className="text-xs bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 font-bold px-3 py-2 rounded-xl transition"
            >
              Simulate Sudden Heart Spike (164 BPM)
            </button>
            <button
              onClick={handleSimulateWatchYank}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 px-3 py-2 rounded-xl transition font-semibold"
            >
              Simulate Forced Watch Yank
            </button>
          </div>
        </div>

        {/* Heart Rate Display & Spike Warning Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center">
            <Heart className={`w-8 h-8 mb-1 ${isSpikeDetected ? 'text-red-500 animate-ping' : 'text-rose-400 animate-pulse'}`} />
            <span className="text-3xl font-extrabold text-white font-mono">{heartRate} BPM</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Live Pulse Metric</span>
          </div>

          <div className="sm:col-span-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-white block mb-0.5">Bio-Telemetry Distress Threshold:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                If the user’s heart rate spikes past 150 BPM while in transit at night without physical exercise, a 10-second silent confirmation prompt fires before auto-escalating.
              </p>
            </div>

            {isSpikeDetected && (
              <div className="mt-3 bg-red-950/80 border border-red-500 rounded-xl p-3 flex items-center justify-between text-xs text-red-200 animate-pulse">
                <div>
                  <strong>SURGE DETECTED: Auto-Alerting in {spikeCountdown}s!</strong>
                  <span className="block text-[10px]">Unanswered countdown dispatches live GPS to 112.</span>
                </div>
                <button
                  onClick={handleCancelSpike}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  I'm Okay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: In-Pocket "Knock & Squeeze" Gestures */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-rose-400" />
            In-Pocket Accelerometer & Rhythm Gesture Trigger
          </span>
          <span className="text-[10px] text-slate-400 font-mono">No Screen Required</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tap a 3-knock rhythm on the phone while it rests inside your jacket pocket or handbag. Device accelerometer registers the cadence and triggers silent duress.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateKnock}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Simulate In-Pocket Knock (Count: {knockCount}/3)</span>
          </button>
        </div>

        {knockTriggered && (
          <div className="bg-red-950/80 border border-red-500 rounded-2xl p-3 text-xs text-red-200 flex items-center gap-2 animate-bounce">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span><strong>Triple Knock Acknowledged:</strong> Silent duress beacon dispatched to trusted circle!</span>
          </div>
        )}
      </div>

      {/* Section 3: "WhisperMesh" Offline BLE Mesh Network */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <WifiOff className="w-4 h-4 text-red-400" />
                WhisperMesh: Zero-Connectivity Peer-to-Peer BLE Relay
              </span>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono font-bold">
                Cellular: 0 Bars
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              In basements or jammer zones, phones hop encrypted packets peer-to-peer over Bluetooth Low Energy.
            </p>
          </div>

          <button
            onClick={handleSimulateMeshRelay}
            disabled={isHopping}
            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-cyan-950 shrink-0"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isHopping ? 'Hopping BLE Nodes...' : 'Simulate Offline Mesh Packet Relay'}</span>
          </button>
        </div>

        {/* Visual Mesh Hops */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
          <div className={`p-3 rounded-2xl border transition text-center ${
            meshHopStep >= 1 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] block">Step 1: Origin</span>
            <strong className="block mt-0.5">Victim Device</strong>
            <span className="text-[10px]">Encrypted Payload</span>
          </div>

          <div className={`p-3 rounded-2xl border transition text-center ${
            meshHopStep >= 2 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] block">Step 2: BLE Hop 1</span>
            <strong className="block mt-0.5">Commuter Node #42</strong>
            <span className="text-[10px]">Range: 28 meters</span>
          </div>

          <div className={`p-3 rounded-2xl border transition text-center ${
            meshHopStep >= 3 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] block">Step 3: BLE Hop 2</span>
            <strong className="block mt-0.5">Metro Exit Gateway</strong>
            <span className="text-[10px]">4G Uplink Acquired</span>
          </div>

          <div className={`p-3 rounded-2xl border transition text-center ${
            meshHopStep >= 4 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="font-mono text-[10px] block">Step 4: Delivered</span>
            <strong className="block mt-0.5">Police 112 Dispatch</strong>
            <span className="text-[10px]">Packet Verified</span>
          </div>
        </div>
      </div>

    </div>
  );
};
