// Cron/Automation Tab

const Cron = {
    init() {},

    render(data) {
        const cron = data.cron || {};
        this.renderStats(cron);
        this.renderJobs(cron.jobs || []);
    },

    renderStats(cron) {
        const jobs = cron.jobs || [];
        const enabled = jobs.filter(j => j.enabled).length;
        const disabled = jobs.filter(j => !j.enabled).length;
        const running = jobs.filter(j => j.running).length;

        document.getElementById('cron-enabled').textContent = `✅ Enabled: ${enabled}`;
        document.getElementById('cron-disabled').textContent = `⏸️ Disabled: ${disabled}`;
        document.getElementById('cron-running').textContent = `🏃 Running: ${running}`;
    },

    renderJobs(jobs) {
        const tbody = document.querySelector('#cron-table tbody');
        
        if (!jobs.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">No cron jobs</td></tr>';
            return;
        }

        tbody.innerHTML = jobs.map(job => {
            const statusClass = job.enabled ? 'online' : 'offline';
            const statusText = job.enabled ? '✅ Active' : '⏸️ Disabled';
            
            return `
                <tr>
                    <td>${this.getJobIcon(job.name)} ${job.name}</td>
                    <td>${job.agent || 'main'}</td>
                    <td>${job.schedule || '--'}</td>
                    <td>${job.nextRun || '--'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <button class="btn btn-sm" onclick="Cron.runJob('${job.id}')">▶️ Run</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    getJobIcon(name) {
        const lower = (name || '').toLowerCase();
        if (lower.includes('morning')) return '🌅';
        if (lower.includes('email')) return '📧';
        if (lower.includes('calendar')) return '📅';
        if (lower.includes('media')) return '📺';
        if (lower.includes('git')) return '🔄';
        if (lower.includes('dashboard')) return '📊';
        if (lower.includes('leaderboard')) return '🏆';
        if (lower.includes('nightly')) return '🌙';
        if (lower.includes('session')) return '🧹';
        if (lower.includes('learning')) return '📚';
        return '⏰';
    },

    runJob(jobId) {
        // Would trigger via WhatsApp
        alert(`Would trigger job: ${jobId}`);
    }
};

window.Cron = Cron;
