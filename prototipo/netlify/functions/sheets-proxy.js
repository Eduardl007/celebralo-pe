/**
 * CELÉBRALO PE - Netlify Function Proxy para Google Sheets
 *
 * Esta función actúa como intermediario seguro entre el frontend
 * y Google Sheets, ocultando las credenciales del cliente.
 *
 * Características de seguridad:
 * - Credenciales almacenadas en variables de entorno (no en código)
 * - Validación de origen (CORS)
 * - Rate limiting básico
 * - Validación de datos de entrada
 * - Sanitización de datos
 */

// Configuración de hojas permitidas (whitelist)
const ALLOWED_SHEETS = [
    'Usuarios',
    'Reservas',
    'Consultas',
    'Proveedores',
    'Cotizaciones',
    'Leads',
    'Feedback',
    'Busquedas',
    'Logins',
    'MensajesProveedores'
];

// Campos permitidos por hoja (previene inyección de campos maliciosos)
const ALLOWED_FIELDS = {
    Usuarios: ['id', 'nombre', 'apellido', 'email', 'telefono', 'tipoRegistro', 'estado', 'fechaRegistro', 'accion', 'metodo', 'fecha', 'hora'],
    Reservas: ['id', 'tipo', 'proveedor', 'fechaEvento', 'tipoEvento', 'invitados', 'precioEstimado', 'nombre', 'contacto', 'telefono', 'mensaje', 'estado', 'origen', 'fecha', 'hora'],
    Consultas: ['id', 'consulta', 'respuesta', 'categoria', 'fecha', 'hora'],
    Proveedores: ['id', 'nombreNegocio', 'nombreContacto', 'email', 'telefono', 'tipo', 'categoria', 'direccion', 'descripcion', 'capacidad', 'precioDesde', 'estado', 'fechaRegistro'],
    Cotizaciones: ['id', 'nombre', 'email', 'telefono', 'tipoEvento', 'fechaEvento', 'cantidadInvitados', 'serviciosSolicitados', 'presupuesto', 'comentarios', 'estado', 'fechaCotizacion'],
    Leads: ['id', 'nombre', 'email', 'telefono', 'interes', 'origen', 'campania', 'fecha'],
    Feedback: ['id', 'tipo', 'mensaje', 'email', 'calificacion', 'fecha'],
    Busquedas: ['tipoEvento', 'fecha', 'invitados', 'categoria', 'fechaBusqueda', 'horaBusqueda'],
    Logins: ['id', 'contacto', 'metodo', 'fecha', 'hora'],
    MensajesProveedores: ['id', 'tipo', 'proveedorNombre', 'proveedorId', 'localServicio', 'localServicioSlug', 'tipoProveedor', 'mensaje', 'usuarioNombre', 'usuarioEmail', 'usuarioTelefono', 'estado', 'fecha', 'hora']
};

// Rate limiting simple (en memoria - se resetea con cada deploy)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 30; // máximo 30 requests por minuto por IP

/**
 * Sanitizar string para prevenir inyecciones
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/[<>]/g, '') // Remover tags HTML
        .replace(/javascript:/gi, '') // Remover javascript:
        .replace(/on\w+=/gi, '') // Remover event handlers
        .trim()
        .substring(0, 5000); // Limitar longitud
}

/**
 * Sanitizar objeto de datos
 */
function sanitizeData(data, allowedFields) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
        // Solo permitir campos de la whitelist
        if (!allowedFields.includes(key) && !key.startsWith('_')) {
            continue;
        }

        // Sanitizar según tipo
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        } else if (typeof value === 'number') {
            sanitized[key] = isFinite(value) ? value : 0;
        } else if (typeof value === 'boolean') {
            sanitized[key] = value;
        } else if (Array.isArray(value)) {
            sanitized[key] = value.map(v => typeof v === 'string' ? sanitizeString(v) : v).slice(0, 50);
        } else if (value === null || value === undefined) {
            sanitized[key] = '';
        }
    }

    return sanitized;
}

/**
 * Verificar rate limiting
 */
function checkRateLimit(ip) {
    const now = Date.now();
    const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

    // Resetear si pasó la ventana
    if (now > record.resetTime) {
        record.count = 0;
        record.resetTime = now + RATE_LIMIT_WINDOW;
    }

    record.count++;
    rateLimitMap.set(ip, record);

    return record.count <= RATE_LIMIT_MAX;
}

/**
 * Obtener orígenes permitidos
 */
function getAllowedOrigins() {
    const origins = [
        'https://celebralo.pe',
        'https://www.celebralo.pe',
        'https://celebralope.netlify.app'
    ];

    // En desarrollo, permitir localhost
    if (process.env.NODE_ENV !== 'production') {
        origins.push('http://localhost:3000', 'http://localhost:8888', 'http://127.0.0.1:5500');
    }

    return origins;
}

/**
 * Handler principal de la función
 */
exports.handler = async (event, context) => {
    // Headers CORS
    const origin = event.headers.origin || event.headers.Origin || '';
    const allowedOrigins = getAllowedOrigins();
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Manejar preflight CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Método no permitido' })
        };
    }

    // Rate limiting
    const clientIP = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';
    if (!checkRateLimit(clientIP)) {
        return {
            statusCode: 429,
            headers,
            body: JSON.stringify({ error: 'Demasiadas solicitudes. Intenta en 1 minuto.' })
        };
    }

    try {
        // Parsear body
        const body = JSON.parse(event.body || '{}');
        const { action, sheet, data } = body;

        // Validar acción
        if (!action || !['insert', 'update', 'read'].includes(action)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Acción inválida' })
            };
        }

        // Validar nombre de hoja
        if (!sheet || !ALLOWED_SHEETS.includes(sheet)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Hoja no válida' })
            };
        }

        // Validar y sanitizar datos
        if (!data || typeof data !== 'object') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Datos inválidos' })
            };
        }

        const allowedFields = ALLOWED_FIELDS[sheet] || [];
        const sanitizedData = sanitizeData(data, allowedFields);

        // Agregar metadata de servidor
        sanitizedData._serverTimestamp = new Date().toISOString();
        sanitizedData._clientIP = clientIP.split(',')[0].trim(); // Solo primera IP
        sanitizedData._validated = true;

        // Obtener URL de Google Apps Script desde variables de entorno
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_URL;

        if (!GOOGLE_SCRIPT_URL) {
            console.error('GOOGLE_SHEETS_URL no configurada en variables de entorno');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Servicio no configurado',
                    offline: true
                })
            };
        }

        // Enviar a Google Sheets
        const payload = {
            action,
            sheet,
            data: sanitizedData
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Google Apps Script puede devolver diferentes formatos
        let result;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = { success: response.ok, status: response.status };
        }

        return {
            statusCode: response.ok ? 200 : 500,
            headers,
            body: JSON.stringify({
                success: response.ok,
                message: response.ok ? 'Datos guardados correctamente' : 'Error al guardar',
                ...result
            })
        };

    } catch (error) {
        console.error('Error en sheets-proxy:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error interno del servidor',
                offline: true
            })
        };
    }
};
