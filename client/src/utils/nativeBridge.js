export function getNativeBridge() {
  return typeof window !== 'undefined' ? window.ShieldNative : undefined;
}

export function getNativeCapabilities() {
  const native = getNativeBridge();
  return {
    available: Boolean(native),
    ble: Boolean(native?.ble),
    smartwatch: Boolean(native?.smartwatch),
    trackerScan: Boolean(native?.trackerScan),
    backgroundAudio: Boolean(native?.backgroundAudio)
  };
}

export async function startNativeTelemetry(options = {}) {
  const native = getNativeBridge();
  if (!native?.smartwatch?.startTelemetry) {
    return { status: 'UNAVAILABLE', reason: 'Android native smartwatch bridge is not installed' };
  }
  return native.smartwatch.startTelemetry(options);
}

export async function scanNativeTrackers() {
  const native = getNativeBridge();
  if (!native?.trackerScan?.scan) {
    return { status: 'UNAVAILABLE', reason: 'Android native tracker scanner bridge is not installed', devices: [] };
  }
  return native.trackerScan.scan();
}

export async function relayNativeBlePacket(packet) {
  const native = getNativeBridge();
  if (!native?.ble?.relayPacket) {
    return { status: 'UNAVAILABLE', reason: 'Android native BLE mesh bridge is not installed' };
  }
  return native.ble.relayPacket(packet);
}
