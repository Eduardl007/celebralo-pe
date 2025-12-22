/* ========================================
   CELÉBRALO PE - Configuración de Servicios Google
   ======================================== */

/**
 * =============================================
 * GUÍA DE CONFIGURACIÓN COMPLETA
 * =============================================
 *
 * Esta guía te ayudará a configurar todos los
 * servicios de Google para Celébralo pe.
 */

const CELÉBRALO PE_GOOGLE_CONFIG = {

    // =========================================
    // 1. GOOGLE SHEETS (Base de Datos)
    // =========================================
    googleSheets: {
        /**
         * PASO 1: Crear la hoja de cálculo
         * 1. Ve a https://sheets.google.com
         * 2. Crea una nueva hoja llamada "Celébralo pe - Base de Datos"
         * 3. Crea las siguientes pestañas (hojas):
         *    - Usuarios
         *    - Reservas
         *    - Consultas
         *    - Proveedores
         *    - Cotizaciones
         *    - Leads
         *    - Feedback
         *    - Busquedas
         *
         * PASO 2: Configurar encabezados en cada hoja
         * (Ver sección ESTRUCTURA_HOJAS más abajo)
         *
         * PASO 3: Obtener el ID de la hoja
         * - El ID está en la URL: https://docs.google.com/spreadsheets/d/[ESTE_ES_TU_ID]/edit
         */
        spreadsheetId: 'PEGAR_TU_SPREADSHEET_ID_AQUI',

        /**
         * PASO 4: Crear el Web App con Google Apps Script
         * 1. En tu Google Sheet, ve a Extensiones > Apps Script
         * 2. Borra el código existente y pega el código de APPS_SCRIPT_CODE (abajo)
         * 3. Guarda el proyecto con nombre "Celébralo pe API"
         * 4. Click en "Implementar" > "Nueva implementación"
         * 5. Tipo: "Aplicación web"
         * 6. Ejecutar como: "Yo"
         * 7. Quién tiene acceso: "Cualquier persona"
         * 8. Click en "Implementar"
         * 9. Copia la URL del Web App
         */
        webAppUrl: 'PEGAR_TU_WEB_APP_URL_AQUI',

        // URL de acceso directo a tu hoja (para monitoreo manual)
        viewUrl: 'https://docs.google.com/spreadsheets/d/PEGAR_TU_SPREADSHEET_ID_AQUI/edit'
    },

    // =========================================
    // 2. GOOGLE ANALYTICS 4 (Métricas)
    // =========================================
    googleAnalytics: {
        /**
         * PASO 1: Crear cuenta de Analytics
         * 1. Ve a https://analytics.google.com
         * 2. Click en "Empezar a medir"
         * 3. Nombre de cuenta: "Celébralo pe"
         * 4. Click en "Siguiente"
         *
         * PASO 2: Crear propiedad
         * 1. Nombre de propiedad: "Celébralo pe Web"
         * 2. Zona horaria: Peru
         * 3. Moneda: Soles peruanos (PEN)
         * 4. Click en "Siguiente"
         *
         * PASO 3: Configurar stream de datos
         * 1. Selecciona "Web"
         * 2. URL: tu dominio (ej: celebralo.pe)
         * 3. Nombre: "Celébralo pe Website"
         * 4. Click en "Crear stream"
         *
         * PASO 4: Obtener Measurement ID
         * - El ID tiene formato: G-XXXXXXXXXX
         */
        measurementId: 'G-XXXXXXXXXX',

        // URL de acceso al dashboard de Analytics
        dashboardUrl: 'https://analytics.google.com/analytics/web/'
    },

    // =========================================
    // 3. GOOGLE TAG MANAGER (Opcional)
    // =========================================
    googleTagManager: {
        /**
         * Google Tag Manager te permite gestionar todos los
         * tags (Analytics, Facebook Pixel, etc.) desde un solo lugar.
         *
         * Para configurar:
         * 1. Ve a https://tagmanager.google.com
         * 2. Crea una cuenta y contenedor
         * 3. Obtén el ID (formato: GTM-XXXXXXX)
         */
        containerId: 'GTM-XXXXXXX',
        enabled: false // Cambiar a true cuando esté configurado
    },

    // =========================================
    // 4. URLs DE ACCESO RÁPIDO
    // =========================================
    accessUrls: {
        // Donde ver todos tus datos
        sheetsData: 'https://docs.google.com/spreadsheets/d/TU_ID/edit',

        // Donde ver métricas en tiempo real
        analyticsRealtime: 'https://analytics.google.com/analytics/web/#/realtime',

        // Reportes de Analytics
        analyticsReports: 'https://analytics.google.com/analytics/web/#/report',

        // Gestionar tags
        tagManager: 'https://tagmanager.google.com'
    }
};

/**
 * =============================================
 * ESTRUCTURA DE HOJAS EN GOOGLE SHEETS
 * =============================================
 *
 * Copia estos encabezados en la primera fila de cada hoja:
 */
