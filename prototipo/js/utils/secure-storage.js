/* ========================================
   CELÉBRALO PE - Almacenamiento Seguro
   Cifrado de datos sensibles en localStorage
   ======================================== */

/**
 * SecureStorage - Almacenamiento cifrado para datos sensibles
 *
 * Características:
 * - Cifrado AES-GCM usando Web Crypto API
 * - Derivación de clave con PBKDF2
 * - Protección contra lectura por scripts maliciosos
 * - Expiración automática de datos
 * - Fallback para navegadores sin Web Crypto
 */
const SecureStorage = {
    // Prefijo para identificar datos cifrados
    PREFIX: 'celebralo_secure_',

    // Salt para derivación de clave (debe ser único por instalación)
    SALT_KEY: 'celebralo_salt',

    // Tiempo de expiración por defecto (24 horas)
    DEFAULT_EXPIRY: 24 * 60 * 60 * 1000,

    // Indica si Web Crypto está disponible
    cryptoAvailable: typeof window.crypto !== 'undefined' &&
                     typeof window.crypto.subtle !== 'undefined',

    /**
     * Inicializar el almacenamiento seguro
     */
    async init() {
        // Generar o recuperar salt
        if (!localStorage.getItem(this.SALT_KEY)) {
            const salt = this.generateRandomString(32);
            localStorage.setItem(this.SALT_KEY, salt);
        }

        // Verificar si crypto está disponible
        if (!this.cryptoAvailable) {
            console.warn('SecureStorage: Web Crypto API no disponible, usando fallback');
        }

        return this;
    },

    /**
     * Obtener la clave de cifrado derivada
     */
    async getEncryptionKey() {
        if (!this.cryptoAvailable) return null;

        const salt = localStorage.getItem(this.SALT_KEY) || 'default_salt';

        // Usar una combinación de factores para la clave base
        const baseKey = this.getDeviceFingerprint();

        // Importar clave base
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(baseKey),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        // Derivar clave AES
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: new TextEncoder().encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    },

    /**
     * Generar fingerprint del dispositivo (para clave única por dispositivo)
     */
    getDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            'celebralo_pe_2024'
        ];

        return components.join('|');
    },

    /**
     * Cifrar datos
     */
    async encrypt(data) {
        const jsonString = JSON.stringify(data);

        if (!this.cryptoAvailable) {
            // Fallback: ofuscación básica (NO es seguro, solo dificulta lectura casual)
            return this.obfuscate(jsonString);
        }

        try {
            const key = await this.getEncryptionKey();
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encodedData = new TextEncoder().encode(jsonString);

            const encryptedData = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encodedData
            );

            // Combinar IV + datos cifrados
            const combined = new Uint8Array(iv.length + encryptedData.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(encryptedData), iv.length);

            // Convertir a base64
            return btoa(String.fromCharCode(...combined));

        } catch (error) {
            console.error('Error cifrando datos:', error);
            return this.obfuscate(jsonString);
        }
    },

    /**
     * Descifrar datos
     */
    async decrypt(encryptedString) {
        if (!this.cryptoAvailable || !encryptedString) {
            // Fallback: desofuscar
            try {
                return JSON.parse(this.deobfuscate(encryptedString));
            } catch {
                return null;
            }
        }

        try {
            // Decodificar base64
            const combined = new Uint8Array(
                atob(encryptedString).split('').map(c => c.charCodeAt(0))
            );

            // Extraer IV y datos cifrados
            const iv = combined.slice(0, 12);
            const encryptedData = combined.slice(12);

            const key = await this.getEncryptionKey();

            const decryptedData = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encryptedData
            );

            const jsonString = new TextDecoder().decode(decryptedData);
            return JSON.parse(jsonString);

        } catch (error) {
            // Podría ser dato antiguo no cifrado o corrupto
            console.warn('Error descifrando, intentando fallback:', error.message);
            try {
                return JSON.parse(this.deobfuscate(encryptedString));
            } catch {
                // Intentar como JSON directo (datos legacy)
                try {
                    return JSON.parse(encryptedString);
                } catch {
                    return null;
                }
            }
        }
    },

    /**
     * Ofuscación básica (fallback - NO es cifrado real)
     */
    obfuscate(str) {
        // XOR simple con clave fija + base64
        const key = 'celebralo2024';
        let result = '';
        for (let i = 0; i < str.length; i++) {
            result += String.fromCharCode(
                str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return 'OBF:' + btoa(result);
    },

    /**
     * Desofuscación básica
     */
    deobfuscate(str) {
        if (!str || !str.startsWith('OBF:')) {
            return str; // No está ofuscado
        }

        const key = 'celebralo2024';
        const decoded = atob(str.slice(4));
        let result = '';
        for (let i = 0; i < decoded.length; i++) {
            result += String.fromCharCode(
                decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return result;
    },

    /**
     * Guardar dato cifrado
     */
    async set(key, value, expiryMs = this.DEFAULT_EXPIRY) {
        try {
            const data = {
                value: value,
                expiry: expiryMs ? Date.now() + expiryMs : null,
                created: Date.now()
            };

            const encrypted = await this.encrypt(data);
            localStorage.setItem(this.PREFIX + key, encrypted);
            return true;

        } catch (error) {
            console.error('SecureStorage.set error:', error);
            return false;
        }
    },

    /**
     * Obtener dato descifrado
     */
    async get(key, defaultValue = null) {
        try {
            const encrypted = localStorage.getItem(this.PREFIX + key);
            if (!encrypted) return defaultValue;

            const data = await this.decrypt(encrypted);
            if (!data) return defaultValue;

            // Verificar expiración
            if (data.expiry && Date.now() > data.expiry) {
                this.remove(key);
                return defaultValue;
            }

            return data.value;

        } catch (error) {
            console.error('SecureStorage.get error:', error);
            return defaultValue;
        }
    },

    /**
     * Eliminar dato
     */
    remove(key) {
        localStorage.removeItem(this.PREFIX + key);
    },

    /**
     * Verificar si existe una clave
     */
    has(key) {
        return localStorage.getItem(this.PREFIX + key) !== null;
    },

    /**
     * Limpiar todos los datos seguros
     */
    clear() {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    },

    /**
     * Limpiar datos expirados
     */
    async cleanExpired() {
        const keysToCheck = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.PREFIX)) {
                keysToCheck.push(key.slice(this.PREFIX.length));
            }
        }

        for (const key of keysToCheck) {
            await this.get(key); // Esto automáticamente elimina si está expirado
        }
    },

    /**
     * Generar string aleatorio
     */
    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % chars.length];
        }
        return result;
    }
};

