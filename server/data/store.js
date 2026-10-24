import { 
  initialIncidents, 
  initialSafeHavens, 
  initialTrustedContacts, 
  initialSafetyCircle, 
  demoCabRoute,
  knownNCIIHashes 
} from './seedData.js';
import { auditChain } from '../services/auditChain.js';
import { realtime } from '../services/realtime.js';

class DataStore {
  constructor() {
    this.incidents = [...initialIncidents];
    this.safeHavens = [...initialSafeHavens];
    this.trustedContacts = [...initialTrustedContacts];
    this.safetyCircle = { ...initialSafetyCircle };
    this.cabRides = new Map();
    this.safeSignals = [];
    this.nciiHashes = [...knownNCIIHashes];
    this.evidenceVault = new Map();
    this.reportUpdates = new Map(); // incidentId -> array of updates

    // Initialize initial evidence items for seed incident
    this.evidenceVault.set("INC-2026-081", [
      {
        id: "EVID-001",
        incident_id: "INC-2026-081",
        file_name: "dashcam_bike_underpass_night.jpg",
        file_type: "image/jpeg",
        file_size_kb: 482,
        sha256_hash: "a4f892c90e38d7bb29381fcae12760842db13469b62a690e5170d740f952f4ba",
        created_at: new Date(Date.now() - 1000 * 60 * 70).toISOString()
      },
      {
        id: "EVID-002",
        incident_id: "INC-2026-081",
        file_name: "audio_note_surathkal_east_gate.m4a",
        file_type: "audio/m4a",
        file_size_kb: 1240,
        sha256_hash: "8ef54109b43e88dc08c8710fa5323a2283921ba096ef50785055b8ef92d52187",
        created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString()
      }
    ]);

    // Initial audit chain logs for seed evidence
    auditChain.addEntry("user-priya-01", "UPLOAD_EVIDENCE", {
      incident_id: "INC-2026-081",
      evidence_id: "EVID-001",
      file_name: "dashcam_bike_underpass_night.jpg",
      hash: "a4f892c90e38d7bb29381fcae12760842db13469b62a690e5170d740f952f4ba"
    });

    auditChain.addEntry("user-priya-01", "UPLOAD_EVIDENCE", {
      incident_id: "INC-2026-081",
      evidence_id: "EVID-002",
      file_name: "audio_note_surathkal_east_gate.m4a",
      hash: "8ef54109b43e88dc08c8710fa5323a2283921ba096ef50785055b8ef92d52187"
    });

    // Initial report updates for reporter inbox
    this.reportUpdates.set("INC-2026-081", [
      {
        id: "UPD-01",
        incident_id: "INC-2026-081",
        status: "received",
        message: "Your report has been securely registered in SHIELD Vault. Private evidence hashes anchored.",
        created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString()
      },
      {
        id: "UPD-02",
        incident_id: "INC-2026-081",
        status: "verified",
        message: "Report verified by Safety Committee. Anonymized warning published to Community Map.",
        created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString()
      },
      {
        id: "UPD-03",
        incident_id: "INC-2026-081",
        status: "action_taken",
        message: "Campus Security and Surathkal Police outpost deployed PCR Van 04 to East Gate Underpass.",
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString()
      }
    ]);
  }

