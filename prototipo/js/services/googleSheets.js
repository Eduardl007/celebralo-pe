/* ========================================
   CELÉBRALO PE - Google Sheets Integration
   Base de datos en Google Sheets (SEGURO)

   IMPORTANTE: Las credenciales NO están en el código.
   Se usan a través de Vercel/Netlify Functions para seguridad.
   ======================================== */

/**
 * CONFIGURACIÓN DE GOOGLE SHEETS
 *
 * Las credenciales sensibles están en variables de entorno del servidor.
 * Este archivo solo contiene configuración pública.
 */
const GOOGLE_SHEETS_CONFIG = {
    // Endpoint del proxy seguro (Netlify Function)
    proxyUrl: '/api/sheets-proxy',

    // Nombres de las hojas (pestañas) - públicos
    sheets: {
        usuarios: 'Usuarios',
        reservas: 'Reservas',
        consultas: 'Consultas',
        proveedores: 'Proveedores',
        cotizaciones: 'Cotizaciones',
        leads: 'Leads',
        feedback: 'Feedback',
        logins: 'Logins',
        busquedas: 'Busquedas',
        mensajesProveedores: 'MensajesProveedores'
    },

    // Configuración de reintentos
    retry: {
        maxAttempts: 3,
        baseDelay: 1000, // ms
        maxDelay: 10000  // ms
    },

    // Límites de almacenamiento local
    storage: {
        maxItemsPerSheet: 200,
        maxTotalItems: 1000
    }
};

/**
 * Detectar si estamos en producción (Vercel/Netlify) o desarrollo local
 */
function isProduction() {
    const hostname = window.location.hostname;
    return hostname.includes('vercel.app') ||
           hostname.includes('netlify.app') ||
           hostname.includes('celebralo.pe') ||
           hostname.includes('celebralo-pe') ||
           hostname.includes('celebralope');
}

/**
 * Servicio de Google Sheets (Seguro)
 */
class GoogleSheetsService {
    constructor() {
        this.proxyUrl = GOOGLE_SHEETS_CONFIG.proxyUrl;
        this.isProduction = isProduction();
        this.pendingSyncQueue = [];
        this.isSyncing = false;

        // Inicializar listeners
        this.initNetworkListeners();
    }

    /**
     * Inicializar listeners de red
     */
    initNetworkListeners() {
        // Sincronizar cuando vuelva la conexión
        window.addEventListener('online', () => {
            console.log('🌐 Conexión restaurada, sincronizando datos pendientes...');
            this.syncPendingData();
        });

        // Sincronizar al cargar la página si hay conexión
        if (navigator.onLine) {
            setTimeout(() => this.syncPendingData(), 3000);
        }
    }

    /**
     * Verificar si el servicio está listo
     */
    isReady() {
        return navigator.onLine && this.isProduction;
    }

    /**
     * Enviar datos a Google Sheets de forma segura
     * @param {string} sheetName - Nombre de la hoja
     * @param {object} data - Datos a enviar
     * @returns {Promise<object>}
     */
    async sendData(sheetName, data) {
        // Validar nombre de hoja
        const validSheets = Object.values(GOOGLE_SHEETS_CONFIG.sheets);
        if (!validSheets.includes(sheetName)) {
            console.warn(`Hoja no válida: ${sheetName}`);
            return { success: false, error: 'Hoja no válida' };
        }

        // Validar datos
        if (!data || typeof data !== 'object') {
            console.warn('Datos inválidos para enviar');
            return { success: false, error: 'Datos inválidos' };
        }

        // Agregar metadata básica (sin info sensible)
        const payload = {
            action: 'insert',
            sheet: sheetName,
            data: {
                ...this.sanitizeClientData(data),
                timestamp: new Date().toISOString(),
                source: 'web_app'
            }
        };

        // En desarrollo local, solo guardar localmente
        if (!this.isProduction) {
            console.log(`📊 [DEV] ${sheetName}:`, payload.data);
            return this.saveLocally(sheetName, payload.data);
        }

        // Si no hay conexión, guardar localmente
        if (!navigator.onLine) {
            console.log(`📴 Sin conexión, guardando localmente: ${sheetName}`);
            return this.saveLocally(sheetName, payload.data);
        }

        // Intentar enviar con reintentos
        return await this.sendWithRetry(payload, sheetName);
    }

