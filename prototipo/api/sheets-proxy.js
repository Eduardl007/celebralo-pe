/**
 * CELÉBRALO PE - Vercel API Route para Google Sheets
 *
 * Esta función actúa como intermediario seguro entre el frontend
 * y Google Sheets, ocultando las credenciales del cliente.
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
    'MensajesProveedores',
    'PropuestasIA',
    'Encuestas',
    'Visitas'
];

// Campos permitidos por hoja
const ALLOWED_FIELDS = {
    Usuarios: ['id', 'nombre', 'apellido', 'email', 'telefono', 'tipoRegistro', 'estado', 'fechaRegistro', 'accion', 'metodo', 'fecha', 'hora'],
    Reservas: ['id', 'tipo', 'local', 'proveedor', 'fechaEvento', 'tipoEvento', 'invitados', 'precioEstimado', 'nombre', 'email', 'telefono', 'mensaje', 'estado', 'origen', 'fecha', 'hora', 'serviciosAdicionales'],
    Consultas: ['id', 'consulta', 'respuesta', 'categoria', 'modoChat', 'tipoEvento', 'invitados', 'serviciosInteres', 'etapa', 'fecha', 'hora', 'tipo', 'local', 'localId', 'servicioId', 'propietario', 'mensaje', 'estado'],
    Proveedores: ['id', 'nombreNegocio', 'nombreContacto', 'email', 'telefono', 'tipo', 'categoria', 'direccion', 'descripcion', 'capacidad', 'precioDesde', 'estado', 'fechaRegistro'],
    Cotizaciones: ['id', 'nombre', 'email', 'telefono', 'tipoEvento', 'fechaEvento', 'fecha', 'invitados', 'cantidadInvitados', 'serviciosSolicitados', 'presupuesto', 'precioBase', 'precioEstimado', 'comentarios', 'mensaje', 'servicio', 'local', 'tipo', 'origen', 'estado', 'fechaCotizacion'],
    Leads: ['id', 'nombre', 'email', 'telefono', 'interes', 'origen', 'campania', 'fecha', 'hora', 'contacto', 'fechaPreferida', 'local', 'localSlug', 'tipoSolicitud', 'estado'],
    Feedback: ['id', 'tipo', 'mensaje', 'email', 'calificacion', 'fecha', 'local', 'localId', 'localSlug', 'tipoEvento', 'nombre'],
    Busquedas: ['tipoEvento', 'fecha', 'invitados', 'categoria', 'fechaBusqueda', 'horaBusqueda'],
    Logins: ['id', 'contacto', 'metodo', 'fecha', 'hora'],
    MensajesProveedores: ['id', 'tipo', 'proveedorNombre', 'proveedorId', 'localServicio', 'localServicioSlug', 'tipoProveedor', 'mensaje', 'usuarioNombre', 'usuarioEmail', 'usuarioTelefono', 'estado', 'fecha', 'hora'],
    PropuestasIA: ['id', 'tipoEvento', 'estiloEvento', 'cantidadInvitados', 'presupuestoEstimadoMin', 'presupuestoEstimadoMax', 'localesRecomendados', 'serviciosRecomendados', 'ideaOriginal', 'aceptada', 'fecha', 'hora'],
    Encuestas: ['facilidad', 'confianza', 'usaria', 'nps', 'mejoras', 'contacto', 'fecha', 'hora'],
    Visitas: ['id', 'nombre', 'email', 'telefono', 'local', 'fechaPreferida', 'estado', 'fecha', 'hora']
};

// Rate limiting simple (en memoria - se resetea con cada cold start)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX = 30; // máximo 30 requests por minuto por IP

/**
 * Sanitizar string para prevenir inyecciones
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+=/gi, '')
        .trim()
        .substring(0, 5000);
}

/**
 * Sanitizar objeto de datos
 */
function sanitizeData(data, allowedFields) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
        if (!allowedFields.includes(key) && !key.startsWith('_')) {
            continue;
        }

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
    return [
        'https://celebralo.pe',
        'https://www.celebralo.pe',
        'https://celebralope.netlify.app',
        'https://celebralo-pe.vercel.app',
        'http://localhost:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
}

/**
 * Handler principal - Vercel API Route
 */
export default async function handler(req, res) {
    // Headers CORS
    const origin = req.headers.origin || '';
    const allowedOrigins = getAllowedOrigins();
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    res.setHeader('Access-Control-Allow-Origin', corsOrigin);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Content-Type', 'application/json');

    // Manejar preflight CORS
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    // Rate limiting
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0] ||
                     req.headers['x-real-ip'] ||
                     'unknown';

    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta en 1 minuto.' });
    }

    try {
        const { action, sheet, data } = req.body || {};

        // Validar acción
        if (!action || !['insert', 'update', 'read'].includes(action)) {
            return res.status(400).json({ error: 'Acción inválida' });
        }

        // Validar nombre de hoja
        if (!sheet || !ALLOWED_SHEETS.includes(sheet)) {
            return res.status(400).json({ error: 'Hoja no válida' });
        }

        // Validar y sanitizar datos
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Datos inválidos' });
        }

        const allowedFields = ALLOWED_FIELDS[sheet] || [];
        const sanitizedData = sanitizeData(data, allowedFields);

        // Agregar metadata de servidor
        sanitizedData._serverTimestamp = new Date().toISOString();
        sanitizedData._clientIP = clientIP;
        sanitizedData._validated = true;

        // Obtener URL de Google Apps Script desde variables de entorno
        const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_URL;

        if (!GOOGLE_SCRIPT_URL) {
            console.error('GOOGLE_SHEETS_URL no configurada');
            return res.status(500).json({
                error: 'Servicio no configurado',
                offline: true
            });
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

        let result;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            result = { success: response.ok, status: response.status };
        }

        return res.status(response.ok ? 200 : 500).json({
            success: response.ok,
            message: response.ok ? 'Datos guardados correctamente' : 'Error al guardar',
            ...result
        });

    } catch (error) {
        console.error('Error en sheets-proxy:', error);

        return res.status(500).json({
            error: 'Error interno del servidor',
            offline: true
        });
    }
}
