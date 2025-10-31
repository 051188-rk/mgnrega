// In-memory database implementation
class MemoryDB {
  constructor() {
    this.db = {
      districts: [],
      snapshots: [],
      synclogs: []
    };
  }

  // District methods
  async findDistrict(query) {
    return this.db.districts.find(d => 
      Object.entries(query).every(([key, value]) => d[key] === value)
    ) || null;
  }

  async findDistricts(query = {}) {
    if (Object.keys(query).length === 0) {
      return [...this.db.districts];
    }
    return this.db.districts.filter(d => 
      Object.entries(query).every(([key, value]) => d[key] === value)
    );
  }

  async saveDistrict(data) {
    const existing = await this.findDistrict({ district_code: data.district_code });
    if (existing) {
      Object.assign(existing, data);
    } else {
      this.db.districts.push(data);
    }
    return data;
  }

  // Snapshot methods
  async findSnapshot(query) {
    return this.db.snapshots.find(s => 
      Object.entries(query).every(([key, value]) => s[key] === value)
    ) || null;
  }

  async findSnapshots(query = {}) {
    if (Object.keys(query).length === 0) {
      return [...this.db.snapshots];
    }
    return this.db.snapshots.filter(s => 
      Object.entries(query).every(([key, value]) => s[key] === value)
    );
  }

  async saveSnapshot(data) {
    const existing = await this.findSnapshot({ 
      district_code: data.district_code,
      period_key: data.period_key 
    });
    
    if (existing) {
      Object.assign(existing, data);
      return existing;
    } else {
      this.db.snapshots.push({ ...data, _id: Date.now().toString() });
      return data;
    }
  }

  // SyncLog methods
  async createSyncLog(data) {
    const log = {
      ...data,
      _id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.db.synclogs.push(log);
    return log;
  }

  async getLatestSyncLog() {
    return [...this.db.synclogs].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )[0] || null;
  }
}

// Export a singleton instance
module.exports = new MemoryDB();
