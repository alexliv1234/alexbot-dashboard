// Global data cache
let dashboardData = {};

// ======================
// UNIVERSAL FILE VIEWER
// ======================

// GitHub raw URL base
const GITHUB_RAW = 'https://raw.githubusercontent.com/alexliv1234/alexbot/main/';

// Open file viewer with auto-detection
async function openFileViewer(filePath, customTitle = null) {
    const title = customTitle || `📄 ${filePath.split('/').pop()}`;
    
    // Show loading modal
    showModal(title, '<div class="text-center py-8"><p class="text-gray-500">טוען קובץ...</p></div>');
    
    try {
        // Fetch file from GitHub
        const url = GITHUB_RAW + filePath;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const rawContent = await response.text();
        const extension = filePath.split('.').pop().toLowerCase();
        
        // Render based on file type
        let renderedContent;
        let toolbar = '';
        
        if (extension === 'json') {
            renderedContent = renderJSON(rawContent);
            toolbar = createToolbar(rawContent, 'json', filePath);
        } else if (extension === 'jsonl') {
            renderedContent = renderJSONL(rawContent);
            toolbar = createToolbar(rawContent, 'jsonl', filePath);
        } else if (extension === 'md') {
            renderedContent = renderMarkdown(rawContent);
            toolbar = createToolbar(rawContent, 'markdown', filePath);
        } else {
            renderedContent = renderPlainText(rawContent);
            toolbar = createToolbar(rawContent, 'text', filePath);
        }
        
        const finalContent = `
            ${toolbar}
            <div class="file-viewer-content">
                ${renderedContent}
            </div>
        `;
        
        // Update modal with rendered content
        showModal(title, finalContent);
        
    } catch (error) {
        console.error('Error loading file:', error);
        showModal(title, `
            <div class="text-center py-8">
                <p class="text-red-600 font-semibold mb-2">❌ שגיאה בטעינת הקובץ</p>
                <p class="text-gray-500 text-sm">${error.message}</p>
            </div>
        `);
    }
}

// Open file viewer with external URL
async function openFileViewerExternal(url, customTitle = null) {
    const title = customTitle || `📄 ${url.split('/').pop()}`;
    
    // Show loading modal
    showModal(title, '<div class="text-center py-8"><p class="text-gray-500">טוען קובץ...</p></div>');
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const rawContent = await response.text();
        const extension = url.split('.').pop().toLowerCase().split('?')[0];
        
        // Render based on file type
        let renderedContent;
        let toolbar = '';
        
        if (extension === 'json') {
            renderedContent = renderJSON(rawContent);
            toolbar = createToolbarExternal(rawContent, 'json', url);
        } else if (extension === 'jsonl') {
            renderedContent = renderJSONL(rawContent);
            toolbar = createToolbarExternal(rawContent, 'jsonl', url);
        } else if (extension === 'md') {
            renderedContent = renderMarkdown(rawContent);
            toolbar = createToolbarExternal(rawContent, 'markdown', url);
        } else {
            renderedContent = renderPlainText(rawContent);
            toolbar = createToolbarExternal(rawContent, 'text', url);
        }
        
        const finalContent = `
            ${toolbar}
            <div class="file-viewer-content">
                ${renderedContent}
            </div>
        `;
        
        // Update modal with rendered content
        showModal(title, finalContent);
        
    } catch (error) {
        console.error('Error loading file:', error);
        showModal(title, `
            <div class="text-center py-8">
                <p class="text-red-600 font-semibold mb-2">❌ שגיאה בטעינת הקובץ</p>
                <p class="text-gray-500 text-sm">${error.message}</p>
            </div>
        `);
    }
}

// Create toolbar for file viewer
function createToolbar(rawContent, fileType, filePath) {
    return `
        <div class="file-viewer-toolbar">
            <span class="text-sm font-medium text-gray-600">
                📄 ${fileType.toUpperCase()} | ${formatFileSize(rawContent.length)}
            </span>
            <div style="flex: 1"></div>
            <button class="file-viewer-btn" onclick="copyToClipboard(\`${rawContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                📋 Copy
            </button>
            <a href="${GITHUB_RAW}${filePath}" download class="file-viewer-btn" style="text-decoration: none;">
                ⬇️ Download
            </a>
        </div>
    `;
}

