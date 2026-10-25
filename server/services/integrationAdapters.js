import crypto from 'node:crypto';

const mode = process.env.SHIELD_INTEGRATION_MODE || 'sandbox';
const timeoutMs = Number(process.env.SHIELD_INTEGRATION_TIMEOUT_MS || 8000);

function isConfigured(prefix) {
  return Boolean(process.env[`${prefix}_URL`]);
}

async function postJson(url, payload, headers = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const body = await response.text();
    let parsed;
    try {
      parsed = body ? JSON.parse(body) : {};
    } catch {
      parsed = { raw: body };
    }
    if (!response.ok) {
      throw new Error(`Provider returned HTTP ${response.status}`);
    }
    return parsed;
  } finally {
    clearTimeout(timeout);
  }
}

function assertProductionApproval(provider) {
  if (mode !== 'production') {
    return false;
  }
  if (process.env.SHIELD_PRODUCTION_APPROVED !== 'true') {
    throw new Error(`Production ${provider} integration requires SHIELD_PRODUCTION_APPROVED=true`);
  }
  return true;
}

export function getIntegrationStatus() {
  return {
    mode,
    providers: {
      ncii: { configured: isConfigured('NCII_PROVIDER'), enabled: Boolean(process.env.NCII_PROVIDER_URL) },
      municipal: { configured: isConfigured('MUNICIPAL_PROVIDER'), enabled: Boolean(process.env.MUNICIPAL_PROVIDER_URL) },
      safety_data: { configured: isConfigured('SAFETY_DATA_PROVIDER'), enabled: Boolean(process.env.SAFETY_DATA_PROVIDER_URL) },
      blockchain: { configured: isConfigured('BLOCKCHAIN_PROVIDER'), enabled: Boolean(process.env.BLOCKCHAIN_PROVIDER_URL) }
    }
  };
}

export async function submitNciiProtection({ perceptualHash, metadata = {} }) {
  const live = assertProductionApproval('NCII');
  if (!live || !isConfigured('NCII_PROVIDER')) {
    return {
      status: 'SANDBOX_QUEUED',
      provider: 'configured provider required',
      request_id: `sandbox-ncii-${crypto.randomUUID()}`
    };
  }
  return {
    status: 'SUBMITTED',
    provider_response: await postJson(process.env.NCII_PROVIDER_URL, {
      perceptual_hash: perceptualHash,
      metadata
    }, process.env.NCII_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.NCII_PROVIDER_TOKEN}` } : {})
  };
}

export async function submitMunicipalGrievance(payload) {
  const live = assertProductionApproval('municipal');
  if (!live || !isConfigured('MUNICIPAL_PROVIDER')) {
    return {
      status: 'SANDBOX_QUEUED',
      provider: 'configured municipal portal required',
      ticket_id: `sandbox-civic-${crypto.randomUUID()}`
    };
  }
  return {
    status: 'SUBMITTED',
    provider_response: await postJson(process.env.MUNICIPAL_PROVIDER_URL, payload, process.env.MUNICIPAL_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.MUNICIPAL_PROVIDER_TOKEN}` } : {})
  };
}

export async function getSafetyData(query) {
  if (mode !== 'production' || !isConfigured('SAFETY_DATA_PROVIDER')) {
    return { status: 'SANDBOX', source: 'SHIELD demo safety dataset', data: [] };
  }
  const url = new URL(process.env.SAFETY_DATA_PROVIDER_URL);
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, value);
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Safety data provider returned HTTP ${response.status}`);
    return { status: 'LIVE', source: url.origin, data: await response.json() };
  } finally {
    clearTimeout(timeout);
  }
}

export async function anchorEvidence({ merkleRoot, metadata = {} }) {
  const live = assertProductionApproval('blockchain');
  if (!live || !isConfigured('BLOCKCHAIN_PROVIDER')) {
    return {
      status: 'SANDBOX_QUEUED',
      provider: 'configured blockchain relay required',
      transaction_id: `sandbox-chain-${crypto.randomUUID()}`,
      merkle_root: merkleRoot
    };
  }
  return {
    status: 'SUBMITTED',
    provider_response: await postJson(process.env.BLOCKCHAIN_PROVIDER_URL, {
      merkle_root: merkleRoot,
      metadata
    }, process.env.BLOCKCHAIN_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.BLOCKCHAIN_PROVIDER_TOKEN}` } : {})
  };
}
