import React, { useState, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  History, 
  Clock, 
  TrendingUp, 
  MapPin,
  Lock,
  Sparkles
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const InstitutionDashboardPage = () => {
  const { incidents, fetchData } = useShield();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reporterInbox, setReporterInbox] = useState([]);
  const [publicNote, setPublicNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents, selectedIncident]);

  // Fetch report-back updates for selected incident
  useEffect(() => {
    if (!selectedIncident) return;
    fetch(`/api/incidents/${selectedIncident.id}/updates`)
      .then(res => res.json())
      .then(data => setReporterInbox(data))
      .catch(err => console.warn(err));
  }, [selectedIncident]);

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedIncident) return;
    setIsUpdating(true);

    try {
      const res = await fetch(`/api/incidents/${selectedIncident.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          public_note: publicNote || null,
          moderator: 'campus-security-officer-02'
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedIncident(updated);
        fetchData();
        // Refresh reporter inbox
        const inboxRes = await fetch(`/api/incidents/${updated.id}/updates`);
        if (inboxRes.ok) setReporterInbox(await inboxRes.json());
        setPublicNote('');
        speakText(`Incident ${updated.id} status updated to ${newStatus}. Report-back notification sent to reporter.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  // Metrics
  const totalReports = incidents.length;
  const verifiedReports = incidents.filter(i => i.status === 'verified').length;
  const pendingReports = incidents.filter(i => i.status === 'pending').length;
  const resolvedReports = incidents.filter(i => i.status === 'resolved').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full">
            Section 7.25 & FR-34 • Institution & Security Portal
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-sky-400" />
          Institution Safety Administration & Report-Back Loop
        </h2>
        <p className="text-xs text-slate-300">
          Campus security moderators verify community warnings, broadcast public-safe actions, and close the accountability loop with anonymous reporters.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Reports</span>
          <span className="text-xl font-bold text-white font-mono">{totalReports}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-400 block">Pending Moderation</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{pendingReports}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-400 block">Active Verified</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{verifiedReports}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-sky-400 block">Mitigated / Resolved</span>
          <span className="text-xl font-bold text-sky-400 font-mono">{resolvedReports}</span>
        </div>
      </div>

      {/* Moderation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incident Moderation Queue */}
        <div className="lg:col-span-1 space-y-3 max-h-[550px] overflow-y-auto pr-1">
          <div className="text-xs font-bold uppercase text-slate-400 px-1">
            Incoming Review Queue ({incidents.length})
          </div>

          {incidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition shadow-sm ${
                selectedIncident?.id === inc.id
                  ? 'bg-sky-950/40 border-sky-500'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  inc.status === 'verified' ? 'bg-emerald-500/20 text-emerald-300' :
                  inc.status === 'resolved' ? 'bg-sky-500/20 text-sky-300' :
                  inc.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                  'bg-amber-500/20 text-amber-300'
                }`}>
                  {inc.status}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {inc.hour_band}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs mt-2">{inc.title}</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{inc.approximate_location?.name}</p>
            </div>
          ))}
        </div>

        {/* Selected Incident Actions & Report-Back Loop */}
        {selectedIncident && (
          <div className="lg:col-span-2 space-y-5">
            
            {/* Incident Details Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Dossier ID</span>
                  <div className="font-mono text-sm font-bold text-white">{selectedIncident.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Current Status</span>
                  <div className="text-xs font-bold text-sky-400 uppercase">{selectedIncident.status}</div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[11px] block">Location:</span>
                  <span className="text-white font-semibold">{selectedIncident.approximate_location?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Evidence Attached:</span>
                  <span className="text-emerald-400 font-semibold">{selectedIncident.has_evidence ? 'Yes (SHA-256 Fingerprinted)' : 'No raw file'}</span>
                </div>
              </div>

              {/* Public Safe Note Input */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Public Security Action Note (Broadcast to Map & Reporter):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Campus Security PCR 04 dispatched. Patrols doubled on this stretch."
                  value={publicNote}
                  onChange={(e) => setPublicNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => handleUpdateStatus('verified')}
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-950"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Issue Community Alert</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  disabled={isUpdating}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-sky-950"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved / Threat Mitigated</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isUpdating}
                  className="bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* Reporter Private Report-Back Loop (FR-34) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  Anonymous Report-Back Loop (Reporter's Private Inbox)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Zero identity leaked</span>
              </div>

              <div className="space-y-2">
                {reporterInbox.length === 0 ? (
                  <p className="text-xs text-slate-500">No report-back messages logged yet.</p>
                ) : (
                  reporterInbox.map(msg => (
                    <div key={msg.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-300 capitalize">{msg.status.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{msg.created_at?.slice(11, 19)}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

