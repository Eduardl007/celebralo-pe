/* ========================================
   EVENTIFY - Google Sheets Integration
   Base de datos en Google Sheets
   ======================================== */

/**
 * CONFIGURACIÓN DE GOOGLE SHEETS
 *
 * Para usar esta integración necesitas:
 * 1. Crear una hoja de cálculo en Google Sheets
 * 2. Ir a Extensiones > Apps Script
 * 3. Copiar el código del Web App (ver abajo)
 * 4. Publicar como aplicación web
 * 5. Copiar la URL del Web App aquí
 */

const GOOGLE_SHEETS_CONFIG = {
    // URL del Web App de Google Apps Script (reemplazar con tu URL)
    webAppUrl: 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec',

    // ID de la hoja de cálculo (obtener de la URL de tu Google Sheet)
    spreadsheetId: 'TU_SPREADSHEET_ID',

    // Nombres de las hojas (pestañas)
    sheets: {
        usuarios: 'Usuarios',
        reservas: 'Reservas',
        consultas: 'Consultas',
        proveedores: 'Proveedores',
        cotizaciones: 'Cotizaciones',
        leads: 'Leads',
        feedback: 'Feedback'
    }
};

/**
 * Servicio de Google Sheets
 */
class GoogleSheetsService {
    constructor() {
        this.webAppUrl = GOOGLE_SHEETS_CONFIG.webAppUrl;
        this.isConfigured = !this.webAppUrl.includes('TU_SCRIPT_ID');
    }

    /**
     * Verificar si el servicio está configurado
     */
    isReady() {
        return this.isConfigured;
    }

    /**
     * Enviar datos a Google Sheets
     * @param {string} sheetName - Nombre de la hoja
     * @param {object} data - Datos a enviar
     */
    async sendData(sheetName, data) {
        if (!this.isConfigured) {
            console.warn('Google Sheets no configurado. Guardando localmente.');
            return this.saveLocally(sheetName, data);
        }

        try {
            const payload = {
                action: 'insert',
                sheet: sheetName,
                data: {
                    ...data,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    source: window.location.href
                }
            };

            const response = await fetch(this.webAppUrl, {
                method: 'POST',
                mode: 'no-cors', // Necesario para Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log(`✅ Datos enviados a ${sheetName}`);
            return { success: true, message: 'Datos guardados correctamente' };

        } catch (error) {
            console.error('Error enviando a Google Sheets:', error);
            // Fallback: guardar localmente
            return this.saveLocally(sheetName, data);
        }
    }

    /**
     * Guardar localmente como fallback
     */
    saveLocally(sheetName, data) {
        const key = `eventify_offline_${sheetName}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push({
            ...data,
            timestamp: new Date().toISOString(),
            pendingSync: true
        });
        localStorage.setItem(key, JSON.stringify(existing));
        console.log(`💾 Datos guardados localmente en ${sheetName}`);
        return { success: true, message: 'Datos guardados localmente', offline: true };
    }

    /**
     * Registrar nuevo usuario
     */
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

    /**
     * Registrar login
     */
    async logLogin(email, method = 'email') {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.usuarios, {
            accion: 'LOGIN',
            email: email,
            metodo: method,
            fecha: new Date().toLocaleDateString('es-PE'),
            hora: new Date().toLocaleTimeString('es-PE')
        });
    }

    /**
     * Registrar nueva reserva
     */
    async createReservation(reservationData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.reservas, {
            id: `RES-${Date.now()}`,
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

    /**
     * Registrar consulta del chatbot
     */
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

    /**
     * Registrar proveedor
     */
    async registerProvider(providerData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.proveedores, {
            id: `PRV-${Date.now()}`,
            nombreNegocio: providerData.businessName,
            nombreContacto: providerData.contactName,
            email: providerData.email,
            telefono: providerData.phone,
            tipo: providerData.type, // local o servicio
            categoria: providerData.category,
            direccion: providerData.address,
            descripcion: providerData.description,
            capacidad: providerData.capacity || '',
            precioDesde: providerData.priceFrom || '',
            estado: 'pendiente_verificacion',
            fechaRegistro: new Date().toLocaleDateString('es-PE')
        });
    }

    /**
     * Registrar cotización
     */
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

    /**
     * Registrar lead (interés)
     */
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

    /**
     * Registrar búsqueda
     */
    async logSearch(searchData) {
        return this.sendData('Busquedas', {
            tipoEvento: searchData.eventType,
            fecha: searchData.eventDate,
            invitados: searchData.guestCount,
            categoria: searchData.category || 'locales',
            fechaBusqueda: new Date().toLocaleDateString('es-PE'),
            horaBusqueda: new Date().toLocaleTimeString('es-PE')
        });
    }

    /**
     * Registrar feedback
     */
    async submitFeedback(feedbackData) {
        return this.sendData(GOOGLE_SHEETS_CONFIG.sheets.feedback, {
            id: `FBK-${Date.now()}`,
            tipo: feedbackData.type, // sugerencia, queja, felicitacion
            mensaje: feedbackData.message,
            email: feedbackData.email || '',
            calificacion: feedbackData.rating || '',
            fecha: new Date().toLocaleDateString('es-PE')
        });
    }

    /**
     * Sincronizar datos pendientes (cuando vuelva la conexión)
     */
    async syncPendingData() {
        if (!this.isConfigured) return;

        const sheets = Object.values(GOOGLE_SHEETS_CONFIG.sheets);

        for (const sheetName of sheets) {
            const key = `eventify_offline_${sheetName}`;
            const pending = JSON.parse(localStorage.getItem(key) || '[]');

            if (pending.length > 0) {
                console.log(`🔄 Sincronizando ${pending.length} registros de ${sheetName}...`);

                for (const item of pending) {
                    if (item.pendingSync) {
                        delete item.pendingSync;
                        await this.sendData(sheetName, item);
                    }
                }

                // Limpiar después de sincronizar
                localStorage.removeItem(key);
            }
        }
    }
}

// Instancia global
const googleSheets = new GoogleSheetsService();

// Sincronizar cuando vuelva la conexión
window.addEventListener('online', () => {
    googleSheets.syncPendingData();
});

// Exportar para uso global
window.googleSheets = googleSheets;
