import crypto from 'crypto';

export class TamperEvidentAuditChain {
  constructor() {
    this.chain = [];
    // Genesis block
    this.addEntry('SYSTEM', 'AUDIT_GENESIS', { initialized_at: new Date().toISOString() });
  }

  calculateHash(entry) {
    const dataString = JSON.stringify({
      id: entry.id,
      timestamp: entry.timestamp,
      actor: entry.actor,
      action: entry.action,
      details: entry.details,
      prev_hash: entry.prev_hash
    });
    return crypto.createHash('sha256').update(dataString).digest('hex');
  }

  addEntry(actor, action, details = {}) {
    const prevHash = this.chain.length > 0 
      ? this.chain[this.chain.length - 1].entry_hash 
      : '0000000000000000000000000000000000000000000000000000000000000000';

    const entry = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
      prev_hash: prevHash
    };

    entry.entry_hash = this.calculateHash(entry);
    this.chain.push(entry);
    return entry;
  }

  getEntries(incidentId = null) {
    if (!incidentId) return this.chain;
    return this.chain.filter(e => e.details?.incident_id === incidentId);
  }

  verifyIntegrity() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // Check pointer link
      if (current.prev_hash !== previous.entry_hash) {
        return {
          valid: false,
          error_at_index: i,
          reason: `Broken chain link at entry ${current.id}: prev_hash does not match previous entry_hash`
        };
      }

      // Check current entry hash recalculation
      const expectedHash = this.calculateHash(current);
      if (current.entry_hash !== expectedHash) {
        return {
          valid: false,
          error_at_index: i,
          reason: `Tampered entry hash at ${current.id}: recorded ${current.entry_hash} != expected ${expectedHash}`
        };
      }
    }

    return {
      valid: true,
      chain_length: this.chain.length,
      last_hash: this.chain[this.chain.length - 1]?.entry_hash
    };
  }
}

export const auditChain = new TamperEvidentAuditChain();

