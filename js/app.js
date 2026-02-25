// Global data cache
let dashboardData = {};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
});

// Load all data files
async function loadAllData() {
    try {
        const files = [
            'overview',
            'main-session',
            'playing-group',
            'learning-group',
            'bot-registry',
            'fundraising',
            'cron-jobs',
            'memory'
        ];
        
        const promises = files.map(file => 
            fetch(`data/${file}.json`)
                .then(r => r.json())
                .catch(() => ({}))
        );
        
        const results = await Promise.all(promises);
        
        files.forEach((file, i) => {
            dashboardData[file] = results[i];
        });
        
        renderOverview();
        updateLastUpdate();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Refresh data
async function refreshData() {
    await loadAllData();
    // Re-render current tab
    const activeTab = document.querySelector('.tab-btn.active').onclick.toString().match(/'(.+)'/)[1];
    switchTab(activeTab);
}

// Update last update timestamp
function updateLastUpdate() {
    const timestamp = dashboardData.overview?.timestamp || new Date().toISOString();
    const date = new Date(timestamp);
    const formatted = date.toLocaleString('he-IL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('last-update').textContent = `עדכון אחרון: ${formatted}`;
}

// Switch main tabs
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Render content based on tab
    switch(tabName) {
        case 'overview':
            renderOverview();
            break;
        case 'main':
            renderMainSession();
            break;
        case 'playing':
            renderPlayingGroup();
            break;
        case 'learning':
            renderLearningGroup();
            break;
        case 'bots':
            renderBotRegistry();
            break;
        case 'fundraising':
            renderFundraising();
            break;
        case 'cron':
            renderCronJobs();
            break;
        case 'memory':
            renderMemory();
            break;
    }
}

// Switch playing group sub-tabs
function switchPlayingSubtab(subtab) {
    // Update buttons
    document.querySelectorAll('#playing-tab .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.playing-subtab').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`playing-${subtab}`).style.display = 'block';
    
    // Load specific content
    switch(subtab) {
        case 'people':
            renderPeopleLeaderboard();
            break;
        case 'bots-scores':
            renderBotScores();
            break;
        case 'suggestions':
            renderSuggestions();
            break;
        case 'dailies':
            renderDailySummaries();
            break;
        case 'conversations':
            renderConversations();
            break;
    }
}

// ======================
// TAB 1: OVERVIEW
// ======================
function renderOverview() {
    const data = dashboardData.overview || {};
    
    // Update summary cards
    document.getElementById('total-sessions').textContent = 
        (data.totals?.sessions || 0).toLocaleString();
    
    document.getElementById('total-tokens').textContent = 
        (data.totals?.tokens?.total || 0).toLocaleString();
    
    document.getElementById('cron-active').textContent = 
        `${data.health?.cronJobsActive || 0} / ${data.health?.cronJobsTotal || 0}`;
    
    // Render agent list
    const agentList = document.getElementById('agent-list');
    if (data.agents) {
        agentList.innerHTML = Object.entries(data.agents).map(([name, stats]) => `
            <div class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                    <p class="font-medium text-gray-900">${name}</p>
                    <p class="text-sm text-gray-500">${stats.sessions} sessions</p>
                </div>
                <div class="text-left">
                    <p class="text-sm font-medium text-gray-700">${stats.tokens?.toLocaleString() || 0} tokens</p>
                    <p class="text-xs text-gray-500">$${(stats.cost || 0).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
    }
    
    // Render health indicators
    const healthDiv = document.getElementById('health-indicators');
    if (data.health) {
        healthDiv.innerHTML = `
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">🤖 בוטים פעילים</span>
                    <span class="font-bold text-gray-900">${data.health.botsActive || 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">⏳ בוטים ממתינים</span>
                    <span class="font-bold text-gray-900">${data.health.botsPending || 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">🧠 קבצי זיכרון</span>
                    <span class="font-bold text-gray-900">${data.health.memoryFiles || 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">⚙️ Cron jobs</span>
                    <span class="font-bold text-gray-900">${data.health.cronJobsActive || 0}/${data.health.cronJobsTotal || 0}</span>
                </div>
            </div>
        `;
    }
}

// ======================
// TAB 2: MAIN SESSION
// ======================
function renderMainSession() {
    const data = dashboardData['main-session'] || {};
    const content = document.getElementById('main-content');
    
    content.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                    <p class="text-sm text-blue-600 mb-1">Sessions</p>
                    <p class="text-2xl font-bold text-blue-900">${data.totalSessions || 0}</p>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                    <p class="text-sm text-purple-600 mb-1">Tokens</p>
                    <p class="text-2xl font-bold text-purple-900">${(data.totalTokens || 0).toLocaleString()}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                    <p class="text-sm text-green-600 mb-1">Cost</p>
                    <p class="text-2xl font-bold text-green-900">$${(data.totalCost || 0).toFixed(2)}</p>
                </div>
            </div>
            
            ${data.topSessions && data.topSessions.length > 0 ? `
                <div>
                    <h3 class="text-lg font-semibold mb-3">🔥 Top Sessions</h3>
                    <div class="space-y-2">
                        ${data.topSessions.map((session, i) => `
                            <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span class="text-lg font-bold text-gray-400">#${i + 1}</span>
                                <div class="flex-1">
                                    <p class="font-medium text-gray-900">${session.label || session.kind || 'Unknown'}</p>
                                    <p class="text-sm text-gray-500">${session.kind} • ${session.tokens?.toLocaleString() || 0} tokens</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ======================
// TAB 3: PLAYING GROUP
// ======================
function renderPlayingGroup() {
    renderPeopleLeaderboard();
}

function renderPeopleLeaderboard() {
    const data = dashboardData['playing-group'] || {};
    const people = data.peopleScores || [];
    const container = document.getElementById('people-leaderboard');
    
    if (people.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">אין נתונים</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${people.map((person, index) => `
                <div class="leaderboard-item">
                    <div class="rank-badge rank-${index < 3 ? index + 1 : 'other'}">
                        ${index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <p class="font-semibold text-gray-900">${person.name}</p>
                                <p class="text-xs text-gray-500">${person.messages || 0} הודעות • ממוצע ${person.avgScore?.toFixed(1) || 0}/70</p>
                            </div>
                            <div class="text-left">
                                <p class="text-2xl font-bold text-purple-600">${person.totalScore || 0}</p>
                                <p class="text-xs text-gray-500">נקודות</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-7 gap-2 text-xs">
                            <div class="text-center">
                                <p class="text-gray-500">🎨</p>
                                <p class="font-medium">${person.creativity || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">🧠</p>
                                <p class="font-medium">${person.challenge || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">😂</p>
                                <p class="font-medium">${person.humor || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">💡</p>
                                <p class="font-medium">${person.cleverness || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">🔥</p>
                                <p class="font-medium">${person.engagement || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">🚨</p>
                                <p class="font-medium">${person.broke || 0}</p>
                            </div>
                            <div class="text-center">
                                <p class="text-gray-500">🔓</p>
                                <p class="font-medium">${person.hacked || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderBotScores() {
    const data = dashboardData['playing-group'] || {};
    const bots = data.botScores || [];
    const container = document.getElementById('bot-leaderboard');
    
    if (bots.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">אין בוטים</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${bots.map(bot => `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="font-semibold text-gray-900">🤖 ${bot.name}</p>
                            <p class="text-sm text-gray-500">${bot.interactions || 0} אינטראקציות • Trust: ${bot.trustScore || 0}</p>
                        </div>
                        <div>
                            <span class="status-badge ${bot.trustLevel === 'trusted' ? 'status-online' : 'status-warning'}">
                                ${bot.trustLevel || 'new'}
                            </span>
                        </div>
                    </div>
                    <div class="grid grid-cols-5 gap-2 text-xs">
                        <div class="text-center">
                            <p class="text-gray-500">⚙️ Quality</p>
                            <p class="font-medium">${bot.avgQuality?.toFixed(1) || 0}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500">🤝 Help</p>
                            <p class="font-medium">${bot.avgHelpfulness?.toFixed(1) || 0}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500">🎯 Relevant</p>
                            <p class="font-medium">${bot.avgRelevance?.toFixed(1) || 0}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500">💡 Creative</p>
                            <p class="font-medium">${bot.avgCreativity?.toFixed(1) || 0}</p>
                        </div>
                        <div class="text-center">
                            <p class="text-gray-500">🛡️ Safety</p>
                            <p class="font-medium">${bot.avgSafety?.toFixed(1) || 0}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSuggestions() {
    const data = dashboardData['playing-group'] || {};
    const suggestions = data.suggestions || [];
    const container = document.getElementById('suggestions-list');
    
    if (suggestions.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">אין הצעות</p>';
        return;
    }
    
    // Group by status
    const grouped = {
        pending: suggestions.filter(s => s.status === 'pending'),
        implemented: suggestions.filter(s => s.status === 'implemented'),
        rejected: suggestions.filter(s => s.status === 'rejected')
    };
    
    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex gap-4 text-sm">
                <div class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded">⏳ Pending: ${grouped.pending.length}</div>
                <div class="px-3 py-1 bg-green-100 text-green-800 rounded">✅ Implemented: ${grouped.implemented.length}</div>
                <div class="px-3 py-1 bg-red-100 text-red-800 rounded">❌ Rejected: ${grouped.rejected.length}</div>
            </div>
            
            ${Object.entries(grouped).map(([status, items]) => {
                if (items.length === 0) return '';
                
                const statusConfig = {
                    pending: { icon: '⏳', color: 'yellow', title: 'Pending' },
                    implemented: { icon: '✅', color: 'green', title: 'Implemented' },
                    rejected: { icon: '❌', color: 'red', title: 'Rejected' }
                };
                
                const config = statusConfig[status];
                
                return `
                    <div>
                        <h3 class="text-lg font-semibold mb-3">${config.icon} ${config.title}</h3>
                        <div class="space-y-2">
                            ${items.map(suggestion => `
                                <div class="p-4 bg-${config.color}-50 border border-${config.color}-200 rounded-lg">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1">
                                            <p class="font-medium text-gray-900">${suggestion.description || 'אין תיאור'}</p>
                                            <p class="text-sm text-gray-500 mt-1">
                                                ${suggestion.suggestedBy || 'Unknown'} • 
                                                ${suggestion.type || 'general'} • 
                                                ${new Date(suggestion.timestamp).toLocaleDateString('he-IL')}
                                            </p>
                                        </div>
                                        <div class="text-left">
                                            <p class="text-xl font-bold text-${config.color}-600">${suggestion.totalScore || 0}/50</p>
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-5 gap-2 text-xs mt-3">
                                        <div>
                                            <p class="text-gray-500">⚙️ Complexity</p>
                                            <p class="font-medium">${suggestion.complexity || 0}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">💡 Ingenuity</p>
                                            <p class="font-medium">${suggestion.ingenuity || 0}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">🚀 Impact</p>
                                            <p class="font-medium">${suggestion.impact || 0}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">✅ Feasibility</p>
                                            <p class="font-medium">${suggestion.feasibility || 0}</p>
                                        </div>
                                        <div>
                                            <p class="text-gray-500">🔥 Priority</p>
                                            <p class="font-medium">${suggestion.priority || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderDailySummaries() {
    const data = dashboardData['playing-group'] || {};
    const summaries = data.dailySummaries || [];
    const container = document.getElementById('daily-summaries');
    
    if (summaries.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">אין סיכומים</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${summaries.map(summary => `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-2">
                        <p class="font-semibold text-gray-900">${summary.date}</p>
                        <span class="text-sm text-gray-500">${summary.totalMessages || 0} הודעות</span>
                    </div>
                    ${summary.winners ? `
                        <div class="flex gap-4 mt-3">
                            ${summary.winners.map((winner, i) => `
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">${['🥇', '🥈', '🥉'][i]}</span>
                                    <div>
                                        <p class="font-medium text-sm">${winner.name}</p>
                                        <p class="text-xs text-gray-500">${winner.score} נקודות</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderConversations() {
    const data = dashboardData['playing-group'] || {};
    const conversations = data.conversations || [];
    const container = document.getElementById('conversation-logs');
    
    if (conversations.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">אין שיחות</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-2">
            ${conversations.map(conv => `
                <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-gray-900">${conv.name}</p>
                            <p class="text-sm text-gray-500">${conv.phone}</p>
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-medium text-gray-700">${conv.messageCount || 0} הודעות</p>
                            <p class="text-xs text-gray-500">${conv.lastMessage ? new Date(conv.lastMessage).toLocaleDateString('he-IL') : '-'}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ======================
// TAB 4: LEARNING GROUP
// ======================
function renderLearningGroup() {
    const data = dashboardData['learning-group'] || {};
    const content = document.getElementById('learning-content');
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
                <p class="text-sm text-blue-600 mb-2">📚 Total Questions</p>
                <p class="text-3xl font-bold text-blue-900">${data.totalQuestions || 0}</p>
            </div>
            <div class="bg-purple-50 p-6 rounded-lg">
                <p class="text-sm text-purple-600 mb-2">🤝 Contributions</p>
                <p class="text-3xl font-bold text-purple-900">${data.totalContributions || 0}</p>
            </div>
        </div>
    `;
}

// ======================
// TAB 5: BOT REGISTRY
// ======================
function renderBotRegistry() {
    const data = dashboardData['bot-registry'] || {};
    const content = document.getElementById('bots-content');
    
    const bots = data.bots || [];
    
    if (bots.length === 0) {
        content.innerHTML = '<p class="text-gray-500 text-center py-8">אין בוטים רשומים</p>';
        return;
    }
    
    content.innerHTML = `
        <div class="space-y-4">
            ${bots.map(bot => `
                <div class="p-4 border border-gray-200 rounded-lg">
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <p class="font-semibold text-lg text-gray-900">🤖 ${bot.name}</p>
                            <p class="text-sm text-gray-500">${bot.handle || '-'} • ${bot.phone}</p>
                            <p class="text-sm text-gray-600 mt-1">${bot.description || 'אין תיאור'}</p>
                        </div>
                        <span class="status-badge status-${bot.status === 'active' ? 'online' : 'warning'}">
                            ${bot.status || 'unknown'}
                        </span>
                    </div>
                    <div class="flex gap-4 text-sm">
                        <div>
                            <span class="text-gray-500">Trust:</span>
                            <span class="font-bold text-purple-600">${bot.trustScore || 0}</span>
                            <span class="text-gray-500">(${bot.trustLevel || 'new'})</span>
                        </div>
                        <div>
                            <span class="text-gray-500">בעלים:</span>
                            <span class="font-medium">${bot.owner?.name || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ======================
// TAB 6: FUNDRAISING
// ======================
function renderFundraising() {
    const data = dashboardData['fundraising'] || {};
    const content = document.getElementById('fundraising-content');
    
    const docs = data.documents || [];
    const contacts = data.contacts || [];
    
    content.innerHTML = `
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-semibold mb-3">📄 Documents</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${docs.map(doc => `
                        <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="font-medium text-gray-900">${doc.name}</p>
                            <p class="text-sm text-gray-500 mt-1">
                                ${doc.lastUpdated ? new Date(doc.lastUpdated).toLocaleDateString('he-IL') : 'לא עודכן'}
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            ${contacts.length > 0 ? `
                <div>
                    <h3 class="text-lg font-semibold mb-3">👥 Contacts</h3>
                    <div class="space-y-2">
                        ${contacts.map(contact => `
                            <div class="p-4 border border-gray-200 rounded-lg">
                                <p class="font-medium text-gray-900">${contact.name}</p>
                                <p class="text-sm text-gray-500">${contact.phone || ''}</p>
                                <p class="text-sm text-gray-600 mt-1">${contact.status || 'Pending'}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// ======================
// TAB 7: CRON JOBS
// ======================
function renderCronJobs() {
    const data = dashboardData['cron-jobs'] || {};
    const content = document.getElementById('cron-content');
    
    const jobs = data.jobs || [];
    
    if (jobs.length === 0) {
        content.innerHTML = '<p class="text-gray-500 text-center py-8">אין cron jobs</p>';
        return;
    }
    
    const activeJobs = jobs.filter(j => j.enabled);
    const disabledJobs = jobs.filter(j => !j.enabled);
    
    content.innerHTML = `
        <div class="mb-4 flex gap-3 text-sm">
            <div class="px-3 py-1 bg-green-100 text-green-800 rounded">✅ Active: ${activeJobs.length}</div>
            <div class="px-3 py-1 bg-gray-100 text-gray-800 rounded">⏸️ Disabled: ${disabledJobs.length}</div>
        </div>
        
        <div class="overflow-x-auto">
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>שם</th>
                        <th>Target</th>
                        <th>סוג</th>
                        <th>לו"ז</th>
                    </tr>
                </thead>
                <tbody>
                    ${jobs.map(job => `
                        <tr>
                            <td>
                                <span class="status-badge ${job.enabled ? 'status-online' : 'status-warning'}">
                                    ${job.enabled ? '✓' : '⏸'}
                                </span>
                            </td>
                            <td class="font-medium">${job.name}</td>
                            <td>${job.sessionTarget || '-'}</td>
                            <td>${job.payload?.kind || '-'}</td>
                            <td class="text-sm text-gray-500">${job.schedule?.kind || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// ======================
// TAB 8: MEMORY
// ======================
function renderMemory() {
    const data = dashboardData['memory'] || {};
    const content = document.getElementById('memory-content');
    
    content.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
                <p class="text-sm text-blue-600 mb-2">📄 Total Files</p>
                <p class="text-3xl font-bold text-blue-900">${data.totalFiles || 0}</p>
            </div>
            <div class="bg-purple-50 p-6 rounded-lg">
                <p class="text-sm text-purple-600 mb-2">👥 People Profiles</p>
                <p class="text-3xl font-bold text-purple-900">${data.peopleProfiles || 0}</p>
            </div>
            <div class="bg-green-50 p-6 rounded-lg">
                <p class="text-sm text-green-600 mb-2">📚 Daily Notes</p>
                <p class="text-3xl font-bold text-green-900">${data.dailyNotes || 0}</p>
            </div>
        </div>
    `;
}
