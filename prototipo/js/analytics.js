/**
 * ========================================
 * CELÉBRALO PE ANALYTICS - Sistema de Tracking
 * ========================================
 *
 * Este archivo contiene toda la configuración de Google Analytics 4
 * y eventos personalizados para medir el rendimiento del prototipo.
 *
 * INSTRUCCIONES:
 * 1. Reemplaza 'G-XXXXXXXXXX' con tu ID de Google Analytics 4
 * 2. Reemplaza 'GTM-XXXXXXX' con tu ID de Google Tag Manager (opcional)
 */

// ============================================
// CONFIGURACIÓN - REEMPLAZA ESTOS VALORES
// ============================================
const ANALYTICS_CONFIG = {
    GA4_MEASUREMENT_ID: 'G-10FSFRFMGT',  // ID de GA4 configurado
    GTM_ID: 'GTM-XXXXXXX',               // <-- Reemplaza con tu ID de GTM (opcional)
    DEBUG_MODE: false,                    // Cambiar a true para ver logs en consola
    TRACK_SCROLL_DEPTH: true,
    TRACK_TIME_ON_PAGE: true,
    TRACK_OUTBOUND_LINKS: true
};

// ============================================
// INICIALIZACIÓN DE GOOGLE ANALYTICS 4
// ============================================
function initGA4() {
    if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️ Analytics: Configura tu GA4_MEASUREMENT_ID en js/analytics.js');
        return;
    }

    // Cargar script de GA4
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Configurar dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID, {
        'page_title': document.title,
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'send_page_view': true,
        // Configuración mejorada
        'cookie_flags': 'SameSite=None;Secure',
        'custom_map': {
            'dimension1': 'user_type',
            'dimension2': 'event_type',
            'dimension3': 'device_type'
        }
    });

    logDebug('✅ GA4 inicializado correctamente');

    // Configurar propiedades de usuario para segmentación automática
    setupUserProperties();
}

// ============================================
// PROPIEDADES DE USUARIO PARA AUDIENCIAS
// ============================================
function setupUserProperties() {
    // Detectar tipo de dispositivo
    const deviceType = getDeviceType();

    // Detectar si es visitante recurrente
    let visitCount = parseInt(localStorage.getItem('celebralope_visit_count') || '0');
    visitCount++;
    localStorage.setItem('celebralope_visit_count', visitCount.toString());
    const isReturning = visitCount > 1;

    // Detectar fuente de tráfico
    const referrer = document.referrer;
    let trafficSource = 'direct';
    if (referrer.includes('google')) trafficSource = 'google';
    else if (referrer.includes('facebook')) trafficSource = 'facebook';
    else if (referrer.includes('instagram')) trafficSource = 'instagram';
    else if (referrer.includes('tiktok')) trafficSource = 'tiktok';
    else if (referrer) trafficSource = 'referral';

    // Establecer propiedades de usuario en GA4
    if (window.gtag) {
        gtag('set', 'user_properties', {
            user_device_type: deviceType,
            user_is_returning: isReturning ? 'yes' : 'no',
            user_visit_count: visitCount,
            user_traffic_source: trafficSource,
            user_engagement_level: 'new',
            user_interest: 'unknown'
        });
    }

    // Actualizar engagement level después de interacciones
    setTimeout(() => {
        updateUserEngagement();
    }, 30000); // Después de 30 segundos

    logDebug('✅ Propiedades de usuario configuradas', {
        deviceType,
        isReturning,
        visitCount,
        trafficSource
    });
}

// Actualizar nivel de engagement del usuario
function updateUserEngagement() {
    const scrolled = window.scrollY > (document.documentElement.scrollHeight * 0.3);
    const timeSpent = (Date.now() - window.pageLoadTime) / 1000;

    let engagementLevel = 'low';
    if (timeSpent > 120 && scrolled) engagementLevel = 'high';
    else if (timeSpent > 60 || scrolled) engagementLevel = 'medium';

    if (window.gtag) {
        gtag('set', 'user_properties', {
            user_engagement_level: engagementLevel
        });
    }
}

// Actualizar interés del usuario basado en acciones
function updateUserInterest(interest) {
    // Guardar intereses en localStorage
    let interests = JSON.parse(localStorage.getItem('celebralope_interests') || '[]');
    if (!interests.includes(interest)) {
        interests.push(interest);
        localStorage.setItem('celebralope_interests', JSON.stringify(interests));
    }

    if (window.gtag) {
        gtag('set', 'user_properties', {
            user_interest: interests.join(','),
            user_primary_interest: interests[0] || 'unknown'
        });
    }
}

