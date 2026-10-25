import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { 
  User, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  LogOut, 
  CheckCircle2, 
  Building, 
  Home, 
  Briefcase, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const AccountProfilePage = ({ setActiveTab }) => {
  const { user, updateUser, logout, trustedContacts, t, voiceEnabled, setVoiceEnabled } = useShield();

  const [name, setName] = useState(user?.name || 'Priya Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(user?.email || 'priya.sharma@shield.org');
  const [circleType, setCircleType] = useState(user?.circle_type || 'city');
  const [circleName, setCircleName] = useState(user?.circle_name || 'Universal City Transit & Safety Network');

  // PIN settings
  const [normalPin, setNormalPin] = useState(user?.normal_pin || '1234');
  const [duressPin, setDuressPin] = useState(user?.duress_pin || '9999');

  // Contact list
  const [contacts, setContacts] = useState(trustedContacts || []);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Friend');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) return;
    const newEntry = {
      id: `contact-${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRel,
      priority: contacts.length + 1,
      notify_sms: true,
      notify_realtime: true
    };
    setContacts(prev => [...prev, newEntry]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveProfile = () => {
    updateUser({
      name,
      phone,
      email,
      circle_type: circleType,
      circle_name: circleName,
      normal_pin: normalPin,
      duress_pin: duressPin
    });
    setSavedSuccess(true);
    speakText('Safety account settings saved successfully.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCircleChange = (type) => {
    setCircleType(type);
    if (type === 'city') setCircleName('Metro City Transit & Commercial Safety Circle');
    if (type === 'workplace') setCircleName('Tech Park & Corporate Workplace Women Circle');
    if (type === 'campus') setCircleName('National University & College Campus Circle');
    if (type === 'neighborhood') setCircleName('Residential Neighborhood Safety Circle');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
              {t.account_profile}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <User className="w-6 h-6 text-rose-400" />
            Safety Profile & Trusted Emergency Network
          </h2>
          <p className="text-xs text-slate-300">
            Configure your universal circle, emergency duress codes, and prioritized trusted contacts.
          </p>
        </div>

        <button
          onClick={logout}
          className="text-xs bg-red-950/70 hover:bg-red-900 border border-red-500/40 text-red-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.sign_out}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-500/60 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-center gap-2 shadow-lg animate-pulse">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Safety profile, duress PINs, and emergency contacts updated successfully!</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Spoken feature announcements</h3>
          <p className="text-xs text-slate-400 mt-1">
            Off by default. Enable only when it is safe for others nearby to hear SHIELD.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          aria-pressed={voiceEnabled}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
            voiceEnabled
              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          {voiceEnabled ? 'Voice On' : 'Voice Off'}
        </button>
      </div>

      {/* Profile & Circle Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: User Identity */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="text-center pb-4 border-b border-slate-800">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-rose-900/40 mb-3">
              <User className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white">{name}</h3>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              Verified Shield Member
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Universal Safety Circle & Duress PINs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Universal Circle Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                Active Safety Circle Category
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Universal Adaptability</span>
            </div>

            <p className="text-xs text-slate-300">
              SHIELD adapts to your environment—switch circles whether commuting in a metro city, studying on campus, or working in a commercial district.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'city', label: 'City Transit Circle', icon: MapPin },
                { id: 'workplace', label: 'Workplace Tech Park', icon: Briefcase },
                { id: 'campus', label: 'Campus / Student', icon: Building },
                { id: 'neighborhood', label: 'Residential Society', icon: Home }
              ].map(c => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleCircleChange(c.id)}
                    className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      circleType === c.id
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold shadow-lg shadow-rose-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{c.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] block">Current Connected Network:</span>
              <span className="text-white font-bold">{circleName}</span>
            </div>
          </div>

          {/* Duress & Decoy PIN Hardware Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-rose-400" />
              Decoy Calculator & Silent Duress PIN Security
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-emerald-400 font-semibold block">Normal Decoy PIN</span>
                <p className="text-[11px] text-slate-400">Unlocks SHIELD from the calculator screen.</p>
                <input
                  type="password"
                  maxLength="4"
                  value={normalPin}
                  onChange={(e) => setNormalPin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-center text-emerald-400 font-mono text-base font-bold focus:outline-none"
                />
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-rose-900/50 space-y-1">
                <span className="text-rose-400 font-semibold block">Silent Duress PIN</span>
                <p className="text-[11px] text-slate-400">Stays as calculator but silently alerts contacts!</p>
                <input
                  type="password"
                  maxLength="4"
                  value={duressPin}
                  onChange={(e) => setDuressPin(e.target.value)}
                  className="w-full bg-slate-900 border border-rose-800 rounded-xl p-2 text-center text-rose-400 font-mono text-base font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Trusted Emergency Contacts Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-400" />
            Configured Emergency Trusted Contacts ({contacts.length})
          </span>
          <span className="text-[11px] text-slate-400">Notified immediately upon SOS or Duress</span>
        </div>

        {/* Existing Contacts List */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {contacts.map((c, idx) => (
            <div key={c.id || idx} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                    Priority #{idx + 1}
                  </span>
                  <h4 className="font-bold text-white text-xs mt-1.5">{c.name}</h4>
                  <p className="text-slate-400 font-mono text-[11px]">{c.phone}</p>
                </div>
                <button
                  onClick={() => handleRemoveContact(c.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">{c.relationship || 'Emergency Contact'}</span>
            </div>
          ))}
        </div>

        {/* Add Contact Row */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-bold text-slate-300 block">Add New Trusted Contact:</span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              placeholder="Contact Name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="+91 Mobile Number"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none"
            />
            <select
              value={newContactRel}
              onChange={(e) => setNewContactRel(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="Family">Family / Parent / Sibling</option>
              <option value="Colleague">Workplace Colleague</option>
              <option value="Friend">Friend / Roommate</option>
              <option value="Guardian">Guardian / Warden</option>
            </select>
            <button
              onClick={handleAddContact}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveProfile}
          className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs transition shadow-xl shadow-rose-900/40 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save All Safety Profile Changes</span>
        </button>
      </div>

    </div>
  );
};