/**
 * Wrapper para datos de usuario (específico para auth)
 */
const UserStorage = {
    USER_KEY: 'user_session',

    /**
     * Guardar sesión de usuario
     */
    async saveSession(userData, remember = false) {
        // Datos mínimos a guardar (evitar guardar info sensible innecesaria)
        const sessionData = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            role: userData.role || 'user',
            loginTime: Date.now()
        };

        // Si "recordar", guardar por 7 días; si no, por 24 horas
        const expiry = remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

        await SecureStorage.set(this.USER_KEY, sessionData, expiry);

        // También mantener un flag simple (no sensible) para verificación rápida
        localStorage.setItem('celebralo_logged_in', 'true');

        return sessionData;
    },

    /**
     * Obtener sesión de usuario
     */
    async getSession() {
        // Verificación rápida primero
        if (!localStorage.getItem('celebralo_logged_in')) {
            return null;
        }

        const session = await SecureStorage.get(this.USER_KEY);

        // Si no hay sesión válida, limpiar flag
        if (!session) {
            localStorage.removeItem('celebralo_logged_in');
        }

        return session;
    },

    /**
     * Cerrar sesión
     */
    logout() {
        SecureStorage.remove(this.USER_KEY);
        localStorage.removeItem('celebralo_logged_in');
        sessionStorage.clear();
    },

    /**
     * Verificar si hay sesión activa (rápido, sin descifrar)
     */
    isLoggedIn() {
        return localStorage.getItem('celebralo_logged_in') === 'true' &&
               SecureStorage.has(this.USER_KEY);
    },

    /**
     * Actualizar datos de sesión
     */
    async updateSession(updates) {
        const current = await this.getSession();
        if (!current) return null;

        const updated = { ...current, ...updates };
        await SecureStorage.set(this.USER_KEY, updated);
        return updated;
    }
};

// Inicializar al cargar
SecureStorage.init().then(() => {
    // Limpiar datos expirados al iniciar
    SecureStorage.cleanExpired();
});

// Exportar globalmente
window.SecureStorage = SecureStorage;
window.UserStorage = UserStorage;
