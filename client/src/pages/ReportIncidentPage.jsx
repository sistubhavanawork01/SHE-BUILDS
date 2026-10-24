import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { computeSHA256 } from '../utils/crypto.js';
import { 
  FileText, 
  Upload, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Hash, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const ReportIncidentPage = ({ setActiveTab }) => {
  const { fetchData } = useShield();

  const [category, setCategory] = useState('stalking');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('NH-66 Underpass near East Gate, Surathkal');
  const [hourBand, setHourBand] = useState('night');
  const [severity, setSeverity] = useState('high');

  // File Upload & SHA-256 Hashing
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidenceHash, setEvidenceHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedIncident, setSubmittedIncident] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEvidenceFile(file);
    setIsHashing(true);

    try {
      const hash = await computeSHA256(file);
      setEvidenceHash(hash);
      setIsHashing(false);
    } catch (err) {
      console.error('Hashing error:', err);
      setIsHashing(false);
    }
  };

  const handleLoadSamplePhoto = async () => {
    setIsHashing(true);
    // Create a mock sample buffer to simulate immediate evidence photo hash
    const sampleData = new TextEncoder().encode("MOCK_DASHCAM_EVIDENCE_SAMPLE_BYTES_2026");
    const hash = await computeSHA256(sampleData);
    setEvidenceFile({
      name: "incident_dashcam_sample.jpg",
      size: 492000,
      type: "image/jpeg"
    });
    setEvidenceHash(hash);
    setIsHashing(false);
    speakText('Evidence file analyzed. SHA-256 fingerprint generated.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const evidencePayload = evidenceHash ? [{
      file_name: evidenceFile?.name || 'evidence_capture.jpg',
      file_type: evidenceFile?.type || 'image/jpeg',
      file_size_kb: Math.round((evidenceFile?.size || 350000) / 1024),
      sha256_hash: evidenceHash
    }] : [];

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title: title || `${category.replace('_', ' ')} incident report`,
          description,
          location_name: locationName,
          hour_band: hourBand,
          severity,
          evidence: evidencePayload
        })
      });

      if (res.ok) {
        const created = await res.json();
        setSubmittedIncident(created);
        fetchData();
        speakText('Incident reported securely. Evidence hash registered in vault.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedIncident) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Incident Report Registered</h2>
          <p className="text-xs text-slate-300 mt-1">
            Reference ID: <span className="font-mono text-emerald-400 font-bold">{submittedIncident.id}</span>
          </p>

          <div className="my-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span>Privacy Filter:</span>
              <span className="text-emerald-400 font-semibold">Active (Exact GPS stripped)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Moderation Queue:</span>
              <span className="text-amber-400 font-semibold">Pending Verification</span>
            </div>
            {evidenceHash && (
              <div>
                <span className="text-slate-400 block mb-1">SHA-256 Evidence Fingerprint:</span>
                <span className="font-mono text-[10px] text-rose-400 break-all block bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {evidenceHash}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setActiveTab('evidence_vault')}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
            >
              <span>View Court-Ready Evidence Pack</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSubmittedIncident(null)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-3 px-6 rounded-xl transition"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            Section 7.3 & 7.4 • P0 Incident & Evidence Architecture
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <FileText className="w-6 h-6 text-rose-400" />
          Report Safety Incident with Cryptographic Evidence
        </h2>
        <p className="text-xs text-slate-300">
          Upload photos, audio, or notes. A tamper-evident SHA-256 hash is computed in your browser before submission.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
        
        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="stalking">Stalking / Following</option>
              <option value="harassment">Verbal / Physical Harassment</option>
              <option value="unsafe_area">Unsafe Area (Poor Lighting / Isolated)</option>
              <option value="suspicious_activity">Suspicious Activity / Loitering</option>
              <option value="threatening_behavior">Threatening Encounter</option>
              <option value="digital_harassment">Digital Abuse / Online Threats</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="high">High Concern (Immediate risk / active stalking)</option>
              <option value="medium">Medium Concern (Recurring issue / broken lights)</option>
              <option value="low">Low Concern (Advisory observation)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Report Title</label>
          <input
            type="text"
            required
            placeholder="e.g. Unmarked bike following students near underpass"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Location & Time Band */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Approximate Area
            </label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time Band
            </label>
            <select
              value={hourBand}
              onChange={(e) => setHourBand(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
            >
              <option value="night">Night (20:00 – 04:00)</option>
              <option value="evening">Evening (14:00 – 20:00)</option>
              <option value="morning">Morning (08:00 – 14:00)</option>
            </select>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5">Incident Details</label>
          <textarea
            rows="3"
            required
            placeholder="Describe what occurred, vehicle descriptions, actions taken..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Evidence File & SHA-256 Hash Box */}
        <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-rose-400" />
              Attach Photo / Screenshot / Audio Evidence
            </span>
            <button
              type="button"
              onClick={handleLoadSamplePhoto}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Load Sample Photo
            </button>
          </div>

          <input
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
          />

          {isHashing && (
            <div className="text-xs text-cyan-400 font-mono animate-pulse">
              Computing Web Crypto SHA-256 fingerprint...
            </div>
          )}

          {evidenceHash && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-white">File: {evidenceFile?.name}</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SHA-256 Computed
                </span>
              </div>
              <p className="font-mono text-[10px] text-rose-400 break-all select-all">
                {evidenceHash}
              </p>
              <span className="text-[10px] text-slate-500 block">
                This hash acts as an immutable electronic proof of custody under Section 63 BSA 2023.
              </span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-xl shadow-rose-900/40 active:scale-98"
        >
          {submitting ? 'Submitting & Anchoring Hash...' : 'Submit Incident & Anchor Evidence Hash'}
        </button>

      </form>

    </div>
  );
};

