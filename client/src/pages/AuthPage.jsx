import React, { useState } from 'react';
import { useShield } from '../context/ShieldContext.jsx';
import { 
  Shield, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { speakText } from '../utils/speech.js';

export const AuthPage = () => {
  const { t, lang, setLang, login } = useShield();
  const [isRegistering, setIsRegistering] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('Priya Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('priya.sharma@shield.org');
  const [password, setPassword] = useState('••••••••');
  const [circleType, setCircleType] = useState('city');
  const [circleName, setCircleName] = useState('Bengaluru Metro & Tech Corridors Circle');
  const [normalPin, setNormalPin] = useState('1234');
  const [duressPin, setDuressPin] = useState('9999');
  const [emergencyContactName, setEmergencyContactName] = useState('Aaditi Sharma (Sister)');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+91 98765 11223');

  const handleCircleChange = (type) => {
    setCircleType(type);
    if (type === 'city') setCircleName('Metro City Transit & Commercial Safety Circle');
    if (type === 'workplace') setCircleName('Tech Park & Workplace Women Circle');
    if (type === 'campus') setCircleName('National University & College Student Circle');
    if (type === 'neighborhood') setCircleName('Residential Neighborhood Safety Circle');
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const user = {
      name: fullName || 'Priya Sharma',
      phone: phone || '+91 98765 43210',
      email: email || 'priya@shield.org',
      circle_type: circleType,
      circle_name: circleName,
      normal_pin: normalPin,
      duress_pin: duressPin,
      trusted_contact: {
        name: emergencyContactName,
        phone: emergencyContactPhone
      }
    };
    login(user);
    speakText(`Welcome to SHIELD. Your safety circle is active.`);
  };

  const handleQuickDemoLogin = () => {
    const demoUser = {
      name: 'Priya Sharma',
      phone: '+91 98765 43210',
      email: 'priya.sharma@shield.org',
      circle_type: 'city',
      circle_name: 'Universal Women Transit & City Safety Circle',
      normal_pin: '1234',
      duress_pin: '9999',
      trusted_contact: {
        name: 'Aaditi Sharma (Sister)',
        phone: '+91 98765 11223'
      }
    };
    login(demoUser);
    speakText(`Welcome Priya. Universal safety protection active.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6">
      
      {/* Top Bar with Language Selector */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-900/40">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wider text-white">SHIELD</span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono font-bold ml-1.5">
              v2.0 Universal
            </span>
          </div>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center bg-slate-900 rounded-xl p-1.5 border border-slate-800">
          <Globe className="w-3.5 h-3.5 text-rose-400 ml-1 mr-1.5" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer pr-1"
          >
            <option value="en" className="bg-slate-900 text-white">English (EN)</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
            <option value="kn" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
            <option value="te" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
          </select>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-xl mx-auto w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 my-auto">
        
        {/* Banner Title */}
        <div className="text-center space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full inline-block">
            {t.all_women_empowered}
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegistering ? t.register_title : t.login_title}
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            {isRegistering ? t.register_subtitle : t.login_subtitle}
          </p>
        </div>

        {/* Quick Demo Access Button for Judges */}
        <button
          onClick={handleQuickDemoLogin}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-900/40 via-purple-900/40 to-slate-900 border border-rose-500/40 hover:border-rose-400 rounded-xl text-xs font-bold text-rose-200 flex items-center justify-center gap-2 transition shadow-lg group"
        >
          <Sparkles className="w-4 h-4 text-rose-400 group-hover:scale-110 transition" />
          <span>{t.demo_quick_login}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-1 text-rose-400" />
        </button>

        {/* Tabs: Sign In / Sign Up */}
        <div className="flex border-b border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setIsRegistering(false)}
            className={`flex-1 py-2.5 border-b-2 text-center transition ${
              !isRegistering ? 'border-rose-500 text-rose-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.sign_in}
          </button>
          <button
            onClick={() => setIsRegistering(true)}
            className={`flex-1 py-2.5 border-b-2 text-center transition ${
              isRegistering ? 'border-rose-500 text-rose-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {t.sign_up}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSignIn} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="text-slate-300 font-semibold block mb-1">{t.full_name}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">{t.phone_number}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">{t.email_address}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">{t.password}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Extended Safety Settings during Registration */}
          {isRegistering && (
            <div className="space-y-3.5 pt-2 border-t border-slate-800">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">{t.safety_circle_type}</label>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {[
                    { id: 'city', label: t.circle_city },
                    { id: 'workplace', label: t.circle_workplace },
                    { id: 'campus', label: t.circle_campus },
                    { id: 'neighborhood', label: t.circle_neighborhood }
                  ].map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCircleChange(c.id)}
                      className={`p-2 rounded-xl border text-center transition ${
                        circleType === c.id
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Decoy PIN Configuration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-[11px] font-semibold block mb-1">{t.normal_pin}</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={normalPin}
                    onChange={(e) => setNormalPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-emerald-400 font-mono text-sm tracking-widest focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-[11px] font-semibold block mb-1">{t.duress_pin}</label>
                  <input
                    type="password"
                    maxLength="4"
                    value={duressPin}
                    onChange={(e) => setDuressPin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-rose-400 font-mono text-sm tracking-widest focus:outline-none"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-[11px] font-semibold block mb-1">{t.trusted_contact_name}</label>
                  <input
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-300 text-[11px] font-semibold block mb-1">{t.trusted_contact_phone}</label>
                  <input
                    type="text"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs transition shadow-xl shadow-rose-900/40 active:scale-98 mt-2"
          >
            {isRegistering ? t.create_account_btn : t.sign_in}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            {isRegistering ? t.already_have_account : t.dont_have_account}
          </button>
        </div>

      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto w-full text-center text-xs text-slate-500 pt-4">
        SHIELD Universal Platform • Section 63 BSA 2023 Compliant • Privacy-First Women's Protection
      </div>

    </div>
  );
};

