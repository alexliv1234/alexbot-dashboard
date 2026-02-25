// Playing Group Tab

const PlayingGroup = {
    init() {},

    render(data) {
        const scores = data.scores || {};
        const suggestions = data.suggestions || {};
        
        this.renderLeaderboard(scores.players || []);
        this.renderSuggestions(suggestions.pending || []);
        
        // Update date
        document.getElementById('leaderboard-date').textContent = 
            new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    renderLeaderboard(players) {
        const tbody = document.querySelector('#leaderboard-table tbody');
        
        if (!players.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="empty">No scores today</td></tr>';
            return;
        }

        // Sort by total points
        const sorted = [...players].sort((a, b) => (b.total || 0) - (a.total || 0));

        tbody.innerHTML = sorted.slice(0, 10).map((p, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${p.name || 'Anonymous'}</td>
                <td><strong>${p.total || 0}</strong></td>
                <td>${p.messageCount || 0}</td>
                <td>${p.messageCount ? (p.total / p.messageCount).toFixed(1) : '--'}</td>
            </tr>
        `).join('');
    },

    renderSuggestions(suggestions) {
        const list = document.getElementById('suggestions-list');
        
        if (!suggestions.length) {
            list.innerHTML = '<li class="empty">No pending suggestions</li>';
            return;
        }

        list.innerHTML = suggestions.slice(0, 10).map(s => `
            <li>
                <strong>${s.title || s.description}</strong>
                <br>
                <small>
                    By: ${s.author || 'Anonymous'} • 
                    Score: ${s.score || '--'}/50 •
                    Status: ${s.status || 'pending'}
                </small>
            </li>
        `).join('');
    }
};

window.PlayingGroup = PlayingGroup;
