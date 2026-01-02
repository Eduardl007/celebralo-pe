/* ========================================
   CELÉBRALO PE - Auth Component
   ======================================== */

class Auth {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.currentUser = null;
        this.dropdownOpen = false;

        this.init();
    }

    init() {
        if (!this.modal) return;

        // Close modal on overlay click
        const overlay = this.modal.querySelector('.modal-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Login form submission
        const loginFormElement = document.getElementById('loginFormElement');
        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form submission
        const registerFormElement = document.getElementById('registerFormElement');
        if (registerFormElement) {
            registerFormElement.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Password toggle buttons
        this.modal.querySelectorAll('.toggle-password').forEach(btn => {
            btn.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });

        // Social login buttons
        this.modal.querySelectorAll('.btn-google').forEach(btn => {
            btn.addEventListener('click', () => this.handleGoogleLogin());
        });

        this.modal.querySelectorAll('.btn-facebook').forEach(btn => {
            btn.addEventListener('click', () => this.handleFacebookLogin());
        });

        // Check for existing session
        this.checkSession();
    }

    openModal(type = 'login') {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.switchForm(type);

        // Focus first input
        setTimeout(() => {
            const firstInput = this.modal.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    switchForm(type) {
        if (type === 'login') {
            this.loginForm.classList.remove('hidden');
            this.registerForm.classList.add('hidden');
        } else {
            this.loginForm.classList.add('hidden');
            this.registerForm.classList.remove('hidden');
        }
    }

    togglePasswordVisibility(e) {
        const button = e.currentTarget;
        const input = button.parentElement.querySelector('input');
        const icon = button.querySelector('i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe').checked;

        // Validate
        if (!validators.email(email)) {
            showToast('error', 'Error', 'Por favor ingresa un correo válido');
            return;
        }

        if (!validators.minLength(password, 6)) {
            showToast('error', 'Error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // Simulate API call
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ingresando...';
        btn.disabled = true;

        try {
            // Simulate login (in real app, this would be an API call)
            await this.simulateApiCall(1500);

            // Mock user data
            this.currentUser = {
                id: 1,
                name: 'Usuario Demo',
                email: email,
                avatar: getInitials('Usuario Demo'),
                role: 'user'
            };

            // Save to storage
            if (remember) {
                storage.set('celebralope_user', this.currentUser);
            } else {
                sessionStorage.set('celebralope_user', this.currentUser);
            }

            // Registrar login en Google Sheets
            if (typeof sendToGoogleSheets === 'function') {
                sendToGoogleSheets('Logins', {
                    id: 'LOGIN-' + Date.now(),
                    contacto: email,
                    metodo: 'formulario',
                    fecha: new Date().toLocaleDateString('es-PE'),
                    hora: new Date().toLocaleTimeString('es-PE'),
                    timestamp: new Date().toISOString()
                });
            }
            if (window.analytics) {
                analytics.trackUserLogin('email');
            }

            showToast('success', '¡Bienvenido!', `Hola ${this.currentUser.name}`);
            this.closeModal();
            this.updateUIForLoggedInUser();

        } catch (error) {
            showToast('error', 'Error', 'Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async handleRegister(e) {
        e.preventDefault();

        const name = document.getElementById('registerName').value;
        const lastname = document.getElementById('registerLastname').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        // Validate
        if (!validators.required(name) || !validators.required(lastname)) {
            showToast('error', 'Error', 'Por favor completa tu nombre');
            return;
        }

        if (!validators.email(email)) {
            showToast('error', 'Error', 'Por favor ingresa un correo válido');
            return;
        }

        if (!validators.phone(phone)) {
            showToast('error', 'Error', 'Por favor ingresa un teléfono válido');
            return;
        }

        if (!validators.minLength(password, 8)) {
            showToast('error', 'Error', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }

        if (!acceptTerms) {
            showToast('error', 'Error', 'Debes aceptar los términos y condiciones');
            return;
        }

        // Simulate API call
        const btn = e.target.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
        btn.disabled = true;

        try {
            await this.simulateApiCall(2000);

            // Mock user data
            this.currentUser = {
                id: Date.now(),
                name: `${name} ${lastname}`,
                email: email,
                phone: phone,
                avatar: getInitials(`${name} ${lastname}`),
                role: 'user'
            };

            storage.set('celebralope_user', this.currentUser);

            // Registrar usuario en Google Sheets
            if (typeof sendToGoogleSheets === 'function') {
                sendToGoogleSheets('Usuarios', {
                    id: 'USR-' + Date.now(),
                    nombre: name,
                    apellido: lastname,
                    contacto: email,
                    telefono: phone,
                    tipo_registro: 'formulario',
                    estado: 'activo',
                    fecha: new Date().toLocaleDateString('es-PE'),
                    hora: new Date().toLocaleTimeString('es-PE'),
                    timestamp: new Date().toISOString()
                });
            }
            if (window.analytics) {
                analytics.trackUserRegistration('email');
            }

            showToast('success', '¡Cuenta creada!', 'Bienvenido a Celébralo pe');
            this.closeModal();
            this.updateUIForLoggedInUser();

        } catch (error) {
            showToast('error', 'Error', 'No se pudo crear la cuenta. Intenta de nuevo.');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }

    async handleGoogleLogin() {
        showToast('info', 'Google Login', 'En la versión completa, aquí se conectaría con Google OAuth');

        // Simulate login
        await this.simulateApiCall(1000);

        this.currentUser = {
            id: Date.now(),
            name: 'Usuario Google',
            email: 'usuario@gmail.com',
            avatar: 'UG',
            role: 'user'
        };

        storage.set('celebralope_user', this.currentUser);

        // Registrar en Google Sheets
        if (typeof sendToGoogleSheets === 'function') {
            sendToGoogleSheets('Logins', {
                id: 'LOGIN-' + Date.now(),
                contacto: 'usuario@gmail.com',
                metodo: 'google',
                fecha: new Date().toLocaleDateString('es-PE'),
                hora: new Date().toLocaleTimeString('es-PE'),
                timestamp: new Date().toISOString()
            });
        }
        if (window.analytics) {
            analytics.trackUserLogin('google');
        }

        showToast('success', '¡Bienvenido!', 'Sesión iniciada con Google');
        this.closeModal();
        this.updateUIForLoggedInUser();
    }

    async handleFacebookLogin() {
        showToast('info', 'Facebook Login', 'En la versión completa, aquí se conectaría con Facebook OAuth');

        // Simulate login
        await this.simulateApiCall(1000);

        this.currentUser = {
            id: Date.now(),
            name: 'Usuario Facebook',
            email: 'usuario@facebook.com',
            avatar: 'UF',
            role: 'user'
        };

        storage.set('celebralope_user', this.currentUser);

        // Registrar en Google Sheets
        if (typeof sendToGoogleSheets === 'function') {
            sendToGoogleSheets('Logins', {
                id: 'LOGIN-' + Date.now(),
                contacto: 'usuario@facebook.com',
                metodo: 'facebook',
                fecha: new Date().toLocaleDateString('es-PE'),
                hora: new Date().toLocaleTimeString('es-PE'),
                timestamp: new Date().toISOString()
            });
        }
        if (window.analytics) {
            analytics.trackUserLogin('facebook');
        }

        showToast('success', '¡Bienvenido!', 'Sesión iniciada con Facebook');
        this.closeModal();
        this.updateUIForLoggedInUser();
    }

    checkSession() {
        // Check localStorage first, then sessionStorage
        this.currentUser = storage.get('celebralope_user') || sessionStorage.get('celebralope_user');

        if (this.currentUser) {
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        // Update header buttons
        const loginBtn = document.querySelector('.nav-actions .btn-ghost');
        if (loginBtn && this.currentUser) {
            // Create user menu container
            const userMenuContainer = document.createElement('div');
            userMenuContainer.className = 'user-menu-container';
            userMenuContainer.innerHTML = `
                <button class="user-menu-trigger btn btn-ghost">
                    <div class="avatar avatar-sm" style="background: var(--primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: 600;">
                        ${this.currentUser.avatar}
                    </div>
                    <span>${this.currentUser.name.split(' ')[0]}</span>
                    <i class="fas fa-chevron-down" style="font-size: 10px; margin-left: 4px;"></i>
                </button>
                <div class="user-dropdown" id="userDropdown">
                    <div class="dropdown-header">
                        <div class="avatar" style="background: var(--primary); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                            ${this.currentUser.avatar}
                        </div>
                        <div class="dropdown-user-info">
                            <strong>${this.currentUser.name}</strong>
                            <span>${this.currentUser.email}</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="${this.getBasePath()}pages/mi-cuenta.html#mensajes" class="dropdown-item">
                        <i class="fas fa-comments"></i>
                        Mis Mensajes
                        <span class="dropdown-badge" id="msgBadge" style="display: none;">0</span>
                    </a>
                    <a href="${this.getBasePath()}pages/mi-cuenta.html#reservas" class="dropdown-item">
                        <i class="fas fa-calendar-check"></i>
                        Mis Reservas
                    </a>
                    <a href="${this.getBasePath()}pages/mi-cuenta.html#favoritos" class="dropdown-item">
                        <i class="fas fa-heart"></i>
                        Mis Favoritos
                    </a>
                    <a href="${this.getBasePath()}pages/mi-cuenta.html#datos" class="dropdown-item">
                        <i class="fas fa-user-edit"></i>
                        Mis Datos
                    </a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item dropdown-logout" id="dropdownLogout">
                        <i class="fas fa-sign-out-alt"></i>
                        Cerrar Sesion
                    </button>
                </div>
            `;

            // Replace login button
            loginBtn.parentNode.replaceChild(userMenuContainer, loginBtn);

            // Add event listeners
            const trigger = userMenuContainer.querySelector('.user-menu-trigger');
            const dropdown = userMenuContainer.querySelector('.user-dropdown');
            const logoutBtn = userMenuContainer.querySelector('#dropdownLogout');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });

            logoutBtn.addEventListener('click', () => {
                this.logout();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuContainer.contains(e.target)) {
                    dropdown.classList.remove('active');
                    this.dropdownOpen = false;
                }
            });

            // Update message badge
            this.updateMessageBadge();
        }
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '../';
        }
        return './';
    }

    toggleDropdown(dropdown) {
        this.dropdownOpen = !this.dropdownOpen;
        dropdown.classList.toggle('active', this.dropdownOpen);
    }

    updateMessageBadge() {
        if (window.userManager) {
            const unread = window.userManager.getUnreadCount();
            const badge = document.getElementById('msgBadge');
            if (badge) {
                if (unread > 0) {
                    badge.textContent = unread > 9 ? '9+' : unread;
                    badge.style.display = 'inline-block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    }

    showUserMenu() {
        // Legacy method - now handled by dropdown
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            this.toggleDropdown(dropdown);
        }
    }

    logout() {
        this.currentUser = null;
        storage.remove('celebralope_user');
        sessionStorage.set('celebralope_user', null);

        showToast('info', 'Sesión cerrada', 'Has cerrado sesión correctamente');

        // Reload page to reset UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }

    simulateApiCall(delay = 1000) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Global function to open auth modal (called from HTML)
function openAuthModal(type = 'login') {
    if (window.auth) {
        window.auth.openModal(type);
    }
}

// Global function to switch auth form (called from HTML)
function switchAuthForm(type) {
    if (window.auth) {
        window.auth.switchForm(type);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});
