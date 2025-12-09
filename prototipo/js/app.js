/* ========================================
   EVENTIFY - Main App Entry Point
   ======================================== */

// App Configuration
const APP_CONFIG = {
    name: 'Eventify Perú',
    version: '1.0.0',
    environment: 'prototype',
    apiBaseUrl: 'https://api.eventify.pe', // Placeholder
    supportPhone: '+51 999 888 777',
    supportEmail: 'hola@eventify.pe',
    whatsappNumber: '+51999888777'
};

// App State
const appState = {
    isLoading: false,
    currentUser: null,
    favorites: {
        locales: [],
        services: []
    },
    cart: [],
    searchFilters: {}
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    console.log(`%c${APP_CONFIG.name} v${APP_CONFIG.version}`, 'font-size: 20px; font-weight: bold; color: #FF6B35;');
    console.log('%cPrototipo Funcional', 'font-size: 12px; color: #6B7280;');

    initApp();
});

async function initApp() {
    try {
        // Load saved state from localStorage
        loadAppState();

        // Initialize global event listeners
        initGlobalEventListeners();

        // Check URL parameters for actions
        handleUrlParams();

        // Mark app as ready
        document.body.classList.add('app-ready');

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Load App State from Storage
function loadAppState() {
    // Load favorites
    appState.favorites.locales = storage.get('eventify_favorites_locales', []);
    appState.favorites.services = storage.get('eventify_favorites_services', []);

    // Load cart
    appState.cart = storage.get('eventify_cart', []);

    // Load user session
    appState.currentUser = storage.get('eventify_user') || sessionStorage.get('eventify_user');

    // Load search filters from session
    appState.searchFilters = sessionStorage.get('eventify_search_filters', {});
}

// Save App State
function saveAppState() {
    storage.set('eventify_favorites_locales', appState.favorites.locales);
    storage.set('eventify_favorites_services', appState.favorites.services);
    storage.set('eventify_cart', appState.cart);
}

// Global Event Listeners
function initGlobalEventListeners() {
    // Handle all clicks for tracking (analytics placeholder)
    document.addEventListener('click', (e) => {
        const trackable = e.target.closest('[data-track]');
        if (trackable) {
            trackEvent(trackable.dataset.track, trackable.dataset);
        }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeAllModals();
        }

        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            focusSearch();
        }
    });

    // Handle online/offline status
    window.addEventListener('online', () => {
        showToast('success', 'Conectado', 'Conexión a internet restablecida');
    });

    window.addEventListener('offline', () => {
        showToast('warning', 'Sin conexión', 'Verifica tu conexión a internet');
    });

    // Handle before unload (save state)
    window.addEventListener('beforeunload', () => {
        saveAppState();
    });
}

// Handle URL Parameters
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);

    // Check for referral
    const ref = params.get('ref');
    if (ref) {
        storage.set('eventify_referral', ref);
        trackEvent('referral', { code: ref });
    }

    // Check for UTM parameters
    const utmSource = params.get('utm_source');
    if (utmSource) {
        sessionStorage.set('eventify_utm', {
            source: utmSource,
            medium: params.get('utm_medium'),
            campaign: params.get('utm_campaign')
        });
    }

    // Check for action parameter
    const action = params.get('action');
    if (action === 'login') {
        setTimeout(() => openAuthModal('login'), 500);
    } else if (action === 'register') {
        setTimeout(() => openAuthModal('register'), 500);
    }
}

// Close All Modals
function closeAllModals() {
    document.querySelectorAll('.modal.active').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Focus Search
function focusSearch() {
    const searchInput = document.querySelector('.search-input, #searchInput, #eventType');
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
}

// Track Event (Analytics Placeholder)
function trackEvent(eventName, data = {}) {
    // In production, this would send to analytics service
    console.log('📊 Track:', eventName, data);

    // Example: Send to Google Analytics
    // gtag('event', eventName, data);
}

// Cart Functions
function addToCart(item) {
    const existingIndex = appState.cart.findIndex(
        i => i.type === item.type && i.id === item.id
    );

    if (existingIndex > -1) {
        // Update quantity if exists
        appState.cart[existingIndex].quantity += 1;
    } else {
        // Add new item
        appState.cart.push({
            ...item,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    saveAppState();
    updateCartUI();
    showToast('success', 'Agregado', `${item.name} agregado al carrito`);
}

function removeFromCart(type, id) {
    appState.cart = appState.cart.filter(
        item => !(item.type === type && item.id === id)
    );
    saveAppState();
    updateCartUI();
}

function clearCart() {
    appState.cart = [];
    saveAppState();
    updateCartUI();
}

function getCartTotal() {
    return appState.cart.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateCartUI() {
    // Update cart badge in header if exists
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const itemCount = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = itemCount;
        cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
    }
}

// Share Function
async function shareContent(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({ title, text, url });
            trackEvent('share', { title, method: 'native' });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    } else {
        // Fallback: copy to clipboard
        const shareUrl = url || window.location.href;
        const copied = await copyToClipboard(shareUrl);
        if (copied) {
            showToast('success', 'Link copiado', 'El enlace ha sido copiado al portapapeles');
        }
    }
}

// WhatsApp Contact
function contactWhatsApp(message = '') {
    const phone = APP_CONFIG.whatsappNumber;
    const url = formatWhatsAppLink(phone, message);
    window.open(url, '_blank');
    trackEvent('contact', { method: 'whatsapp' });
}

// Format Phone Display
function formatPhoneDisplay(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('51')) {
        return `+51 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    }
    return phone;
}

// Lazy Load Images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Service Worker Registration (for PWA - placeholder)
if ('serviceWorker' in navigator && APP_CONFIG.environment === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    });
}

// Global Error Handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });

    // In production, send to error tracking service
    // sendToErrorTracking({ message, source, lineno, colno, error });

    return false;
};

// Export for debugging
window.APP_CONFIG = APP_CONFIG;
window.appState = appState;
