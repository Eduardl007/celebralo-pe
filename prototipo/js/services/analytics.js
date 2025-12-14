/* ========================================
   EVENTIFY - Google Analytics 4 Integration
   Métricas y KPIs para monitoreo
   ======================================== */

/**
 * CONFIGURACIÓN DE GOOGLE ANALYTICS 4
 *
 * Para usar esta integración:
 * 1. Crear cuenta en Google Analytics (analytics.google.com)
 * 2. Crear propiedad GA4
 * 3. Obtener el Measurement ID (formato: G-XXXXXXXXXX)
 * 4. Reemplazar el ID abajo
 */

const GA_CONFIG = {
    // Tu Measurement ID de GA4 (reemplazar con tu ID)
    measurementId: 'G-XXXXXXXXXX',

    // Activar modo debug (ver eventos en consola)
    debug: true,

    // Configuración adicional
    sendPageViews: true,
    anonymizeIp: true
};

/**
 * Servicio de Analytics
 */
class AnalyticsService {
    constructor() {
        this.measurementId = GA_CONFIG.measurementId;
        this.isConfigured = !this.measurementId.includes('XXXXXXXXXX');
        this.isInitialized = false;
    }

    /**
     * Inicializar Google Analytics
     */
    init() {
        if (!this.isConfigured) {
            console.warn('⚠️ Google Analytics no configurado. Usando modo simulación.');
            this.isInitialized = true;
            return;
        }

        // Cargar gtag.js dinámicamente
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Configurar dataLayer
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
            dataLayer.push(arguments);
        };

        gtag('js', new Date());
        gtag('config', this.measurementId, {
            'anonymize_ip': GA_CONFIG.anonymizeIp,
            'send_page_view': GA_CONFIG.sendPageViews
        });

