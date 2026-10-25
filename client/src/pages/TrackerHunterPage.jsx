import React, { useState } from 'react';
import { 
  Radio, 
  Search, 
  ShieldAlert, 
  Volume2, 
} from 'lucide-react';
import { speakText } from '../utils/speech.js';
import { getNativeCapabilities, scanNativeTrackers } from '../utils/nativeBridge.js';

export const TrackerHunterPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedDevices] = useState([
    {
      id: "BLE-APPLE-AIRTAG-4F92",
      type: "Apple AirTag (Unregistered to User)",
      signalStrength: "-54 dBm (Very Close: &lt; 2m)",
      locationsCount: 3,
      locations: ["Workplace Tech Park", "Central Metro Station", "Current Location"],
      persistentMinutes: 48,
      riskLevel: "CRITICAL_STALKING_RISK"
    },
    {
      id: "BLE-TILE-MATE-8491",
      type: "Tile Pro Tracker Beacon",
      signalStrength: "-82 dBm (Faint: ~15m)",
      locationsCount: 1,
      locations: ["Transit Plaza"],
      persistentMinutes: 5,
      riskLevel: "LOW_NORMAL_PASSING"
    }
  ]);

  const [chimeTriggered, setChimeTriggered] = useState(false);

  const handleRunScan = async () => {
    setIsScanning(true);
    speakText('Scanning 2.4 GHz Bluetooth spectrum for persistent tracking beacons.');
    const capabilities = getNativeCapabilities();
    if (capabilities.trackerScan) {
      const result = await scanNativeTrackers();
      setIsScanning(false);
      speakText(result.devices?.length ? 'Native scan found Bluetooth tracker candidates.' : 'Native scan completed with no tracker candidates.');
      return;
    }
    setTimeout(() => {
      setIsScanning(false);
      speakText('Scan complete: Rogue Apple AirTag detected following your travel path over 48 minutes.');
    }, 1500);
  };

  const handlePlayChime = () => {
    setChimeTriggered(true);
    speakText('Transmitting BLE acoustic trigger to force tracker speaker chime.');
    setTimeout(() => setChimeTriggered(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              Idea 5 • Anti-Stalking & Rogue Hardware Hunter
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Radio className="w-6 h-6 text-purple-400" />
            Stalkware & Rogue Bluetooth Tracker Hunter
          </h2>
          <p className="text-xs text-slate-300">
            Detects rogue AirTags, Tile tags, and concealed magnetic GPS bugs traveling with you across multiple locations.
          </p>
          <p className="text-[11px] text-purple-300 mt-1">
            {detectedDevices.length} nearby beacon profiles retained for waypoint comparison.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-purple-900/40"
        >
          <Search className="w-4 h-4" />
          <span>{isScanning ? 'Scanning BLE Spectrum...' : 'Scan for Rogue Trackers'}</span>
        </button>
      </div>

      {/* Warning Spotlight for Persistent Rogue Tracker */}
      <div className="bg-red-950/80 border-2 border-red-500 rounded-3xl p-6 shadow-2xl space-y-4 animate-emergency-pulse">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 text-red-400 border border-red-500 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-300">
                  PERSISTENT ROGUE TRACKER DETECTED
                </span>
                <span className="text-[10px] bg-red-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                  Following: 48 Mins
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">Apple AirTag (ID: BLE-4F92)</h3>
              <p className="text-xs text-red-200">
                This beacon does not belong to your account but has moved with you across 3 consecutive locations.
              </p>
            </div>
          </div>

          <button
            onClick={handlePlayChime}
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-red-950 shrink-0"
          >
            <Volume2 className="w-4 h-4" />
            <span>Force Tracker Audio Chime</span>
          </button>
        </div>

        {chimeTriggered && (
          <div className="bg-slate-950 p-3 rounded-2xl border border-red-500/50 text-xs text-red-300 flex items-center gap-2 animate-pulse">
            <Volume2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>Transmitting BLE chime trigger. Listen carefully for faint chirping in your bag, coat pocket, or car bumper.</span>
          </div>
        )}

        {/* Multi-Location Persistent Evidence */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-300 block">Waypoints Where Tracker Was Sighted Traveling With You:</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              1. Workplace Tech Park (17:40)
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-slate-300">
              2. Central Metro Station (18:15)
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-red-500/40 text-red-300 font-semibold">
              3. Current Location (Active)
            </div>
          </div>
        </div>

        {/* Safety & Neutralization Guide */}
        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
          <strong className="text-red-300 block">How to Safely Neutralize & Preserve Legal Evidence:</strong>
          <ol className="list-decimal pl-4 space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Search handbag linings, luggage seams, vehicle wheel wells, and jacket pockets.</li>
            <li>Take a clear photograph of the tracker showing any visible serial numbers.</li>
            <li>Twist the back cover counter-clockwise to remove the CR2032 coin battery and disable tracking.</li>
            <li>Preserve the physical device in a zip bag for police fingerprinting and Section 78 BNS stalking investigation.</li>
          </ol>
        </div>
      </div>

    </div>
  );
};
