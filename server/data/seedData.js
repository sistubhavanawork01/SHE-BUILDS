export const initialIncidents = [
  {
    id: "INC-2026-081",
    user_id: "user-priya-01",
    category: "stalking",
    title: "Motorcycle Following Walkers near East Gate Underpass",
    description: "Two individuals on a black commuter bike with covered plates repeatedly circling and following students walking back from Surathkal junction. Speeding up when approached.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "NH-66 Underpass, Near East Gate",
      lat: 13.0118,
      lng: 74.7962,
      geohash: "tdmky1"
    },
    hour_band: "night", // night: 20:00 - 04:00
    report_count: 3,
    credibility: "high",
    has_evidence: true,
    evidence_count: 2,
    public_note: "Campus security informed. Night patrol frequency increased along this underpass stretch.",
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(), // 75 mins ago
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: "INC-2026-082",
    user_id: "user-ananya-02",
    category: "suspicious_activity",
    title: "Aggressive Loitering and Catcalling along Highway Pedestrian Walkway",
    description: "Group of 3 men loitering on the unlit service pathway, making intimidating remarks and blocking passage near the culvert.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "NH-66 Service Road, East Corridor",
      lat: 13.0125,
      lng: 74.7970,
      geohash: "tdmky1"
    },
    hour_band: "night",
    report_count: 2,
    credibility: "high",
    has_evidence: true,
    evidence_count: 1,
    public_note: "Verified by safety committee. Clustered with INC-2026-081 as an Emerging Safety Concern.",
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: "INC-2026-079",
    user_id: "user-sneha-03",
    category: "unsafe_area",
    title: "Completely Darkened Stretch with Non-functional Streetlights",
    description: "All four consecutive streetlights on the inner connector between Chem Engg Block and Beach Pavilion have been broken since Friday. Dense shadow spots.",
    severity: "medium",
    status: "verified",
    approximate_location: {
      name: "Beach Road Stretch behind Chem Dept",
      lat: 13.0089,
      lng: 74.7915,
      geohash: "tdmky0"
    },
    hour_band: "evening", // evening: 14:00 - 20:00
    report_count: 4,
    credibility: "medium",
    has_evidence: true,
    evidence_count: 1,
    public_note: "Estate maintenance ticket #ET-492 logged for lighting repair.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: "INC-2026-074",
    user_id: "user-divya-04",
    category: "harassment",
    title: "Verbal Harassment at Surathkal Bus Stand",
    description: "Individual at ticket shelter repeatedly shouting unsolicited comments and invading personal space.",
    severity: "medium",
    status: "resolved",
    approximate_location: {
      name: "Surathkal Town Bus Terminal",
      lat: 13.0035,
      lng: 74.7985,
      geohash: "tdmkv8"
    },
    hour_band: "morning", // morning: 08:00 - 14:00
    report_count: 1,
    credibility: "high",
    has_evidence: false,
    evidence_count: 0,
    public_note: "Surathkal Police station beat officer intervened. Suspect cautioned and moved off.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "INC-2026-085",
    user_id: "user-priya-01",
    category: "digital_harassment",
    title: "Targeted Anonymous Coercion & Morphed Image Threat",
    description: "Received Instagram DMs containing morphed photographs and blackmail demands threatening release unless contact details provided.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "Digital Domain (NITK Student Community)",
      lat: 13.0108,
      lng: 74.7938,
      geohash: "tdmky0"
    },
    hour_band: "night",
    report_count: 1,
    credibility: "high",
    has_evidence: true,
    evidence_count: 3,
    public_note: "Complaint drafted for 1930 Cybercrime Portal. NCII Perceptual hash added to shield blocklist.",
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString()
  }
];

export const initialSafeHavens = [
  {
    id: "haven-01",
    name: "Surathkal Police Station Outpost",
    type: "police",
    lat: 13.0075,
    lng: 74.7985,
    distance_m: 850,
    phone: "0824-2220531 / 112",
    hours: "Open 24/7",
    verified: true,
    address: "NH-66 Highway Junction, Surathkal",
    features: ["Women Helpdesk", "PCR Van On-site", "First Responder Unit"]
  },
  {
    id: "haven-02",
    name: "NITK Security Control Room & Emergency Hub",
    type: "police",
    lat: 13.0112,
    lng: 74.7942,
    distance_m: 220,
    phone: "0824-2474000 (Ext 3033)",
    hours: "Open 24/7",
    verified: true,
    address: "Campus Main Administrative Block",
    features: ["Campus Quick Response", "Female Security Officers", "Direct CCTV Monitoring"]
  },
  {
    id: "haven-03",
    name: "Srinivas Hospital 24x7 Emergency Trauma Care",
    type: "hospital",
    lat: 12.9980,
    lng: 74.8090,
    distance_m: 1800,
    phone: "0824-2474455 / 108",
    hours: "Open 24/7",
    verified: true,
    address: "Mukka, Surathkal",
    features: ["Emergency ICU", "24x7 Ambulance", "Medico-Legal Care Desk"]
  },
  {
    id: "haven-04",
    name: "Padmavati Multi-Speciality Clinic & ER",
    type: "hospital",
    lat: 13.0050,
    lng: 74.7990,
    distance_m: 950,
    phone: "0824-2275210",
    hours: "Open 24/7",
    verified: true,
    address: "Main Road, Surathkal Town",
    features: ["Emergency First Aid", "Open Doctor on Call"]
  },
  {
    id: "haven-05",
    name: "Apollo Pharmacy 24x7",
    type: "pharmacy",
    lat: 13.0090,
    lng: 74.7970,
    distance_m: 520,
    phone: "0824-2276000",
    hours: "Open 24/7",
    verified: true,
    address: "Opposite Bus Stand Commercial Complex",
    features: ["Brightly Lit Store", "CCTV Covered", "Trained Staff"]
  },
  {
    id: "haven-06",
    name: "MedPlus 24x7 Healthcare Pharmacy",
    type: "pharmacy",
    lat: 13.0060,
    lng: 74.7960,
    distance_m: 710,
    phone: "0824-2277100",
    hours: "Open 24/7",
    verified: true,
    address: "Near Surathkal Railway Cross Road",
    features: ["Emergency Medical Supplies", "24hr Staff Presence"]
  },
  {
    id: "haven-07",
    name: "Cafe Coffee Day Express (Safe Spot #01)",
    type: "safe_spot",
    lat: 13.0115,
    lng: 74.7955,
    distance_m: 310,
    phone: "Staff Desk: 0824-2479911",
    hours: "Open 24/7",
    verified: true,
    qr_token: "SPOT-CCD-SURATHKAL-01",
    address: "Campus Commercial Arc, NH-66 Edge",
    features: ["Registered SHIELD Safe Spot", "Discreet Staff Assistance", "Safe Waiting Area"]
  },
  {
    id: "haven-08",
    name: "QuickBite 24x7 Mart (Safe Spot #02)",
    type: "safe_spot",
    lat: 13.0125,
    lng: 74.7930,
    distance_m: 430,
    phone: "Staff Desk: 0824-2479922",
    hours: "Open 24/7",
    verified: true,
    qr_token: "SPOT-QB-SURATHKAL-02",
    address: "Hostel Zone Convenience Square",
    features: ["Registered SHIELD Safe Spot", "Emergency Contact Hotlink", "Well Lit Entrance"]
  }
];