// ============================================
// INICIALIZACIÓN DE GOOGLE TAG MANAGER
// ============================================
function initGTM() {
    if (ANALYTICS_CONFIG.GTM_ID === 'GTM-XXXXXXX') {
        logDebug('ℹ️ GTM no configurado (opcional)');
        return;
    }

    // Script de GTM
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', ANALYTICS_CONFIG.GTM_ID);

    logDebug('✅ GTM inicializado correctamente');
}

// ============================================
// FUNCIÓN PRINCIPAL DE TRACKING
// ============================================
function trackEvent(eventName, eventParams = {}) {
    // Agregar parámetros comunes
    const params = {
        ...eventParams,
        page_title: document.title,
        page_path: window.location.pathname,
        timestamp: new Date().toISOString(),
        device_type: getDeviceType(),
        session_id: getSessionId()
    };

    // Enviar a GA4
    if (window.gtag) {
        gtag('event', eventName, params);
    }

    // Enviar a dataLayer para GTM
    if (window.dataLayer) {
        dataLayer.push({
            event: eventName,
            ...params
        });
    }

    logDebug(`📊 Evento: ${eventName}`, params);
}

// ============================================
// EVENTOS DE NAVEGACIÓN
// ============================================
function trackNavigation() {
    // Clicks en menú de navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            trackEvent('navigation_click', {
                event_category: 'Navigation',
                link_text: this.textContent.trim(),
                link_url: this.href,
                menu_location: 'header'
            });
        });
    });

    // Clicks en logo
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', function() {
            trackEvent('logo_click', {
                event_category: 'Navigation',
                action: 'home_return'
            });
        });
    });

    // Clicks en footer links
    document.querySelectorAll('.footer a').forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('footer_link_click', {
                event_category: 'Navigation',
                link_text: this.textContent.trim(),
                link_url: this.href,
                menu_location: 'footer'
            });
        });
    });

    logDebug('✅ Tracking de navegación configurado');
}

// ============================================
// EVENTOS DE BÚSQUEDA
// ============================================
function trackSearch() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const eventType = document.getElementById('eventType')?.value || '';
            const eventDate = document.getElementById('eventDate')?.value || '';
            const guestCount = document.getElementById('guestCount')?.value || '';

            trackEvent('search', {
                event_category: 'Search',
                search_term: eventType,
                event_type: eventType,
                event_date: eventDate,
                guest_count: guestCount
            });
            // Actualizar interés del usuario
            if (eventType) updateUserInterest('busca_' + eventType);
        });
    }

    // Tabs de búsqueda
    document.querySelectorAll('.search-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            trackEvent('search_tab_click', {
                event_category: 'Search',
                tab_name: this.dataset.tab || this.textContent.trim()
            });
        });
    });

    logDebug('✅ Tracking de búsqueda configurado');
}

// ============================================
// EVENTOS DE CATEGORÍAS
// ============================================
function trackCategories() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3')?.textContent || 'Unknown';
            trackEvent('category_click', {
                event_category: 'Categories',
                category_name: categoryName,
                category_url: this.href
            });
            // Actualizar interés del usuario
            updateUserInterest('categoria_' + categoryName.toLowerCase().replace(/\s+/g, '_'));
        });
    });

    logDebug('✅ Tracking de categorías configurado');
}