    /**
     * Enviar con lógica de reintentos
     */
    async sendWithRetry(payload, sheetName, attempt = 1) {
        const { maxAttempts, baseDelay, maxDelay } = GOOGLE_SHEETS_CONFIG.retry;

        try {
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Manejar rate limiting
            if (response.status === 429) {
                if (attempt < maxAttempts) {
                    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
                    console.log(`⏳ Rate limited, reintentando en ${delay}ms...`);
                    await this.sleep(delay);
                    return this.sendWithRetry(payload, sheetName, attempt + 1);
                }
                return this.saveLocally(sheetName, payload.data);
            }

            // Manejar errores del servidor
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                console.log(`✅ Datos enviados a ${sheetName}`);
                return { success: true, message: 'Datos guardados correctamente' };
            }

            // Si el servidor indica modo offline, guardar localmente
            if (result.offline) {
                return this.saveLocally(sheetName, payload.data);
            }

            throw new Error(result.error || 'Error desconocido');

        } catch (error) {
            console.error(`Error enviando a ${sheetName}:`, error.message);

            // Reintentar si no hemos alcanzado el máximo
            if (attempt < maxAttempts && this.isRetryableError(error)) {
                const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
                console.log(`🔄 Reintentando (${attempt}/${maxAttempts}) en ${delay}ms...`);
                await this.sleep(delay);
                return this.sendWithRetry(payload, sheetName, attempt + 1);
            }

            // Fallback: guardar localmente
            return this.saveLocally(sheetName, payload.data);
        }
    }

    /**
     * Verificar si un error es reintentable
     */
    isRetryableError(error) {
        const message = error.message || '';
        return message.includes('fetch') ||
               message.includes('network') ||
               message.includes('timeout') ||
               message.includes('503') ||
               message.includes('502');
    }

    /**
     * Sanitizar datos del cliente antes de enviar
     */
    sanitizeClientData(data) {
        const sanitized = {};

        for (const [key, value] of Object.entries(data)) {
            // Omitir campos sensibles que no deben enviarse
            if (['password', 'token', 'secret'].includes(key.toLowerCase())) {
                continue;
            }

            // Sanitizar strings
            if (typeof value === 'string') {
                sanitized[key] = value
                    .replace(/[<>]/g, '') // Prevenir XSS básico
                    .trim()
                    .substring(0, 2000); // Limitar longitud
            } else if (typeof value === 'number' && isFinite(value)) {
                sanitized[key] = value;
            } else if (typeof value === 'boolean') {
                sanitized[key] = value;
            } else if (Array.isArray(value)) {
                sanitized[key] = value
                    .filter(v => typeof v === 'string' || typeof v === 'number')
                    .slice(0, 20)
                    .join(', ');
            } else if (value !== null && value !== undefined) {
                sanitized[key] = String(value).substring(0, 500);
            }
        }

        return sanitized;
    }

    /**
     * Guardar localmente como fallback (mejorado)
     */
    saveLocally(sheetName, data) {
        const key = `celebralope_offline_${sheetName}`;
        const { maxItemsPerSheet } = GOOGLE_SHEETS_CONFIG.storage;

        try {
            let existing = [];
            try {
                existing = JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                existing = [];
            }

            // Generar ID único para este item
            const itemId = data.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

            // Verificar si ya existe (evitar duplicados)
            const existingIndex = existing.findIndex(item => item.id === itemId);
            if (existingIndex >= 0) {
                existing[existingIndex] = { ...data, id: itemId, pendingSync: true, savedAt: new Date().toISOString() };
            } else {
                // Limitar cantidad de items
                if (existing.length >= maxItemsPerSheet) {
                    // Eliminar los más antiguos que ya fueron sincronizados
                    const synced = existing.filter(item => !item.pendingSync);
                    if (synced.length > 0) {
                        const oldestSynced = synced[0];
                        existing = existing.filter(item => item.id !== oldestSynced.id);
                    } else {
                        // Si todos están pendientes, eliminar el más antiguo
                        existing.shift();
                    }
                    console.warn(`⚠️ Límite de storage alcanzado para ${sheetName}, rotando datos`);
                }

                existing.push({
                    ...data,
                    id: itemId,
                    pendingSync: true,
                    savedAt: new Date().toISOString()
                });
            }

            localStorage.setItem(key, JSON.stringify(existing));
            console.log(`💾 Guardado localmente en ${sheetName} (${existing.length} items)`);

            return {
                success: true,
                message: 'Datos guardados localmente',
                offline: true,
                itemId
            };

        } catch (error) {
            console.error('Error guardando localmente:', error);

            // Si localStorage está lleno, intentar limpiar datos antiguos
            if (error.name === 'QuotaExceededError') {
                this.cleanupOldData();
                // Reintentar una vez
                try {
                    const minimal = { ...data, pendingSync: true, savedAt: new Date().toISOString() };
                    let existing = JSON.parse(localStorage.getItem(key) || '[]');
                    existing.push(minimal);
                    localStorage.setItem(key, JSON.stringify(existing.slice(-50)));
                    return { success: true, message: 'Guardado con cleanup', offline: true };
                } catch (e) {
                    return { success: false, error: 'Storage lleno' };
                }
            }

            return { success: false, error: error.message };
        }
    }

    /**
     * Limpiar datos antiguos de localStorage
     */
    cleanupOldData() {
        const sheets = Object.values(GOOGLE_SHEETS_CONFIG.sheets);
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        for (const sheet of sheets) {
            const key = `celebralope_offline_${sheet}`;
            try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                const filtered = data.filter(item => {
                    // Mantener items pendientes de sync
                    if (item.pendingSync) return true;
                    // Mantener items de la última semana
                    const savedAt = new Date(item.savedAt || item.timestamp || 0);
                    return savedAt > oneWeekAgo;
                });
                localStorage.setItem(key, JSON.stringify(filtered));
            } catch (e) {
                // Si hay error, eliminar toda la data de esta hoja
                localStorage.removeItem(key);
            }
        }

        console.log('🧹 Limpieza de datos antiguos completada');
    }

    /**
     * Sincronizar datos pendientes (mejorado - sin pérdida de datos)
     */
    async syncPendingData() {
        if (!this.isProduction || !navigator.onLine || this.isSyncing) {
            return;
        }

        this.isSyncing = true;
        const sheets = Object.values(GOOGLE_SHEETS_CONFIG.sheets);
        let totalSynced = 0;
        let totalFailed = 0;

        console.log('🔄 Iniciando sincronización de datos pendientes...');

        for (const sheetName of sheets) {
            const key = `celebralope_offline_${sheetName}`;

            try {
                const pending = JSON.parse(localStorage.getItem(key) || '[]');
                const itemsToSync = pending.filter(item => item.pendingSync);

                if (itemsToSync.length === 0) continue;

                console.log(`📤 Sincronizando ${itemsToSync.length} items de ${sheetName}...`);

                const syncedIds = [];
                const failedIds = [];

                for (const item of itemsToSync) {
                    try {
                        // Remover flag antes de enviar
                        const { pendingSync, savedAt, ...dataToSend } = item;

                        const payload = {
                            action: 'insert',
                            sheet: sheetName,
                            data: dataToSend
                        };

                        const response = await fetch(this.proxyUrl, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                            const result = await response.json();
                            if (result.success) {
                                syncedIds.push(item.id);
                                totalSynced++;
                            } else {
                                failedIds.push(item.id);
                                totalFailed++;
                            }
                        } else {
                            failedIds.push(item.id);
                            totalFailed++;
                        }

                        // Pequeña pausa entre requests para no saturar
                        await this.sleep(100);

                    } catch (error) {
                        console.error(`Error sincronizando item ${item.id}:`, error);
                        failedIds.push(item.id);
                        totalFailed++;
                    }
                }

                // Actualizar localStorage: marcar sincronizados, mantener fallidos
                const updatedData = pending.map(item => {
                    if (syncedIds.includes(item.id)) {
                        return { ...item, pendingSync: false, syncedAt: new Date().toISOString() };
                    }
                    return item;
                });

                localStorage.setItem(key, JSON.stringify(updatedData));

            } catch (error) {
                console.error(`Error procesando ${sheetName}:`, error);
            }
        }

        this.isSyncing = false;

        if (totalSynced > 0 || totalFailed > 0) {
            console.log(`✅ Sincronización completada: ${totalSynced} exitosos, ${totalFailed} fallidos`);
        }
    }

    /**
     * Helper para sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ========================================
    // MÉTODOS DE CONVENIENCIA
    // ========================================

    async registerUser(userData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.usuarios, {
            id: `USR-${Date.now()}`,
            nombre: userData.name,
            apellido: userData.lastname || '',
            email: userData.email,
            telefono: userData.phone || '',
            tipoRegistro: userData.registrationType || 'email',
            estado: 'activo',
            fechaRegistro: new Date().toLocaleDateString('es-PE')
        });
    }

    async logLogin(email, method = 'email') {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.logins, {
            id: `LOGIN-${Date.now()}`,
            contacto: email,
            metodo: method,
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE')
        });
    }

    async createReservation(reservationData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.reservas, {
            id: reservationData.id || `RES-${Date.now()}`,
            usuario: reservationData.userName,
            email: reservationData.userEmail,
            telefono: reservationData.userPhone,
            tipoEvento: reservationData.eventType,
            fechaEvento: reservationData.eventDate,
            cantidadInvitados: reservationData.guestCount,
            local: reservationData.localName,
            localId: reservationData.localId,
            serviciosAdicionales: reservationData.additionalServices?.join(', ') || '',
            precioTotal: reservationData.totalPrice,
            estado: 'pendiente',
            fechaReserva: new Date().toLocaleDateString('es-PE')
        });
    }

    async logChatbotQuery(query, response, category) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.consultas, {
            id: `CHT-${Date.now()}`,
            consulta: query,
            respuesta: response,
            categoria: category,
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE')
        });
    }

    async registerProvider(providerData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.proveedores, {
            id: `PRV-${Date.now()}`,
            nombreNegocio: providerData.businessName,
            nombreContacto: providerData.contactName,
            email: providerData.email,
            telefono: providerData.phone,
            tipo: providerData.type,
            categoria: providerData.category,
            direccion: providerData.address,
            descripcion: providerData.description,
            capacidad: providerData.capacity || '',
            precioDesde: providerData.priceFrom || '',
            estado: 'pendiente_verificacion',
            fechaRegistro: new Date().toLocaleDateString('es-PE')
        });
    }

    async createQuote(quoteData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.cotizaciones, {
            id: `COT-${Date.now()}`,
            nombre: quoteData.name,
            email: quoteData.email,
            telefono: quoteData.phone,
            tipoEvento: quoteData.eventType,
            fechaEvento: quoteData.eventDate,
            cantidadInvitados: quoteData.guestCount,
            serviciosSolicitados: quoteData.requestedServices?.join(', ') || '',
            presupuesto: quoteData.budget || 'No especificado',
            comentarios: quoteData.comments || '',
            estado: 'nuevo',
            fechaCotizacion: new Date().toLocaleDateString('es-PE')
        });
    }

    async captureLead(leadData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.leads, {
            id: `LEAD-${Date.now()}`,
            nombre: leadData.name || '',
            email: leadData.email || '',
            telefono: leadData.phone || '',
            interes: leadData.interest,
            origen: leadData.source || 'web',
            campania: leadData.campaign || '',
            fecha: new Date().toLocaleDateString('es-PE')
        });
    }

    async logSearch(searchData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.busquedas, {
            tipoEvento: searchData.eventType,
            fecha: searchData.eventDate,
            invitados: searchData.guestCount,
            categoria: searchData.category || 'locales',
            fechaBusqueda: new Date().toLocaleDateString('es-PE'),
            horaBusqueda: new Date().toLocaleTimeString('es-PE')
        });
    }

    async submitFeedback(feedbackData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.feedback, {
            id: `FBK-${Date.now()}`,
            tipo: feedbackData.type,
            mensaje: feedbackData.message,
            email: feedbackData.email || '',
            calificacion: feedbackData.rating || '',
            fecha: new Date().toLocaleDateString('es-PE')
        });
    }

    async logProviderMessage(messageData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.mensajesProveedores, {
            id: `MSG-${Date.now()}`,
            tipo: messageData.type || 'mensaje_chat',
            proveedorNombre: messageData.providerName,
            proveedorId: messageData.providerId,
            localServicio: messageData.localService,
            localServicioSlug: messageData.localServiceSlug,
            tipoProveedor: messageData.providerType || 'local',
            mensaje: messageData.message,
            usuarioNombre: messageData.userName,
            usuarioEmail: messageData.userEmail,
            usuarioTelefono: messageData.userPhone,
            estado: 'pendiente_respuesta',
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE')
        });
    }

    /**
     * Obtener estadísticas de datos locales
     */
    getLocalStats() {
        const sheets = Object.values(GOOGLE_SHEETS_CONFIG.sheets);
        const stats = {
            total: 0,
            pending: 0,
            synced: 0,
            bySheet: {}
        };

        for (const sheet of sheets) {
            const key = `celebralope_offline_${sheet}`;
            try {
                const data = JSON.parse(localStorage.getItem(key) || '[]');
                const pending = data.filter(item => item.pendingSync).length;
                stats.bySheet[sheet] = {
                    total: data.length,
                    pending,
                    synced: data.length - pending
                };
                stats.total += data.length;
                stats.pending += pending;
                stats.synced += data.length - pending;
            } catch (e) {
                stats.bySheet[sheet] = { total: 0, pending: 0, synced: 0 };
            }
        }

        return stats;
    }
}

// Instancia global
const googleSheets = new GoogleSheetsService();

// Exportar para uso global
window.googleSheets = googleSheets;
window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;