export const initialTrustedContacts = [
  {
    id: "contact-01",
    name: "Aaditi Sharma (Sister)",
    phone: "+91 98765 43210",
    relationship: "Family",
    priority: 1,
    notify_sms: true,
    notify_realtime: true
  },
  {
    id: "contact-02",
    name: "Kavya Menon (Hostel Roommate)",
    phone: "+91 98450 12345",
    relationship: "Roommate / Circle Lead",
    priority: 2,
    notify_sms: true,
    notify_realtime: true
  },
  {
    id: "contact-03",
    name: "Campus Security Emergency Desk",
    phone: "112 / 0824-2474000",
    relationship: "Campus Authority",
    priority: 3,
    notify_sms: false,
    notify_realtime: true
  }
];

export const initialSafetyCircle = {
  id: "circle-nitk-01",
  name: "NITK Surathkal - Women Students Safety Circle",
  member_count: 148,
  active_patrols: 4,
  recent_notices: [
    {
      id: "cn-01",
      title: "Night Escort Service Available from East Gate",
      detail: "Campus security provides escorted walking groups from Surathkal Bus Stand to Hostel Towers between 21:00 and 01:00.",
      time: "Today, 18:00"
    },
    {
      id: "cn-02",
      title: "Active Alert: Route Concern along NH-66 Underpass",
      detail: "Avoid walking alone near East Gate underpass tonight. Multiple reports of suspicious vehicle loitering.",
      time: "Today, 20:15",
      urgent: true
    }
  ]
};

// Seed Cab Guard Demo Route and Deviation Waypoints
export const demoCabRoute = {
  start: { name: "NITK Main Gate", lat: 13.0108, lng: 74.7938 },
  destination: { name: "Mangalore City Centre / Mall", lat: 12.8700, lng: 74.8400 },
  plate: "KA 19 MD 4829",
  driver_name: "Ramesh K.",
  vehicle_model: "White Swift Dzire",
  corridor_meters: 300,
  polyline: [
    [13.0108, 74.7938],
    [13.0075, 74.7960],
    [13.0040, 74.7985],
    [12.9980, 74.8030],
    [12.9850, 74.8090],
    [12.9600, 74.8180],
    [12.9200, 74.8290],
    [12.8700, 74.8400]
  ],
  // Simulation waypoints showing normal progression then a sharp deviation off the NH-66 corridor
  simulationWaypoints: [
    { lat: 13.0108, lng: 74.7938, step: 0, timeSec: 0, status: "On Route", note: "Boarded cab at NITK Main Gate" },
    { lat: 13.0075, lng: 74.7960, step: 1, timeSec: 4, status: "On Route", note: "Approaching Surathkal flyover along corridor" },
    { lat: 13.0040, lng: 74.7985, step: 2, timeSec: 8, status: "On Route", note: "Passing Surathkal Junction - corridor distance 40m (OK)" },
    // Here vehicle takes an unexpected sharp right onto an isolated dark dirt track away from highway:
    { lat: 13.0010, lng: 74.7890, step: 3, timeSec: 12, status: "Warning", note: "Approaching boundary - 220m from corridor" },
    { lat: 12.9970, lng: 74.7810, step: 4, timeSec: 16, status: "DEVIATION_ALERT", note: "CORRIDOR BREACH: 620m away from authorized route! Heading into isolated road." },
    { lat: 12.9940, lng: 74.7760, step: 5, timeSec: 20, status: "CRITICAL_ALERT", note: "Unplanned stop in secluded area. User prompt triggered!" }
  ]
};

// Seed known NCII Perceptual Hashes for demonstration
export const knownNCIIHashes = [
  {
    id: "ncii-ref-001",
    phash: "1011001110010110010110101010010111001101010101001011011010010111", // 64-bit binary string
    label: "Flagged intimate morph report #4928",
    created_at: "2026-10-20T10:00:00Z"
  }
];

