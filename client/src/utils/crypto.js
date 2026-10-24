// Web Crypto API implementations for Evidence Integrity (SHA-256) & Duress PINs (PBKDF2)

export async function computeSHA256(data) {
  let buffer;
  if (data instanceof ArrayBuffer) {
    buffer = data;
  } else if (data instanceof Uint8Array) {
    buffer = data.buffer;
  } else if (typeof data === 'string') {
    buffer = new TextEncoder().encode(data);
  } else if (data instanceof Blob) {
    buffer = await data.arrayBuffer();
  } else {
    buffer = new TextEncoder().encode(JSON.stringify(data));
  }

  const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPinWithPBKDF2(pin, salt = "SHIELD-SAFETY-SALT-2026") {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(pin),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );

  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Demo Helper: Simulates file tampering by flipping a single byte in a file buffer
export function tamperBufferFlipByte(buffer) {
  const view = new Uint8Array(buffer.slice(0));
  if (view.length > 10) {
    // Flip bit in byte 10
    view[10] = view[10] ^ 0xFF;
  }
  return view.buffer;
}
