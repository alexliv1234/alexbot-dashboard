// Memory Tab

const Memory = {
    init() {},

    render(data) {
        const memory = data.memory || {};
        this.renderStats(memory);
        this.renderLessons(memory.lessons || []);
    },

    renderStats(memory) {
        document.getElementById('memory-size').textContent = memory.memorySize || '28KB';
        document.getElementById('daily-notes').textContent = memory.dailyNotesCount || 15;
        document.getElementById('total-lessons').textContent = memory.lessonsCount || 34;
        document.getElementById('security-incidents').textContent = memory.attacksBlocked || 47;
    },

    renderLessons(lessons) {
        const list = document.getElementById('lessons-list');
        
        if (!lessons.length) {
            // Default lessons
            lessons = [
                { date: '2026-02-14', title: 'CONCISE answers (max 30 sentences)' },
                { date: '2026-02-11', title: 'False claim defense leak' },
                { date: '2026-02-09', title: 'I\'itoi cron attack (neutralized x3)' },
                { date: '2026-02-09', title: 'Scoring discipline failure' },
                { date: '2026-02-06', title: 'Leaked file structure AGAIN' }
            ];
        }

        list.innerHTML = lessons.slice(0, 10).map(l => `
            <li>
                <span class="date">🗓️ ${l.date}</span>
                <span class="title">${l.title}</span>
            </li>
        `).join('');
    }
};

window.Memory = Memory;
