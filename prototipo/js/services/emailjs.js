/**
 * EmailJS Service - Celébralo pe
 * Servicio centralizado para envio de emails
 *
 * Configuracion:
 * 1. Crear cuenta en https://www.emailjs.com
 * 2. Conectar servicio de Gmail
 * 3. Crear plantillas para cada tipo de email
 * 4. Actualizar las credenciales abajo
 */

// ============================================
// CREDENCIALES DE EMAILJS
// Actualiza estos valores con los de tu cuenta
// ============================================
const EMAILJS_CONFIG = {
    publicKey: '0dYuscUBKL8b-TRsX',
    serviceId: 'service_ealwt3e',
    templates: {
        // Plantilla para bienvenida a lista de espera
        waitlist: 'template_x0x0gnu',
        // Plantilla para registro de proveedores (crear en EmailJS)
        proveedor: 'template_proveedor',
        // Plantilla para contacto general
        contacto: 'template_contacto'
    }
};

// ============================================
// INICIALIZACION
// ============================================
let emailjsInitialized = false;

function initEmailJS() {
    if (emailjsInitialized) return Promise.resolve();

    return new Promise((resolve, reject) => {
        // Verificar si el SDK ya esta cargado
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            emailjsInitialized = true;
            console.log('EmailJS inicializado correctamente');
            resolve();
            return;
        }

        // Cargar SDK dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.onload = () => {
            emailjs.init(EMAILJS_CONFIG.publicKey);
            emailjsInitialized = true;
            console.log('EmailJS SDK cargado e inicializado');
            resolve();
        };
        script.onerror = () => {
            console.error('Error al cargar EmailJS SDK');
            reject(new Error('No se pudo cargar EmailJS'));
        };
        document.head.appendChild(script);
    });
}

// ============================================
// FUNCIONES DE ENVIO
// ============================================

/**
 * Envia email de bienvenida a usuarios de lista de espera
 * @param {Object} data - Datos del usuario
 * @param {string} data.name - Nombre del usuario
 * @param {string} data.email - Email del usuario
 * @param {string} data.userType - Tipo de usuario (organizador, proveedor, etc)
 */
async function sendWaitlistEmail(data) {
    await initEmailJS();

    const templateParams = {
        to_name: data.name,
        to_email: data.email,
        user_type: data.userType || 'Usuario'
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templates.waitlist,
            templateParams
        );
        console.log('Email de bienvenida enviado:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error al enviar email de bienvenida:', error);
        return { success: false, error };
    }
}

/**
 * Envia email de confirmacion a proveedores registrados
 * @param {Object} data - Datos del proveedor
 * @param {string} data.ownerName - Nombre del propietario
 * @param {string} data.ownerEmail - Email del propietario
 * @param {string} data.businessName - Nombre del negocio
 * @param {string} data.businessType - Tipo (local o servicio)
 * @param {string} data.category - Categoria del negocio
 */
async function sendProveedorEmail(data) {
    await initEmailJS();

    const templateParams = {
        to_name: data.ownerName,
        to_email: data.ownerEmail,
        business_name: data.businessName,
        business_type: data.businessType === 'local' ? 'Local para Eventos' : 'Servicio',
        category: data.category
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templates.proveedor,
            templateParams
        );
        console.log('Email a proveedor enviado:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error al enviar email a proveedor:', error);
        // Si falla con plantilla de proveedor, intentar con waitlist
        try {
            const fallbackResponse = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templates.waitlist,
                {
                    to_name: data.ownerName,
                    to_email: data.ownerEmail,
                    user_type: `Proveedor - ${data.businessName}`
                }
            );
            console.log('Email enviado con plantilla alternativa:', fallbackResponse);
            return { success: true, response: fallbackResponse, fallback: true };
        } catch (fallbackError) {
            return { success: false, error: fallbackError };
        }
    }
}

/**
 * Envia email de contacto general
 * @param {Object} data - Datos del mensaje
 * @param {string} data.name - Nombre del remitente
 * @param {string} data.email - Email del remitente
 * @param {string} data.message - Mensaje
 */
async function sendContactEmail(data) {
    await initEmailJS();

    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        message: data.message
    };

    try {
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templates.contacto,
            templateParams
        );
        console.log('Email de contacto enviado:', response);
        return { success: true, response };
    } catch (error) {
        console.error('Error al enviar email de contacto:', error);
        return { success: false, error };
    }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
window.EmailJSService = {
    init: initEmailJS,
    config: EMAILJS_CONFIG,
    sendWaitlistEmail,
    sendProveedorEmail,
    sendContactEmail
};

// Auto-inicializar cuando el DOM este listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmailJS);
} else {
    initEmailJS();
}