        this.isInitialized = true;
        console.log('✅ Google Analytics inicializado');
    }

    /**
     * Enviar evento personalizado
     */
    trackEvent(eventName, parameters = {}) {
        const eventData = {
            ...parameters,
            timestamp: new Date().toISOString()
        };

        if (GA_CONFIG.debug) {
            console.log('📊 Analytics Event:', eventName, eventData);
        }

        if (this.isConfigured && window.gtag) {
            gtag('event', eventName, eventData);
        }

        // También guardar localmente para respaldo
        this.saveEventLocally(eventName, eventData);
    }

    /**
     * Guardar evento localmente
     */
    saveEventLocally(eventName, data) {
        const key = 'eventify_analytics_events';
        const events = JSON.parse(localStorage.getItem(key) || '[]');

        // Mantener solo los últimos 100 eventos
        if (events.length >= 100) {
            events.shift();
        }

        events.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem(key, JSON.stringify(events));
    }

    // ========================================
    // EVENTOS DE USUARIO
    // ========================================

    /**
     * Usuario registrado
     */
    trackUserRegistration(method = 'email') {
        this.trackEvent('sign_up', {
            method: method,
            event_category: 'engagement',
            event_label: 'user_registration'
        });
    }

    /**
     * Usuario logueado
     */
    trackUserLogin(method = 'email') {
        this.trackEvent('login', {
            method: method,
            event_category: 'engagement',
            event_label: 'user_login'
        });
    }

    // ========================================
    // EVENTOS DE BÚSQUEDA
    // ========================================

    /**
     * Búsqueda realizada
     */
    trackSearch(searchTerm, category = 'general') {
        this.trackEvent('search', {
            search_term: searchTerm,
            search_category: category,
            event_category: 'search'
        });
    }

    /**
     * Filtros aplicados
     */
    trackFilterApplied(filterType, filterValue) {
        this.trackEvent('filter_applied', {
            filter_type: filterType,
            filter_value: filterValue,
            event_category: 'search'
        });
    }

    // ========================================
    // EVENTOS DE LOCALES/SERVICIOS
    // ========================================

    /**
     * Ver detalle de local
     */
    trackViewLocal(localId, localName, category) {
        this.trackEvent('view_item', {
            item_id: localId,
            item_name: localName,
            item_category: category,
            event_category: 'locales'
        });
    }

    /**
     * Ver detalle de servicio
     */
    trackViewService(serviceId, serviceName, category) {
        this.trackEvent('view_item', {
            item_id: serviceId,
            item_name: serviceName,
            item_category: category,
            event_category: 'servicios'
        });
    }

    /**
     * Agregar a favoritos
     */
    trackAddToFavorites(itemType, itemId, itemName) {
        this.trackEvent('add_to_wishlist', {
            item_type: itemType,
            item_id: itemId,
            item_name: itemName,
            event_category: 'engagement'
        });
    }

    // ========================================
    // EVENTOS DE CONVERSIÓN
    // ========================================

    /**
     * Inicio de reserva
     */
    trackBeginReservation(localId, localName, eventType) {
        this.trackEvent('begin_checkout', {
            item_id: localId,
            item_name: localName,
            event_type: eventType,
            event_category: 'conversion'
        });
    }

    /**
     * Reserva completada
     */
    trackReservationComplete(reservationData) {
        this.trackEvent('purchase', {
            transaction_id: reservationData.id,
            value: reservationData.totalPrice,
            currency: 'PEN',
            items: [{
                item_id: reservationData.localId,
                item_name: reservationData.localName,
                item_category: reservationData.eventType,
                price: reservationData.totalPrice
            }],
            event_category: 'conversion'
        });
    }

    /**
     * Cotización solicitada
     */
    trackQuoteRequest(eventType, guestCount) {
        this.trackEvent('generate_lead', {
            event_type: eventType,
            guest_count: guestCount,
            event_category: 'conversion',
            event_label: 'quote_request'
        });
    }

    /**
     * Contacto iniciado (WhatsApp, teléfono)
     */
    trackContact(method, itemId = null, itemName = null) {
        this.trackEvent('contact', {
            method: method,
            item_id: itemId,
            item_name: itemName,
            event_category: 'conversion'
        });
    }

    // ========================================
    // EVENTOS DE CHATBOT
    // ========================================

    /**
     * Chatbot abierto
     */
    trackChatbotOpen() {
        this.trackEvent('chatbot_open', {
            event_category: 'engagement',
            event_label: 'chatbot'
        });
    }

    /**
     * Mensaje enviado al chatbot
     */
    trackChatbotMessage(messageCategory) {
        this.trackEvent('chatbot_message', {
            message_category: messageCategory,
            event_category: 'engagement',
            event_label: 'chatbot'
        });
    }

    // ========================================
    // EVENTOS DE PROVEEDOR
    // ========================================

    /**
     * Registro de proveedor iniciado
     */
    trackProviderRegistrationStart(providerType) {
        this.trackEvent('provider_registration_start', {
            provider_type: providerType,
            event_category: 'providers'
        });
    }

    /**
     * Registro de proveedor completado
     */
    trackProviderRegistrationComplete(providerType, category) {
        this.trackEvent('provider_registration_complete', {
            provider_type: providerType,
            provider_category: category,
            event_category: 'providers'
        });
    }

    // ========================================
    // EVENTOS DE NAVEGACIÓN
    // ========================================

    /**
     * Vista de página
     */
    trackPageView(pagePath, pageTitle) {
        this.trackEvent('page_view', {
            page_path: pagePath,
            page_title: pageTitle,
            event_category: 'navigation'
        });
    }

    /**
     * Click en CTA
     */
    trackCTAClick(ctaName, ctaLocation) {
        this.trackEvent('cta_click', {
            cta_name: ctaName,
            cta_location: ctaLocation,
            event_category: 'engagement'
        });
    }

    /**
     * Scroll profundo (más del 75%)
     */
    trackDeepScroll(pageSection) {
        this.trackEvent('scroll_depth', {
            section: pageSection,
            depth: '75%',
            event_category: 'engagement'
        });
    }

    // ========================================
    // MÉTRICAS LOCALES
    // ========================================

    /**
     * Obtener resumen de eventos locales
     */
    getLocalEventsSummary() {
        const events = JSON.parse(localStorage.getItem('eventify_analytics_events') || '[]');

        const summary = {
            totalEvents: events.length,
            byType: {},
            last24Hours: 0,
            lastWeek: 0
        };

        const now = new Date();
        const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        events.forEach(e => {
            // Contar por tipo
            summary.byType[e.event] = (summary.byType[e.event] || 0) + 1;

            // Contar por tiempo
            const eventDate = new Date(e.timestamp);
            if (eventDate > oneDayAgo) summary.last24Hours++;
            if (eventDate > oneWeekAgo) summary.lastWeek++;
        });

        return summary;
    }

    /**
     * Exportar eventos para análisis
     */
    exportEvents() {
        const events = JSON.parse(localStorage.getItem('eventify_analytics_events') || '[]');
        const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `eventify_analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();

        URL.revokeObjectURL(url);
    }
}

// Instancia global
const analytics = new AnalyticsService();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    analytics.init();
});

// Exportar para uso global
window.analytics = analytics;

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 75 && maxScroll < 75) {
        analytics.trackDeepScroll(document.title);
    }
    maxScroll = Math.max(maxScroll, scrollPercent);
});
