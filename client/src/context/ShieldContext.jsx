import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations } from '../translations/i18n.js';
import { hashPinWithPBKDF2 } from '../utils/crypto.js';

const ShieldContext = createContext(null);

export const ShieldProvider = ({ children }) => {
  const [lang, setLang] = useState('en');
  const [isDecoyUnlocked, setIsDecoyUnlocked] = useState(true); // default true for convenience, togglable to decoy
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

  const t = translations[lang] || translations.en;

  // Initialize PIN hashes with PBKDF2 (Normal: 1234, Duress: 9999)
  useEffect(() => {
    async function initPins() {
      const normal = await hashPinWithPBKDF2('1234');
      const duress = await hashPinWithPBKDF2('9999');
      setNormalPinHash(normal);
      setDuressPinHash(duress);
    }
    initPins();
  }, []);

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
      if (conRes.ok) setTrustedContacts(await conRes.json());
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
        if (parsed.data.is_deviated) {
          // Play subtle warning or update banner
        }
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
    if (enteredHash === normalPinHash || inputPin === '1234') {
      setIsDecoyUnlocked(true);
      return { success: true, mode: 'NORMAL_SHIELD' };
    }

    // Check Duress PIN: remains on calculator, but secretly triggers emergency alert!
    if (enteredHash === duressPinHash || inputPin === '9999') {
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
          user_name: 'Priya S.',
          timestamp: new Date().toISOString(),
          location: { lat: 13.0108, lng: 74.7938, name: 'NITK Main Campus' }
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
        setLang,
        t,
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
        latestSSEEvent
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
