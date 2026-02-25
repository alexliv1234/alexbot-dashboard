// Analytics Tab

const Analytics = {
    costChart: null,
    tokensChart: null,

    init() {},

    render(data) {
        const analytics = data.analytics || {};
        this.renderCostChart(analytics.costByAgent || {});
        this.renderTokensChart(analytics.tokenHistory || []);
        this.renderSummary(analytics);
    },

    renderCostChart(costByAgent) {
        const ctx = document.getElementById('cost-chart');
        if (!ctx) return;

        // Destroy existing chart
        if (this.costChart) {
            this.costChart.destroy();
        }

        const agents = Object.keys(costByAgent).length ? costByAgent : {
            main: 8.23,
            fast: 2.14,
            learning: 0.12
        };

        this.costChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(agents).map(a => `${this.getIcon(a)} ${a}`),
                datasets: [{
                    data: Object.values(agents),
                    backgroundColor: ['#00d4ff', '#7c3aed', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#e0e0e0' }
                    }
                }
            }
        });
    },

    renderTokensChart(history) {
        const ctx = document.getElementById('tokens-chart');
        if (!ctx) return;

        if (this.tokensChart) {
            this.tokensChart.destroy();
        }

        // Generate mock data if none
        const labels = history.length ? history.map(h => h.date) : 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = history.length ? history.map(h => h.tokens) :
            [45000, 52000, 48000, 61000, 55000, 32000, 54000];

        this.tokensChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Tokens',
                    data: values,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: '#2d2d5a' },
                        ticks: { color: '#a0a0a0' }
                    },
                    y: {
                        grid: { color: '#2d2d5a' },
                        ticks: { color: '#a0a0a0' }
                    }
                }
            }
        });
    },

    renderSummary(analytics) {
        document.getElementById('total-tokens-week').textContent = 
            Format.number(analytics.totalTokensWeek || 347000);
        document.getElementById('total-cost-week').textContent = 
            Format.currency(analytics.totalCostWeek || 72.45);
        document.getElementById('avg-daily-cost').textContent = 
            Format.currency(analytics.avgDailyCost || 10.35);
        document.getElementById('most-used-agent').textContent = 
            analytics.mostUsedAgent || 'main';
    },

    getIcon(agentId) {
        const icons = { main: '🎯', fast: '⚡', learning: '📚' };
        return icons[agentId] || '🤖';
    }
};

window.Analytics = Analytics;