const ESTRUCTURA_HOJAS = {
    Usuarios: [
        'id', 'nombre', 'apellido', 'email', 'telefono',
        'tipoRegistro', 'estado', 'fechaRegistro', 'timestamp',
        'userAgent', 'source'
    ],

    Reservas: [
        'id', 'usuario', 'email', 'telefono', 'tipoEvento',
        'fechaEvento', 'cantidadInvitados', 'local', 'localId',
        'serviciosAdicionales', 'precioTotal', 'estado',
        'fechaReserva', 'timestamp'
    ],

    Consultas: [
        'id', 'consulta', 'respuesta', 'categoria',
        'fecha', 'hora', 'timestamp'
    ],

    Proveedores: [
        'id', 'nombreNegocio', 'nombreContacto', 'email',
        'telefono', 'tipo', 'categoria', 'direccion',
        'descripcion', 'capacidad', 'precioDesde',
        'estado', 'fechaRegistro', 'timestamp'
    ],

    Cotizaciones: [
        'id', 'nombre', 'email', 'telefono', 'tipoEvento',
        'fechaEvento', 'cantidadInvitados', 'serviciosSolicitados',
        'presupuesto', 'comentarios', 'estado',
        'fechaCotizacion', 'timestamp'
    ],

    Leads: [
        'id', 'nombre', 'email', 'telefono', 'interes',
        'origen', 'campania', 'fecha', 'timestamp'
    ],

    Feedback: [
        'id', 'tipo', 'mensaje', 'email',
        'calificacion', 'fecha', 'timestamp'
    ],

    Busquedas: [
        'tipoEvento', 'fecha', 'invitados', 'categoria',
        'fechaBusqueda', 'horaBusqueda', 'timestamp'
    ]
};

/**
 * =============================================
 * CÓDIGO PARA GOOGLE APPS SCRIPT
 * =============================================
 *
 * Copia este código en tu Google Apps Script:
 */
const APPS_SCRIPT_CODE = `
// ========================================
// CELÉBRALO PE - Google Apps Script Web App
// Pegar este código en Apps Script
// ========================================

// Configuración
const SPREADSHEET_ID = 'TU_SPREADSHEET_ID_AQUI';

// Manejar solicitudes POST
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(data.sheet);

    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Hoja no encontrada: ' + data.sheet
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Obtener encabezados
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Crear fila con datos
    const row = headers.map(header => data.data[header] || '');

    // Agregar fila
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Manejar solicitudes GET (para testing)
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Celébralo pe API está funcionando',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Función para obtener datos de una hoja
function getData(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

// Función para crear reporte diario
function generateDailyReport() {
  const today = new Date().toLocaleDateString('es-PE');

  const report = {
    fecha: today,
    nuevosUsuarios: countTodayEntries('Usuarios'),
    nuevasReservas: countTodayEntries('Reservas'),
    nuevasCotizaciones: countTodayEntries('Cotizaciones'),
    nuevosProveedores: countTodayEntries('Proveedores'),
    consultasChatbot: countTodayEntries('Consultas')
  };

  // Enviar por email (opcional)
  // MailApp.sendEmail('tu@email.com', 'Reporte Diario Celébralo pe', JSON.stringify(report, null, 2));

  return report;
}

function countTodayEntries(sheetName) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();
  const today = new Date().toLocaleDateString('es-PE');

  return data.filter(row => {
    const dateCol = row.find(cell =>
      typeof cell === 'string' && cell.includes('/')
    );
    return dateCol === today;
  }).length;
}
`;

/**
 * =============================================
 * KPIs E INDICADORES A MONITOREAR
 * =============================================
 */
const KPIS_CELÉBRALO PE = {
    // Adquisición
    adquisicion: {
        visitasWeb: 'GA4 > Informes > Adquisición > Visión general',
        nuevosUsuarios: 'GA4 > Informes > Adquisición > Adquisición de usuarios',
        canalesTrafico: 'GA4 > Informes > Adquisición > Tráfico',
        tasaRebote: 'GA4 > Informes > Interacción > Páginas y pantallas'
    },

    // Conversión
    conversion: {
        registrosCompletados: 'Google Sheets > Usuarios (contar filas)',
        reservasCreadas: 'Google Sheets > Reservas (contar filas)',
        cotizacionesSolicitadas: 'Google Sheets > Cotizaciones (contar filas)',
        tasaConversion: 'Reservas / Visitas * 100'
    },

    // Engagement
    engagement: {
        tiempoEnSitio: 'GA4 > Informes > Interacción > Visión general',
        paginasPorSesion: 'GA4 > Informes > Interacción > Páginas',
        usoChatbot: 'Google Sheets > Consultas (contar filas)',
        eventosPopulares: 'Google Sheets > Busquedas (agrupar por tipoEvento)'
    },

    // Proveedores
    proveedores: {
        registrosProveedores: 'Google Sheets > Proveedores (contar filas)',
        porTipo: 'Google Sheets > Proveedores (agrupar por tipo)',
        tasaActivacion: 'Proveedores activos / Total proveedores'
    },

    // Satisfacción
    satisfaccion: {
        calificacionPromedio: 'Google Sheets > Feedback (promedio calificacion)',
        feedbackRecibido: 'Google Sheets > Feedback (contar filas)',
        tiposFeedback: 'Google Sheets > Feedback (agrupar por tipo)'
    }
};

// Exportar configuración
window.CELÉBRALO PE_GOOGLE_CONFIG = CELÉBRALO PE_GOOGLE_CONFIG;
window.ESTRUCTURA_HOJAS = ESTRUCTURA_HOJAS;
window.KPIS_CELÉBRALO PE = KPIS_CELÉBRALO PE;

console.log('📋 Configuración de Google cargada. Ver CELÉBRALO PE_GOOGLE_CONFIG en consola.');
