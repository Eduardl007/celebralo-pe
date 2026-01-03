/* ========================================
   CELÉBRALO PE - Utilidades de Sanitización
   Prevención de XSS y validación de datos
   ======================================== */

/**
 * Sanitizador de HTML para prevenir XSS
 * Permite solo tags y atributos seguros
 */
const Sanitizer = {
    // Tags HTML permitidos (whitelist)
    allowedTags: [
        'b', 'i', 'strong', 'em', 'u', 's',
        'p', 'br', 'hr',
        'span', 'div',
        'ul', 'ol', 'li',
        'a',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],

    // Atributos permitidos por tag
    allowedAttributes: {
        'a': ['href', 'target', 'rel', 'class'],
        'span': ['class', 'style'],
        'div': ['class', 'style'],
        'p': ['class'],
        '*': ['class'] // Permitir class en todos
    },

    // Estilos CSS permitidos
    allowedStyles: [
        'color', 'background-color', 'background',
        'font-weight', 'font-style', 'text-decoration',
        'margin', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
        'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
        'display', 'flex-direction', 'gap', 'align-items', 'justify-content'
    ],

    // Protocolos permitidos para href
    allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:'],

    /**
     * Escapar caracteres especiales HTML
     */
    escapeHtml(str) {
        if (typeof str !== 'string') return '';
        const escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        return str.replace(/[&<>"'`=/]/g, char => escapeMap[char]);
    },

    /**
     * Sanitizar HTML - versión segura
     * Usa el DOM para parsear y reconstruir solo elementos seguros
     */
    sanitizeHtml(html) {
        if (typeof html !== 'string') return '';
        if (!html.trim()) return '';

        // Si no contiene HTML, retornar escapado
        if (!/<[a-z][\s\S]*>/i.test(html)) {
            return this.escapeHtml(html);
        }

        try {
            // Crear documento temporal para parsear HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Limpiar el contenido
            const cleaned = this.cleanNode(doc.body);

            return cleaned.innerHTML;
        } catch (error) {
            console.warn('Error sanitizing HTML:', error);
            return this.escapeHtml(html);
        }
    },

    /**
     * Limpiar un nodo DOM recursivamente
     */
    cleanNode(node) {
        const fragment = document.createDocumentFragment();

        for (const child of Array.from(node.childNodes)) {
            if (child.nodeType === Node.TEXT_NODE) {
                // Nodos de texto: agregar tal cual
                fragment.appendChild(document.createTextNode(child.textContent));

            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tagName = child.tagName.toLowerCase();

                // Verificar si el tag está permitido
                if (this.allowedTags.includes(tagName)) {
                    const newElement = document.createElement(tagName);

                    // Copiar solo atributos permitidos
                    this.copyAllowedAttributes(child, newElement, tagName);

                    // Recursivamente limpiar hijos
                    const cleanedChildren = this.cleanNode(child);
                    newElement.appendChild(cleanedChildren);

                    fragment.appendChild(newElement);
                } else {
                    // Tag no permitido: solo agregar el contenido de texto
                    const cleanedChildren = this.cleanNode(child);
                    fragment.appendChild(cleanedChildren);
                }
            }
            // Ignorar otros tipos de nodos (comentarios, etc.)
        }

        return fragment;
    },

    /**
     * Copiar solo atributos permitidos
     */
    copyAllowedAttributes(source, target, tagName) {
        const globalAttrs = this.allowedAttributes['*'] || [];
        const tagAttrs = this.allowedAttributes[tagName] || [];
        const allowedAttrs = [...globalAttrs, ...tagAttrs];

        for (const attr of source.attributes) {
            const attrName = attr.name.toLowerCase();

            if (!allowedAttrs.includes(attrName)) continue;

            let value = attr.value;

            // Validar href
            if (attrName === 'href') {
                if (!this.isValidUrl(value)) continue;
                // Agregar rel="noopener noreferrer" para links externos
                if (value.startsWith('http')) {
                    target.setAttribute('rel', 'noopener noreferrer');
                }
            }

            // Sanitizar style
            if (attrName === 'style') {
                value = this.sanitizeStyle(value);
                if (!value) continue;
            }

            // Prevenir event handlers (onclick, onload, etc.)
            if (attrName.startsWith('on')) continue;

            target.setAttribute(attrName, value);
        }
    },

    /**
     * Validar URL
     */
    isValidUrl(url) {
        if (!url || typeof url !== 'string') return false;

        // Prevenir javascript: y data: URLs
        const dangerous = ['javascript:', 'data:', 'vbscript:'];
        const lowerUrl = url.toLowerCase().trim();

        for (const proto of dangerous) {
            if (lowerUrl.startsWith(proto)) return false;
        }

        // Permitir URLs relativas
        if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
            return true;
        }

        // Validar protocolos permitidos
        try {
            const parsed = new URL(url);
            return this.allowedProtocols.includes(parsed.protocol);
        } catch {
            // Si no es URL válida, podría ser ruta relativa
            return !url.includes(':');
        }
    },

    /**
     * Sanitizar estilos CSS
     */
    sanitizeStyle(styleString) {
        if (!styleString) return '';

        const sanitizedStyles = [];
        const declarations = styleString.split(';');

        for (const decl of declarations) {
            const [property, value] = decl.split(':').map(s => s?.trim());

            if (!property || !value) continue;

            // Verificar si la propiedad está permitida
            const propLower = property.toLowerCase();
            if (!this.allowedStyles.includes(propLower)) continue;

            // Prevenir expression() y url() maliciosos
            const valueLower = value.toLowerCase();
            if (valueLower.includes('expression') ||
                valueLower.includes('javascript:') ||
                valueLower.includes('url(')) {
                continue;
            }

            sanitizedStyles.push(`${property}: ${value}`);
        }

        return sanitizedStyles.join('; ');
    },

    /**
     * Crear elemento HTML de forma segura
     */
    createElement(tag, attributes = {}, content = '') {
        if (!this.allowedTags.includes(tag.toLowerCase())) {
            tag = 'span';
        }

        const element = document.createElement(tag);

        // Agregar atributos de forma segura
        for (const [key, value] of Object.entries(attributes)) {
            if (key.toLowerCase().startsWith('on')) continue; // No event handlers
            if (key === 'innerHTML') continue; // No innerHTML directo

            if (key === 'href' && !this.isValidUrl(value)) continue;
            if (key === 'style') {
                element.setAttribute('style', this.sanitizeStyle(value));
                continue;
            }

            element.setAttribute(key, value);
        }

        // Agregar contenido de forma segura
        if (content) {
            if (typeof content === 'string') {
                // Si parece HTML, sanitizar; si no, usar como texto
                if (/<[a-z][\s\S]*>/i.test(content)) {
                    element.innerHTML = this.sanitizeHtml(content);
                } else {
                    element.textContent = content;
                }
            } else if (content instanceof Node) {
                element.appendChild(content);
            }
        }

        return element;
    }
};

/**
 * Validador de datos de entrada
 */
const DataValidator = {
    /**
     * Validar y sanitizar string
     */
    string(value, options = {}) {
        const {
            maxLength = 1000,
            minLength = 0,
            trim = true,
            allowHtml = false
        } = options;

        if (typeof value !== 'string') {
            return { valid: false, value: '', error: 'No es un string' };
        }

        let sanitized = trim ? value.trim() : value;

        if (sanitized.length < minLength) {
            return { valid: false, value: sanitized, error: `Mínimo ${minLength} caracteres` };
        }

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        if (!allowHtml) {
            sanitized = Sanitizer.escapeHtml(sanitized);
        }

        return { valid: true, value: sanitized };
    },

    /**
     * Validar email
     */
    email(value) {
        const result = this.string(value, { maxLength: 254 });
        if (!result.valid) return result;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(result.value)) {
            return { valid: false, value: result.value, error: 'Email inválido' };
        }

        return { valid: true, value: result.value.toLowerCase() };
    },

    /**
     * Validar teléfono
     */
    phone(value) {
        const result = this.string(value, { maxLength: 20 });
        if (!result.valid) return result;

        // Remover caracteres no numéricos excepto + al inicio
        const cleaned = result.value.replace(/[^\d+]/g, '');

        if (cleaned.length < 7 || cleaned.length > 15) {
            return { valid: false, value: cleaned, error: 'Teléfono inválido' };
        }

        return { valid: true, value: cleaned };
    },

    /**
     * Validar número
     */
    number(value, options = {}) {
        const { min = -Infinity, max = Infinity, integer = false } = options;

        let num = typeof value === 'string' ? parseFloat(value) : value;

        if (typeof num !== 'number' || !isFinite(num)) {
            return { valid: false, value: 0, error: 'No es un número válido' };
        }

        if (integer) {
            num = Math.floor(num);
        }

        if (num < min || num > max) {
            return { valid: false, value: num, error: `Debe estar entre ${min} y ${max}` };
        }

        return { valid: true, value: num };
    },

    /**
     * Validar fecha
     */
    date(value, options = {}) {
        const { minDate = null, maxDate = null, allowPast = true } = options;

        let date;
        if (value instanceof Date) {
            date = value;
        } else {
            date = new Date(value);
        }

        if (isNaN(date.getTime())) {
            return { valid: false, value: null, error: 'Fecha inválida' };
        }

        if (!allowPast && date < new Date()) {
            return { valid: false, value: date, error: 'La fecha no puede ser en el pasado' };
        }

        if (minDate && date < new Date(minDate)) {
            return { valid: false, value: date, error: 'Fecha muy antigua' };
        }

        if (maxDate && date > new Date(maxDate)) {
            return { valid: false, value: date, error: 'Fecha muy lejana' };
        }

        return { valid: true, value: date };
    },

    /**
     * Validar objeto con schema
     */
    object(data, schema) {
        if (!data || typeof data !== 'object') {
            return { valid: false, value: {}, errors: { _general: 'Datos inválidos' } };
        }

        const result = { valid: true, value: {}, errors: {} };

        for (const [field, rules] of Object.entries(schema)) {
            const value = data[field];
            const { type, required = false, ...options } = rules;

            // Campo requerido
            if (required && (value === undefined || value === null || value === '')) {
                result.valid = false;
                result.errors[field] = 'Campo requerido';
                continue;
            }

            // Si no es requerido y está vacío, continuar
            if (!required && (value === undefined || value === null || value === '')) {
                result.value[field] = '';
                continue;
            }

            // Validar según tipo
            let validation;
            switch (type) {
                case 'string':
                    validation = this.string(value, options);
                    break;
                case 'email':
                    validation = this.email(value);
                    break;
                case 'phone':
                    validation = this.phone(value);
                    break;
                case 'number':
                    validation = this.number(value, options);
                    break;
                case 'date':
                    validation = this.date(value, options);
                    break;
                default:
                    validation = { valid: true, value };
            }

            if (!validation.valid) {
                result.valid = false;
                result.errors[field] = validation.error;
            }

            result.value[field] = validation.value;
        }

        return result;
    }
};

// Exportar globalmente
window.Sanitizer = Sanitizer;
window.DataValidator = DataValidator;

// Función de conveniencia para sanitizar HTML rápido
window.sanitizeHtml = (html) => Sanitizer.sanitizeHtml(html);
window.escapeHtml = (str) => Sanitizer.escapeHtml(str);
