/* ========================================
   CELÉBRALO PE - Configuración de Servicios Google
   Última actualización: 2026-01-02 (hora actual)
   ======================================== */

/**
 * =============================================
 * GUÍA DE CONFIGURACIÓN COMPLETA
 * =============================================
 */

const CELEBRALO_GOOGLE_CONFIG = {

    // =========================================
    // 1. GOOGLE SHEETS (Base de Datos)
    // =========================================
    googleSheets: {
        spreadsheetId: 'PEGAR_TU_SPREADSHEET_ID_AQUI',
        webAppUrl: 'PEGAR_TU_WEB_APP_URL_AQUI',
        viewUrl: 'https://docs.google.com/spreadsheets/d/PEGAR_TU_SPREADSHEET_ID_AQUI/edit'
    },

    // =========================================
    // 2. GOOGLE ANALYTICS 4 (Métricas)
    // =========================================
    googleAnalytics: {
        measurementId: 'G-XXXXXXXXXX',
        dashboardUrl: 'https://analytics.google.com/analytics/web/'
    },

    // =========================================
    // 3. GOOGLE TAG MANAGER (Opcional)
    // =========================================
    googleTagManager: {
        containerId: 'GTM-XXXXXXX',
        enabled: false
    }
};

/**
 * =============================================
 * ESTRUCTURA DE HOJAS EN GOOGLE SHEETS
 * Actualizado: 2026-01-02
 * =============================================
 */
const ESTRUCTURA_HOJAS = {

    // Registro de usuarios
    Usuarios: [
        'id', 'nombre', 'apellido', 'contacto', 'telefono',
        'tipo_registro', 'estado', 'fecha', 'hora', 'timestamp'
    ],

    // Registro de logins
    Logins: [
        'id', 'contacto', 'metodo', 'fecha', 'hora', 'timestamp'
    ],

    // Reservas de locales y servicios
    Reservas: [
        'id', 'tipo', 'local', 'proveedor', 'fechaEvento', 'tipoEvento',
        'invitados', 'precioEstimado', 'nombre', 'email', 'telefono',
        'mensaje', 'estado', 'origen', 'fecha', 'hora', 'timestamp'
    ],

    // Consultas del chatbot
    Consultas: [
        'id', 'consulta', 'respuesta', 'categoria', 'modoChat',
        'localId', 'servicioId', 'fecha', 'hora', 'timestamp'
    ],

    // Registro de proveedores
    Proveedores: [
        'id', 'nombreNegocio', 'nombreContacto', 'email',
        'telefono', 'tipo', 'categoria', 'direccion',
        'descripcion', 'capacidadMin', 'capacidadMax', 'precioDesde',
        'serviciosIncluidos', 'estado', 'fechaRegistro', 'timestamp'
    ],

    // Cotizaciones solicitadas
    Cotizaciones: [
        'id', 'nombre', 'email', 'telefono', 'tipoEvento',
        'estiloEvento', 'fechaEvento', 'cantidadInvitados',
        'localPreferido', 'serviciosSolicitados', 'presupuestoMin',
        'presupuestoMax', 'comentarios', 'estado', 'origenCotizacion',
        'fechaCotizacion', 'timestamp'
    ],

    // Leads capturados
    Leads: [
        'id', 'nombre', 'email', 'telefono', 'interes',
        'tipoEvento', 'origen', 'campania', 'fecha', 'timestamp'
    ],

    // Feedback de usuarios
    Feedback: [
        'id', 'tipo', 'mensaje', 'email', 'pagina',
        'calificacion', 'fecha', 'timestamp'
    ],

    // Historial de búsquedas
    Busquedas: [
        'id', 'tipo_evento', 'fecha_evento', 'invitados', 'categoria',
        'fecha', 'hora', 'timestamp'
    ],

    // Encuestas de satisfacción
    Encuestas: [
        'facilidad', 'confianza', 'usaria', 'nps', 'mejoras',
        'contacto', 'fecha', 'hora', 'timestamp'
    ],

    // Propuestas generadas por el asesor IA
    PropuestasIA: [
        'id', 'tipoEvento', 'estiloEvento', 'cantidadInvitados',
        'presupuestoEstimadoMin', 'presupuestoEstimadoMax',
        'localesRecomendados', 'serviciosRecomendados',
        'ideaOriginal', 'aceptada', 'fecha', 'hora', 'timestamp'
    ],

    // Chats con propietarios (resumen de conversaciones)
    ChatsProveedores: [
        'id', 'usuarioId', 'proveedorId', 'proveedorNombre',
        'tipoProveedor', 'mensajesCount', 'ultimoMensaje',
        'estado', 'fechaInicio', 'fechaUltimoMensaje', 'timestamp'
    ],

    // Mensajes individuales con proveedores
    MensajesProveedores: [
        'id', 'tipo', 'proveedorNombre', 'proveedorId',
        'localServicio', 'localServicioSlug', 'tipoProveedor',
        'mensaje', 'usuarioNombre', 'usuarioEmail', 'usuarioTelefono',
        'estado', 'fecha', 'hora', 'timestamp'
    ]
};

/**
 * =============================================
 * CATEGORÍAS DEL SISTEMA - Actualizado 2026-01-02
 * =============================================
 */