// ============================================
// EVENTOS DE LOCALES Y SERVICIOS
// ============================================
function trackLocalesAndServices() {
    // Observer para cards que se cargan dinámicamente
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) {
                    // Locale cards
                    node.querySelectorAll?.('.locale-card, .local-card')?.forEach(card => {
                        attachLocaleTracking(card);
                    });
                    // Service cards
                    node.querySelectorAll?.('.service-card')?.forEach(card => {
                        attachServiceTracking(card);
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Cards ya existentes
    document.querySelectorAll('.locale-card, .local-card').forEach(attachLocaleTracking);
    document.querySelectorAll('.service-card').forEach(attachServiceTracking);

    logDebug('✅ Tracking de locales y servicios configurado');
}

function attachLocaleTracking(card) {
    if (card.dataset.tracked) return;
    card.dataset.tracked = 'true';

    card.addEventListener('click', function() {
        trackEvent('locale_click', {
            event_category: 'Locales',
            locale_name: card.querySelector('.card-title, h3')?.textContent || 'Unknown',
            locale_id: card.dataset.id || 'unknown'
        });
    });
}

function attachServiceTracking(card) {
    if (card.dataset.tracked) return;
    card.dataset.tracked = 'true';

    card.addEventListener('click', function() {
        trackEvent('service_click', {
            event_category: 'Services',
            service_name: card.querySelector('.card-title, h3')?.textContent || 'Unknown',
            service_type: card.dataset.type || 'unknown'
        });
    });
}

// ============================================
// EVENTOS DE PAQUETES
// ============================================
function trackPackages() {
    document.querySelectorAll('.package-card').forEach(card => {
        const packageName = card.querySelector('h3')?.textContent || 'Unknown';
        const packagePrice = card.querySelector('.price-amount')?.textContent || '';

        // Click en el paquete
        card.addEventListener('click', function(e) {
            if (!e.target.closest('a, button')) {
                trackEvent('package_view', {
                    event_category: 'Packages',
                    package_name: packageName,
                    package_price: packagePrice
                });
            }
        });

        // Click en botón del paquete
        card.querySelectorAll('a, button').forEach(btn => {
            btn.addEventListener('click', function() {
                trackEvent('package_cta_click', {
                    event_category: 'Packages',
                    package_name: packageName,
                    package_price: packagePrice,
                    button_text: this.textContent.trim()
                });
            });
        });
    });

    logDebug('✅ Tracking de paquetes configurado');
}

// ============================================
// EVENTOS DE CHATBOT
// ============================================
function trackChatbot() {
    // Abrir chatbot
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    if (chatbotTrigger) {
        chatbotTrigger.addEventListener('click', function() {
            trackEvent('chatbot_open', {
                event_category: 'Chatbot',
                action: 'open'
            });
        });
    }

    // Cerrar chatbot
    const chatbotClose = document.getElementById('chatbotClose');
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            trackEvent('chatbot_close', {
                event_category: 'Chatbot',
                action: 'close'
            });
        });
    }

    // Enviar mensaje
    const chatbotForm = document.getElementById('chatbotForm');
    if (chatbotForm) {
        chatbotForm.addEventListener('submit', function() {
            const message = document.getElementById('chatInput')?.value || '';
            trackEvent('chatbot_message', {
                event_category: 'Chatbot',
                action: 'send_message',
                message_length: message.length
            });
        });
    }

    // Quick actions
    document.querySelectorAll('.quick-action').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('chatbot_quick_action', {
                event_category: 'Chatbot',
                action: this.dataset.action || this.textContent.trim()
            });
        });
    });

    logDebug('✅ Tracking de chatbot configurado');
}

// ============================================
// EVENTOS DE AUTENTICACIÓN
// ============================================
function trackAuth() {
    // Abrir modal de login
    document.querySelectorAll('[onclick*="openAuthModal"]').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('auth_modal_open', {
                event_category: 'Authentication',
                auth_type: 'login'
            });
        });
    });

    // Formulario de login
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', function() {
            trackEvent('login_attempt', {
                event_category: 'Authentication',
                method: 'email'
            });
        });
    }

    // Formulario de registro
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', function() {
            trackEvent('signup_attempt', {
                event_category: 'Authentication',
                method: 'email'
            });
        });
    }

    // Login social
    document.querySelectorAll('.btn-google').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('social_login_click', {
                event_category: 'Authentication',
                method: 'google'
            });
        });
    });

    document.querySelectorAll('.btn-facebook').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('social_login_click', {
                event_category: 'Authentication',
                method: 'facebook'
            });
        });
    });

    logDebug('✅ Tracking de autenticación configurado');
}

// ============================================
// EVENTOS DE CTA (CALL TO ACTION)
// ============================================
function trackCTAs() {
    // CTAs principales
    const ctaSelectors = [
        '.btn-primary',
        '.cta-section .btn',
        '[href*="registro-proveedor"]',
        '.search-btn'
    ];

    ctaSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(btn => {
            if (btn.dataset.ctaTracked) return;
            btn.dataset.ctaTracked = 'true';

            btn.addEventListener('click', function() {
                trackEvent('cta_click', {
                    event_category: 'CTA',
                    button_text: this.textContent.trim(),
                    button_url: this.href || 'no_url',
                    button_location: getElementLocation(this)
                });
            });
        });
    });

    logDebug('✅ Tracking de CTAs configurado');
}

