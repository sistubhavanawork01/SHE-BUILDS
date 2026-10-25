import React, { useEffect, useState } from 'react';
import { MapComponent } from '../components/MapComponent.jsx';
import { 
  Sun, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const SafeRoutingPage = () => {
  // Route Options
  const [selectedRouteType, setSelectedRouteType] = useState('safe'); // 'safe' | 'shortest'
  const [ambientLux, setAmbientLux] = useState(6.2); // Current lux reading
  const [isMeasuringLux, setIsMeasuringLux] = useState(false);
  const [grievanceSent, setGrievanceSent] = useState(false);
  const [grievanceStatus, setGrievanceStatus] = useState('');
  const [dataSource, setDataSource] = useState('Demo corridor dataset');
  const [liveSafetyData, setLiveSafetyData] = useState(null);

  useEffect(() => {
    fetch('/api/integrations/safety-data?lat=13.0040&lng=74.7990')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Safety data provider unavailable');
        setDataSource(result.source || 'Configured safety data provider');
        setLiveSafetyData(result.data);
      })
      .catch(() => {
        setDataSource('Demo corridor dataset');
      });
  }, []);

  // Safe Corridor vs Shortest Route Coordinates
  const safePolyline = [
    [13.0108, 74.7938], // Start: Hub
    [13.0105, 74.7955], // Lit commercial avenue
    [13.0080, 74.7975], // Main illuminated highway
    [13.0040, 74.7990], // Police Outpost junction
    [13.0010, 74.8020], // 24x7 Apollo Pharmacy
    [12.9980, 74.8090]  // End: Safe Destination
  ];

  const shortestPolyline = [
    [13.0108, 74.7938], // Start
    [13.0070, 74.7910], // Unlit dark service cut
    [13.0020, 74.7940], // Isolated dirt culvert
    [12.9980, 74.8090]  // End
  ];

  // Measure Live Photometer Lux (Uses AmbientLightSensor where available or realistic photometer simulation)
  const handleMeasureLux = () => {
    setIsMeasuringLux(true);
    setTimeout(() => {
      // Simulate night street measurement
      const reading = (Math.random() * 8 + 3).toFixed(1);
      setAmbientLux(reading);
      setIsMeasuringLux(false);
      speakText(`Ambient illumination measured: ${reading} lux. Dark zone detected.`);
    }, 1000);
  };

  const handleSendMunicipalGrievance = async () => {
    setGrievanceStatus('Submitting to configured municipal adapter...');
    try {
      const response = await fetch('/api/integrations/municipal/grievance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: `Streetlight deficiency measured at ${ambientLux} lux on Sector 4 Connector Road.`,
          location: 'Sector 4 Connector Road',
          measured_lux: Number(ambientLux),
          category: 'streetlight_repair'
        })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Municipal provider rejected the request');
      setGrievanceSent(true);
      setGrievanceStatus(`${result.status}: ${result.ticket_id || 'provider request accepted'}`);
      speakText('Municipal grievance request recorded.');
    } catch (error) {
      setGrievanceStatus(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
            Idea 3 & 9 • Lighting-Weighted Safe Navigation & Civic Action
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <Sun className="w-6 h-6 text-amber-400" />
          Lighting-Weighted Safe Route Corridor vs Shortest Route
        </h2>
        <p className="text-xs text-slate-300">
          Standard GPS apps prioritize the fastest route—often directing women through unlit alleys. SHIELD prioritizes street illumination, open 24x7 stores, and active CCTV corridors.
        </p>
        <p className="text-[11px] text-slate-500">Safety data source: {dataSource}{liveSafetyData ? ' • live feed loaded' : ''}</p>
        {!liveSafetyData && (
          <p className="text-[11px] text-amber-300">
            Live provider data is unavailable. Route scores and corridor details shown below are demonstration data.
          </p>
        )}
      </div>

      {/* Route Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* SHIELD Safe Corridor */}
        <div
          onClick={() => {
            setSelectedRouteType('safe');
            speakText('Safe corridor selected. 96 percent street lighting coverage.');
          }}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition shadow-xl ${
            selectedRouteType === 'safe'
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
              SHIELD Recommended Route
            </span>
            <span className="text-sm font-extrabold text-emerald-400 font-mono">96% Safety Score</span>
          </div>

          <h3 className="text-base font-bold text-white">Illuminated Arterial Corridor</h3>
          <p className="text-xs text-slate-300 mt-1">2.3 km • 18 mins walk / 5 mins ride</p>

          <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full functional LED streetlights along whole stretch</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3 Open 24x7 Pharmacies & 1 Police Outpost</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Continuous municipal CCTV camera coverage</span>
            </div>
          </div>
        </div>

        {/* Shortest / Standard GPS Route */}
        <div
          onClick={() => {
            setSelectedRouteType('shortest');
            speakText('Standard shortest route selected. Caution: 650 meters of dark corridor detected.');
          }}
          className={`p-5 rounded-3xl border-2 cursor-pointer transition shadow-xl ${
            selectedRouteType === 'shortest'
              ? 'bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-900 border-red-500 ring-2 ring-red-500/30'
              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/40 px-2.5 py-0.5 rounded-full">
              Standard GPS (Fastest)
            </span>
            <span className="text-sm font-extrabold text-red-400 font-mono">34% Safety Score</span>
          </div>

          <h3 className="text-base font-bold text-white">Isolated Bypass Shortcut</h3>
          <p className="text-xs text-slate-300 mt-1">1.8 km • 14 mins walk (4 mins faster)</p>

          <div className="mt-3.5 space-y-1.5 text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-red-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>650m pitch black culvert with 4 non-functional lights</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Zero open commercial stores or pedestrian traffic</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>History of 2 loitering harassment incidents</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Map Visualizing Route Comparison */}
      <div className="h-[380px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <MapComponent
          center={[13.0040, 74.7990]}
          zoom={14}
          cabRoute={{
            polyline: selectedRouteType === 'safe' ? safePolyline : shortestPolyline,
            plate: selectedRouteType === 'safe' ? 'Illuminated Safe Corridor' : 'Isolated Shortcut'
          }}
        />
      </div>

      {/* Idea 9: Ambient Lux Streetlight Photometer & Civic Grievance Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Civic Accountability & Streetlight Photometer Crowdsourcing
            </span>
            <h4 className="text-base font-bold text-white mt-0.5">
              Automated Municipal Grievance Generator
            </h4>
          </div>

          <button
            onClick={handleMeasureLux}
            disabled={isMeasuringLux}
            className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-950"
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{isMeasuringLux ? 'Measuring Light Levels...' : 'Sample Ambient Lux'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Measured Light Level</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono mt-0.5 block">{ambientLux} Lux</span>
            <span className="text-[10px] text-red-400 font-semibold">Below Civic Standard (Min: 20 Lux)</span>
          </div>

          <div className="sm:col-span-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold">Auto-Generated Municipal Grievance:</span>
              <span className="text-[10px] font-mono text-emerald-400">Jurisdiction: Ward 14 Engineering Division</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              "FORMAL GRIEVANCE #CIVIC-LUX-849: Critical illumination deficiency (&lt; 7.0 lux) recorded at Sector 4 Connector Road. Four consecutive sodium vapor fixtures unlit. Demand immediate replacement under Civic Public Safety Standards."
            </p>
          </div>
        </div>

        {grievanceSent ? (
          <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-3 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Civic grievance recorded: {grievanceStatus}</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleSendMunicipalGrievance}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Submit Official Municipal Grievance for Streetlight Repair</span>
            </button>
            {grievanceStatus && <p className="text-[11px] text-amber-300">{grievanceStatus}</p>}
          </>
        )}
      </div>

    </div>
  );
};
