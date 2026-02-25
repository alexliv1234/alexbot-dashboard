// Data Loader for AlexBot Dashboard

class DataLoader {
    constructor() {
        this.baseUrl = './data';
        this.cache = {};
        this.lastUpdate = null;
        this.refreshInterval = 60000; // 1 minute
    }

    async loadAll() {
        const files = [
            'status',
            'relationship',
            'sessions',
            'cron',
            'memory',
            'scores',
            'suggestions',
            'capabilities',
            'analytics',
            'tasks'
        ];

        const results = {};
        
        await Promise.all(files.map(async (file) => {
            try {
                results[file] = await this.load(file);
            } catch (e) {
                console.warn(`Failed to load ${file}.json:`, e);
                results[file] = null;
            }
        }));

        // Load agent-specific data
        results.agents = {};
        const agentIds = ['main', 'fast', 'learning'];
        
        await Promise.all(agentIds.map(async (agentId) => {
            try {
                results.agents[agentId] = await this.loadAgent(agentId);
            } catch (e) {
                console.warn(`Failed to load agent ${agentId}:`, e);
                results.agents[agentId] = null;
            }
        }));

        this.cache = results;
        this.lastUpdate = new Date();
        return results;
    }

    async load(name) {
        const response = await fetch(`${this.baseUrl}/${name}.json?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }

    async loadAgent(agentId) {
        const response = await fetch(`${this.baseUrl}/agents/${agentId}.json?t=${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    }

    get(name) {
        return this.cache[name] || null;
    }

    getAgent(agentId) {
        return this.cache.agents?.[agentId] || null;
    }

    getLastUpdate() {
        return this.lastUpdate;
    }

    // Auto-refresh setup
    startAutoRefresh(callback) {
        setInterval(async () => {
            await this.loadAll();
            if (callback) callback(this.cache);
        }, this.refreshInterval);
    }
}

// Global instance
window.dataLoader = new DataLoader();
