/* ========================================
   CELÉBRALO PE - User Manager Component
   Sistema de gestión de usuarios, conversaciones,
   reservas y favoritos
   ======================================== */

class UserManager {
    constructor() {
        this.currentUser = null;
        this.conversations = {};
        this.reservations = [];
        this.favorites = { locales: [], servicios: [] };
        this.recentlyViewed = { locales: [], servicios: [] };

        this.STORAGE_KEYS = {
            user: 'celebralope_user',
            conversations: 'celebralo_conversations',
            reservations: 'celebralo_reservations',
            favorites: 'celebralo_favorites',
            recentlyViewed: 'celebralo_recently_viewed'
        };

        this.init();
    }

    init() {
        this.loadUserData();
        this.loadConversations();
        this.loadReservations();
        this.loadFavorites();
        this.loadRecentlyViewed();
    }

    // ========================================
    // USER DATA MANAGEMENT
    // ========================================

    loadUserData() {
        this.currentUser = storage.get(this.STORAGE_KEYS.user) ||
                          sessionStorage.get(this.STORAGE_KEYS.user) ||
                          null;
        return this.currentUser;
    }

    getUserData() {
        return this.currentUser;
    }

    updateUserData(data) {
        if (!this.currentUser) return false;

        this.currentUser = { ...this.currentUser, ...data };
        storage.set(this.STORAGE_KEYS.user, this.currentUser);
        return true;
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    logout() {
        this.currentUser = null;
        storage.remove(this.STORAGE_KEYS.user);
        sessionStorage.clear();
    }

    // ========================================
    // CONVERSATIONS MANAGEMENT
    // ========================================

    loadConversations() {
        this.conversations = storage.get(this.STORAGE_KEYS.conversations) || {};
        return this.conversations;
    }

    getConversations() {
        return this.conversations;
    }

    getConversation(providerId) {
        const key = `provider_${providerId}`;
        return this.conversations[key] || null;
    }

    saveConversation(providerId, providerData, messages) {
        const key = `provider_${providerId}`;
        const lastMessage = messages[messages.length - 1];

        this.conversations[key] = {
            providerId: providerId,
            providerName: providerData.name || providerData.ownerName || 'Proveedor',
            providerType: providerData.type || 'local',
            providerSlug: providerData.slug || '',
            lastMessage: lastMessage?.text || '',
            lastMessageTime: new Date().toISOString(),
            unreadCount: providerData.incrementUnread ? (this.conversations[key]?.unreadCount || 0) + 1 : 0,
            messages: messages
        };

        storage.set(this.STORAGE_KEYS.conversations, this.conversations);
        return this.conversations[key];
    }

    addMessageToConversation(providerId, message, providerData = {}) {
        const key = `provider_${providerId}`;
        const existing = this.conversations[key];

        if (existing) {
            existing.messages.push(message);
            existing.lastMessage = message.text;
            existing.lastMessageTime = new Date().toISOString();
            if (message.type === 'bot') {
                existing.unreadCount = (existing.unreadCount || 0) + 1;
            }
        } else {
            this.conversations[key] = {
                providerId: providerId,
                providerName: providerData.name || 'Proveedor',
                providerType: providerData.type || 'local',
                providerSlug: providerData.slug || '',
                lastMessage: message.text,
                lastMessageTime: new Date().toISOString(),
                unreadCount: message.type === 'bot' ? 1 : 0,
                messages: [message]
            };
        }

        storage.set(this.STORAGE_KEYS.conversations, this.conversations);
        return this.conversations[key];
    }

    markConversationAsRead(providerId) {
        const key = `provider_${providerId}`;
        if (this.conversations[key]) {
            this.conversations[key].unreadCount = 0;
            storage.set(this.STORAGE_KEYS.conversations, this.conversations);
        }
    }

    getUnreadCount() {
        let total = 0;
        Object.values(this.conversations).forEach(conv => {
            total += conv.unreadCount || 0;
        });
        return total;
    }

    deleteConversation(providerId) {
        const key = `provider_${providerId}`;
        if (this.conversations[key]) {
            delete this.conversations[key];
            storage.set(this.STORAGE_KEYS.conversations, this.conversations);
            return true;
        }
        return false;
    }

    // ========================================
    // RESERVATIONS MANAGEMENT
    // ========================================

    loadReservations() {
        this.reservations = storage.get(this.STORAGE_KEYS.reservations) || [];
        return this.reservations;
    }

    getReservations(filter = null) {
        if (!filter) return this.reservations;

        return this.reservations.filter(res => {
            if (filter.estado) return res.estado === filter.estado;
            if (filter.tipo) return res.tipo === filter.tipo;
            return true;
        });
    }

    getReservation(id) {
        return this.reservations.find(r => r.id === id);
    }

    addReservation(reservationData) {
        const reservation = {
            id: reservationData.id || `RES-${Date.now()}`,
            ...reservationData,
            estado: reservationData.estado || 'pendiente',
            createdAt: new Date().toISOString()
        };

        this.reservations.unshift(reservation);
        storage.set(this.STORAGE_KEYS.reservations, this.reservations);
        return reservation;
    }

    updateReservation(id, data) {
        const index = this.reservations.findIndex(r => r.id === id);
        if (index > -1) {
            this.reservations[index] = { ...this.reservations[index], ...data };
            storage.set(this.STORAGE_KEYS.reservations, this.reservations);
            return this.reservations[index];
        }
        return null;
    }

    cancelReservation(id) {
        return this.updateReservation(id, { estado: 'cancelada', cancelledAt: new Date().toISOString() });
    }

    getUpcomingReservations() {
        const now = new Date();
        return this.reservations.filter(res => {
            if (res.estado === 'cancelada' || res.estado === 'completada') return false;
            const eventDate = new Date(res.fechaEvento);
            return eventDate >= now;
        }).sort((a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento));
    }

    // ========================================
    // FAVORITES MANAGEMENT
    // ========================================

    loadFavorites() {
        this.favorites = storage.get(this.STORAGE_KEYS.favorites) || { locales: [], servicios: [] };
        return this.favorites;
    }

    getFavorites(type = null) {
        if (type) return this.favorites[type] || [];
        return this.favorites;
    }

    addFavorite(id, type = 'locales') {
        if (!this.favorites[type]) this.favorites[type] = [];

        if (!this.favorites[type].includes(id)) {
            this.favorites[type].push(id);
            storage.set(this.STORAGE_KEYS.favorites, this.favorites);
            return true;
        }
        return false;
    }

    removeFavorite(id, type = 'locales') {
        if (!this.favorites[type]) return false;

        const index = this.favorites[type].indexOf(id);
        if (index > -1) {
            this.favorites[type].splice(index, 1);
            storage.set(this.STORAGE_KEYS.favorites, this.favorites);
            return true;
        }
        return false;
    }

    toggleFavorite(id, type = 'locales') {
        if (this.isFavorite(id, type)) {
            this.removeFavorite(id, type);
            return false;
        } else {
            this.addFavorite(id, type);
            return true;
        }
    }

    isFavorite(id, type = 'locales') {
        return (this.favorites[type] || []).includes(id);
    }

    getFavoritesCount() {
        return (this.favorites.locales?.length || 0) + (this.favorites.servicios?.length || 0);
    }

    // ========================================
    // RECENTLY VIEWED MANAGEMENT
    // ========================================

    loadRecentlyViewed() {
        this.recentlyViewed = storage.get(this.STORAGE_KEYS.recentlyViewed) || { locales: [], servicios: [] };
        return this.recentlyViewed;
    }

    getRecentlyViewed(type = null) {
        if (type) return this.recentlyViewed[type] || [];
        return this.recentlyViewed;
    }

    addToRecentlyViewed(item, type = 'locales') {
        if (!this.recentlyViewed[type]) this.recentlyViewed[type] = [];

        // Remove if already exists
        const existingIndex = this.recentlyViewed[type].findIndex(i => i.id === item.id);
        if (existingIndex > -1) {
            this.recentlyViewed[type].splice(existingIndex, 1);
        }

        // Add to beginning
        this.recentlyViewed[type].unshift({
            id: item.id,
            slug: item.slug,
            name: item.name,
            icon: item.icon,
            rating: item.rating,
            price: item.price?.base || item.priceRange,
            viewedAt: new Date().toISOString()
        });

        // Keep only last 6
        if (this.recentlyViewed[type].length > 6) {
            this.recentlyViewed[type] = this.recentlyViewed[type].slice(0, 6);
        }

        storage.set(this.STORAGE_KEYS.recentlyViewed, this.recentlyViewed);
        return this.recentlyViewed[type];
    }

    clearRecentlyViewed(type = null) {
        if (type) {
            this.recentlyViewed[type] = [];
        } else {
            this.recentlyViewed = { locales: [], servicios: [] };
        }
        storage.set(this.STORAGE_KEYS.recentlyViewed, this.recentlyViewed);
    }

    // ========================================
    // SEARCH HISTORY
    // ========================================

    saveSearch(query, resultsCount = 0) {
        const searches = storage.get('celebralo_recent_searches') || [];

        // Remove duplicates
        const filtered = searches.filter(s => s.query.toLowerCase() !== query.toLowerCase());

        // Add new search
        filtered.unshift({
            query: query,
            results: resultsCount,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10
        const trimmed = filtered.slice(0, 10);
        storage.set('celebralo_recent_searches', trimmed);
        return trimmed;
    }

    getRecentSearches() {
        return storage.get('celebralo_recent_searches') || [];
    }

    clearSearchHistory() {
        storage.remove('celebralo_recent_searches');
    }

    // ========================================
    // NOTIFICATION BADGES
    // ========================================

    updateNotificationBadges() {
        // Update conversation badge in header
        const unreadCount = this.getUnreadCount();
        const headerBadge = document.querySelector('.chatbot-badge');

        if (headerBadge) {
            if (unreadCount > 0) {
                headerBadge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                headerBadge.style.display = 'flex';
            } else {
                headerBadge.style.display = 'none';
            }
        }

        // Update Mi Cuenta badge if exists
        const accountBadge = document.getElementById('unreadBadge');
        if (accountBadge) {
            if (unreadCount > 0) {
                accountBadge.textContent = unreadCount;
                accountBadge.style.display = 'inline-block';
            } else {
                accountBadge.style.display = 'none';
            }
        }
    }

    // ========================================
    // USER STATS
    // ========================================

    getUserStats() {
        return {
            reservations: this.reservations.length,
            upcomingReservations: this.getUpcomingReservations().length,
            completedReservations: this.reservations.filter(r => r.estado === 'completada').length,
            messages: Object.keys(this.conversations).length,
            unreadMessages: this.getUnreadCount(),
            favorites: this.getFavoritesCount(),
            recentlyViewed: (this.recentlyViewed.locales?.length || 0) + (this.recentlyViewed.servicios?.length || 0)
        };
    }
}

// Create global instance
window.userManager = new UserManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserManager;
}
