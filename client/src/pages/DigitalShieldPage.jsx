import React, { useState } from 'react';
import { computeImageDHash, binaryHashToHex, calculateHammingDistance } from '../utils/dhash.js';
import { 
  Lock, 
  ShieldAlert, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Copy, 
  FileCheck, 
  ExternalLink,
  Cpu,
  Mail,
  UserX
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const DigitalShieldPage = ({ setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState('ncii_shield'); // 'ncii_shield', 'threat_ai', 'breach_check', 'fake_profile'

  // --- Sub-module 1: NCII Hash Shield ---
  const [nciiImagePreview, setNciiImagePreview] = useState(null);
  const [computedDHash, setComputedDHash] = useState('');
  const [computedDHashHex, setComputedDHashHex] = useState('');
  const [isHashingNCII, setIsHashingNCII] = useState(false);
  const [nciiResult, setNciiResult] = useState(null);

  // Preset flagged test hash for demo
  const DEMO_BLOCKED_HASH = "1011001110010110010110101010010111001101010101001011011010010111";

  const handleProcessNCIIImage = async (file) => {
    setIsHashingNCII(true);
    setNciiResult(null);

    try {
      const url = URL.createObjectURL(file);
      setNciiImagePreview(url);

      const dhashBin = await computeImageDHash(file);
      setComputedDHash(dhashBin);
      setComputedDHashHex(binaryHashToHex(dhashBin));

      // Check against server blocklist
      const res = await fetch('/api/digital/ncii-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phash: dhashBin })
      });

      if (res.ok) {
        const result = await res.json();
        setNciiResult(result);
        if (result.match_found) {
          speakText('Warning: Image matches blocked perceptual hash in NCII registry.');
        } else {
          speakText('Perceptual hash computed. Image protected on-device without upload.');
        }
      }
    } catch (err) {
      console.error('dHash calculation error:', err);
    } finally {
      setIsHashingNCII(false);
    }
  };

  const handleLoadSampleNCIIImage = async () => {
    // Generates a mock canvas gradient image to test on-device hashing live
    const canvas = document.createElement('canvas');
    canvas.width = 120;
    canvas.height = 120;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(0, 0, 120, 120);
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(60, 60, 40, 0, Math.PI * 2);
    ctx.fill();

    canvas.toBlob((blob) => {
      const file = new File([blob], 'demo_sensitive_photo.jpg', { type: 'image/jpeg' });
      handleProcessNCIIImage(file);
    }, 'image/jpeg');
  };

  const handleSimulateResizedNCIIFlag = async () => {
    // Simulates an image whose dHash is within Hamming distance of 3 to test the blocked match!
    setIsHashingNCII(true);
    setTimeout(async () => {
      // Modify 2 bits in DEMO_BLOCKED_HASH
      const modifiedHash = DEMO_BLOCKED_HASH.slice(0, 5) + (DEMO_BLOCKED_HASH[5] === '0' ? '1' : '0') + DEMO_BLOCKED_HASH.slice(6);
      setComputedDHash(modifiedHash);
      setComputedDHashHex(binaryHashToHex(modifiedHash));

      const res = await fetch('/api/digital/ncii-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phash: modifiedHash })
      });
      if (res.ok) {
        const result = await res.json();
        setNciiResult(result);
        speakText('NCII match flagged: modified or resized copy detected within Hamming distance.');
      }
      setIsHashingNCII(false);
    }, 800);
  };

  // --- Sub-module 2: AI Threat Analyzer ---
  const [threatInputText, setThreatInputText] = useState(
    "I know which hostel room you stay in. If you don't send ₹25,000 to my UPI account tonight, I will morph your photos and post them on the college group."
  );
  const [threatAnalysis, setThreatAnalysis] = useState(null);
  const [isAnalyzingThreat, setIsAnalyzingThreat] = useState(false);

  const handleAnalyzeThreat = async () => {
    setIsAnalyzingThreat(true);
    try {
      const res = await fetch('/api/ai/threat-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: threatInputText })
      });
      if (res.ok) {
        const data = await res.json();
        setThreatAnalysis(data);
        speakText(`Threat analyzed. Risk score is ${data.threat_score} out of 10. Classified as ${data.category}.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingThreat(false);
    }
  };

  // --- Sub-module 3: Breach Checker ---
  const [breachEmail, setBreachEmail] = useState('student@nitk.edu.in');
  const [breachResult, setBreachResult] = useState(null);
  const [isCheckingBreach, setIsCheckingBreach] = useState(false);

  const handleCheckBreach = async () => {
    setIsCheckingBreach(true);
    try {
      const res = await fetch('/api/digital/breach-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: breachEmail })
      });
      if (res.ok) {
        const data = await res.json();
        setBreachResult(data);
        speakText(`Breach check complete. ${data.breach_count} compromised records found.`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingBreach(false);
    }
  };

  // --- Sub-module 4: Fake Profile Takedown Kit ---
  const [fakeUsername, setFakeUsername] = useState('@priya_sharma_nitk_fake');
  const [fakePlatform, setFakePlatform] = useState('Instagram');
  const [fakeProfileURL, setFakeProfileURL] = useState('https://instagram.com/priya_sharma_nitk_fake');
  const [generatedTakedown, setGeneratedTakedown] = useState('');
  const [takedownCopied, setTakedownCopied] = useState(false);

  const handleGenerateTakedown = () => {
    const text = `URGENT TAKEDOWN & IDENTITY IMPERSONATION NOTICE
To: ${fakePlatform} Safety & Legal Policy Team
Re: Immediate Removal of Impersonator Account: ${fakeUsername} (${fakeProfileURL})

I am formally submitting an expedited takedown complaint regarding the above profile which is actively impersonating my identity without authorization.
1. The account is using my name and photographs to distribute misleading, defamatory, and unauthorized material.
2. Under Section 66D of the Information Technology Act (Cheating by personation using computer resource) and Section 336(3) of Bharatiya Nyaya Sanhita, 2023, this constitutes criminal impersonation.
3. Relevant timestamped screenshots and hash digests have been archived in our legal vault (SHIELD Vault Reference).

I request immediate suspension and takedown of this fraudulent account.
Submitted by: [Authorized Complainant / SHIELD Verified User]`;

    setGeneratedTakedown(text);
    speakText('Platform-ready takedown notice generated.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            Section 7.20 • P1-B Digital Safety & Identity Protection
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
          <Lock className="w-6 h-6 text-purple-400" />
          NCII & Identity-Misuse Shield
        </h2>
        <p className="text-xs text-slate-300">
          Protects against non-consensual image distribution, extortion blackmail, credential breaches, and malicious social impersonation.
        </p>
      </div>

      {/* Sub-module Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold">
        {[
          { id: 'ncii_shield', label: 'NCII Hash Shield', icon: Cpu },
          { id: 'threat_ai', label: 'AI Threat Analyzer', icon: Sparkles },
          { id: 'breach_check', label: 'Data Breach Check', icon: Mail },
          { id: 'fake_profile', label: 'Fake-Profile Kit', icon: UserX },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition ${
                activeSubTab === tab.id
                  ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-900/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: NCII HASH SHIELD */}
      {activeSubTab === 'ncii_shield' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              On-Device Perceptual Hashing (dHash via Canvas API)
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Zero-Knowledge Privacy:</strong> Your sensitive or intimate photos are processed <em>exclusively inside your local browser</em>. No image bytes are ever transmitted over the network. Only a mathematical 64-bit gradient hash is stored.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Action buttons */}
            <div className="space-y-3">
              <label className="cursor-pointer w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition">
                <Upload className="w-6 h-6 text-purple-400" />
                <span className="text-xs font-bold text-white">Select Image to Fingerprint Locally</span>
                <span className="text-[10px] text-slate-400">Never leaves your device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleProcessNCIIImage(f);
                  }}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={handleLoadSampleNCIIImage}
                  className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition"
                >
                  Generate Test Image
                </button>
                <button
                  onClick={handleSimulateResizedNCIIFlag}
                  className="py-2.5 px-3 bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-500/50 rounded-xl font-semibold transition"
                >
                  Test Resized Flag
                </button>
              </div>

              {isHashingNCII && (
                <div className="text-xs text-purple-400 font-mono animate-pulse text-center">
                  Calculating 64-bit Canvas dHash gradient matrix...
                </div>
              )}
            </div>

            {/* Results / Hash Preview */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-white">On-Device Fingerprint:</span>
                <span className="text-emerald-400 text-[10px] font-bold">100% Client-Side</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Hexadecimal (16 Char):</span>
                <div className="font-mono text-xs text-purple-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  {computedDHashHex || 'WAITING_FOR_IMAGE'}
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">64-Bit Binary Hash:</span>
                <div className="font-mono text-[9px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800 break-all leading-relaxed">
                  {computedDHash || '0000000000000000000000000000000000000000000000000000000000000000'}
                </div>
              </div>

              {/* Match Result Banner */}
              {nciiResult && (
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  nciiResult.match_found
                    ? 'bg-red-950/80 border-red-500 text-red-200 animate-pulse'
                    : 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                }`}>
                  <strong className="block mb-0.5">
                    {nciiResult.match_found ? '🚨 NCII BLOCKLIST MATCH FLAGGED!' : '✅ CLEAN PERCEPTUAL FINGERPRINT'}
                  </strong>
                  <span>
                    {nciiResult.match_found
                      ? `Image matches blocked hash within Hamming distance ${nciiResult.hamming_distance} (Threshold ≤ 10). Marked for automatic partner takedown.`
                      : 'No matches found in abuse registries. Perceptual hash anchored for future protection.'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI THREAT ANALYZER */}
      {activeSubTab === 'threat_ai' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              AI Threat Classification & Extortion Prevention (FR-14)
            </span>
            <p className="text-xs text-slate-300">
              Paste suspicious, intimidating, or blackmail messages received via WhatsApp, Instagram, or email.
            </p>
          </div>

          <textarea
            rows="3"
            value={threatInputText}
            onChange={(e) => setThreatInputText(e.target.value)}
            placeholder="Paste suspicious text or message description..."
            className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
          />

          <button
            onClick={handleAnalyzeThreat}
            disabled={isAnalyzingThreat}
            className="py-3 px-6 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAnalyzingThreat ? 'Analyzing Threat Indicators...' : 'Analyze with Safety AI'}</span>
          </button>

          {threatAnalysis && (
            <div className="mt-4 bg-slate-950 border border-purple-500/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    threatAnalysis.risk_level === 'high_risk' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    threatAnalysis.risk_level === 'harassment' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {threatAnalysis.risk_level.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">
                    Category: <strong className="text-white">{threatAnalysis.category?.replace('_', ' ')}</strong>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Threat Score</span>
                  <span className="text-lg font-mono font-bold text-rose-400">{threatAnalysis.threat_score} / 10</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {threatAnalysis.summary}
              </p>

              {/* Recommended Action Checklist */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-purple-300 block">Immediate Recommended Safety Steps:</span>
                {threatAnalysis.immediate_actions?.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>

              {/* Recommended Reporting Channel */}
              <div className="bg-indigo-950/40 border border-indigo-500/40 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Official Channel for this incident:</span>
                <span className="text-indigo-300 font-bold">{threatAnalysis.recommended_channel}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: DATA BREACH CHECK */}
      {activeSubTab === 'breach_check' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Compromised Identity & Data Breach Scanner (FR-28)
            </span>
            <p className="text-xs text-slate-300">
              Check if your email or credentials have been exposed in public database leaks.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              value={breachEmail}
              onChange={(e) => setBreachEmail(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
            />
            <button
              onClick={handleCheckBreach}
              disabled={isCheckingBreach}
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition"
            >
              {isCheckingBreach ? 'Checking...' : 'Check Breaches'}
            </button>
          </div>

          {breachResult && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Exposure Status:</span>
                <span className={`font-bold ${breachResult.breached ? 'text-red-400' : 'text-emerald-400'}`}>
                  {breachResult.breached ? `${breachResult.breach_count} Breaches Detected` : 'Zero Breaches Detected'}
                </span>
              </div>

              {breachResult.breaches?.map((b, idx) => (
                <div key={idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div className="font-bold text-white text-xs">{b.title} ({b.date})</div>
                  <div className="text-[11px] text-slate-400 mt-1">Exposed: {b.data_classes.join(', ')}</div>
                </div>
              ))}

              <div className="space-y-1 mt-2">
                <span className="font-bold text-slate-300 block">Immediate Recommendations:</span>
                {breachResult.recommendations?.map((r, i) => (
                  <div key={i} className="text-slate-400 text-[11px] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: FAKE PROFILE KIT */}
      {activeSubTab === 'fake_profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Impersonation & Fake-Profile Takedown Kit (FR-29)
            </span>
            <p className="text-xs text-slate-300">
              Generate platform-compliant legal takedown requests for impersonator accounts with statutory references.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Platform</label>
              <select
                value={fakePlatform}
                onChange={(e) => setFakePlatform(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Instagram">Instagram (Meta)</option>
                <option value="X (Twitter)">X (Twitter)</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Snapchat">Snapchat</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Impersonator Handle / URL</label>
              <input
                type="text"
                value={fakeProfileURL}
                onChange={(e) => setFakeProfileURL(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateTakedown}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition shadow-md shadow-purple-900/30"
          >
            Generate Official Takedown Notice
          </button>

          {generatedTakedown && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Formatted Legal Takedown Notice:</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedTakedown);
                    setTakedownCopied(true);
                    setTimeout(() => setTakedownCopied(false), 2000);
                  }}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5 text-purple-400" />
                  <span>{takedownCopied ? 'Copied!' : 'Copy Notice'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                {generatedTakedown}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