  // --- Incidents & Privacy Filtering ---
  getIncidents(filters = {}) {
    let result = [...this.incidents];

    if (filters.hour_band && filters.hour_band !== 'all') {
      result = result.filter(i => i.hour_band === filters.hour_band);
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(i => i.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter(i => i.status === filters.status);
    }

    return result;
  }

  getPublicSafetyMap() {
    // Privacy Filter (FR-06): Strip user_id, exact coordinates, private evidence URLs
    // Expose only approximate area, category, severity, recency, credibility, public notes
    return this.incidents
      .filter(inc => inc.status !== 'rejected')
      .map(inc => ({
        id: inc.id,
        category: inc.category,
        title: inc.title,
        severity: inc.severity,
        status: inc.status,
        hour_band: inc.hour_band,
        approximate_location: {
          name: inc.approximate_location.name,
          lat: Number(inc.approximate_location.lat.toFixed(3)), // Generalize coordinates to ~100m
          lng: Number(inc.approximate_location.lng.toFixed(3)),
          geohash: inc.approximate_location.geohash
        },
        report_count: inc.report_count || 1,
        credibility: inc.credibility,
        public_note: inc.public_note || null,
        created_at: inc.created_at,
        is_cluster: this.detectPatterns().some(p => p.incident_ids?.includes(inc.id))
      }));
  }

  createIncident(data) {
    const newId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Approximate jitter for privacy: ~100m offset
    const latJitter = (Math.random() - 0.5) * 0.002;
    const lngJitter = (Math.random() - 0.5) * 0.002;

    const incident = {
      id: newId,
      user_id: data.user_id || "anonymous-user",
      category: data.category || "unsafe_area",
      title: data.title || `${data.category} reported`,
      description: data.description || "",
      severity: data.severity || "medium",
      status: "pending", // enters moderation queue
      approximate_location: {
        name: data.location_name || "Campus Community Vicinity",
        lat: Number(((data.lat || 13.0108) + latJitter).toFixed(4)),
        lng: Number(((data.lng || 74.7938) + lngJitter).toFixed(4)),
        geohash: data.geohash || "tdmky0"
      },
      hour_band: data.hour_band || this.getCurrentHourBand(),
      report_count: 1,
      credibility: "medium",
      has_evidence: !!data.evidence && data.evidence.length > 0,
      evidence_count: data.evidence ? data.evidence.length : 0,
      public_note: null,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
    };

    this.incidents.unshift(incident);

    // Store evidence if any
    if (data.evidence && Array.isArray(data.evidence)) {
      const evidenceList = data.evidence.map((ev, idx) => ({
        id: `EVID-${Date.now()}-${idx}`,
        incident_id: newId,
        file_name: ev.file_name || `evidence_${idx + 1}.dat`,
        file_type: ev.file_type || "application/octet-stream",
        file_size_kb: ev.file_size_kb || 256,
        sha256_hash: ev.sha256_hash,
        created_at: new Date().toISOString()
      }));
      this.evidenceVault.set(newId, evidenceList);

      // Audit chain logging
      for (const ev of evidenceList) {
        auditChain.addEntry(incident.user_id, "UPLOAD_EVIDENCE", {
          incident_id: newId,
          evidence_id: ev.id,
          file_name: ev.file_name,
          hash: ev.sha256_hash
        });
      }
    }

    // Reporter updates inbox
    this.reportUpdates.set(newId, [{
      id: `UPD-${Date.now()}`,
      incident_id: newId,
      status: "received",
      message: "Report received. Protected with SHA-256 fingerprinting. Submitted for moderation.",
      created_at: new Date().toISOString()
    }]);

    // Realtime notification
    realtime.broadcast('INCIDENT_REPORTED', {
      incident_id: newId,
      category: incident.category,
      severity: incident.severity,
      approx_location: incident.approximate_location.name
    });

    return incident;
  }

  getCurrentHourBand() {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 14) return 'morning';
    if (hour >= 14 && hour < 20) return 'evening';
    return 'night';
  }

  // --- Pattern Detection (FR-10) ---
  detectPatterns() {
    const patterns = [];
    const geohashGroups = {};

    // Group active high/medium incidents by approximate geohash
    for (const inc of this.incidents) {
      if (inc.status === 'rejected') continue;
      const key = `${inc.approximate_location.geohash}_${inc.hour_band}`;
      if (!geohashGroups[key]) geohashGroups[key] = [];
      geohashGroups[key].push(inc);
    }

    for (const [key, incs] of Object.entries(geohashGroups)) {
      if (incs.length >= 2) {
        patterns.push({
          id: `PATTERN-${key}`,
          title: `Emerging Safety Concern: ${incs.length} Linked Reports`,
          area_name: incs[0].approximate_location.name,
          hour_band: incs[0].hour_band,
          incident_count: incs.length,
          incident_ids: incs.map(i => i.id),
          concern_level: incs.some(i => i.severity === 'high') ? 'CRITICAL_CONCERN' : 'ELEVATED_CONCERN',
          recommendation: "Travel in escorted pairs or utilize campus security escort after 20:00."
        });
      }
    }

    return patterns;
  }

