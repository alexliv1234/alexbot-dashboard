// Agents Tab

const Agents = {
    selectedAgent: null,

    init() {
        document.getElementById('back-to-agents')?.addEventListener('click', () => {
            this.hideSubdashboard();
        });
    },

    render(data) {
        this.renderAgentsGrid(data.agents || {});
        this.renderComparison(data.agents || {});
    },

    renderAgentsGrid(agents) {
        const grid = document.getElementById('agents-grid');
        
        const agentData = [
            { id: 'main', icon: '🎯', name: 'main', role: 'Primary Brain', model: 'opus-4-5' },
            { id: 'fast', icon: '⚡', name: 'fast', role: 'Quick Tasks', model: 'sonnet-4-5' },
            { id: 'learning', icon: '📚', name: 'learning', role: 'Educator', model: 'flash' }
        ];

        grid.innerHTML = agentData.map(agent => {
            const data = agents[agent.id] || {};
            const status = data.status || 'active';
            const statusClass = status === 'active' ? 'online' : 'offline';
            
            return `
                <div class="agent-card" data-agent="${agent.id}">
                    <div class="agent-header">
                        <span class="agent-name">${agent.icon} ${agent.name}</span>
                        <span class="status-badge ${statusClass}">${status === 'active' ? '🟢' : '🟡'}</span>
                    </div>
                    <div class="agent-stats">
                        <div><span>Model:</span> <strong>${data.model || agent.model}</strong></div>
                        <div><span>Sessions:</span> <strong>${data.sessions?.length || 0}</strong></div>
                        <div><span>Tokens:</span> <strong>${Format.number(data.tokensToday || 0)}</strong></div>
                        <div><span>Cost:</span> <strong>${Format.currency(data.costToday || 0)}</strong></div>
                    </div>
                    <button class="btn btn-sm" style="margin-top: 1rem; width: 100%;">
                        🔍 View Details
                    </button>
                </div>
            `;
        }).join('');

        // Add click handlers
        grid.querySelectorAll('.agent-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showSubdashboard(card.dataset.agent, agents[card.dataset.agent]);
            });
        });
    },

    renderComparison(agents) {
        const tbody = document.querySelector('#agent-comparison tbody');
        
        const metrics = [
            { label: 'Model', key: 'model', defaults: { main: 'opus-4-5', fast: 'sonnet-4-5', learning: 'flash' } },
            { label: 'Sessions', key: 'sessionCount', format: Format.number },
            { label: 'Tokens Today', key: 'tokensToday', format: Format.number },
            { label: 'Cost Today', key: 'costToday', format: Format.currency },
            { label: 'Primary Use', key: 'role', defaults: { main: 'Complex', fast: 'Groups', learning: 'Education' } },
            { label: 'Memory Access', key: 'memoryAccess', defaults: { main: 'Full', fast: 'Limited', learning: 'Minimal' } }
        ];

        tbody.innerHTML = metrics.map(metric => {
            const getValue = (agentId) => {
                const agent = agents[agentId] || {};
                let val = agent[metric.key];
                if (val === undefined && metric.defaults) {
                    val = metric.defaults[agentId];
                }
                if (metric.format) {
                    return metric.format(val);
                }
                return val || '--';
            };

            return `
                <tr>
                    <td>${metric.label}</td>
                    <td>${getValue('main')}</td>
                    <td>${getValue('fast')}</td>
                    <td>${getValue('learning')}</td>
                </tr>
            `;
        }).join('');
    },

    showSubdashboard(agentId, agentData) {
        this.selectedAgent = agentId;
        const container = document.getElementById('agent-subdashboard');
        const content = document.getElementById('subdash-content');
        const title = document.getElementById('subdash-title');

        const icons = { main: '🎯', fast: '⚡', learning: '📚' };
        title.textContent = `${icons[agentId] || '🤖'} ${agentId.toUpperCase()} Agent Details`;

        const data = agentData || {};
        
        content.innerHTML = `
            <div class="grid grid-cols-2">
                <div class="card">
                    <div class="card-header"><h3>Identity</h3></div>
                    <div class="card-body">
                        <p><strong>Name:</strong> AlexBot (${agentId})</p>
                        <p><strong>Role:</strong> ${data.role || 'Agent'}</p>
                        <p><strong>Model:</strong> ${data.model || '--'}</p>
                        <p><strong>Workspace:</strong> ${data.workspace || '--'}</p>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>Today's Stats</h3></div>
                    <div class="card-body">
                        <div class="metrics-list">
                            <div class="metric-row">
                                <span>Tokens</span>
                                <strong>${Format.number(data.tokensToday || 0)}</strong>
                            </div>
                            <div class="metric-row">
                                <span>Cost</span>
                                <strong>${Format.currency(data.costToday || 0)}</strong>
                            </div>
                            <div class="metric-row">
                                <span>Messages</span>
                                <strong>${data.messagesHandled || 0}</strong>
                            </div>
                            <div class="metric-row">
                                <span>Sessions</span>
                                <strong>${data.sessions?.length || 0}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>Capabilities</h3></div>
                    <div class="card-body">
                        <ul class="cap-list">
                            ${(data.capabilities || ['General assistance']).map(c => `<li>✅ ${c}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header"><h3>Cron Jobs</h3></div>
                    <div class="card-body">
                        <ul class="task-list">
                            ${(data.cronJobs || []).slice(0, 5).map(j => `<li>⏰ ${j.name}</li>`).join('') || '<li class="empty">No jobs</li>'}
                        </ul>
                    </div>
                </div>

                <div class="card span-2">
                    <div class="card-header"><h3>Active Sessions</h3></div>
                    <div class="card-body">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Session</th>
                                    <th>Tokens</th>
                                    <th>Last Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${(data.sessions || []).slice(0, 5).map(s => `
                                    <tr>
                                        <td>${s.name || s.key || '--'}</td>
                                        <td>${Format.number(s.tokens || 0)}</td>
                                        <td>${Format.relativeTime(s.lastActive)}</td>
                                    </tr>
                                `).join('') || '<tr><td colspan="3" class="empty">No sessions</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        container.classList.remove('hidden');
    },

    hideSubdashboard() {
        this.selectedAgent = null;
        document.getElementById('agent-subdashboard').classList.add('hidden');
    }
};

window.Agents = Agents;