// ============================================
// EVENTOS DE CONVERSIÓN PERSONALIZADOS
// ============================================
function trackConversions() {

    // CONVERSIÓN 1: Interés en reserva (clic en paquetes o cotizar)
    document.querySelectorAll('.package-card a, .package-card button, [href*="cotizador"], [href*="paquetes"]').forEach(btn => {
        if (btn.dataset.conversionTracked) return;
        btn.dataset.conversionTracked = 'true';

        btn.addEventListener('click', function() {
            trackEvent('interes_reserva', {
                event_category: 'Conversion',
                conversion_type: 'reservation_interest',
                element_text: this.textContent.trim(),
                page_location: window.location.pathname
            });
            // Marcar usuario como interesado en reservar
            updateUserInterest('quiere_reservar');
        });
    });

    // CONVERSIÓN 2: Contacto via chatbot
    const chatbotForm = document.getElementById('chatbotForm');
    if (chatbotForm && !chatbotForm.dataset.conversionTracked) {
        chatbotForm.dataset.conversionTracked = 'true';
        chatbotForm.addEventListener('submit', function() {
            trackEvent('contacto_chatbot', {
                event_category: 'Conversion',
                conversion_type: 'chatbot_contact',
                page_location: window.location.pathname
            });
        });
    }

    // CONVERSIÓN 3: Proveedor interesado (registro de local/servicio)
    document.querySelectorAll('[href*="registro-proveedor"], .cta-section .btn').forEach(btn => {
        if (btn.dataset.providerTracked) return;
        btn.dataset.providerTracked = 'true';

        btn.addEventListener('click', function() {
            const text = this.textContent.toLowerCase();
            if (text.includes('registrar') || text.includes('local') || text.includes('servicio') || text.includes('publica')) {
                trackEvent('interes_proveedor', {
                    event_category: 'Conversion',
                    conversion_type: 'provider_interest',
                    button_text: this.textContent.trim(),
                    page_location: window.location.pathname
                });
                // Marcar usuario como proveedor potencial
                updateUserInterest('es_proveedor');
            }
        });
    });

    // CONVERSIÓN 4: Usuario ve detalles de local (alto interés)
    document.querySelectorAll('.locale-card a, .local-card a, [href*="local.html"]').forEach(link => {
        if (link.dataset.viewTracked) return;
        link.dataset.viewTracked = 'true';

        link.addEventListener('click', function() {
            trackEvent('ver_local_detalle', {
                event_category: 'Conversion',
                conversion_type: 'local_detail_view',
                local_name: this.closest('.locale-card, .local-card')?.querySelector('h3, .card-title')?.textContent || 'unknown'
            });
        });
    });

    // CONVERSIÓN 5: Inicio de cotización
    const cotizadorForm = document.querySelector('[class*="cotizador"], #cotizadorForm, .quote-form');
    if (cotizadorForm && !cotizadorForm.dataset.quoteTracked) {
        cotizadorForm.dataset.quoteTracked = 'true';

        // Track cuando el usuario interactúa con el cotizador
        cotizadorForm.querySelectorAll('select, input').forEach(field => {
            field.addEventListener('change', function() {
                trackEvent('cotizacion_iniciada', {
                    event_category: 'Conversion',
                    conversion_type: 'quote_started',
                    field_name: this.name || this.id,
                    field_value: this.value
                });
            }, { once: true }); // Solo la primera vez
        });
    }

    // CONVERSIÓN 6: Registro completado (formulario de registro)
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm && !registerForm.dataset.registerConvTracked) {
        registerForm.dataset.registerConvTracked = 'true';
        registerForm.addEventListener('submit', function() {
            trackEvent('registro_usuario', {
                event_category: 'Conversion',
                conversion_type: 'user_registration',
                method: 'email'
            });
        });
    }

    // CONVERSIÓN 7: Login completado
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm && !loginForm.dataset.loginConvTracked) {
        loginForm.dataset.loginConvTracked = 'true';
        loginForm.addEventListener('submit', function() {
            trackEvent('login_usuario', {
                event_category: 'Conversion',
                conversion_type: 'user_login',
                method: 'email'
            });
        });
    }

    // CONVERSIÓN 8: Formulario de proveedor enviado
    const providerForm = document.querySelector('#providerForm, [class*="provider-form"], .registration-form form');
    if (providerForm && !providerForm.dataset.providerFormTracked) {
        providerForm.dataset.providerFormTracked = 'true';
        providerForm.addEventListener('submit', function() {
            trackEvent('registro_proveedor', {
                event_category: 'Conversion',
                conversion_type: 'provider_registration',
                form_type: document.querySelector('[name="formType"]:checked')?.value || 'unknown'
            });
        });
    }

    // CONVERSIÓN 9: Búsqueda con intención (formulario de búsqueda completo)
    const searchForm = document.getElementById('searchForm');
    if (searchForm && !searchForm.dataset.searchConvTracked) {
        searchForm.dataset.searchConvTracked = 'true';
        searchForm.addEventListener('submit', function() {
            const eventType = document.getElementById('eventType')?.value;
            const eventDate = document.getElementById('eventDate')?.value;
            const guestCount = document.getElementById('guestCount')?.value;

            // Solo si completó todos los campos
            if (eventType && eventDate && guestCount) {
                trackEvent('busqueda_con_intencion', {
                    event_category: 'Conversion',
                    conversion_type: 'intentful_search',
                    event_type: eventType,
                    guest_count: guestCount,
                    has_date: 'yes'
                });
            }
        });
    }

    // CONVERSIÓN 10: Engagement alto (scroll + tiempo)
    let highEngagementSent = false;
    function checkHighEngagement() {
        if (highEngagementSent) return;

        const timeOnPage = (Date.now() - window.pageLoadTime) / 1000;
        const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

        // Si el usuario pasó más de 60 segundos Y scrolleó más del 50%
        if (timeOnPage > 60 && scrollPercent > 50) {
            highEngagementSent = true;
            trackEvent('usuario_comprometido', {
                event_category: 'Conversion',
                conversion_type: 'high_engagement',
                time_on_page: Math.round(timeOnPage),
                scroll_depth: scrollPercent
            });
        }
    }

    window.pageLoadTime = Date.now();
    setInterval(checkHighEngagement, 10000); // Verificar cada 10 segundos

    logDebug('✅ Tracking de conversiones configurado');
}

