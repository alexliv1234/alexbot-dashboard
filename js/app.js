// AlexBot Dashboard - Main Application

class Dashboard {
    constructor() {
        this.currentTab = 'mission-control';
        this.data = {};
        this.refreshInterval = null;
    }

    async init() {
        console.log('🤖 AlexBot Dashboard initializing...');
        
        // Initialize all tab modules
        MissionControl.init();
        AlexAlexbot.init();
        Agents.init();
        Communications.init();
        Cron.init();
        Memory.init();
        PlayingGroup.init();
        Capabilities.init();
        Analytics.init();
        Actions.init();

        // Setup tab navigation
        this.setupTabs();

        // Setup refresh button
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.loadData();
        });

        // Load initial data
        await this.loadData();

        // Start auto-refresh (every 60 seconds)
        this.startAutoRefresh();

        console.log('✅ Dashboard ready!');
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update button states
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

        this.currentTab = tabId;
    }

    async loadData() {
        try {
            document.getElementById('status-indicator').textContent = '● Loading...';
            document.getElementById('status-indicator').className = 'status-badge warning';

            this.data = await dataLoader.loadAll();
            this.renderAll();

            // Update status
            document.getElementById('status-indicator').textContent = '● ONLINE';
            document.getElementById('status-indicator').className = 'status-badge online';
            
            // Update timestamps
            const now = new Date().toLocaleTimeString();
            document.getElementById('last-update').textContent = `Last update: ${now}`;
            document.getElementById('footer-update').textContent = `Last data: ${now}`;

        } catch (error) {
            console.error('Failed to load data:', error);
            document.getElementById('status-indicator').textContent = '● Error';
            document.getElementById('status-indicator').className = 'status-badge offline';
            
            // Still render with mock/cached data
            this.renderAll();
        }
    }

    renderAll() {
        MissionControl.render(this.data);
        AlexAlexbot.render(this.data);
        Agents.render(this.data);
        Communications.render(this.data);
        Cron.render(this.data);
        Memory.render(this.data);
        PlayingGroup.render(this.data);
        Capabilities.render(this.data);
        Analytics.render(this.data);
        Actions.render(this.data);
    }

    startAutoRefresh() {
        // Refresh every 60 seconds
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 60000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    window.dashboard.init();
});
