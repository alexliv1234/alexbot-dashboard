// Mission Control Tab

const MissionControl = {
    init() {
        this.setupQuickActions();
    },

    render(data) {
        const status = data.status || {};
        const tasks = data.tasks || {};
        
        // Update status stats
        document.getElementById('stat-model').textContent = status.model || 'claude-opus-4-5';
        document.getElementById('stat-uptime').textContent = Format.uptime(status.startTime || '2026-01-31');
        document.getElementById('stat-tokens').textContent = Format.number(status.tokensToday || 0);
        document.getElementById('stat-cost').textContent = Format.currency(status.costToday || 0);
        document.getElementById('stat-sessions').textContent = status.activeSessions || 0;
        document.getElementById('stat-agents').textContent = `${status.activeAgents || 3} active`;

        // Update main status
        const statusEl = document.getElementById('main-status');
        statusEl.textContent = status.online !== false ? 'ONLINE 🟢' : 'OFFLINE 🔴';
        statusEl.className = `status-badge ${status.online !== false ? 'online' : 'offline'}`;

        // Update priorities
        this.renderPriorities(tasks.priorities || []);
        
        // Update activity feed
        this.renderActivity(status.recentActivity || []);
    },

    renderPriorities(priorities) {
        const list = document.getElementById('priorities-list');
        
        if (!priorities.length) {
            list.innerHTML = '<li class="empty">No active priorities</li>';
            return;
        }

        list.innerHTML = priorities.map(p => `
            <li>
                <span class="priority-badge ${p.priority}">${p.priority}</span>
                ${p.status === 'done' ? '✅' : '☐'} ${p.title}
            </li>
        `).join('');
    },

    renderActivity(activities) {
        const list = document.getElementById('activity-feed');
        
        if (!activities.length) {
            list.innerHTML = '<li class="empty">No recent activity</li>';
            return;
        }

        list.innerHTML = activities.slice(0, 10).map(a => `
            <li>
                <span class="time">${Format.time(a.timestamp)}</span>
                <span class="event">${a.event}</span>
            </li>
        `).join('');
    },

    setupQuickActions() {
        const actions = document.querySelectorAll('.action-btn[data-action]');
        actions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.executeAction(btn.dataset.action);
            });
        });

        // Custom message
        document.getElementById('send-custom')?.addEventListener('click', () => {
            const input = document.getElementById('custom-message');
            if (input.value.trim()) {
                this.sendMessage(input.value);
                input.value = '';
            }
        });
    },

    executeAction(action) {
        const commands = {
            'check-emails': '/check emails',
            'calendar': '/calendar today',
            'weather': '/weather',
            'tasks': '/tasks',
            'status': '/status'
        };

        const cmd = commands[action];
        if (cmd) {
            this.sendMessage(cmd);
        }
    },

    sendMessage(message) {
        // Create WhatsApp link
        const phone = '972544419002';
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    }
};

window.MissionControl = MissionControl;