// ============================================
// SCROLL DEPTH TRACKING
// ============================================
function trackScrollDepth() {
    if (!ANALYTICS_CONFIG.TRACK_SCROLL_DEPTH) return;

    const milestones = [25, 50, 75, 90, 100];
    const reached = new Set();

    function getScrollPercent() {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((window.scrollY / docHeight) * 100);
    }

    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const percent = getScrollPercent();
                milestones.forEach(milestone => {
                    if (percent >= milestone && !reached.has(milestone)) {
                        reached.add(milestone);
                        trackEvent('scroll_depth', {
                            event_category: 'Engagement',
                            scroll_percentage: milestone
                        });
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    logDebug('✅ Tracking de scroll depth configurado');
}

// ============================================
// TIME ON PAGE TRACKING
// ============================================
function trackTimeOnPage() {
    if (!ANALYTICS_CONFIG.TRACK_TIME_ON_PAGE) return;

    const startTime = Date.now();
    const timeThresholds = [30, 60, 120, 300]; // segundos
    const reached = new Set();

    setInterval(function() {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        timeThresholds.forEach(threshold => {
            if (timeSpent >= threshold && !reached.has(threshold)) {
                reached.add(threshold);
                trackEvent('time_on_page', {
                    event_category: 'Engagement',
                    time_seconds: threshold,
                    time_label: formatTime(threshold)
                });
            }
        });
    }, 5000);

    // Tiempo total al salir
    window.addEventListener('beforeunload', function() {
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        trackEvent('page_exit', {
            event_category: 'Engagement',
            time_on_page_seconds: totalTime
        });
    });

    logDebug('✅ Tracking de tiempo en página configurado');
}

// ============================================
// OUTBOUND LINKS TRACKING
// ============================================
function trackOutboundLinks() {
    if (!ANALYTICS_CONFIG.TRACK_OUTBOUND_LINKS) return;

    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.addEventListener('click', function() {
                trackEvent('outbound_link', {
                    event_category: 'Outbound',
                    link_url: this.href,
                    link_text: this.textContent.trim()
                });
            });
        }
    });

    logDebug('✅ Tracking de links externos configurado');
}

// ============================================
// FORM INTERACTIONS TRACKING
// ============================================
function trackFormInteractions() {
    // Tracking de campos de formulario
    document.querySelectorAll('input, select, textarea').forEach(field => {
        // Focus en campo
        field.addEventListener('focus', function() {
            trackEvent('form_field_focus', {
                event_category: 'Forms',
                field_name: this.name || this.id || 'unknown',
                field_type: this.type || this.tagName.toLowerCase()
            });
        });

        // Cambio de valor en selects
        if (field.tagName === 'SELECT') {
            field.addEventListener('change', function() {
                trackEvent('form_field_change', {
                    event_category: 'Forms',
                    field_name: this.name || this.id || 'unknown',
                    selected_value: this.value
                });
            });
        }
    });

    logDebug('✅ Tracking de formularios configurado');
}

