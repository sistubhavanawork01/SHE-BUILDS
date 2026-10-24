export const demoCabRoute = {
  start: { name: "NITK Main Gate", lat: 13.0108, lng: 74.7938 },
  destination: { name: "Mangalore City Centre", lat: 12.8700, lng: 74.8400 },
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
    { lat: 13.0108, lng: 74.7938, step: 0, timeSec: 0, status: "On Route", note: "Boarded cab at NITK Main Gate. Route corridor locked at 300m buffer." },
    { lat: 13.0075, lng: 74.7960, step: 1, timeSec: 4, status: "On Route", note: "Approaching Surathkal flyover along corridor. Telemetry normal." },
    { lat: 13.0040, lng: 74.7985, step: 2, timeSec: 8, status: "On Route", note: "Passing Surathkal Junction - corridor distance 40m (Safe)." },
    { lat: 13.0010, lng: 74.7890, step: 3, timeSec: 12, status: "Warning", note: "Approaching corridor limit: 220m away from authorized route towards bypass." },
    { lat: 12.9970, lng: 74.7810, step: 4, timeSec: 16, status: "DEVIATION_ALERT", note: "CORRIDOR BREACH: 620m away from authorized highway! Diverting down isolated road." },
    { lat: 12.9940, lng: 74.7760, step: 5, timeSec: 20, status: "CRITICAL_ALERT", note: "Vehicle stopped in dark secluded area. 'Are you okay?' 20s escalation triggered!" }
  ]
};
