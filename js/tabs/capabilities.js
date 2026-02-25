// Capabilities Tab

const Capabilities = {
    init() {},

    render(data) {
        const caps = data.capabilities || {};
        const agents = data.agents || {};
        
        this.renderSkillsByAgent(agents, caps);
    },

    renderSkillsByAgent(agents, caps) {
        const container = document.getElementById('skills-by-agent');
        
        const agentSkills = {
            main: {
                icon: '🎯',
                name: 'main',
                skills: caps.main || [
                    'clawhub', 'github', 'gog', 'gmail', 'jellyseerr', 
                    'todo', 'wacli', 'weather', 'daily-review', 
                    'meeting-prep', 'moltbook', 'phoenixclaw', 
                    'guardian-status', 'guardian-simulate', 'tmux', 
                    'video-frames', 'healthcheck'
                ]
            },
            fast: {
                icon: '⚡',
                name: 'fast',
                skills: caps.fast || [
                    'score-message', 'score-suggestion', 
                    'leaderboard', 'bot-detection', 'reply-logging'
                ]
            },
            learning: {
                icon: '📚',
                name: 'learning',
                skills: caps.learning || [
                    'guide-reference', 'concise-explain', 
                    'code-examples', 'ai-education'
                ]
            }
        };

        container.innerHTML = Object.entries(agentSkills).map(([id, agent]) => `
            <div class="skill-group">
                <h4>${agent.icon} ${agent.name} (${agent.skills.length} skills)</h4>
                <div class="skills">
                    ${agent.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
};

window.Capabilities = Capabilities;
