// Universal Seed Data for Women's Safety across Cities, Neighborhoods, Transit, and Campuses

export const initialIncidents = [
  {
    id: "INC-2026-081",
    user_id: "user-priya-01",
    category: "stalking",
    title: "Unmarked Motorcycle Following Pedestrians Near Transit Underpass",
    description: "Two individuals on a commuter bike with covered registration repeatedly circling and trailing women walking back from the transit junction. Speeding up when approached.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "Highway Transit Underpass, East Sector",
      lat: 13.0118,
      lng: 74.7962,
      geohash: "tdmky1"
    },
    hour_band: "night", // night: 20:00 - 04:00
    report_count: 3,
    credibility: "high",
    has_evidence: true,
    evidence_count: 2,
    public_note: "Local Police and security control room alerted. Night PCR van patrol frequency doubled along this pedestrian stretch.",
    created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: "INC-2026-082",
    user_id: "user-ananya-02",
    category: "suspicious_activity",
    title: "Aggressive Loitering and Catcalling along Service Road Walkway",
    description: "Group of 3 men loitering on the unlit service pathway, making intimidating remarks and blocking passage near the walkway culvert.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "Main Service Road, Sector 4 Corridor",
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
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
  },
  {
    id: "INC-2026-079",
    user_id: "user-sneha-03",
    category: "unsafe_area",
    title: "Completely Darkened Stretch with Non-functional Streetlights",
    description: "Four consecutive streetlights on the connecting road between commercial hub and residential quarters have been non-functional. Dense shadow spots.",
    severity: "medium",
    status: "verified",
    approximate_location: {
      name: "Connector Road behind Commercial Complex",
      lat: 13.0089,
      lng: 74.7915,
      geohash: "tdmky0"
    },
    hour_band: "evening", // evening: 14:00 - 20:00
    report_count: 4,
    credibility: "medium",
    has_evidence: true,
    evidence_count: 1,
    public_note: "Municipal lighting ticket #ET-492 escalated for urgent repair.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString()
  },
  {
    id: "INC-2026-074",
    user_id: "user-divya-04",
    category: "harassment",
    title: "Verbal Harassment at Metro / Central Bus Terminal",
    description: "Individual near ticket booking shelter repeatedly shouting unsolicited comments and invading personal space.",
    severity: "medium",
    status: "resolved",
    approximate_location: {
      name: "Central Bus & Transit Terminal",
      lat: 13.0035,
      lng: 74.7985,
      geohash: "tdmkv8"
    },
    hour_band: "morning", // morning: 08:00 - 14:00
    report_count: 1,
    credibility: "high",
    has_evidence: false,
    evidence_count: 0,
    public_note: "Local Police beat officer intervened. Suspect removed from transit premises.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: "INC-2026-085",
    user_id: "user-priya-01",
    category: "digital_harassment",
    title: "Targeted Anonymous Coercion & Morphed Image Blackmail",
    description: "Received Instagram DMs containing morphed photographs and blackmail demands threatening release unless contact details provided.",
    severity: "high",
    status: "verified",
    approximate_location: {
      name: "Digital Domain (National Cyber Circle)",
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
    name: "Central Police Station & Women Helpdesk",
    type: "police",
    lat: 13.0075,
    lng: 74.7985,
    distance_m: 850,
    phone: "112 / 080-22205310",
    hours: "Open 24/7",
    verified: true,
    address: "National Highway Junction & Police Outpost",
    features: ["Women Helpdesk", "PCR Van On-site", "First Responder Unit"]
  },
  {
    id: "haven-02",
    name: "Emergency Security Control Room Hub",
    type: "police",
    lat: 13.0112,
    lng: 74.7942,
    distance_m: 220,
    phone: "112 / Emergency Helpline",
    hours: "Open 24/7",
    verified: true,
    address: "Main Civic Administration Complex",
    features: ["Quick Response Team", "Female Officers On Duty", "Direct CCTV Monitoring"]
  },
  {
    id: "haven-03",
    name: "Apollo Multispecialty 24x7 Emergency Trauma Care",
    type: "hospital",
    lat: 12.9980,
    lng: 74.8090,
    distance_m: 1800,
    phone: "108 / 080-24744550",
    hours: "Open 24/7",
    verified: true,
    address: "Healthcare Corridor, Main Boulevard",
    features: ["Emergency ICU", "24x7 Ambulance", "Medico-Legal Care Desk"]
  },
  {
    id: "haven-04",
    name: "LifeCare Multi-Speciality Clinic & ER",
    type: "hospital",
    lat: 13.0050,
    lng: 74.7990,
    distance_m: 950,
    phone: "080-22752100",
    hours: "Open 24/7",
    verified: true,
    address: "City Main Road Cross",
    features: ["Emergency First Aid", "Doctor on Duty 24x7"]
  },
  {
    id: "haven-05",
    name: "Apollo Pharmacy 24x7",
    type: "pharmacy",
    lat: 13.0090,
    lng: 74.7970,
    distance_m: 520,
    phone: "080-22760000",
    hours: "Open 24/7",
    verified: true,
    address: "Opposite Transit Commercial Complex",
    features: ["Brightly Lit Store", "CCTV Covered", "Trained Staff"]
  },
  {
    id: "haven-06",
    name: "MedPlus 24x7 Healthcare Pharmacy",
    type: "pharmacy",
    lat: 13.0060,
    lng: 74.7960,
    distance_m: 710,
    phone: "080-22771000",
    hours: "Open 24/7",
    verified: true,
    address: "Metro Cross Station Road",
    features: ["Emergency Medical Supplies", "24hr Staff Presence"]
  },
  {
    id: "haven-07",
    name: "Cafe Coffee Day Express (Safe Spot #01)",
    type: "safe_spot",
    lat: 13.0115,
    lng: 74.7955,
    distance_m: 310,
    phone: "Front Desk: 080-24799110",
    hours: "Open 24/7",
    verified: true,
    qr_token: "SPOT-CCD-01",
    address: "Main Commercial Arc & Highway Edge",
    features: ["Registered SHIELD Safe Spot", "Discreet Staff Assistance", "Safe Waiting Area"]
  },
  {
    id: "haven-08",
    name: "QuickBite 24x7 Express Mart (Safe Spot #02)",
    type: "safe_spot",
    lat: 13.0125,
    lng: 74.7930,
    distance_m: 430,
    phone: "Front Desk: 080-24799220",
    hours: "Open 24/7",
    verified: true,
    qr_token: "SPOT-QB-02",
    address: "Residential Square Center",
    features: ["Registered SHIELD Safe Spot", "Emergency Contact Hotlink", "Well Lit Entrance"]
  }
];

