// Communications Tab

const Communications = {
    init() {},

    render(data) {
        const sessions = data.sessions || {};
        this.renderChannels(sessions);
        this.renderSessions(sessions.list || []);
    },

    renderChannels(sessions) {
        const tbody = document.querySelector('#channels-table tbody');
        
        const channels = [
            { name: 'WhatsApp DMs', key: 'whatsapp-dm', icon: '📱' },
            { name: 'WhatsApp Groups', key: 'whatsapp-group', icon: '👥' },
            { name: 'Webchat (Main)', key: 'webchat', icon: '💻' },
            { name: 'Cron Jobs', key: 'cron', icon: '⏰' }
        ];

        const stats = sessions.channelStats || {};

        tbody.innerHTML = channels.map(ch => {
            const s = stats[ch.key] || {};
            return `
                <tr>
                    <td>${ch.icon} ${ch.name}</td>
                    <td>${s.sessionCount || 0}</td>
                    <td>${s.messagesToday || 0} msgs</td>
                    <td>${Format.relativeTime(s.lastActivity)}</td>
                </tr>
            `;
        }).join('');
    },

    renderSessions(sessions) {
        const list = document.getElementById('sessions-list');
        
        if (!sessions.length) {
            list.innerHTML = '<li class="empty">No active sessions</li>';
            return;
        }

        list.innerHTML = sessions.slice(0, 15).map(s => `
            <li>
                <strong>${s.name || s.key}</strong>
                <br>
                <small>
                    Agent: ${s.agent || 'main'} • 
                    Tokens: ${Format.number(s.tokens || 0)} • 
                    ${Format.relativeTime(s.lastActive)}
                </small>
            </li>
        `).join('');
    }
};

window.Communications = Communications;