  // --- Moderation & Report-Back (FR-07, FR-34) ---
  updateIncidentStatus(incidentId, status, publicNote = null, moderator = "moderator-campus-01") {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) return null;

    incident.status = status;
    if (publicNote) incident.public_note = publicNote;

    auditChain.addEntry(moderator, "MODERATION_UPDATE", {
      incident_id: incidentId,
      new_status: status,
      public_note: publicNote
    });

    // Add to reporter's private inbox
    const statusMessages = {
      verified: "Your report has been verified by safety coordinators and published to community map warnings.",
      resolved: "Incident marked as RESOLVED. Security action complete; risk mitigated.",
      rejected: "Report reviewed. Insufficient location data to issue community bulletin."
    };

    if (!this.reportUpdates.has(incidentId)) {
      this.reportUpdates.set(incidentId, []);
    }

    const updateEntry = {
      id: `UPD-${Date.now()}`,
      incident_id: incidentId,
      status: status,
      message: publicNote ? `${statusMessages[status] || 'Status updated.'} Note: ${publicNote}` : (statusMessages[status] || 'Status updated.'),
      created_at: new Date().toISOString()
    };

    this.reportUpdates.get(incidentId).unshift(updateEntry);

    realtime.broadcast('INCIDENT_STATUS_CHANGED', {
      incident_id: incidentId,
      status,
      public_note: publicNote
    });

