/* ========================================
   EVENTIFY - Toast Notifications Component
   ======================================== */

class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
        this.toasts = [];
        this.maxToasts = 5;
        this.defaultDuration = 4000;

        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'toastContainer';
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    }

    show(type, title, message, duration = this.defaultDuration) {
        // Limit number of toasts
        if (this.toasts.length >= this.maxToasts) {
            this.remove(this.toasts[0].id);
        }

        const id = generateId('toast');
        const toast = this.createToast(id, type, title, message);

        this.container.appendChild(toast);
        this.toasts.push({ id, element: toast });

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }

        return id;
    }

    createToast(id, type, title, message) {
        const icons = {
            success: 'fa-check',
            error: 'fa-times',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };

        const toast = document.createElement('div');
        toast.id = id;
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${icons[type] || icons.info}"></i>
            </div>
            <div class="toast-content">
                ${title ? `<div class="toast-title">${title}</div>` : ''}
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close" onclick="toastManager.remove('${id}')">
                <i class="fas fa-times"></i>
            </button>
        `;

        return toast;
    }

    remove(id) {
        const index = this.toasts.findIndex(t => t.id === id);
        if (index === -1) return;

        const toast = this.toasts[index];
        toast.element.style.animation = 'slideOutRight 0.3s ease-out forwards';

        setTimeout(() => {
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
            this.toasts.splice(index, 1);
        }, 300);
    }

    success(title, message, duration) {
        return this.show('success', title, message, duration);
    }

    error(title, message, duration) {
        return this.show('error', title, message, duration);
    }

    warning(title, message, duration) {
        return this.show('warning', title, message, duration);
    }

    info(title, message, duration) {
        return this.show('info', title, message, duration);
    }

    clear() {
        this.toasts.forEach(toast => {
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
        });
        this.toasts = [];
    }
}

// Add slide out animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(styleSheet);

// Initialize toast manager
const toastManager = new ToastManager();

// Global shorthand function
function showToast(type, title, message, duration) {
    return toastManager.show(type, title, message, duration);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToastManager, toastManager, showToast };
}
