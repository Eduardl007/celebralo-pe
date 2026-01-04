/* ========================================
   CELÉBRALO PE - Helper Functions
   ======================================== */

// Format price in Peruvian Soles
function formatPrice(amount, showCurrency = true) {
    const formatted = new Intl.NumberFormat('es-PE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);

    return showCurrency ? `S/ ${formatted}` : formatted;
}

// Format date to Spanish
function formatDate(dateString, format = 'long') {
    const date = new Date(dateString);
    const options = {
        long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        medium: { year: 'numeric', month: 'long', day: 'numeric' },
        short: { year: 'numeric', month: '2-digit', day: '2-digit' }
    };

    return date.toLocaleDateString('es-PE', options[format] || options.medium);
}

// Format relative time (e.g., "hace 2 horas")
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Justo ahora';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    return formatDate(dateString, 'short');
}

// Generate star rating HTML
function generateStars(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    let html = '';

    for (let i = 0; i < fullStars; i++) {
        html += '<i class="fas fa-star active"></i>';
    }
    if (hasHalfStar) {
        html += '<i class="fas fa-star-half-alt active"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="far fa-star"></i>';
    }

    return html;
}

// Truncate text with ellipsis
function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// Slugify text
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Get URL parameter
function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Set URL parameters
function setUrlParams(params) {
    const url = new URL(window.location);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }
    });
    window.history.pushState({}, '', url);
}

// Debounce function
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Scroll to element smoothly
function scrollToElement(selector, offset = 0) {
    const element = document.querySelector(selector);
    if (element) {
        const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return true;
        } catch (e) {
            document.body.removeChild(textArea);
            return false;
        }
    }
}

// Generate unique ID
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Local storage helpers
const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing localStorage:', e);
            return false;
        }
    }
};

// Session storage helpers
const sessionStorage = {
    get(key, defaultValue = null) {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Form validation helpers
const validators = {
    email(value) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(value);
    },

    phone(value) {
        const regex = /^[+]?[\d\s-]{9,15}$/;
        return regex.test(value);
    },

    required(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },

    minLength(value, min) {
        return value.length >= min;
    },

    maxLength(value, max) {
        return value.length <= max;
    },

    number(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },

    date(value) {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date);
    },

    futureDate(value) {
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }
};

// Animation counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Parse capacity range string (e.g., "101-150")
function parseCapacityRange(range) {
    if (!range) return { min: 0, max: Infinity };

    if (range.endsWith('+')) {
        return { min: parseInt(range), max: Infinity };
    }

    const [min, max] = range.split('-').map(n => parseInt(n));
    return { min: min || 0, max: max || Infinity };
}

// Check availability for a date
function isDateAvailable(locale, dateString) {
    // Check blocked dates
    if (locale.blockedDates && locale.blockedDates.includes(dateString)) {
        return false;
    }

    // Check day availability
    const date = new Date(dateString);
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = days[date.getDay()];

    return locale.availability[dayName]?.available || false;
}

// Format phone number for WhatsApp link
function formatWhatsAppLink(phone, message = '') {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
}

// Get initials from name
function getInitials(name, maxChars = 2) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, maxChars);
}

// Detect mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ========================================
// GOOGLE SHEETS INTEGRATION
// ========================================

/**
 * Enviar datos a Google Sheets via Proxy Seguro
 * @param {string} sheetName - Nombre de la hoja (Reservas, Cotizaciones, etc.)
 * @param {object} data - Datos a enviar
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
async function sendToGoogleSheets(sheetName, data) {
    // Usar el servicio seguro de googleSheets si está disponible
    if (typeof googleSheets !== 'undefined' && googleSheets.sendData) {
        try {
            const result = await googleSheets.sendData(sheetName, data);
            if (result.success) {
                console.log(`✅ Enviado a Google Sheets [${sheetName}]`);
                return true;
            }
            console.error(`❌ Error en Google Sheets [${sheetName}]:`, result.error);
            // Guardar localmente como fallback
            saveToLocalQueue(sheetName, { ...data, _timestamp: new Date().toISOString() });
            return false;
        } catch (error) {
            console.error(`❌ Error enviando a Google Sheets:`, error);
            saveToLocalQueue(sheetName, { ...data, _timestamp: new Date().toISOString() });
            return false;
        }
    }

    // Fallback: guardar localmente si el servicio no está disponible
    console.warn(`⚠️ googleSheets no disponible, guardando localmente [${sheetName}]`);
    saveToLocalQueue(sheetName, {
        ...data,
        _timestamp: new Date().toISOString(),
        _source: 'web_app'
    });
    return false;
}

/**
 * Guardar en cola local para sincronización
 */