export const initialTrustedContacts = [
  {
    id: "contact-01",
    name: "Aaditi Sharma (Sister)",
    phone: "+91 98765 43210",
    relationship: "Family Lead",
    priority: 1,
    notify_sms: true,
    notify_realtime: true
  },
  {
    id: "contact-02",
    name: "Kavya Menon (Colleague / Roommate)",
    phone: "+91 98450 12345",
    relationship: "Safety Circle Peer",
    priority: 2,
    notify_sms: true,
    notify_realtime: true
  },
  {
    id: "contact-03",
    name: "National Emergency Police Control",
    phone: "112",
    relationship: "Official First Responder",
    priority: 3,
    notify_sms: false,
    notify_realtime: true
  }
];

export const initialSafetyCircle = {
  id: "circle-universal-01",
  name: "Universal Women's Safety Circle (City & Tech Corridors)",
  member_count: 2450,
  active_patrols: 18,
  recent_notices: [
    {
      id: "cn-01",
      title: "Night Escort & PCR Patrols Active",
      detail: "City police and women transport escorts active across major metro stations and highway corridors from 20:00 to 04:00.",
      time: "Today, 18:00"
    },
    {
      id: "cn-02",
      title: "Route Concern Notice: Unlit Underpass Section",
      detail: "Avoid unescorted walking along Sector 4 transit underpass tonight. Multiple reports of suspicious motorcycle loitering.",
      time: "Today, 20:15",
      urgent: true
    }
  ]
};

// Seed Cab Guard Demo Route and Deviation Waypoints
export const demoCabRoute = {
  start: { name: "City Center Station", lat: 13.0108, lng: 74.7938 },
  destination: { name: "Commercial District / Tech Park", lat: 12.8700, lng: 74.8400 },
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
  simulationWaypoints: [
    { lat: 13.0108, lng: 74.7938, step: 0, timeSec: 0, status: "On Route", note: "Boarded cab at City Center Station. 300m safety corridor locked." },
    { lat: 13.0075, lng: 74.7960, step: 1, timeSec: 4, status: "On Route", note: "Approaching main highway flyover along corridor. Telemetry normal." },
    { lat: 13.0040, lng: 74.7985, step: 2, timeSec: 8, status: "On Route", note: "Passing Transit Junction - corridor distance 40m (Safe)." },
    { lat: 13.0010, lng: 74.7890, step: 3, timeSec: 12, status: "Warning", note: "Approaching corridor limit: 220m away from authorized route toward bypass." },
    { lat: 12.9970, lng: 74.7810, step: 4, timeSec: 16, status: "DEVIATION_ALERT", note: "CORRIDOR BREACH: 620m away from authorized highway! Diverting down isolated road." },
    { lat: 12.9940, lng: 74.7760, step: 5, timeSec: 20, status: "CRITICAL_ALERT", note: "Vehicle stopped in dark secluded area. 'Are you okay?' 20s prompt triggered!" }
  ]
};

export const knownNCIIHashes = [
  {
    id: "ncii-ref-001",
    phash: "1011001110010110010110101010010111001101010101001011011010010111",
    label: "Flagged intimate morph report #4928",
    created_at: "2026-10-20T10:00:00Z"
  }
];
