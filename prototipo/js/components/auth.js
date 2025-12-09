/* ========================================
   EVENTIFY - Auth Component
   ======================================== */

class Auth {
    constructor() {
        this.modal = document.getElementById('authModal');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.currentUser = null;

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
                storage.set('eventify_user', this.currentUser);
            } else {
                sessionStorage.set('eventify_user', this.currentUser);
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

            storage.set('eventify_user', this.currentUser);

            showToast('success', '¡Cuenta creada!', 'Bienvenido a Eventify');
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

        storage.set('eventify_user', this.currentUser);
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

        storage.set('eventify_user', this.currentUser);
        showToast('success', '¡Bienvenido!', 'Sesión iniciada con Facebook');
        this.closeModal();
        this.updateUIForLoggedInUser();
    }

    checkSession() {
        // Check localStorage first, then sessionStorage
        this.currentUser = storage.get('eventify_user') || sessionStorage.get('eventify_user');

        if (this.currentUser) {
            this.updateUIForLoggedInUser();
        }
    }

    updateUIForLoggedInUser() {
        // Update header buttons
        const loginBtn = document.querySelector('.nav-actions .btn-ghost');
        if (loginBtn && this.currentUser) {
            loginBtn.innerHTML = `
                <div class="avatar avatar-sm" style="background: var(--primary);">
                    ${this.currentUser.avatar}
                </div>
                <span>${this.currentUser.name.split(' ')[0]}</span>
            `;
            loginBtn.onclick = () => this.showUserMenu();
        }
    }

    showUserMenu() {
        // In a full implementation, this would show a dropdown menu
        const confirmed = confirm(`¿Deseas cerrar sesión?\n\nUsuario: ${this.currentUser.name}`);
        if (confirmed) {
            this.logout();
        }
    }

    logout() {
        this.currentUser = null;
        storage.remove('eventify_user');
        sessionStorage.set('eventify_user', null);

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