// Create toolbar for external URLs
function createToolbarExternal(rawContent, fileType, url) {
    return `
        <div class="file-viewer-toolbar">
            <span class="text-sm font-medium text-gray-600">
                📄 ${fileType.toUpperCase()} | ${formatFileSize(rawContent.length)}
            </span>
            <div style="flex: 1"></div>
            <button class="file-viewer-btn" onclick="copyToClipboard(\`${rawContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`)">
                📋 Copy
            </button>
            <a href="${url}" download class="file-viewer-btn" style="text-decoration: none;">
                ⬇️ Download
            </a>
        </div>
    `;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ הועתק ללוח!');
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('❌ שגיאה בהעתקה');
    });
}

// Render JSON with syntax highlighting
function renderJSON(content) {
    try {
        const parsed = JSON.parse(content);
        const formatted = JSON.stringify(parsed, null, 2);
        const highlighted = hljs.highlight(formatted, { language: 'json' }).value;
        
        return `
            <div class="file-viewer-json">
                <pre><code class="hljs language-json">${highlighted}</code></pre>
            </div>
        `;
    } catch (error) {
        return `<div class="p-4 text-red-600">❌ Invalid JSON: ${error.message}</div>`;
    }
}

// Render JSONL as chat timeline
function renderJSONL(content) {
    const lines = content.trim().split('\n').filter(line => line.trim());
    const messages = [];
    
    for (const line of lines) {
        try {
            const parsed = JSON.parse(line);
            messages.push(parsed);
        } catch (error) {
            console.error('Invalid JSONL line:', error);
        }
    }
    
    if (messages.length === 0) {
        return '<div class="p-4 text-gray-500 text-center">אין הודעות</div>';
    }
    
    return `
        <div class="p-4 space-y-4">
            ${messages.map(msg => {
                const timestamp = msg.timestamp ? new Date(msg.timestamp).toLocaleString('he-IL') : '';
                const sender = msg.sender || msg.name || 'Unknown';
                const userMessage = msg.message || msg.original_message || '';
                const botReply = msg.reply || msg.my_reply || '';
                const isBot = msg.sender === 'AlexBot' || msg.fromBot;
                
                return `
                    <div class="chat-message ${isBot ? 'from-bot' : 'from-user'}">
                        <div class="chat-message-header">
                            <span class="chat-message-sender">${isBot ? '🤖 AlexBot' : '👤 ' + sender}</span>
                            <span class="chat-message-time">${timestamp}</span>
                        </div>
                        <div class="chat-message-content">${escapeHtml(userMessage || botReply)}</div>
                        ${botReply && !isBot ? `
                            <div class="mt-2 pt-2 border-t border-gray-200">
                                <div class="text-xs text-gray-500 mb-1">🤖 AlexBot replied:</div>
                                <div class="chat-message-content text-sm">${escapeHtml(botReply)}</div>
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render Markdown
function renderMarkdown(content) {
    try {
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
        
        const html = marked.parse(content);
        return `<div class="file-viewer-markdown">${html}</div>`;
    } catch (error) {
        return `<div class="p-4 text-red-600">❌ Markdown render error: ${error.message}</div>`;
    }
}

// Render plain text
function renderPlainText(content) {
    return `
        <div class="p-4 font-mono text-sm whitespace-pre-wrap bg-gray-50">
            ${escapeHtml(content)}
        </div>
    `;
}

// Escape HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Modal management
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-header">
                <h2 class="text-2xl font-bold text-gray-900 flex-1">${title}</h2>
                <button class="modal-close" onclick="closeModal()">✕</button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

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
    const formatted = date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('last-update').textContent = `Last update: ${formatted}`;
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
                    <span class="text-gray-700">🤖 Active bots</span>
                    <span class="font-bold text-gray-900">${data.health.botsActive || 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">⏳ Pending bots</span>
                    <span class="font-bold text-gray-900">${data.health.botsPending || 0}</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-700">🧠 Memory files</span>
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
                                    <p class="font-medium text-gray-900">${session.label || 'Unknown'}</p>
                                    <p class="text-sm text-gray-500">${session.tokens?.toLocaleString() || 0} tokens${session.channel ? ` • ${session.channel}` : ''}</p>
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
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No data</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${people.map((person, index) => `
                <div class="leaderboard-item clickable-row" onclick="showPersonDetails('${person.phone}', '${person.name}', ${JSON.stringify(person).replace(/"/g, '&quot;')})">
                    <div class="rank-badge rank-${index < 3 ? index + 1 : 'other'}">
                        ${index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <div>
                                <p class="font-semibold text-gray-900">${person.name}</p>
                                <p class="text-xs text-gray-500">${person.messages || 0} messages • avg ${person.avgScore?.toFixed(1) || 0}/70 • 👆 Click for details</p>
                            </div>
                            <div class="text-left">
                                <p class="text-2xl font-bold text-purple-600">${person.totalScore || 0}</p>
                                <p class="text-xs text-gray-500">points</p>
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

// Show detailed person modal
function showPersonDetails(phone, name, personData) {
    const data = typeof personData === 'string' ? JSON.parse(personData.replace(/&quot;/g, '"')) : personData;
    
    const content = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg -m-6 mb-6">
                <h3 class="text-3xl font-bold mb-2">${name}</h3>
                <p class="text-purple-100">${phone}</p>
                <div class="grid grid-cols-3 gap-4 mt-4">
                    <div>
                        <p class="text-purple-200 text-sm">Total Score</p>
                        <p class="text-3xl font-bold">${data.totalScore || 0}</p>
                    </div>
                    <div>
                        <p class="text-purple-200 text-sm">Messages</p>
                        <p class="text-3xl font-bold">${data.messages || 0}</p>
                    </div>
                    <div>
                        <p class="text-purple-200 text-sm">Avg Score</p>
                        <p class="text-3xl font-bold">${data.avgScore?.toFixed(1) || 0}/70</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3">📊 Score Breakdown</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-pink-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">🎨</p>
                        <p class="text-sm text-gray-600">Creativity</p>
                        <p class="text-2xl font-bold text-pink-600">${data.creativity || 0}</p>
                    </div>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">🧠</p>
                        <p class="text-sm text-gray-600">Challenge</p>
                        <p class="text-2xl font-bold text-blue-600">${data.challenge || 0}</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">😂</p>
                        <p class="text-sm text-gray-600">Humor</p>
                        <p class="text-2xl font-bold text-yellow-600">${data.humor || 0}</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">💡</p>
                        <p class="text-sm text-gray-600">Cleverness</p>
                        <p class="text-2xl font-bold text-purple-600">${data.cleverness || 0}</p>
                    </div>
                    <div class="bg-orange-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">🔥</p>
                        <p class="text-sm text-gray-600">Engagement</p>
                        <p class="text-2xl font-bold text-orange-600">${data.engagement || 0}</p>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">🚨</p>
                        <p class="text-sm text-gray-600">Broke</p>
                        <p class="text-2xl font-bold text-red-600">${data.broke || 0}</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">🔓</p>
                        <p class="text-sm text-gray-600">Hacked</p>
                        <p class="text-2xl font-bold text-green-600">${data.hacked || 0}</p>
                    </div>
                    <div class="bg-indigo-50 p-4 rounded-lg">
                        <p class="text-2xl mb-1">📈</p>
                        <p class="text-sm text-gray-600">Rank</p>
                        <p class="text-2xl font-bold text-indigo-600">#${data.position || '?'}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3">💬 View Conversation History</h4>
                <button onclick="openFileViewer('memory/channels/playing-with-alexbot-per-sender/${phone}/conversation.jsonl', '💬 Conversation: ${name}')" 
                   class="inline-flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer">
                    📄 Open Conversation Log (JSONL)
                </button>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                <p><strong>💡 Tip:</strong> The conversation log contains all messages exchanged with AlexBot. You can use tools like <code>jq</code> or open it in a text editor to analyze the full conversation.</p>
            </div>
        </div>
    `;
    
    showModal(`👤 ${name} - Player Details`, content);
}

function renderBotScores() {
    const data = dashboardData['playing-group'] || {};
    const bots = data.botScores || [];
    const container = document.getElementById('bot-leaderboard');
    
    if (bots.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No bots</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${bots.map(bot => `
                <div class="p-4 bg-gray-50 rounded-lg">
                    <div class="flex items-center justify-between mb-3">
                        <div>
                            <p class="font-semibold text-gray-900">🤖 ${bot.name}</p>
                            <p class="text-sm text-gray-500">${bot.interactions || 0} interactions • Trust: ${bot.trustScore || 0}</p>
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
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No suggestions</p>';
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
                                <div class="p-4 bg-${config.color}-50 border border-${config.color}-200 rounded-lg clickable-row hover:border-${config.color}-400"
                                     onclick="showSuggestionDetails(${JSON.stringify(suggestion).replace(/"/g, '&quot;')})">
                                    <div class="flex items-start justify-between mb-2">
                                        <div class="flex-1">
                                            <p class="font-medium text-gray-900">${suggestion.description || 'No description'}</p>
                                            <p class="text-sm text-gray-500 mt-1">
                                                ${suggestion.suggestedBy || 'Unknown'} • 
                                                ${suggestion.type || 'general'} • 
                                                ${new Date(suggestion.timestamp).toLocaleDateString('he-IL')} • 
                                                👆 Click for details
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

// Show suggestion details modal
function showSuggestionDetails(suggestionData) {
    const suggestion = typeof suggestionData === 'string' ? JSON.parse(suggestionData.replace(/&quot;/g, '"')) : suggestionData;
    
    const statusConfig = {
        pending: { icon: '⏳', color: 'yellow', text: 'Pending Review' },
        implemented: { icon: '✅', color: 'green', text: 'Implemented' },
        rejected: { icon: '❌', color: 'red', text: 'Rejected' }
    };
    
    const config = statusConfig[suggestion.status] || statusConfig.pending;
    
    const content = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-${config.color}-600 to-${config.color}-700 text-white p-6 rounded-lg -m-6 mb-6">
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-4xl">${config.icon}</span>
                    <div class="flex-1">
                        <p class="text-${config.color}-100 text-sm">${config.text}</p>
                        <h3 class="text-2xl font-bold">${suggestion.description}</h3>
                    </div>
                </div>
                <div class="flex gap-6 mt-4">
                    <div>
                        <p class="text-${config.color}-200 text-sm">Score</p>
                        <p class="text-3xl font-bold">${suggestion.totalScore || 0}/50</p>
                    </div>
                    <div>
                        <p class="text-${config.color}-200 text-sm">Type</p>
                        <p class="text-xl font-bold">${suggestion.type || 'general'}</p>
                    </div>
                    <div>
                        <p class="text-${config.color}-200 text-sm">Date</p>
                        <p class="text-xl font-bold">${new Date(suggestion.timestamp).toLocaleDateString('he-IL')}</p>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3">📊 Score Breakdown</h4>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div class="bg-blue-50 p-4 rounded-lg text-center">
                        <p class="text-2xl mb-1">⚙️</p>
                        <p class="text-xs text-gray-600 mb-1">Complexity</p>
                        <p class="text-2xl font-bold text-blue-600">${suggestion.complexity || 0}/10</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg text-center">
                        <p class="text-2xl mb-1">💡</p>
                        <p class="text-xs text-gray-600 mb-1">Ingenuity</p>
                        <p class="text-2xl font-bold text-purple-600">${suggestion.ingenuity || 0}/10</p>
                    </div>
                    <div class="bg-green-50 p-4 rounded-lg text-center">
                        <p class="text-2xl mb-1">🚀</p>
                        <p class="text-xs text-gray-600 mb-1">Impact</p>
                        <p class="text-2xl font-bold text-green-600">${suggestion.impact || 0}/10</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg text-center">
                        <p class="text-2xl mb-1">✅</p>
                        <p class="text-xs text-gray-600 mb-1">Feasibility</p>
                        <p class="text-2xl font-bold text-yellow-600">${suggestion.feasibility || 0}/10</p>
                    </div>
                    <div class="bg-red-50 p-4 rounded-lg text-center">
                        <p class="text-2xl mb-1">🔥</p>
                        <p class="text-xs text-gray-600 mb-1">Priority</p>
                        <p class="text-2xl font-bold text-red-600">${suggestion.priority || 0}/10</p>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Suggested By</p>
                    <p class="font-bold text-gray-900">${suggestion.suggestedBy || 'Unknown'}</p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm text-gray-600 mb-1">Phone</p>
                    <p class="font-bold text-gray-900">${suggestion.phone || '-'}</p>
                </div>
            </div>
            
            ${suggestion.implementationNotes ? `
                <div class="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
                    <p class="font-semibold text-green-900 mb-2">✅ Implementation Notes</p>
                    <p class="text-green-800">${suggestion.implementationNotes}</p>
                </div>
            ` : ''}
            
            ${suggestion.rejectionReason ? `
                <div class="bg-red-50 border-2 border-red-200 p-4 rounded-lg">
                    <p class="font-semibold text-red-900 mb-2">❌ Rejection Reason</p>
                    <p class="text-red-800">${suggestion.rejectionReason}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    showModal(`💡 Suggestion Details`, content);
}

function renderDailySummaries() {
    const data = dashboardData['playing-group'] || {};
    const summaries = data.dailySummaries || [];
    const container = document.getElementById('daily-summaries');
    
    if (summaries.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No summaries</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${summaries.map(summary => `
                <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 clickable-row" 
                     onclick="showDailySummaryDetails('${summary.date}', ${summary.totalMessages || 0}, ${JSON.stringify(summary.winners || []).replace(/"/g, '&quot;')})">
                    <div class="flex items-center justify-between mb-2">
                        <p class="font-semibold text-gray-900">${summary.date}</p>
                        <span class="text-sm text-gray-500">${summary.totalMessages || 0} messages • 👆 Click for details</span>
                    </div>
                    ${summary.winners ? `
                        <div class="flex gap-4 mt-3">
                            ${summary.winners.map((winner, i) => `
                                <div class="flex items-center gap-2">
                                    <span class="text-xl">${['🥇', '🥈', '🥉'][i]}</span>
                                    <div>
                                        <p class="font-medium text-sm">${winner.name}</p>
                                        <p class="text-xs text-gray-500">${winner.score} points</p>
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

// Show daily summary details modal
function showDailySummaryDetails(date, totalMessages, winnersData) {
    const winners = typeof winnersData === 'string' ? JSON.parse(winnersData.replace(/&quot;/g, '"')) : winnersData;
    
    const content = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg -m-6 mb-6">
                <h3 class="text-3xl font-bold mb-2">📅 ${date}</h3>
                <p class="text-2xl font-bold mt-3">${totalMessages} Messages</p>
            </div>
            
            ${winners && winners.length > 0 ? `
                <div>
                    <h4 class="text-lg font-semibold mb-3">🏆 Top 3 Winners</h4>
                    <div class="space-y-3">
                        ${winners.map((winner, i) => `
                            <div class="flex items-center gap-4 p-4 rounded-lg ${
                                i === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                                i === 1 ? 'bg-gray-50 border-2 border-gray-400' :
                                'bg-orange-50 border-2 border-orange-400'
                            }">
                                <span class="text-4xl">${['🥇', '🥈', '🥉'][i]}</span>
                                <div class="flex-1">
                                    <p class="font-bold text-lg">${winner.name}</p>
                                    <p class="text-sm text-gray-600">Total Score: ${winner.score} points</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div>
                <h4 class="text-lg font-semibold mb-3">📄 View Full Day Log</h4>
                <button onclick="openFileViewer('memory/channels/playing-with-alexbot-daily/${date}.jsonl', '📅 Daily Log: ${date}')" 
                   class="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-2 border-indigo-200 hover:border-indigo-600 transition cursor-pointer">
                    <div class="text-right">
                        <p class="font-semibold text-indigo-900">📄 Daily Log (JSONL)</p>
                        <p class="text-sm text-indigo-600 mt-1">All messages from ${date}</p>
                    </div>
                    <span class="text-2xl text-indigo-600">→</span>
                </button>
            </div>
            
            <div class="bg-purple-50 p-4 rounded-lg">
                <p class="font-semibold text-purple-900 mb-2">📊 What's in the daily log?</p>
                <ul class="text-sm text-purple-800 space-y-1 list-disc list-inside">
                    <li>All messages sent in the group that day</li>
                    <li>Timestamps for each message</li>
                    <li>Sender information (name + phone)</li>
                    <li>My replies to each message</li>
                    <li>Scores given (if applicable)</li>
                </ul>
            </div>
        </div>
    `;
    
    showModal(`📅 Daily Summary: ${date}`, content);
}

function renderConversations() {
    const data = dashboardData['playing-group'] || {};
    const conversations = data.conversations || [];
    const container = document.getElementById('conversation-logs');
    
    if (conversations.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-8">No conversations</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-2">
            ${conversations.map(conv => `
                <div class="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 clickable-row" 
                     onclick="showConversationDetails('${conv.phone}', '${conv.name}', ${conv.messageCount || 0})">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="font-medium text-gray-900">${conv.name}</p>
                            <p class="text-sm text-gray-500">${conv.phone} • 👆 Click to view</p>
                        </div>
                        <div class="text-left">
                            <p class="text-sm font-medium text-gray-700">${conv.messageCount || 0} messages</p>
                            <p class="text-xs text-gray-500">${conv.lastMessage ? new Date(conv.lastMessage).toLocaleDateString('he-IL') : '-'}</p>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Show conversation details modal
function showConversationDetails(phone, name, messageCount) {
    const content = `
        <div class="space-y-6">
            <div class="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-lg -m-6 mb-6">
                <h3 class="text-3xl font-bold mb-2">💬 ${name}</h3>
                <p class="text-green-100">${phone}</p>
                <p class="text-2xl font-bold mt-3">${messageCount} Messages</p>
            </div>
            
            <div>
                <h4 class="text-lg font-semibold mb-3">📄 View Full Conversation</h4>
                <div class="space-y-3">
                    <button onclick="openFileViewer('memory/channels/playing-with-alexbot-per-sender/${phone}/conversation.jsonl', '💬 Conversation: ${name}')" 
                       class="w-full flex items-center justify-between p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg border-2 border-indigo-200 hover:border-indigo-600 transition cursor-pointer">
                        <div class="text-right">
                            <p class="font-semibold text-indigo-900">📄 Conversation Log (JSONL)</p>
                            <p class="text-sm text-indigo-600 mt-1">All messages in chronological order</p>
                        </div>
                        <span class="text-2xl text-indigo-600">→</span>
                    </button>
                </div>
            </div>
            
            <div class="bg-blue-50 p-4 rounded-lg">
                <p class="font-semibold text-blue-900 mb-2">💡 How to read JSONL files:</p>
                <div class="text-sm text-blue-800 space-y-1">
                    <p>• <strong>In terminal:</strong> <code class="bg-white px-2 py-1 rounded">cat file.jsonl | jq .</code></p>
                    <p>• <strong>In browser:</strong> Use a JSON viewer extension</p>
                    <p>• <strong>Format:</strong> Each line is a JSON object with timestamp, sender, message, and reply</p>
                </div>
            </div>
        </div>
    `;
    
    showModal(`💬 Conversation: ${name}`, content);
}

// ======================
// TAB 4: LEARNING GROUP
// ======================
function renderLearningGroup() {
    const data = dashboardData['learning-group'] || {};
    const content = document.getElementById('learning-content');
    
    const guides = [
        { name: 'FAQ', emoji: '❓', file: 'FAQ.md' },
        { name: 'Model Parameters', emoji: '🎛️', file: '01-model-parameters.md' },
        { name: 'Prompt Engineering', emoji: '✍️', file: '02-prompt-engineering.md' },
        { name: 'Context Management', emoji: '📦', file: '03-context-management.md' },
        { name: 'File Operations', emoji: '📁', file: '04-file-operations.md' },
        { name: 'Security Boundaries', emoji: '🔒', file: '05-security-boundaries.md' },
        { name: 'Tool Usage', emoji: '🛠️', file: '06-tool-usage.md' },
        { name: 'Memory System', emoji: '🧠', file: '07-memory-system.md' },
        { name: 'Multi-Agent', emoji: '🤖', file: '08-multi-agent.md' },
        { name: 'Scoring System', emoji: '🎯', file: '09-scoring-system.md' },
        { name: 'Cron Automation', emoji: '⏰', file: '10-cron-automation.md' }
    ];
    
    content.innerHTML = `
        <div class="space-y-6">
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
            
            <div>
                <h3 class="text-xl font-bold mb-4">📖 Available Learning Guides</h3>
                <p class="text-gray-600 mb-4">כל המדריכים נמצאים ב-GitHub והם פתוחים לכולם</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    ${guides.map(guide => `
                        <button onclick="openFileViewerExternal('https://raw.githubusercontent.com/alexliv1234/alexbot-learning-guides/main/${guide.file}', '${guide.emoji} ${guide.name}')" 
                           class="w-full p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg border-2 border-transparent hover:border-indigo-600 transition cursor-pointer">
                            <div class="flex items-center gap-3">
                                <span class="text-3xl">${guide.emoji}</span>
                                <div class="flex-1 text-right">
                                    <p class="font-semibold text-gray-900">${guide.name}</p>
                                    <p class="text-xs text-gray-500 mt-1">לחץ לקריאה →</p>
                                </div>
                            </div>
                        </button>
                    `).join('')}
                </div>
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
        content.innerHTML = '<p class="text-gray-500 text-center py-8">No bots רשומים</p>';
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
                            <p class="text-sm text-gray-600 mt-1">${bot.description || 'No description'}</p>
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
    
    // Map document names to file paths
    const docPaths = {
        'Business Plan': 'fundraising/business-plan.md',
        'Pitch Deck': 'fundraising/pitch-deck.md',
        'Competitive Analysis': 'fundraising/competitive-analysis.md',
        'Go-to-Market Strategy': 'fundraising/go-to-market.md'
    };
    
    content.innerHTML = `
        <div class="space-y-6">
            <div>
                <h3 class="text-lg font-semibold mb-3">📄 Documents</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${docs.map(doc => `
                        <button onclick="openFileViewer('${docPaths[doc.name] || '#'}', '💰 ${doc.name}')" 
                           class="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-indigo-600 transition cursor-pointer">
                            <div class="flex items-center justify-between">
                                <div class="text-right">
                                    <p class="font-medium text-gray-900">${doc.name}</p>
                                    <p class="text-sm text-gray-500 mt-1">
                                        ${doc.lastUpdated ? new Date(doc.lastUpdated).toLocaleDateString('he-IL') : 'לא עודכן'}
                                    </p>
                                </div>
                                <span class="text-indigo-600 text-xl">📄 →</span>
                            </div>
                        </button>
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
        content.innerHTML = '<p class="text-gray-500 text-center py-8">No cron jobs</p>';
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
                        <th>Name</th>
                        <th>Target</th>
                        <th>Type</th>
                        <th>Schedule</th>
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
