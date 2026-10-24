import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { MapComponent } from '../components/MapComponent.jsx';
import { 
  Map, 
  Clock, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Layers, 
  Sparkles, 
  CheckCircle2,
  Calendar,
  Eye,
  SlidersHorizontal,
  Lock
} from 'lucide-react';

export const CommunityMapPage = ({ setActiveTab }) => {
  const { mapIncidents, patterns } = useShield();
  const [selectedHourBand, setSelectedHourBand] = useState('night'); // 'all', 'morning', 'evening', 'night'
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Filter incidents according to time band
  const filteredIncidents = selectedHourBand === 'all'
    ? mapIncidents
    : mapIncidents.filter(inc => inc.hour_band === selectedHourBand);

  // Active emerging pattern for selected hour band
  const activePattern = patterns.find(p => selectedHourBand === 'all' || p.hour_band === selectedHourBand);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
              Section 7.5 & 7.22 • Time-Aware Safety Map
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-400" />
            Time-Aware Community Safety Map & Intelligence
          </h2>
          <p className="text-xs text-slate-300">
            Dynamically adjust time of day to see historical concerns shift between morning, evening, and night.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('report')}
          className="text-xs bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-bold shadow-lg shadow-rose-900/30"
        >
          <span>+ Report An Incident</span>
        </button>
      </div>

      {/* Privacy Shield Notice (Section 7.14 & FR-06) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-slate-300">
        <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div className="leading-relaxed">
          <strong className="text-white">Privacy Guarantee:</strong> Exact GPS coordinates are generalized using geohash truncation (~100m radius). Reporter identity is mathematically detached. System reports <em>"concerns detected at this hour"</em>, never <em>"area is unsafe"</em>.
        </div>
      </div>

      {/* Time-of-Day Slider / Selector (FR-32) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Time-of-Day Concern Band:</span>
          </div>
          <span className="text-xs font-bold text-indigo-400 font-mono">
            {selectedHourBand.toUpperCase()} ({
              selectedHourBand === 'morning' ? '08:00 – 14:00' :
              selectedHourBand === 'evening' ? '14:00 – 20:00' :
              selectedHourBand === 'night' ? '20:00 – 04:00' : '24-HOUR VIEW'
            })
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-xs font-medium">
          {[
            { id: 'morning', label: 'Morning', hours: '8 AM – 2 PM' },
            { id: 'evening', label: 'Evening', hours: '2 PM – 8 PM' },
            { id: 'night', label: 'Night', hours: '8 PM – 4 AM' },
            { id: 'all', label: 'All Hours', hours: 'Aggregated' }
          ].map(band => (
            <button
              key={band.id}
              onClick={() => setSelectedHourBand(band.id)}
              className={`py-2.5 px-2 rounded-xl border text-center transition ${
                selectedHourBand === band.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/40 font-bold'
                  : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="text-xs">{band.label}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{band.hours}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Emerging Pattern Warning if present for this band (FR-10) */}
      {activePattern && (
        <div className="bg-amber-950/60 border border-amber-500/50 rounded-2xl p-4 shadow-lg flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl mt-0.5 shrink-0">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                Pattern Cluster Algorithm Triggered (FR-10)
              </span>
            </div>
            <h4 className="font-bold text-white text-sm mt-1">{activePattern.title}</h4>
            <p className="text-xs text-amber-200 mt-1 leading-relaxed">
              {activePattern.area_name}: {activePattern.incident_count} reports clustered within the same approximate time window. {activePattern.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Map & Incidents Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incidents Drawer */}
        <div className="lg:col-span-1 space-y-3 max-h-[520px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase text-slate-400 px-1 flex items-center justify-between">
            <span>Filtered Reports ({filteredIncidents.length})</span>
            <span className="text-[11px] text-slate-500">Tap pin to focus</span>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
              <Info className="w-6 h-6 mx-auto mb-2 text-slate-500" />
              Insufficient recent data for this time band. Area risk remains unclassified.
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => setSelectedIncident(inc)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition shadow-sm ${
                  selectedIncident?.id === inc.id
                    ? 'bg-indigo-950/40 border-indigo-500'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    inc.severity === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {inc.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
                    {inc.hour_band}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs mt-2">{inc.title}</h4>
                <p className="text-[11px] text-slate-300 mt-1">{inc.approximate_location?.name}</p>

                {inc.public_note && (
                  <div className="mt-2.5 bg-sky-950/60 border border-sky-800/60 rounded-xl p-2 text-[10px] text-sky-200">
                    🛡️ <strong>Official Note:</strong> {inc.public_note}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <MapComponent
              center={selectedIncident?.approximate_location ? [selectedIncident.approximate_location.lat, selectedIncident.approximate_location.lng] : [13.0108, 74.7938]}
              zoom={14}
              incidents={filteredIncidents}
              onMarkerClick={(inc) => setSelectedIncident(inc)}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
