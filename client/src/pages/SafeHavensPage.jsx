import React, { useState, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { MapComponent } from '../components/MapComponent.jsx';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  MapPin, 
  PhoneCall, 
  Navigation, 
  QrCode, 
  Radio, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Store,
  Building,
  HeartPulse,
  Pill
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const SafeHavensPage = ({ setActiveTab }) => {
  const { safeHavens } = useShield();
  const [filterType, setFilterType] = useState('all');
  const [selectedHaven, setSelectedHaven] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [signalSent, setSignalSent] = useState(false);
  const [activeSignalToken, setActiveSignalToken] = useState('');

  // Generate QR code for the primary partner safe spot
  useEffect(() => {
    const partnerSpot = safeHavens.find(h => h.type === 'safe_spot');
    if (partnerSpot) {
      QRCode.toDataURL(`https://shield.nitk.ac.in/spot/${partnerSpot.qr_token || 'SPOT-CCD-01'}`, {
        width: 180,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      }).then(url => {
        setQrDataUrl(url);
      });
    }
  }, [safeHavens]);

  const filteredHavens = filterType === 'all' 
    ? safeHavens 
    : safeHavens.filter(h => h.type === filterType);

  // Find Nearest Haven
  const nearestHaven = safeHavens.length > 0 
    ? [...safeHavens].sort((a, b) => (a.distance_m || 9999) - (b.distance_m || 9999))[0]
    : null;

  // Send Silent Signal to Safe Spot (FR-31)
  const handleSendSilentSignal = async (haven) => {
    const token = `USER-TOKEN-${Math.floor(1000 + Math.random() * 9000)}`;
    setActiveSignalToken(token);
    setSignalSent(true);
    speakText('Silent assistance request transmitted to Safe Spot staff desk.');

    try {
      await fetch('/api/safe-spots/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spot_id: haven.id,
          anonymous_token: token
        })
      });
    } catch (e) {
      console.warn('Signal request fallback:', e);
    }

    setTimeout(() => {
      // keep prompt visible
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Section 7.21 • P1-B Safe Havens & Spots
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            Safe Havens & Verified Safe Spots
          </h2>
          <p className="text-xs text-slate-300">
            Know where to go immediately: 24x7 police desks, emergency trauma care, round-the-clock pharmacies, and QR-registered partner shops.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('safe_spot_view')}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold"
        >
          <Store className="w-3.5 h-3.5 text-amber-400" />
          <span>Open Shopkeeper Terminal</span>
        </button>
      </div>

      {/* Nearest Haven Quick Action Card */}
      {nearestHaven && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Closest Verified Safe Haven
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {nearestHaven.distance_m}m away
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{nearestHaven.name}</h3>
              <p className="text-xs text-slate-300">{nearestHaven.address} • {nearestHaven.hours}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${nearestHaven.lat},${nearestHaven.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
            >
              <Navigation className="w-3.5 h-3.5" /> Navigate Now
            </a>
            <a
              href={`tel:${nearestHaven.phone.split('/')[0].trim()}`}
              className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-2.5 rounded-xl transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: 'all', label: 'All Havens', icon: Building },
          { id: 'police', label: 'Police Outposts (112)', icon: ShieldCheck },
          { id: 'hospital', label: '24x7 Emergency Hospitals', icon: HeartPulse },
          { id: 'pharmacy', label: '24x7 Pharmacies', icon: Pill },
          { id: 'safe_spot', label: 'Partner Safe Spots (QR)', icon: Store },
        ].map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition font-medium ${
                filterType === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Map & Directory Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Safe Havens List */}
        <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredHavens.map(haven => (
            <div
              key={haven.id}
              onClick={() => setSelectedHaven(haven)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition shadow-sm ${
                selectedHaven?.id === haven.id
                  ? 'bg-emerald-950/40 border-emerald-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    haven.type === 'police' ? 'bg-blue-500/20 text-blue-300' :
                    haven.type === 'hospital' ? 'bg-emerald-500/20 text-emerald-300' :
                    haven.type === 'pharmacy' ? 'bg-purple-500/20 text-purple-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {haven.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-white text-xs mt-1.5">{haven.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{haven.address}</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                  {haven.distance_m}m
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 flex items-center gap-1 font-mono">
                  📞 {haven.phone}
                </span>

                {haven.type === 'safe_spot' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendSilentSignal(haven);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  >
                    <Radio className="w-3 h-3 animate-ping" /> Send Silent Signal
                  </button>
                ) : (
                  <a
                    href={`tel:${haven.phone.split('/')[0].trim()}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-400 hover:text-emerald-300 font-bold text-[10px]"
                  >
                    Call Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Map View & Safe Spot QR Spotlight */}
        <div className="lg:col-span-2 space-y-4">
          <div className="h-[340px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
            <MapComponent
              center={selectedHaven ? [selectedHaven.lat, selectedHaven.lng] : [13.0108, 74.7938]}
              zoom={14}
              safeHavens={filteredHavens}
            />
          </div>

          {/* Safe Spot QR & Silent Signal Demo Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* QR display */}
              {qrDataUrl && (
                <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0">
                  <img src={qrDataUrl} alt="Safe Spot QR Code" className="w-28 h-28 object-contain" />
                  <span className="text-[9px] text-slate-800 font-bold text-center block mt-1">
                    STORE ENTRANCE QR
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    Discreet Partner Network (FR-31)
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm mt-1">
                  Safe Spot Shopkeeper Silent Signal Protocol
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Partner shops register and display this QR code at the entrance. A woman entering or nearby can tap to send a silent assistance request. The shopkeeper terminal flashes a discreet prompt with <strong>zero personal identity or phone leakage</strong>.
                </p>

                {signalSent && (
                  <div className="mt-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-2.5 text-xs text-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Silent Signal Transmitted! Shopkeeper dashboard alerted with anonymous token: <strong>{activeSignalToken}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
