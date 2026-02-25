// Actions Tab

const Actions = {
    init() {
        this.setupActions();
    },

    render(data) {
        // Actions are mostly static, nothing dynamic to render
    },

    setupActions() {
        // Agent-specific action buttons
        document.querySelectorAll('.action-btn[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.executeAction(btn.dataset.action);
            });
        });

        // Custom command
        document.getElementById('send-command')?.addEventListener('click', () => {
            const agent = document.getElementById('target-agent').value;
            const command = document.getElementById('custom-command-input').value;
            if (command.trim()) {
                this.sendCommand(agent, command);
                document.getElementById('custom-command-input').value = '';
            }
        });
    },

    executeAction(action) {
        const commands = {
            // Main agent
            'check-emails': '/check emails',
            'calendar': '/calendar today',
            'tasks': '/tasks',
            'restart-main': '/restart main',
            
            // Fast agent
            'leaderboard': '/leaderboard',
            'morning-wake': '/playing morning',
            'nightly-summary': '/playing summary',
            
            // Learning agent
            'list-guides': '/guides list',
            'recent-questions': '/learning recent'
        };

        const cmd = commands[action];
        if (cmd) {
            this.sendWhatsApp(cmd);
        } else {
            console.warn('Unknown action:', action);
        }
    },

    sendCommand(agent, command) {
        // Prefix with agent target
        const prefix = agent !== 'main' ? `@${agent} ` : '';
        this.sendWhatsApp(prefix + command);
    },

    sendWhatsApp(message) {
        const phone = '972544419002';
        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    }
};

window.Actions = Actions;
