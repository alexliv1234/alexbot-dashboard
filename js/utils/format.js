// Format utilities for AlexBot Dashboard

const Format = {
    // Format numbers with commas
    number(num) {
        if (num === null || num === undefined) return '--';
        return new Intl.NumberFormat().format(num);
    },

    // Format currency
    currency(amount) {
        if (amount === null || amount === undefined) return '--';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Format relative time
    relativeTime(date) {
        if (!date) return '--';
        const now = new Date();
        const then = new Date(date);
        const diff = (now - then) / 1000; // seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    },

    // Format date
    date(date) {
        if (!date) return '--';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    },

    // Format time
    time(date) {
        if (!date) return '--';
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format uptime
    uptime(startDate) {
        if (!startDate) return '--';
        const now = new Date();
        const start = new Date(startDate);
        const diff = (now - start) / 1000;

        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);

        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        return `${minutes}m`;
    },

    // Format file size
    fileSize(bytes) {
        if (!bytes) return '--';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) {
            bytes /= 1024;
            i++;
        }
        return `${bytes.toFixed(1)} ${units[i]}`;
    },

    // Mask phone number (security)
    maskPhone(phone) {
        if (!phone) return '--';
        if (phone.length < 8) return phone;
        return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
    },

    // Truncate text
    truncate(text, maxLength = 50) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    },

    // Format percentage
    percentage(value, total) {
        if (!value || !total) return '0%';
        return `${Math.round((value / total) * 100)}%`;
    },

    // Calculate days between dates
    daysBetween(date1, date2 = new Date()) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        const diff = Math.abs(d2 - d1);
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
};

// Make it globally available
window.Format = Format;
