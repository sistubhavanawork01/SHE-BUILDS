import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet's default marker icon paths in bundled Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom SVG Icons for distinct safety categories
const createCustomIcon = (bgColor, iconChar, isPulsing = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        background: ${bgColor};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 13px;
      ">
        ${iconChar}
        ${isPulsing ? `<div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid ${bgColor};
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>` : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const MapComponent = ({
  center = [13.0108, 74.7938],
  zoom = 14,
  incidents = [],
  safeHavens = [],
  cabRoute = null,
  currentCabPos = null,
  onMarkerClick = null
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false
      });

      // CartoDB Dark Matter tiles for sleek modern aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers (Incidents + Safe Havens + User Pin)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Current User Location Pin
    const userIcon = createCustomIcon('#e11d48', '📍', true);
    L.marker([13.0108, 74.7938], { icon: userIcon })
      .addTo(markersLayerRef.current)
      .bindPopup(`
        <div style="font-family: sans-serif; color: #0f172a; font-size: 12px; padding: 4px;">
          <strong style="color: #e11d48;">Your Safe Zone</strong><br/>
          NITK Main Campus Gate<br/>
          <span style="color: #64748b; font-size: 10px;">Coordinates generalized for privacy</span>
        </div>
      `);

    // 2. Incident Warnings
    incidents.forEach(inc => {
      const loc = inc.approximate_location;
      if (!loc || !loc.lat || !loc.lng) return;

      const isHigh = inc.severity === 'high';
      const markerColor = isHigh ? '#dc2626' : '#d97706';
      const icon = createCustomIcon(markerColor, isHigh ? '⚠️' : '⚡');

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(markersLayerRef.current)
        .bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; font-size: 12px; padding: 4px; max-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <strong style="color: ${markerColor}; text-transform: uppercase; font-size: 11px;">${inc.category}</strong>
              <span style="font-size: 10px; background: #f1f5f9; padding: 2px 4px; border-radius: 4px;">${inc.hour_band}</span>
            </div>
            <div style="font-weight: 600; margin-bottom: 2px;">${inc.title || loc.name}</div>
            <div style="color: #475569; font-size: 11px; margin-bottom: 4px;">${loc.name}</div>
            ${inc.public_note ? `<div style="background: #e0f2fe; color: #0369a1; padding: 4px; border-radius: 4px; font-size: 10px;">🛡️ ${inc.public_note}</div>` : ''}
          </div>
        `);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(inc));
      }
    });

    // 3. Safe Havens & Partner Spots
    safeHavens.forEach(haven => {
      if (!haven.lat || !haven.lng) return;

      let color = '#2563eb'; // Blue for police
      let char = '👮';
      if (haven.type === 'hospital') { color = '#059669'; char = '🏥'; }
      if (haven.type === 'pharmacy') { color = '#7c3aed'; char = '💊'; }
      if (haven.type === 'safe_spot') { color = '#ea580c'; char = '🏪'; }

      const havenIcon = createCustomIcon(color, char);
      L.marker([haven.lat, haven.lng], { icon: havenIcon })
        .addTo(markersLayerRef.current)
        .bindPopup(`
          <div style="font-family: sans-serif; color: #0f172a; font-size: 12px; padding: 4px; max-width: 220px;">
            <strong style="color: ${color};">${haven.name}</strong><br/>
            <span style="color: #475569; font-size: 11px;">${haven.address}</span><br/>
            <span style="font-weight: 600; color: #0f172a; font-size: 11px;">📞 ${haven.phone}</span><br/>
            <span style="display: inline-block; margin-top: 4px; background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${haven.hours}</span>
          </div>
        `);
    });
  }, [incidents, safeHavens, onMarkerClick]);

  // Update Cab Guard Route & Vehicle Position
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;

    routeLayerRef.current.clearLayers();

    if (cabRoute && cabRoute.polyline) {
      // 1. Draw Route Polyline
      const line = L.polyline(cabRoute.polyline, {
        color: '#06b6d4',
        weight: 5,
        opacity: 0.85
      }).addTo(routeLayerRef.current);

      // 2. Draw 300m Safety Corridor Buffer Indicator
      L.polyline(cabRoute.polyline, {
        color: '#3b82f6',
        weight: 22,
        opacity: 0.25,
        dashArray: '8, 8'
      }).addTo(routeLayerRef.current);

      // 3. Draw Moving Vehicle Marker if currentCabPos is provided
      if (currentCabPos) {
        const isDeviated = currentCabPos.is_deviated;
        const vehicleIcon = createCustomIcon(
          isDeviated ? '#ef4444' : '#10b981',
          '🚕',
          isDeviated
        );

        L.marker([currentCabPos.lat, currentCabPos.lng], { icon: vehicleIcon })
          .addTo(routeLayerRef.current)
          .bindPopup(`
            <div style="font-family: sans-serif; color: #0f172a; font-size: 12px;">
              <strong>Cab: ${cabRoute.plate || 'KA 19 MD 4829'}</strong><br/>
              Status: <span style="color: ${isDeviated ? '#dc2626' : '#16a34a'}; font-weight: bold;">
                ${isDeviated ? 'CORRIDOR BREACH DETECTED' : 'Safe On Corridor'}
              </span><br/>
              Corridor Distance: ${Math.round(currentCabPos.distance_m || 0)}m
            </div>
          `)
          .openPopup();
      }
    }
  }, [cabRoute, currentCabPos]);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]" />
    </div>
  );
};

