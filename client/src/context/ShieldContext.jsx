import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations/i18n.js';
import { hashPinWithPBKDF2 } from '../utils/crypto.js';

const ShieldContext = createContext(null);

export const ShieldProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('shield_lang') || 'en');
  const [voiceEnabled, setVoiceEnabled] = useState(() => localStorage.getItem('shield_voice_enabled') === 'true');
  
  // User Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shield_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isDecoyUnlocked, setIsDecoyUnlocked] = useState(true);
  const [normalPinHash, setNormalPinHash] = useState('');
  const [duressPinHash, setDuressPinHash] = useState('');

  // Active Emergency & Notification State
  const [activeEmergency, setActiveEmergency] = useState(null);
  const [latestSSEEvent, setLatestSSEEvent] = useState(null);

  // Core Data Collections
  const [incidents, setIncidents] = useState([]);
  const [mapIncidents, setMapIncidents] = useState([]);
  const [safeHavens, setSafeHavens] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Active Features
  const [activeRide, setActiveRide] = useState(null);
  const [safeJourney, setSafeJourney] = useState(null);
  const [fakeCallOpen, setFakeCallOpen] = useState(false);

  // Active Safety Circle - Universal across all women
  const [safetyCircle, setSafetyCircle] = useState({
    name: "Universal Women's Transit & City Safety Network",
    member_count: 2450,
    active_patrols: 18
  });

  const t = translations[lang] || translations.en;

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('shield_lang', newLang);
  };

  const handleSetVoiceEnabled = (enabled) => {
    setVoiceEnabled(enabled);
    localStorage.setItem('shield_voice_enabled', String(enabled));
    if (!enabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('shield_user', JSON.stringify(userData));
    if (userData.circle_name) {
      setSafetyCircle(prev => ({
        ...prev,
        name: userData.circle_name
      }));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shield_user');
  };

  const updateUser = (fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      localStorage.setItem('shield_user', JSON.stringify(updated));
      return updated;
    });
    if (fields.circle_name) {
      setSafetyCircle(prev => ({ ...prev, name: fields.circle_name }));
    }
  };

  // Initialize PIN hashes with PBKDF2 (Normal: 1234, Duress: 9999 or user configured)
  useEffect(() => {
    async function initPins() {
      const normalPin = user?.normal_pin || '1234';
      const duressPin = user?.duress_pin || '9999';
      const normal = await hashPinWithPBKDF2(normalPin);
      const duress = await hashPinWithPBKDF2(duressPin);
      setNormalPinHash(normal);
      setDuressPinHash(duress);
    }
    initPins();
  }, [user]);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const [mapRes, incRes, havRes, patRes, conRes, logRes] = await Promise.all([
        fetch('/api/map'),
        fetch('/api/incidents'),
        fetch('/api/safe-havens'),
        fetch('/api/patterns'),
        fetch('/api/trusted-contacts'),
        fetch('/api/audit-log')
      ]);

      if (mapRes.ok) setMapIncidents(await mapRes.json());
      if (incRes.ok) setIncidents(await incRes.json());
      if (havRes.ok) setSafeHavens(await havRes.json());
      if (patRes.ok) setPatterns(await patRes.json());
      if (conRes.ok) {
        const conData = await conRes.json();
        setTrustedContacts(conData);
      }
      if (logRes.ok) {
        const logData = await logRes.json();
        setAuditLogs(logData.entries || []);
      }
    } catch (err) {
      console.warn('Initial data fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Connect to SSE Stream for multi-device realtime synchronization
  useEffect(() => {
    const eventSource = new EventSource('/api/realtime/stream');

    eventSource.onopen = () => {
      console.log('⚡ SHIELD Realtime SSE stream connected.');
    };

    eventSource.addEventListener('EMERGENCY_ALERT', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setActiveEmergency(parsed.data);
        setLatestSSEEvent(parsed);
      } catch (e) {
        console.error('Error parsing EMERGENCY_ALERT:', e);
      }
    });

    eventSource.addEventListener('RIDE_GPS_UPDATE', (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setLatestSSEEvent(parsed);
      } catch (e) {
        console.error('Error parsing RIDE_GPS_UPDATE:', e);
      }
    });

    eventSource.addEventListener('INCIDENT_STATUS_CHANGED', () => {
      fetchData();
    });

    eventSource.addEventListener('INCIDENT_REPORTED', () => {
      fetchData();
    });

    eventSource.onerror = (e) => {
      console.warn('SSE stream error/reconnecting...', e);
    };

    return () => {
      eventSource.close();
    };
  }, [fetchData]);

  // Unlock / Decoy PIN validation
  const testPin = async (inputPin) => {
    const enteredHash = await hashPinWithPBKDF2(inputPin);

    // Check Normal PIN: unlocks SHIELD
    if (enteredHash === normalPinHash || inputPin === (user?.normal_pin || '1234')) {
      setIsDecoyUnlocked(true);
      return { success: true, mode: 'NORMAL_SHIELD' };
    }

    // Check Duress PIN: remains on calculator, but secretly triggers emergency alert!
    if (enteredHash === duressPinHash || inputPin === (user?.duress_pin || '9999')) {
      try {
        await fetch('/api/duress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: 13.0108, lng: 74.7938 })
        });
      } catch (e) {
        console.error('Duress dispatch failed:', e);
      }
      return { success: true, mode: 'DURESS_TRIGGERED' };
    }

    return { success: false, mode: 'INVALID_PIN' };
  };

  // Immediate Hold-To-SOS Trigger
  const triggerSOS = async () => {
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: 13.0108, lng: 74.7938 })
      });
      if (res.ok) {
        setActiveEmergency({
          type: 'HOLD_FOR_HELP_ACTIVE',
          user_name: user?.name || 'Priya S.',
          timestamp: new Date().toISOString(),
          location: { lat: 13.0108, lng: 74.7938, name: user?.circle_name || 'City Safety Hub' }
        });
      }
    } catch (e) {
      console.error('SOS request failed:', e);
    }
  };

  const cancelEmergency = () => {
    setActiveEmergency(null);
  };

  return (
    <ShieldContext.Provider
      value={{
        lang,
        setLang: handleSetLang,
        voiceEnabled,
        setVoiceEnabled: handleSetVoiceEnabled,
        t,
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        isDecoyUnlocked,
        setIsDecoyUnlocked,
        testPin,
        activeEmergency,
        cancelEmergency,
        triggerSOS,
        incidents,
        mapIncidents,
        safeHavens,
        patterns,
        trustedContacts,
        auditLogs,
        fetchData,
        activeRide,
        setActiveRide,
        safeJourney,
        setSafeJourney,
        fakeCallOpen,
        setFakeCallOpen,
        latestSSEEvent,
        safetyCircle
      }}
    >
      {children}
    </ShieldContext.Provider>
  );
};

export const useShield = () => {
  const context = useContext(ShieldContext);
  if (!context) {
    throw new Error('useShield must be used within a ShieldProvider');
  }
  return context;
};