function saveToLocalQueue(sheetName, data) {
    const key = `celebralo_sheets_${sheetName.toLowerCase()}`;
    const queue = JSON.parse(localStorage.getItem(key) || '[]');

    // Evitar duplicados por ID
    const existingIndex = queue.findIndex(item => item.id === data.id);
    if (existingIndex >= 0) {
        queue[existingIndex] = { ...data, _synced: false };
    } else {
        queue.push({ ...data, _synced: false });
    }

    // Mantener máximo 500 registros por hoja
    if (queue.length > 500) {
        queue.splice(0, queue.length - 500);
    }

    localStorage.setItem(key, JSON.stringify(queue));
}

/**
 * Marcar registro como sincronizado
 */
function markAsSynced(sheetName, id) {
    const key = `celebralo_sheets_${sheetName.toLowerCase()}`;
    const queue = JSON.parse(localStorage.getItem(key) || '[]');

    const item = queue.find(item => item.id === id);
    if (item) {
        item._synced = true;
        localStorage.setItem(key, JSON.stringify(queue));
    }
}

/**
 * Obtener datos pendientes de sincronización
 */
function getPendingSyncData(sheetName = null) {
    if (sheetName) {
        const key = `celebralo_sheets_${sheetName.toLowerCase()}`;
        const queue = JSON.parse(localStorage.getItem(key) || '[]');
        return queue.filter(item => !item._synced);
    }

    // Obtener de todas las hojas
    const sheets = ['reservas', 'cotizaciones', 'usuarios', 'logins', 'feedback', 'busquedas', 'consultas'];
    const pending = {};

    sheets.forEach(sheet => {
        const key = `celebralo_sheets_${sheet}`;
        const queue = JSON.parse(localStorage.getItem(key) || '[]');
        const unsyncedItems = queue.filter(item => !item._synced);
        if (unsyncedItems.length > 0) {
            pending[sheet] = unsyncedItems;
        }
    });

    return pending;
}

/**
 * Obtener estadísticas de datos locales
 */
function getLocalDataStats() {
    const sheets = ['reservas', 'cotizaciones', 'usuarios', 'logins', 'feedback', 'busquedas', 'consultas'];
    const stats = {
        total: 0,
        synced: 0,
        pending: 0,
        bySheet: {}
    };

    sheets.forEach(sheet => {
        const key = `celebralo_sheets_${sheet}`;
        const queue = JSON.parse(localStorage.getItem(key) || '[]');
        const synced = queue.filter(item => item._synced).length;

        stats.bySheet[sheet] = {
            total: queue.length,
            synced: synced,
            pending: queue.length - synced
        };

        stats.total += queue.length;
        stats.synced += synced;
        stats.pending += queue.length - synced;
    });

    return stats;
}

// Exponer función globalmente
window.sendToGoogleSheets = sendToGoogleSheets;
window.getPendingSyncData = getPendingSyncData;
window.getLocalDataStats = getLocalDataStats;

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatPrice,
        formatDate,
        formatRelativeTime,
        generateStars,
        truncateText,
        slugify,
        getUrlParam,
        setUrlParams,
        debounce,
        throttle,
        isInViewport,
        scrollToElement,
        copyToClipboard,
        generateId,
        storage,
        sessionStorage,
        validators,
        animateCounter,
        parseCapacityRange,
        isDateAvailable,
        formatWhatsAppLink,
        getInitials,
        isMobile,
        formatFileSize
    };
}