// ============================================
// TESTIMONIALS TRACKING
// ============================================
function trackTestimonials() {
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            trackEvent('testimonial_navigate', {
                event_category: 'Engagement',
                direction: 'previous'
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            trackEvent('testimonial_navigate', {
                event_category: 'Engagement',
                direction: 'next'
            });
        });
    }

    logDebug('✅ Tracking de testimonios configurado');
}

// ============================================
// SOCIAL MEDIA TRACKING
// ============================================
function trackSocialMedia() {
    document.querySelectorAll('.footer-social a').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('i')?.className || '';
            let socialNetwork = 'unknown';

            if (platform.includes('facebook')) socialNetwork = 'facebook';
            else if (platform.includes('instagram')) socialNetwork = 'instagram';
            else if (platform.includes('tiktok')) socialNetwork = 'tiktok';
            else if (platform.includes('whatsapp')) socialNetwork = 'whatsapp';

            trackEvent('social_click', {
                event_category: 'Social',
                social_network: socialNetwork,
                link_location: 'footer'
            });
        });
    });

    logDebug('✅ Tracking de redes sociales configurado');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('celebralope_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('celebralope_session_id', sessionId);
    }
    return sessionId;
}

function getElementLocation(element) {
    const sections = ['hero', 'categories', 'locales', 'how-it-works', 'services', 'packages', 'testimonials', 'cta', 'footer'];
    for (const section of sections) {
        if (element.closest(`.${section}-section, .${section}, #${section}`)) {
            return section;
        }
    }
    return 'unknown';
}

function formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
}

function logDebug(message, data = null) {
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        if (data) {
            console.log(message, data);
        } else {
            console.log(message);
        }
    }
}

// ============================================
// DASHBOARD DE EVENTOS (Para Debug)
// ============================================
function showAnalyticsDashboard() {
    const events = JSON.parse(localStorage.getItem('celebralope_events') || '[]');
    console.table(events.slice(-20));
}

// Guardar eventos localmente para debug
const originalTrackEvent = trackEvent;
window.trackEvent = function(eventName, eventParams = {}) {
    if (ANALYTICS_CONFIG.DEBUG_MODE) {
        const events = JSON.parse(localStorage.getItem('celebralope_events') || '[]');
        events.push({ event: eventName, params: eventParams, time: new Date().toISOString() });
        localStorage.setItem('celebralope_events', JSON.stringify(events.slice(-100)));
    }
    originalTrackEvent(eventName, eventParams);
};

// ============================================
// INICIALIZACIÓN
// ============================================
function initAnalytics() {
    // Inicializar GA4 y GTM
    initGA4();
    initGTM();

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupTracking);
    } else {
        setupTracking();
    }
}

function setupTracking() {
    trackNavigation();
    trackSearch();
    trackCategories();
    trackLocalesAndServices();
    trackPackages();
    trackChatbot();
    trackAuth();
    trackCTAs();
    trackConversions();  // Eventos de conversión personalizados
    trackScrollDepth();
    trackTimeOnPage();
    trackOutboundLinks();
    trackFormInteractions();
    trackTestimonials();
    trackSocialMedia();

    // Evento de página vista inicial
    trackEvent('page_view', {
        event_category: 'Page',
        page_type: getPageType()
    });

    console.log('🎉 Celébralo pe Analytics inicializado correctamente');
    if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.log('⚠️ Recuerda configurar tu GA4_MEASUREMENT_ID en js/analytics.js');
    }
}

function getPageType() {
    const path = window.location.pathname;
    if (path.includes('index') || path.endsWith('/')) return 'home';
    if (path.includes('locales')) return 'locales';
    if (path.includes('local.html')) return 'local_detail';
    if (path.includes('servicios')) return 'services';
    if (path.includes('paquetes')) return 'packages';
    if (path.includes('cotizador')) return 'quoter';
    if (path.includes('registro-proveedor')) return 'provider_registration';
    if (path.includes('como-funciona')) return 'how_it_works';
    return 'other';
}

// Auto-inicializar
initAnalytics();

// Exponer funciones para uso manual
window.Celébralo peAnalytics = {
    trackEvent,
    showAnalyticsDashboard,
    config: ANALYTICS_CONFIG
};