const CATEGORIAS_SISTEMA = {

    // Categorías de locales
    locales: {
        salon: 'Salón de eventos',
        quinta: 'Quinta/Hacienda',
        club: 'Club/Centro recreacional',
        terraza: 'Terraza',
        'centro-eventos': 'Centro de eventos'
    },

    // Categorías de servicios
    servicios: {
        catering: 'Catering',
        dj: 'DJ y Sonido',
        fotografia: 'Fotografía y Video',
        decoracion: 'Decoración',
        pasteleria: 'Tortas y Postres',
        animacion: 'Animación',
        banda: 'Banda/Orquesta',
        mobiliario: 'Mobiliario'
    },

    // Tipos de eventos
    eventos: {
        matrimonio: 'Matrimonio',
        quinceanos: 'Fiesta de XV Años',
        cumpleanos: 'Cumpleaños',
        corporativo: 'Evento Corporativo',
        bautizo: 'Bautizo',
        graduacion: 'Graduación',
        'baby-shower': 'Baby Shower',
        aniversario: 'Aniversario'
    },

    // Estilos de eventos
    estilos: {
        elegante: 'Elegante y sofisticado',
        rustico: 'Rústico y natural',
        moderno: 'Moderno y minimalista',
        tematico: 'Temático y divertido',
        infantil: 'Infantil y colorido'
    }
};

/**
 * =============================================
 * CÓDIGO PARA GOOGLE APPS SCRIPT
 * Actualizado: 2026-01-02
 * =============================================
 */
const APPS_SCRIPT_CODE = `
// ========================================
// CELÉBRALO PE - Google Apps Script Web App
// Versión: 2.0 - Actualizado 2026-01-02
// ========================================

const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// Manejar solicitudes POST
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(data.sheet);

    if (!sheet) {
      // Crear hoja si no existe
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = ss.insertSheet(data.sheet);

      // Agregar encabezados si se proporcionan
      if (data.headers) {
        newSheet.getRange(1, 1, 1, data.headers.length).setValues([data.headers]);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Hoja creada: ' + data.sheet
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Obtener encabezados
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Crear fila con datos
    const row = headers.map(header => {
      const value = data.data[header];
      return value !== undefined ? value : '';
    });

    // Agregar fila
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente',
      sheet: data.sheet
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar solicitudes GET
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'getStats') {
    return ContentService.createTextOutput(JSON.stringify(getStats()))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Celébralo pe API v2.0 funcionando',
    timestamp: new Date().toISOString(),
    hojas: getSheetNames()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Obtener nombres de hojas
function getSheetNames() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheets().map(sheet => sheet.getName());
}

// Obtener estadísticas
function getStats() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const stats = {};

  const hojas = ['Usuarios', 'Logins', 'Reservas', 'Cotizaciones', 'Proveedores', 'Consultas', 'PropuestasIA', 'MensajesProveedores'];

  hojas.forEach(nombre => {
    const sheet = ss.getSheetByName(nombre);
    if (sheet) {
      stats[nombre] = Math.max(0, sheet.getLastRow() - 1);
    }
  });

  stats.fecha = new Date().toLocaleDateString('es-PE');
  stats.hora = new Date().toLocaleTimeString('es-PE');

  return stats;
}

// Reporte diario automático
function sendDailyReport() {
  const stats = getStats();

  const mensaje = \`
📊 REPORTE DIARIO - Celébralo pe
================================
📅 Fecha: \${stats.fecha}
⏰ Hora: \${stats.hora}

👥 Usuarios registrados: \${stats.Usuarios || 0}
🔐 Logins totales: \${stats.Logins || 0}
📋 Reservas: \${stats.Reservas || 0}
💰 Cotizaciones: \${stats.Cotizaciones || 0}
🏢 Proveedores: \${stats.Proveedores || 0}
💬 Consultas chatbot: \${stats.Consultas || 0}
🤖 Propuestas IA: \${stats.PropuestasIA || 0}
📨 Mensajes a proveedores: \${stats.MensajesProveedores || 0}
  \`;

  // Descomentar para activar envío de email
  // MailApp.sendEmail('tu@email.com', '📊 Reporte Diario Celébralo pe', mensaje);

  return mensaje;
}
`;

/**
 * =============================================
 * KPIs E INDICADORES - Actualizado
 * =============================================
 */
const KPIS_CELEBRALO = {
    adquisicion: {
        visitasWeb: 'GA4 > Informes > Adquisición > Visión general',
        nuevosUsuarios: 'GA4 > Informes > Adquisición > Adquisición de usuarios',
        canalesTrafico: 'GA4 > Informes > Adquisición > Tráfico',
        tasaRebote: 'GA4 > Informes > Interacción > Páginas y pantallas'
    },
    conversion: {
        registrosCompletados: 'Google Sheets > Usuarios',
        reservasCreadas: 'Google Sheets > Reservas',
        cotizacionesSolicitadas: 'Google Sheets > Cotizaciones',
        propuestasAceptadas: 'Google Sheets > PropuestasIA (filtrar aceptada=true)',
        tasaConversion: '(Reservas / Usuarios) * 100'
    },
    engagement: {
        tiempoEnSitio: 'GA4 > Informes > Interacción',
        usoChatbot: 'Google Sheets > Consultas',
        propuestasGeneradas: 'Google Sheets > PropuestasIA',
        chatsConProveedores: 'Google Sheets > ChatsProveedores'
    },
    proveedores: {
        registrosProveedores: 'Google Sheets > Proveedores',
        porCategoria: 'Google Sheets > Proveedores (agrupar por categoria)',
        chatsRecibidos: 'Google Sheets > ChatsProveedores'
    }
};

// Exportar configuración
window.CELEBRALO_GOOGLE_CONFIG = CELEBRALO_GOOGLE_CONFIG;
window.ESTRUCTURA_HOJAS = ESTRUCTURA_HOJAS;
window.CATEGORIAS_SISTEMA = CATEGORIAS_SISTEMA;
window.KPIS_CELEBRALO = KPIS_CELEBRALO;

console.log('📋 Configuración Google Sheets cargada - Celébralo pe v2.0');
