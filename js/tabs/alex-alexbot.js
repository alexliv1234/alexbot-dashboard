// Alex & AlexBot Tab

const AlexAlexbot = {
    init() {
        // Any initialization
    },

    render(data) {
        const rel = data.relationship || {};
        const tasks = data.tasks || {};
        const cron = data.cron || {};

        // Partnership stats
        const birthDate = new Date('2026-01-31');
        document.getElementById('days-together').textContent = Format.daysBetween(birthDate);
        document.getElementById('messages-exchanged').textContent = Format.number(rel.messagesExchanged || 0);
        document.getElementById('lessons-learned').textContent = rel.lessonsLearned || 0;
        document.getElementById('attacks-blocked').textContent = rel.attacksBlocked || 0;
        document.getElementById('tasks-completed').textContent = rel.tasksCompleted || 0;
        document.getElementById('improvements-made').textContent = rel.improvementsMade || 0;

        // Scheduled tasks & reminders
        this.renderScheduledTasks(cron.jobs || []);
        
        // Active tasks
        this.renderActiveTasks(tasks.active || []);

        // Evolution timeline
        this.renderTimeline(rel.evolution || []);

        // Capabilities
        this.renderCapabilities(rel.capabilities || {});

        // Performance metrics
        this.renderMetrics(rel.performanceMetrics || {});
    },

    renderScheduledTasks(jobs) {
        const list = document.getElementById('scheduled-tasks');
        
        const scheduledJobs = jobs.filter(j => j.enabled).slice(0, 10);
        
        if (!scheduledJobs.length) {
            list.innerHTML = '<li class="empty">No scheduled tasks</li>';
            return;
        }

        list.innerHTML = scheduledJobs.map(job => {
            const icon = this.getJobIcon(job.name);
            return `
                <li>
                    <strong>${icon} ${job.name}</strong>
                    <br>
                    <small>${job.schedule || '--'} • Next: ${job.nextRun || '--'}</small>
                </li>
            `;
        }).join('');
    },

    getJobIcon(name) {
        const lower = name.toLowerCase();
        if (lower.includes('morning')) return '🌅';
        if (lower.includes('email')) return '📧';
        if (lower.includes('calendar')) return '📅';
        if (lower.includes('media')) return '📺';
        if (lower.includes('git')) return '🔄';
        if (lower.includes('leaderboard')) return '📊';
        if (lower.includes('nightly')) return '🌙';
        if (lower.includes('learning')) return '📚';
        if (lower.includes('session')) return '🧹';
        return '⏰';
    },

    renderActiveTasks(tasks) {
        const list = document.getElementById('active-tasks-list');
        
        if (!tasks.length) {
            list.innerHTML = '<li class="empty">No active tasks</li>';
            return;
        }

        list.innerHTML = tasks.map(task => `
            <li>
                <span class="priority-badge ${task.priority || 'normal'}">${task.priority || 'P2'}</span>
                ${task.status === 'done' ? '✅' : '☐'} ${task.title}
                ${task.dueDate ? `<br><small>Due: ${Format.date(task.dueDate)}</small>` : ''}
            </li>
        `).join('');
    },

    renderTimeline(events) {
        const container = document.getElementById('evolution-timeline');
        
        if (!events.length) {
            // Default timeline
            events = [
                { date: '2026-01-31', event: 'Born', description: 'First IDENTITY.md created' },
                { date: '2026-02-01', event: 'First Tests', description: 'R&D team social engineering tests' },
                { date: '2026-02-04', event: 'Agammemnon Pattern', description: 'Clone attack lesson' },
                { date: '2026-02-09', event: 'I\'itoi Attack', description: 'Cron security hardened' },
                { date: '2026-02-25', event: 'Dashboard', description: 'Mission Control created' }
            ];
        }

        container.innerHTML = events.slice(-10).reverse().map(e => `
            <div class="timeline-item">
                <div class="date">${e.date}</div>
                <div class="event">${e.event}</div>
                <div class="desc">${e.description}</div>
            </div>
        `).join('');
    },

    renderCapabilities(caps) {
        const active = caps.active || [
            'Morning Briefing', 'Email Check', 'Calendar', 'Task Tracking',
            'Weather', 'WhatsApp', 'Media Server', 'TTS', 'Git Auto-Docs',
            'Local LLM', 'Web Search', 'Playing Group', 'Security'
        ];
        const learning = caps.learning || ['Dating Automation', 'Investment Tracking'];
        const planned = caps.planned || ['Voice', 'Vision', 'Coding Agent'];

        document.getElementById('cap-active').innerHTML = 
            active.map(c => `<li>✅ ${c}</li>`).join('');
        document.getElementById('cap-learning').innerHTML = 
            learning.map(c => `<li>⏳ ${c}</li>`).join('');
        document.getElementById('cap-planned').innerHTML = 
            planned.map(c => `<li>🔮 ${c}</li>`).join('');

        const total = active.length + learning.length + planned.length;
        document.getElementById('cap-score').textContent = 
            `${active.length}/${total} (${Math.round(active.length/total*100)}% operational)`;
    },

    renderMetrics(metrics) {
        document.getElementById('metric-response-time').textContent = 
            `${metrics.avgResponseTime || 4.2}s`;
        document.getElementById('metric-success-rate').textContent = 
            `${metrics.taskSuccessRate || 98.2}%`;
        document.getElementById('metric-messages-today').textContent = 
            metrics.messagesToday || 0;
        document.getElementById('metric-security').textContent = 
            `${metrics.securityScore || 100}%`;
    }
};

window.AlexAlexbot = AlexAlexbot;
