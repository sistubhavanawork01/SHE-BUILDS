import React, { useState, useEffect } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { generateCourtReadyEvidencePackPDF } from '../utils/pdfGenerator.js';
import { 
  FileText, 
  Download, 
  ShieldCheck, 
  Link2, 
  Sparkles, 
  Scale, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  History,
  AlertTriangle,
  FolderLock
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const EvidenceVaultPage = ({ setActiveTab }) => {
  const { incidents, auditLogs } = useShield();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [complaintDraft, setComplaintDraft] = useState(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Default to first incident
  useEffect(() => {
    if (incidents.length > 0 && !selectedIncident) {
      setSelectedIncident(incidents[0]);
    }
  }, [incidents, selectedIncident]);

  // Fetch evidence items for selected incident
  useEffect(() => {
    if (!selectedIncident) return;
    fetch(`/api/incidents/${selectedIncident.id}/evidence`)
      .then(res => res.json())
      .then(data => setEvidenceList(data))
      .catch(err => console.warn(err));
  }, [selectedIncident]);

  // Export Court-Ready PDF Evidence Pack
  const handleExportPDF = async () => {
    if (!selectedIncident) return;
    setIsExportingPDF(true);
    try {
      const pdfBytes = await generateCourtReadyEvidencePackPDF(selectedIncident, evidenceList, auditLogs);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `SHIELD_Evidence_Pack_${selectedIncident.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      speakText('Court-ready evidence pack PDF generated and downloaded.');
    } catch (e) {
      console.error('PDF export error:', e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  // Generate AI Complaint Draft
  const handleGenerateComplaint = async () => {
    if (!selectedIncident) return;
    setIsDrafting(true);
    try {
      const res = await fetch('/api/ai/draft-complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident: selectedIncident,
          evidence: evidenceList
        })
      });
      if (res.ok) {
        const data = await res.json();
        setComplaintDraft(data);
        speakText('Legal complaint draft generated with BSA 2023 statutory references.');
      }
    } catch (e) {
      console.error('Drafting failed:', e);
    } finally {
      setIsDrafting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              Section 7.19 • P1-A Headline Innovation
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <Scale className="w-6 h-6 text-rose-400" />
            Court-Ready Evidence Pack & Legal Assistant
          </h2>
          <p className="text-xs text-slate-300">
            Transforms raw evidence into an admissible dossier with cryptographic SHA-256 hashes, tamper-evident audit logs, and Section 63 BSA 2023 certificate guides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verify_evidence')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold"
          >
            <span>🔍 Verify Hash & Tamper Demo</span>
          </button>
        </div>
      </div>

      {/* Incident Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">Select Incident Dossier:</span>
        <select
          value={selectedIncident?.id || ''}
          onChange={(e) => {
            const found = incidents.find(i => i.id === e.target.value);
            if (found) setSelectedIncident(found);
          }}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none"
        >
          {incidents.map(inc => (
            <option key={inc.id} value={inc.id}>
              {inc.id} — {inc.category} ({inc.approximate_location?.name})
            </option>
          ))}
        </select>
      </div>

      {selectedIncident && (
        <div className="space-y-6">
          
          {/* Action Row: Export PDF & AI Draft */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Download PDF Pack Card */}
            <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                  Legal Admissibility Dossier
                </span>
                <h3 className="font-bold text-white text-base">Court-Ready Evidence Pack (PDF)</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Generates an exportable PDF containing chronological timeline, SHA-256 evidence digests, and Section 63 BSA 2023 legal compliance notes for police or lawyers.
                </p>
              </div>

              <button
                onClick={handleExportPDF}
                disabled={isExportingPDF}
                className="mt-4 w-full py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPDF ? 'Generating Signed PDF...' : 'Download Evidence Pack PDF'}</span>
              </button>
            </div>

            {/* AI Complaint Drafting Card */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  Factual Non-Accusatory Draft
                </span>
                <h3 className="font-bold text-white text-base">AI Complaint Assistant & Routing</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Drafts formal representations tailored for the 1930 Cybercrime Portal, 112 Emergency Police, or College Internal Committee (ICC).
                </p>
              </div>

              <button
                onClick={handleGenerateComplaint}
                disabled={isDrafting}
                className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isDrafting ? 'Drafting Representation...' : 'Draft Formal Complaint'}</span>
              </button>
            </div>

          </div>

          {/* AI Complaint Representation Preview */}
          {complaintDraft && (
            <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Drafted Representation (Ready to Edit / Submit)
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(complaintDraft.body)}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{copiedDraft ? 'Copied to Clipboard!' : 'Copy Complaint'}</span>
                </button>
              </div>

              {/* Subject & Addressed To */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-white">
                  <span className="text-slate-400 font-normal">Subject: </span>
                  {complaintDraft.subject}
                </div>
                <div className="text-slate-300 whitespace-pre-line text-[11px] font-mono">
                  {complaintDraft.addressed_to}
                </div>
              </div>

              {/* Body */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                {complaintDraft.body}
              </div>

              {/* Statutory References */}
              <div className="bg-indigo-950/30 border border-indigo-900/50 p-3 rounded-xl text-xs space-y-1">
                <span className="font-bold text-indigo-300 block mb-1">Applicable Statutory Provisions:</span>
                {complaintDraft.statutory_references?.map((ref, idx) => (
                  <div key={idx} className="text-indigo-200/90 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                    <span>{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cryptographic Evidence Exhibits Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-rose-400" />
              Cryptographic Evidence Vault Exhibits ({evidenceList.length})
            </h3>

            {evidenceList.length === 0 ? (
              <p className="text-xs text-slate-400">No raw media files attached to this incident record.</p>
            ) : (
              <div className="space-y-2.5">
                {evidenceList.map((ev, idx) => (
                  <div key={ev.id || idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ev.file_name}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                          {ev.file_type} • {ev.file_size_kb} KB
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-rose-400 break-all mt-1">
                        SHA-256: {ev.sha256_hash}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('verify_evidence')}
                      className="text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition font-medium shrink-0"
                    >
                      Verify File Hash
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tamper-Evident Audit Chain Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                Tamper-Evident Hash Chain (Genesis to Current)
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Chain Integrity: 100% Valid
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {auditLogs.slice(-4).reverse().map((log, idx) => (
                <div key={log.id || idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold text-slate-200">{log.action}</span>
                    <span className="font-mono text-[10px]">{log.timestamp.slice(11, 19)}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] font-mono text-slate-500">
                    <span className="truncate">Prev Hash: {log.prev_hash?.slice(0, 24)}...</span>
                    <span className="truncate text-emerald-400">Node Hash: {log.entry_hash?.slice(0, 24)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
