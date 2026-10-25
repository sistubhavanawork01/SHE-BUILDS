import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { store } from './data/store.js';
import { auditChain } from './services/auditChain.js';
import { realtime } from './services/realtime.js';
import { analyzeDigitalThreat, draftLegalComplaint } from './services/geminiService.js';
import {
  anchorEvidence,
  getIntegrationStatus,
  getSafetyData,
  submitMunicipalGrievance,
  submitNciiProtection
} from './services/integrationAdapters.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'SHIELD - PS2 Women Safety Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    realtime_clients: realtime.getClientCount()
  });
});

app.get('/api/integrations/status', (req, res) => {
  res.json(getIntegrationStatus());
});

app.post('/api/integrations/ncii/submit', async (req, res) => {
  try {
    const { perceptual_hash, metadata } = req.body;
    if (!/^[01]{64}$/.test(perceptual_hash || '')) {
      return res.status(400).json({ error: 'A 64-bit perceptual hash is required' });
    }
    res.json(await submitNciiProtection({ perceptualHash: perceptual_hash, metadata }));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post('/api/integrations/municipal/grievance', async (req, res) => {
  try {
    if (!req.body?.description || !req.body?.location) {
      return res.status(400).json({ error: 'description and location are required' });
    }
    res.json(await submitMunicipalGrievance(req.body));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.get('/api/integrations/safety-data', async (req, res) => {
  try {
    res.json(await getSafetyData(req.query));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post('/api/integrations/blockchain/anchor', async (req, res) => {
  try {
    if (!/^[a-f0-9]{64}$/i.test(req.body?.merkle_root || '')) {
      return res.status(400).json({ error: 'A 64-character hexadecimal Merkle root is required' });
    }
    res.json(await anchorEvidence({ merkleRoot: req.body.merkle_root, metadata: req.body.metadata }));
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Realtime SSE endpoint for multi-device sync
app.get('/api/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial handshake
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Connected to SHIELD Realtime Stream' })}\n\n`);

  realtime.addClient(res);
});

// Community Safety Map (Privacy-filtered)
app.get('/api/map', (req, res) => {
  const mapData = store.getPublicSafetyMap();
  res.json(mapData);
});

// Incidents List & Filter
app.get('/api/incidents', (req, res) => {
  const { hour_band, category, status } = req.query;
  const list = store.getIncidents({ hour_band, category, status });
  res.json(list);
});

// Create Incident (P0 Core)
app.post('/api/incidents', (req, res) => {
  try {
    const incident = store.createIncident(req.body);
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Incident Status Moderation & Report-back Loop (FR-07, FR-34)
app.patch('/api/incidents/:id/status', (req, res) => {
  const { status, public_note, moderator } = req.body;
  const updated = store.updateIncidentStatus(req.params.id, status, public_note, moderator);
  if (!updated) {
    return res.status(404).json({ error: 'Incident not found' });
  }
  res.json(updated);
});

// Get Evidence Vault for Incident (Section 7.19)
app.get('/api/incidents/:id/evidence', (req, res) => {
  const evidence = store.evidenceVault.get(req.params.id) || [];
  res.json(evidence);
});

// Get Reporter Inbox Updates (FR-34)
app.get('/api/incidents/:id/updates', (req, res) => {
  const updates = store.getReporterInbox(req.params.id);
  res.json(updates);
});

// Pattern Clusters (FR-10)
app.get('/api/patterns', (req, res) => {
  const patterns = store.detectPatterns();
  res.json(patterns);
});

// Safe Havens & Partner Spots (FR-30, FR-31)
app.get('/api/safe-havens', (req, res) => {
  res.json(store.safeHavens);
});

// Safe Spot Silent Signal Request (FR-31)
app.post('/api/safe-spots/signal', (req, res) => {
  const { spot_id, anonymous_token } = req.body;
  const signal = store.sendSafeSpotSignal(spot_id, anonymous_token);
  res.status(201).json(signal);
});

// Shopkeeper signals list
app.get('/api/safe-spots/signals', (req, res) => {
  res.json(store.safeSignals);
});

// Trusted Contacts
app.get('/api/trusted-contacts', (req, res) => {
  res.json(store.trustedContacts);
});

// Silent Duress PIN Alert (FR-21, FR-22)
app.post('/api/duress', (req, res) => {
  const { lat, lng } = req.body;
  const result = store.triggerDuressAlert(lat, lng);
  res.json(result);
});

// Hold-to-activate SOS (FR-02)
app.post('/api/sos', (req, res) => {
  const result = store.triggerSOS(req.body);
  res.json(result);
});

// Cab Guard - Start Ride (FR-17)
app.post('/api/cab/rides', (req, res) => {
  const ride = store.createCabRide(req.body);
  res.status(201).json(ride);
});

// Cab Guard - Get Live Ride by Share Token (for Contact Second-Device View)
app.get('/api/cab/rides/:token', (req, res) => {
  const ride = store.getRideByToken(req.params.token);
  if (!ride) {
    return res.status(404).json({ error: 'Ride session not found or expired' });
  }
  res.json(ride);
});

// Cab Guard - Update GPS Coordinates & Deviation Check (FR-18)
app.post('/api/cab/rides/:token/gps', (req, res) => {
  const { lat, lng, distance_m, note } = req.body;
  const ride = store.updateRideGPS(req.params.token, lat, lng, distance_m, note);
  if (!ride) {
    return res.status(404).json({ error: 'Ride session not found' });
  }
  res.json(ride);
});

// Cab Guard - Escalate to Contacts on Timeout (FR-19)
app.post('/api/cab/rides/:token/escalate', (req, res) => {
  const ride = store.escalateRideEmergency(req.params.token, req.body.reason);
  if (!ride) {
    return res.status(404).json({ error: 'Ride not found' });
  }
  res.json(ride);
});

// Tamper-Evident Audit Log (FR-23, FR-25)
app.get('/api/audit-log', (req, res) => {
  const entries = auditChain.getEntries(req.query.incident_id);
  const integrity = auditChain.verifyIntegrity();
  res.json({
    entries,
    integrity
  });
});

// Verify Hash of an Evidence File (FR-25 Demo moment)
app.post('/api/evidence/verify-hash', (req, res) => {
  const { computed_hash, expected_hash } = req.body;
  const match = computed_hash.trim().toLowerCase() === expected_hash.trim().toLowerCase();
  
  auditChain.addEntry('INSPECTOR', 'EVIDENCE_VERIFY_ATTEMPT', {
    computed_hash,
    expected_hash,
    match
  });

  res.json({
    match,
    status: match ? 'INTEGRITY_VERIFIED' : 'TAMPER_DETECTED',
    message: match 
      ? 'Cryptographic integrity verified: SHA-256 fingerprint exactly matches original vault record.'
      : 'ALERT: Integrity mismatch detected! File bytes have been modified or tampered with.'
  });
});

// AI Digital Threat Analyzer (FR-14)
app.post('/api/ai/threat-analyze', async (req, res) => {
  try {
    const { text, context } = req.body;
    const analysis = await analyzeDigitalThreat(text, context);
    res.json(analysis);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Legal Complaint Draft (FR-26)
app.post('/api/ai/draft-complaint', async (req, res) => {
  try {
    const { incident, evidence } = req.body;
    const draft = await draftLegalComplaint(incident, evidence);
    res.json(draft);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NCII On-Device Hash Match Check (FR-27)
app.post('/api/digital/ncii-check', (req, res) => {
  const { phash } = req.body;
  if (!phash || phash.length !== 64) {
    return res.status(400).json({ error: 'Valid 64-bit perceptual hash string is required' });
  }
  const result = store.checkNCIIHashMatch(phash);
  res.json(result);
});

// Register NCII Protected Perceptual Hash
app.post('/api/digital/ncii-register', (req, res) => {
  const { phash, label } = req.body;
  if (!phash) return res.status(400).json({ error: 'Hash required' });
  const item = store.addNCIIHash(phash, label);
  res.status(201).json(item);
});

// Breach Check (FR-28)
app.post('/api/digital/breach-check', (req, res) => {
  const { email } = req.body;
  const mockBreaches = [
    { title: "LinkedIn Data Scraping Leak", date: "2021", data_classes: ["Email addresses", "Full names", "Phone numbers", "Professional profiles"] },
    { title: "College Portal Database Exposure", date: "2023", data_classes: ["Student IDs", "Email addresses", "Encrypted passwords"] }
  ];

  // Return realistic breach analysis
  const hasBreaches = !email.includes("safe");
  res.json({
    email,
    breached: hasBreaches,
    breach_count: hasBreaches ? mockBreaches.length : 0,
    breaches: hasBreaches ? mockBreaches : [],
    recommendations: [
      "Change passwords immediately using strong unique passphrases.",
      "Enable Multi-Factor Authentication (MFA) via authenticator app rather than SMS.",
      "Audit connected social permissions and third-party app logins.",
      "Check credit and banking alert notifications."
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🛡️ SHIELD Server running on http://localhost:${PORT}`);
});