    return incident;
  }

  getReporterInbox(incidentId) {
    return this.reportUpdates.get(incidentId) || [];
  }

  // --- Cab Guard Rides (FR-17, FR-18, FR-19) ---
  createCabRide(data) {
    const rideId = `RIDE-${Date.now().toString(36).toUpperCase()}`;
    const shareToken = `SHIELD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    const ride = {
      id: rideId,
      share_token: shareToken,
      user_name: data.user_name || "Priya S.",
      plate: data.plate || demoCabRoute.plate,
      driver_name: data.driver_name || demoCabRoute.driver_name,
      vehicle_model: data.vehicle_model || demoCabRoute.vehicle_model,
      start_location: data.start_location || demoCabRoute.start,
      destination: data.destination || demoCabRoute.destination,
      polyline: demoCabRoute.polyline,
      corridor_meters: data.corridor_meters || 300,
      current_location: { ...demoCabRoute.start },
      status: "active",
      distance_from_corridor_m: 0,
      is_deviated: false,
      escalation_status: "normal", // normal, prompt_active, escalated
      started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 1000 * 60 * 180).toISOString(),
      history: []
    };

    this.cabRides.set(shareToken, ride);

    realtime.broadcast('RIDE_STARTED', {
      share_token: shareToken,
      plate: ride.plate,
      driver_name: ride.driver_name,
      destination: ride.destination.name
    });

    return ride;
  }

  getRideByToken(shareToken) {
    return this.cabRides.get(shareToken) || null;
  }

  updateRideGPS(shareToken, lat, lng, distanceMeters, statusNote = "GPS Ping") {
    const ride = this.cabRides.get(shareToken);
    if (!ride) return null;

    ride.current_location = { lat, lng };
    ride.distance_from_corridor_m = distanceMeters;
    ride.is_deviated = distanceMeters > ride.corridor_meters;

    const event = {
      timestamp: new Date().toISOString(),
      lat,
      lng,
      distance_m: distanceMeters,
      is_deviated: ride.is_deviated,
      note: statusNote
    };

    ride.history.push(event);

    if (ride.is_deviated && ride.escalation_status === 'normal') {
      ride.escalation_status = 'prompt_active';
      auditChain.addEntry('CAB_GUARD_SYSTEM', 'ROUTE_DEVIATION_DETECTED', {
        share_token: shareToken,
        distance_m: distanceMeters,
        location: { lat, lng }
      });
    }

    realtime.broadcast('RIDE_GPS_UPDATE', {
      share_token: shareToken,
      lat,
      lng,
      distance_from_corridor_m: distanceMeters,
      is_deviated: ride.is_deviated,
      escalation_status: ride.escalation_status,
      note: statusNote
    });

    return ride;
  }

  escalateRideEmergency(shareToken, reason = "DEVIATION_TIMEOUT") {
    const ride = this.cabRides.get(shareToken);
    if (!ride) return null;

    ride.escalation_status = 'escalated';

    auditChain.addEntry('CAB_GUARD_SYSTEM', 'EMERGENCY_ESCALATION_DISPATCHED', {
      share_token: shareToken,
      plate: ride.plate,
      last_location: ride.current_location,
      reason
    });

    realtime.broadcast('EMERGENCY_ALERT', {
      type: 'CAB_GUARD_DEVIATION_ALERT',
      severity: 'CRITICAL',
      share_token: shareToken,
      plate: ride.plate,
      driver: ride.driver_name,
      location: ride.current_location,
      reason: "Vehicle breached 300m safety corridor. User response prompt timed out.",
      timestamp: new Date().toISOString()
    });

    return ride;
  }

  // --- Duress & SOS Alerts ---
  triggerDuressAlert(lat = 13.0108, lng = 74.7938) {
    auditChain.addEntry('DURESS_SYSTEM', 'SILENT_DURESS_TRIGGERED', {
      mode: 'DECOY_PIN_ENTERED',
      lat,
      lng
    });

    realtime.broadcast('EMERGENCY_ALERT', {
      type: 'SILENT_DURESS_ALARM',
      severity: 'CRITICAL_SILENT',
      message: "SILENT ALARM: User entered duress PIN on disguised calculator. Silent beacon active.",
      location: { lat, lng, name: "NITK Vicinity" },
      timestamp: new Date().toISOString()
    });

    return { status: "SILENT_ALERT_DISPATCHED" };
  }

  triggerSOS(data = {}) {
    auditChain.addEntry('USER', 'HOLD_FOR_HELP_TRIGGERED', {
      lat: data.lat || 13.0108,
      lng: data.lng || 74.7938,
      type: data.type || 'IMMEDIATE_SOS'
    });

    realtime.broadcast('EMERGENCY_ALERT', {
      type: 'IMMEDIATE_SOS_TRIGGERED',
      severity: 'HIGH_URGENT',
      user_name: "Priya S.",
      location: { lat: data.lat || 13.0108, lng: data.lng || 74.7938 },
      timestamp: new Date().toISOString()
    });

    return { status: "SOS_ACTIVATED" };
  }

  // --- Safe Spots & Silent Signals (FR-31) ---
  sendSafeSpotSignal(spotId, anonymousToken) {
    const haven = this.safeHavens.find(h => h.id === spotId || h.qr_token === spotId);
    const signal = {
      id: `SIG-${Date.now()}`,
      spot_id: spotId,
      spot_name: haven ? haven.name : "Partner Safe Spot",
      anonymous_token: anonymousToken || `USER-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "assistance_requested",
      created_at: new Date().toISOString()
    };

    this.safeSignals.unshift(signal);

    auditChain.addEntry('SAFE_SPOT_BEACON', 'SILENT_SIGNAL_REQUEST', {
      spot_id: spotId,
      token: signal.anonymous_token
    });

    realtime.broadcast('SAFE_SPOT_ASSISTANCE_REQUEST', signal);
    return signal;
  }

  // --- NCII Hashes (FR-27) ---
  checkNCIIHashMatch(newPhash) {
    // Check Hamming distance against known blocked perceptual hashes
    let closestMatch = null;
    let minDistance = 64;

    for (const record of this.nciiHashes) {
      let dist = 0;
      for (let i = 0; i < 64; i++) {
        if (newPhash[i] !== record.phash[i]) {
          dist++;
        }
      }
      if (dist < minDistance) {
        minDistance = dist;
        closestMatch = record;
      }
    }

    // Hamming distance <= 10 signifies near identical / resized / slightly cropped image
    const isMatched = minDistance <= 10;

    return {
      match_found: isMatched,
      hamming_distance: minDistance,
      threshold: 10,
      status: isMatched ? "FLAGGED_NCII_BLOCKED" : "CLEAN_HASH",
      record: isMatched ? closestMatch : null
    };
  }

  addNCIIHash(phash, label = "User Shield Protected Perceptual Fingerprint") {
    const item = {
      id: `ncii-${Date.now()}`,
      phash,
      label,
      created_at: new Date().toISOString()
    };
    this.nciiHashes.push(item);
    return item;
  }
}

export const store = new DataStore();

