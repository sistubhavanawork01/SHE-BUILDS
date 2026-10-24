import React, { useState, useEffect } from 'react';
import { ShieldProvider, useShield } from './context/ShieldContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { DecoyCalculator } from './components/DecoyCalculator.jsx';
import { AIFakeCallModal } from './components/AIFakeCallModal.jsx';

import { SafetyHomePage } from './pages/SafetyHomePage.jsx';
import { CabGuardPage } from './pages/CabGuardPage.jsx';
import { SafeHavensPage } from './pages/SafeHavensPage.jsx';
import { CommunityMapPage } from './pages/CommunityMapPage.jsx';
import { ReportIncidentPage } from './pages/ReportIncidentPage.jsx';
import { EvidenceVaultPage } from './pages/EvidenceVaultPage.jsx';
import { VerifyEvidencePage } from './pages/VerifyEvidencePage.jsx';
import { DigitalShieldPage } from './pages/DigitalShieldPage.jsx';
import { InstitutionDashboardPage } from './pages/InstitutionDashboardPage.jsx';
import { TrustedContactLivePage } from './pages/TrustedContactLivePage.jsx';
import { SafeSpotShopPage } from './pages/SafeSpotShopPage.jsx';

import { 
  Shield, 
  Car, 
  Map, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Radio, 
  Building2, 
  Store,
  Sparkles
} from 'lucide-react';

const MainAppContent = () => {
  const { isDecoyUnlocked, fakeCallOpen, setFakeCallOpen } = useShield();
  const [activeTab, setActiveTab] = useState('home');

  // Check URL parameters for companion views (e.g. ?view=contact or ?view=safe-spot)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view === 'contact') setActiveTab('contact_view');
    if (view === 'safe-spot') setActiveTab('safe_spot_view');
  }, []);

  // If locked in Decoy Calculator Mode
  if (!isDecoyUnlocked) {
    return <DecoyCalculator />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pb-20 sm:pb-6">
      
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && <SafetyHomePage setActiveTab={setActiveTab} />}
        {activeTab === 'cab_guard' && <CabGuardPage setActiveTab={setActiveTab} />}
        {activeTab === 'safe_havens' && <SafeHavensPage setActiveTab={setActiveTab} />}
        {activeTab === 'community_map' && <CommunityMapPage setActiveTab={setActiveTab} />}
        {activeTab === 'report' && <ReportIncidentPage setActiveTab={setActiveTab} />}
        {activeTab === 'evidence_vault' && <EvidenceVaultPage setActiveTab={setActiveTab} />}
        {activeTab === 'verify_evidence' && <VerifyEvidencePage setActiveTab={setActiveTab} />}
        {activeTab === 'digital_shield' && <DigitalShieldPage setActiveTab={setActiveTab} />}
        {activeTab === 'institution_dashboard' && <InstitutionDashboardPage />}
        {activeTab === 'contact_view' && <TrustedContactLivePage />}
        {activeTab === 'safe_spot_view' && <SafeSpotShopPage />}
      </main>

      {/* AI Fake Call Modal */}
      <AIFakeCallModal
        isOpen={fakeCallOpen}
        onClose={() => setFakeCallOpen(false)}
      />

      {/* Mobile Bottom Quick Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 py-2 px-3 sm:hidden flex justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'home' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('cab_guard')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'cab_guard' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Car className="w-5 h-5" />
          <span>Cab Guard</span>
        </button>

        <button
          onClick={() => setActiveTab('safe_havens')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'safe_havens' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Havens</span>
        </button>

        <button
          onClick={() => setActiveTab('community_map')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'community_map' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <Map className="w-5 h-5" />
          <span>Map</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence_vault')}
          className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${
            activeTab === 'evidence_vault' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Vault</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="hidden sm:block border-t border-slate-900/80 mt-10 py-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <span>SHIELD • NITK Women Hackathon • PS2 Women’s Safety</span>
          <span>Section 63 Bharatiya Sakshya Adhiniyam, 2023 Compliant</span>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <ShieldProvider>
      <MainAppContent />
    </ShieldProvider>
  );
}
